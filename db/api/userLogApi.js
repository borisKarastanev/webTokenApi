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

UserLogApi.prototype.insertInLoginLog = function (data) {
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

UserLogApi.prototype.insertLogoutTs = function (usrId) {
    throw new Error('Not implemented yet');
};

UserLogApi.prototype.readLoginLog = function () {
    const self = this;

    // Using the lean query parameter to return a plain JS Object rather than full model instance
    return LoginLog.find({}).lean().exec()
        .then((log) => {
            if (!log) {
                return {
                    success: false,
                    message: 'Error reading User Login Log'
                }
            } else {
                for (let i = 0; i < log.length; i++) {
                    let formatDate = new Date(log[i].tsStart);
                    log[i].tsStart = formatDate.toTimeString();
                    log[i].userIp = self._convertIpToStr(log[i].usrIp);
                }
                return log;
            }
        })
        .catch((readLogError) => {
            return Promise.reject(readLogError);
        });
};

UserLogApi.prototype.readLoginLogById = function (usrId) {
    const self = this;

    return LoginLog.find({ usrId: usrId }).lean().exec()
        .then((log) => {
            if (!log) {
                return {
                    success: false,
                    message: 'Error reading User Login Log'
                }
            } else {
                for (let i = 0; i < log.length; i++) {
                    let formatDate = new Date(log[i].tsStart);
                    log[i].tsStart = formatDate.toTimeString();
                    log[i].usrIp = self._convertIpToStr(log[i].usrIp);
                }
                return log;
            }

        })
        .catch((readLogError) => {
            return Promise.reject(readLogError);
        });
};

UserLogApi.prototype.readLoginLogByIp = function (usrIp) {
    if (typeof usrIp !== 'string' || usrIp === null) {
        throw new Error('User Ip must be of type String');
    }

    const self = this;
    return self._convertIpToInt(usrIp)
        .then((ipInt) => {
            return LoginLog.find({ usrIp: ipInt }).lean().exec()
        })
        .then((log) => {
            if (!log) {
                return {
                    success: false,
                    message: 'Error reading User Login Log'
                };
            } else {
                for (let i = 0; i < log.length; i++) {
                    let formatDate = new Date(log[i].tsStart);
                    log[i].tsStart = formatDate.toTimeString();
                    log[i].userIp = self._convertIpToStr(log[i].usrIp);
                }
                return log;
            }
        })
        .catch((logByIpError) => {
            return Promise.reject(logByIpError);
        });
};

UserLogApi.prototype.getAllLoggedInUsers = function () {
    const self = this;

    return LoginLog.find({ isLoggedIn: true }).lean().exec()
        .then((log) => {
            if (!log) {
                return {
                    success: false,
                    message: 'Error reading User Login Log'
                };
            }
            else {
                for (let i = 0; i < log.length; i++) {
                    let formatDate = new Date(log[i].tsStart);
                    log[i].tsStart = formatDate.toTimeString();
                    log[i].usrIp = self._convertIpToStr(log[i].usrIp);
                }
                return log;
            }
        })
        .catch((readLogError) => {
            return Promise.reject({ success: false, message: readLogError.message })
        });
};

module.exports = new UserLogApi();
