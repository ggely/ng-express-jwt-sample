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

    },
    findOrCreateByUser: function (user, cb) {
        this.findOne({user: user._id}, function (err, followedCities) {
            if(err) return cb(err);
            if (!followedCities) {
                followedCities = new this.model({
                    user: user,
                    cities: []
                });
                followedCities.save(function (err, res) {
                    if(err) return cb(err);
                    return cb(null, res);
                });
            } else {
                return cb(null, followedCities);
            }
        });
    }
};

mongoose.model('FollowedCities', FollowedCitiesSchema);
