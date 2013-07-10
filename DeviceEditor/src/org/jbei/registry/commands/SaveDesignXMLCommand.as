package org.jbei.registry.commands
{
    import flash.events.Event;
    import flash.events.IOErrorEvent;
    import flash.net.FileReference;
    
    import mx.controls.Alert;
    import mx.events.CloseEvent;
    
    import org.jbei.registry.ApplicationFacade;
    import org.jbei.registry.Notifications;
    import org.jbei.registry.mediators.MainCanvasMediator;
    import org.jbei.registry.utils.Logger;
    import org.jbei.registry.utils.XMLToolsV4;
    import org.puremvc.as3.interfaces.INotification;
    import org.puremvc.as3.patterns.command.SimpleCommand;
    
    public class SaveDesignXMLCommand extends SimpleCommand
    {
        private var fileRef:FileReference;
        private var outputString:String;
        private var cleanFileName:String;
        
        public override function execute(notification:INotification):void
        {
            fileRef = new FileReference()
            fileRef.addEventListener(IOErrorEvent.IO_ERROR, ioError);
            fileRef.addEventListener(Event.COMPLETE, designXMLSaved);
            
            var designXML:XML = XMLToolsV4.generateDesignXML();
            outputString = '<?xml version="1.0" encoding="UTF-8"?>\n' + designXML.toXMLString();
            
            var mainCanvasMediator:MainCanvasMediator = (facade as ApplicationFacade).retrieveMediator(MainCanvasMediator.NAME) as MainCanvasMediator;
            var existingFileName:String = mainCanvasMediator.lastLoadString;
            
            if (existingFileName.match(/[\\\/:*?"<>|%]/)) {
                cleanFileName = existingFileName.replace(/[\\\/:*?"<>|%]/g, "_");
                Alert.show("The existing file name " + existingFileName + " contains prohibited characters. " +
                    "The characters \ / : * ? \" < > | % are not allowed. Any of these characters present in the " +
                    "existing filename will be converted to underscores (_) in the save dialog. " +
                    "(The existing file will not be deleted.)", 
                    "Warning Message", Alert.OK, null, alertCloseHandler);
            } else {
                fileRef.save(outputString, existingFileName);
            }
        }
        
        private function ioError(event:IOErrorEvent):void
        {
            Alert.show("Error saving file : " + event.text + "\nPossibly a file is open already with this name", "Error Message");
        }
        
        private function designXMLSaved(event:Event):void
        {
            var fr:FileReference = event.target as FileReference;
            var mainCanvasMediator:MainCanvasMediator = (facade as ApplicationFacade).retrieveMediator(MainCanvasMediator.NAME) as MainCanvasMediator;
            
            sendNotification(Notifications.CHANGE_TITLE, fr.name);
            mainCanvasMediator.lastLoadString = fr.name;
            Logger.getInstance().info("Design saved");
        }
        
        private function alertCloseHandler(event:CloseEvent):void
        {
            fileRef.save(outputString, cleanFileName);
        }
    }
}