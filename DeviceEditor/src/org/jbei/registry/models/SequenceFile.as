package org.jbei.registry.models
{
    import flash.utils.ByteArray;
    
    import mx.utils.SHA256;

    [RemoteClass]
    
    public class SequenceFile
    {
        private var _sequenceFileFormat:String;
        private var _sequenceFileContent:String;
        private var _sequenceFileName:String;
        private var _partSource:String;
        private var _hash:String;
        
        //Constructor
        public function SequenceFile()
        {
        }
        
        //Properties
        public function get sequenceFileFormat():String
        {
            return _sequenceFileFormat;
        }
        
        public function set sequenceFileFormat(format:String):void
        {
            _sequenceFileFormat = format;
        }
        
        public function get sequenceFileContent():String
        {
            return _sequenceFileContent;
        }
        
        public function set sequenceFileContent(content:String):void
        {
            _sequenceFileContent = content;

            var contentByteArray:ByteArray = new ByteArray();
            contentByteArray.writeUTFBytes(content)
            contentByteArray.position = 0;
            _hash = SHA256.computeDigest(contentByteArray);
        }

        public function get sequenceFileName():String
        {
            return _sequenceFileName;
        }
        
        public function set sequenceFileName(fileName:String):void
        {
            _sequenceFileName = fileName;
        }

        public function get partSource():String
        {
            return _partSource;
        }
        
        public function set partSource(source:String):void
        {
            _partSource = source;
        }

        public function get hash():String
        {
            return _hash;
        }
    }
}