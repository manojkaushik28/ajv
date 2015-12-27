'use strict';

var Ajv = require('./ajv')
  , should = require('./chai').should();


describe('issue #50: references with "definitions"', function () {
    it('should be supported by addSchema', function () {
        spec('addSchema');
    });

    it('should be supported by compile', function () {
        spec('compile');
    });


    function spec(method) {
        var result;

        var ajv = Ajv();

        ajv[method]({
            id: 'http://example.com/test/person.json#',
            definitions: {
                name: { type: 'string' }
            },
            type: 'object',
            properties: {
                name: { $ref: '#/definitions/name'}
            }
        });

        ajv[method]({
            id: 'http://example.com/test/employee.json#',
            type: 'object',
            properties: {
                person: { $ref: '/test/person.json#' },
                role: { type: 'string' }
            }
        });

        result = ajv.validate('http://example.com/test/employee.json#', {
            person: {
                name: 'Alice'
            },
            role: 'Programmer'
        });

        result. should.equal(true);
        should.equal(ajv.errors, null);
    }
});
