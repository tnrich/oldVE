
/**
 * /app.js  
 * -------------
 */

var express = require('express');
var app = express();

app.everyauth = require('everyauth');
app.mongo = require('mongodb');
app.mongoose = require('mongoose');
app.nodemailer = require('nodemailer');
app.crypto = require("crypto");
app.passport = require("passport");
app.mongostore = require('connect-mongo');
app.mongoose = require('mongoose');
app.nodemailer = require("nodemailer");
app.winston = require('winston');
app.program = require('commander');
app.mandrill = require('mandrill-api/mandrill');
app.fs = require('fs');

var config = require('./config.js')(app, express);

// var models = {};
// models.examples = require('./models/token')(app.mongoose).model;
// models.users = require('./models/user')(app.mongoose).model;

// Routes
require('./routes/constants')(app, express);
require('./routes/authentication.js')(app, express);
require('./routes/user-admin.js')(app, express);
require('./routes/index.js')(app, express);

app.get('*', function(req, res){
  res.render('notfound', {status: 404, title: 'TeselaGen Biotechnology | 404 - Page Not Found'});
});

//var nodePort = 3000;

//app.listen(nodePort, function() {
//    app.logger.log("info","OPTIONS: Nodejs server is running in %s mode on port %s",app.get("env"),nodePort);
//});
