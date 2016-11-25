'use strict';
let jwt = require('jsonwebtoken');

function SecureApi() {}

SecureApi.prototype.verifyToken = function (token, secret, callback) {
    if (typeof token!== 'string' && token === null) {
        throw new Error('Token required!');
    }
    else if (!secret && secret === null) {
        throw new Error('Secret required!');
    }

    jwt.verify(token, secret, function (err, decoded) {
        if (err) {
            callback({success: false, message: 'Failed to authenticate token'});
        }
        else {
            callback(null, decoded);
        }
    });
};

module.exports = new SecureApi();
