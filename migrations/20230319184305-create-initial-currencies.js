const mongodb = require('mongodb')

const { ObjectId } = mongodb

const initialCurrencies = [
  {
    _id: new ObjectId('000000000000000000000000'),
    initials: 'UYU',
    name: 'Pesos Uruguayos',
    symbol: '$',
    currentReferenceToUSD: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId('000000000000000000000001'),
    initials: 'USD',
    name: 'Dolares Americanos',
    symbol: 'U$S',
    currentReferenceToUSD: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId('000000000000000000000002'),
    initials: 'EUR',
    name: 'Euros',
    symbol: '€',
    currentReferenceToUSD: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

module.exports = {
  async up(db, client) {
    await db.collection('currencies').insertMany(initialCurrencies)
  },

  async down(db, client) {
    await db.collection('currencies').deleteMany({
      _id: {
        $in: initialCurrencies.map((currency) => currency._id),
      },
    })
  },
}
