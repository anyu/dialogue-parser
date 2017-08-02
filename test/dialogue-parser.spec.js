const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/server');
const should = chai.should();
const request = require('request');

chai.use(chaiHttp);

describe('Basic server', function() {
  it('Page loaded', function() {
      request('http://localhost:3000' , function(error, response, body) {
          expect(response.statusCode).to.equal(200);
      });
  });
});