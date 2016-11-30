'use strict';

let Log = require('../models/userLog');

function UserLogApi() {
}

// Start Private methods

UserLogApi.prototype._convertIpToInt = function (ip) {
    if (typeof ip !== 'string' || ip === null) {
        throw new Error('Ip address must be of type String');
    }

    ip = ip.split('.');

    return ((((((+ip[0])*256)+(+ip[1]))*256)+(+ip[2]))*256)+(+ip[3]);
};

UserLogApi.prototype._convertIpToStr = function (ipInt) {
    if (typeof ipInt !== 'number' || ipInt === null) {
        throw new Error('Ip address must be of type Number');
    }

    let ipDot = ipInt % 256;

    for (let i = 3; i > 0; i--) {
        ipInt = Math.floor(ipInt / 256);
        ipDot = ipInt % 256 + '.' + ipDot;
    }

    return ipDot;
};

// End Private methods

UserLogApi.prototype.insertInLoginLog = function (data, callback) {
    throw new Error('Not implemented yet');
};

UserLogApi.prototype.insertLogoutTs = function (usrId, callback) {
    throw new Error('Not implemented yet');
};

module.exports = new UserLogApi();
