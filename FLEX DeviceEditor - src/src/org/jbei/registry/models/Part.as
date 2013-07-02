package org.jbei.registry.models
{
    import mx.collections.ArrayCollection;
        
    [RemoteClass]

    public class Part
    {
        private var _partVO:PartVO;
        
        private var _directionForward:Boolean;
        private var _fas:String;
        
        private var _id:String;
        
        // Constructor
        public function Part()
        {
            _partVO = null;
            _directionForward = true;
            _fas = "";
            
            var extraDigits:String = Math.floor(1000 * Math.random()).toString();
            while (extraDigits.length < 3) {
                extraDigits = "0" + extraDigits;
            }
            
            _id = (new Date).time.toString() + extraDigits;
        }

        // Properties
        public function get partVO():PartVO
        {
            return _partVO;
        }
        
        public function set partVO(vo:PartVO):void
        {
            _partVO = vo;
        }
        
        public function get name():String
        {
            return _partVO.name;
        }
        
        public function set name(n:String):void
        {
            _partVO.name = n;
        }
        
        public function get revComp():Boolean
        {
            return _partVO.revComp;
        }
        
        public function set revComp(b:Boolean):void
        {
            _partVO.revComp = b;
        }
        
        public function get genbankStartBP():Number
        {
            return _partVO.genbankStartBP;
        }
        
        public function set genbankStartBP(n:Number):void
        {
            _partVO.genbankStartBP = n;
        }
        
        public function get endBP():Number
        {
            return _partVO.endBP;
        }
        
        public function set endBP(n:Number):void
        {
            _partVO.endBP = n;
        }
        
        public function get sequenceFile():SequenceFile
        {
            return _partVO.sequenceFile;
        }
        
        public function set sequenceFile(sequenceFile:SequenceFile):void
        {
            _partVO.sequenceFile = sequenceFile;
        }
        
        public function get iconID():String
        {
            return _partVO.iconID;
        }
        
        public function set iconID(iconID:String):void
        {
            _partVO.iconID = iconID;
        }
        
        public function get id():String
        {
            return _id;
        }
        
        public function set id(id:String):void
        {
            _id = id;
        }
        
        public function get directionForward():Boolean
        {
            return _directionForward;
        }
        
        public function set directionForward(d:Boolean):void
        {
            _directionForward = d;
        }
        
        public function get fas():String
        {
            return _fas;
        }
        
        public function set fas(f:String):void
        {
            _fas = f;
        }
        
        public function get hasSequence():Boolean
        {
            if (_partVO.sequenceFile == null) {
                return false;
            } else {
                return true;
            }
        }
        
        //Public methods
        public function isEmpty():Boolean
        {
            if (_partVO.isEmpty()
                    && _directionForward == true
                    && _fas == "") {
                return true;
            }
            return false;
        }
        
    }
}