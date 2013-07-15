package org.jbei.registry.proxies
{
    import org.jbei.registry.ApplicationFacade;
    import org.jbei.registry.Constants;
    import org.jbei.registry.models.J5Parameters;
    import org.puremvc.as3.patterns.proxy.Proxy;
    
    public class J5ParametersProxy extends Proxy
    {
        public static const NAME:String = "J5ParametersProxy";
        
        public function J5ParametersProxy()
        {
            super(NAME, new J5Parameters());
        }
        
        public function get j5Parameters():J5Parameters
        {
            return data as J5Parameters;
        }
        
        public function createJ5ParametersString():String
        {
            var j5Par:J5Parameters = j5Parameters;
            var j5CollectionProxy:J5CollectionProxy = ApplicationFacade.getInstance().retrieveProxy(J5CollectionProxy.NAME) as J5CollectionProxy;
            
            var returnString:String = "Parameter Name,Value,Default Value,Description\n"
                + J5Parameters.MONOD + "," + j5Par.masterOligoNumberOfDigitsValue + "," + J5Parameters.MONOD_Default + "," + J5Parameters.MONOD_DESC + "\n"
                + J5Parameters.MPNOD + "," + j5Par.masterPlasmidNumberOfDigitsValue + "," + J5Parameters.MPNOD_Default + "," + J5Parameters.MPNOD_DESC + "\n"
                + J5Parameters.GOB + "," + j5Par.gibsonOverlapBPsValue + "," + J5Parameters.GOB_Default + "," + J5Parameters.GOB_DESC + "\n"
                + J5Parameters.GOMT + "," + j5Par.gibsonOverlapMinTmValue + "," + J5Parameters.GOMT_Default + "," + J5Parameters.GOMT_DESC + "\n"
                + J5Parameters.GOMAXT + "," + j5Par.gibsonOverlapMaxTmValue + "," + J5Parameters.GOMAXT_Default + "," + J5Parameters.GOMAXT_DESC + "\n"
                + J5Parameters.MOLB + "," + j5Par.maxOligoLengthBPsValue + "," + J5Parameters.MOLB_Default + "," + J5Parameters.MOLB_DESC + "\n"
                + J5Parameters.MFSGB + "," + j5Par.minFragmentSizeGibsonBPsValue + "," + J5Parameters.MFSGB_Default + "," + J5Parameters.MFSGB_DESC + "\n"
                + J5Parameters.GGOHB + "," + j5Par.goldenGateOverhangBPsValue + "," + J5Parameters.GGOHB_Default + "," + J5Parameters.GGOHB_DESC + "\n"
                + J5Parameters.GGRS + "," + j5Par.goldenGateRecognitionSeqValue + "," + J5Parameters.GGRS_Default + "," + J5Parameters.GGRS_DESC + "\n"
                + J5Parameters.GGTES + "," + j5Par.goldenGateTerminiExtraSeqValue + "," + J5Parameters.GGTES_Default + "," + J5Parameters.GGTES_DESC + "\n"
                + J5Parameters.MIGGOC + "," + j5Par.maxIdentitiesGoldenGateOverhangsCompatibleValue + "," + J5Parameters.MIGGOC_Default + "," + J5Parameters.MIGGOC_DESC + "\n"
                + J5Parameters.OSCPB + "," + j5Par.oligoSynthesisCostPerBPUSDValue + "," + J5Parameters.OSCPB_Default + "," + J5Parameters.OSCPB_DESC + "\n"
                + J5Parameters.OPPCPP + "," + j5Par.oligoPagePurificationCostPerPieceUSDValue + "," + J5Parameters.OPPCPP_Default + "," + J5Parameters.OPPCPP_DESC + "\n"
                + J5Parameters.OMLPPRB + "," + j5Par.oligoMaxLengthNoPagePurificationRequiredBPsValue + "," + J5Parameters.OMLPPRB_Default + "," + J5Parameters.OMLPPRB_DESC + "\n"
                + J5Parameters.MPPB + "," + j5Par.minPCRProductBPsValue + "," + J5Parameters.MPPB_Default + "," + J5Parameters.MPPB_DESC + "\n"
                + J5Parameters.DSCPB + "," + j5Par.directSynthesisCostPerBPUSDValue + "," + J5Parameters.DSCPB_Default + "," + J5Parameters.DSCPB_DESC + "\n"
                + J5Parameters.DSMCPP + "," + j5Par.directSynthesisMinCostPerPieceUSDValue + "," + J5Parameters.DSMCPP_Default + "," + J5Parameters.DSMCPP_DESC + "\n"
                + J5Parameters.PGC + "," + j5Par.primerGCClampValue + "," + J5Parameters.PGC_Default + "," + J5Parameters.PGC_DESC + "\n"
                + J5Parameters.PMS + "," + j5Par.primerMinSizeValue + "," + J5Parameters.PMS_Default + "," + J5Parameters.PMS_DESC + "\n"
                + J5Parameters.PMAXS + "," + j5Par.primerMaxSizeValue + "," + J5Parameters.PMAXS_Default + "," + J5Parameters.PMAXS_DESC + "\n"
                + J5Parameters.PMT + "," + j5Par.primerMinTmValue + "," + J5Parameters.PMT_Default + "," + J5Parameters.PMT_DESC + "\n"
                + J5Parameters.PMAXT + "," + j5Par.primerMaxTmValue + "," + J5Parameters.PMAXT_Default + "," + J5Parameters.PMAXT_DESC + "\n"
                + J5Parameters.PMDT + "," + j5Par.primerMaxDiffTmValue + "," + J5Parameters.PMDT_Default + "," + J5Parameters.PMDT_DESC + "\n"
                + J5Parameters.PMSAT + "," + j5Par.primerMaxSelfAnyThValue + "," + J5Parameters.PMSAT_Default + "," + J5Parameters.PMSAT_DESC + "\n"
                + J5Parameters.PMSET + "," + j5Par.primerMaxSelfEndThValue + "," + J5Parameters.PMSET_Default + "," + J5Parameters.PMSET_DESC + "\n"
                + J5Parameters.PPMCAT + "," + j5Par.primerPairMaxComplAnyThValue + "," + J5Parameters.PPMCAT_Default + "," + J5Parameters.PPMCAT_DESC + "\n"
                + J5Parameters.PPMCET + "," + j5Par.primerPairMaxComplEndThValue + "," + J5Parameters.PPMCET_Default + "," + J5Parameters.PPMCET_DESC + "\n"
                + J5Parameters.PTS + "," + (j5Par.primerTmSantaluciaValue ? "1" : "0") + "," + (J5Parameters.PTS_Default ? "1" : "0") + "," + J5Parameters.PTS_DESC + "\n"
                + J5Parameters.PSC + "," + (j5Par.primerSaltCorrectionsValue ? "1" : "0") + "," + (J5Parameters.PSC_Default ? "1" : "0") + "," + J5Parameters.PSC_DESC + "\n"
                + J5Parameters.PDC + "," + j5Par.primerDnaConcValue + "," + J5Parameters.PDC_Default + "," + J5Parameters.PDC_DESC + "\n"
                + J5Parameters.M3BBTWIH + "," + j5Par.mispriming3PrimeBoundaryBPToWarnIfHitValue + "," + J5Parameters.M3BBTWIH_Default + "," + J5Parameters.M3BBTWIH_DESC + "\n"
                + J5Parameters.MMT + "," + j5Par.misprimingMinTmValue + "," + J5Parameters.MMT_Default + "," + J5Parameters.MMT_DESC + "\n"
                + J5Parameters.MSC + "," + j5Par.misprimingSaltConcValue + "," + J5Parameters.MSC_Default + "," + J5Parameters.MSC_DESC + "\n"
                + J5Parameters.MOC + "," + j5Par.misprimingOligoConcValue + "," + J5Parameters.MOC_Default + "," + J5Parameters.MOC_DESC + "\n"
                + J5Parameters.OSF + "," + j5Par.outputSequenceFormatValue + "," + J5Parameters.OSF_Default + "," + J5Parameters.OSF_DESC + "\n"
                + J5Parameters.APT + "," + (j5CollectionProxy.isCollectionCircular() ? Constants.CIRCULAR : Constants.LINEAR) + "," + Constants.CIRCULAR + "," + J5Parameters.APT_DESC + "\n"
                + J5Parameters.SPP + "," + (j5Par.suppressPurePrimersValue ? "TRUE" : "FALSE") + "," + (J5Parameters.SPP_Default ? "TRUE" : "FALSE") + "," + J5Parameters.SPP_DESC + "\n";
            return returnString;
        }
    }
}