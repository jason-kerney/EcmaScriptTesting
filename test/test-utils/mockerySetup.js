'use strict';

function mockerySetup(mockery, ...allowables) {
    let standard = [
        './types', 
        'signet', 
        'signet-assembler', 
        'signet-checker', 
        'signet-parser', 
        'signet-registrar', 
        'signet-typelog', 
        'signet-validator', 
        './bin/signet', 
        './bin/duckTypes', 
        './bin/coreTypes', 
        './bin/recursiveTypes'
    ].concat(allowables);
    
    mockery.registerAllowables(standard);
}

module.exports = {mockerySetup};