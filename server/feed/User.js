
var mongoose = require('mongoose');
var User = mongoose.model('User');

User.findOne({'isAdmin': true}, function (err, admin) {
   if(!admin && !err){
       var user = new User({
           email: 'admin@admin.com',
           password: 'admin',
           isAdmin: true
       });
       user.save();
   }
});

