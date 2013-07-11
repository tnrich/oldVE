package org.jbei.registry.commands
{
    import mx.controls.Alert;
    
    import org.jbei.registry.Constants;
    import org.jbei.registry.models.J5Parameters;
    import org.jbei.registry.proxies.J5ParametersProxy;
    import org.puremvc.as3.interfaces.INotification;
    import org.puremvc.as3.patterns.command.SimpleCommand;
    
    public class UpdateJ5ParametersCommand extends SimpleCommand
    {
        public override function execute(notification:INotification):void
        {
            var j5ParametersFile:String = notification.getBody() as String;
            var lines:Array = j5ParametersFile.split(/\R/);
            
            var alertMessage:String = "";
            
            var j5ParametersProxy:J5ParametersProxy = facade.retrieveProxy(J5ParametersProxy.NAME) as J5ParametersProxy;
            
            for (var i:int = 1; i < lines.length ; i++) {
                var fields:Array = (lines[i] as String).split(","); //assumes no commas in first 2 fields of the CSV
                switch ((fields[0] as String).toUpperCase()) {
                    case J5Parameters.MONOD:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.masterOligoNumberOfDigitsValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.MONOD + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.MPNOD:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.masterPlasmidNumberOfDigitsValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.MPNOD + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.GOB:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.gibsonOverlapBPsValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.GOB + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.GOMT:
                        j5ParametersProxy.j5Parameters.gibsonOverlapMinTmValue = fields[1];
                        break;
                    case J5Parameters.GOMAXT:
                        j5ParametersProxy.j5Parameters.gibsonOverlapMaxTmValue = fields[1];
                        break;
                    case J5Parameters.MOLB:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.maxOligoLengthBPsValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.MOLB + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.MFSGB:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.minFragmentSizeGibsonBPsValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.MFSGB + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.GGOHB:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.goldenGateOverhangBPsValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.GGOHB + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.GGRS:
                        j5ParametersProxy.j5Parameters.goldenGateRecognitionSeqValue = fields[1];
                        break;
                    case J5Parameters.GGTES:
                        j5ParametersProxy.j5Parameters.goldenGateTerminiExtraSeqValue = fields[1];
                        break;
                    case J5Parameters.MIGGOC:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.maxIdentitiesGoldenGateOverhangsCompatibleValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.MIGGOC + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.OSCPB:
                        j5ParametersProxy.j5Parameters.oligoSynthesisCostPerBPUSDValue = fields[1];
                        break;
                    case J5Parameters.OPPCPP:
                        j5ParametersProxy.j5Parameters.oligoPagePurificationCostPerPieceUSDValue = fields[1];
                        break;
                    case J5Parameters.OMLPPRB:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.oligoMaxLengthNoPagePurificationRequiredBPsValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.OMLPPRB + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.MPPB:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.minPCRProductBPsValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.MPPB + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.DSCPB:
                        j5ParametersProxy.j5Parameters.directSynthesisCostPerBPUSDValue = fields[1];
                        break;
                    case J5Parameters.DSMCPP:
                        j5ParametersProxy.j5Parameters.directSynthesisMinCostPerPieceUSDValue = fields[1];
                        break;
                    case J5Parameters.PGC:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.primerGCClampValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.PGC + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PMS:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.primerMinSizeValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.PMS + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PMAXS:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.primerMaxSizeValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.PMAXS + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PMT:
                        j5ParametersProxy.j5Parameters.primerMinTmValue = fields[1];
                        break;
                    case J5Parameters.PMAXT:
                        j5ParametersProxy.j5Parameters.primerMaxTmValue = fields[1];
                        break;
                    case J5Parameters.PMDT:
                        j5ParametersProxy.j5Parameters.primerMaxDiffTmValue = fields[1];
                        break;
                    case J5Parameters.PMSAT:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.primerMaxSelfAnyThValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.PMSAT + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PMSET:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.primerMaxSelfEndThValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.PMSET + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PPMCAT:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.primerPairMaxComplAnyThValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.PPMCAT + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PPMCET:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.primerPairMaxComplEndThValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.PPMCET + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PTS:
                        if (fields[1] == "1") {
                            j5ParametersProxy.j5Parameters.primerTmSantaluciaValue = true;
                        } else if (fields[1] == "0") {
                            j5ParametersProxy.j5Parameters.primerTmSantaluciaValue = false;
                        } else {
                            alertMessage += J5Parameters.PTS + " has an invalid value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PSC:
                        if (fields[1] == "1") {
                            j5ParametersProxy.j5Parameters.primerSaltCorrectionsValue = true;
                        } else if (fields[1] == "0") {
                            j5ParametersProxy.j5Parameters.primerSaltCorrectionsValue = false;
                        } else {
                            alertMessage += J5Parameters.PSC + " has an invalid value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PDC:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.primerDnaConcValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.PDC + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.M3BBTWIH:
                        if (isInt(fields[1])) {
                            j5ParametersProxy.j5Parameters.mispriming3PrimeBoundaryBPToWarnIfHitValue = fields[1];
                        } else {
                            alertMessage += J5Parameters.M3BBTWIH + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.MMT:
                        j5ParametersProxy.j5Parameters.misprimingMinTmValue = fields[1];
                        break;
                    case J5Parameters.MSC:
                        j5ParametersProxy.j5Parameters.misprimingSaltConcValue = fields[1];
                        break;
                    case J5Parameters.MOC:
                        j5ParametersProxy.j5Parameters.misprimingOligoConcValue = fields[1];
                        break;
                    case J5Parameters.OSF:
                        if ((fields[1] as String).toLowerCase() == Constants.GENBANK.toLowerCase()) {
                            j5ParametersProxy.j5Parameters.outputSequenceFormatValue = Constants.GENBANK;
                        } else if ((fields[1] as String).toLowerCase() == Constants.FASTA.toLowerCase()) {
                            j5ParametersProxy.j5Parameters.outputSequenceFormatValue = Constants.FASTA;
                        } else if ((fields[1] as String).toLowerCase() == Constants.JBEI_SEQ.toLowerCase()) {
                            j5ParametersProxy.j5Parameters.outputSequenceFormatValue = Constants.JBEI_SEQ;
                        } else if ((fields[1] as String).toLowerCase() == Constants.SBOL_XML.toLowerCase()) {
                            j5ParametersProxy.j5Parameters.outputSequenceFormatValue = Constants.SBOL_XML;
                        } else {
                            alertMessage += J5Parameters.OSF + " has an invalid value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.SPP:
                        if ((fields[1] as String).toLowerCase() == "true") {
                            j5ParametersProxy.j5Parameters.suppressPurePrimersValue = true;
                        } else if ((fields[1] as String).toLowerCase() == "false") {
                            j5ParametersProxy.j5Parameters.suppressPurePrimersValue = false;
                        } else {
                            alertMessage += J5Parameters.SPP + " has an invalid value of " + fields[1] + ".\n";
                        }
                        break;
                }
            }
            
            if (alertMessage != "") {
                Alert.show("The following j5 parameter values are invalid, using defaults for these parameters:\n\n" 
                    + alertMessage, "Warning Message");
            }
        }
        
        private function isInt(str:String):Boolean //TODO: move to utils and make static?
        {
            var pattern:RegExp = /^-?\d+$/;
            if (pattern.exec(str) != null) {
                return true;
            }
            return false;
        }
    }
}