Ext.onReady(function() {
	var reporter = new jasmine.HtmlReporter();
	var jasmineEnv = jasmine.getEnv();
	jasmineEnv.addReporter(reporter);
	jasmineEnv.specFilter = function(spec) {
		return reporter.specFilter(spec);
	};
	jasmineEnv.execute();
});
