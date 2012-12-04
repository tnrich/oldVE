Ext.define("Vede.controller.j5ReportController", {
    extend: "Ext.app.Controller",

    requires: [],

    activeProject: null,
    tabPanel: null,
    j5runs: null,

    onJ5RunSelect: function( item, e, eOpts ){
        j5run = this.activeProject.j5runs().getById(item.id);
        var assemblies = j5run.getJ5Results().assemblies();
        console.log(assemblies);
        this.tabPanel.down('gridpanel').reconfigure(assemblies);
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
            "menu > menuitem": {
                click: this.onJ5RunSelect
        }});
    },
});