require('dotenv').config()

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
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
      '/suivi-indicateurs': {page: '/', query: {layout: 'indicators'}},
      '/suivi-des-tests': {page: '/', query: {layout: 'tests'}},
      '/suivi-vaccination': {page: '/', query: {layout: 'vaccination'}},
      '/logistique-vaccins': {page: '/', query: {layout: 'vaccins'}},
      '/aides-entreprises': {page: '/', query: {layout: 'entreprises'}}
    }
  }
})
