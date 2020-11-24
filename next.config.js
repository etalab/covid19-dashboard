require('dotenv').config()

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  env: {
    SITE_URL: process.env.SITE_URL,
    SITE_NAME: process.env.SITE_NAME,
    SITE_DESCRIPTION: process.env.SITE_DESCRIPTION,
    API_ADRESSE_URL: process.env.API_ADRESSE_URL
  },

  webpack(config, {webpack}) {
    config.plugins.push(
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /fr/)
    )
    return config
  },

  exportPathMap() {
    return {
      '/': {page: '/'},
      '/vue-d-ensemble': {page: '/', query: {layout: 'big-picture'}},
      '/suivi-des-tests': {page: '/', query: {layout: 'tests'}},
      '/activite-epidemique': {page: '/', query: {layout: 'synthese'}},
      '/suivi-indicateurs': {page: '/', query: {layout: 'indicators'}},
      '/sites-prelevements': {page: '/', query: {layout: 'prelevements'}},
      '/aides-entreprises': {page: '/', query: {layout: 'entreprises'}}
    }
  }
})
