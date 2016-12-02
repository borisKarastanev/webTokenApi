'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

module.exports = mongoose.model('UserLoginLog', new Schema({
    usrId: String,
    usrName: String,
    usrIp: Number,
    tsStart: {
        type: Date,
        default: Date.now
    },
    tsEnd: {
        type: Date,
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    }
}));
