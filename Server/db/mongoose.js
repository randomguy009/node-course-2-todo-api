var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://randomguy009:19@mumbai@ds211440.mlab.com:11440/node-todo' || 'mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};