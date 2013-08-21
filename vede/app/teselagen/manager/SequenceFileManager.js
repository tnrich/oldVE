/**
 * @class Teselagen.manager.SequenceFileManager
 * Class describing a SequenceFileManager.
 * SequenceFileManager has a number of utilities, including methods to convert a
 * SequenceFile (from a Device Design/Design Editor) to a SequenceManager (to be viewed in Vector Editor).
 *
 * @author Diana Wong
 */
Ext.define("Teselagen.manager.SequenceFileManager", {

    singleton: true,

    requires: [
        "Teselagen.manager.SequenceManager",
        "Teselagen.bio.parsers.GenbankManager",
        "Teselagen.bio.parsers.SbolParser",
        "Teselagen.utils.FormatUtils",
        "Teselagen.constants.Constants"
    ],

    config: {
        SequenceManager: null,
        GenbankManager: null,
        FormatUtils: null,
        Constants: null
    },

    constructor: function(inData) {
        //this.Sha256          = Teselagen.bio.util.Sha256;
        
        this.Constants          = Teselagen.constants.Constants;
        this.SequenceManager    = Teselagen.manager.SequenceManager;
        this.GenbankManager      = Teselagen.bio.parsers.GenbankManager;
        this.FormatUtils        = Teselagen.utils.FormatUtils;
        this.SbolParser         = Teselagen.bio.parsers.SbolParser;
    },

    /**
     * Convert a SequenceFile model to a SequenceManager model.
     * @param {Teselagen.models.SequenceFile} pSequenceFile
     * @returns {Teselagen.manager.SequenceManager}
     */
    sequenceFileToSequenceManager: function(pSequenceFile) {
        var name    = pSequenceFile.get("name");
        var format  = pSequenceFile.get("sequenceFileFormat");
        var content = pSequenceFile.get("sequenceFileContent");
        var seqMan;
        
        if(!this.FormatUtils)
        {
            console.log("Fixing FormatUtils loading");
            this.FormatUtils = Teselagen.utils.FormatUtils;
        }

        switch (format) {
        case this.Constants.GENBANK:
            var genbank = this.GenbankManager.parseGenbankFile(content);
            seqMan = this.FormatUtils.genbankToSequenceManager(genbank);
            break;
        case this.Constants.FASTA:
            seqMan = this.FormatUtils.fastaToSequenceManager(content);
            break;
        case this.Constants.JBEISEQ:
            seqMan = this.FormatUtils.jbeiseqXmlToSequenceManager(content);
            break;
        case this.Constants.SBOLXML:
            sbolJson = this.SbolParser.sbolXmlToJson(content);

            if (this.SbolParser.checkRawSbolJson(sbolJson)) {
                // SBOL 2 SequenceManager has not been written yet
            }

            console.warn("Teselagen.manager.SequenceFileManger.sequenceFileToSequenceManger: SbolJson2SequenceManager not written yet.");

            seqMan = null;
            break;
        default:
            console.warn("Teselagen.manager.SequenceFileManger.sequenceFileToSequenceManger: File format not detected.");
        }

        seqMan.setName(name);
        pSequenceFile.setSequenceManager(seqMan);

        return seqMan;
    }

});
