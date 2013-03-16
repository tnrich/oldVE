#!/usr/bin/env node

/**
 *  Teselagen Node.js application
 */

/*
 * Module dependencies.
 */
var express = require('express');
var app = express();

/* Dependencies loading */
app.async = require('async');
app.fs = require('fs');
app.xmlrpc = require('xmlrpc');
app.fs = require('fs');
app.mongo = require('mongodb');
app.mongoose = require('mongoose');
app.mysql = require('mysql');
app.markdown = require("markdown-js");
app.soap = require("soap");
app.xml2js = require('xml2js');
app.program = require('commander');
app.nodemailer = require("nodemailer");

app.program
  .version('0.0.1')
  .option('-e, --examples', 'Load Examples')
  .option('-g, --guest', 'Create Guest User')
  .option('-d, --dev', 'Run Development environment')
  .option('-t, --test', 'Run Test environment')
  .option('-b, --beta', 'Run Beta environment')
  .option('-p, --prod', 'Run Production environment')
  .option('-r, --port <n>', 'Node port default is 3000', parseInt)
  .option('-q, --quiet', 'Disable logging')
  .parse(process.argv);

app.set("env", "development");
app.dbname = "teselagenDev";
if (app.program.test) {
    app.set("env", "test");
    app.dbname = "teselagenTest";
}
else if (app.program.beta) {
    app.set("env", "beta");
    app.dbname = "teselagenBeta";
}
else if (app.program.prod) {
    app.set("env", "production");
    app.dbname = "teselagen";
}
else {
    app.program.dev = true;
}

// Log requests
if (!app.program.quiet) app.use(express.logger());

app.use(function (req, res, next) {
  if(req.method === 'OPTIONS') {
    var headers = {};
    headers["Access-Control-Allow-Origin"] = req.headers.origin;
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = true;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
    res.writeHead(200, headers);
    res.end();
  } else {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Credentials", 'true');
    next();
  }
});

// Development
require('./development.js')(app);

// Configuration
var config = require('./config.js')(app, express);

// Routes
require('./routes/api.js')(app, express);
require('./routes/testing.js')(app);
//require('./routes/backend.js')(app);
require('./routes/j5.js')(app);

// Listen Local Port on environment port or default 3000
var nodePort = app.program.port || 3000;
app.listen(nodePort, function () {
	console.log("OPTIONS: Nodejs server is running in %s mode on port %s", app.get("env"), nodePort);
});
