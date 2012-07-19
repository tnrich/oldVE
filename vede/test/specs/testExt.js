Ext.require("Teselagen.bio.parsers.GenbankManager");

Ext.onReady(function() {
describe("Generic Ext tests", function() {
 
    describe("Test class inheritance", function() {
        var sl, seq, dna, alphabet;
        var RNASequence;
        beforeEach(function() {
            Ext.define("SymbolList", {
                constructor: function() {
                    var symbols;
                    this.getSymbols = function(){
                        return symbols;
                    } 
                    this.setSymbols = function(pSymbols){
                        symbols = pSymbols;
                    }
                    this.length = 0;
                },
                config: {
                    alphabet:"ABC",
                    another: "someValue",
                    length: 0,
                    mask: 0
                },
                applyAnother: function(pAnother) {
                    if (pAnother) {
                        return pAnother;
                    }
                },
                getMask: function() {
                    return 1;
                },
                applyLength: function(pLength) {
                  if (pLength > 0) {
                      return pLength;
                  }  
                },
                statics: {
                    staticProp: 10,
                    staticFunc: function() {
                        return "DEF"
                    }
                }
            });
            Ext.define("Sequence", {
                extend: "SymbolList"
            });
            Ext.define("DNASequence", {
                extend: "Sequence",
                constructor: function() {
                    var privVar = 15;
                    this.callParent();
                    this.getPrivVar = function() {
                        return privVar;
                    }
                    this.self.prototype.getPrivVarProto = function() {
                        return privVar;
                    }
                },
                someFunc: function() {                
                },
                someProp: "someDna"
            });
            Ext.define("AbstractAlphabet", {
            }); 
            sl = Ext.create("SymbolList");
            seq = Ext.create("Sequence");
            dna = Ext.create("DNASequence");
            alphabet = Ext.create("AbstractAlphabet")
        });
        it("Privileged functions get inherited", function() {
            expect(sl.getSymbols).toBeDefined();      
            expect(seq.getSymbols).toBeDefined();      
            expect(dna.getSymbols).toBeDefined();      
        });
        it("Config properties and autogenerated functions get inherited", function() {
            expect(sl.alphabet).toBeDefined();      
            expect(sl.getAlphabet).toBeDefined();      
            expect(sl.setAlphabet).toBeDefined();      
            expect(seq.alphabet).toBeDefined();      
            expect(seq.getAlphabet).toBeDefined();      
            expect(seq.setAlphabet).toBeDefined();      
            expect(dna.alphabet).toBeDefined();      
            expect(dna.getAlphabet).toBeDefined();      
            expect(dna.setAlphabet).toBeDefined();      
        });
        it("Config property with apply", function() {
            expect(sl.another).not.toBeDefined();      
            expect(sl.setAnother).toBeDefined();
            expect(sl.getAnother).toBeDefined();
        })
        it("instanceof", function() {
            expect(dna instanceof DNASequence).toBe(true);
            expect(dna instanceof Sequence).toBe(true);
            expect(dna instanceof SymbolList).toBe(true);
            expect(dna instanceof AbstractAlphabet).toBe(false);
        });
        it("Class names", function() {
            expect(Ext.getClass(dna)).toBe(DNASequence);
            expect(Ext.getClassName(DNASequence)).toBe("DNASequence");
            expect(DNASequence.getName()).toBe("DNASequence");
        });
        it("Static properties are not inherited", function() {
            expect(SymbolList.staticProp).toBe(10);
            expect(DNASequence.staticProp).not.toBeDefined();
        });
        it("Static property is defined in constructor function", function() {
            expect(SymbolList.hasOwnProperty("staticProp")).toBe(true);
        });
        it("Superclass access", function() {
            expect(dna.superclass.superclass.self.staticProp).toBe(10);
            expect(DNASequence.superclass.superclass.self.staticProp).toBe(10);
            expect(dna.superclass.superclass.self.staticFunc.call()).toBe("DEF");
        });
        it("Priviledged function is not in prototype", function() {
            expect(dna.getPrivVar()).toBe(15);
            expect(DNASequence.prototype.getPrivVar).not.toBeDefined();
            expect(DNASequence.prototype.getPrivVarProto).toBeDefined();
            expect(dna.getPrivVarProto()).toBe(15);
        });
        it("Ext.define properties are in prototype", function() {
            expect(DNASequence.prototype.someFunc).toBeDefined();
            expect(DNASequence.prototype.someProp).toBeDefined();
        });
        it("Config property access using dot operator and autogenerated getter", function() {
            expect(dna.alphabet).toBe("ABC");
            expect(dna.getAlphabet()).toBe("ABC");
        });
        it("Setting config property via setter creates instance property", function() {
            expect(dna.hasOwnProperty("alphabet")).toBe(false);
            dna.setAlphabet("DEF");
            expect(dna.hasOwnProperty("alphabet")).toBe(true);
        });
        it("Getting config property via custom getter and dot operator", function() {
            expect(dna.getMask()).toBe(1);
            expect(dna.mask).toBe(0);
        });
        it("Setting config property via custom setter", function() {
            expect(dna.hasOwnProperty("length")).toBe(true);
            dna.setLength(-1);
            expect(dna.length).toBe(0);
        });
        it("Setting config property with apply filters value", function() {
            dna.setAnother("FOO");
            expect(dna.getAnother()).toBe("FOO");
            dna.setAnother("");
            expect(dna.getAnother()).toBe("FOO");
        })
        it("Setting config property via dot operator creates instance property that overrides apply function",
                function() {
            expect(dna.hasOwnProperty("another")).toBe(false);
            expect(dna.getAnother()).toBe("someValue");
            dna.another = "";
            expect(dna.hasOwnProperty("another")).toBe(true);
            expect(dna.another).toBe("");
            expect(dna.getAnother()).toBe("");  // same values
        });
        it("Setting private member with setter", function() {
            expect(dna.hasOwnProperty("symbols")).toBe(false);
            dna.setSymbols("XYZ");
            expect(dna.hasOwnProperty("symbols")).toBe(false);
            expect(dna.getSymbols()).toBe("XYZ");
        });
        it("Setting private member via dot operator creates a separate instance property", function() {
            dna.setSymbols("XYZ");
            expect(dna.hasOwnProperty("symbols")).toBe(false);
            dna.symbols = "SET";
            expect(dna.hasOwnProperty("symbols")).toBe(true);
            expect(dna.symbols).toBe("SET");
            expect(dna.getSymbols()).toBe("XYZ"); // different values
        });
    });

    describe("Aliasing", function() {
        var mgr;
        it("GenbankManager exists", function() {
            expect(Ext.create("Teselagen.bio.parsers.GenbankManager")).toBeDefined();
        });
        beforeEach(function() {
            Ext.define("MyManager", {
                extend: "Teselagen.bio.parsers.GenbankManager",
                GenbankManager:  Teselagen.bio.parsers.GenbankManager,
                statics: {
                    GenbankMgr: Teselagen.bio.parsers.GenbankManager
                },
                constructor: function() {
                    var self = this.statics();
                    expect(this.GenbankManager.getName())
                        .toBe("Teselagen.bio.parsers.GenbankManager");
                    expect(this.self.GenbankMgr.getName())
                        .toBe("Teselagen.bio.parsers.GenbankManager");
                    expect(self.GenbankMgr.getName())
                        .toBe("Teselagen.bio.parsers.GenbankManager");
                }
            });
            mgr = Ext.create("MyManager");
        });
        it("Can get instance alias class name", function() {
            expect(mgr.GenbankManager.getName())
                .toBe("Teselagen.bio.parsers.GenbankManager");
        });
        it("Can get static alias class name", function() {
            expect(MyManager.GenbankMgr.getName())
            .toBe("Teselagen.bio.parsers.GenbankManager");
        })
    });

    describe("Config tests", function() {
        var iphone, android;
        beforeEach(function() {
            Ext.define('SmartPhone', {
                config: {
                    hasTouchScreen: false,
                    operatingSystem: 'Other',
                    price: 500
                }
            });
            iphone = Ext.create("SmartPhone");
        });
        it("Config can be gotten with dot operator", function() {
            expect(iphone.price).toBe(500);
        })
        it("Config can be set with dot operator", function() {
            iphone.price=600;
            expect(iphone.price).toBe(600);
        })
        it("Config can be gotten with getter method", function() {
            expect(iphone.getPrice()).toBe(500);
        })
        it("Config can be set with setter method", function() {
            iphone.setPrice(550);
            expect(iphone.price).toBe(550);
        })
    });

    describe("Exception tests", function() {
        var inst, flag = false;
        beforeEach(function() {
           Ext.define('ExceptionTest', {
               constructor: function() {
                   Ext.Error.handle = this.errHandler;  
               },
               raiseException: function() {
                   Ext.Error.raise({msg:"Test exception"});
               },
               throwException: function() {
                   throw new Ext.Error({msg:"Test throwing"});
               },
               errHandler:function(pErr) {
                   console.warn(pErr);
                   return true;
             }  
           });
           inst = Ext.create("ExceptionTest");
        });
        
        it("Raising exception", function() {
            inst.raiseException();
        });
        it("Cannot catch raised exception", function() {
            try {
                inst.raiseException();
            }
            catch(pE) {
                console.warn("Caught:" + pE);
                flag = true;
            }
            expect(flag).toBe(false);
        });
        it("Catch thrown exception", function() {
            try {
                inst.throwException();
            }
            catch(pE) {
                flag = true;
                console.warn("Caught:" + pE);
            }
            expect(flag).toBe(true);
        });
    })
    
    xdescribe("Test singleton", function() {
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
   
    xdescribe("Test statics", function() {
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
   
   xdescribe("Test ajax", function() {
       Ext.Ajax.request({
	    url:'../data/sigpep.gb',
	    success: function(response) {
		var text = response.responseText;
		//console.log(text);
	    }
       });
   });
   
   xdescribe("Test Viewport", function() {
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

});