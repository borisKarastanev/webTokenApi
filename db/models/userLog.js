'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

module.exports = mongoose.model('UserLog', new Schema({
    usrId: String,
    usrName: String,
    usrIp: Number,
    tsStart: {
        type: Date,
        default: Date.now
    },
    tsEnd: {
        type: Date,
        default: Date.now
    }
}));
