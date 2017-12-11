//This is where the server starts.
//It defines dependencies, set configurations and routes requests to
//different "controllers"
'use strict';
//Dependencies
const db = require('./db.js');
const path = require('path');
const Response = require('./response.js');
const picture = require('./picture.js');
const user = require('./user.js');
//External dependencies
const express = require('express');
const crypto = require('crypto');
const bodyParser = require("body-parser");
const multer = require('multer');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cookieEncrypter = require('../../node_modules/cookie-encrypter');
//Configs
const port = 8001;
const imageDirectory = 'server/assets';
const imageUrl = '/image';
const appDirectory = "app";
//Use expressjs
const expressHandler = express();
//Define where to store sessions, in this case it's in
//memory. Restart server will clear session.
const MemoryStore = session.MemoryStore;
//Use multer to handle multipart/form-data request,
//use this to upload image files
var upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, imageDirectory);
        },
        filename: function(req, file, cb) {
            crypto.pseudoRandomBytes(16, function(err, raw) {
                if (err) return cb(err);
                cb(null, raw.toString('hex') + path.extname(file.originalname));
            });
        }
    })
});
//Here we are configuring express to use body-parser as middle-ware.
expressHandler.use(bodyParser.json());
expressHandler.use(bodyParser.urlencoded({
    extended: true
}));
//Make files in appDirectory and imageDirectory static
expressHandler.use(express.static(appDirectory));
expressHandler.use(imageUrl, express.static(imageDirectory));
//Error handler
expressHandler.use((err, req, res, next) => {
    res.status(500).send(JSON.stringify(new Response(false, err.message)));
});
//Configurations for session and cookies
expressHandler.use(cookieParser());
expressHandler.set('trust proxy', 1);
expressHandler.use(session({
    secret: 'sample',
    resave: false,
    name: 'sample_cookie',
    saveUninitialized: false,
    store: new MemoryStore(),
    cookie: {
        httpOnly: false
    }
}));
expressHandler.use(cookieEncrypter('sample'));
//To listening to port 8001
expressHandler.listen(port, () => {
    console.log('Server is listening on port ' + port + '.');
    db.connectDB();
});
//Get the start page
expressHandler.get('/', (req, res) => {
    res.status(200).sendFile(appDirectory + "/index.html");
});
//Routing configurations
//All requests to '/users' are handled in "user" module.
expressHandler.post('/users/login', user.login);
expressHandler.get('/users/logout', user.logout);
expressHandler.post('/users', user.create);
expressHandler.put('/users', upload.single('file'), user.update);
expressHandler.get('/users', user.get);
expressHandler.get('/users/check/:id', user.check);
//All requests to '/pictures' are handled in "picture" module.
expressHandler.get('/pictures', picture.query);
expressHandler.post('/pictures', upload.single('file'), picture.create);