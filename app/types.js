'use strict';

const signet = require('signet')();

signet.alias('name', 'string');
signet.alias('price', 'number');

signet.defineDuckType('topping', {
    light: 'function<() => undefined>',
    regular: 'function<() => undefined>',
    heavy: 'function<() => undefined>',
    half: 'function<() => undefined>',
    none: 'function<() => undefined>',
    getTopping: 'function<() => string>',
    getAmmount: 'function<() => price>',
    hasAny: 'function<() => boolean>'
});

signet.defineDuckType(
    'pizza', {
        pepperoni: 'topping',
        sausage: 'topping',
        pineapple: 'topping',
        'canadian bacon': 'topping',
        bacon: 'topping',
        getTotal: 'function<() => price>',
        deliver: 'function<() => string>'
    }
);

module.exports = signet;