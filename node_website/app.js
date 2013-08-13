
/**
 * /app.js  
 * -------------
 */

var express = require('express');
var app = module.exports = express.createServer();

app.everyauth = require('everyauth');
app.mongoose = require('mongoose');
app.nodemailer = require('nodemailer');
app.bcrypt = require('bcrypt');

var config = require('./config.js')(app, express);

var models = {};
models.examples = require('./models/token')(app.mongoose).model;
models.users = require('./models/user')(app.mongoose).model;

// Routes
require('./routes/index.js')(app, models);
require('./routes/user-admin.js')(app, models);

app.listen(process.env.NODE_PORT || 3000, function(){
  console.log("Server listening on port %d in %s mode", app.address().port, app.settings.env);
});
