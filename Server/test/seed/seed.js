const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'eshwar@gmail.com',
    password: 'pass1',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'accha').toString()
    }]
}, {
    _id: userTwoId,
    email: 'naidu@gmail.com',
    password: 'pass2',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, 'accha').toString()
    }]
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second',
    completed: true,
    completedAt: 11313,
    _creator: userTwoId
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        Promise.all([userOne, userTwo]);
    }).then(() => done());
};
 
const populateTodos = (done) => {
    Todo.remove({}).then(() => {
    Todo.insertMany(todos);
    }).then(() => done());
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};
