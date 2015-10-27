var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CitySchema = new Schema(
    {
        ref:  Number,
        name:   { type: String, index: true },
        country:  String,
        coord: {
            lon:  Number,
            lat:  Number
        }
    }
);
CitySchema.statics = {
    searchByName: function (name, cb) {
        var re = new RegExp("^" + name, "i");
        this.where('name').regex(re)
            .limit(10).
            sort('name').
            select('name country coord ref').
            exec(cb);
    }
};

mongoose.model('City', CitySchema);
