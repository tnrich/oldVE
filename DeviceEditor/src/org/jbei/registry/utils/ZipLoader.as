// ActionScript file
// Author: Douglas Densmore

package org.jbei.registry.utils
{
	import flash.events.ErrorEvent;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.SecurityErrorEvent;
	import flash.net.FileReference;
	import flash.net.URLRequest;
	import flash.net.URLStream;
	import flash.utils.ByteArray;
	
	import mx.controls.Alert;
	
	import nochump.util.zip.ZipFile;
	
	import org.puremvc.as3.patterns.mediator.Mediator;
	
	public class ZipLoader
	{
		private var _fr:FileReference;
		private var _mediator:Mediator
		private var _notification:String;
		private var _fileName:String;
		private var _zipFile:ZipFile;
        
		public function ZipLoader(fileTypes:Array, mediator:Mediator, n:String)
		{
			_mediator = mediator;
					
			//create the FileReference instance
			_fr = new FileReference();
					
			//listen for when they select a file
			_fr.addEventListener(Event.SELECT, onFileSelect);

			//listen for when then cancel out of the browse dialog
			_fr.addEventListener(Event.CANCEL,onCancel);
            _fr.addEventListener(Event.COMPLETE, onCompleteLoad);
					
			//open a native browse dialog that filters for text files
			_fr.browse(fileTypes);
            
			_notification = n;
		}
		
        private function onCompleteLoad(e:Event):void
        {
            var zipByteArray:ByteArray = _fr.data;
            _zipFile = new ZipFile(zipByteArray);
            
            _mediator.sendNotification(_notification, _zipFile);
            
            //clean up the FileReference
            _fr = null;
        }
        
		private function onFileSelect(e:Event):void
		{
			//Set the name of the file you selected to load
			_fileName = _fr.name;
            _fr.load();
		}
		
		private function onCancel(e:Event):void
		{
			_fr = null;
		}
	
		//called on error events
		private function errorHandler(event:ErrorEvent):void {
				trace(event.text);
				Alert.show("Error with the zip file!", "Error Message");
		}
	}
}