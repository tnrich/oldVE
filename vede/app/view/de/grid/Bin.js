/**
 * Class which creates a component for a given bin to display in the Device
 * Editor.
 */
Ext.define('Vede.view.de.grid.Bin', {
    extend: 'Ext.container.Container',
    alias: 'widget.Bin',
    
    statics: {
        forwardButtonIconPath: 'resources/images/ux/right2.gif',
        reverseButtonIconPath: 'resources/images/ux/left2.gif'
    },

    config: {
        bin: null,
        iconID: null,
        totalRows: 1
    },

    binHeader: null,

    /**
     * @param Teselagen.models.J5Bin
     */
    constructor: function(config) {
        this.initConfig(config);

        var flipButtonIconPath;
        var html;

        // Set the html and orientation of the flip button based on whether
        // the bin was created with a blank model or if it contains data.
        if(!this.getBin()) {
            flipButtonIconPath = this.self.forwardButtonIconPath;
            html = "New Bin";
        } else if(this.getBin().get("directionForward")) {
            flipButtonIconPath = this.self.forwardButtonIconPath;
            html = this.getBin().get("binName");
        } else {
            flipButtonIconPath = this.self.reverseButtonIconPath;
            html = this.getBin().get("binName");
        }

        var iconSource = "resources/images/icons/device/small/promoter.png";
        iconSource = config.iconSource;
        // Create the header for the column.
        this.binHeader = Ext.create('Ext.container.Container', {
            items: [{
                html: html,
                cls: 'binHeader',
                styleHtmlContent: true,
                styleHtmlCls: 'binHeader',
                height: 100,
                width: 125,
                bodyStyle: {
                    'padding-top': '80px',
                    'text-align': 'center'
                },
                style: {
                    marginBottom: '10px'
                },
                layout: {
                    type: 'absolute'
                },
                items: [{
                    xtype: 'button',
                    cls: 'flipBinButton',
                    x: 95,
                    y: 5,
                    icon: flipButtonIconPath
                }, {
                    xtype: 'image',
                    cls: 'binIcon',
                    x: 34,
                    y: 12,
                    src: iconSource
                }]
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
            cls: 'gridBinColumn',
            width: 125,
            items: [this.binHeader]
        }]);

        var currentRows = 0;
        if(this.getBin()) {
            // Add each part in the bin to the bin view object.
            this.getBin().parts().each(function(part) {
                this.add(Ext.create("Vede.view.de.grid.Part", {
                    part: part
                }));
            }, this);
            
            currentRows = this.getBin().parts().getRange().length;
        }

        // Add blank rows until currentRows equals totalRows.
        while(currentRows < this.getTotalRows()) {
            this.add(Ext.create("Vede.view.de.grid.Part"));
            currentRows += 1;
        }
    },

    applyTotalRows: function(pTotalRows) {
        var currentRows = this.getTotalRows();
        while(currentRows < pTotalRows) {
            this.add(Ext.create("Vede.view.de.grid.Part"));
            currentRows += 1;
        }

        return pTotalRows;
    },

    select: function() {
        this.binHeader.down().addBodyCls("binHeader-selected");
    },

    deselect: function() {
        this.binHeader.down().removeBodyCls("binHeader-selected");
    },
});
