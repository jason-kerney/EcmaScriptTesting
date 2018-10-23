'use strict';

const mockery = require('mockery');
const sinon = require('sinon');
const { assert } = require('chai');
const { mockerySetup } = require('./test-utils/mockerySetup');
const signet = require('../app/types');

describe('Pizza Builder', function () {
    let pizzaBuilder;
    let buildToppingCategorySpy;
    let toppingSpys = {};

    before(function () {
        mockery.enable({ useCleanCache: true });
    });

    beforeEach(function () {
        mockerySetup(mockery, '../app/pizzaBuilder');
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

    let isDefined = signet.isTypeOf('not<undefined>');
    let isFunction = signet.isTypeOf('function');


    function reportOnPossibleSpy(possilbeSpy) {
        if(isDefined(possilbeSpy.callCount)) {
            return possilbeSpy.callCount;
        }
        if(isFunction(possilbeSpy)) {
            return possilbeSpy();
        }
        
        throw new Error('unknown type');
    }

    function reportOnTopping(toppingSpy, altName) {
        let r = {
            name: Boolean(toppingSpy.__name) ? toppingSpy.__name : altName,
            'getTopping': reportOnPossibleSpy(toppingSpy.getTopping),
            'getAmmount': reportOnPossibleSpy(toppingSpy.getAmmount),
            'hasAny': reportOnPossibleSpy(toppingSpy.hasAny)
        };

        return JSON.stringify(r);
    };

    function reportOnAllToppings(topping) {
        return Object.keys(topping).map(name => reportOnTopping(topping[name], name));
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
        let s = reportOnAllToppings(toppingSpys);

        assert.equal(s[0], '{"name":"pepperoni Mock","getTopping":0,"getAmmount":1,"hasAny":0}');
        assert.equal(s[1], '{"name":"sausage Mock","getTopping":0,"getAmmount":1,"hasAny":0}');
        assert.equal(s[2], '{"name":"pineapple Mock","getTopping":0,"getAmmount":1,"hasAny":0}');
        assert.equal(s[3], '{"name":"canadian bacon Mock","getTopping":0,"getAmmount":1,"hasAny":0}');
        assert.equal(s[4], '{"name":"bacon Mock","getTopping":0,"getAmmount":1,"hasAny":0}');
        assert.equal(s[5], '{"name":"new testing topping Mock","getTopping":0,"getAmmount":1,"hasAny":0}');
    });

    it('delivers the pizza', function () {
        let p = pizzaBuilder();

        let r = p.deliver();

        assert.equal(r, 'Presto! Delivered to your door.');

        let s = reportOnAllToppings({
            'pepperoni': p['pepperoni'],
            'sausage': p['sausage'],
            'pineapple': p['pineapple'],
            'canadian bacon': p['canadian bacon'],
            'bacon': p['bacon'],
            'new testing topping': p['new testing topping']
        });

        assert.equal(s[0], '{"name":"pepperoni","getTopping":"pepperoni Mock","getAmmount":-0.01,"hasAny":true}');
        assert.equal(s[1], '{"name":"sausage","getTopping":"sausage Mock","getAmmount":-0.01,"hasAny":true}');
        assert.equal(s[2], '{"name":"pineapple","getTopping":"pineapple Mock","getAmmount":-0.01,"hasAny":true}');
        assert.equal(s[3], '{"name":"canadian bacon","getTopping":"canadian bacon Mock","getAmmount":-0.01,"hasAny":true}');
        assert.equal(s[4], '{"name":"bacon","getTopping":"bacon Mock","getAmmount":-0.01,"hasAny":true}');
        assert.equal(s[5], '{"name":"new testing topping","getTopping":"new testing topping Mock","getAmmount":-0.01,"hasAny":true}');
    });

    afterEach(function () {
        mockery.deregisterAll();
    });

    after(function () {
        mockery.disable();
    });
});