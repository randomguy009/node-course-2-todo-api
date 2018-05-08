require('./config/config')

const _ = require('lodash');

var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const {ObjectID} = require('mongodb');

var port = process.env.PORT;

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

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }).catch((e) => {
        res.status(400).send(e);
    }); 
});

app.get('/todos/:id', (req, res) => {
    //res.send(req.params);
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    else {
        Todo.findById(id).then((todo) => {
            if(!todo) {
                return res.status(404).send();
            }
            res.send({todo});
        }).catch((e) => {
            res.status(400).send();
        });
    }
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate(id, {
        $set: body
    },{
        new: true
    }).then((todo) => {
        if(!todo) {
           return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })


})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
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