require('dotenv').config()

module.exports = {
  env: {
    SITE_URL: process.env.SITE_URL,
    SITE_NAME: process.env.SITE_NAME,
    SITE_DESCRIPTION: process.env.SITE_DESCRIPTION
  },

  exportPathMap() {
    return {
      '/': {page: '/'},
      '/vue-d-ensemble': {page: '/', query: {layout: 'big-picture'}},
      '/suivi-des-tests': {page: '/', query: {layout: 'tests'}},
      '/transferts-de-patients': {page: '/', query: {layout: 'transferts'}},
      '/activite-epidemique': {page: '/', query: {layout: 'synthese'}},
      '/aides-entreprises': {page: '/', query: {layout: 'entreprises'}}
    }
  }
}
