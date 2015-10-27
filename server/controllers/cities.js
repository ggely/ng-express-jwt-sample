var mongoose = require('mongoose');
var City = mongoose.model('City');
exports.searchByName = function (req, res) {
    var name = req.query.name || '';
    City.searchByName(name, function (err, cities) {
        if (err) return res.status(500).send({error: 'Enable to find users'});
        res.json(cities);
    });
};