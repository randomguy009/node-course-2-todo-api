const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var msg = 'i am the best';

var hash = SHA256(msg).toString();

console.log(hash);

var data = {
    id: 9090
};

var token = jwt.sign(data, 'accha');
console.log(token);

var decoded = jwt.verify(token, 'accha');
console.log(decoded);