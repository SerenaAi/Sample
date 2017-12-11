//All requests to '/users' is handled in this file
'use strict';
//Dependencies and configurations
const db = require('./db.js');
const Response = require('./response.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const imageUrl = '/image';
//Handles 'post' request to '/users'
exports.create = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (!req.body.userId) {
        res.send(JSON.stringify(new Response(false, "User ID is required")));
        return;
    }
    if (!req.body.password) {
        res.send(JSON.stringify(new Response(false, "Password is required")));
        return;
    }
    if (!req.body.username) {
        res.send(JSON.stringify(new Response(false, "Username is required")));
        return;
    }
    checkId(req.body.userId).then(ret => {
        if (ret) {
            res.send(JSON.stringify(new Response(false, "User ID already exist")));
            return;
        }
        insertUserIdInfo(req.body.userId, req.body.password, req.body.username).then(() => {
            res.send(JSON.stringify(new Response(true, "Create account success")));
        }).catch(err => {
            res.send(JSON.stringify(new Response(false, "Database error")));
        });
    }).catch(err => {
        res.send(JSON.stringify(new Response(false, "Database error")));
    });
};
//Handles 'put' request to '/users'
exports.update = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (!req.session.uid) {
        res.send(JSON.stringify(new Response(false, "Session expires")));
        return;
    }
    //Stores all the columns needs to be updated
    var columns = [];
    //Stores all the parameters for update columns
    var params = [];
    //If request query has parameter 'description',
    //then update 'description' column in user table
    if (req.body && ('description' in req.body)) {
        columns.push('u_description');
        params.push(req.body.description);
    }
    //If request query has parameter 'file',
    //then update 'photo' column in user table
    if (!req.file || !req.file.filename) {
        res.send(JSON.stringify(new Response(false, "Upload fails becasue of invalid file")));
        return;
    } else {
        columns.push('u_photo');
        params.push(imageUrl + "/" + req.file.filename);
    }
    if (columns.length == 0) {
        res.send(JSON.stringify(new Response(true, "Nothing needs to be updated")));
    }
    updatePublicUserInfo(req.session.uid, columns, params).then(ret => {
        res.send(JSON.stringify(new Response(true, "Update success", ret)));
    }).catch(err => {
        res.send(JSON.stringify(new Response(false, "Database error")));
    });
};
//Handles 'get' request to '/users'
exports.get = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (!req.session.uid) {
        res.send(JSON.stringify(new Response(false, "Session expires")));
        return;
    }
    getPublicUserInfo(req.session.uid).then(ret => {
        res.send(JSON.stringify(new Response(true, "Get account info success", ret)));
    }).catch(err => {
        res.send(JSON.stringify(new Response(false, "Database error")));
    });
};
//Handles 'get' request to '/users/check/:id'
exports.check = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (!req.params.id) {
        res.send(JSON.stringify(new Response(false, "User ID is required")));
        return;
    }
    checkId(req.params.id).then(ret => {
        if (ret) {
            res.send(JSON.stringify(new Response(false, "User ID already exist")));
        } else {
            res.send(JSON.stringify(new Response(true, "User ID available")));
        }
    }).catch(err => {
        res.send(JSON.stringify(new Response(false, "Database error")));
    });
};
//Handles 'get' request to '/users/logout'
exports.logout = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    req.session.destroy();
    res.send(JSON.stringify(new Response(true, "Sign out")));
};
//Handles 'post' request to '/users/login'
exports.login = (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Content-Type', 'application/json');
    if (!req.body.userId) {
        res.send(JSON.stringify(new Response(false, "User ID is required")));
        return;
    }
    if (!req.body.password) {
        res.send(JSON.stringify(new Response(false, "Password is required")));
        return;
    }
    checkIdAndPassword(req.body.userId, req.body.password).then(ret => {
        if (ret) {
            //Create and save a session		
            req.session.uid = req.body.userId;
            req.session.save();
            res.send(JSON.stringify(new Response(true, "Login success")));
        } else {
            res.send(JSON.stringify(new Response(false, "UserId and password doesn't match")));
        }
    }).catch(err => {
        res.send(JSON.stringify(new Response(false, "Database error")));
    });
};

//Database queries
var getPublicUserInfo = (userId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT u_name, u_photo, u_description FROM USER WHERE u_id=(?);', [userId]).then(ret => {
            resolve(ret);
        }).catch(err => {
            reject(err.message);
        });
    });
};
var updatePublicUserInfo = (userId, columns, params) => {
    for (var i = 0; i < columns.length; i++) {
        columns[i] = columns[i] + "=(?)";
    }
    params.push(userId);
    return new Promise((resolve, reject) => {
        db.run('UPDATE USER SET ' + columns.join(',') + ' WHERE u_id=(?);', params).then(() => {
            getPublicUserInfo(userId).then(ret => {
                resolve(ret);
            }).catch(err => {
                resolve();
            });
        }).catch(err => {
            reject(err.message);
        });
    });
};
var checkId = (userId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT u_id FROM USER WHERE u_id=(?)', [userId]).then(ret => {
            if (ret) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(err => {
            reject(err.message);
        });
    });
};
var checkIdAndPassword = (userId, password) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM USER WHERE u_id=(?);', [userId]).then(ret => {
            if (ret) {
                bcrypt.compare(password, ret.u_password, function(err, res) {
                    if (err) {
                        reject("Encrypt error");
                    }
                    if (res) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            } else {
                resolve(false);
            }
        }).catch(err => {
            reject(err.message);
        });
    });
};
var insertUserIdInfo = (userId, password, username) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                reject("Encrypt error");
            }
            db.run('INSERT INTO USER (u_id, u_password, u_name) VALUES(?,?,?);', [userId, hash, username]).then(() => {
                resolve();
            }).catch(err => {
                reject(err.message);
            });
        });
    });
};