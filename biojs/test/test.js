
/*
 * @description This function excecutes the jasmine unit testing. Recycle as needed.
 * @author Diana Wong
 */

Ext.onReady(function() {

	
	Ext.Loader.setConfig({
	    enabled: true,
	    paths: {
	        Ext: '../../extjs',
	        Teselagen: '../src/teselagen'
	    }
	});

	/*
	Ext.application({
	    views: [
	        'MyViewport',
	        'FileImportWindow'
	    ],
	    autoCreateViewport: true,
	    name: 'MyApp',
	    controllers: [
	        'MyController'
	    ],
	    
        launch: function() {
            //include the tests in the test.html head
            jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
            jasmine.getEnv().execute();
        }
	
	
	});*/
	
	// not in launch function form
	jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
    jasmine.getEnv().execute();
    

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