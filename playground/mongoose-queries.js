const {mongoose} = require('./../Server/db/mongoose');
const {Todo} = require('./../Server/models/todo');
const {User} = require('./../Server/models/user');

var id = '5ae0592cad20b1d12590a4c1';

// Todo.find({
//     _id : id
// }).then((todos) => {
//     console.log(todos);
// });

// Todo.findOne({
//     _id : id
// }).then((todo) => {
//     console.log(todo);
// });

User.findById({
    _id : id
}).then((user) => {
    if (user) {
       return console.log(JSON.stringify(user, undefined, 2));
    }
    console.log('Nothing here');
}).catch((e) => {
    console.log('Invalid ID');
});


