#!/usr/bin/env node
/* eslint unicorn/string-content: off, camelcase: off, spaced-comment: off, capitalized-comments: off */
require('dotenv').config()
const {join} = require('path')
const Papa = require('papaparse')
const {sumBy, pick, chain, sortBy} = require('lodash')
const {replaceResourceFile} = require('./datagouv')
const {extractFromAirtable, readCsv} = require('./util')

const DATASET_ID = '5ff866dbfde012415e1085eb'

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

  await replaceResourceFile(
    DATASET_ID,
    '16cb2df5-e9c7-46ec-9dbf-c902f834dab1',
    'vaccination-regional.json',
    Buffer.from(JSON.stringify(vaccination.map(r => pick(r, 'date', 'code', 'nom', 'totalVaccines')), null, 2))
  )

  await replaceResourceFile(
    DATASET_ID,
    'eb672d49-7cc7-4114-a5a1-fa6fd147406b',
    'vaccination-regional.csv',
    Buffer.from(asCsv(vaccination))
  )

  const vaccinationFr = chain(vaccination)
    .groupBy('date')
    .map((rows, date) => {
      const totalVaccines = sumBy(rows, 'totalVaccines')
      return {date, totalVaccines}
    })
    .value()

  await replaceResourceFile(
    DATASET_ID,
    'b234a041-b5ea-4954-889b-67e64a25ce0d',
    'suivi-vaccins-covid19-national.csv',
    Buffer.from(asCsvFr(vaccinationFr))
  )

  await replaceResourceFile(
    DATASET_ID,
    'b39196f2-97c4-42f4-8dee-5eb07e823377',
    'suivi-vaccins-covid19-national.json',
    Buffer.from(JSON.stringify(asJsonFr(vaccinationFr), null, 2))
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

function asCsvFr(records) {
  return Papa.unparse(records.map(record => ({
    date: record.date,
    total_vaccines: String(record.totalVaccines)
  })), {delimiter: ';'})
}

function asJsonFr(records) {
  return records.map(record => ({
    date: record.date,
    total_vaccines: record.totalVaccines
  }))
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
