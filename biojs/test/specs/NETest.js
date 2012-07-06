/**
 * @author Nick Elsbree
 */
Ext.require("Teselagen.bio.enzymes.RestrictionEnzymeManager");
Ext.require("Teselagen.bio.enzymes.RestrictionEnzymeMapper");
Ext.require("Teselagen.bio.sequence.alphabets.DNAAlphabet");
Ext.require("Teselagen.bio.sequence.common.StrandedAnnotation");
Ext.require("Teselagen.bio.sequence.symbols.GapSymbol");
Ext.require("Teselagen.bio.tools.DigestionCalculator");
Ext.require("Teselagen.bio.orf.ORF");
Ext.require("Teselagen.bio.orf.ORFFinder");

n1 = Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
	name: "gap",
	value: "gappy"
});
a = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {
	name: "Adenine",
	value: "a",
})
n3 = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {
	name: "A or T",
	value: "t",
	ambiguousMatches: a
});
c = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {
	name: "Cytosine",
	value: "c"
});
g = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {
	name: "Guanine",
	value: "g"
});
t = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {
	name: "Thymine",
	value: "t"
});

describe("Restriction enzyme classes:", function() {
	//Test RestrictionEnzyme class.
	
	describe("RestrictionEnzyme", function() {
		var enzyme;
		beforeEach(function(){
			enzyme = Ext.create("Teselagen.bio.enzymes.RestrictionEnzyme", {
				name: "Genericase",
				site: "GTCCAGC",
				cutType: 0,
				forwardRegex: "gtcc.gc",
				reverseRegex: "gtcc.gc",
				dsForward: 5,
				dsReverse: 8,
				usForward: 1,
				usReverse: 2
			});
		});
	
		it("exists?", function(){
			expect(enzyme).toBeDefined();
		});
		
		it("is palindromic?", function(){
			expect(enzyme.isPalindromic()).toBe(true);
		});
		
		it("has working getters and setters?", function(){
			expect(enzyme.getName()).toBe("Genericase");
			enzyme.setName("My Enzyme");
			expect(enzyme.getName()).toBe("My Enzyme");
			
			expect(enzyme.getSite()).toBe("GTCCAGC");
			enzyme.setSite("GCCAGCC");
			expect(enzyme.getSite()).toBe("GCCAGCC");
			
			expect(enzyme.getCutType()).toBe(0);
			enzyme.setCutType(1);
			expect(enzyme.getCutType()).toBe(1);
			
			expect(enzyme.getForwardRegex()).toBe("gtcc.gc");
			enzyme.setForwardRegex("g+t");
			expect(enzyme.getForwardRegex()).toBe("g+t");
			
			expect(enzyme.getReverseRegex()).toBe("gtcc.gc");
			enzyme.setReverseRegex("t+g");
			expect(enzyme.getReverseRegex()).toBe("t+g");
			
			expect(enzyme.getDsForward()).toBe(5);
			enzyme.setDsForward(3);
			expect(enzyme.getDsForward()).toBe(3);
			
			expect(enzyme.getDsReverse()).toBe(8);
			enzyme.setDsReverse(4);
			expect(enzyme.getDsReverse(4)).toBe(4);
			
			expect(enzyme.getUsForward()).toBe(1);
			enzyme.setUsForward(2);
			expect(enzyme.getUsForward(2)).toBe(2);
			
			expect(enzyme.getUsReverse()).toBe(2);
			enzyme.setUsReverse(0);
			expect(enzyme.getUsReverse(0)).toBe(0);
		});
	});
	
	//Test RestrictionCutSite class.
	
	describe("RestrictionCutSite", function() {
		var enzyme;
		var site;
		beforeEach(function(){
			enzyme = Ext.create("Teselagen.bio.enzymes.RestrictionEnzyme", {
				name: "Genericase",
				site: "GTCCAGC",
				cutType: 0,
				forwardRegex: "gtcc.gc",
				reverseRegex: "gtcc.gc",
				dsForward: 5,
				dsReverse: 8,
				usForward: 1,
				usReverse: 2
			});

			site = Ext.create("Teselagen.bio.enzymes.RestrictionCutSite", {
				start: 10,
				end: 20,
				strand: Teselagen.bio.sequence.common.StrandType.FORWARD,
				restrictionEnzyme: enzyme
			});
		});

		it("exists?", function() {
			expect(site).toBeDefined();
		});

		it("has working getters and setters?", function() {
			enzyme2 = Ext.create("Teselagen.bio.enzymes.RestrictionEnzyme", {
				name: "Genericase 2",
				site: "GTCCAGC",
				cutType: 1,
				forwardRegex: "gtcc.gc",
				reverseRegex: "gt.gc",
				dsForward: 50,
				dsReverse: 8,
				usForward: 11,
				usReverse: 10
			});

			expect(site.getRestrictionEnzyme()).toEqual(enzyme);
			site.setRestrictionEnzyme(enzyme2);
			expect(site.getRestrictionEnzyme()).toEqual(enzyme2);

			expect(site.getNumCuts()).toEqual(0);
			site.setNumCuts(10);
			expect(site.getNumCuts()).toEqual(10);
		});
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
			expect(enz.length).toBeGreaterThan(0);
		});
		
		it("can compute rebase enzymes?", function() {
			var enz = Teselagen.bio.enzymes.RestrictionEnzymeManager.getRebaseRestrictionEnzymes();
			expect(enz.length).toBeGreaterThan(0);
		});
	});
	
	//Test RestrictionEnzymeMapper class.
	
	describe("RestrictionEnzymeMapper", function() {
		var enzyme = Ext.create("Teselagen.bio.enzymes.RestrictionEnzyme", {
			name: "Genericase",
			site: "GTCCAGC",
			cutType: 0,
			forwardRegex: "gtcc.gc",
			reverseRegex: "gtcc.gc",
			dsForward: 5,
			dsReverse: 8,
			usForward: 1,
			usReverse: 2
		});

		var sequence = Ext.create("Teselagen.bio.sequence.common.StrandedAnnotation", {
			start: 0,
			end: 39,
			strand: "actcacgccggcatgtccagcgtcctgcgtccgcgacctg"
		});

		it("exists?", function() {
			expect(Teselagen.bio.enzymes.RestrictionEnzymeMapper).toBeDefined();
		});
		
		
		describe("cutSequenceByRestrictionEnzyme", function() {
			it("finds correct cut sites", function() {
				waitsFor(function() {
					return Teselagen.bio.sequence.alphabets.DNAAlphabet != undefined &&
							Teselagen.bio.enzymes.RestrictionEnzymeMapper != undefined;
				}, "Timed out waiting for DNAAlphabet.", 2000);

				runs(function() {
					var symList = Ext.create("Teselagen.bio.sequence.common.SymbolList", {
						symbols: [a,t,c,a,c,g,c,c,g,g,c,a,t,g,t,c,c,a,g,c,g,t,c,c,t,g,c,g,t,c,c,g,c,g,a,c,c,t,g],
						alphabet: Teselagen.bio.sequence.alphabets.DNAAlphabet
					});

					var cutSites = Teselagen.bio.enzymes.RestrictionEnzymeMapper.cutSequenceByRestrictionEnzyme(enzyme, symList);
					expect(cutSites.length).toBe(2);
					expect(cutSites[0].start).toBe(14);
					expect(cutSites[1].start).toBe(21);
				});
			});
		});
	});
});

describe("ORF classes:", function() {
	//Test ORF classes.
	
	describe("ORF", function() {
		var orfVar;
		beforeEach(function() {
			orfVar = Ext.create("Teselagen.bio.orf.ORF", {
				start: 5,
				end: 100,
				strand: Teselagen.bio.sequence.common.StrandType.FORWARD,
				frame: 1,
				startCodons: [1, 3, 5]
			});
		});

		it("exists?", function() {
			expect(orfVar).toBeDefined();
		});

		it("has working getters and setters?", function() {
			expect(orfVar.getFrame()).toBe(1);
			orfVar.setFrame(2);
			expect(orfVar.getFrame()).toBe(2);

			expect(orfVar.getStartCodons()).toEqual([1, 3, 5]);
			orfVar.setStartCodons([2, 3, 4]);
			expect(orfVar.getStartCodons()).toEqual([2, 3, 4]);
		});
	});

	xdescribe("ORFFinder", function() {
		var seq;

		it("can find stop codons", function() {
			expect(Teselagen.bio.orf.ORFFinder.evaluatePossibleStop(n1, n1, n1)).toBeTruthy();
			expect(Teselagen.bio.orf.ORFFinder.evaluatePossibleStop(a, a, a)).toBeFalsy();
			expect(Teselagen.bio.orf.ORFFinder.evaluatePossibleStop(n3, n3, n3)).toBeTruthey();
		});

		it("can find correct orfs", function() {

			waitsFor(function() {
				return Teselagen.bio.sequence.alphabets.DNAAlphabet != undefined;
			}, "Timed out waiting for DNAAlphabet.", 2000);

			runs(function() {
				seq = Ext.create("Teselagen.bio.sequence.common.SymbolList", {
					symbols: [c, a, a, g, c, g, c, g, c, c, n3, a, g],
					alphabet: Teselagen.bio.sequence.alphabets.DNAAlphabet
				});

				var orfs = Teselagen.bio.orf.ORFFinder.calculateORFs(seq);
					
				expect(orfs.length).toBe(1);
				expect(orfs[0].getFrame()).toBe(1);
				expect(orfs[0].getStart()).toBe(1);
			});
		});
	});
});

describe("Tools:", function() {
	describe("DigestionCalculator", function() {
		it("can digest sequences", function() {
			waitsFor(function() {
				return Teselagen.bio.sequence.alphabets.DNAAlphabet != undefined;
			}, "Timed out waiting for DNAAlphabet.", 2000);

			runs(function() {
				var symList = Ext.create("Teselagen.bio.sequence.common.SymbolList", {
					symbols: [a,g,c,a,g,a,g,t,c,c,a,g,c,a,c,g,c,a,t,t,c,a,g,g,c,a,c,a,g,a,c,g,t],
					alphabet: Teselagen.bio.sequence.alphabets.DNAAlphabet
				});
				try{
					var seq = Ext.create("Teselagen.bio.sequence.dna.DNASequence", {
						symbolList: symList,
						name: "Test Sequence",
						circular: false,
						accession: "",
						version : 1,
						seqVersion: 1.0,
						symbols: [],
						alphabet: Teselagen.bio.sequence.alphabets.DNAAlphabet
					});
				} catch(e) {
					console.log(e.getMessage());
				}

				var enzyme1 = Ext.create("Teselagen.bio.enzymes.RestrictionEnzyme", {
					name: "Genericase",
					site: "GTCCAGC",
					cutType: 0,
					forwardRegex: "gtcc.gc",
					reverseRegex: "gtcc.gc",
					dsForward: 5,
					dsReverse: 8,
					usForward: 1,
					usReverse: 2
				});

				var enzyme2 = Ext.create("Teselagen.bio.enzymes.RestrictionEnzyme", {
					name: "Genericase 2",
					site: "cag",
					cutType: 0,
					forwardRegex: "cag",
					reverseRegex: "cag",
					dsForward: 5,
					dsReverse: 8,
					usForward: 1,
					usReverse: 2
				});

				var frags = Teselagen.bio.tools.DigestionCalculator.digestSequence(seq, [enzyme1, enzyme2]);

				expect(frags.length).toBe(5);
			});
		});
	});
});