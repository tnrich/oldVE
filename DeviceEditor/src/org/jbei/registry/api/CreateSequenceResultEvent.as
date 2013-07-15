/**
 * CreateSequenceResultEvent.as
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
    
	public class CreateSequenceResultEvent extends Event
	{
		/**
		 * The event type value
		 */
		public static var CreateSequence_RESULT:String="CreateSequence_result";
		/**
		 * Constructor for the new event type
		 */
		public function CreateSequenceResultEvent()
		{
			super(CreateSequence_RESULT,false,false);
		}
        
		private var _headers:Object;
		private var _result:CreateSequenceResponse;
		public function get result():CreateSequenceResponse
		{
			return _result;
		}

		public function set result(value:CreateSequenceResponse):void
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