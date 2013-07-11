package org.jbei.registry.models
{
    import org.jbei.registry.Constants;

    public class J5Parameters
    {
        //parameter names
        public static const MONOD:String = "MASTEROLIGONUMBEROFDIGITS";
        public static const MPNOD:String = "MASTERPLASMIDNUMBEROFDIGITS";
        public static const GOB:String = "GIBSONOVERLAPBPS";
        public static const GOMT:String = "GIBSONOVERLAPMINTM";
        public static const GOMAXT:String = "GIBSONOVERLAPMAXTM";
        public static const MOLB:String = "MAXIMUMOLIGOLENGTHBPS";
        public static const MFSGB:String = "MINIMUMFRAGMENTSIZEGIBSONBPS";
        public static const GGOHB:String = "GOLDENGATEOVERHANGBPS";
        public static const GGRS:String = "GOLDENGATERECOGNITIONSEQ";
        public static const GGTES:String = "GOLDENGATETERMINIEXTRASEQ";
        public static const MIGGOC:String = "MAXIMUM_IDENTITIES_GOLDEN_GATE_OVERHANGS_COMPATIBLE";
        public static const OSCPB:String = "OLIGOSYNTHESISCOSTPERBPUSD";
        public static const OPPCPP:String = "OLIGOPAGEPURIFICATIONCOSTPERPIECEUSD";
        public static const OMLPPRB:String = "OLIGOMAXLENGTHNOPAGEPURIFICATIONREQUIREDBPS";
        public static const MPPB:String = "MINIMUMPCRPRODUCTBPS";
        public static const DSCPB:String = "DIRECTSYNTHESISCOSTPERBPUSD";
        public static const DSMCPP:String = "DIRECTSYNTHESISMINIUMUMCOSTPERPIECEUSD";
        public static const PGC:String = "PRIMER_GC_CLAMP";
        public static const PMS:String = "PRIMER_MIN_SIZE";
        public static const PMAXS:String = "PRIMER_MAX_SIZE";
        public static const PMT:String = "PRIMER_MIN_TM";
        public static const PMAXT:String = "PRIMER_MAX_TM";
        public static const PMDT:String = "PRIMER_MAX_DIFF_TM";
        public static const PMSAT:String = "PRIMER_MAX_SELF_ANY_TH";
        public static const PMSET:String = "PRIMER_MAX_SELF_END_TH";
        public static const PPMCAT:String = "PRIMER_PAIR_MAX_COMPL_ANY_TH";
        public static const PPMCET:String = "PRIMER_PAIR_MAX_COMPL_END_TH";
        public static const PTS:String = "PRIMER_TM_SANTALUCIA";
        public static const PSC:String = "PRIMER_SALT_CORRECTIONS";
        public static const PDC:String = "PRIMER_DNA_CONC";
        public static const M3BBTWIH:String = "MISPRIMING_3PRIME_BOUNDARY_BP_TO_WARN_IF_HIT";
        public static const MMT:String = "MISPRIMING_MIN_TM";
        public static const MSC:String = "MISPRIMING_SALT_CONC";
        public static const MOC:String = "MISPRIMING_OLIGO_CONC";
        public static const OSF:String = "OUTPUT_SEQUENCE_FORMAT";
        public static const APT:String = "ASSEMBLY_PRODUCT_TYPE";
        public static const SPP:String = "SUPPRESS_PURE_PRIMERS";
        
        //parameter descriptions
        public static const MONOD_DESC:String = "The default number of digits used to number an oligo; e.g. j5_00001_primer_description uses 5 digits";
        public static const MPNOD_DESC:String = "The default number of digits used to number a plasmid; e.g. pj5_00001 uses 5 digits";
        public static const GOB_DESC:String = "The minimum number of bps for SLIC/Gibson/CPEC overlaps (should be an even number); this is also the starting design length for the annealing portion of primers";
        public static const GOMT_DESC:String = "The minimum desired Tm for SLIC/Gibson/CPEC overlaps";
        public static const GOMAXT_DESC:String = "The maximum desired Tm for SLIC/Gibson/CPEC overlaps";
        public static const MOLB_DESC:String = "The maximum oligo length to be ordered";
        public static const MFSGB_DESC:String = "The minimum fragment size for SLIC/Gibson assembly";
        public static const GGOHB_DESC:String = "The number of bps of the overhang resulting from the Golden-gate type IIs endonuclease digestion";
        public static const GGRS_DESC:String = "The Golden-gate type IIs endonuclease recognition site sequence";
        public static const GGTES_DESC:String = "The extra 5' sequence required at each end of a Golden-gate assembly piece; e.g. NNNNNNNGGCTCTN for BsaI (Eco31I)";
        public static const MIGGOC_DESC:String = "The maximum number of tolerable non-gapped aligned identities between compatible overhang sequences for Golden-gate assembly";
        public static const OSCPB_DESC:String = "The oligo synthesis cost per bp ($US)";
        public static const OPPCPP_DESC:String = "The PAGE-purification cost per oligo ($US)";
        public static const OMLPPRB_DESC:String = "The maximum oligo length that does not require PAGE-purification";
        public static const MPPB_DESC:String = "The minimum PCR product size";
        public static const DSCPB_DESC:String = "The cost per bp to do direct synthesis ($US)";
        public static const DSMCPP_DESC:String = "The minimum cost of synthesis per piece ($US)";
        public static const PGC_DESC:String = "Primer3 parameter: length of the desired GC clamp (Primer3 default is 0)";
        public static const PMS_DESC:String = "Primer3 parameter: the minimum length of a primer (Primer3 default is 18)";
        public static const PMAXS_DESC:String = "Primer3 parameter: the maximum length of a primer (Primer3 default is 27; maximum is 36)";
        public static const PMT_DESC:String = "Primer3 parameter: the minimum primer Tm (Primer3 default is 57)";
        public static const PMAXT_DESC:String = "Primer3 parameter: the maximum primer Tm (Primer3 default is 63)";
        public static const PMDT_DESC:String = "Primer3 parameter: the maximum primer pair difference in Tm (Primer3 default is 100)";
        public static const PMSAT_DESC:String = "Primer3 parameter: the maximum primer self complementarity (Primer3 default is 47)";
        public static const PMSET_DESC:String = "Primer3 parameter: the maximum primer self end complementarity (Primer3 default is 47)";
        public static const PPMCAT_DESC:String = "Primer3 parameter: the maximum primer pair complementarity (Primer3 default is 47)";
        public static const PPMCET_DESC:String = "Primer3 parameter: the maximum primer pair end complementarity (Primer3 default is 47)";
        public static const PTS_DESC:String = "Primer3 parameter: use the Santalucia formula for calculating Tms (1 = TRUE; 0 = FALSE) (Primer3 default is 0 (FALSE))";
        public static const PSC_DESC:String = "Primer3 parameter: use the salt correction formula for calculating Tms (1 = TRUE; 0 = FALSE) (Primer3 default is 0 (FALSE))";
        public static const PDC_DESC:String = "Primer3 parameter: DNA concentration to use when calculating Tms in micromolar (IDT uses 250; Primer3 default is 50)";
        public static const M3BBTWIH_DESC:String = "Only warn of mispriming if the BLAST hit between the primer and the template contains the 3' end of the primer (within this number of bp)";
        public static const MMT_DESC:String = "The minimum approximate Tm to consider a significant mispriming event";
        public static const MSC_DESC:String = "The salt concentration used when estimating the mispriming Tm in Molar";
        public static const MOC_DESC:String = "The oligo concentration used when estimating the mispriming Tm in Molar";
        public static const OSF_DESC:String = "\"The output sequence file format. Options are: \"\"Genbank\"\", \"\"FASTA\"\", \"\"jbei-seq\"\", or \"\"SBOLXML\"\"\"";
        public static const APT_DESC:String = "\"Determines whether the assembled DNA product will be circular or linear. Options are: \"\"circular\"\" or \"\"linear\"\"\"";
        public static const SPP_DESC:String = "\"Suppress the output of pure primers. Options are: \"\"TRUE\"\" or \"\"FALSE\"\"\"";
        
        //parameter default values
        public static const MONOD_Default:int = 5;
        public static const MPNOD_Default:int = 5;
        public static const GOB_Default:int = 26;
        public static const GOMT_Default:Number = 60;
        public static const GOMAXT_Default:Number = 70;
        public static const MOLB_Default:int = 110;
        public static const MFSGB_Default:int = 250;
        public static const GGOHB_Default:int = 4;
        public static const GGRS_Default:String = "GGTCTC";
        public static const GGTES_Default:String = "CACACCAGGTCTCA";
        public static const MIGGOC_Default:int = 2;
        public static const OSCPB_Default:Number = 0.1;
        public static const OPPCPP_Default:Number = 40;
        public static const OMLPPRB_Default:int = 60;
        public static const MPPB_Default:int = 100;
        public static const DSCPB_Default:Number = 0.39;
        public static const DSMCPP_Default:Number = 159;
        public static const PGC_Default:int = 2;
        public static const PMS_Default:int = 18;
        public static const PMAXS_Default:int = 36;
        public static const PMT_Default:Number = 60;
        public static const PMAXT_Default:Number = 70;
        public static const PMDT_Default:Number = 5;
        public static const PMSAT_Default:int = 47;
        public static const PMSET_Default:int = 47;
        public static const PPMCAT_Default:int = 47;
        public static const PPMCET_Default:int = 47;
        public static const PTS_Default:Boolean = true;
        public static const PSC_Default:Boolean = true;
        public static const PDC_Default:int = 250;
        public static const M3BBTWIH_Default:int = 4;
        public static const MMT_Default:Number = 45;
        public static const MSC_Default:Number = 0.05;
        public static const MOC_Default:Number = 0.00000025;
        public static const OSF_Default:String = Constants.GENBANK;
        public static const SPP_Default:Boolean = true;
        
        //combobox choices data providers
        public static const outputSequenceFormatOptions:Array = [Constants.GENBANK, Constants.FASTA, Constants.JBEI_SEQ, Constants.SBOL_XML];
        public static const booleanOptions:Array = [false, true];
        
        //parameter values
        private var _masterOligoNumberOfDigitsValue:int;
        private var _masterPlasmidNumberOfDigitsValue:int;
        private var _gibsonOverlapBPsValue:int;
        private var _gibsonOverlapMinTmValue:Number;
        private var _gibsonOverlapMaxTmValue:Number;
        private var _maxOligoLengthBPsValue:int;
        private var _minFragmentSizeGibsonBPsValue:int;
        private var _goldenGateOverhangBPsValue:int;
        private var _goldenGateRecognitionSeqValue:String;
        private var _goldenGateTerminiExtraSeqValue:String;
        private var _maxIdentitiesGoldenGateOverhangsCompatibleValue:int;
        private var _oligoSynthesisCostPerBPUSDValue:Number;
        private var _oligoPagePurificationCostPerPieceUSDValue:Number;
        private var _oligoMaxLengthNoPagePurificationRequiredBPsValue:int;
        private var _minPCRProductBPsValue:int;
        private var _directSynthesisCostPerBPUSDValue:Number;
        private var _directSynthesisMinCostPerPieceUSDValue:Number;
        private var _primerGCClampValue:int;
        private var _primerMinSizeValue:int;
        private var _primerMaxSizeValue:int;
        private var _primerMinTmValue:Number;
        private var _primerMaxTmValue:Number;
        private var _primerMaxDiffTmValue:Number;
        private var _primerMaxSelfAnyThValue:int;
        private var _primerMaxSelfEndThValue:int;
        private var _primerPairMaxComplAnyThValue:int;
        private var _primerPairMaxComplEndThValue:int;
        private var _primerTmSantaluciaValue:Boolean;
        private var _primerSaltCorrectionsValue:Boolean;
        private var _primerDnaConcValue:int;
        private var _mispriming3PrimeBoundaryBPToWarnIfHitValue:int;
        private var _misprimingMinTmValue:Number;
        private var _misprimingSaltConcValue:Number;
        private var _misprimingOligoConcValue:Number;
        private var _outputSequenceFormatValue:String;
        private var _suppressPurePrimersValue:Boolean;
        
        // Constructor
        public function J5Parameters()
        {
            setDefaultValues();
        }
        
        // Properties
        public function get masterOligoNumberOfDigitsValue():int
        {
            return _masterOligoNumberOfDigitsValue;
        }
        
        public function set masterOligoNumberOfDigitsValue(i:int):void
        {
            _masterOligoNumberOfDigitsValue = i;
        }
        
        public function get masterPlasmidNumberOfDigitsValue():int
        {
            return _masterPlasmidNumberOfDigitsValue;
        }
        
        public function set masterPlasmidNumberOfDigitsValue(i:int):void
        {
            _masterPlasmidNumberOfDigitsValue = i;
        }
        
        public function get gibsonOverlapBPsValue():int
        {
            return _gibsonOverlapBPsValue;
        }
        
        public function set gibsonOverlapBPsValue(i:int):void
        {
            _gibsonOverlapBPsValue = i;
        }
        
        public function get gibsonOverlapMinTmValue():Number
        {
            return _gibsonOverlapMinTmValue;
        }
        
        public function set gibsonOverlapMinTmValue(n:Number):void
        {
            _gibsonOverlapMinTmValue = n;
        }
        
        public function get gibsonOverlapMaxTmValue():Number
        {
            return _gibsonOverlapMaxTmValue;
        }
        
        public function set gibsonOverlapMaxTmValue(n:Number):void
        {
            _gibsonOverlapMaxTmValue = n;
        }
        
        public function get maxOligoLengthBPsValue():int
        {
            return _maxOligoLengthBPsValue;
        }
        
        public function set maxOligoLengthBPsValue(i:int):void
        {
            _maxOligoLengthBPsValue = i;
        }
        
        public function get minFragmentSizeGibsonBPsValue():int
        {
            return _minFragmentSizeGibsonBPsValue;
        }
        
        public function set minFragmentSizeGibsonBPsValue(i:int):void
        {
            _minFragmentSizeGibsonBPsValue = i;
        }
        
        public function get goldenGateOverhangBPsValue():int
        {
            return _goldenGateOverhangBPsValue;
        }
        
        public function set goldenGateOverhangBPsValue(i:int):void
        {
            _goldenGateOverhangBPsValue = i;
        }
        
        public function get goldenGateRecognitionSeqValue():String
        {
            return _goldenGateRecognitionSeqValue;
        }
        
        public function set goldenGateRecognitionSeqValue(s:String):void
        {
            _goldenGateRecognitionSeqValue = s;
        }
        
        public function get goldenGateTerminiExtraSeqValue():String
        {
            return _goldenGateTerminiExtraSeqValue;
        }
        
        public function set goldenGateTerminiExtraSeqValue(s:String):void
        {
            _goldenGateTerminiExtraSeqValue = s;
        }
        
        public function get maxIdentitiesGoldenGateOverhangsCompatibleValue():int
        {
            return _maxIdentitiesGoldenGateOverhangsCompatibleValue;
        }
        
        public function set maxIdentitiesGoldenGateOverhangsCompatibleValue(i:int):void
        {
            _maxIdentitiesGoldenGateOverhangsCompatibleValue = i;
        }
        
        public function get oligoSynthesisCostPerBPUSDValue():Number
        {
            return _oligoSynthesisCostPerBPUSDValue;
        }
        
        public function set oligoSynthesisCostPerBPUSDValue(n:Number):void
        {
            _oligoSynthesisCostPerBPUSDValue = n;
        }
        
        public function get oligoPagePurificationCostPerPieceUSDValue():Number
        {
            return _oligoPagePurificationCostPerPieceUSDValue;
        }
        
        public function set oligoPagePurificationCostPerPieceUSDValue(n:Number):void
        {
            _oligoPagePurificationCostPerPieceUSDValue = n;
        }
        
        public function get oligoMaxLengthNoPagePurificationRequiredBPsValue():int
        {
            return _oligoMaxLengthNoPagePurificationRequiredBPsValue;
        }
        
        public function set oligoMaxLengthNoPagePurificationRequiredBPsValue(i:int):void
        {
            _oligoMaxLengthNoPagePurificationRequiredBPsValue = i;
        }
        
        public function get minPCRProductBPsValue():int
        {
            return _minPCRProductBPsValue;
        }
        
        public function set minPCRProductBPsValue(i:int):void
        {
            _minPCRProductBPsValue = i;
        }
        
        public function get directSynthesisCostPerBPUSDValue():Number
        {
            return _directSynthesisCostPerBPUSDValue;
        }
        
        public function set directSynthesisCostPerBPUSDValue(n:Number):void
        {
            _directSynthesisCostPerBPUSDValue = n;
        }
        
        public function get directSynthesisMinCostPerPieceUSDValue():Number
        {
            return _directSynthesisMinCostPerPieceUSDValue;
        }
        
        public function set directSynthesisMinCostPerPieceUSDValue(n:Number):void
        {
            _directSynthesisMinCostPerPieceUSDValue = n;
        }
        
        public function get primerGCClampValue():int
        {
            return _primerGCClampValue;
        }
        
        public function set primerGCClampValue(i:int):void
        {
            _primerGCClampValue = i;
        }
        
        public function get primerMinSizeValue():int
        {
            return _primerMinSizeValue;
        }
        
        public function set primerMinSizeValue(i:int):void
        {
            _primerMinSizeValue = i;
        }
        
        public function get primerMaxSizeValue():int
        {
            return _primerMaxSizeValue;
        }
        
        public function set primerMaxSizeValue(i:int):void
        {
            _primerMaxSizeValue = i;
        }
        
        public function get primerMinTmValue():Number
        {
            return _primerMinTmValue;
        }
        
        public function set primerMinTmValue(n:Number):void
        {
            _primerMinTmValue = n;
        }
        
        public function get primerMaxTmValue():Number
        {
            return _primerMaxTmValue;
        }
        
        public function set primerMaxTmValue(n:Number):void
        {
            _primerMaxTmValue = n;
        }
        
        public function get primerMaxDiffTmValue():Number
        {
            return _primerMaxDiffTmValue;
        }
        
        public function set primerMaxDiffTmValue(n:Number):void
        {
            _primerMaxDiffTmValue = n;
        }
        
        public function get primerMaxSelfAnyThValue():int
        {
            return _primerMaxSelfAnyThValue;
        }
        
        public function set primerMaxSelfAnyThValue(i:int):void
        {
            _primerMaxSelfAnyThValue = i;
        }
        
        public function get primerMaxSelfEndThValue():int
        {
            return _primerMaxSelfEndThValue;
        }
        
        public function set primerMaxSelfEndThValue(i:int):void
        {
            _primerMaxSelfEndThValue = i;
        }
        
        public function get primerPairMaxComplAnyThValue():int
        {
            return _primerPairMaxComplAnyThValue;
        }
        
        public function set primerPairMaxComplAnyThValue(i:int):void
        {
            _primerPairMaxComplAnyThValue = i;
        }
        
        public function get primerPairMaxComplEndThValue():int
        {
            return _primerPairMaxComplEndThValue;
        }
        
        public function set primerPairMaxComplEndThValue(i:int):void
        {
            _primerPairMaxComplEndThValue = i;
        }
        
        public function get primerTmSantaluciaValue():Boolean
        {
            return _primerTmSantaluciaValue;
        }
        
        public function set primerTmSantaluciaValue(b:Boolean):void
        {
            _primerTmSantaluciaValue = b;
        }
        
        public function get primerSaltCorrectionsValue():Boolean
        {
            return _primerSaltCorrectionsValue;
        }
        
        public function set primerSaltCorrectionsValue(b:Boolean):void
        {
            _primerSaltCorrectionsValue = b;
        }
        
        public function get primerDnaConcValue():int
        {
            return _primerDnaConcValue;
        }
        
        public function set primerDnaConcValue(i:int):void
        {
            _primerDnaConcValue = i;
        }
        
        public function get mispriming3PrimeBoundaryBPToWarnIfHitValue():int
        {
            return _mispriming3PrimeBoundaryBPToWarnIfHitValue;
        }
        
        public function set mispriming3PrimeBoundaryBPToWarnIfHitValue(i:int):void
        {
            _mispriming3PrimeBoundaryBPToWarnIfHitValue = i;
        }
        
        public function get misprimingMinTmValue():Number
        {
            return _misprimingMinTmValue;
        }
        
        public function set misprimingMinTmValue(n:Number):void
        {
            _misprimingMinTmValue = n;
        }
        
        public function get misprimingSaltConcValue():Number
        {
            return _misprimingSaltConcValue;
        }
        
        public function set misprimingSaltConcValue(n:Number):void
        {
            _misprimingSaltConcValue = n;
        }
        
        public function get misprimingOligoConcValue():Number
        {
            return _misprimingOligoConcValue;
        }
        
        public function set misprimingOligoConcValue(n:Number):void
        {
            _misprimingOligoConcValue = n;
        }
        
        public function get outputSequenceFormatValue():String
        {
            return _outputSequenceFormatValue;
        }
        
        public function set outputSequenceFormatValue(s:String):void
        {
            _outputSequenceFormatValue = s;
        }
        
        public function get suppressPurePrimersValue():Boolean
        {
            return _suppressPurePrimersValue;
        }
        
        public function set suppressPurePrimersValue(b:Boolean):void
        {
            _suppressPurePrimersValue = b;
        }
        
        // Private Methods
        private function setDefaultValues():void
        {
            _masterOligoNumberOfDigitsValue = MONOD_Default;
            _masterPlasmidNumberOfDigitsValue = MPNOD_Default;
            _gibsonOverlapBPsValue = GOB_Default;
            _gibsonOverlapMinTmValue = GOMT_Default;
            _gibsonOverlapMaxTmValue = GOMAXT_Default;
            _maxOligoLengthBPsValue = MOLB_Default;
            _minFragmentSizeGibsonBPsValue = MFSGB_Default;
            _goldenGateOverhangBPsValue = GGOHB_Default;
            _goldenGateRecognitionSeqValue = GGRS_Default;
            _goldenGateTerminiExtraSeqValue = GGTES_Default;
            _maxIdentitiesGoldenGateOverhangsCompatibleValue = MIGGOC_Default;
            _oligoSynthesisCostPerBPUSDValue = OSCPB_Default;
            _oligoPagePurificationCostPerPieceUSDValue = OPPCPP_Default;
            _oligoMaxLengthNoPagePurificationRequiredBPsValue = OMLPPRB_Default;
            _minPCRProductBPsValue = MPPB_Default;
            _directSynthesisCostPerBPUSDValue = DSCPB_Default;
            _directSynthesisMinCostPerPieceUSDValue = DSMCPP_Default;
            _primerGCClampValue = PGC_Default;
            _primerMinSizeValue = PMS_Default;
            _primerMaxSizeValue = PMAXS_Default;
            _primerMinTmValue = PMT_Default;
            _primerMaxTmValue = PMAXT_Default;
            _primerMaxDiffTmValue = PMDT_Default;
            _primerMaxSelfAnyThValue = PMSAT_Default;
            _primerMaxSelfEndThValue = PMSET_Default;
            _primerPairMaxComplAnyThValue = PPMCAT_Default;
            _primerPairMaxComplEndThValue = PPMCET_Default;
            _primerTmSantaluciaValue = PTS_Default;
            _primerSaltCorrectionsValue = PSC_Default;
            _primerDnaConcValue = PDC_Default;
            _mispriming3PrimeBoundaryBPToWarnIfHitValue = M3BBTWIH_Default;
            _misprimingMinTmValue = MMT_Default;
            _misprimingSaltConcValue = MSC_Default;
            _misprimingOligoConcValue = MOC_Default;
            _outputSequenceFormatValue = OSF_Default;
            _suppressPurePrimersValue = SPP_Default;
        }
    }
}