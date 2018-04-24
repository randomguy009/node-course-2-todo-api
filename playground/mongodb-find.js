const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to server');
    }
    console.log('Connected to server');
    const db = client.db('TodoApp');

    // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
    //     if (docs.length == 0) {
    //         console.log('Kuch nahi hai bc');
    //     } else {
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     }
    //     }, (err) => {
    //     console.log('please stfu');
    // });

    db.collection('Users').find({name: 'Ram'}).count().then((count) => {
        console.log(count);
    }, (err) => {
        console.log('ok bye');
    });

    client.close();
});