Ext.define("Teselagen.store.RestProxy", {
    requires: ["Ext.data.proxy.Rest"],
    override: "Ext.data.proxy.Rest",
    buildUrl: function(pReq) {
        return this.callParent(arguments);
    }
});