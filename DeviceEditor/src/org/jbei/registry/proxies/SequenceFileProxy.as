package org.jbei.registry.proxies
{
    import flash.utils.ByteArray;
    
    import mx.controls.Alert;
    import mx.utils.SHA256;
    
    import org.jbei.registry.Constants;
    import org.jbei.registry.models.SequenceFile;
    import org.puremvc.as3.patterns.proxy.Proxy;
    
    public class SequenceFileProxy extends Proxy
    {
        public static const NAME:String = "SequenceFileProxy";
        
        public function SequenceFileProxy()
        {
            super(NAME, new Vector.<SequenceFile>);
        }
        
        public function get sequenceFiles():Vector.<SequenceFile>
        {
            return data as Vector.<SequenceFile>;
        }
        
        //compute the hash of a file's content, check to see if has already been stored, add if not already stored
        public function addSequenceFile(fileFormat:String, dirtyFileContent:String, fileName:String = ""):SequenceFile
        {
            //change all line endings to \n
            var fileContent:String = dirtyFileContent.replace(/\R/g, "\n");
            
            //check for newline at end of file, add if not there
            var result:Array = fileContent.match(/\n$/)
            if (result == null || result.length == 0) {
                fileContent = fileContent + "\n";
            }
            
            var fileContentByteArray:ByteArray = new ByteArray();
            fileContentByteArray.writeUTFBytes(fileContent);
            fileContentByteArray.position = 0;
            var hash:String = SHA256.computeDigest(fileContentByteArray);
            
            //look for existing file, return if found
            for (var i:int = 0; i<sequenceFiles.length; i++) {
                if (hash == sequenceFiles[i].hash && fileName == sequenceFiles[i].sequenceFileName) {
                    return sequenceFiles[i];
                }
            }
            
            //determine display ID (aka part source) and check for uniqueness
            var re:RegExp;
            var displayID:String;
            if (fileFormat == Constants.GENBANK) {
                re = /LOCUS *(\S*)/;
                result = re.exec(fileContent);
                if (result.length > 1) {
                    displayID = result[1] as String;
                }
            } else if (fileFormat == Constants.FASTA) {
                re = />\s*(\S*)/;
                result = re.exec(fileContent);
                if (result.length > 1) {
                    displayID = result[1] as String;
                }
            } else if (fileFormat == Constants.JBEI_SEQ) {
                re = /<seq:name>(.*)<\/seq:name>/;
                result = re.exec(fileContent);
                if (result.length == 2) {
                    displayID = result[1] as String;
                }
            }
            
            for (i = 0; i<sequenceFiles.length; i++) {
                if (displayID == sequenceFiles[i].partSource) {
                    throw new Error("Another file with the Display ID " + displayID + " already exists.  Please ensure the Display ID is unique and try again.\n\n" +
                        "The Display ID is the Part Source for sequences that did not come from a file.  " +
                        "Otherwise, it is the first field on the LOCUS line in Genbank files, the first word following the '>' character in FASTA files, " +
                        "or the text between <seq:name> and </seq:name> in jbei-seq files.");
                }
            }
            
            //create new sequenceFile if it doesn't already exist
            var sequenceFile:SequenceFile = new SequenceFile();
            sequenceFile.sequenceFileFormat = fileFormat;
            sequenceFile.sequenceFileContent = fileContent;  //this also sets sequenceFile.hash
            sequenceFile.partSource = displayID;
            
            if (fileName != "") {
                sequenceFile.sequenceFileName = fileName;
            } else {
                if (fileFormat == Constants.GENBANK) {
                    sequenceFile.sequenceFileName = sequenceFile.partSource + ".gb";
                } else if (fileFormat == Constants.FASTA) {
                    sequenceFile.sequenceFileName = sequenceFile.partSource + ".fas";
                } else if (fileFormat == Constants.JBEI_SEQ) {
                    sequenceFile.sequenceFileName = sequenceFile.partSource + ".xml";
                } else {
                    sequenceFile.sequenceFileName = sequenceFile.partSource;
                    Alert.show("File format for this sequence is not recognized.  Beware of nonsensical file names or missing sequence files.", "Warning Message");
                }
            }
            
            //file name checks
            if (sequenceFile.sequenceFileName.search(/\s/) >= 0) {  //reject filename if it has whitespace characters
                throw new Error("The file name " + sequenceFile.sequenceFileName + " has whitespace characters, which are not allowed.  " +
                    "Please remove the whitespace characters and try again.");
            }
            
            for (i = 0; i<sequenceFiles.length; i++) {
                if (sequenceFile.sequenceFileName == sequenceFiles[i].sequenceFileName) {  //case sensitive match
                    throw new Error("Another file with the file name " + sequenceFile.sequenceFileName + " already exists.  " +
                        "Please ensure the file name is unique and try again.  \n\n" +
                        "If the sequence did not come from a file, the file name is generated from the Part Source.");
                }
                if (sequenceFile.sequenceFileName.toLowerCase() == sequenceFiles[i].sequenceFileName.toLowerCase()) {  //case insensitive match
                    throw new Error("Another file was found with the file name " + sequenceFiles[i].sequenceFileName + ", which is a case insensitive match.  " +
                        "If these should be the same file, please use the correct capitalization.  " +
                        "Otherwise, please ensure the file name is unique and try again.  \n\n" +
                        "If the sequence did not come from a file, the file name is generated from the Part Source.");
                }
            }
            
            sequenceFiles.push(sequenceFile);
            
            return sequenceFile;
        }
        
        public function deleteItem(sequenceFile:SequenceFile):void
        {
            for (var i:int = 0; i<sequenceFiles.length; i++) {
                if (sequenceFiles[i] == sequenceFile) {
                    sequenceFiles.splice(i, 1);
                    break;
                }
            }
        }
        
        public function deleteAllItems():void
        {
            data = new Vector.<SequenceFile>;
        }
        
        public function getItemByPartSource(source:String):SequenceFile
        {
            for (var i:int = 0; i < sequenceFiles.length; i++) {
                if (source == sequenceFiles[i].partSource) {
                    return sequenceFiles[i];
                }
            }
            return null;
        }
        
        public function getItemByHash(hash:String):SequenceFile
        {
            for (var i:int = 0; i < sequenceFiles.length; i++) {
                if (hash == sequenceFiles[i].hash) {
                    return sequenceFiles[i];
                }
            }
            return null;
        }
    }
}