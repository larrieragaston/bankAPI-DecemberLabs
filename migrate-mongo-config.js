const currentConfig = require('config')

const config = {
  mongodb: {
    url: currentConfig.mongo.url,
    databaseName: currentConfig.mongo.db,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
}

module.exports = config
