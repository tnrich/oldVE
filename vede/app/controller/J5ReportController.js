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

        var ext = record.data.name.split('.').pop();

        Teselagen.bio.parsers.ParsersManager.parseSequence(record.data.fileContent,ext,function(gb){
            var sequence = Teselagen.manager.DeviceDesignManager.createSequenceFileStandAlone(
                "GENBANK",
                gb,
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
        });
    },

    downloadResults: function(){
        if (this.activeJ5Run) {
            location.href = '/api/getfile/'+this.activeJ5Run.data.file_id;
        }
    },

    onJ5RunSelect: function( item, e, eOpts ){
         this.detailPanel = this.tabPanel.query('panel[cls="j5detailpanel"]')[0];
            this.detailPanelFill = this.tabPanel.query('panel[cls="j5detailpanel-fill"]')[0];
            this.detailPanel.show();
            this.detailPanelFill.hide();

        for(var i=0; i<this.tabPanel.query("menuitem").length; i++) {
            this.tabPanel.query("menuitem")[i].removeCls("j5-menuitem-active");
        }

        item.addCls("j5-menuitem-active");

        this.activeJ5Run = this.activeProject.j5runs().getById(item.id);
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
        j5parameters.loadValues(this.activeJ5Run.getJ5Input().getJ5Parameters().raw);//console.log(this.activeJ5Run.getJ5Input().getJ5Parameters());
        J5parametersValues = j5parameters.getParametersAsStore();
        //console.log(j5parameters);
        //console.log(this.activeJ5Run);

        this.tabPanel.down("form[cls='j5RunInfo']").getForm().findField('j5AssemblyType').setValue(assemblyMethod);
        this.tabPanel.down("form[cls='j5RunInfo']").getForm().findField('j5RunStatus').setValue(status);
        this.tabPanel.down("form[cls='j5RunInfo']").getForm().findField('j5RunStart').setValue(startDate);
        this.tabPanel.down("form[cls='j5RunInfo']").getForm().findField('j5RunEnd').setValue(endDate);
        this.tabPanel.down("form[cls='j5RunInfo']").getForm().findField('j5RunElapsed').setValue(elapsed);

        if(status=="Completed") {
            var field = this.tabPanel.down("form[cls='j5RunInfo']").query('field[cls="j5RunStatusField"]')[0].getId();
            this.tabPanel.down('button[cls="downloadResults"]').enable();
            this.tabPanel.down('button[cls="downloadResults"]').removeClass('btnDisabled');
            this.tabPanel.down('button[cls="buildBtn"]').enable();
            this.tabPanel.down('button[cls="buildBtn"]').removeClass('btnDisabled');
            $("#" + field + " .status-note").removeClass("status-note-warning");
            $("#" + field + " .status-note").removeClass("status-note-failed");
            $("#" + field + " .status-note").addClass("status-note-completed");
        } else if (status=="Completed with warnings") {
            var field = this.tabPanel.down("form[cls='j5RunInfo']").query('field[cls="j5RunStatusField"]')[0].getId();
            this.tabPanel.down('button[cls="downloadResults"]').enable();
            this.tabPanel.down('button[cls="downloadResults"]').removeClass('btnDisabled');
            this.tabPanel.down('button[cls="buildBtn"]').enable();
            this.tabPanel.down('button[cls="buildBtn"]').removeClass('btnDisabled');
            $("#" + field + " .status-note").removeClass("status-note-completed");
            $("#" + field + " .status-note").removeClass("status-note-failed")
            $("#" + field + " .status-note").addClass("status-note-warning");;
        } else if (status=="Error") {
            var field = this.tabPanel.down("form[cls='j5RunInfo']").query('field[cls="j5RunStatusField"]')[0].getId();
            this.tabPanel.down('button[cls="downloadResults"]').disable();
            this.tabPanel.down('button[cls="downloadResults"]').addClass('btnDisabled');
            this.tabPanel.down('button[cls="buildBtn"]').disable();
            this.tabPanel.down('button[cls="buildBtn"]').addClass('btnDisabled');
            $("#" + field + " .status-note").removeClass("status-note-completed");
            $("#" + field + " .status-note").removeClass("status-note-warning");
            $("#" + field + " .status-note").addClass("status-note-failed");
        }

        var warnings = this.activeJ5Run.raw.warnings;
        var errors = this.activeJ5Run.raw.error_list[0];
        var nonDegenerativeParts = this.activeJ5Run.getJ5Results().raw.processedData.nondegenerateParts;

        var nonDegenerativPartsStore = Ext.create('Teselagen.store.PartStore', {
            model: 'Teselagen.models.Part',
            data: nonDegenerativeParts
        });

        if (warnings) {
        var warningsStore = Ext.create('Teselagen.store.WarningsStore', {
            model: 'Teselagen.models.j5Output.Warning',
            data: warnings
        });
        }

        if (errors) {
        var errorsStore = Ext.create('Teselagen.store.ErrorsStore', {
            model: 'Teselagen.models.j5Output.Error',
            data: errors.error
        });
        }   

        if ((warnings.length>0)==true) {
            this.tabPanel.down('gridpanel[name="warnings"]').show();
            this.tabPanel.down('gridpanel[name="warnings"]').reconfigure(warningsStore);
        } else {
             this.tabPanel.down('gridpanel[name="warnings"]').hide();
             warnings = null;
             warningsStore = null;
        }

        if (errors) {
            this.tabPanel.down('gridpanel[name="errors"]').show();
            this.tabPanel.down('gridpanel[name="errors"]').reconfigure(errorsStore);
            // this.tabPanel.down("form[cls='j5RunInfo']").getForm().findField('j5RunStart').setValue("N/A");
            // this.tabPanel.down("form[cls='j5RunInfo']").getForm().findField('j5RunEnd').setValue("N/A");
            // this.tabPanel.down("form[cls='j5RunInfo']").getForm().findField('j5RunElapsed').setValue("N/A");
        } else {
             this.tabPanel.down('gridpanel[name="errors"]').hide();
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
       menu.removeAll();
       this.j5runs.forEach(function(j5run){
            var date = new Date(j5run.data.date);
            menu.add([{text:j5run.getItemTitle(),id:j5run.data.id,cls:'j5runselect'}]);
       });

        if(this.activeJ5Run) {
            var item =  Ext.getCmp('mainAppPanel').getActiveTab().query("menuitem[id='"+this.activeJ5Run.internalId+"']")[0];
            item.addCls("j5-menuitem-active");
        }

    },

    loadj5Results: function () {
        var self = this;

        this.activeProject.j5runs().load({
            callback: function (runs) {
                self.j5runs = runs.reverse();
                self.renderMenu();
            }
        });
    },

    buildBtnClick: function(){

        var buildDNAWindows = Ext.create('Vede.view.j5Report.buildDNAPanel').show();
       

        var showStreaming = function(){
            return Ext.create('Ext.window.Window', {
                height: 474,
                width: 410,
                title: 'Build DNA',
                items: [
                    {
                        xtype: 'panel',
                        height: 340,
                        title: '',
                        html: '<object type="application/x-shockwave-flash" data="http://www.justin.tv/widgets/live_embed_player.swf?channel=teselagen" id="live_embed_player_flash" height="300" width="400" bgcolor="#000000"><param name="allowFullScreen" value="true"/><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.justin.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.justin.tv&channel=teselagen&auto_play=true&start_volume=25" /></object><a href="http://www.justin.tv/teselagen#r=-rid-&amp;s=em" class="trk" style="padding:2px 0px 4px; display:block; width:345px; font-weight:normal; font-size:10px; text-decoration:underline; text-align:center">Watch live video from teselagen on www.justin.tv</a>'
                    },
                    {
                        xtype: 'panel',
                        name: 'feedback',
                        height: 62,
                        margin: '10 0 0 0',
                        title: '',
                        html: '<h3 style="margin-left: 20px;">Connecting..</h3>'
                    }
                ]

            }).show();
        };


        buildDNAWindows.down('button').on('click',function(){

            var printDNA_URL = buildDNAWindows.down('combobox[name="server"]').value;
            var passwordField =  buildDNAWindows.down('textfield[name="password"]').value;
            buildDNAWindows.close();


            //var messageBox = Ext.MessageBox.wait(
            //    "Connecting to remote server...",
            //    "Printing DNA"
            //);

            //var printDNA_URL = 'http://98.207.155.255:8090/printdna';

            var streamingWindow = showStreaming();

            streamingWindow.on('close',function(){
                Teselagen.manager.PrinterMonitor.stopMonitoring();
            });

            Ext.Ajax.request({
                url: printDNA_URL,
                params: {
                    password: passwordField
                },
                method: 'GET',
                success: function(response){
                    
                    //messageBox.updateProgress(100,"Build in progress...","Connected to remote server");
                    var task = new Ext.util.DelayedTask(function() {
                        //messageBox.close();
                        streamingWindow.down('panel[name="feedback"]').update('<h3 style="margin-left: 20px;">Connected. Build in progress.</h3>');
                    });
                    task.delay(1000);
                    Teselagen.manager.PrinterMonitor.startMonitoring(function(update){
                        streamingWindow.down('panel[name="feedback"]').update('<h3 style="margin-left: 20px;">'+update+'</h3>');                        
                    });
                }
            });
        
        });

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

        this.control({
            'panel[cls="j5ReportsPanel"] > menu > menuitem': {
                click: this.onJ5RunSelect
            },
            'button[cls="downloadResults"]': {
                click: this.downloadResults
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
