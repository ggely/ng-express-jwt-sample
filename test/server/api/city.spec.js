var helper = require('../helper');
var request = require('supertest');
var mongoose = require('mongoose');
var City = mongoose.model('City');
var fs = require('fs');

describe('Cities API', function (done) {

    before(function (done) {
        var initCity = function () {
            var cities = JSON.parse(fs.readFileSync('./test/server/cities.json', 'utf8'));
            City.collection.insert(cities, function (err, user) {
                done();
            });
        };
        helper.waitInit(initCity);
    });

    describe('GET /api/cities/', function () {
        it('400 if email not given', function (done) {
            request(helper.app)
                .get('/api/cities/')
                .expect(401)
                .end(done)
        });
        it('return 10 cities if no name provided', function (done) {
            request(helper.app)
                .get('/api/cities/')
                .set('Authorization', helper.getAdminToken())
                .send()
                .expect(function (res) {
                    var total = res.body.length;
                    res.body = {total: total}
                })
                .expect({total: 10})
                .end(done)
        });
        it('return 10 cities if no name provided', function (done) {
            request(helper.app)
                .get('/api/cities/')
                .set('Authorization', helper.getAdminToken())
                .send()
                .expect(function (res) {
                    var total = res.body.length;
                    res.body = {total: total}
                })
                .expect({total: 10})
                .end(done)
        }); it('return 2 cities if name "saint-Ma" provided', function (done) {
            request(helper.app)
                .get('/api/cities/')
                .set('Authorization', helper.getAdminToken())
                .query({ name: 'saint-Ma' })
                .expect(function (res) {
                    var total = res.body.length;
                    res.body = {total: total}
                })
                .expect({total: 2})
                .end(done)
        });
    });
});