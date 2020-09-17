require('dotenv').config()

module.exports = {
  env: {
    SITE_URL: process.env.SITE_URL,
    SITE_NAME: process.env.SITE_NAME,
    SITE_DESCRIPTION: process.env.SITE_DESCRIPTION,
    API_ADDRESSES_URL: process.env.API_ADDRESSES_URL
  },

  exportPathMap() {
    return {
      '/': {page: '/'},
      '/vue-d-ensemble': {page: '/', query: {layout: 'big-picture'}},
      '/suivi-des-tests': {page: '/', query: {layout: 'tests'}},
      '/transferts-de-patients': {page: '/', query: {layout: 'transfert'}},
      '/activite-epidemique': {page: '/', query: {layout: 'synthese'}},
      '/suivi-indicateurs': {page: '/', query: {layout: 'indicators'}},
      '/sites-prelevements': {page: '/', query: {layout: 'prelevements'}},
      '/aides-entreprises': {page: '/', query: {layout: 'entreprises'}}
    }
  }
}
