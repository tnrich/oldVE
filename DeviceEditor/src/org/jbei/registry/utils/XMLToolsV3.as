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

    public class XMLToolsV3
    {
        private static const de:Namespace = new Namespace("de", "http://jbei.org/device_editor");
        default xml namespace = de;
        
        private static var loadBinAlertMessage:String;
        
        private static var sequenceFileProxy:SequenceFileProxy = ApplicationFacade.getInstance().retrieveProxy(SequenceFileProxy.NAME) as SequenceFileProxy;
        private static var partProxy:PartProxy = ApplicationFacade.getInstance().retrieveProxy(PartProxy.NAME) as PartProxy;
        private static var eugeneRuleProxy:EugeneRuleProxy = ApplicationFacade.getInstance().retrieveProxy(EugeneRuleProxy.NAME) as EugeneRuleProxy;
        private static var j5CollectionProxy:J5CollectionProxy = ApplicationFacade.getInstance().retrieveProxy(J5CollectionProxy.NAME) as J5CollectionProxy;
        private static var gridViewCanvasMediator:GridViewCanvasMediator = ApplicationFacade.getInstance().retrieveMediator(GridViewCanvasMediator.NAME) as GridViewCanvasMediator;
        private static var functionMediator:FunctionMediator = ApplicationFacade.getInstance().retrieveMediator(FunctionMediator.NAME) as FunctionMediator;

        public function XMLToolsV3()
        {
        }
        
        [Deprecated(replacement="XMLToolsV4.generateDesignXML")]
        public static function generateDesignXML(allRectShapes:Vector.<RectShape>, collectionShape:CollectionShape):XML
        {
            var designXML:XML = <de:design xmlns:de="http://jbei.org/device_editor"
                                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                xsi:schemaLocation="http://jbei.org/device_editor design.xsd"></de:design>;
            
            var versionXML:XML = <version>3.4</version>;
            designXML.appendChild(versionXML);
            
            //Generate XML for SequenceFiles
            var sequenceFilesXML:XML = <sequenceFiles></sequenceFiles>;
            var sequenceFiles:Vector.<SequenceFile> = sequenceFileProxy.sequenceFiles;
            for (var i:int = 0; i < sequenceFiles.length; i++) {
                var sequenceFileXML:XML =
                    <sequenceFile hash={sequenceFiles[i].hash}>
                        <format>{sequenceFiles[i].sequenceFileFormat}</format>
                        <content></content>
                        <fileName>{sequenceFiles[i].sequenceFileName}</fileName>
                    </sequenceFile>;
                sequenceFileXML.content.appendChild(new XML("<![CDATA[" + sequenceFiles[i].sequenceFileContent.toString() + "]]>"));
                
                sequenceFilesXML.appendChild(sequenceFileXML);
            }
            designXML.appendChild(sequenceFilesXML);
            
            //Generate XML for PartVOs
            var partVOsXML:XML = <partVOs></partVOs>;
            var partVOs:Vector.<PartVO> = partProxy.partVOs;
            for (i = 0; i < partVOs.length; i++) {
                var partVOXML:XML =
                    <partVO id={partVOs[i].id}>
                        <name>{partVOs[i].name}</name>
                        <iconID>{partVOs[i].iconID}</iconID>
                    </partVO>;
                if (partVOs[i].sequenceFile != null) {
                    partVOXML.appendChild(<revComp>{partVOs[i].revComp}</revComp>);
                    partVOXML.appendChild(<startBP>{partVOs[i].genbankStartBP}</startBP>);
                    partVOXML.appendChild(<stopBP>{partVOs[i].endBP}</stopBP>);
                    partVOXML.appendChild(<sequenceFileHash>{partVOs[i].sequenceFile.hash}</sequenceFileHash>);
                }
                
                //Generate XML for Parts and RectShapes
                //find all RectShapes for the given PartVO
                var rectShapes:Vector.<RectShape> = new Vector.<RectShape>;
                for (j = 0; j < allRectShapes.length; j++) {
                    if (allRectShapes[j].part.partVO == partVOs[i]) {
                        rectShapes.push(allRectShapes[j]);
                    }
                }
                
                var partsXML:XML = <parts></parts>;
                for (var j:int = 0; j < rectShapes.length; j++) {
                    var partXML:XML =
                        <part id={rectShapes[j].part.id}>
                            <direction>{rectShapes[j].part.directionForward ? "forward" : "reverse"}</direction>
                            <fas>{rectShapes[j].part.fas}</fas>
                            <rectShape>
                                <x>{rectShapes[j].x}</x>
                                <y>{rectShapes[j].y}</y>
                                <width>{rectShapes[j].width}</width>
                                <height>{rectShapes[j].height}</height>
                            </rectShape>
                        </part>;
                    
                    partsXML.appendChild(partXML);
                }
                partVOXML.appendChild(partsXML);
                
                partVOsXML.appendChild(partVOXML);
            }
            designXML.appendChild(partVOsXML);
            
            //Generate XML for EugeneRules
            var eugeneRulesXML:XML = <eugeneRules></eugeneRules>;
            var eugeneRules:Vector.<EugeneRule> = eugeneRuleProxy.eugeneRules;
            for (i = 0; i < eugeneRules.length; i++) {
                var eugeneRuleXML:XML = 
                    <eugeneRule>
                        <name>{eugeneRules[i].name}</name>
                        <operand1ID>{eugeneRules[i].operand1.id}</operand1ID>
                        <operator>{eugeneRules[i].compositionalOperator}</operator>
                    </eugeneRule>;
                if (eugeneRules[i].operand2 is Number) {
                    eugeneRuleXML.appendChild(<operand2Number>{eugeneRules[i].operand2}</operand2Number>);
                } else if (eugeneRules[i].operand2 is PartVO) {
                    eugeneRuleXML.appendChild(<operand2ID>{(eugeneRules[i].operand2 as PartVO).id}</operand2ID>);
                }
                
                eugeneRulesXML.appendChild(eugeneRuleXML);
            }
            designXML.appendChild(eugeneRulesXML);
            
            //Generate XML for J5Collection
            if (collectionShape != null) {
                var j5CollectionXML:XML = 
                    <j5Collection>
                        <name></name>
                        <isCircular>{collectionShape.collection.isCircular}</isCircular>
                        <j5Bins></j5Bins>
                        <collectionShape>
                            <x>{collectionShape.x}</x>
                            <y>{collectionShape.y}</y>
                            <width>{collectionShape.width}</width>
                            <height>{collectionShape.height}</height>
                        </collectionShape>
                    </j5Collection>;
                
                //Generate XML for J5Bins
                var j5Bins:Vector.<J5Bin> = collectionShape.collection.binsVector;
                for (i = 0; i < j5Bins.length; i++) {
                    var j5BinXML:XML =
                        <j5Bin>
                            <binName>{j5Bins[i].binName}</binName>
                            <dsf>{j5Bins[i].dsf}</dsf>
                        </j5Bin>;
                    if (j5Bins[i].fro != null) {
                        j5BinXML.appendChild(<fro>{j5Bins[i].fro.value}</fro>);
                    }
                    if (j5Bins[i].extra5PrimeBps != null) {
                        j5BinXML.appendChild(<extra5PrimeBps>{j5Bins[i].extra5PrimeBps.value}</extra5PrimeBps>);
                    }
                    if (j5Bins[i].extra3PrimeBps != null) {
                        j5BinXML.appendChild(<extra3PrimeBps>{j5Bins[i].extra3PrimeBps.value}</extra3PrimeBps>);
                    }
                    
                    //Generate XML for BinItems
                    var binItemsXML:XML = <binItems></binItems>;
                    var partsInBin:Vector.<Part> = j5Bins[i].binItemsVector;
                    for (j = 0; j < partsInBin.length; j++) {
                        binItemsXML.appendChild(<partID>{partsInBin[j].id}</partID>);
                    }
                    j5BinXML.appendChild(binItemsXML);
                    
                    j5CollectionXML.j5Bins.appendChild(j5BinXML);
                }
                
                designXML.appendChild(j5CollectionXML);
            }
            
            return designXML;
        }

        public static function loadDesignXMLv3(designXML:XML):void
        {
            loadSequenceFiles(designXML.sequenceFiles);
            loadPartVOs(designXML.partVOs, designXML.version);
            
            if (designXML.version == "3.0") {
                loadEugeneRulesV30(designXML.partVOs);
            } else {
                loadEugeneRulesV31(designXML.eugeneRules);
            }
            
            if (designXML.j5Collection != null && designXML.j5Collection.length() > 0) {
                loadCollection(designXML.j5Collection[0]);
            }
            
            //for grid view, determine bin icon and direction from topmost part
            var bins:Vector.<J5Bin> = j5CollectionProxy.j5Collection.binsVector;
            for (var i:int = 0; i < bins.length; i++) {
                var bin:J5Bin = bins[i];
                if (bin.binItemsVector.length > 0) {
                    var topmostPartID:String = bin.binItemsVector[0].id;
                    var topPartXML:XMLList = designXML.partVOs.descendants().part.(attribute(new QName("", "id")) == topmostPartID);
                    bin.directionForward = topPartXML[0].direction == "forward" ? true : false;
                    
                    var topPartVOXML:XML = topPartXML[0].parent().parent();
                    if (designXML.version == "3.0" || designXML.version == "3.1") {  // convert imagePath to iconID
                        var imagePath:String = topPartVOXML.imagePath;
                        imagePath = imagePath.replace("_Rotated.png", ".png");  //convert all to forward paths
                        
                        bin.iconID = SBOLvIcons.sbolv09PathToSbolv10ID(imagePath);
                        
                        if (bin.iconID == null) {
                            Alert.show("Part " + topPartVOXML.name + " is using an unrecognized SBOLv 0.9 image path " 
                                + imagePath + "\n\nConverting to generic SBOLv 1.0 icon.", "Warning Message"); //FIXME
                            bin.iconID = SBOLvIcons.GENERIC;
                        }
                    } else {
                        bin.iconID = topPartVOXML.iconID;
                    }
                    
                    //TODO: check the rest of the parts in the bin for conflicts and alert
                }
            }
            gridViewCanvasMediator.refreshHeaderGraphics();
            
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
        
        private static function loadPartVOs(partVOsXML:XMLList, version:String):void
        {
            var partVOXML:XML;
            var partVO:PartVO;
            var part:Part;
            var existingPartVO:PartVO;
            var position:Point;
            
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
        
        private static function loadEugeneRulesV30(partVOsXML:XMLList):void
        {
            var partVOXML:XML;
            
            for (var i:int = 0; i < partVOsXML.children().length(); i++) {
                partVOXML = partVOsXML.children()[i];
                
                if (partVOXML.eugeneRules != null) {
                    var eugeneRulesXML:XMLList = partVOXML.eugeneRules;
                    var eugeneRuleXML:XML;
                    var eugeneRule:EugeneRule;
                    var partVO:PartVO = partProxy.getPartVOByName(partVOXML.name);
                    
                    for (var j:int = 0; j < eugeneRulesXML.children().length(); j++) {
                        eugeneRuleXML = eugeneRulesXML.children()[j];
                        
                        try {
                            var negationOperator:Boolean;
                            var compositionalOperator:String = eugeneRuleXML.operator;
                            var operand2:*;
                            if (compositionalOperator == EugeneRule.NOTMORETHAN) {
                                negationOperator = true; //convert to NOT a MORETHAN x
                                compositionalOperator = EugeneRule.MORETHAN;
                                operand2 = Number(eugeneRuleXML.operand2);
                            } else if (compositionalOperator == EugeneRule.NOTWITH) {
                                negationOperator = true; //convert to NOT a WITH b
                                compositionalOperator = EugeneRule.WITH;
                                operand2 = partProxy.getPartVOByName(eugeneRuleXML.operand2);
                            } else if (compositionalOperator == EugeneRule.WITH) {
                                negationOperator = false; //convert to a THEN b
                                compositionalOperator = EugeneRule.THEN;
                                operand2 = partProxy.getPartVOByName(eugeneRuleXML.operand2);
                            } else {
                                Alert.show("The operator " + compositionalOperator + " is not valid for a version 3 design xml. " +
                                    "Rule " + eugeneRuleXML.name + " not loaded.", "Error Message");
                                continue;
                            }
                            eugeneRuleProxy.addRule(eugeneRuleXML.name, negationOperator, partVO, compositionalOperator, operand2);
                        } catch (error:Error) {
                            Alert.show(error.toString() + "\n\nRule has not been loaded", "Error Message");
                        }
                    }
                }
            }
        }
        
        private static function loadEugeneRulesV31(eugeneRulesXML:XMLList):void
        {
            var eugeneRuleXML:XML;
            
            for (var i:int = 0; i < eugeneRulesXML.children().length(); i++) {
                eugeneRuleXML = eugeneRulesXML.children()[i];
                
                try {
                    var negationOperator:Boolean;
                    var operand1:PartVO = partProxy.getPartVOById(eugeneRuleXML.operand1ID);
                    var compositionalOperator:String = eugeneRuleXML.operator;
                    var operand2:*;
                    if (compositionalOperator == EugeneRule.NOTMORETHAN) {
                        negationOperator = true; //convert to NOT a MORETHAN x
                        compositionalOperator = EugeneRule.MORETHAN;
                        operand2 = Number(eugeneRuleXML.operand2Number);
                    } else if (compositionalOperator == EugeneRule.NOTWITH) {
                        negationOperator = true; //convert to NOT a WITH b
                        compositionalOperator = EugeneRule.WITH;
                        operand2 = partProxy.getPartVOById(eugeneRuleXML.operand2ID);
                    } else if (compositionalOperator == EugeneRule.WITH) {
                        negationOperator = false; //convert to a THEN b
                        compositionalOperator = EugeneRule.THEN;
                        operand2 = partProxy.getPartVOById(eugeneRuleXML.operand2ID);
                    } else {
                        Alert.show("The operator " + compositionalOperator + " is not valid for a version 3 design xml. " +
                            "Rule " + eugeneRuleXML.name + " not loaded.", "Error Message");
                        continue;
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
            
            //isCircular property introduced in v3.4 xml, assume circular for all earlier versions
            if (j5CollectionXML.hasOwnProperty("isCircular")) {
                j5Collection.isCircular = stringToBool(j5CollectionXML.isCircular);
            }
            
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
        }
        
        private static function loadBin(bin:J5Bin, j5BinXML:XML, binNum:int):void
        {
            //Load the bin properties
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
                var part:Part = partProxy.getPartById(partIDsXML[i]);
                j5CollectionProxy.addToBin(part, binNum, i);
                gridViewCanvasMediator.addPart(part, binNum, i);
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
                    //find the first non-empty part associated with the partVO and add to part holding area
                    for (j = 0; j < allParts.length; j++) {
                        if (allParts[j].partVO == allPartVOs[i] && !allParts[j].isEmpty()) {
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