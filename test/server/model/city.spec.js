var helper = require('../helper');
var should = require('should');
var mongoose = require('mongoose');
var City = mongoose.model('City');

describe("Cities", function () {
    it("can be created", function (done) {
        var city = new City({
                "ref": 6455259,
                "name": "Paris",
                "country": "FR",
                "coord": {"lon": 2.35236, "lat": 48.856461}
            }
        );
        city.save(function (err, result) {
            should.not.exist(err);
            should.exist(result);
            result.ref.should.equal(6455259);
            result.name.should.equal("Paris");
            done();
        })
    });
    it("can be search by name (start, case insensitive)", function (done) {
        var city = new City({
            "ref": 6077243,
            "name": "Montreal",
            "country": "CA",
            "coord": {"lon": -73.587807, "lat": 45.508839}
        });
        city.save(function (err, result) {
            should.not.exist(err);
            should.exist(result);
            City.searchByName("mon", function (err, res) {
                should.not.exist(err);
                should.exist(res);
                (res.length == 1).should.be.ok;
                (res[0].ref == 6077243).should.be.ok;
                done();
            });

        })
    });
});
