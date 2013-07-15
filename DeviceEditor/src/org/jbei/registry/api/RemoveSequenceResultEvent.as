/**
 * RemoveSequenceResultEvent.as
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
    
	public class RemoveSequenceResultEvent extends Event
	{
		/**
		 * The event type value
		 */
		public static var RemoveSequence_RESULT:String="RemoveSequence_result";
		/**
		 * Constructor for the new event type
		 */
		public function RemoveSequenceResultEvent()
		{
			super(RemoveSequence_RESULT,false,false);
		}
        
		private var _headers:Object;
		private var _result:RemoveSequenceResponse;
		public function get result():RemoveSequenceResponse
		{
			return _result;
		}

		public function set result(value:RemoveSequenceResponse):void
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