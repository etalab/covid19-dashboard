#!/usr/bin/env node
const {join} = require('path')
const got = require('got')
const {outputJson} = require('fs-extra')

const DATA_URL = 'https://raw.githubusercontent.com/opencovid19-fr/data/master/dist/chiffres-cles.json'

async function main() {
  const response = await got(DATA_URL, {responseType: 'json'})
  await outputJson(join(__dirname, 'chiffres-cles.json'), response.body, {spaces: 2})
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
