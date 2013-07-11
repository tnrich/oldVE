package org.jbei.registry.utils
{
    import mx.collections.ArrayCollection;
    import mx.controls.Alert;
    
    import org.jbei.registry.ApplicationFacade;
    import org.jbei.registry.Constants;
    import org.jbei.registry.models.EugeneRule;
    import org.jbei.registry.models.Part;
    import org.jbei.registry.models.PartVO;
    import org.jbei.registry.models.j5.J5Bin;
    import org.jbei.registry.proxies.EugeneRuleProxy;
    import org.jbei.registry.proxies.J5CollectionProxy;
    import org.jbei.registry.proxies.PartProxy;
    import org.jbei.registry.view.ui.IPartRenderer;

    public class J5ControlsUtils
    {
        private static var eugeneRuleProxy:EugeneRuleProxy = ApplicationFacade.getInstance().retrieveProxy(EugeneRuleProxy.NAME) as EugeneRuleProxy;
        private static var j5CollectionProxy:J5CollectionProxy = ApplicationFacade.getInstance().retrieveProxy(J5CollectionProxy.NAME) as J5CollectionProxy;

        // Constructor
        public function J5ControlsUtils()
        {
        }
        
        // Public Methods
        public static function createJ5SeqList():String
        {
            var returnString:String;
            returnString = createSeqListHeader();
            
            var seqListString:String = getSeqListInfo();
            if(seqListString != null)
            {
                returnString = returnString + seqListString;
                return returnString;
            }
            return null;		
        }
        
        public static function createJ5PartList():String
        {
            var returnString:String;
            returnString = createPartListHeader();
            
            //get all the j5 objects
            var partListString:String = getPartListInfo();
            if(partListString != null)
            {
                returnString = returnString + partListString;
                return returnString;
            }
            return null;
        }
        
        public static function createJ5TargetList():String
        {
            var returnString:String;
            returnString = createTargetListHeader();
            
            var targetListString:String = getTargetListInfo();
            if(targetListString != null)
            {
                returnString = returnString + targetListString;
                return returnString;
            }
            return null;
        }
        
        public static function createJ5EugeneRulesList():String
        {
            var eugeneRulesList:String = "";
            
            var eugeneRules:Vector.<EugeneRule> = eugeneRuleProxy.eugeneRules;
            var rule:EugeneRule;
            var ruleText:String;
            
            for (var i:int = 0; i<eugeneRules.length; i++) {
                ruleText = eugeneRuleProxy.generateRuleText(eugeneRules[i]);
                eugeneRulesList = eugeneRulesList + ruleText + "\n";
            }
            
            if (eugeneRulesList == "") {  // if there are no rules
                eugeneRulesList = "\n";
            }
            
            return eugeneRulesList;
        }
        
        public static function createCollectionFileData():ArrayCollection
        {
            var returnArray:ArrayCollection = new ArrayCollection();
            
            if (j5CollectionProxy.j5Collection.j5Ready == true)
            {
                var bins:Vector.<J5Bin> = j5CollectionProxy.j5Collection.binsVector;
                var currentBin:J5Bin;
                for (var i:int=0; i<bins.length; i++)
                {
                    currentBin = bins[i];								
                    for (var j:int=0; j<currentBin.binItemsVector.length; j++)
                    {
                        var part:Part = currentBin.binItemsVector[j];
                        if (!part.isEmpty()) {
                            if (part.sequenceFile.sequenceFileFormat == Constants.GENBANK
                                || part.sequenceFile.sequenceFileFormat == Constants.FASTA
                                || part.sequenceFile.sequenceFileFormat == Constants.JBEI_SEQ)
                            {
                                var fileInfo:FileInfo = new FileInfo();
                                fileInfo.name = part.sequenceFile.sequenceFileName;
                                fileInfo.file = part.sequenceFile.sequenceFileContent;
                                returnArray.addItem(fileInfo);
                            }
                        }
                    }
                }
            }
            else
            {
                Alert.show("Collection must be j5 Ready!", "Error Message");
            }
            
            return returnArray;	
        }
        
        public static function createGenbank():String
        {
            var selectedPartRenderer:IPartRenderer = ApplicationFacade.getInstance().selectedPartRenderer;
            
            if (selectedPartRenderer != null && selectedPartRenderer.part != null && !selectedPartRenderer.part.isEmpty())
            {
                var part:Part = selectedPartRenderer.part;
                if (part.sequenceFile.sequenceFileFormat != Constants.GENBANK)
                {
                    Alert.show("Part must be set to Genbank format!", "Error Message");
                    return null;
                }
                else
                    return part.sequenceFile.sequenceFileContent;
            }
            else
            {
                Alert.show("Must select a part!", "Error Message");
                return null;
            }
            return null;
        }
        
        public static function createFasta():String
        {
            var selectedPartRenderer:IPartRenderer = ApplicationFacade.getInstance().selectedPartRenderer;
            
            if (selectedPartRenderer != null && selectedPartRenderer.part != null && !selectedPartRenderer.part.isEmpty())
            {
                var part:Part = selectedPartRenderer.part;
                if(part.sequenceFile.sequenceFileFormat != Constants.FASTA)
                {
                    Alert.show("Part must be set to FASTA format!", "Error Message");
                    return null;
                }
                else
                    return part.sequenceFile.sequenceFileContent;
            }
            else
            {
                Alert.show("Must select a part!", "Error Message");
                return null;
            }
            return null;
        }
        
        public static function createJbeiSequenceXml():String
        {
            var selectedPartRenderer:IPartRenderer = ApplicationFacade.getInstance().selectedPartRenderer;
            
            if (selectedPartRenderer != null && selectedPartRenderer.part != null && !selectedPartRenderer.part.isEmpty())
            {
                var part:Part = selectedPartRenderer.part; 
                if(part.sequenceFile.sequenceFileFormat != Constants.JBEI_SEQ)
                {
                    Alert.show("Part must be set to jbei-seq format!", "Error Message");
                    return null;
                }
                else
                    return part.sequenceFile.sequenceFileContent;
            }
            else
            {
                Alert.show("Must select a part!", "Error Message");
                return null;
            }
            return null;
        }
        
        public static function generateEmptyPlasmidsList():String
        {
            return "Plasmid Name,Alias,Contents,Length,Sequence\n";
        }
        
        public static function generateEmptyOligosList():String
        {
            return "Oligo Name,Length,Tm,Tm (3' only),Sequence\n";
        }
        
        public static function generateEmptyDirectSynthesesList():String
        {
            return "Direct Synthesis Name,Alias,Contents,Length,Sequence\n";
        }
        
        // Private Methods
        private static function createSeqListHeader():String
        {
            return "Sequence File Name,Format";
        }
        
        private static function createPartListHeader():String
        {
            return "Part Name,Part Source (Sequence Display ID),Reverse Compliment?,Start (bp),End (bp)";
        }
        
        private static function createTargetListHeader():String
        {
            return "(>Bin) or Part Name,Direction,Forced Assembly Strategy?,Forced Relative Overhang Position?,Direct Synthesis Firewall?,Extra 5' CPEC overlap bps,Extra 3' CPEC overlap bps";
        }
        
        private static function getSeqListInfo():String
        {
            var returnString:String = "\n";
            if (j5CollectionProxy.j5Collection.j5Ready == true)
            {
                var bins:Vector.<J5Bin> = j5CollectionProxy.j5Collection.binsVector;
                var currentBin:J5Bin;
                var uniqueList:Array = new Array();
                for (var i:int=0; i<bins.length; i++)
                {
                    currentBin = bins[i];
                    for (var j:int=0; j<currentBin.binItemsVector.length; j++)
                    {
                        var part:Part = currentBin.binItemsVector[j];
                        if (!part.isEmpty()) {
                            var sourceFileName:String = part.sequenceFile.sequenceFileName;
                            var sourceType:String = part.sequenceFile.sequenceFileFormat;
                            if (!arrayCheck(uniqueList, sourceFileName))
                            {
                                returnString = returnString + sourceFileName + 
                                    "," + sourceType + "\n";
                                uniqueList.push(sourceFileName);
                            }
                        }
                    }
                }
                return returnString;	
            }
            else
            {
                Alert.show("Collection must be j5 Ready!", "Error Message");
            }
            return null;
        }
        
        private static function getPartListInfo():String
        {
            var returnString:String = "\n";
            if (j5CollectionProxy.j5Collection.j5Ready == true)
            {
                var bins:Vector.<J5Bin> = j5CollectionProxy.j5Collection.binsVector;
                var currentBin:J5Bin;
                var partInfoString:String;
                var pattern:RegExp;
                for (var i:int=0; i<bins.length; i++)
                {
                    currentBin = bins[i];
                    for (var j:int=0; j<currentBin.binItemsVector.length; j++)
                    {
                        var part:Part = currentBin.binItemsVector[j];
                        if (!part.isEmpty()) {
                            partInfoString = part.name + "," 
                                + part.sequenceFile.partSource + "," 
                                + part.revComp.toString().toUpperCase() + "," 
                                + part.genbankStartBP + "," 
                                + part.endBP;	
                            pattern = new RegExp("^" + partInfoString + "$", "m");
                            if (!pattern.test(returnString)) {
                                returnString = returnString + partInfoString + "\n";
                            } // else it's a duplicate part and do nothing
                        }
                    }
                }
                return returnString;					
            }
            else
            {
                Alert.show("Collection must be j5 Ready!", "Error Message");
            }
            return null;
        }
        
        private static function getTargetListInfo():String
        {
            var returnString:String = "\n";
            if (j5CollectionProxy.j5Collection.j5Ready == true)
            {
                var bins:Vector.<J5Bin> = j5CollectionProxy.j5Collection.binsVector;
                var currentBin:J5Bin;
                for (var i:int=0; i<bins.length; i++)
                {
                    currentBin = bins[i];
                    
                    var direction:String = currentBin.directionForward ? "forward" : "reverse";
                    
                    var fas:String = currentBin.fas;
                    
                    var dsf:String = "";
                    if (currentBin.dsf == true) {
                        dsf = "TRUE";
                    }
                    
                    var fro:String = "";
                    if (currentBin.fro != null) {
                        fro = currentBin.fro.toString();
                    }
                    
                    var extra5PrimeBps:String = "";
                    if (currentBin.extra5PrimeBps != null) {
                        extra5PrimeBps = currentBin.extra5PrimeBps.toString();
                    }
                    
                    var extra3PrimeBps:String = "";
                    if (currentBin.extra3PrimeBps != null) {
                        extra3PrimeBps = currentBin.extra3PrimeBps.toString();
                    }
                    
                    //Only do this if it is combinatorial
                    if (j5CollectionProxy.j5Collection.combinatorial == true) {
                        returnString = returnString + ">" + currentBin.binName + "," + "," + fas + "," + fro + "," 
                            + dsf + "," + extra5PrimeBps + "," + extra3PrimeBps + "\n"; 
                    }
                    
                    for (var j:int=0; j<currentBin.binItemsVector.length; j++)
                    {
                        var part:Part = currentBin.binItemsVector[j];
                        if (!part.isEmpty()) {
                            returnString = returnString + part.name + 
                                "," + direction + 
                                "," + part.fas;
                            
                            if (j5CollectionProxy.j5Collection.combinatorial != true)  
                            {
                                returnString = returnString + "," + fro + "," + dsf + "," + extra5PrimeBps + "," + extra3PrimeBps + "\n";
                            } else {
                                returnString = returnString + ",,,,\n";
                            }
                        }
                    }
                }
                return returnString;		
            }
            else
            {
                Alert.show("Collection must be j5 Ready!", "Error Message");
            }
            return null;
        }
        
        private static function arrayCheck(a:Array, s:String):Boolean
        {
            var i:int;
            for(i=0; i<a.length; i++)
            {
                if(a[i].toString() == s)
                    return true;
            }
            return false;
        }
    }
}