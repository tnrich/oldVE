describe("Test GenbankFormat.js", function() {

	it("GenbankFormat is ok", function() {
		var gbFormat = Ext.create('Teselagen.biojs.bio.parsers.GenbankFormat', 'blahblah');
		expect(gbFormat).toBeDefined();
		//console.log(gbFormat.pubname);
		//console.log(gbFormat.self.LOCUS_TAG);
		expect(gbFormat.pubname).toBeDefined();
		expect(gbFormat.self.LOCUS_TAG).toBe("LOCUS");
    });

	
    it("File is not null", function() {
    });

    it("Extract string?",function(){

    });
});