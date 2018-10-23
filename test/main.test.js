'use strict';

const mockery = require('mockery');
const { mockerySetup } = require('./test-utils/mockerySetup');
const sinon = require('sinon');
const { expect } = require('chai');
const { asInformationString } = require('object-information');

describe('main', function () {
    let main;
    let askSpy;
    let regularSpy;
    let hasAnySpy;
    let getToppingSpy;
    let getTotalSpy;
    let deliverSpy;
    let answers;

    before(function () {
        mockery.enable();
    });

    beforeEach(function () {
        mockerySetup(mockery, '../app/main', 'async', 'util');

        regularSpy = sinon.spy();
        hasAnySpy = sinon.spy(() => true);
        getToppingSpy = sinon.spy(() => 'a topping');
        getTotalSpy = sinon.spy(() => 123.45);
        deliverSpy = sinon.spy(() => 'delivered it');

        mockery.registerMock('./pizzaBuilder', () =>
            ({
                'my topping':
                {
                    'regular': regularSpy,
                    'hasAny': hasAnySpy,
                    'getTopping': getToppingSpy
                },
                'getTotal': getTotalSpy,
                'deliver': deliverSpy
            })
        );
        answers = ['my topping', 'regular', 'no'].reverse();
        askSpy = sinon.spy(continuation => continuation(answers.pop()));

        class PromptMock {
            constructor() {
                this.ask = askSpy;
            }
        }

        mockery.registerMock('prompt-list', PromptMock);

        main = require('../app/main');
    });

    afterEach(function () {
        mockery.deregisterAll();
    });

    after(function () {
        mockery.disable();
    });

    it('runs', function (done) {
        function finish() {
            let askExpected = `[
    [
        "Function: requestTopping"
    ],
    [
        "Function: requestAmount"
    ],
    [
        "Function: wantToContinue"
    ]
]`;
            let asked = asInformationString(askSpy.args);
            expect(asked).to.be.equal(askExpected);

            expect(regularSpy.args).to.be.deep.equal([[]]);
            expect(hasAnySpy.args).to.be.deep.equal([[], []]);
            expect(getToppingSpy.args).to.be.deep.equal([[], []]);
            expect(getTotalSpy.args).to.be.deep.equal([[], []]);
            expect(deliverSpy.args).to.be.deep.equal([[]]);

            done();
        }
        main(finish);

    });
});