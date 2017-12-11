'use strict'
const superagent = require('superagent');
var assert = require('chai').assert;
describe('Create a new user (post request to "/users")', () => {
    it('should return a flag - "success is true", if the userId is not taken yet(not in database)', (done) => {
        //For this test, use time string as the userId to avoid duplicates in database
        var date = new Date().toISOString();
        superagent.post('http://localhost:8001/users').send({
            userId: date,
            password: "123",
            username: "Serena"
        }).end((err, res) => {
            if (err) {
                return done(err);
            }
            assert.equal(res.body.success, true, 'res.body.success equals true');
            done();
        });
    });
    it('should return a flag - "success is false", if userId already exists in database', (done) => {
        //For this test, use 'admin' as userId, since it's already in database
        //it'll fail to create a new user
        superagent.post('http://localhost:8001/users').send({
            userId: "admin",
            password: "admin",
            username: "Serena"
        }).end((err, res) => {
            if (err) {
                return done(err);
            }
            assert.equal(res.body.success, false, 'res.body.success equals false');
            done();
        });
    });
    it('should return a flag - "success is false", if one required request parameter is missing', (done) => {
        superagent.post('http://localhost:8001/users').send({
            //Get rid of any parameters here will lead to failure in creating a new user
            password: "admin",
            username: "Serena"
        }).end((err, res) => {
            if (err) {
                return done(err);
            }
            assert.equal(res.body.success, false, 'res.body.success equals false');
            done();
        });
    });
});

describe('Login user (post request to "/users/login")', () => {
    it('should return a flag - "success is true", when the userId and password is correct', (done) => {
        superagent.post('http://localhost:8001/users/login').send({
            userId: 'admin',
            password: "admin"
        }).end((err, res) => {
            if (err) {
                return done(err);
            }
            assert.equal(res.body.success, true, 'res.body.success equals true');
            done();
        });
    });
    it('should return a flag - "success is false", when the userId and password is incorrect', (done) => {
        //For this test, use time string as the userId to make sure it always not exist in database
        var date = new Date().toISOString();
        superagent.post('http://localhost:8001/users/login').send({
            userId: date,
            password: "abc"
        }).end((err, res) => {
            if (err) {
                return done(err);
            }
            assert.equal(res.body.success, false, 'res.body.success equals false');
            done();
        });
    });
});

describe('Get information of the user (get request to "/users")', () => {
    it('should return a flag - "success is true", when the user is currently logged in', (done) => {
        //Login the user first
        var agent = superagent.agent();
        agent.post('http://localhost:8001/users/login').send({
            userId: 'admin',
            password: "admin"
        }).then(() => {
            //Get cookies and send it to '/users'
            var cookies = agent.get('/cookied-page').cookies;
            superagent.get('http://localhost:8001/users')
                .set('Cookie', cookies)
                .end((err, res) => {
                if (err) {
                    return done(err);
                }
                assert.equal(res.body.success, true, 'res.body.success equals true');
                done();
            });
        });
    });
    it('should return a flag - "success is false", when the user is not logged in', (done) => {
        //Send request without cookies
        superagent.get('http://localhost:8001/users').end((err, res) => {
            if (err) {
                return done(err);
            }
            assert.equal(res.body.success, false, 'res.body.success equals false');
            done();
        });
    });
});

describe('Gheck if the userId is available (get request to "/users/check/:id")', () => {
    it('should return a flag - "success is true", when the user is available', (done) => {
        //For this test, use time string as userId to make sure it's always available
        var date = new Date().toISOString();
        superagent.get('http://localhost:8001/users/check/' + date).end((err, res) => {
            if (err) {
                return done(err);
            }
            assert.equal(res.body.success, true, 'res.body.success equals true');
            done();
        });
    });
    it('should return a flag - "success is false", when the user is unavailable', (done) => {
        superagent.get('http://localhost:8001/users/check/admin').end((err, res) => {
            if (err) {
                return done(err);
            }
            assert.equal(res.body.success, false, 'res.body.success equals false');
            done();
        });
    });
});