'use strict';

let LoginLog = require('../models/userLoginLog');

function UserLogApi() {
}

// Start Private methods

UserLogApi.prototype._convertIpToInt = function (ip) {
    return new Promise((resolve, reject) => {
        if (typeof ip !== 'string' || ip === null) {
            return Promise.reject(new Error('Ip address must be of type String'));
        }

        ip = ip.split('.');

        const intIp = ((((((+ip[0]) * 256) + (+ip[1])) * 256) + (+ip[2])) * 256) + (+ip[3]);
        resolve(intIp);
    });
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
    const self = this;
    return new Promise((resolve, reject) => {
        if (typeof data !== 'object' || data === null) {
            reject(new Error('Data must be of type Object'));
        }

        self._convertIpToInt(data.usrIp)
            .then((intIp) => {
                data.usrIp = intIp;
                const log = new LoginLog(data);

                return log.save(data)
            })
            .then((success) => {
                resolve({ success: true });
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    });
};

UserLogApi.prototype.insertLogoutTs = function (usrId, callback) {
    throw new Error('Not implemented yet');
};

UserLogApi.prototype.readLoginLog = function (callback) {
    if (typeof callback !== 'function' || callback === null) {
        throw new Error('Callback required');
    }

    let self = this;

    // Using the lean query parameter to return a plain JS Object rather than full model instance
    LoginLog.find({}).lean().exec(function (err, result) {
        if (err) {
            callback({ success: false, message: err.message })
        }

        if (!result) {
            return callback({
                success: false,
                message: 'Error reading User Login Log'
            });
        }
        else {
            for (let i = 0; i < result.length; i++) {
                let _formatDate = new Date(result[i].tsStart);
                result[i].tsStart = _formatDate.toTimeString();
                result[i].usrIp = self._convertIpToStr(result[i].usrIp);
            }
            callback(null, result);
        }
    });
};

UserLogApi.prototype.readLoginLogById = function (usrId, callback) {
    if (typeof usrId !== 'string' || usrId === null) {
        throw new Error('User Id must be of type String');
    }

    if (typeof callback !== 'function' || callback === null) {
        throw new Error('Callback required');
    }

    let self = this;

    LoginLog.find({ usrId: usrId }).lean().exec(function (err, result) {
        if (err) {
            callback({ success: false, message: err.message })
        }

        if (!result) {
            return callback({
                success: false,
                message: 'Error reading User Login Log'
            });
        }
        else {
            for (let i = 0; i < result.length; i++) {
                let _formatDate = new Date(result[i].tsStart);
                result[i].tsStart = _formatDate.toTimeString();
                result[i].usrIp = self._convertIpToStr(result[i].usrIp);
            }
            callback(null, result);
        }
    })
};

UserLogApi.prototype.readLoginLogByIp = function (usrIp, callback) {
    if (typeof usrIp !== 'string' || usrIp === null) {
        throw new Error('User Id must be of type String');
    }

    if (typeof callback !== 'function' || callback === null) {
        throw new Error('Callback required');
    }
    let self = this;
    let _usrIp = self._convertIpToInt(usrIp);

    LoginLog.find({ usrIp: _usrIp }).lean().exec(function (err, result) {
        if (err) {
            callback({ success: false, message: err.message })
        }

        if (!result) {
            return callback({
                success: false,
                message: 'Error reading User Login Log'
            });
        }
        else {
            for (let i = 0; i < result.length; i++) {
                let _formatDate = new Date(result[i].tsStart);
                result[i].tsStart = _formatDate.toTimeString();
                result[i].usrIp = self._convertIpToStr(result[i].usrIp);
            }
            callback(null, result);
        }
    });
};

UserLogApi.prototype.getAllLoggedInUsers = function (callback) {
    if (typeof callback !== 'function' || callback === null) {
        throw new Error('Callback required');
    }

    let self = this;

    LoginLog.find({ isLoggedIn: true }).lean().exec(function (err, result) {
        if (err) {
            callback({ success: false, message: err.message })
        }

        if (!result) {
            return callback({
                success: false,
                message: 'Error reading User Login Log'
            });
        }
        else {
            for (let i = 0; i < result.length; i++) {
                let _formatDate = new Date(result[i].tsStart);
                result[i].tsStart = _formatDate.toTimeString();
                result[i].usrIp = self._convertIpToStr(result[i].usrIp);
            }
            callback(null, result);
        }
    });
};

module.exports = new UserLogApi();
