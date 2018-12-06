var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var user = mongoose.Schema({
    uid: {
        type: Number,
        index: true,
        unique: true
    },
    first_name: String,
    last_name: String,
    company_name: String,
    city: String,
    state: String,
    zip: Number,
    email: {
        type: String,
        index: true,
        unique: true
    },
    web: String,
    age: Number
}, {
    versionKey: false
});

user.plugin(mongoosePaginate);

module.exports = mongoose.model('User', user);