'use strict';

describe('toppings', function () {
    const applicationEnvironment = require('../../applicationEnvironment');
    const testEnvironment = require('../testEnvironment');

    testEnvironment.build('approvalsConfigFactory');

    const { asInformationString } = testEnvironment.build('objectInformation');
    const { assert } = testEnvironment.build('chai');

    let toppings;

    beforeEach(function () {
        const testContext = applicationEnvironment.new();
        toppings = testContext.build('toppings');
    });

    it('should have a failing test -- delete this test!', function () {
        assert.isTrue(false);
    });
});
