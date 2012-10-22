/**
 * Class which creates a component for a given bin to display in the Device
 * Editor.
 */
Ext.define('Vede.view.de.grid.Bin', {
    extend: 'Ext.container.Container',
    alias: 'widget.Bin',

    config: {
        bin: null
    },

    /**
     * @param Teselagen.models.J5Bin
     */
    constructor: function(config) {
        this.initConfig(config);

        var binHeader = Ext.create('Ext.container.Container', {
            layout: {
                type: ''
            },
            items: [{
                html: '<p>' + this.getBin().get("binName") + '</p>',
                height: 100,
                bodyStyle: {
                    'padding-top': '80px',
                    'text-align': 'center'
                },
                style: {
                    marginBottom: '10px'
                },
                styleHtmlContent: true,
                styleHtmlCls: 'binHeader'
            }, {
                xtype: 'button',
                text: 'flip me'
            }]
        });
        
        this.callParent([{
            layout: {
                type: 'table',
                columns: 1,
                tableAttrs: {
                    style: {
                        width: '100%'
                    }
                }
            },
            width: 125,
            items: [binHeader]
        }]);

        // Add each part in the bin to the bin view object.
        this.getBin().parts().each(function(part) {
            this.add(Ext.create("Vede.view.de.grid.Part", {
                part: part
            }));
        }, this);
    },
});
