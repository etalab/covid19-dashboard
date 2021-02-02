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
      '/suivi-des-tests': {page: '/', query: {layout: 'tests'}},
      '/suivi-indicateurs': {page: '/', query: {layout: 'indicators'}},
      '/aides-entreprises': {page: '/', query: {layout: 'entreprises'}}
    }
  }
})
