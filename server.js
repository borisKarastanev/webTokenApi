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
let userLogApi = require('./db/api/userLogApi');

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
    usrApi.createNewUser(req.body)
    .then((result) => {
        res.json(result);
    })
    .catch((error) => {
        res.json(error);
    })
});

apiRoutes.post('/authenticate', function (req, res) {
    let _authSecret = app.get('authSecret');
    let _usrIp = req.ip || req.connection.remoteAddress;

    // Temporary IPv6 solution for localhost addreses 
    if (_usrIp !== '::1') {
        _usrIp = _usrIp.replace('::ffff:', '');
    } else {
        _usrIp = '127.0.0.1';
    }
   
    req.body.usrIp = _usrIp;

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
/*========= Start User Api ===========*/
apiRoutes.get('/getAllUsers', function (req, res) {
    usrApi.getAllUsers(function (err, users) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(users);
        }
    });
});

apiRoutes.post('/deleteUser/:uid', function (req, res) {
    const uid = req.params.uid || req.body.uid;
    
    usrApi.deleteUser(uid)
    .then((result) => {
        res.json(result);
    })
    .catch((error) => {
        res.json(error);
    });
});
/*========= End User Api ===========*/


/*========= Start User Log Api ===========*/
// Read user login log
apiRoutes.get('/readLoginLog', function (req, res) {
    userLogApi.readLoginLog(function (err, log) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(log);
        }
    });
});

// Read user login log by user id
apiRoutes.get('/readLoginLog/:uid', function (req, res) {
    let _uid = req.params.uid || req.body.uid;

    userLogApi.readLoginLogById(_uid, function (err, log) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(log);
        }
    });
});

// Get all logged in users
apiRoutes.get('/getAllLoggedInUsers', function (req, res) {
    userLogApi.getAllLoggedInUsers(function (err, log) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(log);
        }
    });
});

apiRoutes.post('/readLoginLogByIp', function (req, res) {
    userLogApi.readLoginLogByIp(req.body.usrIp, function (err, log) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(log);
        }
    });
});

/*========= End User Log Api ===========*/

// End Protected endpoints

app.use('/api', apiRoutes);

app.listen(PORT);


