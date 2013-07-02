//Author: Douglas Densmore

package org.jbei.registry.utils
{
    [RemoteClass(alias="org.jbei.ice.services.johnny5.vo.FileInfo")]
	public class FileInfo
	{
		private var _name:String;
		private var _file:String;
		
		public function FileInfo()
		{
			_file = null;
			_name = null;
		}
		
		public function set name(n:String):void
		{
			_name = n;
		}
		
		public function get name():String
		{
			return _name;	
		}
		
		public function set file(f:String):void
		{
			_file = f;
		}
		
		public function get file():String
		{
			return _file;
		}
	}
}