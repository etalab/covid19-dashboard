require('dotenv').config()

const regions = require('@etalab/decoupage-administratif/data/regions.json')
const departements = require('@etalab/decoupage-administratif/data/departements.json')

const regionsRoutes = regions.reduce((routes, region) => {
  routes[`/regions/${region.code}`] = {
    page: '/',
    query: {
      show: `REG-${region.code}`
    }
  }
  return routes
}, {})

const departementsRoutes = departements.reduce((routes, departement) => {
  routes[`/departements/${departement.code}`] = {
    page: '/',
    query: {
      show: `DEP-${departement.code}`
    }
  }
  return routes
}, {})

module.exports = {
  env: {
    SITE_URL: process.env.SITE_URL,
    SITE_NAME: process.env.SITE_NAME,
    SITE_DESCRIPTION: process.env.SITE_DESCRIPTION
  },

  exportPathMap() {
    return {
      '/': {page: '/'},
      ...departementsRoutes,
      ...regionsRoutes
    }
  }
}
