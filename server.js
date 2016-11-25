'use strict';

let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let morgan = require('morgan');
let mongoose = require('mongoose');
let apiRoutes = express.Router();

let config = require('./config');
let UserApi = require('./db/api/userApi');
let usrApi = new UserApi();
let secureApi = require('./db/api/secureApi');

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

// Start public endpoints
app.get('/', function (req, res) {
    if (mongoose.connection.readyState !== 0) {
        res.send('Hello world');
    }
    else {
        res.send('Unable to connect to database!');
    }
});

apiRoutes.post('/createNew', function (req, res) {
    usrApi.createNewUser(req.body, function (err, result) {
        console.log('Result?? ', err);
        if (err) {
            res.json(err);
        }
        else {
            res.json(result);
        }
    });
});

apiRoutes.post('/authenticate', function (req, res) {
    let _authSecret = app.get('authSecret');
    usrApi.authenticateUser(req.body, _authSecret, function (err, result) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(result);
        }
    });
});

// End public endpoints

// Routes Middleware
apiRoutes.use(function (req, res, next) {
    let token = req.body.token || req.query.token
        || req.headers['x-access-token'];
    let _secret = app.get('authSecret');

    if (token) {
        secureApi.verifyToken(token, _secret, function (err, result) {
            if (err) {
                return res.json(err)
            }
            else {
                req.decoded = result;
                next();
            }
        });
    }
    else {
        return res.status(403).send({
            success: false,
            message: 'Please provide a valid token'
        });
    }
});

// Start Protected endpoints
apiRoutes.post('/getAllUsers', function (req, res) {
    usrApi.getAllUsers(function (err, users) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(users);
        }
    });
});

// End Protected endpoints

app.use('/api', apiRoutes);

app.listen(PORT);


