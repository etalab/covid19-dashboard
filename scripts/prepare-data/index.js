#!/usr/bin/env node
/* eslint camelcase: off */
require('dotenv').config()

const {join} = require('path')
const {outputJson, outputFile} = require('fs-extra')
const {groupBy, sortBy, defaults, pick, keyBy, chain, sumBy, uniq, omit} = require('lodash')
const Papa = require('papaparse')

const {fetchCsv} = require('./util')
const {replaceResourceFile} = require('./datagouv')
const {buildSitesPrelevements} = require('./sites-prelevements')
const {buildHospiSpf} = require('./donnees-hospitalieres-spf')
const {buildHospiCc} = require('./donnees-hospitalieres-cc')

const rootPath = join(__dirname, '..', '..')

const departements = require('@etalab/decoupage-administratif/data/departements.json')
const regions = require('@etalab/decoupage-administratif/data/regions.json')

const departementsIndex = keyBy(departements, 'code')
const regionsIndex = keyBy(regions, 'code')

const INDICATEURS_DEP_SOURCE = 'https://www.data.gouv.fr/fr/datasets/r/4acad602-d8b1-4516-bc71-7d5574d5f33e'
const INDICATEURS_FR_SOURCE = 'https://www.data.gouv.fr/fr/datasets/r/d86f11b0-0a62-41c1-bf6e-dc9a408cf7b5'

const hasIndicatorValue = (departements, indicateur) => {
  const indicateurs = departements.map(departement => departement[indicateur])
  const indicateursWithValue = indicateurs.filter(i => !isNaN(i))

  return indicateursWithValue.length > 0 ? true : null
}

const SOURCE_PRIORITIES = {
  'ministere-sante': 1,
  'sante-publique-france': 2,
  etalab: 3
}

function consolidate(records) {
  const territoriesGroups = groupBy(records, r => `${r.date}-${r.code}`)

  return Object.keys(territoriesGroups).map(id => {
    return pick(sortBy(territoriesGroups[id], r => SOURCE_PRIORITIES[r.sourceType])
      .reduce((acc, row) => {
        defaults(acc, row)
        return acc
      }, {}), ['casConfirmes', 'deces', 'decesEhpad', 'casConfirmesEhpad', 'casPossiblesEhpad', 'reanimation', 'hospitalises', 'gueris', 'date', 'code', 'nom', 'testsRealises', 'testsPositifs', 'testsRealisesDetails', 'testsPositifsDetails', 'nouvellesHospitalisations', 'nouvellesReanimations', 'tauxIncidence', 'tauxIncidenceColor', 'tauxReproductionEffectif', 'tauxReproductionEffectifColor', 'tauxOccupationRea', 'tauxOccupationReaColor', 'tauxPositiviteTests', 'tauxPositiviteTestsColor'])
  })
}

const TODAY = (new Date()).toISOString().slice(0, 10)

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

function parseIndicator(value) {
  if (value !== 'NA') {
    return Number.parseFloat(value)
  }
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
        tauxIncidence: parseIndicator(row.tx_incid),
        tauxIncidenceColor: row.tx_incid_couleur,
        tauxReproductionEffectif: parseIndicator(row.R),
        tauxReproductionEffectifColor: row.R_couleur,
        tauxOccupationRea: parseIndicator(row.taux_occupation_sae),
        tauxOccupationReaColor: row.taux_occupation_sae_couleur,
        tauxPositiviteTests: parseIndicator(row.tx_pos),
        tauxPositiviteTestsColor: row.tx_pos_couleur,
        sourceType: 'ministere-sante'
      }
    }).value()

  /*
    Les données concernant les indicateurs à la maille régionale ne sont pas disponibles.
    Le rapport doit cependant contenir une valeur différent de `null` pour chaque taux
    si au moins un des départements de la région dispose d’une valeur pour ces taux.
    Ceci afin que les données ne soient pas filtrées par la méthode `findMostRecentDateForData` et permettre l’affichage des données départemental.
  */
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
        tauxIncidence: hasIndicatorValue(regionRows, 'tauxIncidence'),
        tauxReproductionEffectif: hasIndicatorValue(regionRows, 'tauxReproductionEffectif'),
        tauxOccupationRea: hasIndicatorValue(regionRows, 'tauxOccupationRea'),
        tauxPositiviteTests: hasIndicatorValue(regionRows, 'tauxPositiviteTests'),
        sourceType: 'sante-publique-france'
      }
    }).value()

  const franceReports = chain(await fetchCsv(franceUrl, csvOptions))
    .map(row => {
      return {
        date: row.extract_date,
        code: 'FRA',
        tauxIncidence: parseIndicator(row.tx_incid),
        tauxReproductionEffectif: parseIndicator(row.R),
        tauxOccupationRea: parseIndicator(row.taux_occupation_sae),
        tauxPositiviteTests: parseIndicator(row.tx_pos),
        sourceType: 'ministere-sante'
      }
    }).value()

  return [...franceReports, ...regionsReports, ...departementsReports]
}

function filterRecords(records) {
  const {START_DATE, END_DATE} = process.env
  const filters = []

  if (START_DATE) {
    filters.push(r => r.date >= START_DATE)
  }

  if (END_DATE) {
    filters.push(r => r.date <= END_DATE)
  }

  return records.filter(r => filters.every(filter => filter(r)))
}

async function loadContribData() {
  return require('../../data/contrib-data.json')
}

async function main() {
  const contribData = await loadContribData()
  const hospiSpf = await buildHospiSpf()
  const hospiCc = await buildHospiCc()
  const troisLabosTests = await loadTroisLabosTests()
  const sidepTests = await loadSidepTest()
  const indicateurs = await loadIndicateurs(INDICATEURS_DEP_SOURCE, INDICATEURS_FR_SOURCE)
  const data = consolidate(filterRecords([...contribData, ...hospiSpf, ...hospiCc, ...troisLabosTests, ...sidepTests, ...indicateurs]))

  const dates = uniq(data.filter(r => r.code === 'FRA' && r.deces).map(r => r.date)).sort()
  const codes = uniq(data.map(r => r.code))

  const latest = dates[dates.length - 1]

  const dataDirectory = join(rootPath, 'public', 'data')

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

  /* Données nationales - onglet Synthèse */

  const frDataJson = Buffer.from(
    JSON.stringify(data.filter(r => r.code === 'FRA').map(r => omit(r, 'testsRealisesDetails', 'testsPositifsDetails', 'code', 'nom', 'tauxIncidence', 'tauxReproductionEffectif', 'tauxOccupationRea', 'tauxPositiviteTests')), null, 2)
  )

  if (process.env.DATAGOUV_PUBLISH === '1' || process.env.CONTEXT === 'production') {
    await replaceResourceFile('5f69ecb155c43420918410b8', 'd2671c6c-c0eb-4e12-b69a-8e8f87fc224c', 'synthese-fra.json', frDataJson)
  }

  const frDataCsv = Buffer.from(
    Papa.unparse(data.filter(r => r.code === 'FRA').map(r => ({
      date: r.date,
      total_cas_confirmes: 'casConfirmes' in r ? r.casConfirmes : '',
      total_deces_hopital: 'deces' in r ? r.deces : '',
      total_deces_ehpad: 'decesEhpad' in r ? r.decesEhpad : '',
      total_cas_confirmes_ehpad: 'casConfirmesEhpad' in r ? r.casConfirmesEhpad : '',
      total_cas_possibles_ehpad: 'casPossiblesEhpad' in r ? r.casPossiblesEhpad : '',
      patients_reanimation: 'reanimation' in r ? r.reanimation : '',
      patients_hospitalises: 'hospitalises' in r ? r.hospitalises : '',
      total_patients_gueris: 'gueris' in r ? r.gueris : '',
      nouveaux_patients_hospitalises: 'nouvellesHospitalisations' in r ? r.nouvellesHospitalisations : '',
      nouveaux_patients_reanimation: 'nouvellesReanimations' in r ? r.nouvellesReanimations : ''
    })))
  )

  if (process.env.DATAGOUV_PUBLISH === '1' || process.env.CONTEXT === 'production') {
    await replaceResourceFile('5f69ecb155c43420918410b8', 'd3a98a30-893f-47f7-96c5-2f4bcaaa0d71', 'synthese-fra.csv', frDataCsv)
  }

  await outputJson(join(rootPath, 'dates.json'), dates)

  await buildSitesPrelevements(dataDirectory)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
