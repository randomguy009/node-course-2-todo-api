var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {
    app
};
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp');

// var Todo = mongoose.model('Todo', {
//     text: {
//         type: String,
//         required: true,
//         minlength: 1,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     completedAt: {
//         type: Number,
//         default: null
//     }
// });

// var User = mongoose.model('User', {
//     email: {
//         type: String,
//         trim: true,
//         minlength: 1,
//         requires: true
//     }
// });

// var newUser = new User({
//     email: 'eshwar@gmail.com'
// })

// newUser.save().then((doc) => {
//     console.log('New User Added', doc);
// }).catch((e) => {
//     console.log(e);
// });

// var newTodo = new Todo({
//     text: 'give a shit',
//     completed: false,
//     completedAt: 2400,
//     email: 'eshwar@gmail.com'

// });

// newTodo.save().then((doc) => {
//     console.log('Saved Todo', doc);
// }).catch((e) => {
//     console.log(e);
// });