Ext.define('Vede.controller.VectorEditor.ImportSequenceWindowController', {
    extend: 'Ext.app.Controller',

    requires: ['Teselagen.bio.parsers.GenbankManager',
               'Teselagen.event.MenuItemEvent',
               'Teselagen.event.VisibilityEvent',
               'Teselagen.utils.FormatUtils'],

    MenuItemEvent: null,
    VisibilityEvent: null,
    importWindow: null,


    importSequenceToProject: function(){
        var file,sequenceName;
        if (typeof window.FileReader !== 'function') {
            Ext.Msg.alert('Browser does not support File API.');
        }
        else {
            var form = this.importWindow.down('form').getForm();
            sequenceName = this.importWindow.query('textfield[cls=sequenceName]')[0].value;
            var fileField = form.findField('importedFile');
            var fileInput = fileField.extractFileInput();
            file = fileInput.files[0];
            fr = new FileReader();
            fr.onload = processText;
            fr.readAsText(file);
        }
        this.importWindow.close();

        var seqMgr;
        var self = this;

        function processText() {
            var result  = fr.result;

            // Generate the sequenceFile
            var newSequence = Ext.create("Teselagen.models.SequenceFile", {
                sequenceFileName: file.name,
                sequenceFileFormat: "Genbank",
                sequenceFileContent: result
            });

            var veproject_id = self.importWindow.veproject.data.id;
            self.importWindow.veproject.setSequenceFile(newSequence);
            newSequence.set('veproject_id',veproject_id);
            self.importWindow.veproject.set('id',veproject_id);
            
            newSequence.save({
                callback: function(succ,op)
                {
                    console.log("New Sequence Saved!");

                    var gb      = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(result);
                    seqMgr = Teselagen.utils.FormatUtils.genbankToSequenceManager(gb);
                    //Vede.application.fireEvent("SequenceManagerChanged", seqMgr);
                    //Vede.application.fireEvent("SaveImportedSequence", seqMgr);

                    //Update information with parsed Data
                    if(sequenceName===""){
                        sequenceName = seqMgr.getName();
                        self.importWindow.veproject.set('name',sequenceName);
                        self.importWindow.veproject.save({
                            callback: function(){
                                Teselagen.manager.ProjectManager.openVEProject(self.importWindow.veproject);
                                Teselagen.manager.ProjectManager.loadDesignAndChildResources();
                            }
                        });
                    }

                }
            });

        }

    },
    onOpenImportSequencePanel: function(veproject) {
        this.importWindow = Ext.create("Vede.view.ve.ImportSequenceWindow").show();
        this.importWindow.veproject = veproject;
        var importBtn = this.importWindow.query('button[cls=import]')[0];
        importBtn.on("click",this.importSequenceToProject,this);
    },

    init: function() {
        this.application.on("ImportSequenceToProject",this.onOpenImportSequencePanel, this);
    }
});
