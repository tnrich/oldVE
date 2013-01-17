/**
 * REST proxy that overrides buildUrl
 * @class Teselagen.utils.RestProxy
 * @ignore
 */
Ext.define("Teselagen.utils.RestProxy", {
    requires: ["Ext.data.proxy.Rest"],
//    override: "Ext.data.proxy.Rest",
    buildUrl: function(pReq) {
        return this.callParent(arguments);
    }
});