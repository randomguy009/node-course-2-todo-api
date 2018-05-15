const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'okay123';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        bcrypt.compare(password, hash, (err, res) => {
            console.log(res);
        });
    });
});

var hashPass = '$2a$10$LY1O78IFtlrSZ1L5fm/cH.mQwgV36vdQkc9YuN91IvRY9euV97TEK';

bcrypt.compare(password, hashPass, (err, res) => {
    //console.log(res);
});

// var msg = 'i am the best';

// var hash = SHA256(msg).toString();

// console.log(hash);

// var data = {
//     id: 9090
// };

// var token = jwt.sign(data, 'accha');
// console.log(token);

// var decoded = jwt.verify(token, 'accha');
// console.log(decoded);