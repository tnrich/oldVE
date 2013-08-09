#!/usr/bin/env casperjs

if (!phantom.casperLoaded) {
    console.log('This script must be invoked using the casperjs executable');
    phantom.exit(1);
}

var fs          = require('fs'),
  cli           = require('cli'),
  colorizer     = require('colorizer'),
  utils         = require('utils'),
  cwd           = fs.workingDirectory,
  any_failures  = false, // true when there has been a failure
  should,
  casper;

/*
 * Load dependencies
 */
_ = require("./node_modules/lodash/dist/lodash");
_.str = require('./node_modules/underscore.string/lib/underscore.string');
require('./node_modules/icolor/build/icolor');

require('./node_modules/mocha/mocha.js');
chai = require('./node_modules/chai/chai.js');

/* chai-isms
 */
assert = chai.assert;
expect = chai.expect;

// Note: due to a bug in PhantomJS the following throws
//      RangeError: Maximum call stack size exceeded.
// if `should` is not in scope with 'var scope' up above
should = chai.should();

// we don't get much debugging info on the console, so this can be helpful
chai.Assertion.includeStack = true;

/*
 * Create the casper object we'll use for testing
 */
casper = require('casper').create({
    exitOnError: false,
    pageSettings: {
        loadImages: false,
        loadPlugins: false
    },
    onLoadError: function (_casper, url) {
      console.log("[onLoadError]: ".redbg.white + url);
    },
    onTimeout: function (err) {
      console.log(("[Timeout]: " + err).redbg.white);
    },
    // logLevel: 'debug',
    // verbose: true,
});

/*
 * Create a custom Mocha reporter.
 * 
 * See conversation at https://github.com/n1k0/casperjs/issues/278
 */
function CasperReporter(runner) {
  var self = this,
    stats = this.stats = {
        suites: 0,
        tests: 0,
        passes: 0,
        pending: 0,
        failures: 0
    },
    failures = [],
    indents = 0,
    symbols = {
      ok: '✓',
      err: '✖',
      middot: '•',
      dot: '․'
    };

  function indent(str) {
      return _.str.pad("", 2 * indents) + str;
  }

  if (!runner) {
      return;
  }

  this.runner = runner;
  runner.stats = stats;

  runner.on('start', function() {});

  runner.on('suite', function(suite) {
    console.log("\n" + indent(suite.title.cyan.underline));
    ++indents;
  });

  runner.on('suite end', function(suite) {
      --indents;
      if (1 === indents) {
          console.log();
      }
  });

  runner.on('test', function(test) {
    console.log("\n" + indent(symbols.middot + " " + test.title));
  });

  runner.on('pending', function(test) {
    console.log(indent("pending ".magenta + test.title));
  });

  runner.on('pass', function(test){
      console.log(indent(symbols.ok + " (" + test.title + ")").green);
      stats.passes++;
  });

  runner.on('fail', function(test, err){
    stats.failures++;
    test.err = err;
    failures.push(test);
    console.log(indent(symbols.err + " (" + test.title + ")").red +
      ": " + err);
  });

  runner.on('test end', function(test){
    stats.tests = stats.tests || 0;
    stats.tests++;
  });

  runner.on('end', function(){
    if (stats.failures) {
      msg = (stats.failures + " tests failed").red;
      any_failures = true;
    } else {
      msg = "All tests passed".green;
    }
    msg = "\n" + msg + " (" + stats.tests + " tests run).";
    console.log(msg);
  });
}

/*
 * Set up Mocha with our custom reporter and BDD-style settings
 */
mocha.setup({
  ui: 'bdd',
  reporter: CasperReporter,
  timeout: 20000
});

/*
 * After every Mocha test we flush the Casper 'steps' stack.
 *
 * Because afterEach calls the asynchronous Casper steps, the actual tests can
 * be synchronous. All Casper tests will occur in this afterEach.
 */
afterEach(function (done) {
  // There is no need to print here b/c mocha test emit will
  // capture.
  if (casper.steps.length) {
    // There's work to be done.
    casper.run(function () { done(); });
  } else {
    // Nothing to see here. Move along.
    done();
  }
});

/*
 * Set up some color logging.
 */
casper.on('http.status.200', function(resource) {
    console.log("[HTTP 200]".greenbg.black + " <" + resource.url.green + ">");
});

casper.on('http.status.404', function(resource) {
    console.log("[HTTP 404]".redbg.black + " <" + resource.url.red + ">");
});

casper.on('http.status.500', function(resource) {
    console.log("[HTTP 500]".redbg.black + " <" + resource.url.red + ">");
});

//
// Capture remote log messages
//
casper.on('remote.message', function(msg) {
  console.log(">>> ".cyan + msg.bluebg.yellow);
});

casper.on('page.error', function(msg, trace) {
  console.log(">>> Remote error: ".red, msg.red, trace);
});

// Set up casperChai.
// TODO: option to use ../lib/casper-chai (i.e. unbuilt coffeescript)
casperChai = require("./node_modules/casper-chai/build/casper-chai");
chai.use(casperChai);

/*
 * Load the specs
 */
phantom.injectJs(casper.cli.get(0));

/*
 * Start casper.
 */
casper.start();

// Run Mocha
mocha.run(function () {
  casper.exit(any_failures);
});

