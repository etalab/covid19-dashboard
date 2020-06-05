#!/usr/bin/env node
require('dotenv').config()

const {join} = require('path')
const {createReadStream} = require('fs')
const {Transform} = require('stream')
const got = require('got')
const {outputJson, readJson, outputFile} = require('fs-extra')
const getStream = require('get-stream')
const csvParse = require('csv-parser')
const {groupBy, sortBy, defaults, pick, keyBy, chain, sumBy, uniq, deburr, trimStart, trimEnd, toLower, findIndex} = require('lodash')
const xlsx = require('node-xlsx')

const {replaceResourceFile} = require('./datagouv')

const rootPath = join(__dirname, '..')

const departements = require('@etalab/decoupage-administratif/data/departements.json')
const regions = require('@etalab/decoupage-administratif/data/regions.json')

const departementsIndex = keyBy(departements, 'code')
const regionsIndex = keyBy(regions, 'code')

const DATA_SOURCE = process.env.DATA_SOURCE || 'https://raw.githubusercontent.com/opencovid19-fr/data/master/dist/chiffres-cles.json'

const TESTS_SOURCE = 'https://www.data.gouv.fr/fr/datasets/r/b4ea7b4b-b7d1-4885-a099-71852291ff20'

const PRELEVEMENT_SOURCE = 'sites-prelevement-latest.csv'

const MASKS_SOURCE = 'masques.xlsx'

const INTERNATIONAL_CENTER = [-3.779, 45.782]

async function fetchCsv(url, options = {}) {
  const rows = await getStream.array(
    got.stream(url)
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
      }, {}), ['casConfirmes', 'deces', 'decesEhpad', 'casConfirmesEhpad', 'casPossiblesEhpad', 'reanimation', 'hospitalises', 'gueris', 'date', 'code', 'nom', 'testsRealises', 'testsPositifs', 'testsRealisesDetails', 'testsPositifsDetails', 'indicateurSynthese', 'nouvellesHospitalisations', 'nouvellesReanimations'])
  })
}

const TODAY = (new Date()).toISOString().slice(0, 10)

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

function prepareMasksData(masksSource) {
  const parseXlsx = xlsx.parse(masksSource)
  const {data} = parseXlsx[0]

  const lastIndex = findIndex(data, l => l.length === 0)
  const cleanedData = data.slice(4, lastIndex) // Remove headers and captions

  const cleanDepCode = code => {
    const trimmed = trimStart(trimEnd(code))
    return trimmed.length === 1 ? `0${trimmed}` : trimmed
  }

  const entreprises = cleanedData.map(r => {
    return {
      nom: r[0],
      commune: r[2],
      codeDepartement: r[3],
      nomRegion: r[4]
    }
  })

  const entreprisesNationales = entreprises.filter(({commune, codeDepartement}) => {
    if (commune && codeDepartement) {
      const dep = cleanDepCode(codeDepartement)
      return departements.find(({code}) => code === dep)
    }

    return false
  }).map(entreprise => {
    const dep = cleanDepCode(entreprise.codeDepartement)
    return {
      ...entreprise,
      codeDepartement: dep,
      commune: toLower(trimEnd(deburr(entreprise.commune).replace(/[\n, -]/g, ' ')))
    }
  })

  const entreprisesInternationale = entreprises.filter(({commune, codeDepartement, nomRegion}) => {
    return !codeDepartement && !nomRegion && commune
  }).map(entreprise => {
    return {...entreprise, commune: 'international'}
  })

  return [...entreprisesNationales, ...entreprisesInternationale]
}

async function loadMasks(masksSource) {
  const masksCompanies = prepareMasksData(masksSource)
  const communes = groupBy(masksCompanies, 'commune')
  const companies = await Promise.all(Object.keys(communes).map(async commune => {
    const {codeDepartement} = communes[commune][0]
    const nomCommune = communes[commune][0].commune

    if (commune === 'international') {
      return {
        nom: 'international',
        centre: {type: 'Point', coordinates: INTERNATIONAL_CENTER},
        companies: communes[commune]
      }
    }

    const url = `https://geo.api.gouv.fr/communes?nom=${nomCommune}&codeDepartement=${codeDepartement}&fields=centre,codeDepartement,codeRegion&boost=population`
    const results = await got(url, {responseType: 'json'})

    return {
      ...results.body[0],
      companies: communes[commune]
    }
  }))

  return companies
}

async function loadTests(url) {
  const csvOptions = {
    separator: ';',
    filter: row => row.jour === TODAY || row.jour < TODAY
  }

  const departementsReports = chain(await fetchCsv(url, csvOptions))
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

async function loadIndicateurs(records) {
  const dates = uniq(records.map(r => r.date))

  const inputRows = await getStream.array(
    createReadStream(join(rootPath, 'data', 'donnees_carte_synthese_tricolore.csv'))
      .pipe(csvParse())
  )
  const rows = inputRows.map(row => {
    return {
      date: row.extract_date,
      code: `DEP-${row.departement}`,
      nom: departementsIndex[row.departement].nom,
      indicateurSynthese: row.indic_synthese,
      sourceType: 'ministere-sante'
    }
  })

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
  const tests = await loadTests(TESTS_SOURCE)
  const indicateurs = await loadIndicateurs(records)
  const data = consolidate(filterRecords([...records, ...tests, ...indicateurs]))

  const prelevements = await loadPrelevements(join(rootPath, 'data', PRELEVEMENT_SOURCE))

  const dates = uniq(data.map(r => r.date)).sort()
  const codes = uniq(data.map(r => r.code))

  const latest = dates[dates.length - 1]

  const dataDirectory = join(rootPath, 'public', 'data')

  const masks = await loadMasks(MASKS_SOURCE)

  await outputJson(join(dataDirectory, 'prelevements.json'), prelevements)
  await outputJson(join(dataDirectory, 'masks.json'), [...masks])

  await Promise.all(dates.map(async date => {
    await outputJson(join(dataDirectory, `date-${date}.json`), data.filter(r => r.date === date))
  }))

  await outputJson(join(dataDirectory, 'date-latest.json'), data.filter(r => r.date === latest))

  await Promise.all(codes.map(async code => {
    await outputJson(join(dataDirectory, `code-${code}.json`), data.filter(r => r.code === code))
  }))

  const buffer = Buffer.from(
    JSON.stringify(data.find(r => r.date === latest && r.code === 'FRA'))
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
