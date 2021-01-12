#!/usr/bin/env node
/* eslint unicorn/string-content: off, camelcase: off */
require('dotenv').config()
const {join} = require('path')
const {outputJson, outputFile} = require('fs-extra')
const Papa = require('papaparse')
const {pick} = require('lodash')
const {extractFromAirtable} = require('./util')

const valuesMap = {
  totalVaccines: 'Cumul de personnes vaccinées'
}

function convertRow(row) {
  const convertedRow = {
    date: row.Date,
    code: row.Code,
    nom: row.Nom,
    source: {nom: 'Ministère de la Santé'},
    sourceType: 'ministere-sante'
  }

  Object.keys(valuesMap).forEach(key => {
    if (valuesMap[key] in row && Number.isInteger(row[valuesMap[key]])) {
      convertedRow[key] = row[valuesMap[key]]
    }
  })

  return convertedRow
}

async function buildVaccination() {
  const rows = await extractFromAirtable('appvqjbgBnxfnGtka', 'Vaccination')
  return rows.map(row => convertRow(row))
}

const rootDir = join(__dirname, '..', '..')

async function main() {
  const vaccination = await buildVaccination()
  await outputJson(
    join(rootDir, 'vaccination.json'),
    vaccination.map(r => pick(r, 'date', 'code', 'nom', 'totalVaccines')),
    {spaces: 2}
  )

  await outputFile(
    join(rootDir, 'vaccination.csv'),
    asCsv(vaccination)
  )
}

function asCsv(records) {
  return Papa.unparse(records.map(record => ({
    date: record.date,
    code: record.code,
    nom: record.nom,
    total_vaccines: String(record.totalVaccines)
  })))
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
