// ActionScript file
// Author: Doug Densmore

package org.jbei.registry.mediators
{
        import org.jbei.registry.ApplicationFacade;
        import org.jbei.registry.Notifications;
        import org.jbei.registry.api.Entry;
        import org.jbei.registry.models.Part;
        import org.jbei.registry.view.ui.shapes.CollectionShape;
        import org.jbei.registry.view.ui.shapes.RectShape;
        import org.jbei.registry.proxies.J5CollectionProxy;
        import org.jbei.registry.utils.*;
        import org.jbei.registry.view.ui.Colors;
        import org.jbei.registry.view.ui.StatusBar;
        import org.puremvc.as3.interfaces.INotification;
        import org.puremvc.as3.patterns.mediator.Mediator;
       
        public class StatusBarMediator extends Mediator
        {
                private const NAME:String = "StatusBarMediator";
               
                private var _statusBar:StatusBar;
                               
                // Constructor
                public function StatusBarMediator(viewComponent:Object=null)
                {
                        super(NAME, viewComponent);
                       
                        _statusBar = viewComponent as StatusBar;
                }
               
                // Public Methods
                public override function listNotificationInterests():Array
                {
                        return [Notifications.NEW_UPDATE_COLLECTION_DISPLAY_INFO

                                , Notifications.NEW_LEFT_CANVAS_COLLECTION_CLICKED
                                
                                , Notifications.NEW_CLEAR_DISPLAY_INFO
                                , Notifications.NEW_UPDATE_STATUS_BAR_BASIC
                        ];
                }
               
                public override function handleNotification(notification:INotification):void
                {
                        switch(notification.getName()) {
                                case Notifications.NEW_UPDATE_COLLECTION_DISPLAY_INFO:
                                		updateStatusBarCollection(notification.getBody() as CollectionShape);
                                		break;
                                
                                case Notifications.NEW_LEFT_CANVAS_COLLECTION_CLICKED:
                                        clearStatusBar();
                                        break;
                                
                                case Notifications.NEW_CLEAR_DISPLAY_INFO:
                                        clearStatusBar();
                                        break;
                                
                                case Notifications.NEW_UPDATE_STATUS_BAR_BASIC:
                                        updateStatusBarBasic(notification.getBody() as RectShape);
                        }
                }
                
                
                //Private functions to update the status bar values
 
                private function updateStatusBarBasic(rectShape:RectShape):void
                {
                	clearStatusBar();
                	_statusBar.iconInfoLabel.setStyle("color", "0x000000");
                	if(rectShape != null)
                	{
                		//Set the name to display
                        var part:Part = rectShape.part;

	                    if(part.name != "")
	                    	_statusBar.iconInfoLabel.text = "Name: " + part.name;
	                    /*else if(part.entry != null && part.entry.names != null)
	                    	_statusBar.iconInfoLabel.text = "Name: " + part.entry.names[0].name;*/
	                    else
	                        _statusBar.iconInfoLabel.text = "Name: No name";
	                     
	                    //Set the short description that is displayed                    
	                    /*if(part.entry != null && part.entry.shortDescription != null)
	                       _statusBar.iconInfoLabel.text = _statusBar.iconInfoLabel.text + "\nShort Description: " + part.entry.shortDescription;
	                    else
	                    	_statusBar.iconInfoLabel.text = _statusBar.iconInfoLabel.text + "\nShort Description: No short description";*/
	                                        
	                    //Mapped status
	                    _statusBar.iconStatusLabel.text = "Mapped: " + part.hasSequence.toString();
	                    //Collection status
                        var j5CollectionProxy:J5CollectionProxy = facade.retrieveProxy(J5CollectionProxy.NAME) as J5CollectionProxy;
	                    _statusBar.collectionStatusLabel.text = "In Collection: " + j5CollectionProxy.isInCollection(part).toString();
	                    //X/Y pos
	                    _statusBar.selectionPositionLabel.text = rectShape.x.toString() + ":" + rectShape.y.toString();
                 	}
                	
                }
                
                //Update the status bar with the entry info
                /*private function updateStatusBarEntry(e:Entry):void
                {
                	clearStatusBar();
                	_statusBar.iconInfoLabel.setStyle("color", "0x000000");
                	if(e != null)
                	{
	                    if(e.names != null)
	                    	_statusBar.iconInfoLabel.text = "Name: " + e.names[0].name;
	                    else
	                        _statusBar.iconInfoLabel.text = "Name: No name";
	                                        
	                    if(e.shortDescription != null)
	                       _statusBar.iconInfoLabel.text = _statusBar.iconInfoLabel.text + "\nShort Description: " + e.shortDescription;
	                    else
	                    	_statusBar.iconInfoLabel.text = _statusBar.iconInfoLabel.text + "\ntShort Description: No short description";
	                           
	                    var baseShape:RectShape = ApplicationFacade.getInstance().getSelectedRectShape();
                        var part:Part = baseShape.part;
	                    _statusBar.iconStatusLabel.text = "Mapped: " + part.hasEntry.toString();
	                    _statusBar.collectionStatusLabel.text = "In Collection: " + part.status.inCollection.toString();
	                    _statusBar.selectionPositionLabel.text = baseShape.x.toString() + ":" + baseShape.y.toString();
                 	}
                	
                }*/
                
                private function updateStatusBarCollection(c:CollectionShape):void
                {
                	clearStatusBar();
                	if(c != null)
                	{
	                	_statusBar.iconInfoLabel.setStyle("color", "0x000000");
	                	_statusBar.iconInfoLabel.text = "Collection: ";
	                    _statusBar.iconStatusLabel.text = "Bin Count: " + c.collection.binCount().toString();       
	                    _statusBar.selectionPositionLabel.text = c.x.toString() + ":" + c.y.toString();
                 	}
                	
                }
                
                private function clearStatusBar():void
                {
                	_statusBar.iconInfoLabel.text = "";
                	_statusBar.iconStatusLabel.text = "";
                	_statusBar.collectionStatusLabel.text = "";
                	_statusBar.selectionPositionLabel.text = "- : -";
                }
                
                private function updateStatusBarChangeIcon():void
                {
                	_statusBar.iconInfoLabel.text = "Copy Icon Mode Enabled";
                	_statusBar.iconInfoLabel.setStyle("color", Colors.COLLECTION_GREEN);
                	
                }
                
        }
}


