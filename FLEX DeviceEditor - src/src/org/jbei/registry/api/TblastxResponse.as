/**
 * TblastxResponse.as
 * This file was auto-generated from WSDL by the Apache Axis2 generator modified by Adobe
 * Any change made to this file will be overwritten when the code is re-generated.
 */
package org.jbei.registry.api
{
	import mx.utils.ObjectProxy;
	import mx.collections.ArrayCollection;
	import mx.collections.IList;
	import mx.collections.ICollectionView;
	import mx.rpc.soap.types.*;
	/**
	 * Typed array collection
	 */

	public class TblastxResponse extends ArrayCollection
	{
		/**
		 * Constructor - initializes the array collection based on a source array
		 */
        
		public function TblastxResponse(source:Array = null)
		{
			super(source);
		}
        
        
		public function addBlastResultAt(item:BlastResult,index:int):void 
		{
			addItemAt(item,index);
		}

		public function addBlastResult(item:BlastResult):void 
		{
			addItem(item);
		} 

		public function getBlastResultAt(index:int):BlastResult 
		{
			return getItemAt(index) as BlastResult;
		}

		public function getBlastResultIndex(item:BlastResult):int 
		{
			return getItemIndex(item);
		}

		public function setBlastResultAt(item:BlastResult,index:int):void 
		{
			setItemAt(item,index);
		}

		public function asIList():IList 
		{
			return this as IList;
		}
        
		public function asICollectionView():ICollectionView 
		{
			return this as ICollectionView;
		}
	}
}
