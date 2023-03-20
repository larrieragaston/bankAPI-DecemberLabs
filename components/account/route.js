const { Router } = require('express')

const router = new Router()

router.get('/', getAllAccounts)
router.get('/mine', getUserAccounts)
router.get('/destinations', getAccountstoTransfer)
router.get('/validateToTransfer', validateAccount)
router.post('/', createAccount)

async function getAllAccounts(req, res, next) {
  req.logger.info('getAllAccounts by user ', req.user._id)

  if (!req.isAdmin()) {
    return res.status(403).send('Unauthorized')
  }

  try {
    const accounts = await req.model('Account').find({}).populate('accountHolder currency')
    res.send(accounts)
  } catch (err) {
    next(err)
  }
}

async function getUserAccounts(req, res, next) {
  req.logger.info('getUserAccounts for user ', req.user._id)

  try {
    const user = await req.model('User').findById(req.user._id)

    if (!user) {
      req.logger.warn(`User not found: ${req.user._id}`)
      return res.status(404).send('User not found')
    }

    const accounts = await req
      .model('Account')
      .find({ accountHolder: user._id, isActive: true })
      .populate('currency')

    res.send(accounts)
  } catch (err) {
    next(err)
  }
}

async function getAccountstoTransfer(req, res, next) {
  req.logger.info('getAccountstoTransfer for user ', req.user._id)

  try {
    const user = await req.model('User').findById(req.user._id)

    if (!user) {
      req.logger.warn(`User not found: ${req.user._id}`)
      return res.status(404).send('User not found')
    }

    const accounts = await req
      .model('Account')
      .find({ accountHolder: { $ne: user._id }, isActive: true })
      .select({ _id: 0, accountId: 1, alias: 1 })
      .populate({
        path: 'accountHolder',
        select: {
          _id: 0,
          firstName: 1,
          lastName: 1,
          governmentId: 1,
        },
      })
      .populate({
        path: 'currency',
        select: {
          _id: 0,
          initials: 1,
          name: 1,
        },
      })

    res.send(accounts)
  } catch (err) {
    next(err)
  }
}

async function validateAccount(req, res, next) {
  req.logger.info('validateAccount for query ', req.query.accountId || req.query.alias)

  const { accountId, alias } = req.query

  try {
    const user = await req.model('User').findById(req.user._id)

    if (!user) {
      req.logger.warn(`User not found: ${req.user._id}`)
      return res.status(404).send('User not found')
    }

    const account = await req
      .model('Account')
      .findOne({ $or: [{ accountId }, { alias }], isActive: true })
      .select({ _id: 0, accountId: 1, alias: 1 })
      .populate({
        path: 'accountHolder',
        select: {
          _id: 0,
          firstName: 1,
          lastName: 1,
          governmentId: 1,
        },
      })
      .populate({
        path: 'currency',
        select: {
          _id: 0,
          initials: 1,
          name: 1,
        },
      })

    res.send(account)
  } catch (err) {
    next(err)
  }
}

async function createAccount(req, res, next) {
  req.logger.info('createAccount: ', req.body)

  const account = req.body

  if (!req.isAdmin()) {
    account.accountHolder = req.user._id
  }

  try {
    const user = await req.model('User').findById(account.accountHolder)
    if (!user) {
      req.logger.error('User not found: ', account.accountHolder)
      return res.status(404).send('User not found')
    }

    const accountCreated = await req.model('Account').create({ ...account, isActive: true })

    res.send(accountCreated)
  } catch (err) {
    next(err)
  }
}

module.exports = router
