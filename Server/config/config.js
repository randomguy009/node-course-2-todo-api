var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    var config = require('./config.json');

    var envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
} else {
    if (env === 'production') {
        var username = 'eshwar';
        var password = 'eshwar';
        process.env.MONGODB_URI = `mongodb://${username}:${password}@ds211440.mlab.com:11440/node-todo`;
    }
}


// if (env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// } else if (env === 'production') {
//     var username = 'eshwar';
//     var password = 'eshwar';
//     process.env.MONGODB_URI = `mongodb://${username}:${password}@ds211440.mlab.com:11440/node-todo`;
// }