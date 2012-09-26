/**
 * @class Teselagen.models.SBOLvIconInfo
 * Class describing a SBOLvIconInfo.
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.models.SBOLvIconInfo", {
    extend: "Ext.data.Model",

    requires: [
    ],

    statics: {
    },

    /**
     * Input parameters.
     * @param {String} id
     * @param {String} name
     * @param {String} forwardPath
     * @param {String} reversePath
     */
    fields: [
        {name: "id",                    type: "string",     defaultValue: ""},
        {name: "name",                  type: "string",     defaultValue: ""},
        {name: "forwardPath",           type: "string",     defaultValue: ""},
        {name: "reversePath",           type: "string",     defaultValue: ""}
    ],

    /**
     * SetFields may not be neccessary since you should set these when creating this object.
     */
    setFields: function(pId, pName, pForwardPath, pReversePath) {
        this.set("id", pId);
        this.set("name", pName);
        this.set("forwardPath", pForwardPath);
        this.set("reversePath", pReversePath);
    }
});
