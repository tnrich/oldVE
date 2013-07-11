/**
 * IsAuthenticatedResultEvent.as
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
    
	public class IsAuthenticatedResultEvent extends Event
	{
		/**
		 * The event type value
		 */
		public static var IsAuthenticated_RESULT:String="IsAuthenticated_result";
		/**
		 * Constructor for the new event type
		 */
		public function IsAuthenticatedResultEvent()
		{
			super(IsAuthenticated_RESULT,false,false);
		}
        
		private var _headers:Object;
		private var _result:IsAuthenticatedResponse;
		public function get result():IsAuthenticatedResponse
		{
			return _result;
		}

		public function set result(value:IsAuthenticatedResponse):void
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