'use strict';

describe('EcmaScriptTests', function () {
    const applicationEnvironment = require('../applicationEnvironment');
    const testEnvironment = require('./testEnvironment');

    testEnvironment.build('approvalsConfigFactory');

    const sinon = testEnvironment.build('sinon');
    const { asInformationString } = testEnvironment.build('objectInformation');
    const { assert } = testEnvironment.build('chai');

    let testContext;

    beforeEach(function () {
        testContext = applicationEnvironment.new();
    });

    it('Runs Index', function() {
        //Do something
        //main();
        assert.isOk(false);
    });

    it('Runs main', function () {
        const main = testContext.build('main');
        //Do something
        //main();
        assert.isOk(false);
    });
});
