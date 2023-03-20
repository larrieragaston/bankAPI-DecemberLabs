const mongoose = require('mongoose')

const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const accountSchema = new Schema({
  accountId: { type: String, unique: true, required: true },
  alias: { type: String },
  accountHolder: { type: ObjectId, ref: 'User', required: true },
  accountBalance: { type: Number, required: true, default: 0 },
  currency: { type: ObjectId, ref: 'Currency', required: true },
  isActive: { type: Boolean, select: false, default: true },
})

accountSchema.index({ accountHolder: 1 })
accountSchema.index({ accountHolder: 1, currency: 1 }, { unique: true })
accountSchema.index(
  { alias: 1 },
  { unique: true, partialFilterExpression: { alias: { $type: 'string' } } },
)

module.exports = accountSchema
