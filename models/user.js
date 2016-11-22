'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Model name is singular and mongoose searches/creates a plural collection e.g User => users in the mongo cli
module.exports = mongoose.model('User', new Schema({
    name: String,
    password: String,
    admin: Boolean
}));
