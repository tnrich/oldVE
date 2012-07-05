//Move this to app.js eventually?

Ext.define("Teselagen.bio.sequence.common.StrandType", {
	statics: {
		FORWARD: 1,
		BACKWARD: -1,
		UNKNOWN: 0,
	},

	alternateClassName: "Teselagen.StrandType",

	singleton: "True",
});