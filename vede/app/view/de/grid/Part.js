/**
 * Class which creates components for given parts to display in the Device
 * Editor canvas.
 */
Ext.define('Vede.view.de.grid.Part', {
    extend: 'Ext.container.Container',

    requires: ['Teselagen.manager.DeviceDesignManager'],

    alias: 'widget.Part',

    config: {
        part: null,
    },

    DeviceDesignManager: null,

    partCell: null,
    eugeneFlag: null,
    /**
     * @param Teselagen.models.Part
     */
    constructor: function (config) {
        this.initConfig(config);

        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;

        var html = "";
        var activeProject = Ext.getCmp("mainAppPanel").getActiveTab().model.getDesign();

        var parentIndex = this.DeviceDesignManager.getBinAssignment(activeProject,
                                                                  this.getPart());
        var parentBin = this.DeviceDesignManager.getBinByIndex(activeProject,
                                                               parentIndex);

        if(this.getPart()) {
            html = this.getPart().get("name");
            if(html.length > 14) html = html.substring(0,14) + '..';
        }

        this.eugeneFlag = {
            xtype: 'button',
            cls: 'eugeneFlag',
            x: 5,
            y: 0,
            margin: '0 auto auto auto',
            hidden: true
        }
        /*
        if(this.getBin())
        {
            var deproject = Ext.getCmp('mainAppPanel').getActiveTab().model;
            var rules = deproject.getDesign().rules();
            rules.each(function(rule){
                if(rule.data.operand1_id==this.getBin)
            });
        }
        */

        this.partCell = Ext.create("Ext.container.Container", {
            items: [{
                //html: html,
                styleHtmlContent: true,
                styleHtmlCls: 'gridPartCell',
                height: 60,
                cls: 'gridPartCell',
                width: 125,
                items: [
                {
                    xtype: 'container',
                    style: {
                    'padding-top': '20px',
                    'text-align': 'center'
                    },
                    html : html
                }]
            }]
        });

        this.callParent([{
            items: [
                this.partCell
            ]
        }]);

        if(parentBin && parentBin.get("dsf")) {
            this.down("container[cls='gridPartCell']").addCls("grid-DSF");
        }
    },

    select: function () {
        this.partCell.down().addBodyCls("gridPartCell-selected");
    },

    deselect: function () {
        this.partCell.down().removeBodyCls("gridPartCell-selected");
    },

    applyPart: function (pPart) {
        return pPart;
    }
});
