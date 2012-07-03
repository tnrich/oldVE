/**
 * Restriction Enzyme loader. 
 * Allows easy retrieval of common and REBASE restriction enzymes.
 * 
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */

Ext.require("Ext.Ajax");
Ext.require("Ext.data.Store");
Ext.require("Teselagen.bio.enzymes.RestrictionEnzyme");

Ext.define("Teselagen.bio.enzymes.RestrictionEnzymeManager", {
	//Use ext's built-in singleton functionality.
	singleton: true,
	
	commonRestrictionEnzymes: null,
	rebaseRestrictionEnzymes: null,
	
	/**
	 * Retrieves and returns common enzymes from common.xml.
	 * Relies on asynchronous network requests, 
	 */
	getCommonRestrictionEnzymes: function() {
		if(this.commonRestrictionEnzymes != null) {
			return this.commonRestrictionEnzymes;
		}
		
		this.getEnzymes("../src/teselagen/bio/enzymes/assets/common.xml", "common");
		
		setTimeout("return this.commonRestrictionEnzymes", 500);
	},
	
	/**
	 * Retrieves and returns rebase enzymes from rebase.xml.
	 * Relies on asynchronous network requests, 
	 */
	getRebaseRestrictionEnzymes: function() {
		if(this.rebaseRestrictionEnzymes != null) {
			return this.rebaseRestrictionEnzymes;
		}
		
		this.getEnzymes("../src/teselagen/bio/enzymes/assets/rebase.xml", "rebase");
		
		return this.rebaseRestrictionEnzymes;
	},

	/**
	 * Retrieves xml text from a given url, hands it to the parser, 
	 * and writes the enzymes to a variable.
	 * @param {String} url The url to retrieve data from.
	 * @param {String} group Which enzyme variable to write to; either "common" or "rebase".
	 */
	getEnzymes: function(url, group) {
		Ext.Ajax.request({
            url:url,
            success: function(response) {
            	Teselagen.bio.enzymes.RestrictionEnzymeManager.writeEnzymesToVariable(response, group);
            },
			failure: function(response) {
				//alert("Error retrieving enzyme XML file.");
			}
        });
	},
	
	/**
	 * Helper function to allow the "group" variable to be passed
	 * into the AJAX callback in getEnzymes.
	 */
	writeEnzymesToVariable: function(response, group) {
		list = Teselagen.bio.enzymes.RestrictionEnzymeManager.parseXml(response.responseText);

    	if(group === "common") {
    		Teselagen.bio.enzymes.RestrictionEnzymeManager.commonRestrictionEnzymes = list;
    	} else if(group === "rebase") {
    		Teselagen.bio.enzymes.RestrictionEnzymeManager.rebaseRestrictionEnzymes = list;
    	}
	},
	
	/**
	 * Parses XML text and returns an array of RestrictionEnzyme objects.
	 * @param {String} xml XML string to parse.
	 * @returns {Array} enzymeList An array of RestrictionEnzyme objects.
	 */
	parseXml: function(xml) {
		var enzymeList = new Array();
		
		// Define an Ext model "Enzyme" to make reading from XML data possible.
		Ext.define("Enzyme", {
		    extend: "Ext.data.Model",
		    fields: [{name: "name", mapping: "n"},
		             {name: "site", mapping: "s"},
		             {name: "forwardRegex", mapping: "fr"},
		             {name: "reverseRegex", mapping: "rr"},
		             {name: "cutType", type: "int", mapping: "c"},
		             {name: "dsForward", type: "int", mapping: "ds > df"},
		             {name: "dsReverse", type: "int", mapping: "ds > dr"},
		             {name: "usForward", type: "int", mapping: "us > uf"},
		             {name: "usReverse", type: "int", mapping: "us > ur"}]
		});
		
		var doc = new DOMParser().parseFromString(xml, "text/xml");
		
		// Define a store which will hold the data read from XML.
		var memstore = new Ext.data.Store({
		    autoLoad: true,
		    model: "Enzyme",
		    data : doc,
		    proxy: {
		        type: "memory",
		        reader: {
		            type: "xml",
		            record: "e",
		            root: "enzymes"
		        }
		    }
		});
		
		// For each item in the store, add it to a list of enzymes.
		memstore.each(function(e) {
			var enzyme = Ext.create("Teselagen.bio.enzymes.RestrictionEnzyme", {
				name: e.get("name"),
				site: e.get("site"),
				forwardRegex: e.get("forwardRegex"),
				reverseRegex: e.get("reverseRegex"),
				cutType: e.get("cutType"),
				dsForward: e.get("dsForward"),
				dsReverse: e.get("dsReverse"),
				usForward: e.get("usForward"),
				usReverse: e.get("usReverse")
			});
			
			enzymeList.push(enzyme);
		});
		
		return enzymeList;
	}
});
