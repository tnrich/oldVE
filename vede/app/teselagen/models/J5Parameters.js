/**
 * @class Teselagen.models.J5Parameters
 * Class describing J5Parameters.
 * Creating a J5Parameters results in default values, regardless if parameters are included as seen in:
 *          Ext.create("Teselagen.models.J5Parameters", {PARAMETERS}).
 * User must specify non-default values by creating the object and calling:
 *          j5param = Ext.create("Teselagen.models.J5Parameters");
 *          j5param.set("FILEDNAME", newParameter);
 *
 * Originally J5Parameters.as and J5ParametersProxy.as
 *
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.models.J5Parameters", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.constants.Constants",
        "Ext.data.JsonStore"
    ],

    proxy: {
        type: "memory",
        reader: {type: "json"}
    },

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
        SPA:        "SUPPRESS_PRIMER_ANNOTATIONS",
        HMLB:        "HOMOLOGY_MIN_LENGTH_BPS",
        HMFM:        "HOMOLOGY_MAX_FRACTION_MISMATCHES",
        
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
        SPA_DESC:       "\"Suppress primer annotations. Options are: \"\"TRUE\"\" or \"\"FALSE\"\"\"",
        
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
        SPA_Default:            false,

        HMLB_Default:           26,
        HMFM_Default:           0.05,
        
        //combobox choices data providers
        //outputSequenceFormatOptions:   [Teselagen.constants.Constants.self.GENBANK, Teselagen.constants.Constants.self.FASTA, Teselagen.constants.Constants.self.JBEI_SEQ, Teselagen.constants.Constants.self.SBOL_XML],
        booleanOptions:         [false, true]
    },

    /**
     * Input parameters:
     * J5 Parameter Values. Default values DO NOT SET when creating this obect
     * FIX ME!!! COPY THE CONVERT STATMENTS AS SEEN IN DOWNSTREAMAUTOMATIONPARAMETERS
     */
    fields: [
        {name: "id", type: "long"},
        {name: "j5run_id", type: "long"},
        {name: "masterOligoNumberOfDigitsValue",                   type: "int",        defaultValue: this.self.MONOD_Default},
        {name: "masterPlasmidNumberOfDigitsValue",                 type: "int",        defaultValue: this.self.MPNOD_Default},
        {name: "gibsonOverlapBPsValue",                            type: "int",        defaultValue: this.self.GOB_Default},
        {name: "gibsonOverlapMinTmValue",                          type: "Float",      defaultValue: this.self.GOMT_Default},
        {name: "gibsonOverlapMaxTmValue",                          type: "Float",      defaultValue: this.self.MOLB_Default},

        {name: "maxOligoLengthBPsValue",                           type: "int",        defaultValue: this.self.MFSGB_Default},
        {name: "minFragmentSizeGibsonBPsValue",                    type: "int",        defaultValue: this.self.GGOHB_Default},
        {name: "goldenGateOverhangBPsValue",                       type: "int",        defaultValue: this.self.GGRS_Default},
        {name: "goldenGateRecognitionSeqValue",                    type: "String",     defaultValue: this.self.GGTES_Default},
        {name: "goldenGateTerminiExtraSeqValue",                   type: "String",     defaultValue: this.self.GGTES_Default},

        {name: "maxIdentitiesGoldenGateOverhangsCompatibleValue",  type: "int",        defaultValue: this.self.MIGGOC_Default},
        {name: "oligoSynthesisCostPerBPUSDValue",                  type: "Float",      defaultValue: this.self.OSCPB_Default},
        {name: "oligoPagePurificationCostPerPieceUSDValue",        type: "Float",      defaultValue: this.self.OPPCPP_Default},
        {name: "oligoMaxLengthNoPagePurificationRequiredBPsValue", type: "int",        defaultValue: this.self.OMLPPRB_Default},
        {name: "minPCRProductBPsValue",                            type: "int",        defaultValue: this.self.MPPB_Default},

        {name: "directSynthesisCostPerBPUSDValue",                 type: "Float",      defaultValue: this.self.DSCPB_Default},
        {name: "directSynthesisMinCostPerPieceUSDValue",           type: "Float",      defaultValue: this.self.DSMCPP_Default},
        {name: "primerGCClampValue",                               type: "int",        defaultValue: this.self.PGC_Default},
        {name: "primerMinSizeValue",                               type: "int",        defaultValue: this.self.PMS_Default},
        {name: "primerMaxSizeValue",                               type: "int",        defaultValue: this.self.PMAXS_Default},

        {name: "primerMinTmValue",                                 type: "Float",      defaultValue: this.self.PMT_Default},
        {name: "primerMaxTmValue",                                 type: "Float",      defaultValue: this.self.PMAXT_Default},
        {name: "primerMaxDiffTmValue",                             type: "Float",      defaultValue: this.self.PMDT_Default},
        {name: "primerMaxSelfAnyThValue",                          type: "int",        defaultValue: this.self.PMSAT_Default},
        {name: "primerMaxSelfEndThValue",                          type: "int",        defaultValue: this.self.PMSET_Default},

        {name: "primerPairMaxComplAnyThValue",                     type: "int",        defaultValue: this.self.PPMCAT_Default},
        {name: "primerPairMaxComplEndThValue",                     type: "int",        defaultValue: this.self.PPMCET_Default},
        {name: "primerTmSantaluciaValue",                          type: "Boolean",    defaultValue: this.self.PTS_Default},
        {name: "primerSaltCorrectionsValue",                       type: "Boolean",    defaultValue: this.self.PSC_Default},
        {name: "primerDnaConcValue",                               type: "int",        defaultValue: this.self.PDC_Default},

        {name: "mispriming3PrimeBoundaryBPToWarnIfHitValue",       type: "int",        defaultValue: this.self.M3BBTWIH_Default},
        {name: "misprimingMinTmValue",                             type: "Float",      defaultValue: this.self.MMT_Default},
        {name: "misprimingSaltConcValue",                          type: "Float",      defaultValue: this.self.MSC_Default},
        {name: "misprimingOligoConcValue",                         type: "Float",      defaultValue: this.self.MOC_Default},
        {name: "outputSequenceFormatValue",                        type: "String",     defaultValue: this.self.OSF_Default},

        {name: "suppressPurePrimersValue",                         type: "Boolean",    defaultValue: this.self.SPP_Default,
         convert: function(value, record) {
             if(Ext.isBoolean(value)) {
                 return value;
             } else if(Ext.isString(value)) {
                 return (/^(true|1)$/i).test(value);
             } else {
                 return false;
             }
         }
        },
        {name: "suppressPrimerAnnotationsValue",                   type: "Boolean",    defaultValue: this.self.SPA_Default,
         convert: function(value, record) {
             if(Ext.isBoolean(value)) {
                 return value;
             } else if(Ext.isString(value)) {
                 return (/^(true|1)$/i).test(value);
             } else {
                 return false;
             }
         }
        },

        {name: "homologyMinLengthBPS",                              type: "int",      defaultValue: this.self.HMLB_Default},
        {name: "homologyMaxFractionMisMatches",                     type: "Float",    defaultValue: this.self.HMFM_Default},
       

    ],

    validation: [
    ],

    associations: [
        {
            type: "belongsTo",
            model: "Teselagen.models.J5Run",
            getterName: "getJ5Run",
            setterName: "setJ5Run",
            associationKey: "j5run",
            foreignKey: "j5run_id"
        }
    ],

    // Need this because fields:[] does not actually set the defaults!
    // Keep the inputted values if they are not undefined
    init: function() {
        //console.log("init J5 Param");
        //console.log(this.data);

        /*if (this.get("masterOligoNumberOfDigitsValue") === undefined) {
            this.set("masterOligoNumberOfDigitsValue", this.self.MONOD_Default);
        }*/
        //console.log(Teselagen.constants.Constants.self.GENBANK);
        //this.setDefaultValues();
    },

    loadValues: function(values) {

        /*
        ASSEMBLY_PRODUCT_TYPE                              
        DIRECTSYNTHESISCOSTPERBPUSD                           ok
        DIRECTSYNTHESISMINIUMUMCOSTPERPIECEUSD                wrong field name DIRECTSYNTHESISMINCOSTPERPIECEUSD
        GIBSONOVERLAPBPS                                      ok
        GIBSONOVERLAPMAXTM                                    ok
        GIBSONOVERLAPMINTM                                    ok
        GOLDENGATEOVERHANGBPS                                 ok
        GOLDENGATERECOGNITIONSEQ                              ok
        GOLDENGATETERMINIEXTRASEQ                             ok
        MASTEROLIGONUMBEROFDIGITS                             ok
        MASTERPLASMIDNUMBEROFDIGITS                           ok
        MAXIMUMOLIGOLENGTHBPS                                 wrong field name MAXOLIGOLENGTHBPS
        MAXIMUM_IDENTITIES_GOLDEN_GATE_OVERHANGS_COMPATIBLE   wrong field name MAXIDENTITIESGOLDENGATEOVERHANGSCOMPATIBLE
        MINIMUMFRAGMENTSIZEGIBSONBPS                          wrong field name MINFRAGMENTSIZEGIBSONBPS
        MINIMUMPCRPRODUCTBPS                                  wrong field name MINPCRPRODUCTBPS
        MISPRIMING_3PRIME_BOUNDARY_BP_TO_WARN_IF_HIT          wrong field name MISPRIMING3PRIMEBOUNDARYBPTOWARNIFHIT
        MISPRIMING_MIN_TM                                     wrong field name MISPRIMINGMINTM
        MISPRIMING_OLIGO_CONC                                 wrong field name MISPRIMINGOLIGOCONC
        MISPRIMING_SALT_CONC                                  wrong field name MISPRIMINGSALTCONC
        OLIGOMAXLENGTHNOPAGEPURIFICATIONREQUIREDBPS           ok
        OLIGOPAGEPURIFICATIONCOSTPERPIECEUSD                  ok
        OLIGOSYNTHESISCOSTPERBPUSD                            ok
        OUTPUT_SEQUENCE_FORMAT                                wrong field name OUTPUTSEQUENCEFORMAT
        PRIMER_DNA_CONC                                       wrong field name PRIMERDNACONC
        PRIMER_GC_CLAMP                                       wrong field name PRIMERGCCLAMP
        PRIMER_MAX_DIFF_TM                                    wrong field name PRIMERMAXDIFFTM
        PRIMER_MAX_SELF_ANY_TH                                wrong field name PRIMERMAXSELFANYTH
        PRIMER_MAX_SELF_END_TH                                wrong field name PRIMERMAXSELFENDTH
        PRIMER_MAX_SIZE                                       wrong field name PRIMERMAXSIZE
        PRIMER_MAX_TM                                         wrong field name PRIMERMAXTM
        PRIMER_MIN_SIZE                                       wrong field name PRIMERMINSIZE
        PRIMER_MIN_TM                                         wrong field name PRIMERMINTM
        PRIMER_PAIR_MAX_COMPL_ANY_TH                          wrong field name PRIMERPAIRMAXCOMPLANYTH
        PRIMER_PAIR_MAX_COMPL_END_TH                          wrong field name PRIMERPAIRMAXCOMPLENDTH
        PRIMER_SALT_CORRECTIONS                               wrong field name PRIMERSALTCORRECTIONS
        PRIMER_TM_SANTALUCIA                                  wrong field name PRIMERTMSANTALUCIA
        SUPPRESS_PURE_PRIMERS                                 wrong field name SPP_DEFAULT
        */

        if(values.MASTEROLIGONUMBEROFDIGITS                            ) this.set("masterOligoNumberOfDigitsValue" , values.MASTEROLIGONUMBEROFDIGITS            );
        if(values.MASTERPLASMIDNUMBEROFDIGITS                          ) this.set("masterPlasmidNumberOfDigitsValue" , values.MASTERPLASMIDNUMBEROFDIGITS          );
        if(values.GIBSONOVERLAPBPS                                     ) this.set("gibsonOverlapBPsValue" , values.GIBSONOVERLAPBPS                     );
        if(values.GIBSONOVERLAPMINTM                                   ) this.set("gibsonOverlapMinTmValue" , values.GIBSONOVERLAPMINTM                   );
        if(values.GIBSONOVERLAPMAXTM                                   ) this.set("gibsonOverlapMaxTmValue" , values.GIBSONOVERLAPMAXTM                   );
        if(values.MAXIMUMOLIGOLENGTHBPS                                ) this.set("maxOligoLengthBPsValue" , values.MAXIMUMOLIGOLENGTHBPS                    );
        if(values.MINIMUMFRAGMENTSIZEGIBSONBPS                         ) this.set("minFragmentSizeGibsonBPsValue" , values.MINIMUMFRAGMENTSIZEGIBSONBPS             );
        if(values.GOLDENGATEOVERHANGBPS                                ) this.set("goldenGateOverhangBPsValue" , values.GOLDENGATEOVERHANGBPS                );
        if(values.GOLDENGATERECOGNITIONSEQ                             ) this.set("goldenGateRecognitionSeqValue" , values.GOLDENGATERECOGNITIONSEQ             );
        if(values.GOLDENGATETERMINIEXTRASEQ                            ) this.set("goldenGateTerminiExtraSeqValue" , values.GOLDENGATETERMINIEXTRASEQ            );
        if(values.MAXIMUM_IDENTITIES_GOLDEN_GATE_OVERHANGS_COMPATIBLE  ) this.set("maxIdentitiesGoldenGateOverhangsCompatible" , values.MAXIMUM_IDENTITIES_GOLDEN_GATE_OVERHANGS_COMPATIBLE);
        if(values.OLIGOSYNTHESISCOSTPERBPUSD                           ) this.set("oligoSynthesisCostPerBPUSDValue" , values.OLIGOSYNTHESISCOSTPERBPUSD           );
        if(values.OLIGOPAGEPURIFICATIONCOSTPERPIECEUSD                 ) this.set("oligoPagePurificationCostPerPieceUSDValue" , values.OLIGOPAGEPURIFICATIONCOSTPERPIECEUSD );
        if(values.OLIGOMAXLENGTHNOPAGEPURIFICATIONREQUIREDBPS          ) this.set("oligoMaxLengthNoPagePurificationRequiredBP" , values.OLIGOMAXLENGTHNOPAGEPURIFICATIONREQUIREDBP);
        if(values.MINIMUMPCRPRODUCTBPS                                 ) this.set("minPCRProductBPsValue" , values.MINIMUMPCRPRODUCTBPS                     );
        if(values.DIRECTSYNTHESISCOSTPERBPUSD                          ) this.set("directSynthesisCostPerBPUSDValue" , values.DIRECTSYNTHESISCOSTPERBPUSD          );
        if(values.DIRECTSYNTHESISMINIUMUMCOSTPERPIECEUSD               ) this.set("directSynthesisMinCostPerPieceUSDValue" , values.DIRECTSYNTHESISMINIUMUMCOSTPERPIECEUSD    );
        if(values.PRIMER_GC_CLAMP                                      ) this.set("primerGCClampValue" , values.PRIMER_GC_CLAMP                        );
        if(values.PRIMER_MIN_SIZE                                      ) this.set("primerMinSizeValue" , values.PRIMER_MIN_SIZE                        );
        if(values.PRIMER_MAX_SIZE                                      ) this.set("primerMaxSizeValue" , values.PRIMER_MAX_SIZE                        );
        if(values.PRIMER_MIN_TM                                        ) this.set("primerMinTmValue" , values.PRIMER_MIN_TM                          );
        if(values.PRIMER_MAX_TM                                        ) this.set("primerMaxTmValue" , values.PRIMER_MAX_TM                          );
        if(values.PRIMER_MAX_DIFF_TM                                   ) this.set("primerMaxDiffTmValue" , values.PRIMER_MAX_DIFF_TM                      );
        if(values.PRIMER_MAX_SELF_ANY_TH                               ) this.set("primerMaxSelfAnyThValue" , values.PRIMER_MAX_SELF_ANY_TH                   );
        if(values.PRIMER_MAX_SELF_END_TH                               ) this.set("primerMaxSelfEndThValue" , values.PRIMER_MAX_SELF_END_TH                   );
        if(values.PRIMER_PAIR_MAX_COMPL_ANY_TH                         ) this.set("primerPairMaxComplAnyThValue" , values.PRIMER_PAIR_MAX_COMPL_ANY_TH              );
        if(values.PRIMER_PAIR_MAX_COMPL_END_TH                         ) this.set("primerPairMaxComplEndThValue" , values.PRIMER_PAIR_MAX_COMPL_END_TH              );
        if(values.PRIMER_TM_SANTALUCIA                                 ) this.set("primerTmSantaluciaValue" , values.PRIMER_TM_SANTALUCIA                   );
        if(values.PRIMER_SALT_CORRECTIONS                              ) this.set("primerSaltCorrectionsValue" , values.PRIMER_SALT_CORRECTIONS                );
        if(values.PRIMER_DNA_CONC                                      ) this.set("primerDnaConcValue" , values.PRIMER_DNA_CONC                        );
        if(values.MISPRIMING_3PRIME_BOUNDARY_BP_TO_WARN_IF_HIT         ) this.set("mispriming3PrimeBoundaryBPToWarnIfHitValue" , values.MISPRIMING_3PRIME_BOUNDARY_BP_TO_WARN_IF_HIT);
        if(values.MISPRIMING_MIN_TM                                    ) this.set("misprimingMinTmValue" , values.MISPRIMING_MIN_TM                      );
        if(values.MISPRIMING_SALT_CONC                                 ) this.set("misprimingSaltConcValue" , values.MISPRIMING_SALT_CONC                   );
        if(values.MISPRIMING_OLIGO_CONC                                ) this.set("misprimingOligoConcValue" , values.MISPRIMING_OLIGO_CONC                  );
        if(values.OUTPUT_SEQUENCE_FORMAT                               ) this.set("outputSequenceFormatValue" , values.OUTPUT_SEQUENCE_FORMAT                 );
        if(values.SUPPRESS_PURE_PRIMERS                                ) this.set("suppressPurePrimersValue" , values.SUPPRESS_PURE_PRIMERS                               );
        if(values.SUPPRESS_PRIMER_ANNOTATIONS                          ) this.set("suppressPrimerAnnotationsValue" , values.SUPPRESS_PRIMER_ANNOTATIONS                              );

        if(values.HOMOLOGY_MIN_LENGTH_BPS                              ) this.set("homologyMinLengthBPS" , values.HOMOLOGY_MIN_LENGTH_BPS                               );
        if(values.HOMOLOGY_MAX_FRACTION_MISMATCHES                     ) this.set("homologyMaxFractionMisMatches" , values.HOMOLOGY_MAX_FRACTION_MISMATCHES                               );
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
        this.set("suppressPrimerAnnotationsValue", this.self.SPA_Default);

        this.set("homologyMinLengthBPS", this.self.HMLB_Default);
        this.set("homologyMaxFractionMisMatches", this.self.HMFM_Default);

    },

    /**
     * Creates the J5Parameters String
     * @param {String} isCollectionCircular circular or linear
     * @returns {String} j5String
     */
    createJ5ParametersString: function(isCollectionCircular) {
        var returnString = "Parameter Name,Value,Default Value,Description\n" +
            this.self.MONOD + "," + this.get("masterOligoNumberOfDigitsValue") + "," + this.self.MONOD_Default + "," + this.self.MONOD_DESC + "\n" +
            this.self.MPNOD + "," + this.get("masterPlasmidNumberOfDigitsValue") + "," + this.self.MPNOD_Default + "," + this.self.MPNOD_DESC + "\n" +
            this.self.GOB + "," + this.get("gibsonOverlapBPsValue") + "," + this.self.GOB_Default + "," + this.self.GOB_DESC + "\n" +
            this.self.GOMT + "," + this.get("gibsonOverlapMinTmValue") + "," + this.self.GOMT_Default + "," + this.self.GOMT_DESC + "\n" +
            this.self.GOMAXT + "," + this.get("gibsonOverlapMaxTmValue") + "," + this.self.GOMAXT_Default + "," + this.self.GOMAXT_DESC + "\n" +
            this.self.MOLB + "," + this.get("maxOligoLengthBPsValue") + "," + this.self.MOLB_Default + "," + this.self.MOLB_DESC + "\n" +
            this.self.MFSGB + "," + this.get("minFragmentSizeGibsonBPsValue") + "," + this.self.MFSGB_Default + "," + this.self.MFSGB_DESC + "\n" +
            this.self.GGOHB + "," + this.get("goldenGateOverhangBPsValue") + "," + this.self.GGOHB_Default + "," + this.self.GGOHB_DESC + "\n" +
            this.self.GGRS + "," + this.get("goldenGateRecognitionSeqValue") + "," + this.self.GGRS_Default + "," + this.self.GGRS_DESC + "\n" +
            this.self.GGTES + "," + this.get("goldenGateTerminiExtraSeqValue") + "," + this.self.GGTES_Default + "," + this.self.GGTES_DESC + "\n" +
            this.self.MIGGOC + "," + this.get("maxIdentitiesGoldenGateOverhangsCompatibleValue") + "," + this.self.MIGGOC_Default + "," + this.self.MIGGOC_DESC + "\n" +
            this.self.OSCPB + "," + this.get("oligoSynthesisCostPerBPUSDValue") + "," + this.self.OSCPB_Default + "," + this.self.OSCPB_DESC + "\n" +
            this.self.OPPCPP + "," + this.get("oligoPagePurificationCostPerPieceUSDValue") + "," + this.self.OPPCPP_Default + "," + this.self.OPPCPP_DESC + "\n" +
            this.self.OMLPPRB + "," + this.get("oligoMaxLengthNoPagePurificationRequiredBPsValue") + "," + this.self.OMLPPRB_Default + "," + this.self.OMLPPRB_DESC + "\n" +
            this.self.MPPB + "," + this.get("minPCRProductBPsValue") + "," + this.self.MPPB_Default + "," + this.self.MPPB_DESC + "\n" +
            this.self.DSCPB + "," + this.get("directSynthesisCostPerBPUSDValue") + "," + this.self.DSCPB_Default + "," + this.self.DSCPB_DESC + "\n" +
            this.self.DSMCPP + "," + this.get("directSynthesisMinCostPerPieceUSDValue") + "," + this.self.DSMCPP_Default + "," + this.self.DSMCPP_DESC + "\n" +
            this.self.PGC + "," + this.get("primerGCClampValue") + "," + this.self.PGC_Default + "," + this.self.PGC_DESC + "\n" +
            this.self.PMS + "," + this.get("primerMinSizeValue") + "," + this.self.PMS_Default + "," + this.self.PMS_DESC + "\n" +
            this.self.PMAXS + "," + this.get("primerMaxSizeValue") + "," + this.self.PMAXS_Default + "," + this.self.PMAXS_DESC + "\n" +
            this.self.PMT + "," + this.get("primerMinTmValue") + "," + this.self.PMT_Default + "," + this.self.PMT_DESC + "\n" +
            this.self.PMAXT + "," + this.get("primerMaxTmValue") + "," + this.self.PMAXT_Default + "," + this.self.PMAXT_DESC + "\n" +
            this.self.PMDT + "," + this.get("primerMaxDiffTmValue") + "," + this.self.PMDT_Default + "," + this.self.PMDT_DESC + "\n" +
            this.self.PMSAT + "," + this.get("primerMaxSelfAnyThValue") + "," + this.self.PMSAT_Default + "," + this.self.PMSAT_DESC + "\n" +
            this.self.PMSET + "," + this.get("primerMaxSelfEndThValue") + "," + this.self.PMSET_Default + "," + this.self.PMSET_DESC + "\n" +
            this.self.PPMCAT + "," + this.get("primerPairMaxComplAnyThValue") + "," + this.self.PPMCAT_Default + "," + this.self.PPMCAT_DESC + "\n" +
            this.self.PPMCET + "," + this.get("primerPairMaxComplEndThValue") + "," + this.self.PPMCET_Default + "," + this.self.PPMCET_DESC + "\n" +
            this.self.PTS + "," + (this.get("primerTmSantaluciaValue") /*? "1" : "0"*/) + "," + (this.self.PTS_Default ? "1" : "0") + "," + this.self.PTS_DESC + "\n" +
            this.self.PSC + "," + (this.get("primerSaltCorrectionsValue") /*? "1" : "0"*/) + "," + (this.self.PSC_Default /*? "1" : "0"*/) + "," + this.self.PSC_DESC + "\n" +
            this.self.PDC + "," + this.get("primerDnaConcValue") + "," + this.self.PDC_Default + "," + this.self.PDC_DESC + "\n" +
            this.self.M3BBTWIH + "," + this.get("mispriming3PrimeBoundaryBPToWarnIfHitValue") + "," + this.self.M3BBTWIH_Default + "," + this.self.M3BBTWIH_DESC + "\n" +
            this.self.MMT + "," + this.get("misprimingMinTmValue") + "," + this.self.MMT_Default + "," + this.self.MMT_DESC + "\n" +
            this.self.MSC + "," + this.get("misprimingSaltConcValue") + "," + this.self.MSC_Default + "," + this.self.MSC_DESC + "\n" +
            this.self.MOC + "," + this.get("misprimingOligoConcValue") + "," + this.self.MOC_Default + "," + this.self.MOC_DESC + "\n" +
            this.self.OSF + "," + this.get("outputSequenceFormatValue") + "," + this.self.OSF_Default + "," + this.self.OSF_DESC + "\n" +

            //+ this.self.APT + "," + (j5CollectionProxy.isCollectionCircular() ? Constants.CIRCULAR : Constants.LINEAR) + "," + Constants.CIRCULAR + "," + this.self.APT_DESC + "\n"
            this.self.APT + "," + isCollectionCircular + "," + Teselagen.constants.Constants.self.CIRCULAR + "," + this.self.APT_DESC + "\n" +

            //+ this.self.SPP + "," + (this.get("suppressPurePrimersValue") ? "TRUE" : "FALSE") + "," + (this.self.SPP_Default ? "TRUE" : "FALSE") + "," + J5Parameters.SPP_DESC + "\n";
            this.self.SPP + "," + this.get("suppressPurePrimersValue") + "," + this.self.SPP_Default + "," + this.self.SPP_DESC + "\n";
            this.self.SPA + "," + this.get("suppressPrimerAnnotationsValue") + "," + this.self.SPA_Default + "," + this.self.SPA_DESC + "\n";

            this.self.HMLB + "," + this.get("homologyMinLengthBPS") + "," + this.self.HMLB_Default+"\n";
            this.self.HMFM + "," + this.get("homologyMaxFractionMisMatches") + "," + this.self.HMFM_Default +"\n";

            return returnString;
    },

    getArrayParameters: function(){
        var arr = [];

        arr.push( { value: this.get("masterOligoNumberOfDigitsValue"), name: "masterOligoNumberOfDigitsValue" } );
        arr.push( { value: this.get("masterPlasmidNumberOfDigitsValue"), name: "masterPlasmidNumberOfDigitsValue" } );
        arr.push( { value: this.get("gibsonOverlapBPsValue"              ), name: "gibsonOverlapBPsValue"               } );
        arr.push( { value: this.get("gibsonOverlapMinTmValue"), name: "gibsonOverlapMinTmValue" } );
        arr.push( { value: this.get("gibsonOverlapMaxTmValue"), name: "gibsonOverlapMaxTmValue" } );
        arr.push( { value: this.get("maxOligoLengthBPsValue"), name: "maxOligoLengthBPsValue" } );
        arr.push( { value: this.get("minFragmentSizeGibsonBPsValue"), name: "minFragmentSizeGibsonBPsValue" } );
        arr.push( { value: this.get("goldenGateOverhangBPsValue"), name: "goldenGateOverhangBPsValue" } );
        arr.push( { value: this.get("goldenGateRecognitionSeqValue"), name: "goldenGateRecognitionSeqValue" } );
        arr.push( { value: this.get("goldenGateTerminiExtraSeqValue"), name: "goldenGateTerminiExtraSeqValue" } );
        arr.push( { value: this.get("maxIdentitiesGoldenGateOverhangsCompatibleValue"), name: "maxIdentitiesGoldenGateOverhangsCompatibleValue" } );
        arr.push( { value: this.get("oligoSynthesisCostPerBPUSDValue"  ), name: "oligoSynthesisCostPerBPUSDValue"   } );
        arr.push( { value: this.get("oligoPagePurificationCostPerPieceUSDValue"), name: "oligoPagePurificationCostPerPieceUSDValue" } );
        arr.push( { value: this.get("oligoMaxLengthNoPagePurificationRequiredBPsValue"), name: "oligoMaxLengthNoPagePurificationRequiredBPsValue" } );
        arr.push( { value: this.get("minPCRProductBPsValue"), name: "minPCRProductBPsValue" } );
        arr.push( { value: this.get("directSynthesisCostPerBPUSDValue"), name: "directSynthesisCostPerBPUSDValue" } );
        arr.push( { value: this.get("directSynthesisMinCostPerPieceUSDValue"), name: "directSynthesisMinCostPerPieceUSDValue" } );
        arr.push( { value: this.get("primerGCClampValue"), name: "primerGCClampValue" } );
        arr.push( { value: this.get("primerMinSizeValue"), name: "primerMinSizeValue" } );
        arr.push( { value: this.get("primerMaxSizeValue"), name: "primerMaxSizeValue" } );
        arr.push( { value: this.get("primerMinTmValue"), name: "primerMinTmValue" } );
        arr.push( { value: this.get("primerMaxTmValue"), name: "primerMaxTmValue" } );
        arr.push( { value: this.get("primerMaxDiffTmValue"), name: "primerMaxDiffTmValue" } );
        arr.push( { value: this.get("primerMaxSelfAnyThValue"), name: "primerMaxSelfAnyThValue" } );
        arr.push( { value: this.get("primerMaxSelfEndThValue"), name: "primerMaxSelfEndThValue" } );
        arr.push( { value: this.get("primerPairMaxComplAnyThValue"), name: "primerPairMaxComplAnyThValue" } );
        arr.push( { value: this.get("primerPairMaxComplEndThValue"), name: "primerPairMaxComplEndThValue" } );
        arr.push( { value: this.get("primerTmSantaluciaValue"), name: "primerTmSantaluciaValue" } );
        arr.push( { value: this.get("primerSaltCorrectionsValue"), name: "primerSaltCorrectionsValue" } );
        arr.push( { value: this.get("primerDnaConcValue"                      ), name: "primerDnaConcValue"                       } );
        arr.push( { value: this.get("mispriming3PrimeBoundaryBPToWarnIfHitValue"), name: "mispriming3PrimeBoundaryBPToWarnIfHitValue" } );
        arr.push( { value: this.get("misprimingMinTmValue"     ), name: "misprimingMinTmValue"      } );
        arr.push( { value: this.get("misprimingSaltConcValue"), name: "misprimingSaltConcValue" } );
        arr.push( { value: this.get("misprimingOligoConcValue"), name: "misprimingOligoConcValue" } );
        arr.push( { value: this.get("outputSequenceFormatValue"), name: "outputSequenceFormatValue" } );
        arr.push( { value: this.get("suppressPurePrimersValue"), name: "suppressPurePrimersValue" } );
        arr.push( { value: this.get("suppressPrimerAnnotationsValue"), name: "suppressPrimerAnnotationsValue" } );

        arr.push( { value: this.get("homologyMinLengthBPS"), name: "homologyMinLengthBPS" } );
        arr.push( { value: this.get("homologyMaxFractionMisMatches"), name: "homologyMaxFractionMisMatches" } );
        
        return arr;
    },

    getParametersAsStore: function(){
        var self = this;
        var store = new Ext.data.JsonStore({
            proxy: {
                type: 'memory',
                data: self.getArrayParameters(),
                reader: {
                    type: 'json',
                    root: 'files'
                }
            },

            fields: ['name','value']
        });
        store.load();

        return store;
    },

    /**
     * Creates the J5Parameters Array
     * @returns {String} Array of Parameters
     */
    getParametersAsArray: function(isCollectionCircular) {
        var obj = {};
        obj[this.self.MONOD]    =   this.get("masterOligoNumberOfDigitsValue");
        obj[this.self.MPNOD]    =   this.get("masterPlasmidNumberOfDigitsValue");
        obj[this.self.GOB]      =   this.get("gibsonOverlapBPsValue"              );
        obj[this.self.GOMT]     =   this.get("gibsonOverlapMinTmValue");
        obj[this.self.GOMAXT]   =   this.get("gibsonOverlapMaxTmValue");
        obj[this.self.MOLB]     =   this.get("maxOligoLengthBPsValue");
        obj[this.self.MFSGB]    =   this.get("minFragmentSizeGibsonBPsValue");
        obj[this.self.GGOHB]    =   this.get("goldenGateOverhangBPsValue");
        obj[this.self.GGRS]     =   this.get("goldenGateRecognitionSeqValue");
        obj[this.self.GGTES]    =   this.get("goldenGateTerminiExtraSeqValue");
        obj[this.self.MIGGOC]   =   this.get("maxIdentitiesGoldenGateOverhangsCompatibleValue");
        obj[this.self.OSCPB]    =   this.get("oligoSynthesisCostPerBPUSDValue"  );
        obj[this.self.OPPCPP]   =   this.get("oligoPagePurificationCostPerPieceUSDValue");
        obj[this.self.OMLPPRB]  =   this.get("oligoMaxLengthNoPagePurificationRequiredBPsValue");
        obj[this.self.MPPB]     =   this.get("minPCRProductBPsValue");
        obj[this.self.DSCPB]    =   this.get("directSynthesisCostPerBPUSDValue");
        obj[this.self.DSMCPP]   =   this.get("directSynthesisMinCostPerPieceUSDValue");
        obj[this.self.PGC]      =   this.get("primerGCClampValue");
        obj[this.self.PMS]      =   this.get("primerMinSizeValue");
        obj[this.self.PMAXS]    =   this.get("primerMaxSizeValue");
        obj[this.self.PMT]      =   this.get("primerMinTmValue");
        obj[this.self.PMAXT]    =   this.get("primerMaxTmValue");
        obj[this.self.PMDT]     =   this.get("primerMaxDiffTmValue");
        obj[this.self.PMSAT]    =   this.get("primerMaxSelfAnyThValue");
        obj[this.self.PMSET]    =   this.get("primerMaxSelfEndThValue");
        obj[this.self.PPMCAT]   =   this.get("primerPairMaxComplAnyThValue");
        obj[this.self.PPMCET]   =   this.get("primerPairMaxComplEndThValue");
        obj[this.self.PTS]      =   this.get("primerTmSantaluciaValue");
        obj[this.self.PSC]      =   this.get("primerSaltCorrectionsValue");
        obj[this.self.PDC]      =   this.get("primerDnaConcValue"                      );
        obj[this.self.M3BBTWIH] =   this.get("mispriming3PrimeBoundaryBPToWarnIfHitValue");
        obj[this.self.MMT]      =   this.get("misprimingMinTmValue"     );
        obj[this.self.MSC]      =   this.get("misprimingSaltConcValue");
        obj[this.self.MOC]      =   this.get("misprimingOligoConcValue");
        obj[this.self.OSF]      =   this.get("outputSequenceFormatValue");
        obj[this.self.SPP]      =   this.get("suppressPurePrimersValue");
        obj[this.self.SPA]      =   this.get("suppressPrimerAnnotationsValue");
        obj[this.self.APT]      =   isCollectionCircular ? "circular" : "linear";

        obj[this.self.HMLB]      =   this.get("homologyMinLengthBPS");
        obj[this.self.HMFM]      =   this.get("homologyMaxFractionMisMatches");

        return obj;
    }
});
