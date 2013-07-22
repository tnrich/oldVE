/**
 * GetGenBankSequenceResultEvent.as
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
    
	public class GetGenBankSequenceResultEvent extends Event
	{
		/**
		 * The event type value
		 */
		public static var GetGenBankSequence_RESULT:String="GetGenBankSequence_result";
		/**
		 * Constructor for the new event type
		 */
		public function GetGenBankSequenceResultEvent()
		{
			super(GetGenBankSequence_RESULT,false,false);
		}
        
		private var _headers:Object;
		private var _result:GetGenBankSequenceResponse;
		public function get result():GetGenBankSequenceResponse
		{
			return _result;
		}

		public function set result(value:GetGenBankSequenceResponse):void
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