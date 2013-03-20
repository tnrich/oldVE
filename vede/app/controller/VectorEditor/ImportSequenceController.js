/**
 * Import sequence window controller
 * @class Vede.controller.VectorEditor.ImportSequenceController
 */
Ext.define('Vede.controller.VectorEditor.ImportSequenceController', {
    extend: 'Ext.app.Controller',

    requires: ['Teselagen.bio.parsers.GenbankManager',
               'Teselagen.event.MenuItemEvent',
               'Teselagen.event.VisibilityEvent',
               'Teselagen.utils.FormatUtils',
               'Teselagen.bio.parsers.ParsersManager',
               "Teselagen.manager.ProjectManager"],
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
                veproject = Teselagen.manager.ProjectManager.workingVEProject;
                veproject.set('name',seqMgr.getName());
            });
        });
    },
    */
    onImportFileToSequence: function(pFile, pExt, pEvt,sequence) {

        performSequenceCreation = function(){
            var result  = pEvt.target.result;
            var gb      = Teselagen.utils.FormatUtils.fileToGenbank(result, pExt);
            var seqMgr =  Teselagen.utils.FormatUtils.genbankToSequenceManager(gb);
            Vede.application.fireEvent("SequenceManagerChanged", seqMgr);
            sequence.set('sequenceFileContent',gb.toString());
            sequence.set('sequenceFileFormat',"GENBANK");
            sequence.set('sequenceFileName',pFile.name);
            sequence.set('firstTimeImported',true);
            var veproject = Teselagen.manager.ProjectManager.workingVEProject;
            veproject.set('name',seqMgr.getName());
            var parttext = Ext.getCmp('VectorEditorStatusPanel').down('tbtext[id="VectorEditorStatusBarAlert"]');
            parttext.animate({duration: 1000, to: {opacity: 1}}).setText('Sequence Parsed Successfully');
            parttext.animate({duration: 5000, to: {opacity: 0}});
            Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
        };

        if(sequence.get('firstTimeImported'))
        {
            Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
            Ext.MessageBox.confirm('Confirm', 'A sequence has been already imported to this file. Are you sure you want to overwrite it?', function(btn){
                if(btn==="yes")
                {
                    performSequenceCreation();
                }
            });
        }
        else
        {
            performSequenceCreation();
        }

    },
    init: function() {
        this.application.on("ImportFileToSequence",this.onImportFileToSequence, this);
    }
});
