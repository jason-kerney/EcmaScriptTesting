'use strict';
const { expect, assert } = require('chai');
const { asInformationString } = require('object-information');
const signet = require('../app/types');

describe('toppings', function () {
    const toppingsBuilderFactory = require('../app/toppings');

    it('starts empty', function () {
        let toppingsBuilder = toppingsBuilderFactory();

        expect(toppingsBuilder.toppings).to.be.empty;
    });

    it('creates the ability to add a topping', function () {
        let toppingsBuilder = toppingsBuilderFactory();

        toppingsBuilder.buildToppingCategory('new topping', 1.3);

        let keys = Object.keys(toppingsBuilder.toppings);

        expect(keys).to.have.lengthOf(1);
        expect(keys[0]).to.equal('new topping');

        const isToppingType = signet.isTypeOf('topping')(toppingsBuilder.toppings['new topping']);

        expect(isToppingType).to.be.true;
    });

    it('has a topping wich has not been added', function () {
        let toppingsBuilder = toppingsBuilderFactory();

        toppingsBuilder.buildToppingCategory('new topping', 2);

        const newTopping = toppingsBuilder.toppings['new topping'];

        expect(newTopping.hasAny()).to.be.false;
        expect(newTopping.getAmmount()).to.be.within(0, 0.001);
        expect(newTopping.getTopping()).to.be.equal('new topping None $0');
    });

    it('has a topping wich has not been added even if halved', function () {
        let toppingsBuilder = toppingsBuilderFactory();

        toppingsBuilder.buildToppingCategory('new topping', 2);
        
        const newTopping = toppingsBuilder.toppings['new topping'];
        newTopping.half();

        expect(newTopping.hasAny()).to.be.false;
        expect(newTopping.getAmmount()).to.be.within(0, 0.001);
        expect(newTopping.getTopping()).to.be.equal('new topping None $0');
    });

    it('has a topping wich when set to "regular" the price is the full price', function () {
        let toppingsBuilder = toppingsBuilderFactory();

        toppingsBuilder.buildToppingCategory('new topping', 1.3);

        const newTopping = toppingsBuilder.toppings['new topping'];
        newTopping.regular();

        expect(newTopping.hasAny()).to.be.true;
        expect(newTopping.getAmmount()).to.be.within(1.3, 1.301);
        expect(newTopping.getTopping()).to.be.equal('new topping Regular $1.3');
    });

    it('has a topping wich when set to "light" the price is the half price', function () {
        let toppingsBuilder = toppingsBuilderFactory();

        toppingsBuilder.buildToppingCategory('new topping', 2);

        const newTopping = toppingsBuilder.toppings['new topping'];
        newTopping.light();

        expect(newTopping.hasAny()).to.be.true;
        expect(newTopping.getAmmount()).to.be.within(1, 1.001);
        expect(newTopping.getTopping()).to.be.equal('new topping Light $1');
    });

    it('has a topping wich when set to "heavy" the price is the double the price', function () {
        let toppingsBuilder = toppingsBuilderFactory();

        toppingsBuilder.buildToppingCategory('new topping', 2);

        const newTopping = toppingsBuilder.toppings['new topping'];
        newTopping.heavy();

        expect(newTopping.hasAny()).to.be.true;
        expect(newTopping.getAmmount()).to.be.within(4, 4.001);
        expect(newTopping.getTopping()).to.be.equal('new topping Heavy $4');
    });

    it('has a topping wich when set to "heavy" and then half the price is the double the price', function () {
        let toppingsBuilder = toppingsBuilderFactory();

        toppingsBuilder.buildToppingCategory('new topping', 2);

        const newTopping = toppingsBuilder.toppings['new topping'];
        newTopping.heavy();
        newTopping.half();

        expect(newTopping.hasAny()).to.be.true;
        expect(newTopping.getAmmount()).to.be.within(4, 4.001);
        expect(newTopping.getTopping()).to.be.equal('new topping Heavy - Half $4');
    });

    it('has a topping that cannot be halved more then once', function () {
        let toppingsBuilder = toppingsBuilderFactory();

        toppingsBuilder.buildToppingCategory('new topping', 2);

        const newTopping = toppingsBuilder.toppings['new topping'];
        newTopping.heavy();
        newTopping.half();
        newTopping.half();

        expect(newTopping.hasAny()).to.be.true;
        expect(newTopping.getAmmount()).to.be.within(4, 4.001);
        expect(newTopping.getTopping()).to.be.equal('new topping Heavy - Half $4');
    });

    it('has a topping that is removed if set to none', function () {
        let toppingsBuilder = toppingsBuilderFactory();

        toppingsBuilder.buildToppingCategory('new topping', 2);

        const newTopping = toppingsBuilder.toppings['new topping'];
        newTopping.heavy();
        newTopping.none();

        expect(newTopping.hasAny()).to.be.false;
        expect(newTopping.getAmmount()).to.be.within(0, 0.001);
        expect(newTopping.getTopping()).to.be.equal('new topping None $0');
    });
});