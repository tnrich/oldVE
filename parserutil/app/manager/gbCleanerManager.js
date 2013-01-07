Ext.define("TeselagenUtils.manager.gbCleanerManager", {
    singleton: true,
    requires: [
        "Teselagen.bio.util.StringUtil",
        "Teselagen.bio.parsers.GenbankManager"
    ],
    constructor: function() {

    },

    log: function(data){
        var logger = Ext.getCmp('loggerField');
        if (!logger.value) logger.setValue('');
        logger.setValue(logger.value+data+'\n');
    },

    processGenbankFile: function(file,data){
        var self = this;
        self.log("Processing genbank file");

        gb  = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(String(data));

        var saveFile = function(name, gb) {
            var flag;
            var text        = gb.toString();
            var filename    = 'cleaned_'+name;
            var bb          = new BlobBuilder();
            bb.append(text);
            saveAs(bb.getBlob("text/plain;charset=utf-8"), filename);
            self.log("File saved");
        };
        saveFile(file.name,gb);

    },

    init: function() {
        this.callParent();
    }
 //this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT,this.openProject, this);
});