/**
 * j5 report controller
 * @class Vede.controller.J5ReportController
 */
Ext.define("Vede.controller.J5ReportController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.CommonEvent",
               "Teselagen.manager.DeviceDesignManager",
               "Teselagen.manager.ProjectManager",
               'Vede.view.j5Report.buildDNAPanel',
               "Teselagen.manager.PrinterMonitor",
               "Teselagen.models.J5Parameters",
               "Teselagen.bio.parsers.ParsersManager"],

    activeProject: null,
    activeJ5Run: null,
    tabPanel: null,
    j5runs: null,
    cls: 'j5ReportTab',

    onPlasmidsItemClick: function(row,record){
        var currentTab = Ext.getCmp("mainAppPanel");
        var mask = new Ext.LoadMask({target: currentTab});
        mask.setVisible(true, false);

        var splitByPeriod = record.data.name.split(".");
        var ext = splitByPeriod.pop();
        var partSource = splitByPeriod.join(".");

        Teselagen.bio.parsers.ParsersManager.parseSequence(record.data.fileContent,ext,function(gb){
            var sequence = Teselagen.manager.DeviceDesignManager.createSequenceFileStandAlone(
                "GENBANK",
                gb,
                record.data.name,
                partSource
            );

            // Javascript waits to render the loading mask until after the call to
            // openSequence, so we force it to wait a millisecond before calling
            // to give it time to render the loading mask.
            Ext.defer(function() {
                Teselagen.manager.ProjectManager.openSequence(sequence);
                mask.setVisible(false);
            }, 10);
        });
    },

    downloadResults: function(){
        if (this.activeJ5Run) {
            var url = 'getfile/'+this.activeJ5Run.data.file_id;
            location.href = Teselagen.manager.SessionManager.buildUrl(url, '');
        }
    },

    onCancelJ5RunClick: function(){
        var self = this;
        if(self.activeJ5Run)
        {
            Teselagen.manager.J5CommunicationManager.cancelj5Run(self.activeJ5Run.data.id,self.activeJ5Run.raw.process.server,function(){
                self.tabPanel.down("form[cls='j5RunInfo']").getForm().findField('j5RunStatus').setValue("Canceled");
            });
        }
    },

    onJ5RunSelect: function( item, e, eOpts ){
        this.detailPanel = this.tabPanel.query('panel[cls="j5detailpanel"]')[0];
        this.detailPanelFill = this.tabPanel.query('panel[cls="j5detailpanel-fill"]')[0];
        this.detailPanel.show();
        this.detailPanelFill.hide();

        var menuItems = this.tabPanel.query("menuitem");

        for(var i = 0; i < menuItems.length; i++) {
            menuItems[i].removeCls("j5-menuitem-active");
        }

        item.addCls("j5-menuitem-active");

        this.activeJ5Run = this.activeProject.j5runs().getById(item.id);

        if(!this.activeJ5Run) {
            return;
        }

        var assemblyMethod = this.activeJ5Run.get('assemblyMethod');
        var status = this.activeJ5Run.get('status');
        var startDate = new Date(this.activeJ5Run.get('date'));
        var endDate = new Date(this.activeJ5Run.get('endDate'));
        var elapsed = endDate - startDate;
        elapsed = Math.round(elapsed/1000);
        elapsed = this.elapsedDate(elapsed);
        startDate = Ext.Date.format(startDate, "l, F d, Y g:i:s A");
        endDate = Ext.Date.format(endDate, "l, F d, Y g:i:s A");
        var assemblies    = this.activeJ5Run.getJ5Results().assemblies();
        assemblies.sort('name', 'ASC');

        var combinatorial = this.activeJ5Run.getJ5Results().getCombinatorialAssembly();

        var j5parameters = Ext.create("Teselagen.models.J5Parameters");
        j5parameters.loadValues(this.activeJ5Run.getJ5Input().getJ5Parameters().raw);
        var J5parametersValues = j5parameters.getParametersAsStore();

        var warningsGrid = this.tabPanel.down('gridpanel[name="warnings"]');
        var errorsGrid = this.tabPanel.down('gridpanel[name="errors"]');

        var buildButton = this.tabPanel.down("button[cls='buildBtn']");

        var j5RunInfo = this.tabPanel.down("form[cls='j5RunInfo']");
        var j5RunInfoForm = j5RunInfo.getForm();

        j5RunInfoForm.findField('j5AssemblyType').setValue(assemblyMethod);
        j5RunInfoForm.findField('j5RunStatus').setValue(status);
        j5RunInfoForm.findField('j5RunStart').setValue(startDate);

        if(this.activeJ5Run.get('endDate').toJSON()) {
            j5RunInfoForm.findField('j5RunEnd').setValue(endDate);
            j5RunInfoForm.findField('j5RunElapsed').setValue(elapsed);
        } else {
            j5RunInfoForm.findField('j5RunEnd').setValue('N/A');
            j5RunInfoForm.findField('j5RunElapsed').setValue('N/A');
        }

        if(status=="Completed") {
            var field = j5RunInfo.query('field[cls="j5RunStatusField"]')[0].getId();

            buildButton.enable();
            buildButton.removeCls('btnDisabled');

            $("#" + field + " .status-note").removeClass("status-note-warning");
            $("#" + field + " .status-note").removeClass("status-note-failed");
            $("#" + field + " .status-note").addClass("status-note-completed");
        } else if (status=="Completed with warnings") {
            var field = j5RunInfo.query('field[cls="j5RunStatusField"]')[0].getId();

            buildButton.enable();
            buildButton.removeCls('btnDisabled');

            $("#" + field + " .status-note").removeClass("status-note-completed");
            $("#" + field + " .status-note").removeClass("status-note-failed")
            $("#" + field + " .status-note").addClass("status-note-warning");;
        } else if (status=="Error") {
            var field = j5RunInfo.query('field[cls="j5RunStatusField"]')[0].getId();

            buildButton.disable();
            buildButton.addClass('btnDisabled');

            $("#" + field + " .status-note").removeClass("status-note-completed");
            $("#" + field + " .status-note").removeClass("status-note-warning");
            $("#" + field + " .status-note").addClass("status-note-failed");
        } else if (status=="Canceled") {
            var field = j5RunInfo.query('field[cls="j5RunStatusField"]')[0].getId();

            buildButton.disable();
            buildButton.addClass('btnDisabled');

            $("#" + field + " .status-note").removeClass("status-note-completed");
            $("#" + field + " .status-note").removeClass("status-note-warning");
            $("#" + field + " .status-note").addClass("status-note-failed");
        } else if (status=="In progress") {
            var field = j5RunInfo.query('field[cls="j5RunStatusField"]')[0].getId();

            buildButton.disable();
            buildButton.addClass('btnDisabled');

            $("#" + field + " .status-note").removeClass("status-note-completed");
            $("#" + field + " .status-note").removeClass("status-note-warning");
            $("#" + field + " .status-note").removeClass("status-note-failed");
        }

        var warnings = this.activeJ5Run.raw.warnings;
        var errors = this.activeJ5Run.raw.error_list;

        if(this.activeJ5Run.getJ5Results().raw.processedData) {
            if(this.activeJ5Run.getJ5Results().raw.processedData.combinationPieces) {
                var combinationPieces = this.activeJ5Run.getJ5Results().raw.processedData.combinationPieces;
                if(combinationPieces && combinationPieces.length) count = combinationPieces.length;
                else count = assemblies.getCount();
                for(var i = 0; i<count; i++) {
                    var combinationParts = [];
                    for (var k =0; k<combinationPieces[i].partsContained.length; k++) {
                        combinationParts.push(combinationPieces[i].partsContained[k].parts);
                    }
                    assemblies.getAt(i).set("parts", combinationParts.join());
                }
            }

            if(this.activeJ5Run.getJ5Results().raw.processedData.targetParts) {
                var targetParts = this.activeJ5Run.getJ5Results().raw.processedData.targetParts;
                var targetPartNames=[];
                for(var i = 0; i<targetParts.length; i++) {
                    targetPartNames.push(targetParts[i].name);
                }
                assemblies.getAt(0).set("parts", targetPartNames);
            }

            if(this.activeJ5Run.getJ5Results().raw.processedData.combinationParts) {
                var comboParts = this.activeJ5Run.getJ5Results().raw.processedData.combinationParts;
                var comboPartNames=[];
                if(combinationPieces && combinationPieces.length) count = combinationPieces.length;
                else count = assemblies.getCount();
                for(var i = 0; i<count; i++) {
                    assemblies.getAt(i).set("parts", comboParts[i].parts);
                }
            }
        }

        if (warnings) {
            var warningsStore = Ext.create('Teselagen.store.WarningsStore', {
                model: 'Teselagen.models.j5Output.Warning',
                data: warnings
            });
        }

        if (errors) {
            var errorsStore = Ext.create('Teselagen.store.ErrorsStore', {
                model: 'Teselagen.models.j5Output.Error',
                data: errors
            });
        }

        if (warnings.length>0) {
            warningsGrid.show().reconfigure(warningsStore);
        } else {
            warningsGrid.hide();
            warnings = null;
            warningsStore = null;
        }

        if (errors.length>0) {
            errorsGrid.show().reconfigure(errorsStore);
        } else {
            errorsGrid.hide();
            errors = null;
            errorsStore = null;
        }

        this.tabPanel.down('gridpanel[name="assemblies"]').reconfigure(assemblies);
        this.tabPanel.down('gridpanel[name="j5parameters"]').reconfigure(J5parametersValues);
    },

    elapsedDate: function (seconds)
    {
        var numdays = Math.floor((seconds % 31536000) / 86400);
        var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
        var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
        var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
        if (numdays>0) {
            return numdays + " days" + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
        }else if (numhours>0) {
            return numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
        }else if (numminutes>0) {
            return numminutes + " minutes " + numseconds + " seconds";
        } else {
        return numseconds + " seconds";
        }
    },

    renderMenu: function(){
        var menu = this.tabPanel.down('menu');

        if(menu) {
            menu.removeAll();

            if(this.j5runs) {
                this.j5runs.forEach(function(j5run){
                     var date = new Date(j5run.data.date);
                     menu.add([{text:j5run.getItemTitle(),id:j5run.data.id,cls:'j5runselect'}]);
                });

                if(!this.j5runs.length) menu.add({text:"No j5 results to show"});
            }


            if(this.activeJ5Run) {
                var item =  Ext.getCmp('mainAppPanel').getActiveTab().query("menuitem[id='"+this.activeJ5Run.internalId+"']")[0];
                if(item) {
                    item.addCls("j5-menuitem-active");
                }
            }
        }
    },

    loadj5Results: function () {
        var self = this;

        if(this.activeProject) {
            this.activeProject.j5runs().load({
                callback: function (runs) {
                    if(runs) {
                        self.j5runs = runs.reverse();
                    }

                    self.renderMenu();

                    if(self.activeJ5Run) {
                        self.selectJ5RunById(self.activeJ5Run.getId());
                    }
                }
            });
        }
    },

    selectJ5RunById: function(id) {
        var runItems = this.tabPanel.query('menuitem');

        for(var i = 0; i < runItems.length; i++) {
            if(runItems[i].id === id) {
                this.onJ5RunSelect(runItems[i]);

                break;
            }
        }
    },

    buildBtnClick: function(){
        var ngrokURL = 'https://52b3d64c.ngrok.com';

        Ext.Ajax.request({
            url: ngrokURL + '/start'
        });
        Ext.Msg.alert('Request Sent', 'Your assembly will begin shortly.');
        /*
        var buildDNAWindows = Ext.create('Vede.view.j5Report.buildDNAPanel').show();

        buildDNAWindows.down('button').on('click',function(){

            var printDNA_URL = buildDNAWindows.down('combobox[name="server"]').value;
            var passwordField =  buildDNAWindows.down('textfield[name="password"]').value;
            buildDNAWindows.close();

           if( Teselagen.manager.TasksMonitor.socket ) Teselagen.manager.TasksMonitor.socket.emit('buildDNA',printDNA_URL,passwordField);

        });*/

        //var prompt = Ext.MessageBox.prompt("DNA Build server", "Please enter password:", onPromptClosed, this);
        //prompt.down('textfield').bodyEl.el.dom.firstChild.type = "password";;
    },

    onTabChange: function (tabPanel, newTab, oldTab) {
        if(newTab.initialCls == "j5ReportTab") {
            this.tabPanel = Ext.getCmp('mainAppPanel').getActiveTab();
            this.detailPanel = this.tabPanel.query('panel[cls="j5detailpanel"]')[0];
            this.detailPanelFill = this.tabPanel.query('panel[cls="j5detailpanel-fill"]')[0];
            // this.detailPanelFill.hide();
            // this.detailPanel.show();
            this.activeProject = this.tabPanel.model;
            this.loadj5Results();
        }
    },

    setActiveRun: function (activeJ5Run) {
        this.activeJ5Run = activeJ5Run;
        for(var i=0; i<this.tabPanel.query("menuitem").length; i++) {
            this.tabPanel.query("menuitem")[i].removeCls("j5-menuitem-active");
        }
        var item =  Ext.getCmp('mainAppPanel').getActiveTab().query("menuitem[id='"+this.activeJ5Run.internalId+"']")[0];
        if (item) {
            item.addCls("j5-menuitem-active");
        }
    },

    onLaunch: function () {
        this.tabPanel = Ext.getCmp("mainAppPanel");
        this.detailPanel = this.tabPanel.query('panel[cls="j5detailpanel"]')[0];
        this.detailPanelFill = this.tabPanel.query('panel[cls="j5detailpanel-fill"]')[0];
        // this.detailPanel.hide();
        // this.detailPanelFill.show();
        this.tabPanel.on("tabchange", this.onTabChange, this);
    },

    init: function () {
        this.callParent();

        this.CommonEvent = Teselagen.event.CommonEvent;

        this.application.on(this.CommonEvent.RESET_J5BTN, this.setActiveRun, this);
        this.application.on(this.CommonEvent.LOAD_J5_RUNS, this.loadj5Results, this);
        //this.application.on(this.CommonEvent.JUMPTOJ5RUN, this.setActiveRun, this);
        this.application.on(this.CommonEvent.J5_RUN_STATUS_CHANGED, this.loadj5Results, this);

        this.control({
            'panel[cls="j5ReportsPanel"] > menu > menuitem': {
                click: this.onJ5RunSelect
            },
            'button[cls="downloadResults"]': {
                click: this.downloadResults
            },
            'button[cls="cancelj5run"]': {
                click: this.onCancelJ5RunClick
            },
            "gridpanel[name='assemblies']": {
                itemclick: this.onPlasmidsItemClick
            },
            "button[cls='buildBtn']": {
                click: this.buildBtnClick
            }

        });
    }
});
