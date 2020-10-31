/* eslint unicorn/string-content: off */
const {extractData} = require('../../lib/airtable')

function parseValue(string) {
  return parseInt(string.replace(/\s/g, ''), 10)
}

const valuesMap = {
  casConfirmes: 'Cas confirmés',
  deces: 'Décès à l’hôpital',
  decesEhpad: 'Décès en EHPAD et EMS',
  hospitalises: 'Hospitalisations',
  reanimation: 'En réanimation',
  gueris: 'Retours à domicile',
  casConfirmesEhpad: 'Cas confirmés EHPAD/EMS',
  nouvellesHospitalisations: 'Nouveaux patients hospitalises',
  nouvellesReanimations: 'nouveaux patients en reanimation'
}

function convertRow(row) {
  const convertedRow = {
    date: row.Date,
    code: 'FRA',
    nom: 'France',
    source: {nom: 'Ministère de la Santé'},
    sourceType: 'ministere-sante'
  }

  Object.keys(valuesMap).forEach(key => {
    if (valuesMap[key] in row && Number.isInteger(parseValue(row[valuesMap[key]]))) {
      convertedRow[key] = parseValue(row[valuesMap[key]])
    }
  })

  return convertedRow
}

async function buildHospiCc() {
  const rows = await extractData('appvqjbgBnxfnGtka', 'Onglet vue d\'ensemble')
  return rows.map(row => convertRow(row))
}

module.exports = {buildHospiCc}
