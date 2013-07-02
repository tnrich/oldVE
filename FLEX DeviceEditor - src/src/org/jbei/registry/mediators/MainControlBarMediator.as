// ActionScript file

// Author: Doug Densmore

package org.jbei.registry.mediators
{
        import flash.events.Event;
        
        import mx.managers.PopUpManager;
        
        import org.jbei.registry.ApplicationFacade;
        import org.jbei.registry.Notifications;
        import org.jbei.registry.models.j5.J5Bin;
        import org.jbei.registry.proxies.J5CollectionProxy;
        import org.jbei.registry.view.ui.MainControlBar;
        import org.jbei.registry.view.ui.dialogs.Help;
        import org.jbei.registry.view.ui.dialogs.J5Controls;
        import org.jbei.registry.view.ui.dialogs.PropertiesDialog;
        import org.puremvc.as3.interfaces.INotification;
        import org.puremvc.as3.patterns.mediator.Mediator;
        import org.puremvc.as3.patterns.observer.Notification;
       

        public class MainControlBarMediator extends Mediator
        {
                private const NAME:String = "MainControlBarMediator";
               
                private var _controlBar:MainControlBar;
                private var propertiesDialog:PropertiesDialog;
                private var helpDialog:Help;
               
                // Constructor
                public function MainControlBarMediator(viewComponent:Object=null)
                {
                        super(NAME, viewComponent);
                       
                        _controlBar = viewComponent as MainControlBar;
                        
                        propertiesDialog = new PropertiesDialog();
                        helpDialog = new Help();

                        _controlBar.addEventListener(MainControlBar.J5CLICKED, showJ5Controls);  
                        _controlBar.addEventListener(MainControlBar.PROPERTIESCLICKED, showProperties);
                        _controlBar.addEventListener(MainControlBar.HELPCLICKED, showHelp);
                        
                        propertiesDialog.addEventListener(PropertiesDialog.DIGEST_RULE_PROPERTY_CHANGED, updateDigestRuleProperty);
                       
                        /* Need these added at some point:
                        Eugene
                        Registry
                        Help
                        */
                }
                
                public override function listNotificationInterests():Array
                {
                        return [
                        //, Notifications.SHOW_EUGENE_DIALOG
                        //, Notifications.SHOW_REGISTRY_DIALOG
                        
                        Notifications.CHANGE_TITLE
                        ];
                        
                }
               
                public override function handleNotification(notification:INotification):void
                {
                        switch(notification.getName()) {
                                /*case Notifications.SHOW_EUGENE_DIALOG:
                                        //FIXME;
                                        break;*/
                                /*case Notifications.SHOW_REGISTRY_DIALOG:
                                        //FIXME
                                        break;*/
                                case Notifications.CHANGE_TITLE:
                                		var title:String = notification.getBody() as String;
                                		var regEx:RegExp = /\.xml/;
                                		title = title.replace(regEx, "");
                                		_controlBar.setTitle(title);
                                		break;
                        }
                }
               
                // Private Methods                                         
                private function showJ5Controls(event:Event):void
                {			                                
                    sendNotification(Notifications.NEW_SHOW_J5_DIALOG);
                }
                
                private function showHelp(event:Event):void
                {			                                
                    PopUpManager.addPopUp(helpDialog, ApplicationFacade.getInstance().application, true);
                    PopUpManager.centerPopUp(helpDialog);
                }
                
                private function showProperties(event:Event):void
                {			                                
                    PopUpManager.addPopUp(propertiesDialog, ApplicationFacade.getInstance().application, true);
                    PopUpManager.centerPopUp(propertiesDialog);
                }
                
                private function updateDigestRuleProperty(event:Event):void
                {
                    //set digest rule property
                    var enableDigestRule:Boolean = propertiesDialog.digestRuleCheckBox.selected;
                    ApplicationFacade.getInstance().isDigestRuleEnabled = enableDigestRule;
                    
                    //run bin FAS check on all if turning on digest rule
                    if (enableDigestRule) {
                        var j5CollectionProxy:J5CollectionProxy = (facade as ApplicationFacade).retrieveProxy(J5CollectionProxy.NAME) as J5CollectionProxy;
                        var bins:Vector.<J5Bin> = j5CollectionProxy.j5Collection.binsVector;
                        
                        for (var i:int = 0; i < bins.length; i++) {
                            sendNotification(Notifications.NEW_CHECK_BIN_FAS, bins[i]);
                        }
                    }
                }
        }
}
