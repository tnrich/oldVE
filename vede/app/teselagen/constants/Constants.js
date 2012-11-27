/**
 * @class Teselagen.constants.Constants
 * Class with constants
 * @author Diana Wong
 * @author ? (original author)
 */
Ext.define("Teselagen.constants.Constants", {
    singleton: true,

    ENV_DEV: "dev",
    ENV_PROD: "prod",
    ENV_TEST: "test",
    
    VERSION:                "1.0",
    
    //ENTRY_REGISTRY_URL:     "",

    //================================================================
    // SequenceFile.js: sequenceFileFormat
    // AssembledSequenceFile.js:

    FORMATS_LIST: [
        "GENBANK",
        "FASTA",
        "JBEISEQXML",
        "SBOLXML"
    ],
    
    GENBANK:                "GENBANK",
    FASTA:                  "FASTA",
    JBEISEQ:                "JBEISEQXML",
    SBOLXML:                "SBOLXML",
    INIT:                   "INIT",

    GENBANK_SUFFIX:         ".gb",
    FASTA_SUFFIX:           ".fas",
    JEBISEQ_SUFFIX:         ".xml",
    SBOL_SUFFIX:            ".sbol", //?

    //================================================================
    // EugeneRule.js: compositionalOperator

    // Deprecated
    NOTMORETHAN:        "NOTMORETHAN",
    // Deprecated
    NOTWITH:            "NOTWITH",
    
    AFTER:              "AFTER",
    BEFORE:             "BEFORE",
    WITH:               "WITH",
    THEN:               "THEN",
    NEXTTO:             "NEXTTO",
    MORETHAN:           "MORETHAN",

    COMPOP_LIST: [
        "NOTMORETHAN",
        "NOTWITH",
        "AFTER",
        "BEFORE",
        "WITH",
        "THEN",
        "NEXTTO",
        "MORETHAN"
    ],

    

    //================================================================
    // J5Bin.js

    // ForceAssemblyStrategies -- can be used only in certain conditions
    FAS_LIST: [
        "NONE",
        // For the first part or first bin and part(s) in the first bin (assumed to be the destination vector backbone(s)):
        "DIGEST",
        // For a contiguous set of bin(s) or part(s) whose total length is large enough to be PCR amplified:
        "Direct Synthesis",
        // For bins or parts that are large enough to be PCR amplified:
        "PCR",
        // For bins or parts that are small enough to be embedded within a PCR oligo:
        "Embed_in_primer_reverse",
        "Embed_in_primer_forward",
        //For bins or parts that are small enough to be embedded within a DNA oligo:
        "Annealed Oligos"
    ],

    //================================================================
    // J5Run


    ASSEMBLYTYPE_LIST: [
        // Mock
        "MOCK",
        // SLIC/Gibson/CPEC/SLiCE
        "SLIC",
        // Golden Gate
        "GOLDENGATE"
    ],

    // Assembly type list
    NONMOCKTYPE_LIST: [
        "SLIC/Gibonson/CPEC/SLiCE",
        "GOLDENGATE"
    ],


    MOCK:       "MOCK",
    SLIC:       "SLIC",
    GOLDENGATE: "GOLDENGATE",


    // Synthesis type list
    SYNTHESISTYPE_LIST: [
        "DIRECT",
        "OLIGO",
        "ANNEALED OLIGOS"
    ],


    RUN_STATUS_LIST: [
        "SUCCESS",
        "FAILED",
        "IN PROGRESS"
    ],

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