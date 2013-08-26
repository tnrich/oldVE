
/**
 * /config.js  
 * -------------
 */

module.exports = function(app, express){

  var config = this;

  //EveryAuth Config
  require('./auth.js')(app, express);

  //NodeMailer Config
  app.mailer = app.nodemailer.createTransport("SMTP",{
      service: "Gmail",
      auth: {
          user: "teselagen.testing@gmail.com",
          pass: "teselagen#rocks"
      }
  });

  //Express Config
  app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ key:'teselagen', secret: 'topsecret', cookie: { path: '/', httpOnly: true, maxAge: 14400000 } }));
    app.use(app.everyauth.middleware());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
  });

  if (!app.settings.env) {app.settings.env="development";}

  //env specific config
  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(express.errorHandler());
    app.mongoose.connect('mongodb://localhost/teselagen');
    console.log("mongoose connected in Development");
  });

  app.configure('production', function(){
    app.use(express.errorHandler());
    //app.mongoose.connect('mongodb://flame.mongohq.com:27087/teselagen');
    app.mongoose.connect('mongodb://localhost/teselagen');
    console.log("mongoose connected in Production");
  });

  return config;

};