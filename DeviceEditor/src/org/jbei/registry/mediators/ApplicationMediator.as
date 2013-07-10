// ActionScript file
// Author: Doug Densmore

package org.jbei.registry.mediators
{
        import flash.events.Event;
        import flash.events.KeyboardEvent;
        import flash.ui.Keyboard;
        
        import mx.containers.Box;
        import mx.core.Application;
        
        import org.jbei.registry.ApplicationFacade;
        import org.jbei.registry.Notifications;
        import org.jbei.registry.utils.Logger;
        import org.puremvc.as3.interfaces.INotification;
        import org.puremvc.as3.patterns.mediator.Mediator;

        public class ApplicationMediator extends Mediator
        {
                private const NAME:String = "ApplicationMediator";
                
                private var applicationBox:Box;
                private var applicationFacade:ApplicationFacade;
                
                // Constructor
                public function ApplicationMediator(viewComponent:Object=null)
                {
                        super(NAME, viewComponent);
                        
                        applicationFacade = facade as ApplicationFacade;
                        
                        applicationBox = (viewComponent as DeviceEditor).applicationBox;
                        
                        applicationBox.addEventListener(Event.CUT, onCut);
                        applicationBox.addEventListener(Event.COPY, onCopy);
                        applicationBox.addEventListener(Event.PASTE, onPaste);
                        applicationBox.addEventListener(Event.CLEAR, onClear);
                        
                        applicationBox.addEventListener(KeyboardEvent.KEY_UP, onKeyPressed); //for catching delete key
                }
                
                // Public Methods
                public override function listNotificationInterests():Array
                {
                        return [Notifications.APPLICATION_FAILURE,
                        		Notifications.LOGIN,
                        		Notifications.LOGOUT
                               ];
                }
                
                public override function handleNotification(notification:INotification):void
                {
                        switch(notification.getName()) {
                                case Notifications.APPLICATION_FAILURE:
                                        ApplicationFacade.getInstance().application.disableApplication(notification.getBody() as String);                       
                                        break; 
                                case Notifications.LOGIN:
                                        ApplicationFacade.getInstance().sessionId = notification.getBody() as String;
                                        Logger.getInstance().info("Session ID = " + notification.getBody() as String);
                                        break; 
                                case Notifications.LOGOUT:
                                        ApplicationFacade.getInstance().sessionId = null;
                                        Logger.getInstance().info("Session ID Cleared");
                                        break;                     
                        }
                }
                
                // Event Handlers
                private function onCut(event:Event):void
                {
                    if (applicationFacade.selectedPartRenderer != null) {
                        sendNotification(Notifications.NEW_CUT);
                    }
                }
                
                private function onCopy(event:Event):void
                {
                    if (applicationFacade.selectedPartRenderer != null) {
                        sendNotification(Notifications.NEW_COPY);
                    }
                }
                
                private function onPaste(event:Event):void
                {
                    if (applicationFacade.selectedPartRenderer != null) { //can only paste into grid location in grid view
                        sendNotification(Notifications.NEW_PASTE);
                    }
                }
                
                private function onClear(event:Event):void
                {
                    if (applicationFacade.selectedPartRenderer != null) {
                        sendNotification(Notifications.NEW_CLEAR);
                    }
                }
                
                private function onKeyPressed(event:KeyboardEvent):void
                {
                    if (event.keyCode == Keyboard.DELETE && applicationFacade.selectedPartRenderer != null) {
                        sendNotification(Notifications.NEW_CLEAR);
                    }
                }
        }
}
