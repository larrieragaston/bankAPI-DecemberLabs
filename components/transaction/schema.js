const mongoose = require('mongoose')

const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const transactionSchema = new Schema({
  accountFrom: { type: ObjectId, ref: 'Account', required: true },
  accountTo: { type: ObjectId, ref: 'Account', required: true },
  // The minimum amount to transfer allowed is 10
  amountFrom: { type: Number, min: 10, required: true },
  amountTo: { type: Number, min: 10, required: true },
  operationDate: { type: Date, default: new Date() },
  description: { type: String },
})

transactionSchema.index({ accountFrom: 1 })
transactionSchema.index({ accountTo: 1 })
transactionSchema.index({ operationDate: -1 })

module.exports = transactionSchema
