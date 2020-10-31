const {Transform} = require('stream')
const stripBomStream = require('strip-bom-stream')
const getStream = require('get-stream')
const csvParse = require('csv-parser')
const {readJson} = require('fs-extra')
const got = require('got')

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

module.exports = {loadJson, fetchJson, fetchCsv}
