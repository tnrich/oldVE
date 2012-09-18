/*
Author: Douglas Densmore

Collection of bins (which in turn hold ShapeObjects). This is used for j5 primarily

*/

// ActionScript file

package org.jbei.registry.models.j5
{
	import org.jbei.registry.ApplicationFacade;
	
	public class J5Collection
	{
		//This will hold all the j5Bins in this collection	
		private var _binsVector:Vector.<J5Bin> = new Vector.<J5Bin>;
		
		private var _j5Ready:Boolean = false;
		private var _combinatorial:Boolean = false;
        
        private var _isCircular:Boolean = true; //collections are circular by default
        		
		//Function to set up the bins for the first time	
		public function initBins(binCount:int):void
		{
            //TODO: remove
		}	
		
		public function get binsVector():Vector.<J5Bin>
		{
			return _binsVector;
		}	
		
		public function get j5Ready():Boolean{
			return _j5Ready;
		}
		
		public function set j5Ready(b:Boolean):void
		{
			_j5Ready = b;
		}
		
		public function get combinatorial():Boolean{
			return _combinatorial;
		}
		
		public function set combinatorial(b:Boolean):void
		{
			_combinatorial = b;
		}
        
        public function get isCircular():Boolean
        {
            return _isCircular;
        }
        
        public function set isCircular(b:Boolean):void
        {
            _isCircular = b;
        }
		
        //TODO: remove
		//Simple function to add a bin
		//FIXME - not sure how robust this is; may screw up the collection if done after the the collection has been set up
		public function addBin(b:J5Bin, index:int):void
		{
            if (index != -1) {
                _binsVector.splice(index, 0, b);
            } else {
                _binsVector.push(b);
            }
		}
		
        //TODO: remove
		//FIXME - maybe oversimplified
		public function deleteBin(index:int):void
		{
            if (index != -1) {
                _binsVector.splice(index, 1);
            } else {
                _binsVector.pop();
            }
		}
		
		public function binCount():int
		{
			return _binsVector.length;
		}
	}
	
}