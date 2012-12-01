/*global describe, it */
var expect = require("expect.js");
var request = require("request");
var API_URL =  "http://teselagen.local/api/";

describe("/api", function() {
    var projects;
    it("Get /", function(done) {
        request(API_URL, function(err, res, body) {
            expect(err).to.be(null);
            expect(res.statusCode).to.be(200);
            expect(body).to.be(undefined);
            done();
        });
    });
    it("Get /projects/:project without login", function(done) {
        request(API_URL+"projects/1", function(err, res, body) {
            expect(err).to.be(null);
            expect(res.statusCode).to.be(401);
            expect(body).to.be("Wrong credentials");
            done();
        });
    });
    it("Post /login", function(done) {
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
    it("Delete /user/projects", function(done) {
        request.del({
                uri: API_URL+"user/projects",
                json: true
            },
            function(err, res) {
                expect(res.statusCode).to.be(200);
                done();
        });
    });
    it("Post /user/projects", function(done) {
        var date = new Date();
        request.post({
                uri: API_URL+"user/projects",
                form: {name:"MyProject1", dateCreated:date, dateModified:date},
                json: true
            },
            function(err, res, body) {
                expect(res.statusCode).to.be(200);
                projects = body.projects;
                expect(projects).to.be.ok();
                done();
        });
    });
    it("Get /projects/:project with bad id", function(done) {
        request({
                uri: API_URL+"projects/1",
                json: true
            },
            function(err, res, body) {
                expect(res.statusCode).to.be(500);
                expect(body.error.message).to.be("Invalid ObjectId");
                done();
        });
    });
    it("Get /projects/:project", function(done) {
        request({
                uri: API_URL+"projects/"+projects[0].id,
                json: true
            },
            function(err, res, body) {
                expect(res.statusCode).to.be(200);
                expect(body.projects).to.be.ok();
                done();
        });
    });
    it("Get /user/projects", function(done) {
        request({
                uri: API_URL+"user/projects",
                json: true
            },
            function(err, res, body) {
                expect(res.statusCode).to.be(200);
                expect(body.projects[0].name).to.be("MyProject1");
                done();
        });
    });
});
