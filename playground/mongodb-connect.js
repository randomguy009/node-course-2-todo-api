// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to server');
    }
    console.log('Connected to server');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something here',
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to do shit', err);
    //     }

    //     return console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.collection('Users').insertOne({
        name: 'Eshwar',
        age: 24,
        location:'Pune'
    }, (err, result) => {
        if(err) {
            return console.log('Unable to do shit', err);
        }

        return console.log(JSON.stringify(result.ops, undefined, 2));
    });

    client.close();
});