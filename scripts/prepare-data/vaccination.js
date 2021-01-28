/* eslint unicorn/string-content: off, camelcase: off, spaced-comment: off, capitalized-comments: off */
const {chain, keyBy} = require('lodash')
const {fetchCsv} = require('./util')
const regions = require('@etalab/decoupage-administratif/data/regions.json')
const departements = require('@etalab/decoupage-administratif/data/departements.json')

const regionsIndex = keyBy(regions, 'code')
const departementsIndex = keyBy(departements, 'code')

async function fetchInjectionsFrance() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/efe23314-67c4-45d3-89a2-3faef82fae90', {separator: ';'})
  return rows.map(row => ({
    date: row.jour,
    code: 'FRA',
    nom: 'France',
    source: {nom: 'Santé publique France'},
    sourceType: 'sante-publique-france',
    nouvellesPremieresInjections: Number.parseInt(row.n_dose1, 10),
    cumulPremieresInjections: Number.parseInt(row.n_cum_dose1, 10)
  }))
}

async function fetchInjectionsRegions() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/735b0df8-51b4-4dd2-8a2d-8e46d77d60d8', {separator: ';'})
  const regions = rows
    .filter(row => row.reg in regionsIndex)
    .map(row => ({
      date: row.jour,
      code: `REG-${row.reg}`,
      nom: regionsIndex[row.reg].nom,
      source: {nom: 'Santé publique France'},
      sourceType: 'sante-publique-france',
      nouvellesPremieresInjections: Number.parseInt(row.n_dose1, 10),
      cumulPremieresInjections: Number.parseInt(row.n_cum_dose1, 10)
    }))

  const dromDep = regions
    .filter(r => r.code.startsWith('REG-0'))
    .map(r => ({...r, code: `DEP-97${r.code.slice(5)}`}))

  return [...regions, ...dromDep]
}

function computeStockRecord(scopedRows, {code, nom}) {
  const {date} = scopedRows[0]

  const values = {
    nombreTotalDoses: 0
  }

  scopedRows.forEach(r => {
    const nbDoses = Number.parseInt(r.nb_doses, 10)
    values[`nombreDoses${r.type_de_vaccin}`] = nbDoses
    values.nombreTotalDoses += nbDoses
  })

  return {
    date,
    code,
    nom,
    source: {nom: 'Ministère de la Santé'},
    sourceType: 'ministere-sante',
    ...values
  }
}

async function fetchStocksFrance() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/519e2699-27d2-47c0-840b-81dbb30d4318', {separator: ';'})

  return chain(rows)
    .groupBy('date')
    .map(dateRows => computeStockRecord(dateRows, {
      code: 'FRA',
      nom: 'France'
    }))
    .value()
}

async function fetchStocksRegions() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/62e6cf5f-0342-43f0-a1e5-6dcd06e28404')

  return chain(rows)
    .filter(f => f.code_region in regionsIndex)
    .groupBy(r => `${r.date}-${r.code_region}`)
    .map(scopedRows => {
      const {code_region} = scopedRows[0]
      return computeStockRecord(scopedRows, {
        code: `REG-${code_region}`,
        nom: regionsIndex[code_region].nom
      })
    })
    .value()
}

async function fetchStocksDepartements() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/36dd8677-1d3a-469c-a62a-cc0d79b315ee')

  return chain(rows)
    .filter(f => f.code_departement in departementsIndex)
    .groupBy(r => `${r.date}-${r.code_departement}`)
    .map(scopedRows => {
      const {code_departement} = scopedRows[0]
      return computeStockRecord(scopedRows, {
        code: `DEP-${code_departement}`,
        nom: departementsIndex[code_departement].nom
      })
    })
    .value()
}

async function buildVaccination() {
  const injectionsFrance = await fetchInjectionsFrance()
  const injectionsRegions = await fetchInjectionsRegions()

  const stocksFrance = await fetchStocksFrance()
  const stocksRegions = await fetchStocksRegions()
  const stocksDepartements = await fetchStocksDepartements()

  return [
    ...injectionsFrance,
    ...injectionsRegions,

    ...stocksFrance,
    ...stocksRegions,
    ...stocksDepartements
  ]
}

module.exports = {buildVaccination}
