/*global describe, it */
var expect = require("chai").expect;
var request = require("request");
var API_URL =  "http://teselagen.local/api/";

describe("/api", function() {
    var projects;
    describe("Basic access", function() {
        it("Get /", function(done) {
            request(API_URL, function(err, res, body) {
                expect(err).to.be.null;
                expect(res.statusCode).to.equal(200);
                expect(body).to.be.undefined;
                done();
            });
        });
        it("Get /projects/:project without login", function(done) {
            request(API_URL+"projects/1", function(err, res, body) {
                expect(err).to.be.null;
                expect(res.statusCode).to.equal(401);
                expect(body).to.equal("Wrong credentials");
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
                expect(err).to.be.null;
                expect(res.statusCode).to.equal(200);
                expect(body.msg).to.equal("Welcome back rpavez!");
                done();
            });
        });
    });
    describe("Projects", function() {
        it("Delete /user/projects", function(done) {
            request.del({
                uri: API_URL+"user/projects",
                json: true
            },
            function(err, res) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
        it("Post /user/projects", function(done) {
            request.post({
                uri: API_URL+"user/projects",
                form: {name:"MyProject1"},
                json: true
            },
            function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                projects = body.projects;
                expect(projects).to.exist;
                done();
            });
        });
        it("Get /projects/:project with bad id", function(done) {
            request({
                uri: API_URL+"projects/1",
                json: true
            },
            function(err, res, body) {
                expect(res.statusCode).to.equal(500);
                expect(body.error.message).to.equal("Invalid ObjectId");
                done();
            });
        });
        it("Get /projects/:project", function(done) {
            var id = setInterval(function() {
                if (projects) {
                    clearInterval(id);
                    request({
                        uri: API_URL+"projects/"+projects.id,
                        json: true
                    },
                    function(err, res, body) {
                        expect(res.statusCode).to.equal(200);
                        expect(body.projects).to.exist;
                        done();
                    });
                }
            });
        });
        it("Get /user/projects", function(done) {
            request({
                uri: API_URL+"user/projects",
                json: true
            },
            function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(body.projects[0].name).to.equal("MyProject1");
                done();
            });
        });
    });
});