#!/usr/bin/env node
const {createGunzip} = require('zlib')
const {join} = require('path')
const got = require('got')
const center = require('@turf/center').default
const getStream = require('get-stream')
const {outputJson} = require('fs-extra')

const regions = 'http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/latest/geojson/regions-100m.geojson.gz'
const departements = 'http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/latest/geojson/departements-100m.geojson.gz'

async function getFeatures(url) {
  const buffer = await getStream.buffer(
    got.stream(url).pipe(createGunzip())
  )

  return JSON.parse(buffer.toString()).features
}

function toPrecision(float, precision) {
  const matrix = 10 ** precision
  return Math.round(float * matrix) / matrix
}

async function main() {
  const regionsFeatures = await getFeatures(regions)
  const departementsFeatures = await getFeatures(departements)

  const centers = [
    ...regionsFeatures.map(feature => {
      const centerFeature = center(feature)
      return {
        center: centerFeature.geometry.coordinates.map(c => toPrecision(c, 3)),
        code: `REG-${feature.properties.code}`
      }
    }),
    ...departementsFeatures.map(feature => {
      const centerFeature = center(feature)
      return {
        center: centerFeature.geometry.coordinates.map(c => toPrecision(c, 3)),
        code: `DEP-${feature.properties.code}`
      }
    })
  ]

  const centersIndex = centers.reduce((acc, center) => {
    acc[center.code] = center.center
    return acc
  }, {})

  await outputJson(join(__dirname, 'centers.json'), centersIndex)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
