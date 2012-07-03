/**
 * @author Nick Elsbree
 */
Ext.require("Teselagen.bio.enzymes.RestrictionEnzymeManager");
//Ext.require("Teselagen.bio.enzymes.RestrictionEnzymeMapper");

describe("Restriction enzyme tests:", function(){
	//Test RestrictionEnzyme class.
	
	describe("RestrictionEnzyme", function() {
		var enzyme;
		beforeEach(function(){
			enzyme = Ext.create("Teselagen.bio.enzymes.RestrictionEnzyme", {
				inData: {
					name: "Genericase",
					site: "GTCCAGC",
					cutType: 0,
					forwardRegex: "gtcc.gc",
					reverseRegex: "gtcc.gc",
					dsForward: 5,
					dsReverse: 8,
					usForward: 1,
					usReverse: 2
				}
			});
		});
	
		it("exists?", function(){
			expect(enzyme).toBeDefined();
		});
		
		it("is palindromic?", function(){
			expect(enzyme.isPalindromic()).toBe(true);
		});
		
		it("has working getters and setters?", function(){
			enzyme.setName("My Enzyme");
			expect(enzyme.getName()).toBe("My Enzyme");
			
			enzyme.setSite("GCCAGCC");
			expect(enzyme.getSite()).toBe("GCCAGCC");
			
			enzyme.setCutType(1);
			expect(enzyme.getCutType()).toBe(1);
			
			enzyme.setForwardRegex("g+t");
			expect(enzyme.getForwardRegex()).toBe("g+t");
			
			enzyme.setReverseRegex("t+g");
			expect(enzyme.getReverseRegex()).toBe("t+g");
			
			enzyme.setDsForward(3);
			expect(enzyme.getDsForward()).toBe(3);
			
			enzyme.setDsReverse(4);
			expect(enzyme.getDsReverse(4)).toBe(4);
			
			enzyme.setUsForward(2);
			expect(enzyme.getUsForward(2)).toBe(2);
			
			enzyme.setUsReverse(0);
			expect(enzyme.getUsReverse(0)).toBe(0);
		});
	});
	
	//Test RestrictionCutSite class.
	
	xdescribe("RestrictionCutSite", function() {
		
	});
	
	//Test RestrictionEnzymeManager class.
	
	describe("RestrictionEnzymeManager", function() {
		beforeEach(function() {
			Teselagen.bio.enzymes.RestrictionEnzymeManager.commonRestrictionEnzymes = null;
			Teselagen.bio.enzymes.RestrictionEnzymeManager.rebaseRestrictionEnzymes = null;
		});
		
		it("can parse xml?", function() {
			xml = "<enzymes><e><n>AatII</n><s>gacgtc</s><c>0</c><fr><![CDATA[gacgtc]]></fr><rr><![CDATA[gacgtc]]></rr><ds><df>5</df><dr>1</dr></ds><us></us></e><e><n>AvrII</n><s>cctagg</s><c>0</c><fr><![CDATA[c{2}tag{2}]]></fr><rr><![CDATA[c{2}tag{2}]]></rr><ds><df>1</df><dr>5</dr></ds><us></us></e><e><n>BamHI</n><s>ggatcc</s><c>0</c><fr><![CDATA[g{2}atc{2}]]></fr><rr><![CDATA[g{2}atc{2}]]></rr><ds><df>1</df><dr>5</dr></ds><us></us></e><e><n>BglII</n><s>agatct</s><c>0</c><fr><![CDATA[agatct]]></fr><rr><![CDATA[agatct]]></rr><ds><df>1</df><dr>5</dr></ds><us></us></e><e><n>BsgI</n><s>gtgcag</s><c>0</c><fr><![CDATA[gtgcag]]></fr><rr><![CDATA[ctgcac]]></rr><ds><df>22</df><dr>20</dr></ds><us></us></e><e><n>EagI</n><s>cggccg</s><c>0</c><fr><![CDATA[cg{2}c{2}g]]></fr><rr><![CDATA[cg{2}c{2}g]]></rr><ds><df>1</df><dr>5</dr></ds><us></us></e><e><n>EcoRI</n><s>gaattc</s><c>0</c><fr><![CDATA[ga{2}t{2}c]]></fr><rr><![CDATA[ga{2}t{2}c]]></rr><ds><df>1</df><dr>5</dr></ds><us></us></e><e><n>EcoRV</n><s>gatatc</s><c>0</c><fr><![CDATA[gatatc]]></fr><rr><![CDATA[gatatc]]></rr><ds><df>3</df><dr>3</dr></ds><us></us></e><e><n>HindIII</n><s>aagctt</s><c>0</c><fr><![CDATA[a{2}gct{2}]]></fr><rr><![CDATA[a{2}gct{2}]]></rr><ds><df>1</df><dr>5</dr></ds><us></us></e><e><n>KpnI</n><s>ggtacc</s><c>0</c><fr><![CDATA[g{2}tac{2}]]></fr><rr><![CDATA[g{2}tac{2}]]></rr><ds><df>5</df><dr>1</dr></ds><us></us></e><e><n>MseI</n><s>ttaa</s><c>0</c><fr><![CDATA[t{2}a{2}]]></fr><rr><![CDATA[t{2}a{2}]]></rr><ds><df>1</df><dr>3</dr></ds><...f><dr>6</dr></ds><us></us></e><e><n>PstI</n><s>ctgcag</s><c>0</c><fr><![CDATA[ctgcag]]></fr><rr><![CDATA[ctgcag]]></rr><ds><df>5</df><dr>1</dr></ds><us></us></e><e><n>PvuI</n><s>cgatcg</s><c>0</c><fr><![CDATA[cgatcg]]></fr><rr><![CDATA[cgatcg]]></rr><ds><df>4</df><dr>2</dr></ds><us></us></e><e><n>SacI</n><s>gagctc</s><c>0</c><fr><![CDATA[gagctc]]></fr><rr><![CDATA[gagctc]]></rr><ds><df>5</df><dr>1</dr></ds><us></us></e><e><n>SacII</n><s>ccgcgg</s><c>0</c><fr><![CDATA[c{2}gcg{2}]]></fr><rr><![CDATA[c{2}gcg{2}]]></rr><ds><df>4</df><dr>2</dr></ds><us></us></e><e><n>SalI</n><s>gtcgac</s><c>0</c><fr><![CDATA[gtcgac]]></fr><rr><![CDATA[gtcgac]]></rr><ds><df>1</df><dr>5</dr></ds><us></us></e><e><n>SmaI</n><s>cccggg</s><c>0</c><fr><![CDATA[c{3}g{3}]]></fr><rr><![CDATA[c{3}g{3}]]></rr><ds><df>3</df><dr>3</dr></ds><us></us></e><e><n>SpeI</n><s>actagt</s><c>0</c><fr><![CDATA[actagt]]></fr><rr><![CDATA[actagt]]></rr><ds><df>1</df><dr>5</dr></ds><us></us></e><e><n>SphI</n><s>gcatgc</s><c>0</c><fr><![CDATA[gcatgc]]></fr><rr><![CDATA[gcatgc]]></rr><ds><df>5</df><dr>1</dr></ds><us></us></e><e><n>XbaI</n><s>tctaga</s><c>0</c><fr><![CDATA[tctaga]]></fr><rr><![CDATA[tctaga]]></rr><ds><df>1</df><dr>5</dr></ds><us></us></e><e><n>XhoI</n><s>ctcgag</s><c>0</c><fr><![CDATA[ctcgag]]></fr><rr><![CDATA[ctcgag]]></rr><ds><df>1</df><dr>5</dr></ds><us></us></e><e><n>XmaI</n><s>cccggg</s><c>0</c><fr><![CDATA[c{3}g{3}]]></fr><rr><![CDATA[c{3}g{3}]]></rr><ds><df>1</df><dr>5</dr></ds><us></us></e></enzymes>";
			var enz = Teselagen.bio.enzymes.RestrictionEnzymeManager.parseXml(xml)
			expect(enz.length).toBeGreaterThan(0);
		});
		
		it("can compute common enzymes?", function() {
			var enz = Teselagen.bio.enzymes.RestrictionEnzymeManager.getCommonRestrictionEnzymes();
			console.log(enz);
			expect(enz.length).toBeGreaterThan(0);
		});
		
		it("can compute rebase enzymes?", function() {
			var enz = Teselagen.bio.enzymes.RestrictionEnzymeManager.getRebaseRestrictionEnzymes();
			console.log(enz);
			expect(enz.length).toBeGreaterThan(0);
		});
	});
	
	//Test RestrictionEnzymeMapper class.
	
	/*describe("RestrictionEnzymeMapper", function() {
		it("can correctly cut a DNA strand?", function() {
			var enzyme1 = Ext.create("Teselagen.bio.enzymes.RestrictionEnzyme", {
				inData: {
					name: "Genericase",
					site: "GTCCAGC",
					cutType: 0,
					forwardRegex: "gtcc.gc",
					reverseRegex: "gtcc.gc",
					dsForward: 5,
					dsReverse: 8,
					usForward: 1,
					usReverse: 2
				}
			});			
			
			var cutSites = Teselagen.bio.enzymes.RestrictionEnzymeMapper.cutSequenceByRestrictionEnzyme(
					enzyme1,
					"actcacgccggcatgtccagcgtcctgcgtccgcgacctg");
			console.log(cutSites);

			describe("Cut sites", function() {
				it("has correct number of cuts? (3)", function() {
					expect(cutSites.length).toBe(3);
				});
			});
		});
	});*/
});