/*global API_URL, before, dbManager, describe, expect, it, request */

var ApiManager = require("../manager/ApiManager")();
var apiManager;

describe("API tests.", function() {
    var date, projects;
    before(function() {
        apiManager = new ApiManager(dbManager.mongoose);
    });
    describe("Basic access.", function() {
        it("resetdb", function(done) {
            apiManager.resetdb(function(err) {
                expect(err).to.be.null;
                done();
            });
        });
        xit("Get /projects/:project without login", function(done) {
            request(API_URL+"projects/1", function(err, res, body) {
                expect(err).to.be.null;
                expect(res.statusCode).to.equal(404);
                expect(body).to.equal("Wrong credentials");
                done();
            });
        });
        it("Post /login", function(done) {
            request.post({
                url: API_URL+"login",
                form: {username:"mfero", password:""},
                json: true
            },
            function(err, res, body) {
                expect(err).to.be.null;
                expect(res.statusCode).to.equal(200);
                expect(body.msg).to.equal("Welcome back mfero!");
                done();
            });
        });
    });
    describe("Users.", function() {
        it("Get /user/:username", function(done) {
            request({
                uri: API_URL+"users/mfero",
                json: true
            },
            function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(body.user.username).to.equal("mfero");
                done();
            });
         });
    });
    xdescribe("Projects.", function() {
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
            date = new Date().toISOString();
            request.post({
                uri: API_URL+"user/projects",
                form: {name:"MyProject1", dateCreated:date, dateModified:date},
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
            function(err, res) {
                expect(res.statusCode).to.equal(500);
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
                var proj = body.projects[0];
                expect(res.statusCode).to.equal(200);
                expect(proj.name).to.equal("MyProject1");
                expect(proj.dateCreated).to.equal(date);
                expect(proj.dateModified).to.equal(date);
                done();
            });
        });
    });
});