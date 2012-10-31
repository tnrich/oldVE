/**
 * @class Teselagen.constants.Constants
 * Class with constants
 * @author Diana Wong
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.constants.Constants", {
    singleton: true,

    ENV_DEV: "dev",
    ENV_PROD: "prod",
    ENV_TEST: "test",
    
    VERSION:                "2.0.4",
    
    ENTRY_REGISTRY_URL:     "",

    //================================================================
    // SequenceFile.js: sequenceFileFormat
    
    GENBANK:                "GENBANK",
    FASTA:                  "FASTA",
    JBEI_SEQ:               "JBEI-SEQ",
    SBOL_XML:               "SBOLXML",

    //================================================================
    // EugeneRule.js: compositionalOperator

    // Deprecated
    NOTMORETHAN: "NOTMORETHAN",
    // Deprecated
    NOTWITH: "NOTWITH",
    
    AFTER: "AFTER",
    BEFORE: "BEFORE",
    WITH: "WITH",
    THEN: "THEN",
    NEXTTO: "NEXTTO",
    MORETHAN: "MORETHAN",

    //================================================================

    
    REPORT_BUG_URL:         "",
    SUGGEST_FEATURE_URL:    "",
    
    VERIFY_URL_RELATIVE_PATH:   "/bin/verify.pl",
    SERVER_PATH:            "",   //set to "" for relative paths
    
    PART_CLIPBOARD_KEY:     "PartClipboardKey",
    
    BIN_MARGIN:                     5,
    COLLECTION_OUTSIDE_MARGIN:      20,
    RECT_SHAPE_DEFAULT_SIZE:        56,
    RECT_SHAPE_MIN_SIZE:            this.RECT_SHAPE_DEFAULT_SIZE / 2,
    
    CIRCULAR:   "circular",
    LINEAR:     "linear",
    //================================================================

    constructor: function() {
        this.RECT_SHAPE_MIN_SIZE = this.RECT_SHAPE_DEFAULT_SIZE / 2;
    }

});