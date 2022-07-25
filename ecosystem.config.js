module.exports = {
  apps : [
  {
    name   : "Neurone Auth",
    script : "cd backend/neurone-auth/ && npm install && tsc && node dist/app.js",
    env    : {
      "PORT": "3005",
      "SECRET_KEY": "placeholder",
      "SALT_ROUNDS": "10",
      "TOKEN_DURATION ": "7200",
      "DB": "mongodb://127.0.0.1:27017/neurone"
    }
  },
  {
    name   : "Neurone Profile",
    script : "cd ./backend/neurone-profile/ && npm install && tsc && node dist/app.js",
    env    : {
      "PORT": "3002",
      "NEURONE_AUTH_PORT": "3005",
      "DB": "mongodb://127.0.0.1:27017/neurone"
    }
  },
  {
    name   : "Neurone Search",
    script : "cd backend/neurone-search/ && npm install && tsc && node dist/app.js",
    env    : {
      "PORT":"3001",
      "DB": "mongodb://127.0.0.1:27017/neurone",
      "NEURONE_ASSET_PATH": "./assets",
      "NEURONE_IFUCO_SORT_DISABLE": "true",
      "NEURONE_SEARCH_ENGINE": "solr",

      "NEURONE_SOLR_HOST": "localhost",
      "NEURONE_SOLR_PORT": "8983",
      "NEURONE_SOLR_CORE": "neurone"
    }
  }
  ]
}
