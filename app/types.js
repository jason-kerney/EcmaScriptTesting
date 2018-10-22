'use strict';

const signet = require('signet')();

signet.alias('name', 'string');
signet.alias('price', 'number');

module.exports = signet;