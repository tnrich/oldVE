/**
 * j5 report controller
 * @class Vede.controller.J5ReportController
 */
Ext.define("Vede.controller.J5ReportController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.manager.DeviceDesignManager","Teselagen.manager.ProjectManager"],

    activeProject: null,
    activeJ5Run: null,
    tabPanel: null,
    j5runs: null,
    cls: 'j5ReportTab',

    onPlasmidsItemClick: function(row,record){
        console.log("PLASMID SELECTED");
        console.log(record);

        var sequence = Teselagen.manager.DeviceDesignManager.createSequenceFileStandAlone(
            "GENBANK",
            record.data.fileContent,
            record.data.name,
            ""
        );

        Ext.getCmp('mainAppPanel').getActiveTab().el.mask('Loading Sequence');
        Teselagen.manager.ProjectManager.openSequence(sequence);
        Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();

    },

    downloadResults: function(){
        location.href = '/api/getfile/'+this.activeJ5Run.data.file_id;
    },

    onJ5RunSelect: function( item, e, eOpts ){
        this.activeJ5Run = this.activeProject.j5runs().getById(item.id);
        var assemblies    = this.activeJ5Run.getJ5Results().assemblies();
        var combinatorial = this.activeJ5Run.getJ5Results().getCombinatorialAssembly();
        var j5parameters = this.activeJ5Run.getJ5Input().getJ5Parameters().getParametersAsStore();
        //console.log(this.activeJ5Run.getJ5Input().getJ5Parameters());
        //console.log(j5parameters);
        console.log(this.activeJ5Run);
        this.tabPanel.down('gridpanel[name="assemblies"]').reconfigure(assemblies);
        this.tabPanel.down('gridpanel[name="j5parameters"]').reconfigure(j5parameters);
        this.tabPanel.down('textareafield[name="combinatorialAssembly"]').setValue(combinatorial.get('nonDegenerativeParts'));
        this.tabPanel.query('panel[cls="j5ReportsPanel"]')[0].collapse(Ext.Component.DIRECTION_LEFT,true);
    },

    renderMenu: function(){
       var menu = this.tabPanel.down('menu');
       menu.removeAll();
       this.j5runs.forEach(function(j5run){
            var date = new Date(j5run.data.date);
            menu.add([{text:j5run.getItemTitle(),id:j5run.data.id,cls:'j5runselect'}]);
       });
    },

    loadj5Results: function () {
        var self = this;
        this.activeProject.j5runs().load({
            callback: function (runs) {
                self.j5runs = runs;
                self.renderMenu();
            }
        });
    },

    onTabChange: function (tabPanel, newTab, oldTab) {
        if(newTab.initialCls == "j5ReportTab") {
            this.tabPanel = Ext.getCmp('mainAppPanel').getActiveTab();
            this.activeProject = this.tabPanel.model;
            this.loadj5Results();
        }
    },

    onLaunch: function () {
        this.tabPanel = Ext.getCmp("mainAppPanel");
        this.tabPanel.on("tabchange", this.onTabChange, this);
    },

    init: function () {
        this.callParent();

        this.control({
            'panel[cls="j5ReportsPanel"] > menu > menuitem': {
                click: this.onJ5RunSelect
            },
            'button[cls="downloadResults"]': {
                click: this.downloadResults
            },
            "gridpanel[title=Output Plasmids]": {
                itemclick: this.onPlasmidsItemClick
            }

        });
    }
});
