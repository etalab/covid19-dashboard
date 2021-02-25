const stripBom = require('strip-bom-buf')
const {readJson} = require('fs-extra')
const got = require('got')
const Papa = require('papaparse')
const {chain, min, groupBy} = require('lodash')
const {eachDayOfInterval, formatISO} = require('date-fns')

async function fetchCsv(url, options = {}) {
  const response = await got(url, {responseType: 'buffer'})
  const text = stripBom(response.body).toString('utf8')

  return new Promise(resolve => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        if (options.filter) {
          return resolve(results.data.filter(r => options.filter(r)))
        }

        resolve(results.data)
      }
    })
  })
}

async function fetchJson(url) {
  const response = await got(url, {responseType: 'json'})
  return response.body
}

async function loadJson(dataSource) {
  if (dataSource.startsWith('http')) {
    return fetchJson(dataSource)
  }

  return readJson(dataSource)
}

function consolidateRecords(records, currentDate) {
  const firstDate = min(records.map(r => r.date))

  const dates = eachDayOfInterval({
    start: new Date(firstDate),
    end: new Date(currentDate)
  }).map(d => formatISO(d, {representation: 'date'}))

  let previousRecords = []

  const recordsIndex = groupBy(records, 'date')

  return chain(dates)
    .map(date => {
      const dateRecords = recordsIndex[date]

      if (dateRecords) {
        previousRecords = dateRecords
        return dateRecords
      }

      return previousRecords.map(r => ({...r, date}))
    })
    .flatten()
    .value()
}

module.exports = {loadJson, fetchJson, fetchCsv, consolidateRecords}
