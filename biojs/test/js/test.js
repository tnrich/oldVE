
/*
 * @description This function excecutes the jasmine unit testing. Recycle as needed.
 * @author Diana Wong
 */

Ext.onReady(function() {
    
	jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
    jasmine.getEnv().execute();

});