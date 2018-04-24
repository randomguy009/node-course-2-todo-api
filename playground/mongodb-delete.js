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

    // db.collection('Users').find({name: 'Ram'}).count().then((count) => {
    //     console.log(count);     
    // }, (err) => {
    //     console.log('ok bye');
    // });

    // db.collection('Users').deleteMany({name: 'Eshwar'}).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndDelete(new ObjectID("5addef53c5a43c407da7259e")).then((result) => {
        console.log(result);
    });
    //client.close();
});