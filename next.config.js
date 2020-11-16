/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

const ENV_VARS = {
  SITE_NAME: process.env.SITE_NAME,
  MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
  GA_TRACKING_ID: process.env.GA_TRACKING_ID
}

module.exports = {
  env: ENV_VARS,
  publicRuntimeConfig: ENV_VARS,
  poweredByHeader: false,
}
