#!/usr/bin/env node

/*
  Teselagen
  Device Editor MongoDB Backend
  Repos: pushscience/opt/git/de.git
*/

/**
 * Module dependencies.
 */
var express = require('express');
var app = express();

/* Dependencies loading */
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

app.program
  .version('0.0.1')
  .option('-e, --examples', 'Load Examples')
  .option('-g, --guest', 'Create Guest User')
  .option('-d, --dev', 'Run Production environment')
  .option('-s, --stage', 'Run Production environment')
  .option('-p, --prod', 'Run Production environment')
  .parse(process.argv);

if (app.program.dev) process.env.NODE_ENV = "Development";
else if (app.program.stage) process.env.NODE_ENV = "Stage";
else if (app.program.prod) process.env.NODE_ENV = "Production";
else process.env.NODE_ENV = "Development";

app.use(function (req, res, next) {
  //console.log('using cors');
  if(req.method === 'OPTIONS') {
    var headers = {};
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
    res.writeHead(200, headers);
    res.end();
  } else {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  }
});

// Development
require('./development.js')(app);

// Configuration
var config = require('./config.js')(app, express);

// Routes
require('./routes/backend.js')(app);
require('./routes/j5.js')(app);
// Listen Local Port on environment port or default 3000
app.listen(process.env.NODE_PORT || 3000, function () {
  console.log("OPTIONS: Nodejs server is running in %s mode",process.env.NODE_ENV);
});
