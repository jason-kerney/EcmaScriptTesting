'use strict';

const toppings = require('./toppings')();
const signet = require('./types');

function pizzaBuilder() {
    toppings.buildToppingCategory('pepperoni', 1.25);
    toppings.buildToppingCategory('sausage', 1.25);
    toppings.buildToppingCategory('pineapple', 1.75);
    toppings.buildToppingCategory('pepperoni', 1.25);
    toppings.buildToppingCategory('canadian bacon', 2.00);
    toppings.buildToppingCategory('bacon', 2.1);

    let toppingNames = Object.keys(toppings.toppings);

    let pizza = {};

    toppingNames.forEach(name => pizza[name] = toppings.toppings[name]);

    pizza['getTotal'] = function () {
        return (
            25 +
            toppingNames
                .map(name => pizza[name].getAmmount())
                .reduce((previous, current) => previous + current, 0)
        );
    };

    pizza['deliver'] = function () {
        toppingNames.forEach(function (name) {
            let ammount = pizza[name].getAmmount();
            let toppingInfo = pizza[name].getTopping();
            let any = pizza[name].hasAny();

            let newTopping = {
                getTopping: () => toppingInfo,
                getAmmount: () => ammount,
                hasAny: () => any
            };

            pizza[name] = newTopping;
        });

        return 'Presto! Delivered to your door.';
    };

    return pizza;
}

module.exports = signet.enforce(
    '() => pizza'
    , pizzaBuilder
);