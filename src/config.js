require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const envVars = process.env;

module.exports = {
  ENV: envVars.NODE_ENV,
  MONGO_URI: envVars.MONGO_URI,
  PORT: process.env.PORT || 5000,
  PUBLIC_URL: envVars.PUBLIC_URL
};
