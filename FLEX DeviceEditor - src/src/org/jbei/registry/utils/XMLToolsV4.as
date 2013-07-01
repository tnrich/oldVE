package org.jbei.registry.utils
{
    import flash.geom.Point;
    import flash.utils.Dictionary;
    
    import mx.collections.ArrayCollection;
    import mx.controls.Alert;
    
    import org.jbei.registry.ApplicationFacade;
    import org.jbei.registry.Constants;
    import org.jbei.registry.SBOLvIcons;
    import org.jbei.registry.commands.FunctionMediator;
    import org.jbei.registry.mediators.GridViewCanvasMediator;
    import org.jbei.registry.mediators.RightCanvasMediator;
    import org.jbei.registry.models.EugeneRule;
    import org.jbei.registry.models.Part;
    import org.jbei.registry.models.PartVO;
    import org.jbei.registry.models.SequenceFile;
    import org.jbei.registry.models.j5.J5Bin;
    import org.jbei.registry.models.j5.J5Collection;
    import org.jbei.registry.proxies.EugeneRuleProxy;
    import org.jbei.registry.proxies.J5CollectionProxy;
    import org.jbei.registry.proxies.PartProxy;
    import org.jbei.registry.proxies.SequenceFileProxy;
    import org.jbei.registry.view.ui.canvas.CenterCanvas;
    import org.jbei.registry.view.ui.shapes.CollectionShape;
    import org.jbei.registry.view.ui.shapes.RectShape;

    public class XMLToolsV4
    {
        private static const de:Namespace = new Namespace("de", "http://jbei.org/device_editor");
        
        private static var loadBinAlertMessage:String;
        
        private static var sequenceFileProxy:SequenceFileProxy = ApplicationFacade.getInstance().retrieveProxy(SequenceFileProxy.NAME) as SequenceFileProxy;
        private static var partProxy:PartProxy = ApplicationFacade.getInstance().retrieveProxy(PartProxy.NAME) as PartProxy;
        private static var eugeneRuleProxy:EugeneRuleProxy = ApplicationFacade.getInstance().retrieveProxy(EugeneRuleProxy.NAME) as EugeneRuleProxy;
        private static var j5CollectionProxy:J5CollectionProxy = ApplicationFacade.getInstance().retrieveProxy(J5CollectionProxy.NAME) as J5CollectionProxy;
        private static var gridViewCanvasMediator:GridViewCanvasMediator = ApplicationFacade.getInstance().retrieveMediator(GridViewCanvasMediator.NAME) as GridViewCanvasMediator;
        private static var functionMediator:FunctionMediator = ApplicationFacade.getInstance().retrieveMediator(FunctionMediator.NAME) as FunctionMediator;
        private static var rightCanvasMediator:RightCanvasMediator = ApplicationFacade.getInstance().retrieveMediator(RightCanvasMediator.NAME) as RightCanvasMediator;

        public static function generateDesignXML():XML
        {
            var designXML:XML = <de:design xmlns:de="http://jbei.org/device_editor"
                                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                xsi:schemaLocation="http://jbei.org/device_editor design.xsd"/>;
            
            designXML.de::version = "4.0";
            
            //Generate XML for SequenceFiles
            var sequenceFilesXML:XML = <sequenceFiles/>;
            sequenceFilesXML.setNamespace(de);
            var sequenceFiles:Vector.<SequenceFile> = sequenceFileProxy.sequenceFiles;
            for (var i:int = 0; i < sequenceFiles.length; i++) {
                var sequenceFileXML:XML = <sequenceFile hash={sequenceFiles[i].hash}/>;
                sequenceFileXML.setNamespace(de);
                sequenceFileXML.de::format = sequenceFiles[i].sequenceFileFormat;
                var sequenceContentXML:XML = new XML("<content><![CDATA[" + sequenceFiles[i].sequenceFileContent.toString() + "]]></content>");
                sequenceContentXML.setNamespace(de);
                sequenceFileXML.appendChild(sequenceContentXML);
                sequenceFileXML.de::fileName = sequenceFiles[i].sequenceFileName;
                
                sequenceFilesXML.appendChild(sequenceFileXML);
            }
            designXML.appendChild(sequenceFilesXML);
            
            //Generate XML for PartVOs
            var partVOs:Vector.<PartVO> = partProxy.partVOs;
            var parts:Vector.<Part> = partProxy.parts;
            var partVOsXML:XML = <partVOs/>;
            partVOsXML.setNamespace(de);
            for (i = 0; i < partVOs.length; i++) {
                var partVO:PartVO = partVOs[i];
                if (!partVO.isEmpty()) { //if partVO is empty, cannot set part FAS, so parts must also be empty
                    var partVOXML:XML = <partVO id={partVOs[i].id}/>;
                    partVOXML.setNamespace(de);
                    partVOXML.de::name = partVOs[i].name;
                    if (partVOs[i].sequenceFile != null) {
                        partVOXML.de::revComp = partVOs[i].revComp;
                        partVOXML.de::startBP = partVOs[i].genbankStartBP;
                        partVOXML.de::stopBP = partVOs[i].endBP;
                        partVOXML.de::sequenceFileHash = partVOs[i].sequenceFile.hash;
                    }
                    
                    //Generate XML for Parts
                    var partsXML:XML = <parts/>;
                    partsXML.setNamespace(de);
                    for (var j:int = 0; j < parts.length; j++) {
                        if (parts[j].partVO == partVOs[i]) {
                            var partXML:XML = <part id={parts[j].id}/>;
                            partXML.setNamespace(de);
                            partXML.de::fas = parts[j].fas;
                            
                            partsXML.appendChild(partXML);
                        }
                    }
                    
                    partVOXML.appendChild(partsXML);
                    
                    partVOsXML.appendChild(partVOXML);
                }
            }
            designXML.appendChild(partVOsXML);
            
            //Generate XML for EugeneRules
            var eugeneRulesXML:XML = <eugeneRules/>;
            eugeneRulesXML.setNamespace(de);
            var eugeneRules:Vector.<EugeneRule> = eugeneRuleProxy.eugeneRules;
            for (i = 0; i < eugeneRules.length; i++) {
                var eugeneRuleXML:XML = <eugeneRule/>;
                eugeneRuleXML.setNamespace(de);
                eugeneRuleXML.de::name = eugeneRules[i].name;
                eugeneRuleXML.de::negationOperator = eugeneRules[i].negationOperator;
                eugeneRuleXML.de::operand1ID = eugeneRules[i].operand1.id;
                eugeneRuleXML.de::compositionalOperator = eugeneRules[i].compositionalOperator;
                if (eugeneRules[i].operand2 is Number) {
                    eugeneRuleXML.de::operand2Number = eugeneRules[i].operand2;
                } else if (eugeneRules[i].operand2 is PartVO) {
                    eugeneRuleXML.de::operand2ID = (eugeneRules[i].operand2 as PartVO).id;
                }
                
                eugeneRulesXML.appendChild(eugeneRuleXML);
            }
            designXML.appendChild(eugeneRulesXML);
            
            //Generate XML for J5Collection
            var j5Collection:J5Collection = j5CollectionProxy.j5Collection;
            var j5CollectionXML:XML = <j5Collection/>;
            j5CollectionXML.setNamespace(de);
            j5CollectionXML.de::isCircular = j5Collection.isCircular;
            
            //Generate XML for J5Bins
            var j5BinsXML:XML = <j5Bins/>;
            j5BinsXML.setNamespace(de);
            var j5Bins:Vector.<J5Bin> = j5Collection.binsVector;
            for (i = 0; i < j5Bins.length; i++) {
                var j5BinXML:XML = <j5Bin/>;
                j5BinXML.setNamespace(de);
                j5BinXML.de::binName = j5Bins[i].binName;
                j5BinXML.de::iconID = j5Bins[i].iconID;
                j5BinXML.de::direction = j5Bins[i].directionForward ? "forward" : "reverse";
                j5BinXML.de::dsf = j5Bins[i].dsf;
                if (j5Bins[i].fro != null) {
                    j5BinXML.de::fro = j5Bins[i].fro.value;
                }
                if (j5Bins[i].extra5PrimeBps != null) {
                    j5BinXML.de::extra5PrimeBps = j5Bins[i].extra5PrimeBps.value;
                }
                if (j5Bins[i].extra3PrimeBps != null) {
                    j5BinXML.de::extra3PrimeBps = j5Bins[i].extra3PrimeBps.value;
                }
                
                //Generate XML for BinItems
                var binItemsXML:XML = <binItems/>;
                binItemsXML.setNamespace(de);
                var partsInBin:Vector.<Part> = gridViewCanvasMediator.getColumnContents(i);
                var binItemXML:XML;
                for (j = partsInBin.length - 1; j >= 0; j--) { //go in reverse order
                    if (partsInBin[j] != null && !partsInBin[j].isEmpty()) { //non-empty part
                        binItemXML = <partID>{partsInBin[j].id}</partID>;
                        binItemXML.setNamespace(de);
                        binItemsXML.prependChild(binItemXML);
                    } else if (binItemsXML.children().length() > 0) { //only need placeholder if non-empty parts come after
                        binItemXML = <partID/>; //placeholder used for positioning
                        binItemXML.setNamespace(de);
                        binItemsXML.prependChild(binItemXML);
                    }
                }
                j5BinXML.appendChild(binItemsXML);
                
                j5BinsXML.appendChild(j5BinXML);
            }
            j5CollectionXML.appendChild(j5BinsXML);
            
            designXML.appendChild(j5CollectionXML);
            
            return designXML;
        }

        public static function loadDesignXMLv4(designXML:XML):void
        {
            default xml namespace = de;
            
            loadSequenceFiles(designXML.sequenceFiles);
            loadPartVOs(designXML.partVOs);
            loadEugeneRules(designXML.eugeneRules);
            loadCollection(designXML.j5Collection[0]);
            loadPartsOutsideCollection();
        }
        
        private static function loadSequenceFiles(sequenceFilesXML:XMLList):void
        {
            var sequenceFileXML:XML;
            
            for (var i:int = 0; i < sequenceFilesXML.children().length(); i++) {
                sequenceFileXML = sequenceFilesXML.children()[i];
                try {
                    var fileName:String = sequenceFileXML.fileName;
                    if (sequenceFileXML.format == Constants.FASTA) {  // check on FASTA
                        if (!fileName.match(/\./)) {  // if the filename doesn't have an extension (actually assumes if there is a dot, the filename has an extension)
                            fileName = fileName + ".fas";
                        }
                    } //TODO: check for missing file extensions on all file formats
                    sequenceFileProxy.addSequenceFile(sequenceFileXML.format, sequenceFileXML.content, fileName);
                } catch (error:Error) {
                    Alert.show(error.toString(), "Error Message");
                }
            }
        }
        
        private static function loadPartVOs(partVOsXML:XMLList):void
        {
            var partVOXML:XML;
            var partVO:PartVO;
            var part:Part;
            
            for (var i:int = 0; i < partVOsXML.children().length(); i++) {
                partVOXML = partVOsXML.children()[i];
                
                partVO = new PartVO();
                partVO.id = partVOXML.@id;
                partVO.name = partVOXML.name != null ? partVOXML.name : "";
                
                if (partVOXML.sequenceFileHash != null && partVOXML.sequenceFileHash.length() > 0) {
                    partVO.sequenceFile = sequenceFileProxy.getItemByHash(partVOXML.sequenceFileHash);
                    partVO.revComp = stringToBool(partVOXML.revComp);
                    partVO.genbankStartBP = Number(partVOXML.startBP);
                    partVO.endBP = Number(partVOXML.stopBP);
                }
                
                //Load the Parts
                var partsXML:XMLList = partVOXML.parts;
                var partXML:XML;
                for (var j:int = 0; j < partsXML.children().length(); j++) {
                    partXML = partsXML.children()[j];
                    
                    part = partProxy.createPart(partVO);
                    part.id = partXML.@id;
                    part.fas = partXML.fas;
                }
            }
        }
        
        private static function loadEugeneRules(eugeneRulesXML:XMLList):void
        {
            var eugeneRuleXML:XML;
            
            for (var i:int = 0; i < eugeneRulesXML.children().length(); i++) {
                eugeneRuleXML = eugeneRulesXML.children()[i];
                
                try {
                    var negationOperator:Boolean = stringToBool(eugeneRuleXML.negationOperator);
                    var operand1:PartVO = partProxy.getPartVOById(eugeneRuleXML.operand1ID);
                    var compositionalOperator:String = eugeneRuleXML.compositionalOperator;
                    var operand2:*;
                    if (compositionalOperator == EugeneRule.MORETHAN) {
                        operand2 = Number(eugeneRuleXML.operand2Number);
                    } else {
                        operand2 = partProxy.getPartVOById(eugeneRuleXML.operand2ID);
                    }
                    eugeneRuleProxy.addRule(eugeneRuleXML.name, negationOperator, operand1, compositionalOperator, operand2);
                } catch (error:Error) {
                    Alert.show(error.toString() + "\n\nRule has not been loaded", "Error Message");
                }
            }
        }
        
        private static function loadCollection(j5CollectionXML:XML):void
        {
            var j5Collection:J5Collection = j5CollectionProxy.j5Collection;
            
            j5Collection.isCircular = stringToBool(j5CollectionXML.isCircular);
            
            //Load the bins
            var j5BinsXML:XMLList = j5CollectionXML.j5Bins;
            var j5BinXML:XML;
            var bin:J5Bin;
            
            loadBinAlertMessage = "";
            
            //first figure out how many rows need to be added
            var maxNumItems:int = 0;
            for (var c:int = 0; c < j5BinsXML.children().length(); c++) {
                j5BinXML = j5BinsXML.children()[c];
                if (j5BinXML.binItems.children().length() > maxNumItems) {
                    maxNumItems = j5BinXML.binItems.children().length()
                }
            }
            var numRowsToAdd:int = maxNumItems + 1 - GridViewCanvasMediator.INIT_NUM_ROWS;
            if (numRowsToAdd < 0) {
                numRowsToAdd = 0;
            }
            gridViewCanvasMediator.addRows(numRowsToAdd);
            
            //the first bin is different, since GridViewCanvas starts out with a collection containing one bin
            j5BinXML = j5BinsXML.children()[0];
            bin = j5Collection.binsVector[0];
            bin.binName = j5BinXML.binName;
            loadBin(bin, j5BinXML, 0);
            
            //load the rest of the bins
            for (var i:int = 1; i < j5BinsXML.children().length(); i++) {
                j5BinXML = j5BinsXML.children()[i];
                bin = j5CollectionProxy.addBin(j5BinXML.binName);
                loadBin(bin, j5BinXML, i);
            }
            
            if (loadBinAlertMessage != "") {
                Alert.show("The following bin information could not be loaded:\n\n" + loadBinAlertMessage, "Warning Message");
            }
            
            functionMediator.setUpCollection();
            gridViewCanvasMediator.refreshHeaderGraphics();
        }
        
        private static function loadBin(bin:J5Bin, j5BinXML:XML, binNum:int):void
        {
            //Load the bin properties
            bin.iconID = j5BinXML.iconID;
            bin.directionForward = j5BinXML.direction == "reverse" ? false : true;
            bin.dsf = stringToBool(j5BinXML.dsf);
            if (j5BinXML.fro != null && j5BinXML.fro.length() > 0 && j5BinXML.fro != "unspecified") { //if not something that translates to null
                if (j5BinXML.fro.match(/^-?\d+$/)) { //if integer
                    bin.fro = new NullableInt(int(j5BinXML.fro));
                } else {
                    loadBinAlertMessage += "* Bin " + j5BinXML.binName + " FRO " + j5BinXML.fro + " is not an integer.\n";
                }
            }
            if (j5BinXML.extra5PrimeBps != null && j5BinXML.extra5PrimeBps.length() > 0 && j5BinXML.extra5PrimeBps != "unspecified") {
                if (j5BinXML.extra5PrimeBps.match(/^-?\d+$/)) {
                    bin.extra5PrimeBps = new NullableInt(int(j5BinXML.extra5PrimeBps));
                } else {
                    loadBinAlertMessage += "* Bin " + j5BinXML.binName + " Extra 5' CPEC overlap bps " + j5BinXML.extra5PrimeBps + " is not an integer.\n";
                }
            }
            if (j5BinXML.extra3PrimeBps != null && j5BinXML.extra3PrimeBps.length() > 0 && j5BinXML.extra3PrimeBps != "unspecified") {
                if (j5BinXML.extra3PrimeBps.match(/^-?\d+$/)) {
                    bin.extra3PrimeBps = new NullableInt(int(j5BinXML.extra3PrimeBps));
                } else {
                    loadBinAlertMessage += "* Bin " + j5BinXML.binName + " Extra 3' CPEC overlap bps " + j5BinXML.extra3PrimeBps + " is not an integer.\n";
                }
            }
            
            //Add parts into bins and onto canvas
            var partIDsXML:XMLList = j5BinXML.binItems.children();
            for (var i:int = 0; i < partIDsXML.length(); i++) {
                if (partIDsXML[i] != "") {
                    var part:Part = partProxy.getPartById(partIDsXML[i]);
                    if (part != null) {
                        j5CollectionProxy.addToBin(part, binNum);
                        gridViewCanvasMediator.addPart(part, binNum, i);
                    } else {
                        Alert.show("Part with ID " + partIDsXML[i] + " does not exist and cannot be loaded.", "Warning Message");
                    }
                }
            }
            
            functionMediator.checkBinRules(bin);
        }
        
        private static function loadPartsOutsideCollection():void
        {
            var collection:J5Collection = j5CollectionProxy.j5Collection;
            var bins:Vector.<J5Bin> = collection.binsVector;
            
            //identify all the partVOs that are used in the collection
            var partVOsInCollection:Dictionary = new Dictionary();
            for (var i:int = 0; i < bins.length; i++) {
                for (var j:int = 0; j < bins[i].binItemsVector.length; j++) {
                    var partVO:PartVO = bins[i].binItemsVector[j].partVO;
                    partVOsInCollection[partVO] = partVO;
                }
            }
            
            //look for the partVOs that are not used in the collection
            var allParts:Vector.<Part> = partProxy.parts;
            var allPartVOs:Vector.<PartVO> = partProxy.partVOs;
            for (i = 0; i < allPartVOs.length; i++) {
                if (partVOsInCollection[allPartVOs[i]] == null) {
                    //find the first part associated with the partVO and add to part holding area
                    for (j = 0; j < allParts.length; j++) {
                        if (allParts[j].partVO == allPartVOs[i]) {
                            gridViewCanvasMediator.loadToPartHoldingArea(allParts[j]);
                        }
                    }
                }
            }
        }
        
        //Helper function for loading from XML
        //text contained in XML elements gets stored as String
        //new boolean from non-empty String would otherwise become true, regardless of what the String says
        private static function stringToBool(s:String):Boolean
        {
            if (s.toLowerCase() == "true")
                return true;
            else
                return false;
        }
    }
}