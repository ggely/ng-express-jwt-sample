require('logien');

// Dependencies
require('angular-mocks');
var chai = require('chai');
chai.use('sinon-chai');
chai.use('chai-as-promised');

var sinon = require('sinon');

beforeEach(function() {
    // Create a new sandbox before each test
    this.sinon = sinon.sandbox.create();
});

afterEach(function() {
    // Cleanup the sandbox to remove all the stubs
    this.sinon.restore();
});

module.exports = {
    rootUrl: 'http://localhost:3000',
    expect: chai.expect
};