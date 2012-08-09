describe('UI tests', function () {
    var fixtureAddress = '/vede/test/jasmine-uiSpec.html';
    describeUi("Basic tests", fixtureAddress, function () {
        function currentBaseUrl() {
            return window.location.pathname;
        }
        it("should execute it callbacks in the url defined by describeUi", function () {
            expect(currentBaseUrl()).toBe(fixtureAddress);
        });
	});
});