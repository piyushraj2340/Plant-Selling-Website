const minAmountRule = require('./minAmount.rule');
const usageLimitRule = require('./usageLimit.rule');
const newUserRule = require('./newUser.rule');
const timeRule = require('./time.rule');

// Order of execution is important (fastest rules first)
module.exports = [
    timeRule,
    usageLimitRule,
    minAmountRule,
    newUserRule
];
