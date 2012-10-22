Ext.define('Vede.vew.de.grid.Grid', {
    extend: 'Ext.container.Container',
    alias: 'widget.Grid',

    constructor: function(config) {
        console.log(config);
        this.callParent(arguments);
    },

    add: function(bin) {
        this.callParent(bin);
    },
});
