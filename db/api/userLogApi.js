'use strict';

let Log = require('../models/userLog');

function UserLogApi() {
}

// Start Private methods

UserLogApi.prototype._conveertIpToInt = function (ip) {
    throw new Error('Not implemented yet');
};

UserLogApi.prototype._convertIpToStr = function (ip) {
    throw new Error('Not implemented yet');
};

// End Private methods

UserLogApi.prototype.insertInLoginLog = function (data, callback) {
    throw new Error('Not implemented yet');
};

UserLogApi.prototype.insertLogoutTs = function (usrId, callback) {
    throw new Error('Not implemented yet');
};

module.exports = new UserLogApi();
