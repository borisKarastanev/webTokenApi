'use strict';
let jwt = require('jsonwebtoken');
let crypto = require('crypto');

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

SecureApi.prototype._genRandomSalt = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

SecureApi.prototype.genHashedPassword = function (password, salt) {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);

    let val = hash.digest('hex');
    return {
        salt: salt,
        hashedPass: val
    };
};

SecureApi.prototype.saltHashUserPassword = function (password) {
    let salt;
    let _securedPassword;
    try {
        salt = this._genRandomSalt(16);
    }
    catch (err) {
        throw new Error(err);
    }

    try {
        _securedPassword = this.genHashedPassword(password, salt);
    }
    catch (err) {
        throw new Error(err);
    }

    return _securedPassword;
};

module.exports = new SecureApi();
