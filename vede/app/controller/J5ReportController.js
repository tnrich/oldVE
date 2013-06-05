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
        var currentTab = Ext.getCmp("mainAppPanel");
        var mask = new Ext.LoadMask(currentTab);

        mask.setVisible(true, false);

        var sequence = Teselagen.manager.DeviceDesignManager.createSequenceFileStandAlone(
            "GENBANK",
            record.data.fileContent,
            record.data.name,
            ""
        );

        // Javascript waits to render the loading mask until after the call to
        // openSequence, so we force it to wait a millisecond before calling
        // to give it time to render the loading mask.
        Ext.defer(function() {
            Teselagen.manager.ProjectManager.openSequence(sequence);
            mask.setVisible(false);
        }, 10);

    },

    downloadResults: function(){
        location.href = '/api/getfile/'+this.activeJ5Run.data.file_id;
    },

    onJ5RunSelect: function( item, e, eOpts ){
         this.detailPanel = this.tabPanel.query('panel[cls="j5detailpanel"]')[0];
            this.detailPanelFill = this.tabPanel.query('panel[cls="j5detailpanel-fill"]')[0];
            this.detailPanel.show();
            this.detailPanelFill.hide();

        this.activeJ5Run = this.activeProject.j5runs().getById(item.id);
        var status = this.activeJ5Run.get('status');
        var startDate = new Date(this.activeJ5Run.get('date'));
        var endDate = new Date(this.activeJ5Run.get('endDate'));
        var elapsed = endDate - startDate;
        elapsed = Math.round(elapsed/1000);
        elapsed = this.elapsedDate(elapsed);
        startDate = Ext.Date.format(startDate, "l, F d, Y g:i:s A");
        endDate = Ext.Date.format(endDate, "l, F d, Y g:i:s A");
        var assemblies    = this.activeJ5Run.getJ5Results().assemblies();
        var combinatorial = this.activeJ5Run.getJ5Results().getCombinatorialAssembly();
        var j5parameters = this.activeJ5Run.getJ5Input().getJ5Parameters().getParametersAsStore();
        //console.log(this.activeJ5Run.getJ5Input().getJ5Parameters());
        //console.log(j5parameters);
        //console.log(this.activeJ5Run);
        this.tabPanel.down("form[cls='j5RunInfo']").getForm().findField('j5RunStatus').setValue(status);
        this.tabPanel.down("form[cls='j5RunInfo']").getForm().findField('j5RunStart').setValue(startDate);
        this.tabPanel.down("form[cls='j5RunInfo']").getForm().findField('j5RunEnd').setValue(endDate);
        this.tabPanel.down("form[cls='j5RunInfo']").getForm().findField('j5RunElapsed').setValue(elapsed);

        this.tabPanel.down('gridpanel[name="assemblies"]').reconfigure(assemblies);
        this.tabPanel.down('gridpanel[name="j5parameters"]').reconfigure(j5parameters);
        this.tabPanel.down('textareafield[name="combinatorialAssembly"]').setValue(combinatorial.get('nonDegenerativeParts'));
        // this.tabPanel.query('panel[cls="j5ReportsPanel"]')[0].collapse(Ext.Component.DIRECTION_LEFT,true);
    },

    elapsedDate: function (seconds)
    {
    var numdays = Math.floor((seconds % 31536000) / 86400); 
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    if (numdays>0) {

    }else if (numhours>0) {

    }else if (numminutes>0) {

    } else {
    return numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
    }
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
            this.detailPanel = this.tabPanel.query('panel[cls="j5detailpanel"]')[0];
            this.detailPanelFill = this.tabPanel.query('panel[cls="j5detailpanel-fill"]')[0];
            this.detailPanel.hide();
            this.detailPanelFill.show();
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
