var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FollowedCitiesSchema = new Schema(
    {
        user: {type: Schema.ObjectId, ref: 'User'},
        cities: [{type: Schema.ObjectId, ref: 'City'}]

    }
);
FollowedCitiesSchema.statics = {
    load: function (options, cb) {
        this.findOne(options)
            .populate({path: 'cities', select: 'ref name country coord'})
            .exec(cb);

    }
};

mongoose.model('FollowedCities', FollowedCitiesSchema);
