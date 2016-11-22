'use strict';

let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let morgan = require('morgan');
let mongoose = require('mongoose');

let jwt = require('jsonwebtoken');
let config = require('./config');
let User = require('./models/user');

const PORT = process.env.PORT || config.port;

mongoose.connect(config.database);

app.set('authSecret', config.secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', function (req, res) {
    res.send('Hello world');
});

app.listen(PORT);


