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
app.fs     = require('fs');
app.mongo = require('mongodb');
app.mongoose = require('mongoose');
app.mysql = require('mysql');
app.markdown = require("markdown-js");
app.soap = require("soap");
app.xml2js = require('xml2js');

// Development
require('./development.js')(app);

// Configuration
var config = require('./config.js')(app,express);

// Routes
require('./routes/backend.js')(app);
require('./routes/j5.js')(app);
// Listen Local Port on environment port or default 3000
app.listen(process.env.NODE_PORT || 3000, function(){
  //console.log("Nodejs server is listening on port %d in %s mode (For another port use run.sh <Port>)", app.address().port, app.settings.env);
});
