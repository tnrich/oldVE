/**
 * @class Teselagen.bio.enzymes.RestrictionEnzymeManager
 * @singleton
 * 
 * Restriction Enzyme loader. 
 * Allows easy retrieval of common and REBASE restriction enzymes.
 * 
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.bio.enzymes.RestrictionEnzymeManager", {
	//Use ext's built-in singleton functionality.
	singleton: true,
	
	requires: ["Ext.Ajax", "Ext.data.Store", "Teselagen.bio.enzymes.RestrictionEnzyme"],
	
	commonRestrictionEnzymes: null,
	rebaseRestrictionEnzymes: null,
	
	/**
	 * Retrieves and returns common enzymes from common.xml.
	 * @return {Array<Teselagen.bio.enzymes.RestrictionEnzyme>} List of common enzymes.
	 */
	getCommonRestrictionEnzymes: function() {
		if(this.commonRestrictionEnzymes != null) {
			return this.commonRestrictionEnzymes;
		}
		
		this.commonRestrictionEnzymes = this.getEnzymes("assets/common.xml");
		return this.commonRestrictionEnzymes;
	},
	
	/**
	 * Retrieves and returns rebase enzymes from rebase.xml.
	 * @return {Array<Teselagen.bio.enzymes.RestrictionEnzyme>} List of enzymes in REBASE.
	 */
	getRebaseRestrictionEnzymes: function() {
		if(this.rebaseRestrictionEnzymes != null) {
			return this.rebaseRestrictionEnzymes;
		}
		
		this.rebaseRestrictionEnzymes = this.getEnzymes("assets/rebase.xml");
		return this.rebaseRestrictionEnzymes;
	},

	/**
	 * @private
	 * Retrieves xml text from a given url, hands it to the parser, 
	 * and writes the enzymes to a variable.
	 * @param {String} url The url to retrieve data from.
	 * @param {String} group Which enzyme variable to write to; either "common" or "rebase".
	 */
	getEnzymes: function(url) {
		var xhReq = new XMLHttpRequest();
		xhReq.open("GET", url, false); 
		xhReq.send(null);
		var xml = xhReq.responseText;
		
		// Handle errors.
		if(xhReq.status != 200) {
			bioException = Ext.create("Teselagen.bio.BioException", {
				message: "Incorrect enzyme file URL: " + url,
			});
			throw bioException;
		}
		
		return Teselagen.bio.enzymes.RestrictionEnzymeManager.parseXml(xml);
	},
	
	/**
	 * @private
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
	},
	
	/**
	 * @private
	 * Helper function to get XML from a file on the server.
	 * @return Either an XMLHttpRequest object or an ActiveXObject (for IE users).
	 */
	createXMLHttpRequest: function() {
		try { return new XMLHttpRequest(); } catch(e) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {}
		alert("XMLHttpRequest not supported");
		return null;
	}
});