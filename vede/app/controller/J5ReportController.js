Ext.define("Vede.controller.J5ReportController", {
    extend: "Ext.app.Controller",

    requires: [],

    activeProject: null,
    activeJ5Run: null,
    tabPanel: null,
    j5runs: null,
    cls: 'j5ReportTab',

    downloadResults: function(){
        location.href = '/api/getfile/'+this.activeJ5Run.data.file_id
    },

    onJ5RunSelect: function( item, e, eOpts ){
        this.activeJ5Run = this.activeProject.j5runs().getById(item.id);
        var assemblies = this.activeJ5Run.getJ5Results().assemblies();
        this.tabPanel.down('gridpanel').reconfigure(assemblies);
        this.tabPanel.down('panel[cls="j5detailpanel"]').setDisabled(false);
    },

    renderMenu: function(){
       var menu = this.tabPanel.down('menu');
       menu.removeAll();
       this.j5runs.forEach(function(j5run){
            var date = new Date(j5run.data.date);
            menu.add([{text:date.toString(),id:j5run.data.id,cls:'j5runselect'}]);
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
            }

    });
    },
});