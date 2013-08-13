module.exports = function(app, express){

app.requireAuth = true;
//app.everyauth.debug = true;

var sendRegisteredMail = function(mail)
{
  var mailOptions = {
    from: "Teselagen ✔ <teselagen.testing@gmail.com>",
    to: mail,
    subject: "Registration ✔",
    text: "Registration complete",
    html: "<b>You've just registered to Teselagen services.</b>"
  }

  app.mailer.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
      }else{
          console.log("Message sent: " + response.message);
      }
  });
}

// Login Procedures

app.everyauth.password
  .getLoginPath('/login') // Uri path to the login page
  .postLoginPath('/login') // Uri path that your login form POSTs to
  .loginView('index')
  .authenticate( function (login, password,req) {
    var promise = this.Promise();
    var User = app.mongoose.model("User");
    //console.log("finding user");
    User.findOne({ 'email': login }, function (error, user) {
      //console.log("User found ");
      //console.log(user);
      if (error) promise.fulfill([error]);
      if (!user) promise.fulfill(['Bad Credentials']);
      if(user)
      {
      app.bcrypt.compare(password, user.hash, function (err, didSucceed) {
        var errors = [];
        if (err) {
          return promise.fail(err);
          errors.push('Wrong password.');
          return promise.fulfill(errors);
        }
        if (didSucceed) 
          {
            if(req.body.remember=='true') 
              {
                console.log("Session will not expire!");
                req.session.cookie.expires = false;
              }
            return promise.fulfill(user);
          }
        errors.push('Wrong password.');
        return promise.fulfill(errors);
      });
      }
    });
    return promise;
  })
  .respondToLoginSucceed( function (res, user, data) {
    if (user) {
      return res.json({ success: true }, 200);
    }
  })
  .respondToLoginFail( function (req, res, errors, login) {
    if (!errors || !errors.length) return;
    return res.json({ success: false, errors: errors },401);
  });

  // Registration procedures

  app.everyauth.password.getRegisterPath('/register')
  .postRegisterPath('/register')
  .registerView('registration')
  .validateRegistration( function (newUserAttributes) {
    return null;
  })
  .extractExtraRegistrationParams( function (req) {
    return {
        firstName: req.body.user.firstName
      , lastName: req.body.user.lastName
      , email: req.body.user.email
      , type_user: req.body.user.type
      , registerToken: req.body.registerToken
    };
  })
  .registerUser( function (newUserAttributes) {
    var promise = this.Promise();
    var Tokens = app.mongoose.model("Tokens");
    console.log(newUserAttributes);
    Tokens.findById(newUserAttributes.registerToken,function(err,token){
      if(err||token.used) promise.fulfill(["Token not found or not valid"]);
      else
      {
        var password = newUserAttributes.password;

        delete newUserAttributes.password;

        var salt = app.bcrypt.genSaltSync(10);
        var hash = app.bcrypt.hashSync(password, salt);

        newUserAttributes.hash = hash;

        var User = app.mongoose.model("User");

        User.create(newUserAttributes, function (err, user) {
         if (err) return promise.fulfill([err]);
         promise.fulfill(user);
         token.used = true;
         token.save();
         sendRegisteredMail(newUserAttributes.email);
        });
      }
    });  
    return promise;

  })
  .registerSuccessRedirect('/');

  // Extra procedure to add User data as helper

  app.everyauth.everymodule.findUserById(function(userId, callback) {
    var User = app.mongoose.model("User");
    User.findById(userId, callback);
  })
};