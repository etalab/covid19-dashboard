#!/usr/bin/env node
require('dotenv').config()

const {join} = require('path')
const {createReadStream} = require('fs')
const stripBomStream = require('strip-bom-stream')
const {Transform} = require('stream')
const got = require('got')
const {outputJson, readJson, outputFile} = require('fs-extra')
const getStream = require('get-stream')
const csvParse = require('csv-parser')
const {groupBy, sortBy, defaults, pick, keyBy, chain, sumBy, uniq} = require('lodash')

const {extractData} = require('../lib/airtable')

const {replaceResourceFile} = require('./datagouv')

const rootPath = join(__dirname, '..')

const departements = require('@etalab/decoupage-administratif/data/departements.json')
const regions = require('@etalab/decoupage-administratif/data/regions.json')

const departementsIndex = keyBy(departements, 'code')
const regionsIndex = keyBy(regions, 'code')

const DATA_SOURCE = process.env.DATA_SOURCE || 'https://raw.githubusercontent.com/opencovid19-fr/data/master/dist/chiffres-cles.json'

const INDICATEURS_DEP_SOURCE = 'https://www.data.gouv.fr/fr/datasets/r/4acad602-d8b1-4516-bc71-7d5574d5f33e'
const INDICATEURS_FR_SOURCE = 'https://www.data.gouv.fr/fr/datasets/r/d86f11b0-0a62-41c1-bf6e-dc9a408cf7b5'

const PRELEVEMENT_SOURCE = 'sites-prelevement-latest.csv'

async function fetchCsv(url, options = {}) {
  const rows = await getStream.array(
    got.stream(url)
      .pipe(stripBomStream())
      .pipe(csvParse(options))
      .pipe(new Transform({
        transform(row, enc, cb) {
          if (!options.filter || options.filter(row)) {
            return cb(null, row)
          }

          cb()
        },
        objectMode: true
      }))
  )
  return rows
}

async function fetchJson(url) {
  const response = await got(url, {responseType: 'json'})
  return response.body
}

async function loadJson(dataSource) {
  if (dataSource.startsWith('http')) {
    return fetchJson(dataSource)
  }

  return readJson(dataSource)
}

const SOURCE_PRIORITIES = {
  'ministere-sante': 1,
  'sante-publique-france': 2,
  'sante-publique-france-data': 3,
  'agences-regionales-sante': 4,
  prefectures: 5,
  'opencovid19-fr': 6,
  'lperez-historical-data': 7
}

function consolidate(records) {
  const territoriesGroups = groupBy(records, r => `${r.date}-${r.code}`)

  return Object.keys(territoriesGroups).map(id => {
    return pick(sortBy(territoriesGroups[id], r => SOURCE_PRIORITIES[r.sourceType])
      .reduce((acc, row) => {
        defaults(acc, row)
        return acc
      }, {}), ['casConfirmes', 'deces', 'decesEhpad', 'casConfirmesEhpad', 'casPossiblesEhpad', 'reanimation', 'hospitalises', 'gueris', 'date', 'code', 'nom', 'testsRealises', 'testsPositifs', 'testsRealisesDetails', 'testsPositifsDetails', 'indicateurSynthese', 'nouvellesHospitalisations', 'nouvellesReanimations', 'tauxIncidence', 'tauxIncidenceColor', 'tauxReproductionEffectif', 'tauxReproductionEffectifColor', 'tauxOccupationRea', 'tauxOccupationReaColor', 'tauxPositiviteTests', 'tauxPositiviteTestsColor'])
  })
}

const TODAY = (new Date()).toISOString().slice(0, 10)

function fillEmptyDates(records, rows) {
  const dates = uniq(records.map(r => r.date))
  const index = groupBy(rows, 'date')
  let lastNotEmptyDate

  dates.forEach(date => {
    if (date in index) {
      lastNotEmptyDate = date
    } else if (lastNotEmptyDate) {
      index[lastNotEmptyDate].forEach(row => {
        rows.push({...row, date})
      })
    }
  })

  return rows
}

async function loadPrelevements(file) {
  const inputRows = await getStream.array(
    createReadStream(file)
      .pipe(csvParse())
  )

  const rows = inputRows.map(row => {
    const {ID, rs, longitude, latitude} = row
    return {
      type: 'Feature',
      id: ID,
      properties: {
        ...row,
        id: ID,
        name: rs,
        complementAdresse: row.cpl_loc,
        modePrelevement: row.mod_prel.split('/'),
        capacitePrelevement: row.capa_prel,
        audience: row.public,
        isPublic: row.public.includes('Tout public'),
        appointment: row.check_rdv,
        appointmentOnly: row.check_rdv === 'Sur rendez-vous uniquement',
        tel: row.tel_rdv,
        mail: row.web_rdv
      },
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    }
  })

  return {
    type: 'FeatureCollection',
    features: rows
  }
}

async function loadSidepTest() {
  const SIDEP_DEP_DATA = 'https://www.data.gouv.fr/fr/datasets/r/406c6a23-e283-4300-9484-54e78c8ae675'
  const SIDEP_REG_DATA = 'https://www.data.gouv.fr/fr/datasets/r/001aca18-df6a-45c8-89e6-f82d689e6c01'
  const SIDEP_FRA_DATA = 'https://www.data.gouv.fr/fr/datasets/r/dd0de5d9-b5a5-4503-930a-7b08dc0adc7c'

  const csvOptions = {
    separator: ';'
  }

  const departementsReports = chain(await fetchCsv(SIDEP_DEP_DATA, csvOptions))
    .filter(r => r.dep in departementsIndex)
    .groupBy(r => `${r.jour}-${r.dep}`)
    .map(rows => {
      const report = {
        date: rows[0].jour,
        code: `DEP-${rows[0].dep}`,
        nom: departementsIndex[rows[0].dep].nom,
        testsRealises: sumBy(rows.filter(r => r.cl_age90 === '0'), r => Number.parseInt(r.T, 10)),
        testsRealisesDetails: [],
        testsPositifs: sumBy(rows.filter(r => r.cl_age90 === '0'), r => Number.parseInt(r.P, 10)),
        testsPositifsDetails: [],
        sourceType: 'sante-publique-france'
      }

      rows.forEach(r => {
        report.testsRealisesDetails.push({age: r.cl_age90, sexe: '0', value: Number.parseInt(r.T, 10)})
        report.testsPositifsDetails.push({age: r.cl_age90, sexe: '0', value: Number.parseInt(r.P, 10)})
      })

      return report
    })
    .filter(r => r.testsRealises > 0 || r.testsPositifs > 0)
    .value()

  const regionsReports = chain(await fetchCsv(SIDEP_REG_DATA, csvOptions))
    .filter(r => r.reg.padStart(2, '0') in regionsIndex)
    .groupBy(r => `${r.jour}-${r.reg}`)
    .map(rows => {
      const regCode = rows[0].reg.padStart(2, '0')
      const report = {
        date: rows[0].jour,
        code: `REG-${regCode}`,
        nom: regionsIndex[regCode].nom,
        testsRealises: sumBy(rows.filter(r => r.cl_age90 === '0'), r => Number.parseInt(r.T, 10)),
        testsRealisesDetails: [],
        testsPositifs: sumBy(rows.filter(r => r.cl_age90 === '0'), r => Number.parseInt(r.P, 10)),
        testsPositifsDetails: [],
        sourceType: 'sante-publique-france'
      }

      rows.forEach(r => {
        report.testsRealisesDetails.push({age: r.cl_age90, sexe: '0', value: Number.parseInt(r.T, 10)})
        report.testsRealisesDetails.push({age: r.cl_age90, sexe: 'h', value: Number.parseInt(r.T_h, 10)})
        report.testsRealisesDetails.push({age: r.cl_age90, sexe: 'f', value: Number.parseInt(r.T_f, 10)})
        report.testsPositifsDetails.push({age: r.cl_age90, sexe: '0', value: Number.parseInt(r.P, 10)})
        report.testsPositifsDetails.push({age: r.cl_age90, sexe: 'h', value: Number.parseInt(r.P_h, 10)})
        report.testsPositifsDetails.push({age: r.cl_age90, sexe: 'f', value: Number.parseInt(r.P_f, 10)})
      })

      return report
    })
    .filter(r => r.testsRealises > 0 || r.testsPositifs > 0)
    .value()

  const franceReports = chain(await fetchCsv(SIDEP_FRA_DATA, csvOptions))
    .groupBy(r => r.jour)
    .map(rows => {
      const report = {
        date: rows[0].jour,
        code: 'FRA',
        nom: 'France',
        testsRealises: sumBy(rows.filter(r => r.cl_age90 === '0'), r => Number.parseInt(r.T, 10)),
        testsRealisesDetails: [],
        testsPositifs: sumBy(rows.filter(r => r.cl_age90 === '0'), r => Number.parseInt(r.P, 10)),
        testsPositifsDetails: [],
        sourceType: 'sante-publique-france'
      }

      rows.forEach(r => {
        report.testsRealisesDetails.push({age: r.cl_age90, sexe: '0', value: Number.parseInt(r.T, 10)})
        report.testsRealisesDetails.push({age: r.cl_age90, sexe: 'h', value: Number.parseInt(r.T_h, 10)})
        report.testsRealisesDetails.push({age: r.cl_age90, sexe: 'f', value: Number.parseInt(r.T_f, 10)})
        report.testsPositifsDetails.push({age: r.cl_age90, sexe: '0', value: Number.parseInt(r.P, 10)})
        report.testsPositifsDetails.push({age: r.cl_age90, sexe: 'h', value: Number.parseInt(r.P_h, 10)})
        report.testsPositifsDetails.push({age: r.cl_age90, sexe: 'f', value: Number.parseInt(r.P_f, 10)})
      })

      return report
    })
    .filter(r => r.testsRealises > 0 || r.testsPositifs > 0)
    .value()

  return [...departementsReports, ...regionsReports, ...franceReports]
}

async function loadTroisLabosTests() {
  const TROISLABOS_TESTS_DATA = 'https://www.data.gouv.fr/fr/datasets/r/b4ea7b4b-b7d1-4885-a099-71852291ff20'

  const csvOptions = {
    separator: ';',
    filter: row => row.jour < '2020-05-13'
  }

  const departementsReports = chain(await fetchCsv(TROISLABOS_TESTS_DATA, csvOptions))
    .groupBy(r => `${r.jour}-${r.dep}`)
    .map(rows => {
      const report = {
        date: rows[0].jour,
        code: `DEP-${rows[0].dep}`,
        nom: departementsIndex[rows[0].dep].nom,
        testsRealises: sumBy(rows.filter(r => r.clage_covid === '0'), r => Number.parseInt(r.nb_test, 10)),
        testsRealisesDetails: [],
        testsPositifs: sumBy(rows.filter(r => r.clage_covid === '0'), r => Number.parseInt(r.nb_pos, 10)),
        testsPositifsDetails: [],
        sourceType: 'sante-publique-france'
      }

      rows.forEach(r => {
        report.testsRealisesDetails.push({age: r.clage_covid, sexe: '0', value: Number.parseInt(r.nb_test, 10)})
        report.testsRealisesDetails.push({age: r.clage_covid, sexe: 'h', value: Number.parseInt(r.nb_test_h, 10)})
        report.testsRealisesDetails.push({age: r.clage_covid, sexe: 'f', value: Number.parseInt(r.nb_test_f, 10)})
        report.testsPositifsDetails.push({age: r.clage_covid, sexe: '0', value: Number.parseInt(r.nb_pos, 10)})
        report.testsPositifsDetails.push({age: r.clage_covid, sexe: 'h', value: Number.parseInt(r.nb_pos_h, 10)})
        report.testsPositifsDetails.push({age: r.clage_covid, sexe: 'f', value: Number.parseInt(r.nb_pos_f, 10)})
      })

      return report
    })
    .filter(r => r.testsRealises > 0 || r.testsPositifs > 0)
    .value()

  const regionsReports = chain(departementsReports)
    .filter(r => r.code.slice(4) in departementsIndex)
    .groupBy(r => `${r.date}-${departementsIndex[r.code.slice(4)].region}`)
    .map(regionRows => {
      const firstRow = regionRows[0]
      const region = regionsIndex[departementsIndex[firstRow.code.slice(4)].region]
      return {
        date: firstRow.date,
        code: `REG-${region.code}`,
        nom: region.nom,
        testsRealises: sumBy(regionRows, 'testsRealises'),
        testsRealisesDetails: firstRow.testsRealisesDetails.map(({age, sexe}) => {
          return {
            age,
            sexe,
            value: sumBy(regionRows, r => r.testsRealisesDetails.find(entry => entry.age === age && entry.sexe === sexe).value)
          }
        }),
        testsPositifs: sumBy(regionRows, 'testsPositifs'),
        testsPositifsDetails: firstRow.testsPositifsDetails.map(({age, sexe}) => {
          return {
            age,
            sexe,
            value: sumBy(regionRows, r => r.testsPositifsDetails.find(entry => entry.age === age && entry.sexe === sexe).value)
          }
        }),
        sourceType: 'sante-publique-france'
      }
    })

  const franceReports = chain(departementsReports)
    .groupBy('date')
    .map(rows => {
      const firstRow = rows[0]
      return {
        date: firstRow.date,
        code: 'FRA',
        nom: 'France',
        testsRealises: sumBy(rows, 'testsRealises'),
        testsRealisesDetails: firstRow.testsRealisesDetails.map(({age, sexe}) => {
          return {
            age,
            sexe,
            value: sumBy(rows, r => r.testsRealisesDetails.find(entry => entry.age === age && entry.sexe === sexe).value)
          }
        }),
        testsPositifs: sumBy(rows, 'testsPositifs'),
        testsPositifsDetails: firstRow.testsPositifsDetails.map(({age, sexe}) => {
          return {
            age,
            sexe,
            value: sumBy(rows, r => r.testsPositifsDetails.find(entry => entry.age === age && entry.sexe === sexe).value)
          }
        }),
        sourceType: 'sante-publique-france'
      }
    })

  return [...departementsReports, ...regionsReports, ...franceReports]
}

async function loadIndicateursSynthese(records) {
  const inputRows = await extractData('appvqjbgBnxfnGtka', 'Activité épidémique')

  const rows = inputRows.map(row => {
    const codeDepartement = row.departement.length === 1 ? `0${row.departement}` : row.departement
    return {
      date: row.extract_date,
      code: `DEP-${codeDepartement}`,
      nom: departementsIndex[codeDepartement].nom,
      indicateurSynthese: row.indic_synthese,
      sourceType: 'ministere-sante'
    }
  })

  return fillEmptyDates(records, rows)
}

async function loadIndicateurs(depUrl, franceUrl) {
  const csvOptions = {
    filter: row => row.extract_date === TODAY || row.extract_date < TODAY
  }

  const departementsReports = chain(await fetchCsv(depUrl, csvOptions))
    .map(row => {
      return {
        date: row.extract_date,
        code: `DEP-${row.departement}`,
        tauxIncidence: Number.parseFloat(row.tx_incid),
        tauxIncidenceColor: row.tx_incid_couleur,
        tauxReproductionEffectif: Number.parseFloat(row.R),
        tauxReproductionEffectifColor: row.R_couleur,
        tauxOccupationRea: Number.parseFloat(row.taux_occupation_sae),
        tauxOccupationReaColor: row.taux_occupation_sae_couleur,
        tauxPositiviteTests: Number.parseFloat(row.tx_pos),
        tauxPositiviteTestsColor: row.tx_pos_couleur,
        sourceType: 'ministere-sante'
      }
    }).value()

  const franceReports = chain(await fetchCsv(franceUrl, csvOptions))
    .map(row => {
      return {
        date: row.extract_date,
        code: 'FRA',
        tauxIncidence: Number.parseFloat(row.tx_incid),
        tauxReproductionEffectif: Number.parseFloat(row.R),
        tauxOccupationRea: Number.parseFloat(row.taux_occupation_sae),
        tauxPositiviteTests: Number.parseFloat(row.tx_pos),
        sourceType: 'ministere-sante'
      }
    }).value()

  return [...franceReports, ...departementsReports]
}

function filterRecords(records) {
  const {START_DATE, END_DATE, ALLOWED_SOURCES} = process.env
  const filters = []

  if (START_DATE) {
    filters.push(r => r.date >= START_DATE)
  }

  if (END_DATE) {
    filters.push(r => r.date <= END_DATE)
  }

  if (ALLOWED_SOURCES) {
    filters.push(r => ALLOWED_SOURCES.split(',').includes(r.sourceType))
  }

  return records.filter(r => filters.every(filter => filter(r)))
}

async function main() {
  const records = await loadJson(DATA_SOURCE)
  const troisLabosTests = await loadTroisLabosTests()
  const sidepTests = await loadSidepTest()
  const indicateursSynthese = await loadIndicateursSynthese(records)
  const indicateurs = await loadIndicateurs(INDICATEURS_DEP_SOURCE, INDICATEURS_FR_SOURCE)
  const data = consolidate(filterRecords([...records, ...troisLabosTests, ...sidepTests, ...indicateursSynthese, ...indicateurs]))

  const prelevements = await loadPrelevements(join(rootPath, 'data', PRELEVEMENT_SOURCE))

  const dates = uniq(data.map(r => r.date)).sort()
  const datesFR = uniq(data.filter(r => r.code === 'FRA').map(r => r.date)).sort()
  const codes = uniq(data.map(r => r.code))

  const latest = dates[dates.length - 1]
  const latestFR = datesFR[dates.length - 1]

  const dataDirectory = join(rootPath, 'public', 'data')

  await outputJson(join(dataDirectory, 'prelevements.json'), prelevements)

  await Promise.all(dates.map(async date => {
    await outputJson(join(dataDirectory, `date-${date}.json`), data.filter(r => r.date === date))
  }))

  await outputJson(join(dataDirectory, 'date-latest.json'), data.filter(r => r.date === latest))

  await Promise.all(codes.map(async code => {
    await outputJson(join(dataDirectory, `code-${code}.json`), data.filter(r => r.code === code))
  }))

  const buffer = Buffer.from(
    JSON.stringify(data.find(r => r.date === latestFR && r.code === 'FRA'))
  )
  await outputFile(join(dataDirectory, 'fra-latest.json'), buffer)

  if (process.env.DATAGOUV_PUBLISH === '1' || process.env.CONTEXT === 'production') {
    await replaceResourceFile('5eb55e49899a159c2e0053c2', 'e13851d0-0228-4252-91b9-cf091a0452a4', 'fra-latest.json', buffer)
  }

  await outputJson(join(rootPath, 'dates.json'), dates)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
