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

    partCell: null,

    /**
     * @param Teselagen.models.Part
     */
    constructor: function(config) {
        this.initConfig(config);

        var html;

        if(this.getPart()) {
            html = this.getPart().get("name");
        } else {
            html = "";
        }

        this.partCell = Ext.create("Ext.container.Container", {
            items: [{
                html: html,
                styleHtmlContent: true,
                styleHtmlCls: 'gridPartCell',
                cls: 'gridPartCell',
                bodyStyle: {
                    'padding-top': '10px',
                    'text-align': 'center'
                },
                height: 40,
            }]
        });

        this.callParent([{
            items: [
                this.partCell
            ]
        }]);
    },

    select: function() {
        this.partCell.down().addBodyCls("gridPartCell-selected");
    },

    deselect: function() {
        this.partCell.down().removeBodyCls("gridPartCell-selected");
    },

    applyPart: function(pPart) {
        return pPart;
    }
});
