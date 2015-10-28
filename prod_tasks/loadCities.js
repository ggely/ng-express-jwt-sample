if (process.env.CITIES_PATH) {
    var mongoose = require('mongoose');
    var app = require('../server/server');
    var City = mongoose.model('City');
    var fs = require('fs');
    var join = require('path').join;

    City.collection.remove(function (err) {
        if (err) throw err;

        fs.readFile(join(__dirname,'../' ,process.env.CITIES_PATH.trim()), 'utf8', function (err, data) {
            if (err) throw err;
            var cities = JSON.parse(data);
            City.collection.insert(cities, function (err, user) {
                console.log("Import success");
                process.exit()
            });
        });
    })
} else {
    throw new Error("No file defined");
    process.exit()
}

