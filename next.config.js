require('dotenv').config()
module.exports = {
  env: {
    GOUV: process.env.GOUV,
    DISABLE_FOOTER: process.env.DISABLE_FOOTER,
    SITE_URL: process.env.SITE_URL,
    SITE_NAME: process.env.SITE_NAME,
    SITE_DESCRIPTION: process.env.SITE_DESCRIPTION
  }
}
