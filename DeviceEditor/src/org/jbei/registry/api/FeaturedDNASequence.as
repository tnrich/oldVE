/**
 * FeaturedDNASequence.as
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
    
	public class FeaturedDNASequence extends org.jbei.registry.api.SimpleDNASequence
	{
		/**
		 * Constructor, initializes the type class
		 */
		public function FeaturedDNASequence() {}
            
		public var accessionNumber:String;
		[ArrayElementType("DnaFeature")]
		public var features:Array;
		public var identifier:String;
	}
}