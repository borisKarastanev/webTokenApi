'use strict';

let LoginLog = require('../models/userLoginLog');

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
    if (typeof data !== 'object' || data === null) {
        throw new Error('Data must be of type Object');
    }

    if (typeof callback !== 'function' || callback === null) {
        throw new Error('Callback required');
    }

    try {
        data.usrIp = this._convertIpToInt(data.usrIp);
    }
    catch (err) {
        console.error(err);
    }

    let _log = new LoginLog(data);
    _log.save(function (err) {
        if (err) {
            callback(err.message);
        }
        else {
            callback(null, {success: true});
        }
    });
};

UserLogApi.prototype.insertLogoutTs = function (usrId, callback) {
    throw new Error('Not implemented yet');
};

module.exports = new UserLogApi();
