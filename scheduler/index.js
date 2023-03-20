const config = require('config')
const logger = require('../logger')
const Scheduler = require('./scheduler')

const scheduler = new Scheduler(config, logger)
scheduler.Scheduler = Scheduler

module.exports = scheduler
