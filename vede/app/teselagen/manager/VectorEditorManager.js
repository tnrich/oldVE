/**
 * @class Teselagen.manager.VectorEditorManager
 * Class describing a VectorEditorManager.
 *
 * @author Rodrigo Pavez
 */
Ext.define("Teselagen.manager.VectorEditorManager", {

    requires: ["Ext.layout.container.Border","Teselagen.bio.parsers.SbolParser"],
    sequenceFileManager: null,
    sequence: null,

    constructor: function(seq,mgr) {
        //console.log("Teselagen.manager.VectorEditorManager created");
        this.sequenceManager = mgr;
        this.sequence = seq;
        Ext.getCmp("mainAppPanel").down("button[cls=\"saveSequenceBtn\"]").show();
        //console.log(this.sequence);
    },

    changeSequenceManager: function(newSequenceManager){
        //console.log("SequenceManager changed!!");
        this.sequenceFileManager = newSequenceManager;
    },

    saveSequence : function(cb){
        var currentTabPanel = Ext.getCmp("mainAppPanel");
        currentTabPanel.setLoading(true);

        var rawGenbank = this.sequenceFileManager.toGenbank().toString();
        this.sequence.setSequenceFileContent(rawGenbank);

        var self = this;

        var now = new Date();
        nowTime = Ext.Date.format(now, "g:i:s A  ");
        nowDate = Ext.Date.format(now, "l, F d, Y");

        var successFullSavedCallback = function(){
            currentTabPanel.setLoading(false);
            var parttext = Ext.getCmp("VectorEditorStatusPanel").down("tbtext[id=\"VectorEditorStatusBarAlert\"]");
            parttext.animate({duration: 1000, to: {opacity: 1}}).setText('Sequence Saved at ' + nowTime + ' on '+ nowDate);
            toastr.options.onclick = null;
            toastr.info ("Sequence Saved");
            project = Teselagen.manager.ProjectManager.workingProject;
            Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                                Ext.getCmp("projectTreePanel").expandPath("/root/" + project.data.id);
                                Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();
                                Vede.application.fireEvent("PopulateStats");
            });

            if(typeof (cb) === "function") { cb(); }
        };

        var saveToServer = function(){

            self.sequence.save({
                success: function (msg,operation) {
                    var response = JSON.parse(operation.response.responseText);
                    successFullSavedCallback();
                    
                    if(response.duplicated)
                    {
                        Ext.MessageBox.alert("Warning", "A part with the same name already exist in this project, using the unique instance of this sequence.");
                    }
                    
                },
                failure: function() {
                    Ext.MessageBox.alert("Error", "Error saving sequence.");
                    currentTabPanel.setLoading(false);
                }
            });
        };

        if(!this.sequence.get("project_id"))
        {

            Ext.MessageBox.prompt("Name", "Please enter a sequence name:", function(btn,text){
                if(btn==="ok")
                {
                    var currentTab = Ext.getCmp("mainAppPanel").getActiveTab();
                    var currentTabEl = (currentTab.getEl());
                    var selectWindow = Ext.create("Ext.window.Window", {
                        title: "Please choose a project",
                        height: 200,
                        width: 400,
                        layout: "fit",
                        renderTo: currentTabEl,
                        items: {
                            xtype: "grid",
                            border: false,
                            columns: {
                                items: {
                                    dataIndex: "name"
                                },
                                defaults: {
                                    flex: 1
                                }
                            },
                            store: Teselagen.manager.ProjectManager.projects,
                            listeners: {
                                "itemclick": function(grid, project){
                                    selectWindow.close();
                                    Teselagen.manager.ProjectManager.workingProject = project;
                                    Teselagen.manager.ProjectManager.workingSequence.set("name",text);
                                    Teselagen.manager.ProjectManager.workingSequence.setProject(project);
                                    Teselagen.manager.ProjectManager.workingSequence.set("project_id",project.data.id);
                                    project.sequences().add(Teselagen.manager.ProjectManager.workingSequence);
                                    saveToServer();
                                    /*
                                    Teselagen.manager.ProjectManager.workingSequence.save({
                                        callback: function(){
                                            //saveToServer();
                                            successFullSavedCallback();
                                            Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                                                Ext.getCmp("projectTreePanel").expandPath("/root/" + project.data.id + "/" + Teselagen.manager.ProjectManager.workingSequence.data.id);
                                            });
                                        }
                                    });
                                    */
                                },

                                "destroy": function(selectWindow) {
                                    currentTabPanel.setLoading(false);
                                }


                                /*"hide":function(currentTabPanel){
                                          console.log('just hidden');
                                          currentTabPanel.setLoading(false);
                                  }*/





                            }
                        }
                    }).show();
                }
                else { currentTabPanel.setLoading(false); }
            },this,false,self.sequenceFileManager.name);
        }
        else { saveToServer(); }

    },

    promptFormat: function(cb) {
        var dialog = Ext.create('Ext.window.MessageBox', {
            buttons: [{
                text: 'GENBANK',
                handler: function() {
                    cb("GENBANK",dialog);
                }
            },{
                text: 'FASTA',
                handler: function() {
                    cb("FASTA",dialog);
                }
            },{
                text: 'SBOL XML/RDF',
                handler: function() {
                    cb("SBOL XML/RDF",dialog);
                }
            },{
                text: 'CANCEL',
                handler: function() {
                    cb("CANCEL",dialog);
                }
            }]
        });

        dialog.show({
            msg: '<p>Please select format</p>',
            closable: false

        });

        dialog.setHeight(60);
        dialog.setWidth(370);
    },

    saveSequenceToFile: function(){

        var self = this;
        
        var performSavingOperation = function(data,filename){
            var saveFile = function(name,gb) {
                var flag;
                var text        = data;
                var filename    = name;
                var bb          = new BlobBuilder();
                bb.append(text);
                saveAs(bb.getBlob("text/plain;charset=utf-8"), filename);
            };
            saveFile(filename,data);
        };

        this.promptFormat(function(btn,dialog){

                gb  = self.sequenceFileManager.toGenbank().toString();


                if (btn==="GENBANK") {
                    performSavingOperation(gb,self.sequence.data.name+'.gb');
                }
                else if (btn==="FASTA") {
                    var data = ">"+self.sequence.data.name+"\n";
                    data += self.sequenceFileManager.sequence.toString();
                    performSavingOperation(data,self.sequence.data.name+'.fas');
                }
                else if (btn==="SBOL XML/RDF") {
                    Teselagen.bio.parsers.SbolParser.convertGenbankToSBOL(gb,function(data){
                        performSavingOperation(data,self.sequence.data.name+'.xml');
                    });
                }

                dialog.close();
        });

    }

});
