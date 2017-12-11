//This file includes functions to interact with sqlite database,
//Sqlite module for nodejs is required.
'use strict';
//Get sqlite module
const sqlite3 = require('sqlite3').verbose();
var db;
module.exports.connectDB = () => {
    if (!db) {
        db = new sqlite3.Database('./server/bin/sampleDB.db');
    }
    console.log("Sqlite database connected");
};
module.exports.closeDB = () => {
    if (db) {
        db.close(db);
    }
    console.log("Database closed");
};
//This function gives back a result set
module.exports.query = (sql) => {
    //console.log(sql);
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.log(err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};
//This function only returns the first row in the result set
module.exports.get = (sql, params) => {
    //console.log(sql);
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                console.log(err.message);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};
//This function handles insert/update operations in sql,
//it will return an error if insert/update fails
module.exports.run = (sql, params) => {
    //console.log(sql);
    return new Promise((resolve, reject) => {
        db.run(sql, params, (err) => {
            if (err) {
                console.log(err.message);
                reject(err);
            } else {
                resolve();
            }
        });
    });
};