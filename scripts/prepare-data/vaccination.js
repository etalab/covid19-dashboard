/* eslint unicorn/string-content: off, camelcase: off, spaced-comment: off, capitalized-comments: off */
const {chain, keyBy} = require('lodash')
const {fetchCsv, consolidateRecords} = require('./util')
const regions = require('@etalab/decoupage-administratif/data/regions.json')
const departements = require('@etalab/decoupage-administratif/data/departements.json')

const regionsIndex = keyBy(regions, 'code')
const departementsIndex = keyBy(departements, 'code')

/* eslint unicorn/better-regex: off */
function normalizeDate(date) {
  if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return date
  }

  if (date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    return `${date.slice(6, 10)}-${date.slice(3, 5)}-${date.slice(0, 2)}`
  }

  throw new Error('Invalid date: ' + date)
}

async function fetchInjectionsFrance() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/efe23314-67c4-45d3-89a2-3faef82fae90')
  return rows.map(row => ({
    date: normalizeDate(row.jour),
    code: 'FRA',
    nom: 'France',
    source: {nom: 'Santé publique France'},
    sourceType: 'sante-publique-france',
    nouvellesPremieresInjections: Number.parseInt(row.n_dose1, 10),
    cumulPremieresInjections: Number.parseInt(row.n_cum_dose1, 10)
  }))
}

async function fetchInjectionsRegions() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/735b0df8-51b4-4dd2-8a2d-8e46d77d60d8')
  const regionsRecords = rows
    .filter(row => row.reg in regionsIndex)
    .map(row => ({
      date: normalizeDate(row.jour),
      code: `REG-${row.reg}`,
      nom: regionsIndex[row.reg].nom,
      source: {nom: 'Santé publique France'},
      sourceType: 'sante-publique-france',
      nouvellesPremieresInjections: Number.parseInt(row.n_dose1, 10),
      cumulPremieresInjections: Number.parseInt(row.n_cum_dose1, 10)
    }))

  return regionsRecords
}

async function fetchInjectionsDepartements() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/4f39ec91-80d7-4602-befb-4b522804c0af')
  const departementsRecords = rows
    .filter(row => row.dep in departementsIndex)
    .map(row => ({
      date: normalizeDate(row.jour),
      code: `DEP-${row.dep}`,
      nom: departementsIndex[row.dep].nom,
      source: {nom: 'Santé publique France'},
      sourceType: 'sante-publique-france',
      nouvellesPremieresInjections: Number.parseInt(row.n_dose1, 10),
      cumulPremieresInjections: Number.parseInt(row.n_cum_dose1, 10)
    }))

  return departementsRecords
}

function computeStockRecord(scopedRows, {code, nom}) {
  const {date} = scopedRows[0]

  const values = {
    stockNombreTotalDoses: 0
  }

  scopedRows.forEach(r => {
    const nbDoses = Number.parseInt(r.nb_doses, 10)
    values[`stockNombreDoses${r.type_de_vaccin}`] = nbDoses
    values.stockNombreTotalDoses += nbDoses
  })

  return {
    date: normalizeDate(date),
    code,
    nom,
    source: {nom: 'Ministère de la Santé'},
    sourceType: 'ministere-sante',
    ...values
  }
}

async function fetchStocksFrance() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/519e2699-27d2-47c0-840b-81dbb30d4318')

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

function computeStockEhpadRecord(scopedRows, {code, nom}) {
  const {date} = scopedRows[0]

  const values = {
    stockEhpadNombreTotalDoses: 0
  }

  scopedRows.forEach(r => {
    const nbDoses = Number.parseInt(r.nb_doses, 10)
    values[`stockEhpadNombreDoses${r.type_de_vaccin}`] = nbDoses
    values.stockEhpadNombreTotalDoses += nbDoses
  })

  return {
    date: normalizeDate(date),
    code,
    nom,
    source: {nom: 'Ministère de la Santé'},
    sourceType: 'ministere-sante',
    ...values
  }
}

async function fetchStocksEhpad() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/fde550e2-eed5-41b9-8700-631c92c11fd3')

  return chain(rows)
    .groupBy('date')
    .map(dateRows => computeStockEhpadRecord(dateRows, {
      code: 'FRA',
      nom: 'France'
    }))
    .value()
}

function computeLivraisonRecord(scopedRows, {code, nom}) {
  const date = scopedRows[0].date_fin_semaine

  const values = {
    livraisonsCumulNombreTotalDoses: 0
  }

  scopedRows.forEach(r => {
    const cumulNbDoses = Number.parseInt(r.nb_doses, 10)
    values[`livraisonsCumulNombreDoses${r.type_de_vaccin}`] = cumulNbDoses
    values.livraisonsCumulNombreTotalDoses += cumulNbDoses
  })

  return {
    date: normalizeDate(date),
    code,
    nom,
    source: {nom: 'Ministère de la Santé'},
    sourceType: 'ministere-sante',
    ...values
  }
}

async function fetchLivraisonsFrance() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/c04da7da-be58-450e-bf3e-5993ce7796d9')

  return chain(rows)
    .groupBy('date_fin_semaine')
    .map(dateRows => computeLivraisonRecord(dateRows, {
      code: 'FRA',
      nom: 'France'
    }))
    .value()
}

async function fetchLivraisonsRegions() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/1e8890a0-89c0-474f-88a1-d79414911059')

  const regionsRecords = chain(rows)
    .filter(f => f.code_region in regionsIndex)
    .groupBy(r => `${r.date}-${r.code_region}`)
    .map(scopedRows => {
      const {code_region} = scopedRows[0]
      return computeLivraisonRecord(scopedRows, {
        code: `REG-${code_region}`,
        nom: regionsIndex[code_region].nom
      })
    })
    .value()

  return [...regionsRecords, ...computeDromDepRecords(regionsRecords)]
}

function computeRdvRecord(scopedRows, {code, nom}) {
  const {date_debut_semaine} = scopedRows[0]

  const values = {
    totalPrisesRendezVousSemaine: 0
  }

  scopedRows.forEach(r => {
    const nbRdv = Number.parseInt(r.nb, 10)
    values[`prisesRendezVousSemaineRang${r.rang_vaccinal}`] = nbRdv
    values.totalPrisesRendezVousSemaine += nbRdv
  })

  return {
    date: normalizeDate(date_debut_semaine),
    code,
    nom,
    source: {nom: 'Ministère de la Santé'},
    sourceType: 'ministere-sante',
    ...values
  }
}

async function fetchRdvFrance() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/97d973f2-cb7e-417c-b610-802c4f5ce59e')

  return chain(rows)
    .groupBy('date_debut_semaine')
    .map(dateRows => computeRdvRecord(dateRows, {
      code: 'FRA',
      nom: 'France'
    }))
    .value()
}

async function fetchRdvRegions() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/3c3565e5-8e50-482d-b76a-fe07599ab4a0')

  return chain(rows)
    .filter(f => f.code_region in regionsIndex)
    .groupBy(r => `${r.date_debut_semaine}-${r.code_region}`)
    .map(scopedRows => {
      const {code_region} = scopedRows[0]
      return computeRdvRecord(scopedRows, {
        code: `REG-${code_region}`,
        nom: regionsIndex[code_region].nom
      })
    })
    .value()
}

async function fetchRdvDepartements() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/59aeab47-c364-462c-9087-ce233b6acbbc')

  return chain(rows)
    .filter(f => f.departement in departementsIndex)
    .groupBy(r => `${r.date_debut_semaine}-${r.departement}`)
    .map(scopedRows => {
      const {departement} = scopedRows[0]
      return computeRdvRecord(scopedRows, {
        code: `DEP-${departement}`,
        nom: departementsIndex[departement].nom
      })
    })
    .value()
}

function computeDromDepRecords(regionsRecords) {
  return regionsRecords
    .filter(r => r.code.startsWith('REG-0'))
    .map(r => ({...r, code: `DEP-97${r.code.slice(5)}`}))
}

async function buildVaccination(currentDate) {
  const injectionsFrance = await fetchInjectionsFrance()
  const injectionsRegions = await fetchInjectionsRegions()
  const injectionsDepartements = await fetchInjectionsDepartements()

  const stocksFrance = await fetchStocksFrance()
  const stocksRegions = await fetchStocksRegions()
  const stocksDepartements = await fetchStocksDepartements()
  const stocksEhpad = await fetchStocksEhpad()

  const livraisonsFrance = await fetchLivraisonsFrance()
  const livraisonsRegions = await fetchLivraisonsRegions()

  const rdvFrance = await fetchRdvFrance()
  const rdvRegions = await fetchRdvRegions()
  const rdvDepartements = await fetchRdvDepartements()

  return [
    ...consolidateRecords(injectionsFrance, currentDate),
    ...consolidateRecords(injectionsRegions, currentDate),
    ...consolidateRecords(injectionsDepartements, currentDate),

    ...consolidateRecords(stocksFrance, currentDate),
    ...consolidateRecords(stocksRegions, currentDate),
    ...consolidateRecords(stocksDepartements, currentDate),
    ...consolidateRecords(stocksEhpad, currentDate),

    ...consolidateRecords(livraisonsFrance, currentDate),
    ...consolidateRecords(livraisonsRegions, currentDate),

    ...consolidateRecords(rdvFrance, currentDate),
    ...consolidateRecords(rdvRegions, currentDate),
    ...consolidateRecords(rdvDepartements, currentDate)
  ]
}

module.exports = {buildVaccination}
