var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var username = 'eshwar';
var password = 'eshwar';

// `mongodb://${username}:${password}@ds211440.mlab.com:11440/node-todo` ||

mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};