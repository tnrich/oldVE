/**
 * RemoveEntryResultEvent.as
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
    
	public class RemoveEntryResultEvent extends Event
	{
		/**
		 * The event type value
		 */
		public static var RemoveEntry_RESULT:String="RemoveEntry_result";
		/**
		 * Constructor for the new event type
		 */
		public function RemoveEntryResultEvent()
		{
			super(RemoveEntry_RESULT,false,false);
		}
        
		private var _headers:Object;
		private var _result:RemoveEntryResponse;
		public function get result():RemoveEntryResponse
		{
			return _result;
		}

		public function set result(value:RemoveEntryResponse):void
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