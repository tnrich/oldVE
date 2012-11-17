/*global describe, it */
var expect = require("expect.js");
var request = require("request");
var API_URL =  "http://teselagen.local/api/";

describe("/api", function() {
    it("/", function(done) {
        request(API_URL, function(err, res, body) {
            expect(err).to.be(null);
            expect(res.statusCode).to.be(200);
            expect(body).to.be(undefined);
            done();
        });
    });
    it("/project without login", function(done) {
        request(API_URL+"project", function(err, res, body) {
            expect(err).to.be(null);
            expect(res.statusCode).to.be(401);
            expect(body).to.be("Wrong credentials");
            done();
        });
    });
    it("/login", function(done) {
        request.post({
                url: API_URL+"login",
                form: {username:"rpavez", password:""},
                json: true
            },
            function(err, res, body) {
                expect(err).to.be(null);
                expect(res.statusCode).to.be(200);
                expect(body.msg).to.be("Welcome back rpavez!");
                done();
        });
    });
    it("/project with bad id", function(done) {
        request({
                uri: API_URL+"project",
                qs: {id: 1},
                json: true
            },
            function(err, res, body) {
                expect(res.statusCode).to.be(500);
                expect(body.error.message).to.be("Invalid ObjectId");
                done();
        });
    });
    it("/user/projects", function(done) {
        request({
                uri: API_URL+"user/projects",
                json: true
            },
            function(err, res, body) {
                expect(res.statusCode).to.be(200);
                expect(body.projects[0].name).to.be("My Project #2");
                done();
        });
    });
});
