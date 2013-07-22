package org.jbei.registry.models
{
    import mx.collections.ArrayCollection;
        
    [RemoteClass]

    public class PartVO
    {
        private var _name:String;
        private var _revComp:Boolean;
        private var _genbankStartBP:int;
        private var _endBP:int;
        private var _sequenceFile:SequenceFile;
        private var _iconID:String;

        private var _id:String;
        
        // Constructor
        public function PartVO()
        {
            _name = "";
            _revComp = false;
            _genbankStartBP = 0;
            _endBP = 0;
            _sequenceFile = null;
            _iconID = null;
            
            var extraDigits:String = Math.floor(1000 * Math.random()).toString();
            while (extraDigits.length < 3) {
                extraDigits = "0" + extraDigits;
            }
            
            _id = (new Date).time.toString() + extraDigits;
        }
        
        // Properties
        public function get name():String
        {
            return _name;
        }
        
        public function set name(n:String):void
        {
            _name = n;
        }
        
        public function get revComp():Boolean
        {
            return _revComp;
        }
        
        public function set revComp(b:Boolean):void
        {
            _revComp = b;
        }
        
        public function get genbankStartBP():Number
        {
            return _genbankStartBP;
        }
        
        public function set genbankStartBP(n:Number):void
        {
            _genbankStartBP = n;
        }
        
        public function get endBP():Number
        {
            return _endBP;
        }
        
        public function set endBP(n:Number):void
        {
            _endBP = n;
        }
        
        public function get sequenceFile():SequenceFile
        {
            return _sequenceFile;
        }
        
        public function set sequenceFile(sequenceFile:SequenceFile):void
        {
            _sequenceFile = sequenceFile;
        }
        
        public function get iconID():String
        {
            return _iconID;
        }
        
        public function set iconID(iconID:String):void
        {
            _iconID = iconID;
        }
        
        public function get id():String
        {
            return _id;
        }
        
        public function set id(id:String):void
        {
            _id = id;
        }
        
        //Public methods
        public function isEqual(otherPartVO:PartVO):Boolean
        {
            if (this == otherPartVO) {
                return true;
            }
            
            if (this.name == otherPartVO.name
                    && this.revComp == otherPartVO.revComp
                    && this.genbankStartBP == otherPartVO.genbankStartBP
                    && this.endBP == otherPartVO.endBP
                    && this.sequenceFile == otherPartVO.sequenceFile
                    && this.iconID == otherPartVO.iconID) {
                return true;
            }
                
            return false;
        }
        
        public function isEmpty():Boolean
        {
            if (_name == ""
                    && _revComp == false
                    && _genbankStartBP == 0
                    && _endBP == 0
                    && _sequenceFile == null
                    && _iconID == null) {
                return true;
            }
            return false;
        }
    }
}