#!/usr/bin/env node
require('dotenv').config()

const {join} = require('path')
const got = require('got')
const {outputJson} = require('fs-extra')
const {groupBy, sortBy, defaults, pick, uniq, findIndex, flatMap, create} =require('lodash')

const DATA_URL = 'https://raw.githubusercontent.com/opencovid19-fr/data/master/dist/chiffres-cles.json'

async function fetchJson(url) {
  const response = await got(url, {responseType: 'json'})
  return response.body
}

const SOURCE_PRIORITIES = {
  'ministere-sante': 1,
  'sante-publique-france': 2,
  'sante-publique-france-data': 3,
  'agences-regionales-sante': 4,
  prefectures: 5,
  'opencovid19-fr': 6,
  'lperez-historical-data': 7
}

function consolidate(records) {
  const territoriesGroups = groupBy(records, r => `${r.date}-${r.code}`)

  return Object.keys(territoriesGroups).map(id => {
    return pick(sortBy(territoriesGroups[id], r => SOURCE_PRIORITIES[r.sourceType])
      .reduce((acc, row) => {
        defaults(acc, row)
        return acc
      }, {}), ['casConfirmes', 'deces', 'reanimation', 'hospitalises', 'gueris', 'date', 'code', 'nom'])
  })
}

function addMissingValue(records) {
  const dates = uniq(flatMap(records, r => r.date))
  const territoriesGroups = groupBy(records, r => r.code)
  return flatMap(Object.keys(territoriesGroups).map(id => {
      var territory = territoriesGroups[id]
      var previous = {
        casConfirmes: null,
        deces: null, 
        reanimation: null,
        hospitalises: null,
        gueris: null,
        date: null,
        code: territory[0].code,
        nom: territory[0].nom
      }

      dates.forEach(date => {
        var indexFound = findIndex( territory, o => o.date == date)
        if (indexFound == -1) {
          if (previous != null) {
            var newData = previous
            newData.date = date
            indexFound = territory.push(newData)
          }
        } 
        territory[indexFound] = defaults(territory[indexFound], previous)
        previous = territory[indexFound]
      })
      territory = sortBy(territory, t => t.date)
      return territory
    })
  )
}

function filterRecords(records) {
  const {START_DATE, END_DATE, ALLOWED_SOURCES} = process.env
  const filters = []

  if (START_DATE) {
    filters.push(r => r.date >= START_DATE)
  }

  if (END_DATE) {
    filters.push(r => r.date <= END_DATE)
  }

  if (ALLOWED_SOURCES) {
    filters.push(r => ALLOWED_SOURCES.split(',').includes(r.sourceType))
  }

  return records.filter(r => filters.every(filter => filter(r)))
}

async function main() {
  const records = await fetchJson(DATA_URL)
  var data = consolidate(filterRecords(records))
  data = addMissingValue(data)
  await outputJson(join(__dirname, 'chiffres-cles.json'), data, {spaces: 2})
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
