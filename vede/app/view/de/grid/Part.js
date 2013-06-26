/**
 * Class which creates components for given parts to display in the Device
 * Editor canvas.
 * @class Vede.view.de.grid.Part
 *
 * @author Nick Elsbree
 */
Ext.define('Vede.view.de.grid.Part', {
    extend: 'Ext.container.Container',

    requires: ['Teselagen.manager.DeviceDesignManager'],

    alias: 'widget.Part',

    /**
     * @cfg {Teselagen.models.Part} part The part model to render on the grid.
     * @cfg {Boolean} fasConflict Whether to display a FAS conflict indicator.
     */
    config: {
        part: null,
        fasConflict: false
    },

    DeviceDesignManager: null,

    parentBin: null,
    partCell: null,
    eugeneFlag: null,

    constructor: function (config) {
        var self = this;
        var fas;
        this.initConfig(config);

        //if (this.getPart()) console.log(this.getPart().get("name"));
        //else console.log("part no name");
        
        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;

        var html;
        var activeProject = Ext.getCmp("mainAppPanel").getActiveTab().model;

        var parentIndex = this.DeviceDesignManager.getBinAssignment(activeProject, this.getPart());
        this.parentBin = this.DeviceDesignManager.getBinByIndex(activeProject, parentIndex);

        if(this.getPart()) {
            html = this.getPart().get("name");
            if(html.length > 14) html = html.substring(0, 14) + '..';
        }

        this.eugeneFlag = {
            xtype: 'button',
            cls: 'eugeneFlag',
            x: 5,
            y: 0,
            margin: '0 auto auto auto',
            hidden: true
        };
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
                styleHtmlContent: true,
                styleHtmlCls: 'gridPartCell',
                height: 40,
                cls: 'gridPartCell',
                width: 125,
                items: [{
                    xtype: 'container',
                    style: {
                        'padding-top': '10px',
                        'text-align': 'center'
                    },
                    html: html,
                    listeners: {
                        afterrender: function (obj) {
                            if(self.getPart() && self.getPart().get("name")) {
                                var tip = Ext.create('Ext.tip.ToolTip', {
                                        target: this.up().el,
                                        html: self.getPart().get("name")

                                });
                            }
                        }
                    }
                }]
            }]
        });

        if(this.getPart()) {
            if(this.getPart().isEmpty()) {
                this.partCell.down().removeBodyCls("gridPartCell");
                this.partCell.down().removeBodyCls("gridPartCell-selected");

                // Add the red background. Commented out for ticket #447.
                //this.partCell.down().addBodyCls("gridPartCell-alert");
            }
        }

        this.callParent([{
            cls: 'gridPartContainer',
            items: [
            this.partCell]
        }]);

        if(this.parentBin && this.parentBin.get("dsf")) {
            this.down("container[cls='gridPartCell']").addCls("grid-DSF");
        }

        // If the fas is set, add either a red or blue rectangle, depending on 
        // whether the fasConflict flag is true or false.
        if (this.parentBin) {
            fas = this.getPart().get("fas") || "None";
            if (fas != "None") {
                this.addFasIndicator(this.getFasConflict());
            }
        }

        // If the part is associated with a Eugene rule, add the indicator.
        if(this.getPart()) {
            var rules = this.DeviceDesignManager.getRulesInvolvingPart(activeProject,
                                                                       this.getPart());
            if(rules.getRange().length > 0) {
                this.addEugeneRuleIndicator();
            }
        }
    },

    /**
     * Applies the correct CSS class to the part when it is selected.
     */
    select: function () {
        this.partCell.down().addBodyCls("gridPartCell-selected");
        // this.partCell.down().addBodyCls("gridPartCell-alert");
    },

    selectAlert: function () {
        this.partCell.down().addBodyCls("gridPartCell-alert");
    },

    /**
     * Highlights the part cell.
     */
    highlight: function() {
        this.partCell.down().addBodyCls("gridPartCell-highlighted");
    },

    unHighlight: function() {
        this.partCell.down().removeBodyCls("gridPartCell-highlighted");
    },

    /**
     * Removes the 'selected' CSS class from the part when it is deselected.
     */
    deselect: function () {
        this.partCell.down().removeBodyCls("gridPartCell-alert");
        this.partCell.down().removeBodyCls("gridPartCell-selected");
        this.partCell.down().removeBodyCls("gridPartCell-highlighted");
    },

    leaveselect: function () {
        this.partCell.down().removeBodyCls("gridPartCell-selected");
    },

    mapSelect: function() {
        this.partCell.down().addBodyCls("gridPartCell-selected");
        this.partCell.down().removeBodyCls("gridPartCell-alert");
    },
    /**
     * If the fas is set, add either a red or blue rectangle, depending on
     * whether the fasConflict flag is true or false.
     * @param {Boolean} fasConflict True to add a red rectangle, false for blue.
     */
    addFasIndicator: function (fasConflict) {
        var image;

        if(fasConflict) {
            image = Ext.create("widget.image", {
                xtype: "image",
                cls: "fasConflictIndicator",
                src: "resources/images/fas_conflict_true.png"
            });
        } else {
            image = Ext.create("widget.image", {
                xtype: "image",
                cls: "fasConflictIndicator",
                src: "resources/images/fas_conflict_false.png"
            });
        }

        this.partCell.down().insert(0, image);
        image.show();
    },

    /**
     * Adds the Eugene Rule indicator image to the part.
     */
    addEugeneRuleIndicator: function() {
        var image = Ext.create("widget.image", {
            xtype: "image",
            cls: "eugeneRuleIndicator",
            src: "resources/images/eugene_rule_indicator.png"
        });

        this.partCell.down().insert(0, image);
        image.show();
    },

    /**
     * Removes the Eugene Rule indicator image.
     */
    removeEugeneRuleIndicator: function() {
        this.partCell.down("image[cls='eugeneRuleIndicator']").destroy();
    },
});
