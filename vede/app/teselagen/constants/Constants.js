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
    
//    ENTRY_REGISTRY_URL:     "",
    API_URL:     "http://teselagen.local/api/",

    //================================================================
    // SequenceFile.js: sequenceFileFormat
    // AssembledSequenceFile.js:

    FORMATS_LIST: [
        "GENBANK",
        "FASTA",
        "JBEISEQXML",
        "JBEISEQJSON",
        "SBOLXML",
        "jbei-seq"
    ],
    
    GENBANK:                "Genbank", // Acording to http://j5.jbei.org/DeviceEditor_manual/attachments/design.xsd
    FASTA:                  "FASTA", // Acording to http://j5.jbei.org/DeviceEditor_manual/attachments/design.xsd
    JBEISEQ:                "jbei-seq", // Acording to http://j5.jbei.org/DeviceEditor_manual/attachments/design.xsd
    JBEISEQJSON:            "JBEISEQJSON",  //JSON format. Not included as a case for some device models
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
        "None",
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

    FAS_LIST_NO_DIGEST: [
        "None",
        "Direct Synthesis",
        "PCR",
        "Embed_in_primer_reverse",
        "Embed_in_primer_forward",
        "Annealed Oligos"
    ],
    
    FAS: Object.freeze({
        NONE: "None",
        DIGEST: "DIGEST",
        DIRECT: "Direct Synthesis",
        PCR: "PCR",
        PRIMER_REV: "Embed_in_primer_reverse",
        PRIMER_FWD: "Embed_in_primer_forward",
        ANNEALED: "Annealed Oligos"
    }),

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
    //REPORT_BUG_URL:         "",
    //SUGGEST_FEATURE_URL:    "",
    
    //VERIFY_URL_RELATIVE_PATH:   "/bin/verify.pl",
    //SERVER_PATH:            "",   //set to "" for relative paths
    
    //PART_CLIPBOARD_KEY:     "PartClipboardKey",
    
    //BIN_MARGIN:                     5,
    //COLLECTION_OUTSIDE_MARGIN:      20,
    RECT_SHAPE_DEFAULT_SIZE:        56,
    RECT_SHAPE_MIN_SIZE:            this.RECT_SHAPE_DEFAULT_SIZE / 2,
    
    CIRCULAR:   "circular",
    LINEAR:     "linear",
    //================================================================

    // Options for the "Type" combo box in the Create New Features.
    FEATURE_TYPES: [
 	{label: "-10_signal", data: "-10_signal"}, 
     {label: "-35_signal", data: "-35_signal"}, 
     {label: "3'UTR", data: "3'UTR"}, 
     {label: "5'UTR", data: "5'UTR"}, 
     {label: "allele", data: "allele"}, 
     {label: "attenuator", data: "attenuator"}, 
     {label: "C_region", data: "C_region"}, 
     {label: "CAAT_signal", data: "CAAT_signal"}, 
     {label: "CDS", data: "CDS"}, 
     {label: "conflict", data: "conflict"}, 
     {label: "D_segment", data: "D_segment"}, 
     {label: "D-loop", data: "D-loop"}, 
     {label: "enhancer", data: "enhancer"}, 
     {label: "exon", data: "exon"}, 
     {label: "GC_signal", data: "GC_signal"}, 
     {label: "gene", data: "gene"}, 
     {label: "iDNA", data: "iDNA"}, 
     {label: "intron", data: "intron"}, 
     {label: "J_region", data: "J_region"}, 
     {label: "LTR", data: "LTR"}, 
     {label: "mat_peptide", data: "mat_peptide"}, 
     {label: "misc_binding", data: "misc_binding"}, 
     {label: "misc_difference", data: "misc_difference"}, 
     {label: "misc_feature", data: "misc_feature"}, 
     {label: "misc_recomb", data: "misc_recomb"}, 
     {label: "misc_RNA", data: "misc_RNA"}, 
     {label: "misc_signal", data: "misc_signal"}, 
     {label: "misc_structure", data: "misc_structure"}, 
     {label: "modified_base", data: "modified_base"}, 
     {label: "mRNA", data: "mRNA"},
     {label: "mutation", data: "mutation"}, 
     {label: "N_region", data: "N_region"}, 
     {label: "old_sequence", data: "old_sequence"}, 
     {label: "polyA_signal", data: "polyA_signal"}, 
     {label: "polyA_site", data: "polyA_site"}, 
     {label: "precursor_RNA", data: "precursor_RNA"}, 
     {label: "prim_transcript", data: "prim_transcript"}, 
     {label: "primer", data: "primer"}, 
     {label: "primer_bind", data: "primer_bind"}, 
     {label: "promoter", data: "promoter"}, 
     {label: "protein_bind", data: "protein_bind"}, 
     {label: "RBS", data: "RBS"}, 
     {label: "rep_origin", data: "rep_origin"}, 
     {label: "repeat_region", data: "repeat_region"}, 
     {label: "repeat_unit", data: "repeat_unit"}, 
     {label: "rRNA", data: "rRNA"}, 
     {label: "S_region", data: "S_region"}, 
     {label: "satellite", data: "satellite"}, 
     {label: "scRNA", data: "scRNA"}, 
     {label: "sig_peptide", data: "sig_peptide"}, 
     {label: "snRNA", data: "snRNA"}, 
     {label: "source", data: "source"}, 
     {label: "stem_loop", data: "stem_loop"}, 
     {label: "STS", data: "STS"}, 
     {label: "TATA_signal", data: "TATA_signal"}, 
     {label: "terminator", data: "terminator"}, 
     {label: "transit_peptide", data: "transit_peptide"}, 
     {label: "transposon", data: "transposon"}, 
     {label: "tRNA", data: "tRNA"}, 
     {label: "unsure", data: "unsure"}, 
     {label: "V_region ", data: "V_region "}, 
     {label: "variation", data: "variation"}
	],
	
    // Default options for Vector Editor's view menu.
    DEFAULT_VE_VIEW_OPTIONS: {
        features: true,
        cutSites: false,
        orfs: false,
        circular: true,
        mapCaret: true,
        complementary: true,
        spaces: true,
        sequenceAA: false,
        revComAA: false,
        featureLabels: true,
        cutSiteLabels: true
    }
});
