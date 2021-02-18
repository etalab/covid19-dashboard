const Papa = require('papaparse')
const {keyBy, chain} = require('lodash')
const got = require('got')
const departements = require('@etalab/decoupage-administratif/data/departements.json')
const regions = require('@etalab/decoupage-administratif/data/regions.json')
const {fetchCsv} = require('./util')

const departementsIndex = keyBy(departements, 'code')
const regionsIndex = keyBy(regions, 'code')

const covidHospitUrl = 'https://www.data.gouv.fr/fr/datasets/r/63352e38-d353-4b54-bfd1-f1b3ee1cabd7'
const covidHospitNouveauxUrl = 'https://www.data.gouv.fr/fr/datasets/r/6fadff46-9efd-4c53-942a-54aca783c30c'

async function getCovidHospit() {
  const csvContent = await got(covidHospitUrl, {responseType: 'text', resolveBodyOnly: true})
  return Papa.parse(csvContent, {header: true}).data
    .filter(r => r.sexe === '0' && r.dep in departementsIndex)
}

async function getCovidHospitNouveaux() {
  const csvContent = await got(covidHospitNouveauxUrl, {responseType: 'text', resolveBodyOnly: true})
  return Papa.parse(csvContent, {header: true}).data
    .filter(r => r.dep in departementsIndex)
}

function normalizeDate(date) {
  if (date.startsWith('2020-')) {
    return date
  }

  if (date.startsWith('2021-')) {
    return date
  }

  if (date.endsWith('/2020')) {
    return `2020-${date.slice(3, 5)}-${date.slice(0, 2)}`
  }

  if (date.endsWith('/2021')) {
    return `2021-${date.slice(3, 5)}-${date.slice(0, 2)}`
  }
}

function parseInteger(number) {
  return Number.parseInt(number, 10)
}

async function buildHospiSpfFrance() {
  const rows = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/f335f9ea-86e3-4ffa-9684-93c009d5e617')
  return rows
    .map(row => ({
      code: 'FRA',
      nom: 'France',
      date: row.date,
      hospitalises: parseInteger(row.hosp),
      reanimation: parseInteger(row.rea),
      nouvellesHospitalisations: parseInteger(row.incid_hosp),
      nouvellesReanimations: parseInteger(row.incid_rea),
      deces: parseInteger(row.dchosp),
      decesEhpad: parseInteger(row.esms_dc),
      casConfirmes: parseInteger(row.conf),
      // casConfirmesEhpad: parseInteger(row.esms_cas),
      gueris: parseInteger(row.rad),
      source: {nom: 'Santé publique France'},
      sourceType: 'sante-publique-france'
    }))
}

async function buildHospiSpf() {
  const covidHospitRows = await getCovidHospit()
  const covidHospitNouveauxRows = await getCovidHospitNouveaux()

  const mergedRows = chain([...covidHospitRows, ...covidHospitNouveauxRows])
    .groupBy(r => `${r.jour}-${r.dep}`)
    .map(rows => {
      return rows.length === 1 ? rows[0] : {...rows[0], ...rows[1]}
    })
    .sortBy(['jour', 'dep'])
    .value()

  const departementsData = mergedRows
    .map(r => {
      return {
        code: `DEP-${r.dep}`,
        nom: departementsIndex[r.dep].nom,
        date: normalizeDate(r.jour),
        hospitalises: Number.parseInt(r.hosp, 10),
        reanimation: Number.parseInt(r.rea, 10),
        nouvellesHospitalisations: Number.parseInt(r.incid_hosp, 10),
        nouvellesReanimations: Number.parseInt(r.incid_rea, 10),
        deces: Number.parseInt(r.dc, 10),
        gueris: Number.parseInt(r.rad, 10),
        source: {nom: 'Santé publique France'},
        sourceType: 'sante-publique-france'
      }
    })

  const regionsData = chain(mergedRows)
    .filter(r => r.sexe === '0' && r.dep in departementsIndex)
    .groupBy(r => `${r.jour}-${departementsIndex[r.dep].region}`)
    .map(regionRows => {
      const firstRow = regionRows[0]
      const region = regionsIndex[departementsIndex[firstRow.dep].region]

      return regionRows.reduce((region, row) => {
        region.hospitalises += Number.parseInt(row.hosp, 10)
        region.reanimation += Number.parseInt(row.rea, 10)
        region.nouvellesHospitalisations += Number.parseInt(row.incid_hosp, 10)
        region.nouvellesReanimations += Number.parseInt(row.incid_rea, 10)
        region.deces += Number.parseInt(row.dc, 10)
        region.gueris += Number.parseInt(row.rad, 10)

        return region
      }, {
        code: `REG-${region.code}`,
        nom: region.nom,
        date: normalizeDate(firstRow.jour),
        hospitalises: 0,
        reanimation: 0,
        nouvellesHospitalisations: 0,
        nouvellesReanimations: 0,
        deces: 0,
        gueris: 0,
        source: {nom: 'Etalab'},
        sourceType: 'etalab'
      })
    })
    .value()

  const franceData = chain(regionsData)
    .filter(r => r.date < '2020-06-01')
    .groupBy('date')
    .map(regionsRows => {
      const firstRow = regionsRows[0]

      return regionsRows.reduce((france, region) => {
        france.hospitalises += region.hospitalises
        france.reanimation += region.reanimation
        france.nouvellesHospitalisations += region.nouvellesHospitalisations
        france.nouvellesReanimations += region.nouvellesReanimations
        france.deces += region.deces
        france.gueris += region.gueris

        return france
      }, {
        code: 'FRA',
        nom: 'France',
        date: normalizeDate(firstRow.date),
        hospitalises: 0,
        reanimation: 0,
        nouvellesHospitalisations: 0,
        nouvellesReanimations: 0,
        deces: 0,
        gueris: 0,
        source: {nom: 'Etalab'},
        sourceType: 'etalab'
      })
    })
    .value()

  const newFranceData = await buildHospiSpfFrance()

  const concatRows = [...departementsData, ...regionsData, ...franceData, ...newFranceData]

  concatRows.forEach(r => {
    if (r.date === '2020-03-18') {
      r.nouvellesHospitalisations = undefined
      r.nouvellesReanimations = undefined
    }
  })

  return concatRows
}

buildHospiSpfFrance()

module.exports = {buildHospiSpf}
