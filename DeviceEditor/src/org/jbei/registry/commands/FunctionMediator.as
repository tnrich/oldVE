package org.jbei.registry.commands
{
    import com.degrafa.paint.SolidStroke;
    
    import flash.utils.ByteArray;
    import flash.utils.Endian;
    
    import mx.collections.ArrayCollection;
    import mx.controls.Alert;
    
    import nochump.util.zip.ZipEntry;
    import nochump.util.zip.ZipFile;
    
    import org.jbei.registry.ApplicationFacade;
    import org.jbei.registry.Constants;
    import org.jbei.registry.Notifications;
    import org.jbei.registry.mediators.GridViewCanvasMediator;
    import org.jbei.registry.mediators.MainCanvasMediator;
    import org.jbei.registry.models.EugeneRule;
    import org.jbei.registry.models.Part;
    import org.jbei.registry.models.PartVO;
    import org.jbei.registry.models.SequenceFile;
    import org.jbei.registry.models.j5.J5Bin;
    import org.jbei.registry.models.j5.J5Collection;
    import org.jbei.registry.proxies.EntryServiceProxy;
    import org.jbei.registry.proxies.EugeneRuleProxy;
    import org.jbei.registry.proxies.J5CollectionProxy;
    import org.jbei.registry.proxies.PartProxy;
    import org.jbei.registry.proxies.SequenceFileProxy;
    import org.jbei.registry.utils.NullableInt;
    import org.jbei.registry.view.ui.shapes.RectShape;
    import org.puremvc.as3.patterns.mediator.Mediator;
    
    //FIXME: this is just a temporary place to put stuff that should go into commands
    public class FunctionMediator extends Mediator
    {
        public static const NAME:String = "FunctionMediator";
        
        public var mainCanvasMediator:MainCanvasMediator = ApplicationFacade.getInstance().retrieveMediator(MainCanvasMediator.NAME) as MainCanvasMediator;
        public var gridViewCanvasMediator:GridViewCanvasMediator = ApplicationFacade.getInstance().retrieveMediator(GridViewCanvasMediator.NAME) as GridViewCanvasMediator;
        public var partProxy:PartProxy = ApplicationFacade.getInstance().retrieveProxy(PartProxy.NAME) as PartProxy;
        public var sequenceFileProxy:SequenceFileProxy = ApplicationFacade.getInstance().retrieveProxy(SequenceFileProxy.NAME) as SequenceFileProxy;
        public var eugeneRuleProxy:EugeneRuleProxy = ApplicationFacade.getInstance().retrieveProxy(EugeneRuleProxy.NAME) as EugeneRuleProxy;
        public var j5CollectionProxy:J5CollectionProxy = ApplicationFacade.getInstance().retrieveProxy(J5CollectionProxy.NAME) as J5CollectionProxy;
        
        private static var loadBinAlertMessage:String;

        public function FunctionMediator(viewComponent:Object=null)
        {
            super(NAME, viewComponent);
        }
        
        /**
         * Checks if the collection is combinatorial and if it is j5 ready
         */
        public function setUpCollection():void
        {
            var collection:J5Collection = j5CollectionProxy.j5Collection;

            if (collection != null) {
                checkCombinatorial(collection);
                checkJ5Ready(collection);
            }
        }
        
        /**
         * Checks if there is more than one part in any bin of the collection 
         * and sets the combinatorial flag for the collection accordingly. 
         * The combinatorial flag for the collection is set to true if any bin 
         * contains more than one part, otherwise it is set to false. 
         * 
         * @param collection  The j5Collection for which to check if combinatorial
         */
        private function checkCombinatorial(collection:J5Collection):void
        {
            //TODO: convert to grid view (actually move or remove, does not belong here)
//            var combStroke:SolidStroke = new SolidStroke();
//            combStroke.color = Colors.COMBIN_PURPLE;
//            combStroke.weight = 1;
//            
//            var notCombStroke:SolidStroke= new SolidStroke();
//            notCombStroke.color = Colors.COLLECTION_BLUE;
//            notCombStroke.weight = 1;
            
            for (var binNum:int = 0; binNum < collection.binCount(); binNum++)
            {
                var bin:J5Bin = collection.binsVector[binNum];
                
                if (countNonEmptyParts(bin) > 1) {
                    collection.combinatorial = true;
                    //TODO: convert to notification??
//                    collectionShape.setVertLineStroke(combStroke);
                    return;
                }
            }
            collection.combinatorial = false;
            //TODO: convert to notification??
//            collectionShape.setVertLineStroke(notCombStroke);
            return;
        }
        
        /**
         * Checks if each bin has at least one part and if all parts are mapped 
         * and have sequences, and sets the j5Ready flag for the collection 
         * accordingly. The j5Ready flag is set to true if the above conditions 
         * are satisfied, otherwise it is set to false. 
         * 
         * @param collection  The j5Collection for which to check if j5 ready
         */
        private function checkJ5Ready(collection:J5Collection):void
        {
            for (var i:int = 0; i < collection.binCount(); i++)
            {
                var bin:J5Bin = collection.binsVector[i];
                var binItems:Vector.<Part> = bin.binItemsVector;
                
                if (countNonEmptyParts(bin) == 0)
                {
                    collection.j5Ready = false;
                    //TODO: convert to notification??
//                    collectionShape.setStroke(Colors.COLLECTION_BLUE); //notReadyStroke
                    return;
                }
                
                for(var j:int = 0; j < binItems.length; j++)
                {
                    var part:Part = binItems[j];
                    if (!part.isEmpty() && part.hasSequence == false) //if non-empty part has no sequence
                    {
                        collection.j5Ready = false;
                        //TODO: convert to notification??
//                        collectionShape.setStroke(Colors.COLLECTION_BLUE); //notReadyStroke
                        return;
                    }
                }			
            }
            collection.j5Ready = true;
            //TODO: convert to notification??
//            collectionShape.setStroke(Colors.COLLECTION_GREEN); //readyStroke
            return;
        }
        
        private function countNonEmptyParts(bin:J5Bin):int
        {
            var count:int = 0;
            
            for (var i:int = 0; i < bin.binItemsVector.length; i++) {
                if (!bin.binItemsVector[i].isEmpty()) {
                    count++;
                }
            }
            
            return count;
        }
        
        /* Load from J5 files ********************************* */
        
        public function parseSeqCSV(inputString:String):ArrayCollection
        {
            
            var linesArray:Array = inputString.split(/\R/);
            var seqListInfo:ArrayCollection = new ArrayCollection();
            //parse first line (header)
            var header:Array = linesArray[0].split(/,\s*/);//(/,(?=(?:[^\"]*\”[^\"]*\”)*(?![^\"]*\”)/g);
            
            //check for a legit header for j5 seq files
            if(header.length != 2) 
            {
                return null;
            }
            if(header[0] != "Sequence File Name" || header[1] != "Format")
            {
                return null;
            }
            
            //go through all the lines to create the list of sequence files and formats
            for(var i:int=1; i<linesArray.length; i++)
            {
                
                if(linesArray[i] != "")
                {
                    var line:Array = linesArray[i].split(/,\s*/);
                    
                    if(line.length != 2) 
                    {
                        return null;
                    }
                    if(line[1] != Constants.GENBANK && line[1] != Constants.FASTA && line[1] != Constants.JBEI_SEQ)
                    {
                        return null;
                    }
                    
                    seqListInfo.addItem({fileName:line[0], format:line[1]});
                }
            }
            
            return seqListInfo;
        }
        
        public function parsePartCSV(inputString:String):ArrayCollection
        {
            var linesArray:Array = inputString.split(/\R/);
            var partListInfo:ArrayCollection = new ArrayCollection();
            //parse first line (header)
            var header:Array = linesArray[0].split(/,\s*/);//(/,(?=(?:[^\"]*\”[^\"]*\”)*(?![^\"]*\”)/g);
            
            //check for a legit header for j5 seq files
            if(header.length != 5) 
            {
                return null;
            }
            if(header[0] != "Part Name" || header[1] != "Part Source (Sequence Display ID)" ||
                header[2] != "Reverse Compliment?" || header[3] != "Start (bp)" ||
                header[4] != "End (bp)")
            {
                return null;
            }
            
            //go through all the lines to create the list of sequence files and formats
            for(var i:int=1; i<linesArray.length; i++)
            {
                if(linesArray[i] != "")
                {
                    var line:Array = linesArray[i].split(/,\s*/);
                    
                    if(line.length != 5) 
                    {
                        return null;
                    }
                    if(line[2] != "TRUE" && line[2] != "FALSE")
                    {
                        return null;
                    }
                    
                    partListInfo.addItem({name:line[0], source:line[1], revComp:line[2], sBP:line[3], stBP:line[4]});
                }
            }
            
            return partListInfo;
        }
        
        public function parseTargetCSV(inputString:String):ArrayCollection
        {
            var linesArray:Array = inputString.split(/\R/);
            var targetListInfo:ArrayCollection = new ArrayCollection();
            //parse first line (header)
            var header:Array = linesArray[0].split(/,\s*/);//(/,(?=(?:[^\"]*\”[^\"]*\”)*(?![^\"]*\”)/g);
            
            //check for a legit header for j5 seq files
            if(header.length < 5) //to allow for both (old and new) versions of the target part order csv
            {
                return null;
            }
            if(header[0] != "(>Bin) or Part Name" || header[1] != "Direction" ||
                header[2] != "Forced Assembly Strategy?" || header[3] != "Forced Relative Overhang Position?" ||
                header[4] != "Direct Synthesis Firewall?")
            {
                return null;
            }
            
            
            //go through all the lines to create the list of sequence files and formats
            for(var i:int=1; i<linesArray.length; i++)
            {
                
                if(linesArray[i] != "")
                {
                    
                    var line:Array = linesArray[i].split(/,\s*/);
                    
                    //basic checks
                    /*if(line.length != 5) 
                    {
                    _targetListInfo = new ArrayCollection();
                    return false;
                    }*/
                    
                    if(line[1] != "forward" && line[1] != "reverse" && line[1] != "")
                    {
                        return null;
                    }
                    
                    /*if(line[4] != "TRUE" && line[4] != "FALSE" && line[4] != "")
                    {
                    _targetListInfo = new ArrayCollection();
                    return false;
                    }*/
                    
                    var nameString:String = line[0] as String;
                    var directionString:String = "";
                    if(line[1] != null)
                        directionString = line[1];
                    var fasString:String = "";
                    if(line[2] != null)
                        fasString = line[2];
                    var froString:String = "";
                    if(line[3] != null)
                        froString = line[3];
                    var dsfString:String = "";
                    if(line[4] != null)
                        dsfString = line[4];
                    var extra5PrimeBpsString:String = "";
                    if(line[5] != null)
                        extra5PrimeBpsString = line[5];
                    var extra3PrimeBpsString:String = "";
                    if(line[6] != null)
                        extra3PrimeBpsString = line[6];

                    //check if it is a bin line or a part line
                    if(nameString.charAt(0) == '>') //bin line
                    {
                        targetListInfo.addItem({bin:"true", name:nameString.slice(1), direction:directionString, fas:fasString, 
                            fro:froString, dsf:dsfString, extra5PrimeBps:extra5PrimeBpsString, extra3PrimeBps:extra3PrimeBpsString});
                    }
                        
                    else //part line
                    {
                        targetListInfo.addItem({bin:"false", name:nameString, direction:directionString, fas:fasString, 
                            fro:froString, dsf:dsfString, extra5PrimeBps:extra5PrimeBpsString, extra3PrimeBps:extra3PrimeBpsString});
                    }	
                }						
            }
            
            if (testCombinatorial(targetListInfo) == true && targetListInfo.getItemAt(0).bin == "false") {
                //part rows exist before the first bin row, not valid j5
                //should probably throw error, but returning null to follow existing code
                return null;
            }
            
            return targetListInfo;
        }
        
        public function loadJ5Info(seqListInfo:ArrayCollection, sequenceFilesZip:ZipFile, partListInfo:ArrayCollection, targetListInfo:ArrayCollection):void
        {
            loadSequenceFiles(seqListInfo, sequenceFilesZip);
            var newPartVOs:Vector.<PartVO> = loadPartVOs(partListInfo);
            loadCollection(newPartVOs, targetListInfo);
            
            for (var i:int = 0; i < j5CollectionProxy.j5Collection.binCount(); i++) {
                sendNotification(Notifications.NEW_CHECK_BIN_FAS, j5CollectionProxy.j5Collection.binsVector[i]);
            }

            mainCanvasMediator.lastLoadString = "j5_Loaded_Collection.xml";
            sendNotification(Notifications.CHANGE_TITLE, "j5_Loaded_Collection");
            sendNotification(Notifications.NEW_UPDATE_DSF_LINES);
            sendNotification(Notifications.NEW_REFRESH_ALL_PART_RENDERERS);
            sendNotification(Notifications.NEW_UPDATE_COLLECTION_DISPLAY_INFO);
        }
        
        private function loadSequenceFiles(seqListInfo:ArrayCollection, sequenceFilesZip:ZipFile):void
        {
            var masterSequenceFileNamesHash:Object = new Object(); //key is file name, value contains full path in zip archive once found
            for each (var seqInfo:Object in seqListInfo) {
                masterSequenceFileNamesHash[seqInfo.fileName] = null;
            }
            
            var filePathRegExp:RegExp = /.*\/(.*)$/;
            var fullName:String;
            var fileName:String;
            var extractedSequenceFilesHash:Object = new Object(); //key is file name, value is file contents
            
            var numZipEntries:int = sequenceFilesZip.entries.length;
            
            //go through zip file
            for (var i:int = 0; i < numZipEntries; i++) {
                //get file name without directory structure
                fullName = (sequenceFilesZip.entries[i] as ZipEntry).name; //this includes the path from the zip root
                if (fullName.match(/\//)) { //if fullName contains a path to the file
                    fileName = filePathRegExp.exec(fullName)[1]; //extract file name
                } else { //fullName contains just the file name
                    fileName = fullName;
                }
                
                //extract file from sequences zip and add to extracted sequence files hash
                //fileName may be empty if the zipEntry is a directory, in which case, ignore the entry
                //also ignore if fileName is not included in the master sequence list
                if (fileName != "" && masterSequenceFileNamesHash.hasOwnProperty(fileName)) {
                    if (extractedSequenceFilesHash.hasOwnProperty(fileName)) {
                        Alert.show("File name " + fileName + " is present more than once in the sequences zip. " +
                            "Using " + masterSequenceFileNamesHash[fileName], "Warning message");
                    } else {
                        var fileContent:String = sequenceFilesZip.getInput(sequenceFilesZip.entries[i]).toString();
                        extractedSequenceFilesHash[fileName] = fileContent;
                        masterSequenceFileNamesHash[fileName] = fullName;
                    }
                }
            }
            
            //go through master sequence list and add to sequenceFileProxy
            for each (var item:Object in seqListInfo) {
                fileName = item.fileName;
                if (extractedSequenceFilesHash.hasOwnProperty(fileName)) {
                    try {
                        sequenceFileProxy.addSequenceFile(item.format, extractedSequenceFilesHash[fileName], item.fileName);
                    } catch (error:Error) {
                        Alert.show(error.toString(), "Error Message");
                    }

                } else {
                    Alert.show("Cannot find sequence file " + fileName, "Error Message");
                }
            }
        }
        
        private function loadPartVOs(partListInfo:ArrayCollection):Vector.<PartVO>
        {
            var newPartVOs:Vector.<PartVO> = new Vector.<PartVO>;
            //create a PartVO for each of the elements in the parts list
            for(var i:int = 0; i<partListInfo.length; i++)
            {
                var partVO:PartVO = new PartVO();
                
                //find the sequenceFile
                partVO.sequenceFile = sequenceFileProxy.getItemByPartSource(partListInfo.getItemAt(i).source);
                
                //restore j5 info
                partVO.name = partListInfo.getItemAt(i).name;
                
                if (partVO.sequenceFile != null) {
                    var fullSequence:String = fileToSequence(partVO.sequenceFile.sequenceFileContent.toString());
                    
                    if (partListInfo.getItemAt(i).sBP == "") {
                        partVO.genbankStartBP = 1;
                    } else {
                        partVO.genbankStartBP = new Number(partListInfo.getItemAt(i).sBP);
                        if (partVO.genbankStartBP <= 0 || partVO.genbankStartBP > fullSequence.length) {
                            sendNotification(Notifications.NEW_CLEAR_DESIGN);
                            throw new Error("Invalid start position for part " + partVO.name + ".\n\nLoad from J5 files failed.");
                        }
                    }
                    
                    if (partListInfo.getItemAt(i).stBP == "") {
                        partVO.endBP = fullSequence.length;
                    } else {
                        partVO.endBP = new Number(partListInfo.getItemAt(i).stBP);
                        if (partVO.endBP <= 0 || partVO.endBP > fullSequence.length) {
                            sendNotification(Notifications.NEW_CLEAR_DESIGN);
                            throw new Error("Invalid end position for part " + partVO.name + ".\n\nLoad from J5 files failed.");
                        }
                    }
                    
                    partVO.revComp = stringToBool(partListInfo.getItemAt(i).revComp);
                } else {
                    Alert.show("Cannot find sequence file for " + partVO.name + ".\nYou may wish to check your j5 files for correctness.", "Warning Message");
                }
                
                if (partVO.name == "") {
                    Alert.show("A J5 part has no name.\nYou may wish to check your j5 files for correctness.", "Warning Message");
                }
                
                newPartVOs.push(partVO);
            }
            return newPartVOs;

        }
        
        private function loadCollection(newPartVOs:Vector.<PartVO>, targetListInfo:ArrayCollection):void
        {
            var j5Collection:J5Collection = j5CollectionProxy.j5Collection;
            
            var isCombinatorial:Boolean = testCombinatorial(targetListInfo);
            
            var bin:J5Bin;
            var binNum:int;
            var targetListItem:Object;
            
            loadBinAlertMessage = "";
            
            if (isCombinatorial) {
                //determine max number of items in bin, add rows
                var maxNumItems:int = 0;
                var numItemsInBin:int = 0;
                for (var i:int = 0; i < targetListInfo.length; i++) {
                    if (targetListInfo.getItemAt(i).bin == "true") { //start of new bin found
                        if (numItemsInBin > maxNumItems) { //if old bin has more items than current max
                            maxNumItems = numItemsInBin; //update max items
                        }
                        numItemsInBin = 0; //reset for new bin
                    } else { //this is an item in a bin
                        numItemsInBin++; //update count
                    }
                }
                if (numItemsInBin > maxNumItems) { //if last bin has more items than current max
                    maxNumItems = numItemsInBin; //update max items
                }
                var numRowsToAdd:int = maxNumItems + 1 - GridViewCanvasMediator.INIT_NUM_ROWS;
                if (numRowsToAdd < 0) {
                    numRowsToAdd = 0;
                }
                gridViewCanvasMediator.addRows(numRowsToAdd);
                
                //load combinatorial
                binNum = 0;
                var binItemNum:int = 0;
                
                //the first bin is different, since GridViewCanvas starts out with a collection containing one bin
                targetListItem = targetListInfo.getItemAt(0); //first item should be a bin, otherwise should have errored while creating targetListInfo
                bin = j5Collection.binsVector[0];
                bin.binName = targetListItem.name;
                sendNotification(Notifications.NEW_UPDATE_BIN_NAME, 0);
                loadBin(bin, targetListItem);
                
                //load the rest of the target part order list file
                for (i = 1; i < targetListInfo.length; i++) {
                    targetListItem = targetListInfo.getItemAt(i);
                    if (targetListItem.bin == "true") { //if bin, create bin
                        binNum++;
                        binItemNum = 0;
                        bin = j5CollectionProxy.addBin(targetListItem.name);
                        loadBin(bin, targetListItem);
                    } else { //if not bin, create part and add to bin
                        loadPart(targetListItem, binNum, binItemNum, newPartVOs);
                        
                        if (binItemNum == 0) {
                            //set bin direction from topmost part in the bin
                            bin.directionForward = targetListItem.direction == "reverse" ? false : true;
                        } else {
                            //warn on direction conflict
                            if ((bin.directionForward && targetListItem.direction == "reverse") ||
                                (!bin.directionForward && targetListItem.direction != "reverse")) {
                                loadBinAlertMessage += "* Part " + targetListItem.name + "'s direction was set to " + 
                                    targetListItem.direction + " but will be overwritten by that of the bin.\n";
                            }
                        }
                        
                        binItemNum++;
                    }
                }
            } else { //not combinatorial
                binNum = 0;
                
                //the first bin is different, since GridViewCanvas starts out with a collection containing one bin
                targetListItem = targetListInfo.getItemAt(0);
                bin = j5Collection.binsVector[0];
                bin.binName = binNum.toString();
                sendNotification(Notifications.NEW_UPDATE_BIN_NAME, 0);
                loadBin(bin, targetListItem);
                loadPart(targetListItem, binNum, 0, newPartVOs);
                bin.directionForward = targetListItem.direction == "reverse" ? false : true;
                
                //load the rest of the target part order list file
                for (i = 1; i < targetListInfo.length; i++) {
                    binNum++;
                    targetListItem = targetListInfo.getItemAt(i);
                    bin = j5CollectionProxy.addBin(binNum.toString());
                    loadBin(bin, targetListItem);
                    loadPart(targetListItem, binNum, 0, newPartVOs);
                    bin.directionForward = targetListItem.direction == "reverse" ? false : true;
                }
            }
            
            if (loadBinAlertMessage != "") {
                Alert.show("The following target part order list file information could not be loaded:\n\n" + loadBinAlertMessage, "Warning Message");
            }
            
            setUpCollection();
            gridViewCanvasMediator.refreshHeaderGraphics();
        }
        
        private function loadBin(bin:J5Bin, targetListItem:Object):void
        {
            bin.dsf = stringToBool(targetListItem.dsf);
            bin.fas = targetListItem.fas; //FIXME: won't this get overwritten by fasCheck?
            if (targetListItem.fro != "" && targetListItem.fro != "unspecified") {
                if (targetListItem.fro.match(/^-?\d+$/)) { //if integer
                    bin.fro = new NullableInt(int(targetListItem.fro));
                } else {
                    loadBinAlertMessage += "* Bin " + bin.binName + " FRO " + targetListItem.fro + " is not an integer.\n";
                }
            }
            if (targetListItem.extra5PrimeBps != "" && targetListItem.extra5PrimeBps != "unspecified") {
                if (targetListItem.extra5PrimeBps.match(/^-?\d+$/)) {
                    bin.extra5PrimeBps = new NullableInt(int(targetListItem.extra5PrimeBps));
                } else {
                    loadBinAlertMessage += "* Bin " + bin.binName + " Extra 5' CPEC overlap bps " + targetListItem.extra5PrimeBps + " is not an integer.\n";
                }
            }
            if (targetListItem.extra3PrimeBps != "" && targetListItem.extra3PrimeBps != "unspecified") {
                if (targetListItem.extra3PrimeBps.match(/^-?\d+$/)) {
                    bin.extra3PrimeBps = new NullableInt(int(targetListItem.extra3PrimeBps));
                } else {
                    loadBinAlertMessage += "* Bin " + bin.binName + " Extra 3' CPEC overlap bps " + targetListItem.extra3PrimeBps + " is not an integer.\n";
                }
            }
        }
        
        private function loadPart(targetListItem:Object, binNum:int, binItemNum:int, newPartVOs:Vector.<PartVO>):void
        {
            //find partVO
            var partVO:PartVO;
            for (var j:int = 0; j < newPartVOs.length; j++) {
                if (newPartVOs[j].name == targetListItem.name) {
                    partVO = newPartVOs[j];
                    break;
                }
            }
            
            //create part
            var part:Part = partProxy.createPart(partVO);
            part.fas = targetListItem.fas;
            
            //add to bin
            j5CollectionProxy.addToBin(part, binNum, binItemNum);
            gridViewCanvasMediator.addPart(part, binNum, binItemNum);
        }
        
        public function fileToSequence(f:String):String
        {
            var _parsedFile:String;
            
            var genbankCheck:RegExp = /^LOCUS *(\S*)/;
            var genbankCheckResult:Array = genbankCheck.exec(f);
            
            var fastaCheck:RegExp = /^>\s*(\S*)/;
            var fastaCheckResult:Array = fastaCheck.exec(f);
            
            if(genbankCheckResult != null && genbankCheckResult.length > 1) //Do Genbank parsing
            {
                //notice the "s" which is the dotall flag (match newlines)
                var sequenceCoarse:RegExp = /ORIGIN\s*(.*)\/\//s;
                var result2:Array = sequenceCoarse.exec(f);
                var lineNumAndSeq:String = result2[1] as String;
                var numbersAndSpaces:RegExp = /\s|[0-9]/g;  
                _parsedFile = lineNumAndSeq.replace(numbersAndSpaces, "");
            }
            else if(fastaCheckResult != null && fastaCheckResult.length > 1)
            {
                var fastaPattern:RegExp = />.*?\n(.*)/s;
                result2 = fastaPattern.exec(f);
                _parsedFile = (result2[1] as String).replace(/\s/, "");
            }
            else
            {
                //jbei-seq check
                var xml:XML = new XML(f);
                var xmlQName:QName = xml.name();
                if(xmlQName != null && xmlQName.localName == "seq" && xmlQName.uri == "http://jbei.org/sequence")
                {
                    namespace seq = "http://jbei.org/sequence";
                    use namespace seq;

                    _parsedFile = xml.sequence;
                }
                else
                {
                    _parsedFile = f;
                }
            }
            
            return _parsedFile;
        }
        
        public function createGenbankLocus(genbankFile:String):String
        {
            var re:RegExp = /LOCUS *(\S*)/;
            var result:Array = re.exec(genbankFile);
            if(result.length > 1)
                return result[1] as String;
            
            return null;
        }
        
        public function testCombinatorial(targetListInfo:ArrayCollection):Boolean
        {
            for(var i:int = 0; i<targetListInfo.length; i++)
            {
                if(targetListInfo.getItemAt(i).bin == "true")
                    return true;
            }
            return false;
        }
        
        private function stringToBool(s:String):Boolean
        {
            if (s.toLowerCase() == "true")
                return true;
            else
                return false;
        }
        
        /* Import Eugene Rules ******************************** */
        
        /** 
         * Returns an object containing data parsed from an imported Eugene 
         * rules file. It contains the following four properties: a 
         * conflictingRulesArray array, a newRulesArray array, an ignoredLines 
         * vector of strings, and a repeatedRules vector of strings. 
         * Each item in the conflictingRulesArray is an object containing a 
         * name string, a negation operator boolean flag, an operand1 partVO, 
         * a compositional operator string, an operand2 number or partVO, 
         * a text string (containing the original rule text 
         * from the imported file), a conflictsWith eugeneRule, and a newName 
         * string. Each item in the newRulesArray is an object containing the 
         * same properties as objects in the conflictingRulesArray except with 
         * no conflictsWith property or newName property. Each item in the 
         * ignoredLines vector is a string corresponding to a line in the 
         * imported file that was ignored. Each item in the repeatedRules 
         * vector is a string corresponding to a line in the imported file 
         * that represents an already existing rule. 
         * 
         * @param fileData  a string containing the contents of the Eugene file to be imported
         * 
         * @return          an object containing the parsed Eugene data
         */
        public function parseEugeneRules(fileData:String):Object
        {
            var linesArray:Array = fileData.split(/\R/);
            
            var ignoredLines:Vector.<String> = new Vector.<String>;
            var ruleLinesArray:Array = new Array();
            
            var conflictingRulesArray:Array = new Array();
            var newRulesArray:Array = new Array();
            var repeatedRules:Vector.<String> = new Vector.<String>;
            
            var defaultNamePrefix:String = eugeneRuleProxy.defaultNamePrefix;
            var tmpHighestDefaultNameIndex:int = eugeneRuleProxy.highestDefaultNameIndex;
            
            var containsNameCallback:Function = function(element:*, index:int, arr:*):Boolean
            {
                return element.name == this;
            };
            
            var ruleRE:RegExp = /^Rule +([a-zA-Z0-9_\-]+) *\((NOT )? *([a-zA-Z0-9_\-]+) +(AFTER|BEFORE|WITH|THEN|NEXTTO|MORETHAN|NOTMORETHAN|NOTWITH) +([a-zA-Z0-9_\-]+) *\);/;
            for (var i:int = 0; i < linesArray.length; i++) {
                var parsedRule:Array = ruleRE.exec(linesArray[i]);
                if (parsedRule == null) { // if line doesn't match Eugene rule regex
                    if (linesArray[i] != "") {
                        ignoredLines.push(linesArray[i]);
                    }
                } else { // if line matches Eugene rule regex
                    var ruleName:String = parsedRule[1];
                    var negationOperator:Boolean = (parsedRule[2] == "NOT " ? true : false);
                    var operand1Text:String = parsedRule[3];
                    var compositionalOperator:String = parsedRule[4];
                    var operand2Text:String = parsedRule[5];
                    
                    //backward compatibility
                    if (compositionalOperator == EugeneRule.NOTMORETHAN) {
                        if (negationOperator == true) {
                            //invalid Eugene, old Eugene rules did not have negation operator
                            ignoredLines.push(linesArray[i]);
                            continue;
                        } else {
                            negationOperator = true; //convert to NOT a MORETHAN x
                            compositionalOperator = EugeneRule.MORETHAN;
                        }
                    } else if (compositionalOperator == EugeneRule.NOTWITH) {
                        if (negationOperator == true) {
                            //invalid Eugene, old Eugene rules did not have negation operator
                            ignoredLines.push(linesArray[i]);
                            continue;
                        } else {
                            negationOperator = true; //convert to NOT a WITH b
                            compositionalOperator = EugeneRule.WITH;
                        }
                    }
                    
                    var operand1:PartVO = partProxy.getPartVOByName(operand1Text);
                    var operand2:*;
                    if (compositionalOperator == EugeneRule.MORETHAN) {
                        operand2 = Number(operand2Text);
                    } else {
                        operand2 = partProxy.getPartVOByName(operand2Text);
                    }
                    
                    if (operand1 == null || operand2 == null) { // if at least one partVO operand does not exist on canvas
                        ignoredLines.push(linesArray[i]); // rule does not apply
                    } else { // if all partVO operands exist on canvas
                        // add rule to ruleLinesArray for second pass of checking
                        ruleLinesArray.push({name: ruleName, negationOperator: negationOperator, operand1: operand1, 
                            compositionalOperator: compositionalOperator, operand2: operand2, text: linesArray[i]});
                        
                        // check if any names follow the default name pattern and update tmpHighestDefaultNameIndex accordingly
                        var namePatternResult:Object = eugeneRuleProxy.defaultNamePattern.exec(ruleName);
                        if (namePatternResult != null && int(namePatternResult[1]) > tmpHighestDefaultNameIndex) {
                            tmpHighestDefaultNameIndex = int(namePatternResult[1]);
                        }
                    }
                }
            }
            
            // conflict checking
            for (i = 0; i < ruleLinesArray.length; i++) {
                var ruleInfo:Object = ruleLinesArray[i];
                
                if (newRulesArray.filter(containsNameCallback, ruleInfo.name).length > 0) { // if in new
                    var queuedRule:Object = newRulesArray.filter(containsNameCallback, ruleInfo.name)[0];
                    if (queuedRule.negationOperator == ruleInfo.negationOperator 
                        && queuedRule.operand1 == ruleInfo.operand1 
                        && queuedRule.compositionalOperator == ruleInfo.compositionalOperator 
                        && queuedRule.operand2 == ruleInfo.operand2) { // if rule already exists
                        repeatedRules.push(ruleLinesArray[i].text);
                    } else { // if rule conflicts
                        var newName:String = defaultNamePrefix + (++tmpHighestDefaultNameIndex);
                        ruleInfo.conflictsWith = queuedRule.text;
                        ruleInfo.newName = newName;
                        conflictingRulesArray.push(ruleInfo);
                    }
                } else if (!eugeneRuleProxy.isUniqueRuleName(ruleInfo.name)) { // if in existing
                    var existingRule:EugeneRule = eugeneRuleProxy.getRuleByName(ruleInfo.name);
                    if (existingRule.negationOperator == ruleInfo.negationOperator 
                        && existingRule.operand1 == ruleInfo.operand1 
                        && existingRule.compositionalOperator == ruleInfo.compositionalOperator 
                        && existingRule.operand2 == ruleInfo.operand2) { // if rule already exists
                        repeatedRules.push(ruleLinesArray[i].text);
                    } else { // if rule conflicts
                        newName = defaultNamePrefix + (++tmpHighestDefaultNameIndex);
                        ruleInfo.conflictsWith = eugeneRuleProxy.generateRuleText(existingRule);
                        ruleInfo.newName = newName;
                        conflictingRulesArray.push(ruleInfo);
                    }
                } else { // if in none
                    newRulesArray.push(ruleInfo);
                }
            }
            
            return {conflictingRulesArray: conflictingRulesArray, newRulesArray: newRulesArray, ignoredLines: ignoredLines, repeatedRules: repeatedRules};
        }
        
        /* Rules ********************************************** */
    
        public function checkBinRules(bin:J5Bin):Boolean
        {
            //TODO: have everything send notification directly instead of calling checkBinRules
            sendNotification(Notifications.NEW_CHECK_BIN_FAS, bin);
            
            return true;
        }
        
        /* Other functions ************************************ */
        
        public function extractPartSequence(genbankSequence:String, genbankStartBP:int, endBP:int, revComp:Boolean):String
        {
            var partSequence:String;
            
            if (genbankStartBP <= endBP) {
                partSequence = genbankSequence.substr(genbankStartBP - 1, endBP - genbankStartBP + 1);
            } else { //sequence wraps around
                partSequence = genbankSequence.substr(genbankStartBP - 1, genbankSequence.length - genbankStartBP - 1) + genbankSequence.substr(0, endBP);
            }
            
            if (revComp == true) {
                partSequence = revcomp(partSequence);
            }
            
            return partSequence;
        }
        
        private function revcomp(seq:String):String
        {
            var revCompSeq:String = "";
            
            seq = seq.toLowerCase();
            
            for (var i:int = seq.length-1; i >= 0; i--) {
                switch (seq.charAt(i)) {
                    case "a":
                        revCompSeq = revCompSeq + "t";
                        break;
                    case "c":
                        revCompSeq = revCompSeq + "g";
                        break;
                    case "g":
                        revCompSeq = revCompSeq + "c";
                        break;
                    case "t":
                        revCompSeq = revCompSeq + "a";
                        break;
                }
            }
            
            return revCompSeq;
        }
        
        public function isLegalName(newName:String):Boolean
        {
            var illegalCharsPattern:RegExp = /[^a-zA-Z0-9_\-]/;
            if (newName.match(illegalCharsPattern) != null) {
                return false;
            }
            return true;
        }
        
        public function isUniqueBinName(newName:String, collection:J5Collection):Boolean
        {
            for (var i:int = 0; i < collection.binCount(); i++) {
                if (newName == collection.binsVector[i].binName) {
                    return false;
                }
            }
            return true;
        }

        public function determinePositionInBin(rectShape:RectShape, bin:J5Bin):uint
        {
            for (var i:int = 0; i < bin.binItemsVector.length; i++) {
                //TODO convert to grid view, or remove?
//                if (rectShape.y < centerCanvasMediator.findRectShape(bin.binItemsVector[i]).y) {
//                    break;
//                }
            }
            return i;
        }
        
        public function isValidZipFile(bytes:ByteArray):Boolean {
            //check for valid zip file by scanning for the zip local file header signature
            var originalEndian:String = bytes.endian;
            bytes.endian = Endian.LITTLE_ENDIAN;

            var zipSignature:int = 0x04034b50;
            var hasZipSignature:Boolean = false;
            
            while (bytes.bytesAvailable > 3) {
                if (bytes.readInt() == zipSignature) {
                    hasZipSignature = true;
                    break;
                }
            }
            
            //reset ByteArray
            bytes.position = 0;
            bytes.endian = originalEndian;
            
            return hasZipSignature;
        }
    }
}