'use strict'
const superagent = require('superagent');
var assert = require('chai').assert;
describe('Query a list of pictures (get request to "/pictures")', () => {
    it('should return a flag - "success is true"', (done) => {
        superagent.get('http://localhost:8001/pictures').end((err, res) => {
            if (err) {
                return done(err);
            }
            assert.equal(res.body.success, true, 'res.body.success equals true');
            done();
        });
    });
    it('should return an array(can be empty) of picture resources', (done) => {
        superagent.get('http://localhost:8001/pictures').end((err, res) => {
            if (err) {
                return done(err);
            }
            assert.equal(Array.isArray(res.body.data), true, 'res.body.data is an array');
            done();
        });
    });
    it('should return valid picture resources, if there is at least one picture resource in database', (done) => {
        superagent.get('http://localhost:8001/pictures').end((err, res) => {
            if (err) {
                return done(err);
            }
            if (res.body.data.length > 0) {
                assert.isNotNull(res.body.data[0]['p_id'], 'picture resource has a p_id property and it is not null');
                assert.isDefined(res.body.data[0]['p_name'], 'picture resource has a p_name property');
                assert.isDefined(res.body.data[0]['p_description'], 'picture resouces has a p_description property');
                assert.isNotNull(res.body.data[0]['p_url'], 'picture resouces has a p_url property it is not null');
            }
            done();
        });
    });
});