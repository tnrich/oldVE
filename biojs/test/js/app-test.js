//Ext.require('Ext.app.Application');

//var application = null;
Ext.onReady(function() {
    var reporter = new jasmine.HtmlReporter();
	var jasmineEnv = jasmine.getEnv();
	jasmineEnv.addReporter(reporter);
	jasmineEnv.specFilter = function(spec) {
		return reporter.specFilter(spec);
	};
	jasmineEnv.execute();
    
    /*application = Ext.create('Ext.app.Application', {
        name: 'Vede',
        appFolder: '../app',
        
        controllers: [
            'AppController'
        ],

        launch: function() {
        }
    });*/
});
