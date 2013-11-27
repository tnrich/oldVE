#!/usr/bin/env node

/**
 *  Teselagen Node.js application
 */

/*
 * Module dependencies.
 */

require('newrelic');

var express = require('express');
var app = express();
var server = require('http').createServer(app)

app.socket = require('socket.io');
app.io = app.socket.listen(server, { log: false });
app.redis = require("redis");

/* Dependencies loading */
app.async = require('async');
app.crypto = require("crypto");
app.fs = require('fs');
app.xmlrpc = require('xmlrpc');
app.mongoose = require('mongoose');
app.mongostore = require('connect-mongo');
app.mysql = require('mysql');
app.markdown = require("markdown-js");
app.passport = require("passport");
app.soap = require("soap");
app.xml2js = require('xml2js');
app.program = require('commander');
app.nodemailer = require("nodemailer");
app._ = require("underscore");
app.winston = require('winston');
app.memcached = require('memcached');
app.socketio = require('socket.io');
app.http = require('http');
//app.httpProxy = require('http-proxy');

require('./api/rest.js')(app);

// CONFIGURATION
require('./config.js')(app, express);

// API
require('./routes/api.js')(app);

// Services
require('./sockets.js')(app);

// Services
require('./routes/j5-services/j5.js')(app);

// Listen Local Port on environment port or default 3000
var nodePort = app.program.port || 3000;
server.listen(nodePort, function() {
    app.logger.log("info","OPTIONS: Nodejs server is running in %s mode on port %s",app.get("env"),nodePort);
});
