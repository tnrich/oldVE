/**
 * @class Teselagen.models.Part
 * Class describing a Part for J5Parameters.
 * @author Diana Wong
 * @author Zinovii Dmytriv (original author) ?
 */
Ext.define("Teselagen.models.Part", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.PartVO"
    ],

    statics: {
    },

    /**
     * Input parameters.
     * NOTE: Must execute setId() to set the id from "" to a unique identifier.
     * @param {Teselagen.models.PartVO} partVO PartVO.
     * @param {Boolean} directionForward Direction forward.
     * @param {String} fas
     * @param {String} id ID is composed of the Date.toString + 4 random digits
     */
    fields: [
        {name: "partVO",            type: "auto",       defaultValue: null},
        {name: "directionForward",  type: "boolean",    defaultValue: true},
        {name: "fas",               type: "string",     defaultValue: ""},
        {name: "id",                type: "string",     defaultValue: Date.now()}
    ],

    /**
     * Sets the id for this part
     * NOTE: Must execute setId() to set the id from "" to a unique identifier.
     */
     setId: function() {
        var extraDigits = Math.floor(Math.random() * 1000).toString();

        while (extraDigits.length < 3) {
            extraDigits = "0" + extraDigits;
        }
        var newId = (Date.now()) + extraDigits;

        this.set("id", newId);
        return true;
     },

    /**
     * Determines if PartVO is empty.
     * @returns {Boolean} equal True if empty, false if not.
     */
    isEmpty: function() {
        var partEmpty = false;

        if (this.get("partVO") === undefined || this.get("partVO") === null) {
            partEmpty = true;
        } else if (this.get("partVO").isEmpty()) {
            partEmpty = true;
        }
        
        if (  partEmpty
            && this.get("directionForward") === true
            && this.get("fas") === "" ) {
            return true;
        }
        return false;
    }
});
