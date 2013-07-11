/**
 * SearchResponse.as
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

	public class SearchResponse extends ArrayCollection
	{
		/**
		 * Constructor - initializes the array collection based on a source array
		 */
        
		public function SearchResponse(source:Array = null)
		{
			super(source);
		}
        
        
		public function addSearchResultAt(item:SearchResult,index:int):void 
		{
			addItemAt(item,index);
		}

		public function addSearchResult(item:SearchResult):void 
		{
			addItem(item);
		} 

		public function getSearchResultAt(index:int):SearchResult 
		{
			return getItemAt(index) as SearchResult;
		}

		public function getSearchResultIndex(item:SearchResult):int 
		{
			return getItemIndex(item);
		}

		public function setSearchResultAt(item:SearchResult,index:int):void 
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
