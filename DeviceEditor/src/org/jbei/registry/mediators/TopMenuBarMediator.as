// ActionScript file

// Author: Doug Densmore

package org.jbei.registry.mediators
{
        import flash.events.Event;
        
        import mx.controls.Alert;
        import mx.core.Application;
        import mx.events.CloseEvent;
        
        import org.jbei.registry.Notifications;
        import org.jbei.registry.view.ui.TopMenuBar;
        import org.puremvc.as3.interfaces.INotification;
        import org.puremvc.as3.patterns.mediator.Mediator;
        import org.puremvc.as3.patterns.observer.Notification;

        public class TopMenuBarMediator extends Mediator
        {
                private const NAME:String = "TopMenuBarMediator";
               
                private var _topMenuBar:TopMenuBar
               
                // Constructor
                public function TopMenuBarMediator(viewComponent:Object=null)
                {
                        super(NAME, viewComponent);
                       
                        _topMenuBar = viewComponent as TopMenuBar;

                        _topMenuBar.addEventListener(TopMenuBar.MAP_GENBANK, mapGenbank);
                        //_topMenuBar.addEventListener(TopMenuBar.MAP_FASTA, mapFasta);
                        _topMenuBar.addEventListener(TopMenuBar.MAP_CLIPBOARD, mapClipboard);
                        _topMenuBar.addEventListener(TopMenuBar.HIDE_MAP, hideMappingBar); 
                        _topMenuBar.addEventListener(TopMenuBar.SHOW_MAP, showMappingBar);  
                        _topMenuBar.addEventListener(TopMenuBar.LOAD_XML, loadDesignXML);
                        _topMenuBar.addEventListener(TopMenuBar.LOAD_J5, loadDesignJ5);
                        _topMenuBar.addEventListener(TopMenuBar.LOAD_SLIC_EXAMPLE, loadSlicExample);
                        _topMenuBar.addEventListener(TopMenuBar.LOAD_COMBINATORIAL_SLIC_EXAMPLE, loadCombinatorialSlicExample);
                        _topMenuBar.addEventListener(TopMenuBar.LOAD_GOLDEN_GATE_EXAMPLE, loadGoldenGateExample);
                        _topMenuBar.addEventListener(TopMenuBar.LOAD_COMBINATORIAL_GOLDEN_GATE_EXAMPLE, loadCombinatorialGoldenGateExample);
                        _topMenuBar.addEventListener(TopMenuBar.SAVE, saveDesign); 
                        _topMenuBar.addEventListener(TopMenuBar.CLEAR_DESIGN, clearDesignVerification);
                        _topMenuBar.addEventListener(TopMenuBar.IMPORT_EUGENE_RULES, importEugeneRules);
                        _topMenuBar.addEventListener(TopMenuBar.TOP_MENU_PASTE, pasteShape);
                        
                        _topMenuBar.addEventListener(Event.COPY, copy);
                        

                }
               
                public override function listNotificationInterests():Array
                {
                        return [
                        ];
                }
               
                public override function handleNotification(notification:INotification):void
                {

                }
               
                // Private Methods                                         
                private function mapGenbank(event:Event):void
                {
                		sendNotification(Notifications.NEW_GENBANK_IMPORT_START);
                }   
                
                //private function mapFasta(event:Event):void
                //{
                //		sendNotification(Notifications.FASTA_IMPORT_START);
                //}
                
                private function mapClipboard(event:Event):void
                {
                    sendNotification(Notifications.NEW_CLIPBOARD_PASTE_START);
                }
                
                private function hideMappingBar(event:Event):void
                {
                		sendNotification(Notifications.HIDE_MAPPING_BAR);
                }   
                
                private function showMappingBar(event:Event):void
                {
                		sendNotification(Notifications.SHOW_MAPPING_BAR);
                }   
                
                private function saveDesign(event:Event):void
                {
                		//sendNotification(Notifications.SAVE);
                        sendNotification(Notifications.NEW_SAVE_XML);
                }
                
                private function loadDesignXML(event:Event):void
                {
                		sendNotification(Notifications.LOAD_XML);
                }
                
                private function loadDesignJ5(event:Event):void
                {
                        sendNotification(Notifications.NEW_OPEN_J5IMPORT_DIALOG);
                }
                
                private function loadSlicExample(event:Event):void
                {
                        sendNotification(Notifications.NEW_LOAD_SLIC_EXAMPLE);
                }
                
                private function loadCombinatorialSlicExample(event:Event):void
                {
                        sendNotification(Notifications.NEW_LOAD_COMBINATORIAL_SLIC_EXAMPLE);
                }
                
                private function loadGoldenGateExample(event:Event):void
                {
                        sendNotification(Notifications.NEW_LOAD_GOLDEN_GATE_EXAMPLE);
                }
                
                private function loadCombinatorialGoldenGateExample(event:Event):void
                {
                        sendNotification(Notifications.NEW_LOAD_COMBINATORIAL_GOLDEN_GATE_EXAMPLE);
                }
                
                private function clearDesignVerification(event:Event):void
                {
                        Alert.show("Are you sure you want to clear the design? Any unsaved changes will be lost.", 
                            "Clear Design", Alert.OK | Alert.CANCEL, null, clearDesign, null, Alert.OK);
                }
                
                private function clearDesign(event:CloseEvent):void
                {
                        if (event.detail==Alert.OK) {
                            sendNotification(Notifications.NEW_CLEAR_DESIGN);
                            sendNotification(Notifications.CHANGE_TITLE, "new_design.xml");
                        }
                }
                
                private function importEugeneRules(event:Event):void
                {
                        sendNotification(Notifications.NEW_IMPORT_EUGENE_RULES);
                }
                
                private function copy(event:Event):void
                {
                		sendNotification(Notifications.NEW_COPY);
                }
                
                private function pasteShape(event:Event):void
                {
                        Alert.show("To paste, please use Ctrl+V or the right click context menu in the workspace", "Alert");
                        sendNotification(Notifications.NEW_SET_FOCUS_ON_SELECTED);
                }
        }
}
