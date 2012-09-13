/**
 * Entry.as
 * This file was auto-generated from WSDL by the Apache Axis2 generator modified by Adobe
 * Any change made to this file will be overwritten when the code is re-generated.
 */

package org.jbei.registry.api
{
	import mx.utils.ObjectProxy;
	import flash.utils.ByteArray;
	import mx.rpc.soap.types.*;
    
    [RemoteClass]
	/**
	 * Wrapper class for a operation required type
	 */
    
	public class Entry
	{
		/**
		 * Constructor, initializes the type class
		 */
		public function Entry() {}
            
		public var alias:String;
		public var bioSafetyLevel:Number;
		public var creator:String;
		public var creatorEmail:String;
		[ArrayElementType("EntryFundingSource")]
		public var entryFundingSources:Array;
		public var intellectualProperty:String;
		public var keywords:String;
		[ArrayElementType("Link")]
		public var links:Array;
		public var longDescription:String;
		[ArrayElementType("Name")]
		public var names:Array;
		public var owner:String;
		public var ownerEmail:String;
		[ArrayElementType("PartNumber")]
		public var partNumbers:Array;
		public var recordId:String;
		public var references:String;
		[ArrayElementType("SelectionMarker")]
		public var selectionMarkers:Array;
		public var shortDescription:String;
		public var status:String;
	}
}