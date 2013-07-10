/**
 * BlastResult.as
 * This file was auto-generated from WSDL by the Apache Axis2 generator modified by Adobe
 * Any change made to this file will be overwritten when the code is re-generated.
 */

package org.jbei.registry.api
{
	import mx.utils.ObjectProxy;
	import flash.utils.ByteArray;
	import mx.rpc.soap.types.*;
	/**
	 * Wrapper class for a operation required type
	 */
    
	public class BlastResult
	{
		/**
		 * Constructor, initializes the type class
		 */
		public function BlastResult() {}
            
		public var alignmentLength:Number;
		public var bitScore:Number;
		public var entry:org.jbei.registry.api.Entry;
		public var gapOpenings:Number;
		public var mismatches:Number;
		public var percentId:Number;
		public var queryId:String;
		public var relativeScore:Number;
		public var score:Number;
		public var subjectId:String;
		public var eValue:Number;
		public var qEnd:Number;
		public var qStart:Number;
		public var sEnd:Number;
		public var sStart:Number;
	}
}