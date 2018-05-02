var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://eshwar:eshwar@ds211440.mlab.com:11440/node-todo' || 'mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};