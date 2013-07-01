/**
 * CreatePlasmidResultEvent.as
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
    
	public class CreatePlasmidResultEvent extends Event
	{
		/**
		 * The event type value
		 */
		public static var CreatePlasmid_RESULT:String="CreatePlasmid_result";
		/**
		 * Constructor for the new event type
		 */
		public function CreatePlasmidResultEvent()
		{
			super(CreatePlasmid_RESULT,false,false);
		}
        
		private var _headers:Object;
		private var _result:CreatePlasmidResponse;
		public function get result():CreatePlasmidResponse
		{
			return _result;
		}

		public function set result(value:CreatePlasmidResponse):void
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