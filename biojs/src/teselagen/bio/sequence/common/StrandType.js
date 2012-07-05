//Move this to app.js eventually?

Ext.define("Teselagen.bio.sequence.common.StrandType", {
	statics: {
		var FORWARD = 1;
		var BACKWARD = -1;
		var UNKNOWN = 0;
	},

	alternateClassName: "Teselagen.StrandType",

	singleton: true,
});