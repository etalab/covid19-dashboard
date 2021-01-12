#!/usr/bin/env node
/* eslint unicorn/string-content: off, camelcase: off, spaced-comment: off, capitalized-comments: off */
require('dotenv').config()
const {join} = require('path')
const {outputJson, outputFile} = require('fs-extra')
const Papa = require('papaparse')
const {pick, sortBy} = require('lodash')
const {extractFromAirtable, readCsv} = require('./util')

const valuesMap = {
  totalVaccines: 'Cumul de personnes vaccinées'
}

function round(number, precision) {
  return Number.parseFloat(number.toFixed(precision))
}

function convertRow(row, {populationRegions}) {
  const convertedRow = {
    date: row.Date,
    code: row.Code,
    population: populationRegions[row.Code] || undefined,
    nom: row.Nom,
    source: {nom: 'Ministère de la Santé'},
    sourceType: 'ministere-sante'
  }

  Object.keys(valuesMap).forEach(key => {
    if (valuesMap[key] in row && Number.isInteger(row[valuesMap[key]])) {
      convertedRow[key] = row[valuesMap[key]]
    }
  })

  if (convertedRow.population) {
    convertedRow.ratioVaccines = round(convertedRow.totalVaccines / convertedRow.population * 100000, 0)
  }

  return convertedRow
}

async function buildVaccination() {
  const populationRegions = await preparePopulation()
  const rows = await extractFromAirtable('appvqjbgBnxfnGtka', 'Vaccination')
  return sortBy(
    rows.map(row => convertRow(row, {populationRegions})),
    ['date', 'code']
  )
}

const rootDir = join(__dirname, '..', '..')

async function main() {
  const vaccination = await buildVaccination()
  await outputJson(
    join(rootDir, 'vaccination-regional.json'),
    vaccination.map(r => pick(r, 'date', 'code', 'nom', 'totalVaccines')),
    {spaces: 2}
  )

  await outputFile(
    join(rootDir, 'vaccination-regional.csv'),
    asCsv(vaccination)
  )
}

async function preparePopulation() {
  const rows = await readCsv(join(rootDir, 'data', 'insee-population-regions.csv'))
  const index = {}
  rows.forEach(row => {
    index[`REG-${row.CODREG}`] = Number.parseInt(row.PMUN, 10)
  })
  return index
}

function asCsv(records) {
  return Papa.unparse(records.map(record => ({
    date: record.date,
    code: record.code,
    nom: record.nom,
    // population: Number.isInteger(record.population) ? record.population : '',
    total_vaccines: String(record.totalVaccines) //,
    // ratio_vaccines: 'ratioVaccines' in record ? record.ratioVaccines.toFixed(0) : ''
  })))
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
