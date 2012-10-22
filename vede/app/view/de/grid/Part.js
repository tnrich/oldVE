/**
 * Class which creates components for given parts to display in the Device 
 * Editor canvas.
 */
Ext.define('Vede.view.de.grid.Part', {
    extend: 'Ext.container.Container',
    alias: 'widget.Part',

    config: {
        part: null,
    },

    /**
     * @param Teselagen.models.Part
     */
    constructor: function(config) {
        this.initConfig(config);

        this.callParent([{
            items: [{
                html: '<b>' + this.getPart().get('name') + '</b>',
                bodyStyle: {
                    'padding-top': '10px',
                    'text-align': 'center'
                },
                height: 40,
                styleHtmlContent: true,
                styleHtmlCls: 'part'
            }]
        }]);
    }
});
