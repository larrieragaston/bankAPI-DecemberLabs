const Server = require('./server')
const Database = require('./database')

class BankApi {
  constructor(config, logger) {
    this.config = config
    this.logger = logger.child({ context: 'BankApi' })
    this.isRunning = false
    this.database = new Database(config, this.logger)
    this.server = new Server(config, this.logger, this.database)
  }

  async start() {
    if (this.isRunning) {
      throw new Error('Cannot start BankApi because it is already running')
    }
    this.isRunning = true

    this.logger.verbose('Starting BankApi')
    await Promise.all([this.database.connect(), this.server.listen()])
    this.logger.verbose('BankApi ready and awaiting requests')

    return { url: this.config.server.url }
  }

  async stop() {
    if (!this.isRunning) {
      throw new Error('Cannot stop BankApi because it is already stopped')
    }
    this.isRunning = false

    this.logger.verbose('Stopping BankApi')
    await Promise.all([this.database.disconnect(), this.server.close()])
    this.logger.verbose('BankApi has closed all connections and successfully halted')
  }
}

module.exports = BankApi
