'use strict';

const mockery = require('mockery');
const sinon = require('sinon');
const { assert } = require('chai');

describe('Pizza Builder', function () {
    let pizzaBuilder;
    let buildToppingCategorySpy;
    let toppingSpys = {};

    before(function () {
        mockery.enable({ useCleanCache: true });
        mockery.registerAllowables(['./types', 'signet', 'signet-assembler', 'signet-checker', 'signet-parser', 'signet-registrar', 'signet-typelog', 'signet-validator', './bin/signet', './bin/duckTypes', './bin/coreTypes', './bin/recursiveTypes', '../app/pizzaBuilder'])
    });

    beforeEach(function () {
        buildToppingCategorySpy = sinon.spy();

        function buildMockTopping(name) {
            toppingSpys[name] = {
                light: () => undefined,
                regular: () => undefined,
                heavy: () => undefined,
                half: () => undefined,
                none: () => undefined,
                getTopping: sinon.spy(() => `${name} Mock`),
                getAmmount: sinon.spy(() => -.01),
                hasAny: sinon.spy(() => true),
                __name: `${name} Mock`
            };
        }

        buildMockTopping('pepperoni');
        buildMockTopping('sausage');
        buildMockTopping('pineapple');
        buildMockTopping('canadian bacon');
        buildMockTopping('bacon');
        buildMockTopping('new testing topping');

        let toppingMock = {
            buildToppingCategory: buildToppingCategorySpy,
            toppings: toppingSpys
        };
        mockery.registerMock('./toppings', () => toppingMock);
        pizzaBuilder = require('../app/pizzaBuilder');
    });

    function reportOnTopping(name) {
        let toppingSpy = toppingSpys[name];
        let r = {
            name: toppingSpy.__name,
            'getTopping called': toppingSpy.getTopping.callCount,
            'getAmmount called': toppingSpy.getAmmount.callCount,
            'hasAny called': toppingSpy.hasAny.callCount
        };

        return JSON.stringify(r);
    };

    function reportOnAllToppings(){
        return Object.keys(toppingSpys).map(name => reportOnTopping(name));
    }

    it('builds toppings', function () {
        let p = pizzaBuilder()
        assert.equal(buildToppingCategorySpy.callCount, 6);
        assert.sameMembers(buildToppingCategorySpy.args[0], ['pepperoni', 1.25]);
        assert.sameMembers(buildToppingCategorySpy.args[1], ['sausage', 1.25]);
        assert.sameMembers(buildToppingCategorySpy.args[2], ['pineapple', 1.75]);
        assert.sameMembers(buildToppingCategorySpy.args[3], ['pepperoni', 1.25]);
        assert.sameMembers(buildToppingCategorySpy.args[4], ['canadian bacon', 2]);
        assert.sameMembers(buildToppingCategorySpy.args[5], ['bacon', 2.1]);
    });

    it('gets its toppings from the toppings module', function () {
        let p = pizzaBuilder();

        assert.property(p, 'new testing topping');
    });

    it('gets its total from toppings', function () {
        let p = pizzaBuilder();
        let r = p.getTotal();

        assert.approximately(r, 24.94, .02);
        let s = reportOnAllToppings();

        assert.equal(s[0], '{"name":"pepperoni Mock","getTopping called":0,"getAmmount called":1,"hasAny called":0}');
        assert.equal(s[1], '{"name":"sausage Mock","getTopping called":0,"getAmmount called":1,"hasAny called":0}');
        assert.equal(s[2], '{"name":"pineapple Mock","getTopping called":0,"getAmmount called":1,"hasAny called":0}');
        assert.equal(s[3], '{"name":"canadian bacon Mock","getTopping called":0,"getAmmount called":1,"hasAny called":0}');
        assert.equal(s[4], '{"name":"bacon Mock","getTopping called":0,"getAmmount called":1,"hasAny called":0}');
        assert.equal(s[5], '{"name":"new testing topping Mock","getTopping called":0,"getAmmount called":1,"hasAny called":0}');
    });

    it('delivers the pizza', function(){
        let p = pizzaBuilder();

        let r = p.deliver();

        assert.equal(r, 'Presto! Delivered to your door.');

        let s = reportOnAllToppings();

        assert.equal(s[0], '{"name":"pepperoni Mock","getTopping called":1,"getAmmount called":1,"hasAny called":1}');
        assert.equal(s[1], '{"name":"sausage Mock","getTopping called":1,"getAmmount called":1,"hasAny called":1}');
        assert.equal(s[2], '{"name":"pineapple Mock","getTopping called":1,"getAmmount called":1,"hasAny called":1}');
        assert.equal(s[3], '{"name":"canadian bacon Mock","getTopping called":1,"getAmmount called":1,"hasAny called":1}');
        assert.equal(s[4], '{"name":"bacon Mock","getTopping called":1,"getAmmount called":1,"hasAny called":1}');
        assert.equal(s[5], '{"name":"new testing topping Mock","getTopping called":1,"getAmmount called":1,"hasAny called":1}');
    });

    afterEach(function () {
        mockery.deregisterAll();
        mockery.deregisterAllowables(['./types', 'signet', 'signet-assembler', 'signet-checker', 'signet-parser', 'signet-registrar', 'signet-typelog', 'signet-validator', './bin/signet', './bin/duckTypes', './bin/coreTypes', './bin/recursiveTypes', '../app/pizzaBuilder'])
    });

    after(function () {
        mockery.disable();
    });
});