describe("Testing GenbankFormat.js", function() {
	
	var gbFormat = Ext.create('Teselagen.biojs.bio.parsers.GenbankFormat', 'blahblah');

	it("1.) GenbankFormat statics are ok.", function() {
		
		expect(gbFormat).toBeDefined();
		//console.log(gbFormat.pubname);
		//console.log(gbFormat.self.LOCUS_TAG);
		expect(gbFormat.pubname).toBeDefined();
		expect(gbFormat.self.LOCUS_TAG).toBe("LOCUS");
		expect(gbFormat.self.END_SEQUENCE_TAG).toBe("//");
    });

	
    it("2.) GenbankFileModel Initializing: ", function() {
    	var gbFM = Ext.create('Teselagen.biojs.bio.parsers.GenbankFileModel');
    	console.log(gbFM.locus);
    	console.log(gbFM.getLocus());
    	expect(gbFM.getLocus()).toBeDefined();
    	
    });

    it("Extract string?",function(){

    });
});