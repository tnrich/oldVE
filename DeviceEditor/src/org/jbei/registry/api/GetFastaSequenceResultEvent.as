/**
 * GetFastaSequenceResultEvent.as
 * This file was auto-generated from WSDL
 * Any change made to this file will be overwritten when the code is re-generated.
*/
package org.jbei.registry.api
{
	import mx.utils.ObjectProxy;
	import flash.events.Event;
	import flash.utils.ByteArray;
	import mx.rpc.soap.types.*;
	/**
	 * Typed event handler for the result of the operation
	 */
    
	public class GetFastaSequenceResultEvent extends Event
	{
		/**
		 * The event type value
		 */
		public static var GetFastaSequence_RESULT:String="GetFastaSequence_result";
		/**
		 * Constructor for the new event type
		 */
		public function GetFastaSequenceResultEvent()
		{
			super(GetFastaSequence_RESULT,false,false);
		}
        
		private var _headers:Object;
		private var _result:GetFastaSequenceResponse;
		public function get result():GetFastaSequenceResponse
		{
			return _result;
		}

		public function set result(value:GetFastaSequenceResponse):void
		{
			_result = value;
		}

		public function get headers():Object
		{
			return _headers;
		}

		public function set headers(value:Object):void
		{
			_headers = value;
		}
	}
}