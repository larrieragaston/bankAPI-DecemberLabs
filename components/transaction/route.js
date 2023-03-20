const { Router } = require('express')

const router = new Router()

router.get('/', getTransactions)
router.post('/transfer', createTransaction)

async function getTransactions(req, res, next) {
  req.logger.info('getUserTransactions for user: ', req.user._id, ' by query', req.query)

  const { from, to, sourceAccountID } = req.query

  try {
    const userAccounts = await req
      .model('Account')
      .find(req.isAdmin() ? {} : { accountHolder: req.user._id })
    if (!userAccounts.length) {
      req.logger.error('User Accounts not found')
      return res.status(400).send('User Accounts not found')
    }

    if (sourceAccountID && !userAccounts.some((x) => x._id.toString() == sourceAccountID)) {
      req.logger.error('Account not found in user accounts')
      return res.status(404).send('Account not found in user accounts')
    }

    const query = {
      ...(from && { operationDate: { $gte: new Date(parseInt(from, 10)) } }),
      ...(to && { operationDate: { $lte: new Date(parseInt(to, 10)) } }),
      ...(!sourceAccountID
        ? { $or: [{ accountFrom: { $in: userAccounts } }, { accountTo: { $in: userAccounts } }] }
        : {
            $or: [{ accountFrom: sourceAccountID }, { accountTo: sourceAccountID }],
          }),
    }

    const transactions = await req
      .model('Transaction')
      .find(query)
      .populate([
        {
          path: 'accountFrom',
          select: 'accountId alias',
          populate: [
            {
              path: 'accountHolder',
              select: 'firstName lastName governmentId',
            },
            {
              path: 'currency',
              select: 'initials name',
            },
          ],
        },
        {
          path: 'accountTo',
          select: 'accountId alias',
          populate: [
            {
              path: 'accountHolder',
              select: 'firstName lastName governmentId',
            },
            {
              path: 'currency',
              select: 'initials name',
            },
          ],
        },
      ])

    res.send(transactions)
  } catch (err) {
    next(err)
  }
}

async function createTransaction(req, res, next) {
  req.logger.info('createTransaction: ', req.body)

  if (req.isAdmin()) {
    return res.status(405).send('Not Allowed')
  }
  const transaction = req.body

  if (!transaction.accountFrom || !transaction.accountTo || !transaction.amountFrom) {
    return res.status(400).send('The data accountFrom, accountTo and amountFrom is required')
  }

  if (transaction.accountFrom == transaction.accountTo) {
    return res.status(405).send('Not Allowed. You can not do a transaction with the same account')
  }

  try {
    req.logger.info(`Getting the sourceAccount: ${transaction.accountFrom}`)
    const sourceAccount = await req
      .model('Account')
      .findOne({ _id: transaction.accountFrom, accountHolder: req.user._id })
      .populate('currency')

    if (!sourceAccount) {
      req.logger.error(`The account does not correspond to the user`)
      return res
        .status(403)
        .send('Unauthorized. The current user is not the owner of the sourceAccountID')
    }

    if (sourceAccount.accountBalance < transaction.amountFrom) {
      req.logger.error(`The account ${transaction.accountFrom} has insufficient funds`)
      return res
        .status(400)
        .send(`Not Allowed. The account ${transaction.accountFrom} has insufficient funds`)
    }

    req.logger.info(`Getting the destinationAccount: ${transaction.accountTo}`)
    const destinationAccount = await req
      .model('Account')
      .findById(transaction.accountTo)
      .populate('currency')

    if (!destinationAccount) {
      req.logger.error(`The account ${transaction.accountTo} was not founded`)
      return res.status(404).send(`AccountTo ${transaction.accountTo} not found`)
    }

    // Calculate the converted amountFrom (TODO: extract this code to an external function)
    req.logger.info(`Calculating the convertion amountFrom`)
    let convertedAmount = transaction.amountFrom
    if (sourceAccount.currency != destinationAccount.currency) {
      if (sourceAccount.currency.initials == 'USD') {
        convertedAmount /= destinationAccount.currency.currentReferenceToUSD
      } else if (destinationAccount.currency.initials == 'USD') {
        convertedAmount *= sourceAccount.currency.currentReferenceToUSD
      } else {
        // To diferent currencies than USD. First convert to dollars and then to the final currency
        convertedAmount =
          (convertedAmount * sourceAccount.currency.currentReferenceToUSD) /
          destinationAccount.currency.currentReferenceToUSD
      }
    }

    req.logger.info(`Calculating the operation tax`)
    if (sourceAccount.accountHolder.toString() != destinationAccount.accountHolder.toString()) {
      const tax = convertedAmount * 0.01
      convertedAmount -= tax
      transaction.description += `. This transaccion has a tax of 1% (amount: ${tax})`
    }

    req.logger.info(`Creating transaction in the database`)
    const transactionCreated = await req.model('Transaction').create({
      amountTo: convertedAmount,
      operationDate: new Date(),
      ...transaction,
    })

    req.logger.info(`Doing the movements of the money`)
    if (transactionCreated) {
      sourceAccount.accountBalance -= transaction.amountFrom
      await sourceAccount.save()

      destinationAccount.accountBalance += convertedAmount
      await destinationAccount.save()
    }

    res.send(transactionCreated)
    res.send()
  } catch (err) {
    next(err)
  }
}

module.exports = router
