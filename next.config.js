require('dotenv').config()
module.exports = {
  env: {
    GOUV: process.env.GOUV,
    DISABLE_FOOTER: process.env.DISABLE_FOOTER,
    SITE_URL: process.env.SITE_URL
  }
}
