/**
 * @class Teselagen.bio.sequence.common.StrandType
 * Contains constants for strand directionality
 * 
 * @author Micah Lerner
 */
Ext.define("Teselagen.bio.sequence.common.StrandType", {
	statics: {
		FORWARD: 1,
		BACKWARD: -1,
		UNKNOWN: 0,
	},
<<<<<<< HEAD
	
	alternateClassName: "Teselagen.StrandType",
=======
>>>>>>> micah_test

	alternateClassName: "Teselagen.StrandType",

// Nick's edit: apparently making a class a singleton makes the 'statics' unavailable from outside that class. hooray for extjs
//singleton: "True",
});