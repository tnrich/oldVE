describe("Generic Ext tests", function() {
   it("Test singleton", function() {
       Ext.define('Nucleotide', {
           config: {
               someProp: 1,
               otherProp: 2
           },
           constructor: function(data) {
               var name = data.name;
	   	       var ambiguousMatches = data.ambiguousMatches || null;
	   	       this.getName = function(){
	   	           return name;
	   	       }
	   	       this.setName = function(pName){
	   	           name = pName;
	   	       }
	   	       this.getAmbiguousMatches = function(){
	   	           return ambiguousMatches;
	   	       }     
	   	       this.setAmbiguousMatches = function(pAmbiguousMatches){
	   	           ambiguousMatches = pAmbiguousMatches;
	   	       }
	   	    }
       });
       Ext.define('My.Singleton', {
           singleton: true,
           someprop: 1,
           a: Ext.create('Nucleotide', {name:'Nuca'}),
           b: Ext.create('Nucleotide', {name:'Nucb'}),
           constructor: function() {
           //console.log('Constructed singleton');
           //console.log(this.a);
           },
           statics: {
	        x: Ext.create('Nucleotide', {name:'Nucx'})
           },
           c: Ext.create('Nucleotide', {name:'Nucc', ambiguousmatches:[this.a, this.b]})
//           c: Ext.create('Nucleotide', {name:'Nucc', ambiguousmatches:[this.a, this.b, this.self.x]})
       });
       //var mySingle = My.Singleton;	  // Ext.create() gives error
   });
   
   it("Test statics", function() {
       	Ext.define('Computer', {
       	    statics: {
       	        instanceCount: 0,
       	        factory: function(brand) {
       	            // 'this' in static methods refer to the class itself
       	            return new this({brand: brand});
       	        },
       	        staticFnc: function() {
       	            console.log('In staticFnc');
       	            // Cannot call instance functions
       	            //privFnc('staticFnc')
       	            //this.privilFnc();
       	            //console.log(this);
       	            this.anotherStaticFnc();
       	            //this.fakePrivFnc('staticFnc');
       	        },
       	        anotherStaticFnc: function() {
       	            console.log('In anotherStaticFnc');
       	        }
       	    },
       	    config: {
       	        brand: null,
       	        foo: 2
       	    },
       	    constructor: function(config) {
       	        this.initConfig(config);
		
       	        // Access static member
       	        // the 'self' property of an instance refers to its class
       	        this.self.instanceCount ++;

       	        // private function
       	        function privFnc(pWho) {
	            //console.log('In privFnc, called by ' + pWho);
       	        }
		
       	        // public priviledged function
       	        this.privilFnc = function() {
       	            //console.log('In privilFnc');
       	            privFnc('privilFnc');
       	        } 

       	        // public static priviledged function
       	        // Doesn't seem that useful
       	        this.self.privilStatic = function() {
       	            //console.log('In privilStatic');
       	            privFnc('privilStaticFnc');
       	        }

       	    },
       	    // fake private function
       	    fakePrivFnc: function fakePrivFnc(pWho) {
       	        //console.log('In fakePrivFnc, called by ' + pWho);
       	    }
       	});
       	//var dellComputer = Computer.factory('Dell');
       	//var appleComputer = Computer.factory('Mac');
       	//console.log(appleComputer.getBrand()); // using the auto-generated getter to get the value of a config property. Alerts "Mac"
       	//console.log(Computer.instanceCount); // Alerts "2"
       	//Computer.staticFnc();
       	//computer = Ext.create('Computer');
       	//computer.privilFnc();
       	//computer.self.privilStatic();
   });
   
   xit("Test ajax", function() {
       Ext.Ajax.request({
	    url:'../data/sigpep.gb',
	    success: function(response) {
		var text = response.responseText;
		//console.log(text);
	    }
       });
   });
   
   xit("Test Viewport", function() {
       Ext.require('Ext.container.Viewport');
       Ext.application({
           name: 'HelloExt',
           launch: function() {
               Ext.create('Ext.container.Viewport', {
                   layout: 'fit',
                   items: [{
                       title: 'Hello Ext',
                       html: 'Hello! Welcome to ExtJS'
                   }]
               });
           }
       });
   });
});

describe("Test class inheritance and aliasing", function() {
    var sl, seq, dna, rna;
    Ext.define("SymbolList", {
        constructor: function() {
            var symbols;
            this.getSymbols = function(){
                return symbols;
            } 
        },
        config: {
            alphabet:"ABC"
        }
    });
    Ext.define("Sequence", {
        extend: "SymbolList"
    });
    Ext.define("DNASequence", {
        extend: "Sequence"
    });
    Ext.define("Teselagen.RNASequence", {
        extend: "Sequence"
    });
    sl = Ext.create("SymbolList");
    seq = Ext.create("Sequence");
    dna = Ext.create("DNASequence");
    rna = Ext.create("Teselagen.RNASequence");
    it("Privileged functions and config properties/functions get inherited", function() {
        expect(sl.getSymbols).toBeDefined();      
        expect(sl.getAlphabet).toBeDefined();      
        expect(sl.alphabet).toBeDefined();      
        expect(seq.getSymbols).toBeDefined();      
        expect(seq.getAlphabet).toBeDefined();      
        expect(seq.alphabet).toBeDefined();      
        expect(dna.getSymbols).toBeDefined();      
        expect(dna.getAlphabet).toBeDefined();      
        expect(dna.alphabet).toBeDefined();      
    });
    it("Ext.getClass", function() {
        expect(Ext.getClass(dna)).toBe(DNASequence);
    });
    it("instanceof", function() {
        expect(dna instanceof DNASequence).toBe(true);
        expect(dna instanceof Sequence).toBe(true);
        expect(dna instanceof SymbolList).toBe(true);
    });
    it("Alias", function() {
        
    });
});