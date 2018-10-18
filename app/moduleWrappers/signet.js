'use strict';

function signet(types) {
    const signetInstance = require('signet')();

    types(signetInstance);

    return signetInstance;
}

module.exports = signet;