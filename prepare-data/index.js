#!/usr/bin/env node
require('dotenv').config()

const {join} = require('path')
const {createReadStream} = require('fs')
const {Transform} = require('stream')
const got = require('got')
const {outputJson, readJson, outputFile} = require('fs-extra')
const getStream = require('get-stream')
const csvParse = require('csv-parser')
const {groupBy, sortBy, defaults, pick, keyBy, chain, sumBy, uniq, max} = require('lodash')

const {replaceResourceFile} = require('./datagouv')

const rootPath = join(__dirname, '..')

const departements = require('@etalab/decoupage-administratif/data/departements.json')
const regions = require('@etalab/decoupage-administratif/data/regions.json')

const departementsIndex = keyBy(departements, 'code')
const regionsIndex = keyBy(regions, 'code')

const DATA_SOURCE = process.env.DATA_SOURCE || 'https://raw.githubusercontent.com/opencovid19-fr/data/master/dist/chiffres-cles.json'

const TESTS_SOURCE = 'https://www.data.gouv.fr/fr/datasets/r/b4ea7b4b-b7d1-4885-a099-71852291ff20'

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
      }, {}), ['casConfirmes', 'deces', 'decesEhpad', 'casEhpad', 'casConfirmesEhpad', 'casPossiblesEhpad', 'reanimation', 'hospitalises', 'gueris', 'date', 'code', 'nom', 'testsRealises', 'testsPositifs', 'testsRealisesDetails', 'testsPositifsDetails', 'indicateurSynthese', 'nouvellesHospitalisations', 'nouvellesReanimations'])
  })
}

const TODAY = (new Date()).toISOString().slice(0, 10)

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

  const maxDate = max(rows.map(r => r.date))
  const moreRecentDates = dates.filter(d => d > maxDate)

  const maxDateRows = rows.filter(r => r.date === maxDate)

  moreRecentDates.forEach(moreRecentDate => {
    maxDateRows.forEach(row => {
      rows.push({...row, date: moreRecentDate})
    })
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

  const dates = uniq(data.map(r => r.date)).sort()
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

  await outputJson(join(rootPath, 'dates.json'), dates)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
