/**
 * @class Teselagen.models.J5Parameters
 * Class describing J5Parameters.
 * Creating a J5Parameters results in default values, regardless if parameters are included in 
 * Ext.create("Teselagen.models.J5Parameters", {PARAMETERS}).
 * User must specify non-default values by creating the object and calling:
 *          j5param = Ext.create("Teselagen.models.J5Parameters");
 *          j5param.set("FILEDNAME", newParameter);
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.models.J5Parameters", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.constants.Constants"
    ],

    statics: {
        //parameter names
        MONOD:      "MASTEROLIGONUMBEROFDIGITS",
        MPNOD:      "MASTERPLASMIDNUMBEROFDIGITS",
        GOB:        "GIBSONOVERLAPBPS",
        GOMT:       "GIBSONOVERLAPMINTM",
        GOMAXT:     "GIBSONOVERLAPMAXTM",
        MOLB:       "MAXIMUMOLIGOLENGTHBPS",
        MFSGB:      "MINIMUMFRAGMENTSIZEGIBSONBPS",
        GGOHB:      "GOLDENGATEOVERHANGBPS",
        GGRS:       "GOLDENGATERECOGNITIONSEQ",
        GGTES:      "GOLDENGATETERMINIEXTRASEQ",
        MIGGOC:     "MAXIMUM_IDENTITIES_GOLDEN_GATE_OVERHANGS_COMPATIBLE",
        OSCPB:      "OLIGOSYNTHESISCOSTPERBPUSD",
        OPPCPP:     "OLIGOPAGEPURIFICATIONCOSTPERPIECEUSD",
        OMLPPRB:    "OLIGOMAXLENGTHNOPAGEPURIFICATIONREQUIREDBPS",
        MPPB:       "MINIMUMPCRPRODUCTBPS",
        DSCPB:      "DIRECTSYNTHESISCOSTPERBPUSD",
        DSMCPP:     "DIRECTSYNTHESISMINIUMUMCOSTPERPIECEUSD",
        PGC:        "PRIMER_GC_CLAMP",
        PMS:        "PRIMER_MIN_SIZE",
        PMAXS:      "PRIMER_MAX_SIZE",
        PMT:        "PRIMER_MIN_TM",
        PMAXT:      "PRIMER_MAX_TM",
        PMDT:       "PRIMER_MAX_DIFF_TM",
        PMSAT:      "PRIMER_MAX_SELF_ANY_TH",
        PMSET:      "PRIMER_MAX_SELF_END_TH",
        PPMCAT:     "PRIMER_PAIR_MAX_COMPL_ANY_TH",
        PPMCET:     "PRIMER_PAIR_MAX_COMPL_END_TH",
        PTS:        "PRIMER_TM_SANTALUCIA",
        PSC:        "PRIMER_SALT_CORRECTIONS",
        PDC:        "PRIMER_DNA_CONC",
        M3BBTWIH:   "MISPRIMING_3PRIME_BOUNDARY_BP_TO_WARN_IF_HIT",
        MMT:        "MISPRIMING_MIN_TM",
        MSC:        "MISPRIMING_SALT_CONC",
        MOC:        "MISPRIMING_OLIGO_CONC",
        OSF:        "OUTPUT_SEQUENCE_FORMAT",
        APT:        "ASSEMBLY_PRODUCT_TYPE",
        SPP:        "SUPPRESS_PURE_PRIMERS",
        
        //parameter descriptions
        MONOD_DESC:     "The default number of digits used to number an oligo, e.g. j5_00001_primer_description uses 5 digits",
        MPNOD_DESC:         "The default number of digits used to number a plasmid, e.g. pj5_00001 uses 5 digits",
        GOB_DESC:       "The minimum number of bps for SLIC/Gibson/CPEC overlaps (should be an even number), this is also the starting design length for the annealing portion of primers",
        GOMT_DESC:      "The minimum desired Tm for SLIC/Gibson/CPEC overlaps",
        GOMAXT_DESC:    "The maximum desired Tm for SLIC/Gibson/CPEC overlaps",
        MOLB_DESC:      "The maximum oligo length to be ordered",
        MFSGB_DESC:     "The minimum fragment size for SLIC/Gibson assembly",
        GGOHB_DESC:     "The number of bps of the overhang resulting from the Golden-gate type IIs endonuclease digestion",
        GGRS_DESC:      "The Golden-gate type IIs endonuclease recognition site sequence",
        GGTES_DESC:     "The extra 5' sequence required at each end of a Golden-gate assembly piece, e.g. NNNNNNNGGCTCTN for BsaI (Eco31I)",
        MIGGOC_DESC:    "The maximum number of tolerable non-gapped aligned identities between compatible overhang sequences for Golden-gate assembly",
        OSCPB_DESC:     "The oligo synthesis cost per bp ($US)",
        OPPCPP_DESC:    "The PAGE-purification cost per oligo ($US)",
        OMLPPRB_DESC:   "The maximum oligo length that does not require PAGE-purification",
        MPPB_DESC:      "The minimum PCR product size",
        DSCPB_DESC:     "The cost per bp to do direct synthesis ($US)",
        DSMCPP_DESC:    "The minimum cost of synthesis per piece ($US)",
        PGC_DESC:       "Primer3 parameter: length of the desired GC clamp (Primer3 default is 0)",
        PMS_DESC:       "Primer3 parameter: the minimum length of a primer (Primer3 default is 18)",
        PMAXS_DESC:     "Primer3 parameter: the maximum length of a primer (Primer3 default is 27, maximum is 36)",
        PMT_DESC:       "Primer3 parameter: the minimum primer Tm (Primer3 default is 57)",
        PMAXT_DESC:     "Primer3 parameter: the maximum primer Tm (Primer3 default is 63)",
        PMDT_DESC:      "Primer3 parameter: the maximum primer pair difference in Tm (Primer3 default is 100)",
        PMSAT_DESC:     "Primer3 parameter: the maximum primer self complementarity (Primer3 default is 47)",
        PMSET_DESC:     "Primer3 parameter: the maximum primer self end complementarity (Primer3 default is 47)",
        PPMCAT_DESC:    "Primer3 parameter: the maximum primer pair complementarity (Primer3 default is 47)",
        PPMCET_DESC:    "Primer3 parameter: the maximum primer pair end complementarity (Primer3 default is 47)",
        PTS_DESC:       "Primer3 parameter: use the Santalucia formula for calculating Tms (1 = TRUE, 0 = FALSE) (Primer3 default is 0 (FALSE))",
        PSC_DESC:       "Primer3 parameter: use the salt correction formula for calculating Tms (1 = TRUE, 0 = FALSE) (Primer3 default is 0 (FALSE))",
        PDC_DESC:       "Primer3 parameter: DNA concentration to use when calculating Tms in micromolar (IDT uses 250, Primer3 default is 50)",
        M3BBTWIH_DESC:  "Only warn of mispriming if the BLAST hit between the primer and the template contains the 3' end of the primer (within this number of bp)",
        MMT_DESC:       "The minimum approximate Tm to consider a significant mispriming event",
        MSC_DESC:       "The salt concentration used when estimating the mispriming Tm in Molar",
        MOC_DESC:       "The oligo concentration used when estimating the mispriming Tm in Molar",
        OSF_DESC:       "\"The output sequence file format. Options are: \"\"Genbank\"\", \"\"FASTA\"\", \"\"jbei-seq\"\", or \"\"SBOLXML\"\"\"",
        APT_DESC:       "\"Determines whether the assembled DNA product will be circular or linear. Options are: \"\"circular\"\" or \"\"linear\"\"\"",
        SPP_DESC:       "\"Suppress the output of pure primers. Options are: \"\"TRUE\"\" or \"\"FALSE\"\"\"",
        
        //parameter default values
        MONOD_Default:          5,
        MPNOD_Default:          5,
        GOB_Default:            26,
        GOMT_Default:           60,
        GOMAXT_Default:         70,

        MOLB_Default:           110,
        MFSGB_Default:          250,
        GGOHB_Default:          4,
        GGRS_Default:           "GGTCTC",
        GGTES_Default:          "CACACCAGGTCTCA",

        MIGGOC_Default:         2,
        OSCPB_Default:          0.1,
        OPPCPP_Default:         40,
        OMLPPRB_Default:        60,
        MPPB_Default:           100,

        DSCPB_Default:          0.39,
        DSMCPP_Default:         159,
        PGC_Default:            2,
        PMS_Default:            18,
        PMAXS_Default:          36,

        PMT_Default:            60,
        PMAXT_Default:          70,
        PMDT_Default:           5,
        PMSAT_Default:          47,
        PMSET_Default:          47,

        PPMCAT_Default:         47,
        PPMCET_Default:         47,
        PTS_Default:            true,
        PSC_Default:            true,
        PDC_Default:            250,

        M3BBTWIH_Default:       4,
        MMT_Default:            45,
        MSC_Default:            0.05,
        MOC_Default:            0.00000025,
        OSF_Default:            "Genbank",//Teselagen.constants.Constants.self.GENBANK,

        SPP_Default:            true,
        
        //combobox choices data providers
        //outputSequenceFormatOptions:   [Teselagen.constants.Constants.self.GENBANK, Teselagen.constants.Constants.self.FASTA, Teselagen.constants.Constants.self.JBEI_SEQ, Teselagen.constants.Constants.self.SBOL_XML],
        booleanOptions:         [false, true]
    },

    /**
     * Input parameters:
     * J5 Parameter Values. Default values DO NOT SET when creating this obect
     */
    fields: [
        {name: "masterOligoNumberOfDigitsValue",                   type: "int",        defaultValue: this.self.MONOD_Default},
        {name: "masterPlasmidNumberOfDigitsValue",                 type: "int",        defaultValue: this.self.MPNOD_Default},
        {name: "gibsonOverlapBPsValue",                            type: "int",        defaultValue: this.self.GOB_Default},
        {name: "gibsonOverlapMinTmValue",                          type: "Number",     defaultValue: this.self.GOMT_Default},
        {name: "gibsonOverlapMaxTmValue",                          type: "Number",     defaultValue: this.self.MOLB_Default},

        {name: "maxOligoLengthBPsValue",                           type: "int",        defaultValue: this.self.MFSGB_Default},
        {name: "minFragmentSizeGibsonBPsValue",                    type: "int",        defaultValue: this.self.GGOHB_Default},
        {name: "goldenGateOverhangBPsValue",                       type: "int",        defaultValue: this.self.GGRS_Default},
        {name: "goldenGateRecognitionSeqValue",                    type: "String",     defaultValue: this.self.GGTES_Default},
        {name: "goldenGateTerminiExtraSeqValue",                   type: "String",     defaultValue: this.self.GGTES_Default},

        {name: "maxIdentitiesGoldenGateOverhangsCompatibleValue",  type: "int",        defaultValue: this.self.MIGGOC_Default},
        {name: "oligoSynthesisCostPerBPUSDValue",                  type: "Number",     defaultValue: this.self.OSCPB_Default},
        {name: "oligoPagePurificationCostPerPieceUSDValue",        type: "Number",     defaultValue: this.self.OPPCPP_Default},
        {name: "oligoMaxLengthNoPagePurificationRequiredBPsValue", type: "int",        defaultValue: this.self.OMLPPRB_Default},
        {name: "minPCRProductBPsValue",                            type: "int",        defaultValue: this.self.MPPB_Default},

        {name: "directSynthesisCostPerBPUSDValue",                 type: "Number",     defaultValue: this.self.DSCPB_Default},
        {name: "directSynthesisMinCostPerPieceUSDValue",           type: "Number",     defaultValue: this.self.DSMCPP_Default},
        {name: "primerGCClampValue",                               type: "int",        defaultValue: this.self.PGC_Default},
        {name: "primerMinSizeValue",                               type: "int",        defaultValue: this.self.PMS_Default},
        {name: "primerMaxSizeValue",                               type: "int",        defaultValue: this.self.PMAXS_Default},

        {name: "primerMinTmValue",                                 type: "Number",     defaultValue: this.self.PMT_Default},
        {name: "primerMaxTmValue",                                 type: "Number",     defaultValue: this.self.PMAXT_Default},
        {name: "primerMaxDiffTmValue",                             type: "Number",     defaultValue: this.self.PMDT_Default},
        {name: "primerMaxSelfAnyThValue",                          type: "int",        defaultValue: this.self.PMSAT_Default},
        {name: "primerMaxSelfEndThValue",                          type: "int",        defaultValue: this.self.PMSET_Default},

        {name: "primerPairMaxComplAnyThValue",                     type: "int",        defaultValue: this.self.PPMCAT_Default},
        {name: "primerPairMaxComplEndThValue",                     type: "int",        defaultValue: this.self.PPMCET_Default},
        {name: "primerTmSantaluciaValue",                          type: "Boolean",    defaultValue: this.self.PTS_Default},
        {name: "primerSaltCorrectionsValue",                       type: "Boolean",    defaultValue: this.self.PSC_Default},
        {name: "primerDnaConcValue",                               type: "int",        defaultValue: this.self.PDC_Default},

        {name: "mispriming3PrimeBoundaryBPToWarnIfHitValue",       type: "int",        defaultValue: this.self.M3BBTWIH_Default},
        {name: "misprimingMinTmValue",                             type: "Number",     defaultValue: this.self.MMT_Default},
        {name: "misprimingSaltConcValue",                          type: "Number",     defaultValue: this.self.MSC_Default},
        {name: "misprimingOligoConcValue",                         type: "Number",     defaultValue: this.self.MOC_Default},
        {name: "outputSequenceFormatValue",                        type: "String",     defaultValue: this.self.OSF_Default},

        {name: "suppressPurePrimersValue",                         type: "Boolean",    defaultValue: this.self.SPP_Default}
    ],

    // Need this because fields:[] does not actually set the defaults!
    // Keep the inputted values if they are not undefined
    init: function() {
        //console.log("init J5 Param");
        //console.log(this.data);

        /*if (this.get("masterOligoNumberOfDigitsValue") === undefined) {
            this.set("masterOligoNumberOfDigitsValue", this.self.MONOD_Default);
        }*/
        this.setDefaultValues();
    },

    setDefaultValues: function() {
        this.set("masterOligoNumberOfDigitsValue", this.self.MONOD_Default);
        this.set("masterPlasmidNumberOfDigitsValue", this.self.MPNOD_Default);
        this.set("gibsonOverlapBPsValue", this.self.GOB_Default);
        this.set("gibsonOverlapMinTmValue", this.self.GOMT_Default);
        this.set("gibsonOverlapMaxTmValue", this.self.GOMAXT_Default);

        this.set("maxOligoLengthBPsValue", this.self.MOLB_Default);
        this.set("minFragmentSizeGibsonBPsValue", this.self.MFSGB_Default);
        this.set("goldenGateOverhangBPsValue", this.self.GGOHB_Default);
        this.set("goldenGateRecognitionSeqValue", this.self.GGRS_Default);
        this.set("goldenGateTerminiExtraSeqValue", this.self.GGTES_Default);

        this.set("maxIdentitiesGoldenGateOverhangsCompatibleValue", this.self.MIGGOC_Default);
        this.set("oligoSynthesisCostPerBPUSDValue", this.self.OSCPB_Default);
        this.set("oligoPagePurificationCostPerPieceUSDValue", this.self.OPPCPP_Default);
        this.set("oligoMaxLengthNoPagePurificationRequiredBPsValue", this.self.OMLPPRB_Default);
        this.set("minPCRProductBPsValue", this.self.MPPB_Default);

        this.set("directSynthesisCostPerBPUSDValue", this.self.DSCPB_Default);
        this.set("directSynthesisMinCostPerPieceUSDValue", this.self.DSMCPP_Default);
        this.set("primerGCClampValue", this.self.PGC_Default);
        this.set("primerMinSizeValue", this.self.PMS_Default);
        this.set("primerMaxSizeValue", this.self.PMAXS_Default);

        this.set("primerMinTmValue", this.self.PMT_Default);
        this.set("primerMaxTmValue", this.self.PMAXT_Default);
        this.set("primerMaxDiffTmValue", this.self.PMDT_Default);
        this.set("primerMaxSelfAnyThValue", this.self.PMSAT_Default);
        this.set("primerMaxSelfEndThValue", this.self.PMSET_Default);

        this.set("primerPairMaxComplAnyThValue", this.self.PPMCAT_Default);
        this.set("primerPairMaxComplEndThValue", this.self.PPMCET_Default);
        this.set("primerTmSantaluciaValue", this.self.PTS_Default);
        this.set("primerSaltCorrectionsValue", this.self.PSC_Default);
        this.set("primerDnaConcValue", this.self.PDC_Default);

        this.set("mispriming3PrimeBoundaryBPToWarnIfHitValue", this.self.M3BBTWIH_Default);
        this.set("misprimingMinTmValue", this.self.MMT_Default);
        this.set("misprimingSaltConcValue", this.self.MSC_Default);
        this.set("misprimingOligoConcValue", this.self.MOC_Default);
        this.set("outputSequenceFormatValue", this.self.OSF_Default);
        
        this.set("suppressPurePrimersValue", this.self.SPP_Default);
    }

});
