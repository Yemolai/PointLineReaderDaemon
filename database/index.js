'use strict';
console.log('importing database');
const __config = require('./config');
const __db = require('./models/');
module.exports = Object.assign(__db, { __config });