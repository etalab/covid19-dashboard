#!/usr/bin/env node
const {createGunzip} = require('zlib')
const {join} = require('path')
const got = require('got')
const center = require('@turf/center').default
const bbox = require('@turf/bbox').default
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

function getCenter(feature) {
  const centerFeature = center(feature)
  return centerFeature.geometry.coordinates.map(c => toPrecision(c, 3))
}

function getBbox(feature) {
  return bbox(feature).map(c => toPrecision(c, 3))
}

async function main() {
  const regionsFeatures = await getFeatures(regions)
  const departementsFeatures = await getFeatures(departements)

  const dataset = [
    {
      code: 'FRA',
      nom: 'France',
      bbox: [-5.317, 41.277, 9.689, 51.234],
      center: [-5.317, 51.234]
    },
    ...regionsFeatures.map(feature => {
      return {
        center: getCenter(feature),
        bbox: getBbox(feature),
        code: `REG-${feature.properties.code}`,
        nom: feature.properties.nom
      }
    }),
    ...departementsFeatures.map(feature => {
      return {
        center: getCenter(feature),
        bbox: getBbox(feature),
        code: `DEP-${feature.properties.code}`,
        nom: feature.properties.nom
      }
    })
  ]

  const index = dataset.reduce((acc, data) => {
    acc[data.code] = {center: data.center, bbox: data.bbox, nom: data.nom}
    return acc
  }, {})

  await outputJson(join(__dirname, '..', 'geo.json'), index)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
