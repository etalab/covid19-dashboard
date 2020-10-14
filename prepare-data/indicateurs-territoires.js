const epci = require('@etalab/decoupage-administratif/data/epci.json')
const {chain, keyBy, sortBy, assign, mapKeys, snakeCase} = require('lodash')
const Papa = require('papaparse')
const {outputFile} = require('fs-extra')
const {fetchCsv} = require('./util')
const {replaceResourceFile} = require('./datagouv')

const epciIndex = keyBy(epci, 'code')

function parseFloatPrecision(string, precision) {
  const number = parseFloat(string)
  const pow = 10 ** precision
  return Math.round(number * pow) / pow
}

async function buildTauxOccupation() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/62ec32ae-6b3e-4e4a-b81f-eeb4e8759a4d', {separator: ','})

  return rows.map(row => ({
    siren: row.epci,
    tauxOccupation: parseFloatPrecision(row.to, 1),
    dateTauxOccupation: row.date
  }))
}

async function buildTauxIncidence() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/61533034-0f2f-4b16-9a6d-28ffabb33a02', {separator: ';'})

  return chain(rows)
    .groupBy('epci2020')
    .map(epciRows => {
      const derniereDate = sortBy(epciRows, 'semaine_glissante').pop().semaine_glissante
      const tauxIncidence = parseFloatPrecision(
        epciRows
          .find(r => r.semaine_glissante === derniereDate && r.clage_65 === '0')
          .ti,
        1
      )
      const tauxIncidence65 = parseFloatPrecision(
        epciRows
          .find(r => r.semaine_glissante === derniereDate && r.clage_65 === '65')
          .ti,
        1
      )
      const date = derniereDate.slice(11)

      return {
        siren: epciRows[0].epci2020,
        tauxIncidence,
        dateTauxIncidence: date,
        tauxIncidence65,
        dateTauxIncidence65: date
      }
    })
    .value()
}

function mergeRecords(records) {
  return chain(records)
    .groupBy('siren')
    .map(sirenRecords => {
      return assign({}, ...sirenRecords)
    })
    .value()
}

function decorateRecords(records) {
  return records.map(record => {
    const {siren} = record
    return {
      nom: epciIndex[siren].nom,
      ...record
    }
  })
}

async function buildIndicateursTerritoires() {
  const rows = decorateRecords(
    mergeRecords([
      ...(await buildTauxOccupation()),
      ...(await buildTauxIncidence())
    ])
  )

  const jsonFile = Buffer.from(
    JSON.stringify(rows, null, 2)
  )

  if (process.env.DATAGOUV_PUBLISH === '1' || process.env.CONTEXT === 'production') {
    await replaceResourceFile('5f86e6e7ae50b079c80a964c', '3a908e66-2d33-4cb8-8ce1-66a7a46950a4', 'indicateurs-territoires.json', jsonFile)
  }

  const csvFile = Buffer.from(
    Papa.unparse(rows.map(row => mapKeys(row, (v, k) => snakeCase(k))))
  )

  if (process.env.DATAGOUV_PUBLISH === '1' || process.env.CONTEXT === 'production') {
    await replaceResourceFile('5f86e6e7ae50b079c80a964c', 'bdb43ecc-6e99-4f53-ad22-3903b84661de', 'indicateurs-territoires.csv', csvFile)
  }

  await outputFile('indicateurs.csv', csvFile)
}

module.exports = {buildIndicateursTerritoires}
