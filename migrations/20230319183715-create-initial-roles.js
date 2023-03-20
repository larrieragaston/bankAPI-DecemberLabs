const mongodb = require('mongodb')

const { ObjectId } = mongodb

const initialRoles = [
  {
    _id: new ObjectId('000000000000000000000000'),
    name: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId('000000000000000000000001'),
    name: 'client',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

module.exports = {
  async up(db, client) {
    await db.collection('roles').insertMany(initialRoles)
  },

  async down(db, client) {
    await db.collection('roles').deleteMany({
      _id: {
        $in: initialRoles.map((role) => role._id),
      },
    })
  },
}
