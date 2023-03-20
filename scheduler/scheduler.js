const Database = require('../lib/database')
const Exchange = require('./exchange')

class Scheduler {
  constructor(config, logger) {
    this.config = config
    this.logger = logger.child({ context: 'Scheduler' })
    this.isRunning = false
    this.database = new Database(config, this.logger)

    this.exchange = new Exchange(this.config, this.logger, this.database)
  }

  async start() {
    if (this.isRunning) {
      throw new Error('Cannot start BankAPI scheduler because it is already running')
    }
    this.isRunning = true

    this.logger.verbose('Starting BankAPI scheduler')
    await this.database.connect()
    this.exchange.start()
    this.logger.verbose('BankAPI scheduler ready')
  }

  async stop() {
    if (!this.isRunning) {
      throw new Error('Cannot stop BankAPI scheduler because it is already stopped')
    }
    this.isRunning = false

    this.logger.verbose('Stopping BankAPI scheduler')
    await this.database.disconnect()
    this.exchange.stop()
    this.logger.verbose('BankAPI scheduler has stopped')
  }
}

module.exports = Scheduler
