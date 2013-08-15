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


    createOrOverrideWindowMessageBox: function(importMessages,cb){
        var dialog = Ext.create('Ext.window.MessageBox', {
            buttons: [{
                text: 'Create new Sequence',
                handler: function() {
                    dialog.close();
                    cb("yes");
                }
            },{
                text: 'Overwrite',
                handler: function() {
                    dialog.close();
                    cb("no");
                }
            },{
                text: 'Cancel',
                handler: function() {
                    dialog.close();
                }
            }]
        });

        dialog.show({
            title: 'Import preferences',
            msg: '<p>Would you like to create a new sequence, or overwrite the current sequence?</p><br>' + importMessages.join("<br>"),
            closable: false,
            modal: true

        });

    },

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

                importMessages = importMessages.concat(sequenceManager.getParseMessages()).concat(gb.messages);

                Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();

                self.createOrOverrideWindowMessageBox(importMessages, function (btn) {
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
                    });
            });
        });

    },
    init: function() {

        this.application.on(Teselagen.event.ProjectEvent.IMPORT_FILE_TO_SEQUENCE,this.onImportFileToSequence, this);
    }
});
