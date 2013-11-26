/**
 * ICE registry interface
 * @module ./routes/ice
 */
module.exports = function (app) {

  /**
   *  Login Auth Method : Find User in DB
   */
  function authenticate(name, pass, fn) {
    var User = app.db.model("User");
    User.findOne({
      'name': name
    }, function (err, user) {
      if(err) return fn(new Error('cannot find user'));
      return fn(null, user);
    });
  };

  /**
   * Authentication Restriction.
   * If user session is active then find the user in DB.
   * If no testing is enabled no option to use Guest User then Wrong Credential.
   */
  function restrict(req, res, next) {
    if(req.session.user) {
      var User = app.db.model("User");
      User.findOne({
        'name': req.session.user.name
      }, function (err, user) {
        req.user = user;
        next();
      });
    } else {
      if(!app.program.debug) {
        res.status(401).send('Wrong credentials');
      } else {
        console.log("Logged as Guest user");
        authenticate("Guest", "", function (err, user) {
          req.session.regenerate(function () {
            req.session.user = user;
            req.user = user;
            next();
          });

        })
      }
    }
  };


  app.all('/ice/search', function (req, res) {
    app.soap.client.search({
      sessionId: app.soap.sessionId,
      query: req.query.query
    }, function (arg1, arg2, arg3, arg4) {

      app.xmlparser.parseString(arg3, function (err, result) {
        if(result["soap:Envelope"]["soap:Body"][0]["ns2:searchResponse"][0]["return"]) {
          var results = result["soap:Envelope"]["soap:Body"][0]["ns2:searchResponse"][0]["return"];
          results.forEach(function (res) {
            //console.log(res["entry"][0]);
          });
          res.json(result);
        } else {
          res.json({
            "msg": "No results found"
          });
        }
      });
    });
  });

  app.all('/ice/getRecord', function (req, res) {
    res.set('Content-Type', 'application/xml');
    console.log(req.query.entryId);
    app.soap.client.getByRecordId({
      sessionId: app.soap.sessionId,
      entryId: req.query.entryId
    }, function (arg1, arg2, arg3, arg4) {
      app.xmlparser.parseString(arg3, function (err, result) {
        //res.json(result);
      });
      res.send(arg3);
    });
  });

  app.all('/ice/getSequence', function (req, res) {
    console.log(req.query.entryId);
    app.soap.client.getSequence({
      sessionId: app.soap.sessionId,
      entryId: req.query.entryId
    }, function (arg1, arg2, arg3, arg4) {
      app.xmlparser.parseString(arg3, function (err, result) {
        res.json(result);
      });
    });
  });

  /**
   * Create plasmid entry.
   */
  function createPlasmidEntry(args, cb) {
    var plasmid = {};

    plasmid.bioSafetyLevel = args["Bio safety level"];
    plasmid.creator = args["Creator"];
    plasmid.entryFundingSources = {};
    plasmid.entryFundingSources.fundingSource = {};
    plasmid.entryFundingSources.fundingSource.fundingSource = args["Funding source"];
    plasmid.entryFundingSources.fundingSource.principalInvestigator = args["Principal investigator"];
    plasmid.names = {};
    plasmid.names.name = args["Name"];
    plasmid.owner = args["Owner"];
    plasmid.ownerEmail = args["Owner email"];
    plasmid.shortDescription = args["Short description"];
    plasmid.status = args["Status"].toLowerCase();
    plasmid.circular = args["type"] == "Circular" ? "true" : "false";

    var obj = {};
    obj.sessionId = app.soap.sessionId;
    obj.plasmid = plasmid;

    //console.log(obj);
    //console.log(plasmid.entryFundingSources.fundingSource);

    app.soap.client.createPlasmid(obj, function (arg1, arg2, arg3, arg4) {
      app.xmlparser.parseString(arg3, function (err, result) {

        var body = result["soap:Envelope"]["soap:Body"][0];
        if(body["ns2:createPlasmidResponse"]) {
          var recordId = body["ns2:createPlasmidResponse"][0]["return"][0]["recordId"][0];
          console.log("New entry created at " + recordId);
          return uploadSequence(args, recordId, result, cb);
        } else {
          console.log("Couldnt create entry");
          return cb({
            'fault': 'Service not available'
          });
        }
      });
    });
  }
  
  /**
   * Upload sequence.
   */
  function uploadSequence(args, recordId, result, cb) {
    console.log('Uploading sequence to ' + recordId);

    //var seq = app.fs.readFileSync(__dirname + "/../resources/sequences/pj5_00002.gb", "utf8");
    var seq = args.genBankData;
    //console.log(seq);
    app.soap.client.uploadSequence({
      sessionId: app.soap.sessionId,
      entryId: recordId,
      sequence: seq
    }, function (arg1, arg2, arg3, arg4) {
      app.xmlparser.parseString(arg3, function (err, result) {
        return cb(recordId);
      });
    });
  }

  app.all('/saveToRegistry', function (req, res) {

    createPlasmidEntry(req.body, function (result) {
      res.json(result);
    });
  });


  app.all('/ice/uploadSequence', function (req, res) {

    console.log(req.query.entryId);


  });

};
