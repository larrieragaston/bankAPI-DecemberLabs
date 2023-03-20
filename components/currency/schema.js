const mongoose = require('mongoose')

const { Schema } = mongoose

const currencySchema = new Schema({
  name: { type: String, required: true, trim: true, unique: true },
  initials: { type: String, required: true, uppercase: true, trim: true, unique: true },
  symbol: { type: String, required: true, lowercase: true, trim: true, unique: true },
  currentReferenceToUSD: { type: Number, required: true },
})

module.exports = currencySchema
