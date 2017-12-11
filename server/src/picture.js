//All requests to '/pictures' is handled in this file
'use strict';
//Dependencies and configurations
const db = require('./db.js');
const Response = require('./response.js');
const imageUrl = '/image';
//Handles 'get' requests to '/pictures',
//Successful return is a json string.
//It's 'success' property should be 'true'
//It's 'data' property should be a list of pictures returned from database
exports.query = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    db.query('SELECT u_name, u_photo, u_id, p_url, p_description, p_name FROM PICTURE JOIN USER ON p_u_id = u_id;').then(rets => {
        res.send(JSON.stringify(new Response(true, "Query pictures success", rets)));
    }).catch(err => {
        res.send(JSON.stringify(new Response(false, "Database error")));
    });
};
//Handles 'post' requests to '/pictures',
//Successful return is a json string.
exports.create = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (!req.session.uid) {
        res.send(JSON.stringify(new Response(false, "Not Sign in")));
    }
    if (!req.file || !req.file.filename) {
        res.send(JSON.stringify(new Response(false, "Upload fails becasue of invalid file")));
        return;
    }
    db.run('INSERT INTO PICTURE (p_u_id, p_name, p_description, p_url) VALUES(?,?,?,?);', [req.session.uid, req.body.pictureName, req.body.pictureDescription, imageUrl + "/" + req.file.filename]).then(() => {
        res.send(JSON.stringify(new Response(true, "Upload picture success")));
    }).catch(err => {
        res.send(JSON.stringify(new Response(false, "Database error")));
    });
};