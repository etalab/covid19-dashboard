const {Transform} = require('stream')
const stripBomStream = require('strip-bom-stream')
const getStream = require('get-stream')
const csvParse = require('csv-parser')
const {readJson, readFile} = require('fs-extra')
const got = require('got')
const Papa = require('papaparse')
const Airtable = require('airtable')

async function fetchCsv(url, options = {}) {
  const rows = await getStream.array(
    got.stream(url)
      .pipe(stripBomStream())
      .pipe(csvParse(options))
      .pipe(new Transform({
        transform(row, enc, cb) {
          if (!options.filter || options.filter(row)) {
            return cb(null, row)
          }

          cb()
        },
        objectMode: true
      }))
  )
  return rows
}

async function readCsv(filePath) {
  const file = await readFile(filePath, {encoding: 'utf8'})
  return new Promise(resolve => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
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

async function extractFromAirtable(databaseId, tabName) {
  const airtable = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(databaseId)
  const records = await airtable(tabName).select().all()

  return records.map(record => record.fields)
}

module.exports = {readCsv, loadJson, fetchJson, fetchCsv, extractFromAirtable}
