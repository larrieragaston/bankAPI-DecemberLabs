const { CronJob } = require('cron')
const job = require('./job')

class Exchange {
  constructor(config, logger, database) {
    this.config = config
    this.logger = logger
    this.database = database
  }

  start() {
    if (this.isRunning) {
      throw new Error('Cannot start exchange scheduler because it is already running')
    }
    this.isRunning = true

    this.cron = new CronJob(
      this.config.exchange.interval,
      () => job({ config: this.config, logger: this.logger, database: this.database }),
      null,
      true,
      this.config.exchange.timezone,
      null,
      true,
    )

    this.logger.info(`Exchange cron scheduled at ${this.cron.nextDates()}`)
  }

  async stop() {
    if (!this.isRunning) {
      throw new Error('Cannot stop Exchange scheduler because it is already stopped')
    }
    this.job.stop()
    this.isRunning = false
  }
}

module.exports = Exchange
