var mongoose = require('mongoose');

var User = mongoose.model('User', {
    email: {
        type: String,
        trim: true,
        minlength: 1,
        requires: true
    }
});

module.exports = {
    User
};