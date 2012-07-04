
    /**
    * StringUtil Library
    * @description From http://sajjadhossain.com/2008/10/31/javascript-string-trimming-and-padding/
    * @author Diana Wong
    */

//Ext.define('Teselagen.bio.util.StringUtil', {
	
	//singleton = true; 
	

	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g,"");
	}
	 
	//trimming space from left side of the string
	String.prototype.ltrim = function() {
		return this.replace(/^\s+/,"");
	}
	 
	//trimming space from right side of the string
	String.prototype.rtrim = function() {
		return this.replace(/\s+$/,"");
	}
	
	String.prototype.lpad = function(padString, length) {
		var str = this;
	    while (str.length < length)
	        str = padString + str;
	    return str;
	}
	 
	//pads right
	String.prototype.rpad = function(padString, length) {
		var str = this;
	    while (str.length < length)
	        str = str + padString;
	    return str;
	}
//});