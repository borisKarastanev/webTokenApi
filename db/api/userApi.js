'use strict';
let User = require('../models/user');
let jwt = require('jsonwebtoken');

function UserApi() {
}

// Start Private methods
// End Private methods

UserApi.prototype.createNewUser = function createNewUser(data, callback) {
    if (typeof data !== 'object' || data === null) {
        throw new Error('Object required!');
    }

    if (typeof callback !== 'function' || callback === null) {
        throw new Error('Callback required');
    }

    let _user = new User(data);
    _user.save(function (err) {
        if (err) {
            callback(err.message);
        }
        else {
            //TODO Implement a user Log
            callback(null, {success: true});
        }
    });

    //TODO Hash and salt UserPasswords

};

UserApi.prototype.deleteUser = function (uid, callback) {
    if (typeof uid !== 'string' || uid === null) {
        throw new Error('Valid user id required');
    }

    if (typeof callback !== 'function' || callback === null) {
        throw new Error('Callback required');
    }

    User.remove({_id: uid}, function (err, result) {
        if (err) {
            callback({success: false, message: err.message})
        }
        else {
            if (result.result.n > 0) {
                callback(null, {success: true, message: 'Successfully deleted user!'});
            }
            else {
                callback(null, result);
            }
        }
    });
};

UserApi.prototype.authenticateUser = function (credentials, authSecret, callback) {
    if (typeof credentials !== 'object' || credentials === null) {
        throw new Error('Object required!');
    }

    if (typeof callback !== 'function' || callback === null) {
        throw new Error('Callback required');
    }

    User.findOne({
        name: credentials.name,
        password: credentials.password
    }, function (err, user) {
        if (err) {
            throw new Error(err);
        }

        if (!user) {
            callback({
                success: false,
                message: 'Authentication failed.'
            });
        }
        else {
            let token = jwt.sign(user, authSecret, {
                expiresIn: 120 // expires in 2 hours
            });
            callback(null, {
                success: true,
                message: 'Welcome back ' + user.name,
                token: token
            });
        }
    });
};

UserApi.prototype.getAllUsers = function (callback) {
    if (typeof callback !== 'function' || callback === null) {
        throw new Error('Callback required');
    }

    let _projection = {password: 0};
    User.find({}, _projection, function (err, result) {
        if (err) {
            throw new Error(err);
        }

        if (!result) {
            return callback({success: false, message: 'No users Found!'});
        }
        else {
            callback(null, result);
        }
    });
};

module.exports = UserApi;
