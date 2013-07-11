/**
 * GetOriginalGenBankSequenceResultEvent.as
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
    
	public class GetOriginalGenBankSequenceResultEvent extends Event
	{
		/**
		 * The event type value
		 */
		public static var GetOriginalGenBankSequence_RESULT:String="GetOriginalGenBankSequence_result";
		/**
		 * Constructor for the new event type
		 */
		public function GetOriginalGenBankSequenceResultEvent()
		{
			super(GetOriginalGenBankSequence_RESULT,false,false);
		}
        
		private var _headers:Object;
		private var _result:GetOriginalGenBankSequenceResponse;
		public function get result():GetOriginalGenBankSequenceResponse
		{
			return _result;
		}

		public function set result(value:GetOriginalGenBankSequenceResponse):void
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