const mongodb = require('mongodb')

const { ObjectId } = mongodb

const initialAccounts = [
  {
    _id: new ObjectId('000000000000000000000000'),
    accountId: '0720555288000035777110',
    alias: 'GASTON.LARRIERA.PESOS',
    accountHolder: new ObjectId('000000000000000000000001'),
    accountBalance: 30000,
    currency: new ObjectId('000000000000000000000000'),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId('000000000000000000000001'),
    accountId: '0720555288000035777111',
    alias: 'GASTON.LARRIERA.DOLARES',
    accountHolder: new ObjectId('000000000000000000000001'),
    accountBalance: 5000,
    currency: new ObjectId('000000000000000000000001'),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId('000000000000000000000002'),
    accountId: '0720555288000035777112',
    alias: 'GASTON.LARRIERA.EUROS',
    accountHolder: new ObjectId('000000000000000000000001'),
    accountBalance: 6000,
    currency: new ObjectId('000000000000000000000002'),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId('000000000000000000000003'),
    accountId: '0720555288000035777113',
    alias: 'CARLOS.LOPEZ.PESOS',
    accountHolder: new ObjectId('000000000000000000000002'),
    accountBalance: 10000,
    currency: new ObjectId('000000000000000000000000'),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId('000000000000000000000004'),
    accountId: '0720555288000035777114',
    alias: 'CARLOS.LOPEZ.DOLARES',
    accountHolder: new ObjectId('000000000000000000000002'),
    accountBalance: 2000,
    currency: new ObjectId('000000000000000000000001'),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

module.exports = {
  async up(db, client) {
    await db.collection('accounts').insertMany(initialAccounts)
  },

  async down(db, client) {
    await db.collection('accounts').deleteMany({
      _id: {
        $in: initialAccounts.map((account) => account._id),
      },
    })
  },
}
