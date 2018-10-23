'use strict';

let pizzaBuilder = require('./pizzaBuilder');
let Prompt = require('prompt-list');
let async = require('async');

let specialFunctions = ['getTotal', 'deliver'];

function printPizza(pizza) {
    let keys =
        (
            getToppingNames(pizza)
                .filter(key => pizza[key].hasAny())
        );

    console.log();
    console.log();
    keys.forEach(key => console.log(`${pizza[key].getTopping()}`));
    console.log();
    console.log(`------------------------------------`);
    console.log(`$${pizza.getTotal()}`);
    console.log();
    console.log();
}

function getToppingNames(pizza) {
    return (
        Object.keys(pizza)
            .filter(key => !specialFunctions.includes(key))
    );
}

function main(callback) {
    console.log('Welcome to the magic house pizza builder!');

    let pizza = pizzaBuilder();

    let toppingNames = getToppingNames(pizza);
    toppingNames.push('None');

    let toppingPrompt = new Prompt({
        name: 'Topping',
        choices: toppingNames
    });

    let amountPrompt = new Prompt({
        name: 'Topping Amount',
        choices: [
            'light',
            'regular',
            'heavy',
            'none'
        ]
    });

    let continuePrompt = new Prompt({
        name: 'Continue',
        choices: ['Yes', 'No']
    });

    function askForToppings(continuation) {
        toppingPrompt.ask(function requestTopping(answer) { continuation(null, answer); });
    }

    function askForAmount(continuation) {
        amountPrompt.ask(function requestAmount(answer) { continuation(null, answer); });
    }

    function askToContinue(continuation) {
        continuePrompt.ask(function wantToContinue(answer) { continuation(null, answer); });
    }

    function summarize(continuation) {
        let response = pizza.deliver();
        printPizza(pizza);
        console.log(response);
        continuation(null);
    }

    function moreToppings(topContinuation) {
        let result = {};

        function addToResult(name) {
            return function (data, continuation) {
                result[name] = data;
                continuation(null);
            };
        }

        function addToPizza(continuation) {
            pizza[result.ToppingName][result.ToppingAmount]();
            continuation(null);
        }

        function printIt(continuation) {
            printPizza(pizza);
            continuation(null);
        }

        async.waterfall([
            askForToppings,
            addToResult('ToppingName'),
            askForAmount,
            addToResult('ToppingAmount'),
            addToPizza,
            printIt,
            askToContinue
        ], function (error, answer) {
            if (error) {
                return;
            }

            if (answer === 'Yes') {
                moreToppings(topContinuation);
            } else {
                topContinuation();
            }
        });
    }

    async.waterfall([
        moreToppings,
        summarize
    ], callback);
}

module.exports = main;