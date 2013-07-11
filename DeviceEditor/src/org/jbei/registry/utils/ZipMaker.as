package org.jbei.registry.utils
{
    import flash.events.Event;
    import flash.events.IOErrorEvent;
    import flash.net.FileReference;
    import flash.utils.ByteArray;
    import flash.utils.Dictionary;
    
    import mx.collections.ArrayCollection;
    import mx.controls.Alert;
    
    import nochump.util.zip.ZipEntry;
    import nochump.util.zip.ZipOutput;

    /**
     * @author Zinovii Dmytriv
     */
    public class ZipMaker
    {
        // Public Methods
        public static function archiveJ5Files(partList:String, targetList:String, seqList:String, eugeneList:String, fileInfos:ArrayCollection):ByteArray
        {
            var zipOut:ZipOutput = new ZipOutput();
            
            // seq file
            var seqListFileData:ByteArray = new ByteArray();
            seqListFileData.writeUTFBytes(seqList);
            
            var seqListZipEntry:ZipEntry = new ZipEntry("seqListFile.csv");
            zipOut.putNextEntry(seqListZipEntry);
            zipOut.write(seqListFileData);
            
            // part file
            var partListFileData:ByteArray = new ByteArray();
            partListFileData.writeUTFBytes(partList);
            
            var partListZipEntry:ZipEntry = new ZipEntry("partListFile.csv");
            zipOut.putNextEntry(partListZipEntry);
            zipOut.write(partListFileData);
            
            // target file
            var targetListFileData:ByteArray = new ByteArray();
            targetListFileData.writeUTFBytes(targetList);
            
            var targetListZipEntry:ZipEntry = new ZipEntry("targetListFile.csv");
            zipOut.putNextEntry(targetListZipEntry);
            zipOut.write(targetListFileData);
            
            // Eugene file
            var eugeneListFileData:ByteArray = new ByteArray();
            eugeneListFileData.writeUTFBytes(eugeneList);
            
            var eugeneListZipEntry:ZipEntry = new ZipEntry("eugeneListFile.eug");
            zipOut.putNextEntry(eugeneListZipEntry);
            zipOut.write(eugeneListFileData);
            
            
            // sequences zip file
            if(fileInfos && fileInfos.length > 0) {
                var sequencesZip:ByteArray = archiveSequencesFiles(fileInfos);
                
                var sequencesZipEntry:ZipEntry = new ZipEntry("sequences.zip");
                zipOut.putNextEntry(sequencesZipEntry);
                zipOut.write(sequencesZip);
            }
            
            zipOut.finish();
            
            return zipOut.byteArray;
        }
        
        public static function archiveSequencesFiles(fileInfos:ArrayCollection):ByteArray
        {
            var sequencesZipOut:ZipOutput = new ZipOutput();
            var uniqueSequences:Dictionary = new Dictionary();
            
            for (var i:int = 0; i < fileInfos.length; i++) {
                var fileInfo:FileInfo = fileInfos.getItemAt(i) as FileInfo;
                
                if(uniqueSequences[fileInfo.name] != null) {
                    continue;
                }
                
                uniqueSequences[fileInfo.name] = true;
                
                var sequenceFileData:ByteArray = new ByteArray();
                sequenceFileData.writeUTFBytes(fileInfo.file);
                
                var sequenceZipEntry:ZipEntry = new ZipEntry(fileInfo.name);
                sequencesZipOut.putNextEntry(sequenceZipEntry);
                sequencesZipOut.write(sequenceFileData);
            }
            
            sequencesZipOut.finish();
            
            return sequencesZipOut.byteArray;
        }
    }
}