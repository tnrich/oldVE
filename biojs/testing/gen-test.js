Ext.require('Teselagen.biojs.bio.parsers.GenbankFormat');


Ext.onReady(function() {
	
        //launch: function() {
            //include the tests in the test.html head
            jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
            jasmine.getEnv().execute();
        //}
    //});
            /*// From the pivotal.github.co,/jasmine website, using HtmlReporter
            var htmlReporter = new jasmine.HtmlReporter();
            jasmineEnv.addReporter(htmlReporter);

            jasmineEnv.specFilter = function(spec) {
              return htmlReporter.specFilter(spec);
            };

            var currentWindowOnload = window.onload;
            window.onload = function() {
              if (currentWindowOnload) {
                currentWindowOnload();
              }

              document.querySelector('.version').innerHTML = jasmineEnv.versionString();
              execJasmine();
            };

            function execJasmine() {
              jasmineEnv.execute();
            }
            */

});