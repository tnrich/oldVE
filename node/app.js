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
  //console.log("Nodejs server is listening on port %d in %s mode (For another port use run.sh <Port>)", app.address().port, app.settings.env);
});