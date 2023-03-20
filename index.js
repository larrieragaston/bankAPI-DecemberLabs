const config = require("config");
const logger = require("./logger");
const BankApi = require("./lib/bankApi");

const bankApi = new BankApi(config, logger);
bankApi.BankApi = BankApi;

module.exports = bankApi;
