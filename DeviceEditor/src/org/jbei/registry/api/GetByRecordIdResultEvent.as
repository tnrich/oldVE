/**
 * GetByRecordIdResultEvent.as
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
    
	public class GetByRecordIdResultEvent extends Event
	{
		/**
		 * The event type value
		 */
		public static var GetByRecordId_RESULT:String="GetByRecordId_result";
		/**
		 * Constructor for the new event type
		 */
		public function GetByRecordIdResultEvent()
		{
			super(GetByRecordId_RESULT,false,false);
		}
        
		private var _headers:Object;
		private var _result:GetByRecordIdResponse;
		public function get result():GetByRecordIdResponse
		{
			return _result;
		}

		public function set result(value:GetByRecordIdResponse):void
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