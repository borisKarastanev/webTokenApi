'use strict';
let crypto = require('crypto');
let User = require('../models/user');
let jwt = require('jsonwebtoken');

function UserApi() {
}

// Start Private methods
UserApi.prototype._genRandomSalt = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

UserApi.prototype._genHashedPassword = function (password, salt) {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);

    let val = hash.digest('hex');
    return {
        salt: salt,
        hashedPass: val
    };
};

UserApi.prototype._saltHashUserPassword = function (password) {
    let salt;
    let _securedPassword;
    try {
        salt = this._genRandomSalt(16);
    }
    catch (err) {
        throw new Error(err);
    }

    try {
        _securedPassword = this._genHashedPassword(password, salt);
    }
    catch (err) {
        throw new Error(err);
    }

    return _securedPassword;
};
// End Private methods

UserApi.prototype.createNewUser = function createNewUser(data, callback) {
    if (typeof data !== 'object' || data === null) {
        throw new Error('Object required!');
    }

    if (typeof callback !== 'function' || callback === null) {
        throw new Error('Callback required');
    }

    let _securedUsrPass = this._saltHashUserPassword(data.password);
    data.password = _securedUsrPass.hashedPass + _securedUsrPass.salt;
    data.salt = _securedUsrPass.salt;

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
                callback(null, {
                    success: true,
                    message: 'Successfully deleted user!'
                });
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
    let self = this;

    User.findOne({
        name: credentials.name,
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
            let _hashedUsrPass = self._genHashedPassword(
                credentials.password, user.salt
            );
            let _validUsrPass = _hashedUsrPass.hashedPass + _hashedUsrPass.salt;

            if (_validUsrPass === user.password) {
                let token = jwt.sign(user, authSecret, {
                    expiresIn: 120 // expires in 2 hours
                });
                callback(null, {
                    success: true,
                    message: 'Welcome back ' + user.name,
                    token: token
                });
            }
            else {
                callback({
                    success: false,
                    message: 'Authentication failed.'
                });
            }
        }
    });
};

UserApi.prototype.getAllUsers = function (callback) {
    if (typeof callback !== 'function' || callback === null) {
        throw new Error('Callback required');
    }

    let _projection = {password: 0, salt: 0};
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
