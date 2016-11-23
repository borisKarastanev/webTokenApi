'use strict';

let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let morgan = require('morgan');
let mongoose = require('mongoose');

let jwt = require('jsonwebtoken');
let config = require('./config');
let UserApi = require('./db/api/userApi');
let usrApi = new UserApi();

const PORT = process.env.PORT || config.port;

mongoose.connection.on('open', function () {
    console.log('Database connection established!');
}).on('error', function (err) {
    console.error(err);
});

mongoose.connect(config.database);

app.set('authSecret', config.secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', function (req, res) {
    if (mongoose.connection.readyState !== 0) {
        res.send('Hello world');
    }
    else {
        res.send('Unable to connect to database!');
    }

});

// For test purposes only
app.get('/addNewUser', function (req, res) {
    let userData = {
        name: 'Niki Lauda',
        password: 'test123',
        admin: false
    };

    usrApi.createNewUser(userData, function (err, result) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(result);
        }
    });
});


app.listen(PORT);


