const epci = require('@etalab/decoupage-administratif/data/epci.json')
const communes = require('@etalab/decoupage-administratif/data/communes.json')
const {chain, keyBy, sortBy, assign, mapKeys, snakeCase, maxBy} = require('lodash')
const Papa = require('papaparse')
const {fetchCsv} = require('./util')
const {replaceResourceFile} = require('./datagouv')
const {extractData} = require('../../lib/airtable')

const epciIndex = keyBy(epci, 'code')
const communesIndex = keyBy(communes, 'code')

function parseFloatPrecision(string, precision) {
  const number = parseFloat(string)
  const pow = 10 ** precision
  return Math.round(number * pow) / pow
}

async function buildTauxOccupationDepartements() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/5cc79ccf-3df8-4e48-a41c-28839a1498d2', {separator: ','})

  return rows.map(row => ({
    codeDepartement: row.dep,
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

async function buildCouvreFeux() {
  const inputRows = await extractData('appvqjbgBnxfnGtka', 'classement_couvre_feu')
  return inputRows.map(row => ({
    siren: row.EPCI,
    etatCouvreFeu: row.couvre_feu.trim().toLowerCase() === 'oui',
    dateEtatCouvreFeu: row.date_maj
  }))
}

function mergeRecords(records) {
  return chain(records)
    .groupBy('siren')
    .map(sirenRecords => {
      return assign({}, ...sirenRecords)
    })
    .value()
}

function getDepartementRattachement(siren) {
  const epci = epciIndex[siren]
  const membres = epci.membres.map(m => communesIndex[m.code])
  const communeCentre = maxBy(membres, 'population')
  return communeCentre.departement
}

function decorateRecords(records, tauxOccupationDepartements) {
  return records.map(record => {
    const {siren} = record
    const codeDepartement = getDepartementRattachement(siren)
    const {tauxOccupation, dateTauxOccupation} = tauxOccupationDepartements.find(to => to.codeDepartement === codeDepartement)
    return {
      nom: epciIndex[siren].nom,
      ...record,
      tauxOccupation,
      dateTauxOccupation
    }
  })
}

async function buildIndicateursTerritoires() {
  const tauxOccupationDepartements = await buildTauxOccupationDepartements()

  const rows = decorateRecords(
    mergeRecords(
      [
        ...(await buildTauxIncidence()),
        ...(await buildCouvreFeux())
      ]
    ),
    tauxOccupationDepartements
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
}

module.exports = {buildIndicateursTerritoires}
