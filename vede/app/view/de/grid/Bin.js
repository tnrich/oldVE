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
        totalRows: 1
    },

    /**
     * @param Teselagen.models.J5Bin
     */
    constructor: function(config) {
        this.initConfig(config);

        var flipButtonIconPath;
        var html;

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

        // Create the header for the column.
        var binHeader = Ext.create('Ext.container.Container', {
            items: [{
                html: html,
                styleHtmlContent: true,
                styleHtmlCls: 'binHeader',
                height: 100,
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
            items: [binHeader]
        }]);

        var currentRows = 0;
        if(this.getBin()) {
            // Add each part in the bin to the bin view object.
            this.getBin().parts().each(function(part) {
                this.add(Ext.create("Vede.view.de.grid.Part", {
                    part: part
                }));
            }, this);
            
            currentRows = this.getBin().parts().length;
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
    }
});
