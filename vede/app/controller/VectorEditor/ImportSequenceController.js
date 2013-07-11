/**
 * Import sequence window controller
 * @class Vede.controller.VectorEditor.ImportSequenceController
 */
Ext.define('Vede.controller.VectorEditor.ImportSequenceController', {
    extend: 'Ext.app.Controller',

    requires: ['Teselagen.bio.parsers.GenbankManager',
               'Teselagen.event.MenuItemEvent',
               'Teselagen.event.VisibilityEvent',
               'Teselagen.event.ProjectEvent',
               'Teselagen.utils.FormatUtils',
               'Teselagen.bio.parsers.ParsersManager',
               "Teselagen.manager.ProjectManager",
               "Teselagen.manager.VectorEditorManager",
               "Teselagen.bio.parsers.SbolParser"],
    /*
    MenuItemEvent: null,
    VisibilityEvent: null,
    importWindow: null,
    */
    /*
    loadFile: function(cb){
        //console.log("Loading file");
        var file,sequenceName,ext;
        var details = {};
        if (typeof window.FileReader !== 'function') {
            Ext.Msg.alert('Browser does not support File API.');
        }
        else {
            var form = this.importWindow.down('form').getForm();
            details.sequenceName = this.importWindow.query('textfield[cls=sequenceName]')[0].value;
            details.sequenceAuthor = this.importWindow.query('textfield[cls=sequenceAuthor]')[0].value;
            var fileField = form.findField('importedFile');
            var fileInput = fileField.extractFileInput();
            file = fileInput.files[0];
            ext = file.name.match(/^.*\.(genbank|gb|fas|fasta|xml|json)$/i);
            if(ext)
            {
                this.importWindow.close();
                Ext.getCmp('mainAppPanel').getActiveTab().el.mask('Loading Sequence');
                fr = new FileReader();
                fr.onload = processText;
                fr.readAsText(file);
            }
            else
            {
                Ext.MessageBox.alert('Error', 'Invalid file format');
            }
        }

        var self = this;

        function processText() {
            self.formatParser(file,fr.result,ext[1],details,cb);
            Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
        }
    },

    formatParser: function(file,fileContent,ext,details,cb){
        switch(ext)
        {
            case "fasta":
            case "fas":
                fileContent = Teselagen.bio.parsers.ParsersManager.fastaToGenbank(fileContent).toString();
                break;
            case "xml":
                fileContent = Teselagen.bio.parsers.ParsersManager.jbeiseqXmlToGenbank(fileContent).toString();
                break;
            case "json":
                fileContent = Teselagen.bio.parsers.ParsersManager.jbeiseqJsonToGenbank(fileContent).toString();
                break;
        }
        cb(file,ext,fileContent);
    },

    renderSequence: function(sequenceFileContent,cb){
        var gb      = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(sequenceFileContent);
        seqMgr = Teselagen.utils.FormatUtils.genbankToSequenceManager(gb);
        Vede.application.fireEvent("SequenceManagerChanged", seqMgr);
        if(cb) cb(seqMgr);
        var parttext = Ext.getCmp('VectorEditorStatusPanel').down('tbtext[id="VectorEditorStatusBarAlert"]');
            parttext.animate({duration: 1000, to: {opacity: 1}}).setText('Sequence Parsed Successfully');
            parttext.animate({duration: 5000, to: {opacity: 0}});
    },

    loadAndSaveToSequence: function(btn,event,sequence){
        var self = this;
        this.loadFile(function(file,ext,fileContent){
            self.importWindow.close();
            sequence.set('sequenceFileContent',fileContent);
            sequence.set('sequenceFileFormat',"GENBANK");
            sequence.set('sequenceFileName',file.name);
            console.log(sequence.get('firstTimeImported'));
            sequence.set('firstTimeImported',true);
            self.renderSequence(fileContent,function(seqMgr){
                veproject = Teselagen.manager.ProjectManager.workingSequence;
                veproject.set('name',seqMgr.getName());
            });
        });
    },
    */


    onImportFileToSequence: function(pFile, pExt, pEvt, sequence) {
        var self = this;

        Teselagen.bio.parsers.ParsersManager.parseSequence(pEvt.target.result, pExt,function(gb){

            var locusName = gb.getLocus().locusName;

            performSequenceCreation = function(newSequence,cb){

                var seqMgr =  Teselagen.utils.FormatUtils.genbankToSequenceManager(gb);

                    if (newSequence) {
                        name = newSequence.get('name');
                        seqMgr.setName(name);
                        newSequence.set('sequenceFileContent',seqMgr.toGenbank().toString());
                        newSequence.set('sequenceFileFormat',"GENBANK");
                        newSequence.set('sequenceFileName',name);
                        newSequence.set('firstTimeImported',true);
                        toastr.info ("New Sequence Created");
                    }

                    else {
                        if(Teselagen.manager.ProjectManager.workingSequence) {
                            var name = Teselagen.manager.ProjectManager.workingSequence.get('name');
                            if(name == "Untitled VEProject" || name == "" || sequence.get("project_id") == "") {
                                Teselagen.manager.ProjectManager.workingSequence.set('name',seqMgr.name);
                            }
                            else {   
                                Teselagen.manager.ProjectManager.workingSequence.set('name',name);
                                seqMgr.setName(name);
                            }
                        }
                        
                        Vede.application.fireEvent("SequenceManagerChanged", seqMgr);
                        sequence.set('sequenceFileContent',seqMgr.toGenbank().toString());
                        sequence.set('partSource',gb.getLocus().locusName);
                        sequence.set('sequenceFileFormat',"GENBANK");
                        sequence.set('sequenceFileName',pFile.name);
                        sequence.set('firstTimeImported',true);
                    }

                    var parttext = Ext.getCmp('mainAppPanel').getActiveTab().down('tbtext[id="VectorEditorStatusBarAlert"]');
                    if(parttext) {
                        parttext.animate({duration: 1000, to: {opacity: 1}}).setText('Sequence Parsed');
                        parttext.animate({duration: 5000, to: {opacity: 0}});
                    }
                    Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
                    if(typeof (cb) === "function") { cb(sequence); }
            };

            if (sequence.get("project_id") == "") {
                performSequenceCreation();
            }
            else
            {
                Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
                Ext.MessageBox.show({
                    title: "Import Preferences",
                    msg: "Would you like to create a new sequence, or overwrite the current sequence?",
                    buttons: Ext.Msg.YESNOCANCEL,
                    buttonText: {yes: "Create a new sequence",no: "Overwrite"},
                    icon: Ext.Msg.QUESTION,
                    fn: function (btn) {
                        if (btn==="yes") {
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
                                            var onSequencePromptClosed = function(btn, text) {
                                                if(btn==="ok") {
                                                    if(text === "") {return Ext.MessageBox.prompt("Name", "Please enter a sequence name:", onSequencePromptClosed, this, false, locusName); }
                                                    
                                                    Teselagen.manager.ProjectManager.workingProject = project;
                                                    var sequencesNames = [];
                                                    project.sequences().load().each(function (sequence) {
                                                        sequencesNames.push(sequence.data.name);
                                                    });

                                                    for (var j=0; j < sequencesNames.length; j++) {
                                                        if (sequencesNames[j]===text) {
                                                            var conflictName = sequencesNames[j];
                                                                Ext.MessageBox.show({
                                                                    title: "Name",
                                                                    msg: "A sequence with the name  <i> <q>"+ conflictName +"</q> </i>  already exists in this project. <p> Please enter another name:",
                                                                    buttons: Ext.MessageBox.OKCANCEL,
                                                                    fn: onSequencePromptClosed,
                                                                    prompt: true,
                                                                    value: conflictName + "(1)",
                                                                    cls: "sequencePrompt-box",
                                                                    style: {
                                                                        "text-align": "center"
                                                                    },
                                                                    layout: {
                                                                        align: "center"
                                                                    },
                                                                    items: [
                                                                        {
                                                                            xtype: "textfield",
                                                                            layout: {
                                                                                align: "center"
                                                                            },
                                                                            width: 50
                                                                        }
                                                                    ]
                                                                });
                                                                return Ext.MessageBox;
                                                            
                                                        }
                                                    }
                                                    var newSequenceFile = Ext.create("Teselagen.models.SequenceFile", {
                                                        sequenceFileFormat: "GENBANK",
                                                        sequenceFileContent: "LOCUS      "+text+"                 0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//",
                                                        sequenceFileName: "untitled.gb",
                                                        partSource: "Untitled sequence",
                                                        name: text
                                                    });

                                                    project.sequences().add(newSequenceFile);
                                                    newSequenceFile.set("project_id",project.data.id);

                                                    newSequenceFile.save({
                                                        callback: function () {
                                                            Teselagen.manager.ProjectManager.workingSequence = newSequenceFile;

                                                            performSequenceCreation(newSequenceFile,function(){
                                                                newSequenceFile.save({callback:function(){
                                                                    Teselagen.manager.ProjectManager.openSequence(newSequenceFile);
                                                                }});
                                                            });
                                                        }
                                                    });
                                                }
                                            };
                                            Ext.MessageBox.prompt("Name", "Please enter a sequence name:", onSequencePromptClosed, this, false, locusName);
                                        },
                                        "destroy": function(selectWindow) {
                                            Ext.getCmp("mainAppPanel").setLoading(false);
                                        }
                                    }
                                }
                            }).show();
                        } else if (btn==="no") {
                            performSequenceCreation();
                        }
                    }
                });
            }
        });
    },
    init: function() {
        this.application.on("ImportFileToSequence",this.onImportFileToSequence, this);
    }
});
