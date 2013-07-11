/**
 * GetNumberOfPublicEntriesResultEvent.as
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
    
	public class GetNumberOfPublicEntriesResultEvent extends Event
	{
		/**
		 * The event type value
		 */
		public static var GetNumberOfPublicEntries_RESULT:String="GetNumberOfPublicEntries_result";
		/**
		 * Constructor for the new event type
		 */
		public function GetNumberOfPublicEntriesResultEvent()
		{
			super(GetNumberOfPublicEntries_RESULT,false,false);
		}
        
		private var _headers:Object;
		private var _result:GetNumberOfPublicEntriesResponse;
		public function get result():GetNumberOfPublicEntriesResponse
		{
			return _result;
		}

		public function set result(value:GetNumberOfPublicEntriesResponse):void
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