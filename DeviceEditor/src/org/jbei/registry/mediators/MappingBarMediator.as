// ActionScript file
// Author: Doug Densmore

package org.jbei.registry.mediators
{
        import flash.events.Event;
        
        import mx.collections.ArrayCollection;
        import mx.controls.Alert;
        
        import org.jbei.registry.ApplicationFacade;
        import org.jbei.registry.Notifications;
        import org.jbei.registry.api.FeaturedDNASequence;
        import org.jbei.registry.models.Part;
        import org.jbei.registry.proxies.EntryServiceProxy;
        import org.jbei.registry.view.ui.MappingBar;
        import org.jbei.registry.view.ui.dialogs.EntryDisplay;
        import org.jbei.registry.view.ui.dialogs.SequenceDisplay;
        import org.puremvc.as3.interfaces.INotification;
        import org.puremvc.as3.patterns.mediator.Mediator;
        
       
        public class MappingBarMediator extends Mediator
        {
                private const NAME:String = "MappingBarMediator"
               
                private var _mappingBar:MappingBar;
                private var _sequenceDisplay:SequenceDisplay;
                               
                // Constructor
                public function MappingBarMediator(viewComponent:Object=null)
                {
                        super(NAME, viewComponent);
                       
                        _mappingBar = viewComponent as MappingBar;
                       
                        _mappingBar.addEventListener(MappingBar.SEARCH, onSearch);
                        
                        _mappingBar.addEventListener(MappingBar.LOGIN, login);
                        _mappingBar.addEventListener(MappingBar.LOGOUT, logout);
                        
                        _mappingBar.addEventListener(MappingBar.MAP_ENTRY, map);
                        _mappingBar.addEventListener(MappingBar.GET_SEQUENCE, getSequence);
                        _mappingBar.addEventListener(MappingBar.MAP_SEQUENCE, mapSequence);
                        _mappingBar.addEventListener(MappingBar.MAP_GENBANK, mapGenbank);
                        _mappingBar.addEventListener(MappingBar.GET_GENBANK, getGenbank);
                }
               
                // Public Methods
                public override function listNotificationInterests():Array
                {
                        return [Notifications.SHOW_MAPPING_BAR
                                , Notifications.HIDE_MAPPING_BAR
                                
                                , Notifications.FIND_MATCH_FOUND
                                , Notifications.FIND_MATCH_NOT_FOUND
                                
                                , Notifications.LOGIN
                                , Notifications.LOGOUT
                                
                                , Notifications.ENTRY_FETCHED
                                , Notifications.GENBANK_FETCHED
                                , Notifications.SEQUENCE_FETCHED
                        ];
                }
               
                public override function handleNotification(notification:INotification):void
                {
                        switch(notification.getName()) {
                                case Notifications.SHOW_MAPPING_BAR:
                                        _mappingBar.show();
                                        break;
                                case Notifications.HIDE_MAPPING_BAR:
                                        _mappingBar.hide();
                                        break;
                                
                                //If a match is found then display the results
                                case Notifications.FIND_MATCH_FOUND:
                                        var ed:EntryDisplay = new EntryDisplay;
                                        ed.mappingBar = _mappingBar;
                                        ed.results = notification.getBody() as ArrayCollection;
                                        ed.displayResults();    
                                        break;
                                        
                                case Notifications.FIND_MATCH_NOT_FOUND:
                                        Alert.show("No match found for your search!", "Warning Message");
                                        break;

                                case Notifications.LOGIN:
                                		_mappingBar.disableLogin();
                                		break;
                                case Notifications.LOGOUT:
                                		_mappingBar.enableLogin();
                                		break;
                                
                                //Once an entry is chosen try to get the sequence		
                                case Notifications.ENTRY_FETCHED:
                                        var part:Part = ApplicationFacade.getInstance().getSelectedRectShape().part;
                                		if(ApplicationFacade.getInstance().getSelectedRectShape() != null)
                                		{
                                			//if(part.status.restricted != true)
                                			//{
                                				_sequenceDisplay = new SequenceDisplay();
                                				_sequenceDisplay.mappingBar = _mappingBar;
                                				_sequenceDisplay.getSequence();
                                			//}
                                		}
                                		break;
                                
                                case Notifications.GENBANK_FETCHED:
                                			_mappingBar.mapGenBank(notification.getBody() as String);
                                		break;
                                //If the sequence has been fetched display it		
                                case Notifications.SEQUENCE_FETCHED:
                                		_sequenceDisplay.displaySequence(notification.getBody() as FeaturedDNASequence);
                                		break;
                        }
                }
               
               
                // Private Methods
                private function onSearch(event:Event):void
                {
                     var esp:EntryServiceProxy = ApplicationFacade.getInstance().retrieveProxy(EntryServiceProxy.NAME) as EntryServiceProxy;
                	 esp.search(_mappingBar.searchTextInput.text.toString());                
                }
                          
 				private function getSequence(event:Event):void
 				{
 					var esp:EntryServiceProxy = ApplicationFacade.getInstance().retrieveProxy(EntryServiceProxy.NAME) as EntryServiceProxy;
 					esp.getSequence(_mappingBar._mappedEntry);
 				}
 				
 				private function getGenbank(event:Event):void
 				{
 					var esp:EntryServiceProxy = ApplicationFacade.getInstance().retrieveProxy(EntryServiceProxy.NAME) as EntryServiceProxy;
 					esp.getGenBankFile(_mappingBar._mappedEntry);
 				}

                private function onHideFindPanel(event:Event):void
                {
                        sendNotification(Notifications.HIDE_MAPPING_BAR);
                }
                
                private function login(event:Event):void
                {
                	var esp:EntryServiceProxy = ApplicationFacade.getInstance().retrieveProxy(EntryServiceProxy.NAME) as EntryServiceProxy;
                	esp.login(_mappingBar.userNameInput.text, _mappingBar.passwordInput.text);
                }
                
                private function logout(event:Event):void
                {
                	sendNotification(Notifications.LOGOUT);
                }
                
                private function map(event:Event):void
                {
                	sendNotification(Notifications.ENTRY_FETCHED, _mappingBar._mappedEntry);
                }
                
                private function mapSequence(event:Event):void
                {
                	//FIXME - complex notification body....
                	sendNotification(Notifications.SEQUENCE_MAPPED, [{seq:_mappingBar._mappedSequence, sBP:_mappingBar._sBP, stBP:_mappingBar._stBP, featureName:_mappingBar._featureName}]);
                }
                
                private function mapGenbank(event:Event):void
                {
                	sendNotification(Notifications.GENBANK_MAPPED, _mappingBar._mappedGenBank);
                }
                
                
        }
}

