'use strict';
let User = require('../models/user');

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

module.exports = UserApi;
