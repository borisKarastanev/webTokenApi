'use strict';

let jwt = require('jsonwebtoken');

let User = require('../models/user');
let secureApi = require('./secureApi');
let userLogApi = require('./userLogApi');

function UserApi() {
}

// Start Private methods
// End Private methods

UserApi.prototype.createNewUser = function createNewUser(data) {
    return new Promise((resolve, reject) => {
        if (typeof data !== 'object' || data === null) {
            reject(new Error('Object required!'));
        }

        let _securedUsrPass = secureApi.saltHashUserPassword(data.password);
        data.password = _securedUsrPass.hashedPass + _securedUsrPass.salt;
        data.salt = _securedUsrPass.salt;

        let _user = new User(data);
        _user.save()
            .then(() => {
                resolve({ success: true });
            })
            .catch((error) => {
                reject(error.message);
            });
    });
};

UserApi.prototype.deleteUser = function (uid) {
    return new Promise((resolve, reject) => {
        if (typeof uid !== 'string' || uid === null) {
            reject(new Error('Valid user id required'));
        }

        const data = { _id: uid };

        User.remove(data)
            .then((action) => {
                if (action.result.n > 0) {
                    resolve({
                        success: true,
                        message: 'Successfully deleted user!'
                    });
                } else {
                    resolve(action);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

UserApi.prototype.authenticateUser = function (credentials, authSecret) {
    const self = this;
    const userDetails = { name: credentials.name };

    return new Promise((resolve, reject) => {
        if (typeof credentials !== 'object' || credentials === null) {
            reject(new Error('Object required!'));
        }

        User.findOne(userDetails)
            .then((user) => {
                if (!user) {
                    reject({
                        success: false,
                        message: 'Authentication failed.'
                    });
                } else {
                    const hashedUserPass = secureApi.genHashedPassword(credentials.password, user.salt);
                    const validUserPass = hashedUserPass.hashedPass + hashedUserPass.salt;

                    if (validUserPass === user.password) {
                        const token = jwt.sign(user, authSecret, { expiresIn: 120 });
                        const loginLogDetails = {
                            usrId: user._id,
                            usrName: user.name,
                            usrIp: credentials.usrIp,
                            isLoggedIn: true
                        };

                        userLogApi.insertInLoginLog(loginLogDetails)
                            .then(() => {
                                resolve({
                                    success: true,
                                    message: 'Welcome back ' + user.name,
                                    token: token
                                });
                            })
                            .catch((error) => {
                                reject(error);
                            });

                    } else {
                        const failed = {
                            success: false,
                            message: 'Authentication failed.'
                        }

                        reject(failed);
                    }
                }
            })
            .catch((error) => {
                reject(error);
            });
    });

};

UserApi.prototype.getAllUsers = function (callback) {
    if (typeof callback !== 'function' || callback === null) {
        throw new Error('Callback required');
    }

    let _projection = { password: 0, salt: 0 };
    User.find({}, _projection, function (err, result) {
        if (err) {
            throw new Error(err);
        }

        if (!result) {
            return callback({ success: false, message: 'No users Found!' });
        }
        else {
            callback(null, result);
        }
    });
};

module.exports = UserApi;
