const {join} = require('path')
const {outputJson} = require('fs-extra')
const {fetchCsv} = require('./util')

function prepareSitePrelevementFeature(row) {
  const {ID, rs, longitude, latitude} = row
  return {
    type: 'Feature',
    id: ID,
    properties: {
      ...row,
      id: ID,
      name: rs,
      complementAdresse: row.cpl_loc,
      modePrelevement: row.mod_prel.split('/'),
      capacitePrelevement: row.capa_prel,
      audience: row.public,
      isPublic: row.public.includes('Tout public'),
      appointment: row.check_rdv,
      appointmentOnly: row.check_rdv === 'Sur rendez-vous uniquement',
      tel: row.tel_rdv,
      mail: row.web_rdv
    },
    geometry: {
      type: 'Point',
      coordinates: [longitude, latitude]
    }
  }
}

async function buildSitesPrelevements(dataDirectory) {
  const sitesGrandPublic = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/7c0f7980-1804-4382-a2a8-1b4af2e10d32')
  const sitesAccesRestreint = await fetchCsv('https://www.data.gouv.fr/fr/datasets/r/9017eb26-e829-4ac6-8c34-36e9f971a889')

  const sitesFeatures = [
    ...sitesGrandPublic,
    ...sitesAccesRestreint
  ].map(site => prepareSitePrelevementFeature(site))

  const featureCollection = {
    type: 'FeatureCollection',
    features: sitesFeatures
  }

  await outputJson(join(dataDirectory, 'prelevements.json'), featureCollection)
}

module.exports = {buildSitesPrelevements}
