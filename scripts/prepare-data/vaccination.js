/* eslint unicorn/string-content: off, camelcase: off, spaced-comment: off, capitalized-comments: off */
const {keyBy} = require('lodash')
const {fetchCsv} = require('./util')
const regions = require('@etalab/decoupage-administratif/data/regions.json')

const regionsIndex = keyBy(regions, 'code')

async function fetchFrance() {
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

async function fetchRegions() {
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

async function buildVaccination() {
  const france = await fetchFrance()
  const regions = await fetchRegions()
  return [...france, ...regions]
}

module.exports = {buildVaccination}
