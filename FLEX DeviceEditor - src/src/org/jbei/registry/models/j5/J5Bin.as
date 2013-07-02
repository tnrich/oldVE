/*
Author: Douglas Densmore

This object is a "bin" that will be part of a j5Collection object

*/

// ActionScript file

package org.jbei.registry.models.j5
{
	import mx.controls.Label;
	
	import org.jbei.registry.SBOLvIcons;
	import org.jbei.registry.models.Part;
	import org.jbei.registry.utils.NullableInt;
	
	public class J5Bin
	{
		private var _binItemsVector:Vector.<Part>;
		
		//Name for the bin
		private var _binName:String;
        
        //Icon and direction
        private var _iconID:String;
        private var _directionForward:Boolean;
		
		//Direct synthesis firewall
		private var _dsf:Boolean;
		
		//Forced relative overhang
		private var _fro:NullableInt;
		
		//FAS for the bin; this will be determined by the FAS rule in the event of conflicts with parts
		private var _fas:String;
        
        //Extra 5' and 3' CPEC overhang bps
        private var _extra5PrimeBps:NullableInt;
        private var _extra3PrimeBps:NullableInt;
		
		//Constructor
		public function J5Bin(s:String)
		{
            _binItemsVector = new Vector.<Part>;
			_binName = s;
            _iconID = SBOLvIcons.GENERIC;
            _directionForward = true;
			_fro = null;
			_dsf = false;
			_fas = "";
            _extra5PrimeBps = null;
            _extra3PrimeBps = null;
		}
		
		//Basic get methods
		public function get binName():String
		{
			return _binName;
		}
		
		public function get binItemsVector():Vector.<Part>
		{
			return _binItemsVector;
		}
        
        public function get iconID():String
        {
            return _iconID;
        }
        
        public function get directionForward():Boolean
        {
            return _directionForward;
        }
		
		public function get fro():NullableInt
		{
			return _fro;
		}
		
		public function get fas():String
		{
			return _fas;
		}
		
		public function get dsf():Boolean
		{
			return _dsf;
		}
        
        public function get extra5PrimeBps():NullableInt
        {
            return _extra5PrimeBps;
        }
        
        public function get extra3PrimeBps():NullableInt
        {
            return _extra3PrimeBps;
        }
		
		//Basic set methods
		public function set binName(s:String):void
		{
			_binName = s;
		}
        
        public function set iconID(value:String):void
        {
            _iconID = value;
        }
        
        public function set directionForward(value:Boolean):void
        {
            _directionForward = value;
        }
		
		public function set fro(n:NullableInt):void
		{
			_fro = n;
		}
		
		public function set fas(s:String):void
		{
			_fas = s;
		}
		
		public function set dsf(b:Boolean):void
		{
			_dsf = b;
		}
        
        public function set extra5PrimeBps(n:NullableInt):void
        {
            _extra5PrimeBps = n;
        }
        
        public function set extra3PrimeBps(n:NullableInt):void
        {
            _extra3PrimeBps = n;
        }
		
        //TODO: remove these once everything converted to use j5CollectionProxy
		//Add an item to the bin array
		public function addToBin(part:Part, position:uint):void
		{
            _binItemsVector.splice(position, 0, part);
		}
        
        public function removeFromBin(part:Part):void
        {
            if (_binItemsVector.indexOf(part) != -1)
                _binItemsVector.splice(_binItemsVector.indexOf(part), 1);
        }
		
		//Function to get an item from a bin
		/*public function getBinArrayObject(i:int):Part
		{
			return _binItemsVector[i];
		}*/
		
		//Clear the bin array
		/*public function clearBin():void
		{
				_binItemsVector = new Vector.<Part>;
		}*/
		
	}
	

}