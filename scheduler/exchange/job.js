const fetch = require('node-fetch')

async function job({ config, logger, database }) {
  logger.info(`Running cron job to update currency conversions starting at ${new Date()}`)

  const myHeaders = new fetch.Headers()
  myHeaders.append('apikey', config.fixerAPI.apiKey)

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders,
  }

  logger.info(`Getting currencies from the database`)

  const currencies = await database.model('Currency').find({})

  logger.info(`Serching in fixerAPI the current conversion to USD from all currencies`)

  for (const currency of currencies) {
    if (currency.initials != 'USD') {
      try {
        logger.info(`Serching in fixerAPI the current conversion from ${currency.initials} to USD`)

        const response = await fetch(
          `https://api.apilayer.com/fixer/convert?to=USD&from=${currency.initials}&amount=1`,
          requestOptions,
        )
        const result = await response.text()
        const resultParsed = JSON.parse(result)

        logger.info(
          `Saving the current conversion from ${currency.initials} to USD on the database`,
        )

        currency.currentReferenceToUSD = resultParsed.result
        currency.save()

        logger.info(`Conversion from ${currency.initials} to USD saved on the database`)
      } catch (err) {
        throw Error('Erro getting data from fixerAPI. Error: ', err)
      }
    }
  }

  logger.info(`Cron job finished update currency conversions at ${new Date()}`)
}

module.exports = job
