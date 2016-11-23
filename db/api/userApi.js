'use strict';
let User = require('../models/user');
let jwt = require('jsonwebtoken');

function UserApi() {}

UserApi.prototype.createNewUser = function createNewUser(data, callback) {
    if(typeof data !== 'object' && data === null) {
        throw new Error('Object required!');
    }

    let _user = new User(data);
    //TODO Hash and salt UserPasswords
    _user.save(function (err) {
        if (err) {
            callback(new Error(err));
        }
        else {
            //TODO Implement a user Log
            callback(null, {success: true});
        }
    });
};

UserApi.prototype.authenticateUser = function (credentials, authSecret, callback) {
    if(typeof credentials !== 'object' && credentials === null) {
        throw new Error('Object required!');
    }

    User.findOne({
        name: credentials.name,
        password: credentials.password
    }, function (err, user) {
        if (err) {
            throw new Error(err);
        }

        if (!user) {
            callback(null, {success: false, message: 'Authentication failed.'})
        }
        else {
            let token = jwt.sign(user, authSecret, {
                expiresIn: 120 // expires in 2 hours
            });
            callback(null, {success: true, message: 'Welcome back ' + user.name, token: token});
        }
    });
};

module.exports = UserApi;
