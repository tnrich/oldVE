/**
 * UpdateStrainResultEvent.as
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
    
	public class UpdateStrainResultEvent extends Event
	{
		/**
		 * The event type value
		 */
		public static var UpdateStrain_RESULT:String="UpdateStrain_result";
		/**
		 * Constructor for the new event type
		 */
		public function UpdateStrainResultEvent()
		{
			super(UpdateStrain_RESULT,false,false);
		}
        
		private var _headers:Object;
		private var _result:UpdateStrainResponse;
		public function get result():UpdateStrainResponse
		{
			return _result;
		}

		public function set result(value:UpdateStrainResponse):void
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