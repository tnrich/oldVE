/**
 * Import sequence window controller
 * @class Vede.controller.VectorEditor.ImportSequenceController
 */
Ext.define('Vede.controller.VectorEditor.ImportSequenceController', {
    extend: 'Ext.app.Controller',

    requires: ['Teselagen.bio.parsers.GenbankManager',
               'Teselagen.event.MenuItemEvent',
               'Teselagen.event.ProjectEvent',
               'Teselagen.event.SequenceManagerEvent',
               'Teselagen.event.VisibilityEvent',
               'Teselagen.utils.FormatUtils',
               'Teselagen.bio.parsers.ParsersManager',
               "Teselagen.manager.ProjectManager",
               "Teselagen.manager.VectorEditorManager",
               "Teselagen.bio.parsers.SbolParser"],

    ParsersManager: Teselagen.bio.parsers.ParsersManager,

    onImportFileToSequence: function(pFile, pExt, pEvt, sequence) {
        var self = this;
        var importMessages = [];

        this.ParsersManager.parseSequence(pEvt.target.result, pExt,function(gb){
            var name = pFile.name.match(/(.*)\.[^.]+$/)[1];

            // Just import first sequence in file.
            if(gb instanceof Array) {
                gb = gb[0];
            }

            this.ParsersManager.createAndProcessSequenceFromGenbank(gb, name, function(err, sequence, sequenceManager, gb) {
                if(err) {
                    return err;
                }

                var locusName = gb.getLocus().locusName;

                importMessages.concat(sequenceManager.getParseMessages()).concat(gb.messages);

                Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();

                Ext.MessageBox.show({
                    title: "Import Preferences",
                    msg: "Would you like to create a new sequence, or overwrite the current sequence?<br>" + importMessages.join("<br>"),
                    buttons: Ext.Msg.YESNOCANCEL,
                    buttonText: {yes: "Create a new sequence",no: "Overwrite"},
                    icon: Ext.Msg.QUESTION,
                    modal: true,
                    fn: function (btn) {
                        if (btn==="yes") {
                            // Create a new sequence.

                            var currentTab = Ext.getCmp("mainAppPanel").getActiveTab();
                            var currentTabEl = (currentTab.getEl());

                            var onSequencePromptClosed = function(btn, text) {
                                if(btn==="ok") {
                                    if(text === "") {
                                        return Ext.MessageBox.prompt("Name", "Please enter a sequence name:", onSequencePromptClosed, this, false, locusName);
                                    }

                                    sequence.save({
                                        callback: function () {
                                            var duplicated = JSON.parse(arguments[1].response.responseText).duplicated;

                                            if(duplicated) {
                                                Ext.MessageBox.show({
                                                    title: "Name",
                                                    msg: "A sequence with the name  <i> <q>"+ sequence.get('name') +"</q> </i>  already exists in this project. <p> Please enter another name:",
                                                    buttons: Ext.MessageBox.OKCANCEL,
                                                    fn: onSequencePromptClosed,
                                                    prompt: true,
                                                    value: sequence.get('name') + "(1)",
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
                                            } else {
                                                Teselagen.manager.ProjectManager.workingSequence = sequence;
                                                Teselagen.manager.ProjectManager.openSequence(sequence);
                                            }
                                        }
                                    });
                                }
                            };

                            Ext.MessageBox.prompt("Name", "Please enter a sequence name:", onSequencePromptClosed, this, false, locusName);
                        } else if(btn==="no") {
                            // Overwrite content of current sequence.
                            var currentSequence = Teselagen.manager.ProjectManager.workingSequence;
                            sequence.set('sequenceFileContent', gb.toString());
                            sequence.set('partSource', locusName);
                            sequence.set('sequenceFileFormat', "GENBANK");
                            sequence.set('sequenceFileName', pFile.name);
                            sequence.setSequenceManager(sequenceManager);

                            Vede.application.fireEvent(Teselagen.event.SequenceManagerEvent.SEQUENCE_MANAGER_CHANGED, sequenceManager);
                        }
                    }
                });
                });
            });

            /*performSequenceCreation = function(newSequence,cb){

                var seqMgr =  Teselagen.utils.FormatUtils.genbankToSequenceManager(gb);

                    if (newSequence) {
                        name = newSequence.get('name');
                        seqMgr.setName(name);
                        newSequence.set('sequenceFileContent',seqMgr.toGenbank().toString());
                        newSequence.set('sequenceFileFormat',"GENBANK");
                        newSequence.set('sequenceFileName',name);
                        newSequence.set('dateCreated', new Date());
                        newSequence.set('dateModified', new Date());
                        newSequence.set('firstTimeImported',true);
                        toastr.info ("New Sequence Created");
                    }

                    else {
                        
                        Vede.application.fireEvent(Teselagen.event.SequenceManagerEvent.SEQUENCE_MANAGER_CHANGED, seqMgr);
                        sequence.set('sequenceFileContent',seqMgr.toGenbank().toString());
                        sequence.set('partSource',gb.getLocus().locusName);
                        sequence.set('sequenceFileFormat',"GENBANK");
                        sequence.set('sequenceFileName',pFile.name);
                        sequence.set('firstTimeImported',true);
                        sequence.set('dateCreated', new Date());
                        sequence.set('dateModified', new Date());
                    }

                    var parttext = Ext.getCmp('mainAppPanel').getActiveTab().down('tbtext[id="VectorEditorStatusBarAlert"]');
                    if(parttext) {
                        parttext.animate({duration: 1000, to: {opacity: 1}}).setText('Sequence Parsed');
                        parttext.animate({duration: 5000, to: {opacity: 0}});
                    }

                    Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
                    if(typeof (cb) === "function") { cb(sequence); 
                                Ext.getCmp("mainAppPanel").getActiveTab().query("button[cls='saveSequenceBtn']")[0].el.dom.click(); }
            };

            if (sequence.get("size") == -1) {
                performSequenceCreation();
            }
            else
            {
                Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();

                if(Ext.getCmp('mainAppPanel').getActiveTab().title!="NO_NAME") {
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
                            var onSequencePromptClosed = function(btn, text) {
                                if(btn==="ok") {
                                    if(text === "") {return Ext.MessageBox.prompt("Name", "Please enter a sequence name:", onSequencePromptClosed, this, false, locusName); }
                                    
                                    var sequencesNames = [];
                                    Teselagen.manager.ProjectManager.sequences.load().each(function (sequence) {
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
                                        dateCreated: new Date(),
                                        dateModified: new Date(),
                                        name: text
                                    });

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
                        } else if (btn==="no") {
                                performSequenceCreation();
                            }
                        }
                    });
                } else {
                    performSequenceCreation();
                }
            }*/
    },
    init: function() {

        this.application.on(Teselagen.event.ProjectEvent.IMPORT_FILE_TO_SEQUENCE,this.onImportFileToSequence, this);
    }
});
