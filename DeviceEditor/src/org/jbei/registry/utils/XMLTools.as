package org.jbei.registry.utils
{
    import flash.events.Event;
    import flash.events.IOErrorEvent;
    import flash.geom.Point;
    import flash.net.FileReference;
    import flash.utils.ByteArray;
    
    import mx.collections.ArrayCollection;
    import mx.controls.Alert;
    
    import org.jbei.registry.ApplicationFacade;
    import org.jbei.registry.Constants;
    import org.jbei.registry.Notifications;
    import org.jbei.registry.SBOLvIcons;
    import org.jbei.registry.commands.FunctionMediator;
    import org.jbei.registry.models.EugeneRule;
    import org.jbei.registry.models.Part;
    import org.jbei.registry.models.PartVO;
    import org.jbei.registry.models.SequenceFile;
    import org.jbei.registry.models.j5.J5Bin;
    import org.jbei.registry.proxies.EugeneRuleProxy;
    import org.jbei.registry.proxies.PartProxy;
    import org.jbei.registry.proxies.SequenceFileProxy;
    import org.jbei.registry.view.ui.canvas.CenterCanvas;
    import org.jbei.registry.view.ui.shapes.CollectionShape;
    import org.jbei.registry.view.ui.shapes.RectShape;

    public class XMLTools
    {
        private static var sequenceFileProxy:SequenceFileProxy = ApplicationFacade.getInstance().retrieveProxy(SequenceFileProxy.NAME) as SequenceFileProxy;
        private static var partProxy:PartProxy = ApplicationFacade.getInstance().retrieveProxy(PartProxy.NAME) as PartProxy;
        private static var eugeneRuleProxy:EugeneRuleProxy = ApplicationFacade.getInstance().retrieveProxy(EugeneRuleProxy.NAME) as EugeneRuleProxy;
        //TODO convert to grid view
//        private static var centerCanvasMediator:CenterCanvasMediator = ApplicationFacade.getInstance().retrieveMediator(CenterCanvasMediator.NAME) as CenterCanvasMediator;
        private static var functionMediator:FunctionMediator = ApplicationFacade.getInstance().retrieveMediator(FunctionMediator.NAME) as FunctionMediator;
                
        public function XMLTools()
        {
        }
        
        [Deprecated(replacement="XMLToolsV3.generateDesignXML")]
        public static function generateDesignXML(allRectShapes:Vector.<RectShape>, collectionShape:CollectionShape):XML
        {
            var designXML:XML = <design></design>; //FIXME: add default xml namespace (done in version 3+)
            var versionXML:XML = <version>2.3</version>;
            var sequenceFilesXML:XML = <sequenceFiles></sequenceFiles>;
            var partVOsXML:XML = <partVOs></partVOs>;
            
            //Generate XML for SequenceFiles
            var sequenceFiles:Vector.<SequenceFile> = sequenceFileProxy.sequenceFiles;
            for (var i:int = 0; i < sequenceFiles.length; i++) {
                var sequenceFileXML:XML =
                    <sequenceFile hash={sequenceFiles[i].hash}>
                        <format>{sequenceFiles[i].sequenceFileFormat}</format>
                        <content></content>
                        <fileName>{sequenceFiles[i].sequenceFileName}</fileName>
                        <partSource>{sequenceFiles[i].partSource}</partSource>
                    </sequenceFile>;
                
                sequenceFileXML.content.appendChild(new XML("<![CDATA[" + sequenceFiles[i].sequenceFileContent.toString() + "]]>"));

                sequenceFilesXML.appendChild(sequenceFileXML);
            }
            
            //Generate XML for PartVOs
            var partVOs:Vector.<PartVO> = partProxy.partVOs;
            for (i = 0; i < partVOs.length; i++) {
                var partVOXML:XML =
                    <partVO id={partVOs[i].id}>
                        <name>{partVOs[i].name}</name>
                        <revComp>{partVOs[i].revComp}</revComp>
                        <startBP>{partVOs[i].genbankStartBP}</startBP>
                        <stopBP>{partVOs[i].endBP}</stopBP>
                        <sequence></sequence>
                        <sequenceFileHash>{partVOs[i].sequenceFile != null ? partVOs[i].sequenceFile.hash : ""}</sequenceFileHash>
                        <eugeneRules></eugeneRules>
                        <parts></parts>
                    </partVO>;
                
                //Generate XML for EugeneRules
                var eugeneRules:Vector.<EugeneRule> = eugeneRuleProxy.getRulesByPartVO(partVOs[i]);
                for (var j:int = 0; j < eugeneRules.length; j++) {
                    var eugeneRuleXML:XML = 
                        <eugeneRule>
                            <name>{eugeneRules[j].name}</name>
                            <operator>{eugeneRules[j].compositionalOperator}</operator>
                            <operand2>{eugeneRules[j].operand2 is PartVO ? PartVO(eugeneRules[j].operand2).name : eugeneRules[j].operand2}</operand2>
                        </eugeneRule>;
                    
                    partVOXML.eugeneRules.appendChild(eugeneRuleXML);
                }
                
                //Generate XML for Parts and RectShapes
                var rectShapes:Vector.<RectShape> = new Vector.<RectShape>;
                for (j = 0; j < allRectShapes.length; j++) {
                    if (allRectShapes[j].part.partVO == partVOs[i]) {
                        rectShapes.push(allRectShapes[j]);
                    }
                }
                
                for (j = 0; j < rectShapes.length; j++) {
                    var partXML:XML =
                        <part id={rectShapes[j].part.id}>
                            <direction>{rectShapes[j].part.directionForward ? "forward" : "reverse"}</direction>
                            <fas>{rectShapes[j].part.fas}</fas>
                            <imagePath>{SBOLvIcons.getIconPath(rectShapes[j].part.iconID, rectShapes[j].part.directionForward)}</imagePath>
                            <rectShape>
                                <x>{rectShapes[j].x}</x>
                                <y>{rectShapes[j].y}</y>
                                <width>{rectShapes[j].width}</width>
                                <height>{rectShapes[j].height}</height>
                            </rectShape>
                        </part>;
                    
                    partVOXML.parts.appendChild(partXML);
                }
                
                partVOsXML.appendChild(partVOXML);
            }
            
            //Generate XML for J5Collection
            var collectionXML:XML;
            if (collectionShape == null) {
                collectionXML = <collection/>;
            } else {
                collectionXML =
                    <collection>
                        <x>{collectionShape.x}</x>
                        <y>{collectionShape.y}</y>
                        <height>{collectionShape.height}</height>
                        <width>{collectionShape.width}</width>
                        <j5Collection>
                            <name></name>
                            <initialized>true</initialized>
                            <j5Ready>{collectionShape.collection.j5Ready}</j5Ready>
                            <combinatorial>{collectionShape.collection.combinatorial}</combinatorial>
                            <j5Bins></j5Bins>
                        </j5Collection>
                    </collection>;
                
                //Generate XML for J5Bins
                var j5Bins:Vector.<J5Bin> = collectionShape.collection.binsVector;
                for (i = 0; i < j5Bins.length; i++) {
                    var j5BinXML:XML =
                        <j5Bin>
                            <binName>{collectionShape.collection.binsVector[i].binName}</binName>
                            <dsf>{collectionShape.collection.binsVector[i].dsf}</dsf>
                            <fro>{collectionShape.collection.binsVector[i].fro != null ? collectionShape.collection.binsVector[i].fro.value : -8675309}</fro>
                            <fas>{collectionShape.collection.binsVector[i].fas}</fas>
                            <binItems></binItems>
                        </j5Bin>;
                    
                    //Generate XML for BinItems
                    var partsInBin:Vector.<Part> = collectionShape.collection.binsVector[i].binItemsVector;
                    for (j = 0; j < partsInBin.length; j++) {
                        j5BinXML.binItems.appendChild(<partID>{partsInBin[j].id}</partID>);
                    }
                    
                    collectionXML.j5Collection.j5Bins.appendChild(j5BinXML);
                }
            }
            
            //Add everything to designXML
            designXML.appendChild(versionXML);
            designXML.appendChild(sequenceFilesXML);
            designXML.appendChild(partVOsXML);
            designXML.appendChild(collectionXML);
            
            return designXML;
        }
        
        public static function loadDesignXML(designXML:XML):void
        {
            var de:Namespace = new Namespace("de", "http://jbei.org/device_editor");
            
            if (designXML.namespace() == de) {
                if (designXML.de::version >= 4) {
                    XMLToolsV4.loadDesignXMLv4(designXML);
                } else if (designXML.de::version >= 3) {
                    XMLToolsV3.loadDesignXMLv3(designXML);
                } else {
                    Alert.show("Invalid design XML", "Error message");
                }
            } else if (designXML.version >= 2 && designXML.version < 3) {
                Alert.show("Support for loading older design XML files coming shortly.  Sorry for the inconvenience.", "Alert");
                //TODO convert to grid view
                //loadXMLv2(designXML);
            } else {
                Alert.show("Support for loading older design XML files coming shortly.  Sorry for the inconvenience.", "Alert");
                //TODO convert to grid view
                //loadOldXML(designXML);
            }
        }
        
        private static function loadXMLv2(designXML:XML):void
        {
            //Load the SequenceFiles
            var sequenceFilesXML:XMLList = designXML.sequenceFiles;
            for (var i:int = 0; i < sequenceFilesXML.children().length(); i++) {
                try {
                    var fileName:String = sequenceFilesXML.children()[i].fileName;
                    if (sequenceFilesXML.children()[i].format == Constants.FASTA) {  // check on FASTA
                        if (!fileName.match(/\./)) {  // if the filename doesn't have an extension (actually assumes if there is a dot, the filename has an extension)
                            fileName = fileName + ".fas";
                        }
                    }
                    sequenceFileProxy.addSequenceFile(sequenceFilesXML.children()[i].format, sequenceFilesXML.children()[i].content, fileName);
                } catch (error:Error) {
                    Alert.show(error.toString(), "Error Message");
                }
            }
            
            //Load the PartVOs
            var partVOsXML:XMLList = designXML.partVOs;
            var partVOXML:XML;
            var partVO:PartVO;
            var part:Part;
            var rectShape:RectShape;
            var existingPartVO:PartVO;
            var position:Point;
            var extraDigits:String;
            for (i = 0; i < partVOsXML.children().length(); i++) {
                partVOXML = partVOsXML.children()[i];
                
                partVO = new PartVO();
                partVO.id = partVOXML.@id;
                if (designXML.version < 2.3) {
                    // reset IDs for partVOs loaded from XML version 2 (original IDs are too short)
                    // turns out full timestamp is not sufficient either, reset IDs from all versions lower than 2.3
                    extraDigits = Math.floor(1000 * Math.random()).toString();
                    while (extraDigits.length < 3) {
                        extraDigits = "0" + extraDigits;
                    }
                    
                    partVO.id = (new Date).time.toString() + extraDigits;
                }
                partVO.name = partVOXML.name != null ? partVOXML.name : "";
                partVO.revComp = stringToBool(partVOXML.revComp);
                partVO.genbankStartBP = Number(partVOXML.startBP);
                partVO.endBP = Number(partVOXML.stopBP);
                
                if (partVOXML.sequenceFileHash != null) {
                    partVO.sequenceFile = sequenceFileProxy.getItemByHash(partVOXML.sequenceFileHash);
                }
                
                //Load the Parts and RectShapes
                var partsXML:XMLList = partVOXML.parts;
                var partXML:XML;
                for (j = 0; j < partsXML.children().length(); j++) {
                    partXML = partsXML.children()[j];
                    
                    // convert imagePath to iconID, just need to do this once per partVO
                    if (j == 0) {
                        var imagePath:String = partXML.imagePath;
                        imagePath = imagePath.replace("org/jbei/registry/view/assets/icons/", "");  //shorten all paths
                        imagePath = imagePath.replace("_Rotated.png", ".png");  //convert all to forward paths
                        
                        partVO.iconID = SBOLvIcons.sbolv09PathToSbolv10ID(imagePath);
                        
                        if (partVO.iconID == null) {
                            Alert.show("Part " + partVO.name + " is using a deprecated or unrecognized SBOLv 0.9 image path " 
                                + imagePath + "\n\nConverting to generic SBOLv 1.0 icon.", "Warning Message");
                            partVO.iconID = SBOLvIcons.GENERIC;
                        }
                    }
                    
                    part = partProxy.createPart(partVO);
                    part.id = partXML.@id;
                    if (designXML.version < 2.3) {
                        // reset IDs for parts loaded from XML version 2 (original IDs are too short)
                        // turns out full timestamp is not sufficient either, reset IDs from all versions lower than 2.3
                        extraDigits = Math.floor(1000 * Math.random()).toString();
                        while (extraDigits.length < 3) {
                            extraDigits = "0" + extraDigits;
                        }
                        
                        part.id = (new Date).time.toString() + extraDigits;
                    }
                    part.directionForward = partXML.direction == "forward" ? true : false;
                    part.fas = partXML.fas;
                    
                    position = new Point(partXML.rectShape.x, partXML.rectShape.y);
                    //TODO convert to grid view
//                    rectShape = centerCanvasMediator.createRectShape(position, part, false);
//                    
//                    rectShape.width = partXML.rectShape.width;
//                    rectShape.height = partXML.rectShape.height;
//                    rectShape.setLabel();
//                    rectShape.updateLabel();
                }
            }
                
            //Load the EugeneRules (must be done after all PartVOs have been loaded)
            var allPartVOs:Vector.<PartVO> = partProxy.partVOs;
            for (i = 0; i < partVOsXML.children().length(); i++) {
                partVOXML = partVOsXML.children()[i];
                
                if (partVOXML.eugeneRules != null) {
                    var eugeneRulesXML:XMLList = partVOXML.eugeneRules;
                    var eugeneRuleXML:XML;
                    var eugeneRule:EugeneRule;
                    partVO = partProxy.getPartVOByName(partVOXML.name);
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
            
            //Load the Collection
            var collectionShapeXML:XMLList = designXML.collection;
            if (collectionShapeXML.children()[0] != null) {
                position = new Point(collectionShapeXML.x, collectionShapeXML.y);
                //TODO convert to grid view
/*                var collectionShape:CollectionShape = centerCanvasMediator.createNewCollectionShape(position, collectionShapeXML.width, collectionShapeXML.height);
                
                var j5CollectionXML:XMLList = collectionShapeXML.j5Collection;
                collectionShape.collection.name = j5CollectionXML.name;
                collectionShape.setTextLabel();
                collectionShape.textLabelValue(j5CollectionXML.name);
                collectionShape.collection.initialized = j5CollectionXML.initialized;
                collectionShape.collection.j5Ready = j5CollectionXML.j5Ready;
                collectionShape.collection.combinatorial = j5CollectionXML.combinatorial;
                
                (centerCanvasMediator.getViewComponent() as CenterCanvas).gridCanvas.addChild(collectionShape);
                
                //Load the bins
                var j5BinsXML:XMLList = j5CollectionXML.j5Bins.children();
                var bin:J5Bin;
                var partIDsXML:XMLList;
                for (i = 0; i < j5BinsXML.length(); i++) {
                    bin = loadBin(collectionShape, j5BinsXML[i]);  //function from load old XML
                    
                    if (designXML.version >= 2.3) {  // cannot assume unique Part IDs through v2.2, thus should not rely on getPartByID
                        partIDsXML = j5BinsXML[i].binItems.children();
                        for (j = 0; j < partIDsXML.length(); j++) {
                            part = partProxy.getPartById(partIDsXML[j]);
                            bin.addToBin(part, j);  // parts in bin are listed in order in XML version 2.1 or higher
                            //FIXME: are xml elements guaranteed to be read back in order though?
                        }
                    }
                }
                
                collectionShape.createBinLines();
                
                if (designXML.version < 2.3) {
                    // original partIDs are too short in version 2 XML and cannot be trusted to be unique, must determine bins using coordinates
                    // turns out full timestamp is not sufficiently unique either, use coordinates for all versions lower than 2.3
                    for (i = 0; i < centerCanvasMediator.rectShapes.length; i ++) {
                        rectShape = centerCanvasMediator.rectShapes[i];
                        if (rectShape.x >= collectionShape.x && rectShape.x <= collectionShape.x + collectionShape.width
                            && rectShape.y >= collectionShape.y && rectShape.y <= collectionShape.y + collectionShape.height) {
                            var shapeCenterX:Number = rectShape.x + (rectShape.width / 2);
                            var shapeCenterY:Number = rectShape.y + (rectShape.height / 2);
                            bin = collectionShape.whichBin(rectShape.parent.localToGlobal(new Point(shapeCenterX, shapeCenterY)));
                            var binPosition:uint = functionMediator.determinePositionInBin(rectShape, bin);
                            bin.addToBin(rectShape.part, binPosition);
                        }
                    }
                }
                
                collectionShape.calculateMinHeight();
                collectionShape.calculateMinWidth();
                if (collectionShape.height < collectionShape.minHeight) {
                    collectionShape.height = collectionShape.minHeight;
                }
                if (collectionShape.width < collectionShape.minWidth) {
                    collectionShape.width = collectionShape.minWidth;
                }
                centerCanvasMediator.adjustRectShapesOnCollectionShapeResizing(collectionShape);
                
                collectionShape.fixBinLines();
                collectionShape.addLabels();
                collectionShape.moveToBack();
                
                for (i = 0; i < collectionShape.collection.binCount(); i++) {
                    functionMediator.checkBinRules(collectionShape.collection.binsArray[i]);
                }
                functionMediator.setUpCollection();
*/
            }
        }
        
        private static function isExistingEugeneRule(eugeneRules:ArrayCollection, eugeneRuleXML:XML):Boolean
        {
            for (var i:int = 0; i < eugeneRules.length; i++) {
                var eugeneRule:EugeneRule = eugeneRules[i] as EugeneRule;
                if (eugeneRule.name == eugeneRuleXML.name) {
                    if (eugeneRule.compositionalOperator != eugeneRuleXML.operator ||
                        (eugeneRule.compositionalOperator == EugeneRule.NOTMORETHAN && eugeneRules[i].operand2 != eugeneRuleXML.operand2) ||
                        ((eugeneRule.compositionalOperator == EugeneRule.NOTWITH || eugeneRule.compositionalOperator == EugeneRule.WITH) && (eugeneRule.operand2 as PartVO).name != eugeneRuleXML.operand2)) {
                        Alert.show("A different Eugene Rule with the same name already exists.\nRule " + eugeneRuleXML.name + " not being loaded.", "Warning Message");
                    }
                    return true;
                }
            }
            return false;
        }
        
        /* Load from old XML ************************************** */
        
        private static function loadOldXML(loadXML:XML):void
        {
            //populate the canvas collections
            var collectionXML:XMLList = loadXML.collections.children();
            var collectionShape:CollectionShape;
            for(index = 0; index<collectionXML.length(); index++)
            {
                if (index == 1) {
                    Alert.show("File contains more than one collection.\nOnly one collection will be loaded.", "Warning Message");
                    break;
                }
                var collection:XML = collectionXML[index];
                try {
                    collectionShape = loadCollection(collection);
                } catch (error:Error) {
                    Alert.show(error.toString(), "Error Message");
                }
            }
            
            //populate the canvas icons
            var partsXML:XMLList = loadXML.icons.children();
            var index:int;
            for(index = 0; index<partsXML.length(); index++)
            { 
                var partXML:XML = partsXML[index];
                loadPart(partXML);
            }
            
            //things to do at the end
            if (collectionShape != null) {
                collectionShape.calculateMinHeight();
                collectionShape.calculateMinWidth();
                if (collectionShape.height < collectionShape.minHeight) {
                    collectionShape.height = collectionShape.minHeight;
                }
                if (collectionShape.width < collectionShape.minWidth) {
                    collectionShape.width = collectionShape.minWidth;
                }
                //TODO convert to grid view
//                centerCanvasMediator.adjustRectShapesOnCollectionShapeResizing(collectionShape);
                
                collectionShape.fixBinLines();
                collectionShape.addLabels();
                collectionShape.moveToBack();
                
                for (var i:int = 0; i < collectionShape.collection.binCount(); i++) {
                    functionMediator.checkBinRules(collectionShape.collection.binsVector[i]);
                }
                functionMediator.setUpCollection();
            }
        }
        
        private static function loadPart(partXML:XML):void
        {
            //retrieve the location
            var point:Point = new Point(partXML.x, partXML.y);
            
            //create PartVO
            var partVO:PartVO = new PartVO();
            
            //restore sequenceFile and sequence, if present
            if (partXML.j5.genbank == "null" && partXML.j5.fasta == "null") { 
                partVO.sequenceFile = null;
            } else {
                var fileFormat:String = (partXML.j5.sourceType != "null" ? partXML.j5.sourceType : null);
                var fileName:String = (partXML.j5.sourceFileName != "null" ? partXML.j5.sourceFileName : "");
                var fileContent:String;
                if (partXML.j5.genbank != "null") {
                    fileContent = partXML.j5.genbank;
                } else if (partXML.j5.fasta != "null") {
                    fileContent = partXML.j5.fasta;
                }
                
                try {
                    partVO.sequenceFile = sequenceFileProxy.addSequenceFile(fileFormat, fileContent, fileName);
                } catch (error:Error) {
                    Alert.show(error.toString(), "Error Message");
                }
            }
            
            //restore j5 info
            if (partXML.j5.name == "null") {
                partVO.name = "";
            } else {
                partVO.name = partXML.j5.name;
            }
            
            partVO.revComp = stringToBool(partXML.j5.revComp);		
            partVO.genbankStartBP = partXML.j5.startBP;
            partVO.endBP = partXML.j5.stopBP;
            
            //convert imagePath to iconID
            var imagePath:String = partXML.imagePath;
            imagePath = imagePath.replace("org/jbei/registry/view/assets/icons/", "");  //shorten all paths
            imagePath = imagePath.replace("_Rotated.png", ".png");  //convert all to forward paths
            
            partVO.iconID = SBOLvIcons.sbolv09PathToSbolv10ID(imagePath);
            
            if (partVO.iconID == null) {
                Alert.show("Part " + partVO.name + " is using a deprecated or unrecognized SBOLv 0.9 image path " 
                    + imagePath + "\n\nConverting to generic SBOLv 1.0 icon.", "Warning Message");
                partVO.iconID = SBOLvIcons.GENERIC;
            }
            
            //look for existing PartVO
            var existingPartVOs:Vector.<PartVO> = partProxy.partVOs;
            for (var i:int = 0; i < existingPartVOs.length; i++) {
                if (partVO.name == existingPartVOs[i].name) {
                    if (!partVO.isEqual(existingPartVOs[i])) {
                        Alert.show("A different part with the same name already exists.\n" + partVO.name + " not being loaded.", "Warning Message");
                        return;
                    }
                    partVO = existingPartVOs[i]; //this should automatically free the created duplicate PartVO for garbage collection
                    break;
                }
            }
            
            //create Part
            var part:Part = partProxy.createPart(partVO);
            
            //restore direction and FAS
            part.directionForward = stringToBool(partXML.j5.direction);
            part.fas = partXML.j5.fas;	
            
            //backward compatibility fix
            if (part.fas == "None")
                part.fas = "";

            //TODO convert to grid view
/*            //create RectShape
            var newShape:RectShape = centerCanvasMediator.createRectShape(point, part, false);
            
            //The if statement is for backward compatibility before we started saving sizes
            if(partXML.height.children()[0] != null && partXML.width.children()[0] != null)
            {
                newShape.width = partXML.width;
                newShape.height = partXML.height;
            }
            
            //restore label
            newShape.setLabel();
            newShape.updateLabel();
            
            //put part in bin if appropriate
            var collectionShape:CollectionShape = centerCanvasMediator.collectionShape;
            if (collectionShape != null 
                && newShape.x >= collectionShape.x && newShape.x <= collectionShape.x + collectionShape.width
                && newShape.y >= collectionShape.y && newShape.y <= collectionShape.y + collectionShape.height) {
                var shapeCenterX:Number = newShape.x + (newShape.width / 2);
                var shapeCenterY:Number = newShape.y + (newShape.height / 2);
                var bin:J5Bin = collectionShape.whichBin(newShape.parent.localToGlobal(new Point(shapeCenterX, shapeCenterY)));
                var position:uint = functionMediator.determinePositionInBin(newShape, bin);
                bin.addToBin(part, position);
            }
*/
        }
        
        //Function to load a collection based on its XML
        private static function loadCollection(collection:XML):CollectionShape
        {
            //restore the location and size
            var point:Point = new Point(collection.x, collection.y);
            //TODO convert to grid view
/*            var newCollection:CollectionShape = centerCanvasMediator.createNewCollectionShape(point, collection.width, collection.height);
            
            //restore the j5 collection info
            newCollection.setTextLabel();
            newCollection.textLabelValue(collection.j5Collection.name);	
            newCollection.collection.name = collection.j5Collection.name;
            newCollection.collection.initialized = stringToBool(collection.j5Collection.initialized);
            newCollection.collection.j5Ready = stringToBool(collection.j5Collection.j5Ready);
            newCollection.collection.combinatorial = stringToBool(collection.j5Collection.combinatorial);
            
            //Standard addition pieces
            (centerCanvasMediator.getViewComponent() as CenterCanvas).gridCanvas.addChild(newCollection);
            
            //now restore all of the bins
            var binsXML:XMLList = collection.j5Collection.bins.children();
            for(var index:int = 0; index<binsXML.length(); index++)
            {
                var bin:XML = binsXML[index];
                loadBin(newCollection, bin);
            }
            
            //Final steps
            newCollection.createBinLines();

            return newCollection;
*/
            return null; //TODO convert to grid view
        }
        
        private static function loadBin(collShape:CollectionShape, bin:XML):J5Bin
        {
            //TODO convert to grid view
/*            //set the name
            var newBin:J5Bin = centerCanvasMediator.createNewJ5Bin(bin.binName, collShape.collection);
            
            //fas, fro, dsf
            newBin.dsf = stringToBool(bin.dsf);
            newBin.fas = bin.fas;
            if (bin.fro != null && bin.fro.length() > 0 && bin.fro != "" && bin.fro != -8675309 && bin.fro != "unspecified") { //if not something that translates to null
                if (bin.fro.match(/^-?\d+$/)) { //if integer
                    newBin.fro = new NullableInt(int(bin.fro));
                } else {
                    Alert.show("Could not load FRO for bin " + bin.binName + ": " + bin.fro + " is not an integer.", "Warning Message");
                }
            }
            
            return newBin;
*/
            return null; //TODO convert to grid view
            }
        
        //Helper function for loading from XML
        private static function stringToBool(s:String):Boolean
        {
            if (s.toLowerCase() == "true")
                return true;
            else
                return false;
        }
        
    }
}