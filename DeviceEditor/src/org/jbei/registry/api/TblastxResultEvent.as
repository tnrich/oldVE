/**
 * TblastxResultEvent.as
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
    
	public class TblastxResultEvent extends Event
	{
		/**
		 * The event type value
		 */
		public static var Tblastx_RESULT:String="Tblastx_result";
		/**
		 * Constructor for the new event type
		 */
		public function TblastxResultEvent()
		{
			super(Tblastx_RESULT,false,false);
		}
        
		private var _headers:Object;
		private var _result:TblastxResponse;
		public function get result():TblastxResponse
		{
			return _result;
		}

		public function set result(value:TblastxResponse):void
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