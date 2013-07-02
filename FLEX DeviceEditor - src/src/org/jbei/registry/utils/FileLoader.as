//Author: Doug Densmore


package org.jbei.registry.utils
{
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.net.FileReference;
	import flash.utils.ByteArray;
	
	import mx.controls.Alert;
	
	import org.puremvc.as3.patterns.mediator.Mediator;
	
	public class FileLoader
	{
		private var _fr:FileReference;
		private var _mediator:Mediator;
		private var _notification:String;
		private var _fileName:String;
		
			public function FileLoader(fileTypes:Array, mediator:Mediator, n:String)
			{
					_mediator = mediator;
					
					//create the FileReference instance
					_fr = new FileReference();
	
					//listen for when they select a file
					_fr.addEventListener(Event.SELECT, onFileSelect);
	
					//listen for when then cancel out of the browse dialog
					_fr.addEventListener(Event.CANCEL,onCancel);
					
					//open a native browse dialog that filters for text files
					_fr.browse(fileTypes);
					
					_notification = n;
			}
		

			//called when the user selects a file from the browse dialog
			private function onFileSelect(e:Event):void
			{
				//Set the name of the file you selected to load
				_fileName = _fr.name;
				
				//listen for when the file has loaded
				_fr.addEventListener(Event.COMPLETE, onLoadComplete);

				//listen for any errors reading the file
				_fr.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);

				//load the content of the file
				_fr.load();
			}


			//called when the user cancels out of the browser dialog
			private function onCancel(e:Event):void
			{
				trace("File Browse Canceled");
				_fr = null;
			}

			/************ Select Event Handlers **************/

			//called when the file has completed loading
			private function onLoadComplete(e:Event):void
			{
				//get the data from the file as a ByteArray
				var data:ByteArray= _fr.data;

				//package up both the file you got and the name of the file you got it from
				var returnArray:Array = new Array();
				returnArray[0] = data.readUTFBytes(data.bytesAvailable);
				returnArray[1] = _fileName;

				_mediator.sendNotification(_notification, returnArray);

				//clean up the FileReference instance
				_fr = null;
				
			}

			//called if an error occurs while loading the file contents
			private function onLoadError(e:IOErrorEvent):void
			{
				trace("Error loading file : " + e.text);
				Alert.show("Error loading file : " + e.text, "Error Message");
			}
			

	}
}