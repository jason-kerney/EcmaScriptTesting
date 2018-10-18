'use strict';

describe('pizzaBuilder', function () {
    const applicationEnvironment = require('../../applicationEnvironment');
    const testEnvironment = require('../testEnvironment');

    testEnvironment.build('approvalsConfigFactory');

    const { asInformationString } = testEnvironment.build('objectInformation');
    const { assert } = testEnvironment.build('chai');

    let pizzaBuilder;

    beforeEach(function () {
        const testContext = applicationEnvironment.new();
        pizzaBuilder = testContext.build('pizzaBuilder');
    });

    it('should have a failing test -- delete this test!', function () {
        assert.isTrue(false);
    });
});
