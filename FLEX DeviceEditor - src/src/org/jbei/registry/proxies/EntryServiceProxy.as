//Author: Douglas Densmore

// ActionScript file

package org.jbei.registry.proxies
{
        import flash.utils.Dictionary;
        
        import mx.collections.ArrayCollection;
        import mx.controls.Alert;
        import mx.rpc.AsyncToken;
        import mx.rpc.events.ResultEvent;
        
        import org.jbei.registry.ApplicationFacade;
        import org.jbei.registry.Notifications;
        import org.jbei.registry.api.Entry;
        import org.jbei.registry.api.FeaturedDNASequence;
        import org.jbei.registry.api.GetGenBankSequence;
        import org.jbei.registry.api.GetGenBankSequenceResultEvent;
        import org.jbei.registry.api.GetSequence;
        import org.jbei.registry.api.GetSequenceResultEvent;
        import org.jbei.registry.api.Login;
        import org.jbei.registry.api.LoginResultEvent;
        import org.jbei.registry.api.Name;
        import org.jbei.registry.api.RegistryAPIService;
        import org.jbei.registry.api.Search;
        import org.jbei.registry.api.SearchResultEvent;
        import org.jbei.registry.mediators.MainCanvasMediator;
        import org.jbei.registry.models.Part;
        import org.jbei.registry.models.j5.J5Bin;
        import org.jbei.registry.view.ui.shapes.CollectionShape;
        import org.jbei.registry.view.ui.shapes.RectShape;
        import org.jbei.registry.utils.Logger;
        

        public class EntryServiceProxy extends AbstractServiceProxy
        {

			private var _entry:Entry

			public static const NAME:String = "EntriesServiceProxy";
            private static const ENTRIES_SERVICE_NAME:String = "EntriesService";

			public function EntryServiceProxy():void
			{
				super(NAME, ENTRIES_SERVICE_NAME);			
			}
			
			public function get entry():Entry
			{
				return _entry;
			}
			
			public function fetchEntry(authToken:String, recordId:String):void
            {              
                service.getEntry(authToken, recordId);
            }
			
            protected override function registerServiceOperations():void
            {
            	super.registerServiceOperations();
            	
                service.getEntry.addEventListener(ResultEvent.RESULT, onEntriesServiceGetEntryResult);
            }
                
			// Private Methods
			//FIXME- Not currently really used since web services are primarily used....
            private function onEntriesServiceGetEntryResult(event:ResultEvent):void
            {
                /*if(!event.result) {
                     sendNotification(Notifications.APPLICATION_FAILURE, "Failed to fetch entry! Invalid response result type!");
                                
                               return;
                }*/
                        
                //sendNotification(Notifications.DATA_FETCHED);
                        
                updateEntry(event.result as Entry);
             }


			//FIXME- Not currently really used since web services are primarily used....
			private function updateEntry(entry:Entry):void
            {                 
                //sendNotification(Notifications.ENTRY_FETCHED);
                        
                //Logger.getInstance().info("Entry fetched successfully");
            }


			//Function to popluate an entry for testing
			private function populateDummyEntryTypeOne(e:Entry):void
			{
				e.alias = "Dr. Doom";
				e.bioSafetyLevel = 1000;
				e.creatorEmail = "lastname@domain.edu";
				e.recordId = "666";
				e.longDescription = "Man this is long";
				e.shortDescription = "Man this is short";
				e.status = "Elite";
				e.creator = "Douglas Densmore";
			}
			
			//Function to popluate an entry for testing
			private function populateDummyEntryTypeTwo(e:Entry):void
			{
				e.alias = "Captain America";
				e.bioSafetyLevel = 10;
				e.creatorEmail = "firstname@server.org";
				e.recordId = "007";
				e.longDescription = "Man this is not long";
				e.shortDescription = "Man this is not short";
				e.status = "Grad Student";
				e.creator = "Douglas Densmore";
			}
			
			//Dummy entry for when a genbank file is imported externally
			/*public function createGenbankImportEntry():Entry
			{
				var entry:Entry = new Entry();
				entry.alias = "Genbank Import";
				entry.bioSafetyLevel = 0;
				entry.creatorEmail = "N/A";
				entry.recordId = "N/A";
				entry.longDescription = "This is an place holder entry for Genbank import";
				entry.shortDescription = "Genbank import entry";
				entry.status = "N/A";
				entry.creator = "N/A";
				entry.names = new Array();
				entry.names[0] = new Name();
				entry.names[0].name = makeUniquePartName("Genbank_placeholder");
				
				return entry;
			}
			
			//Dummy entry for when a fasta file is imported externally
			public function createFastaImportEntry():Entry
			{
				var entry:Entry = new Entry();
				entry.alias = "FASTA Import";
				entry.bioSafetyLevel = 0;
				entry.creatorEmail = "N/A";
				entry.recordId = "N/A";
				entry.longDescription = "This is an place holder entry for FASTA import";
				entry.shortDescription = "FASTA import entry";
				entry.status = "N/A";
				entry.creator = "N/A";
				entry.names[0].name = makeUniquePartName("FASTA Import Entry");
				
				return entry;
			}
			
			
            private function makeUniquePartName(prefix:String):String
            {
                var baseShapes:Vector.<RectShape> = (ApplicationFacade.getInstance().retrieveMediator(CenterCanvasMediator.NAME) as CenterCanvasMediator).rectShapes;
                
                //Go through all the collections to see if there are two shapes with the same name and mapped
                var names:Dictionary = new Dictionary();
                
                if(baseShapes) {
                    for(var i:int = 0; i < baseShapes.length; i++)
                    {
                        var baseShape:RectShape = baseShapes[i];
                        if(baseShape.part.hasEntry)
                        {
                            names[baseShape.part.j5.name] = true;
                        }
                    }
                }
                
                var index:int = 0;
                while(true) {
                    var newName:String = prefix + index;
                    
                    if(names[newName] == null) {
                        return newName;
                    }
                    
                    index++;
                }
                
                return prefix;
            }*/
            
			//FIXME - need to handle part numbers, selection markers, links, entry funding source - do these similiar to how names are handled
			public function exportEntryXML(entry:Entry):XML
			{
				var returnXML:XML;
                if (entry != null) {
                    returnXML = 
                        <entry>
                            <alias>{entry.alias}</alias>
                            <bioSafetyLevel>{entry.bioSafetyLevel.toString()}</bioSafetyLevel>
                            <creatorEmail>{entry.creatorEmail}</creatorEmail>
                            <creator>{entry.creator}</creator>
                            <intellectualProperty>{entry.intellectualProperty}</intellectualProperty>
                            <keywords>{entry.keywords}</keywords>
                            <longdescription>{entry.longDescription}</longdescription>
                            <shortdescription>{entry.shortDescription}</shortdescription>
                            <owner>{entry.owner}</owner>
                            <ownerEmail>{entry.ownerEmail}</ownerEmail>
                            <recordId>{entry.recordId}</recordId>
                            <references>{entry.references}</references>
                            <status>{entry.status}</status>	
                            {entryNamesToXML(entry)}
                        </entry>;			
                } else {
                    returnXML = 
                        <entry>
                            <alias>null</alias>
                            <bioSafetyLevel>NaN</bioSafetyLevel>
                            <creatorEmail>null</creatorEmail>
                            <creator>null</creator>
                            <intellectualProperty>null</intellectualProperty>
                            <keywords>null</keywords>
                            <longdescription>null</longdescription>
                            <shortdescription>null</shortdescription>
                            <owner>null</owner>
                            <ownerEmail>null</ownerEmail>
                            <recordId>null</recordId>
                            <references>null</references>
                            <status>null</status>
                            <names/>
                        </entry>;			
                }

			return returnXML;
			}
			
			private function entryNamesToXML(entry:Entry):XML
			{
				var index:int;
				var returnXML:XML =  new XML(<names></names>);
				if(entry.names != null)
				{
					for(index = 0; index<entry.names.length; index++)
					{
						var nameXML:XML = <name>{entry.names[index].name}</name>
						returnXML.appendChild(nameXML);	
					}
				}
				return returnXML;
			}
			
			//FIXME - going to need to handle the part numbers, selection markers, links, and entry funding sources too...
			public function createEntry(entryXML:XML):Entry
			{
				var returnEntry:Entry;
                                
                if (entryXML.recordId == "null") {
                    returnEntry = null;
                } else {
                    returnEntry = new Entry();
                    returnEntry.alias = entryXML.alias;
                    returnEntry.bioSafetyLevel = entryXML.bioSafetyLevel;
                    returnEntry.creatorEmail = entryXML.creatorEmail;
                    returnEntry.creator = entryXML.creator;				
                    returnEntry.intellectualProperty = entryXML.intellectualProperty;
                    returnEntry.keywords = entryXML.keywords;
                    returnEntry.longDescription = entryXML.longdescription;
                    returnEntry.shortDescription = entryXML.shortdescription;
                    returnEntry.owner = entryXML.owner;
                    returnEntry.ownerEmail = entryXML.ownerEmail;
                    returnEntry.recordId = entryXML.recordId;
                    returnEntry.references = entryXML.references;
                    returnEntry.status = entryXML.status;
                    
                    var namesXML:XMLList = entryXML.names;
                    returnEntry.names = new Array();
                    for(var index:int = 0; index<namesXML.length(); index++)
                    {
                        var name:XML = namesXML[index];
                        setEntryName(returnEntry, index, name.name);
                    }
                }
		
				return returnEntry;
			}
			
			private function setEntryName(e:Entry, i:int, name:String):void
			{
				var nameObj:Name = new Name();
				nameObj.name = name;
				e.names[i]= nameObj;
			}
			
			//FIXME - need to save features!
			public function exportSequenceXML(sequence:FeaturedDNASequence):XML
            {		
                var returnXML:XML;
                if (sequence != null) {
                    returnXML = 
                        <featuredDNASequence>
                            <accessionNumber>{sequence.accessionNumber}</accessionNumber>
                            <identifier>{sequence.identifier}</identifier>
                            <sequence>{sequence.sequence}</sequence>
                        </featuredDNASequence>;
                } else {
                    returnXML = 
                        <featuredDNASequence>
                            <accessionNumber>null</accessionNumber>
                            <identifier>null</identifier>
                            <sequence>null</sequence>
                        </featuredDNASequence>;
                }
                return returnXML;
            }

			//FIXME - going to need to add support for feature restore
			/*public function createSequence(sequenceXML:XML):FeaturedDNASequence
			{	
				var returnSequence:FeaturedDNASequence = new FeaturedDNASequence();
				
                if (sequenceXML.sequence == "null") {
                    returnSequence = null;
                } else {
                    returnSequence = new FeaturedDNASequence();
                    returnSequence.accessionNumber = sequenceXML.accessionNumber;
                    returnSequence.sequence = sequenceXML.sequence;
                    returnSequence.identifier = sequenceXML.identifier;
                }
		
				return returnSequence;	
			}*/
			
			public function copyEntry(e:Entry):Entry
			{
				var copy:Entry;
                
                if (e == null) {
                    copy = null;
                } else {
                    copy = new Entry();
                    copy.alias = e.alias;
                    copy.bioSafetyLevel = e.bioSafetyLevel;
                    copy.creatorEmail = e.creatorEmail;
                    copy.creator = e.creator;				
                    copy.intellectualProperty = e.intellectualProperty;
                    copy.keywords = e.keywords;
                    copy.longDescription = e.longDescription;
                    copy.shortDescription = e.shortDescription;
                    copy.owner = e.owner;
                    copy.ownerEmail = e.ownerEmail;
                    copy.recordId = e.recordId;
                    copy.references = e.references;
                    copy.status = e.status;
                    
                    if(e.names != null)
                    {
                        copy.names = new Array();
                        for(var index:int = 0; index<e.names.length; index++)
                        {
                            var copyName:Name = new Name();
                            copyName.name = e.names[index].name;
                            copy.names[index] = copyName;
                        }
                    }
                }
				
				return copy;
				
			}
			
			/*public function copySequence(s:FeaturedDNASequence):FeaturedDNASequence
			{
                var copy:FeaturedDNASequence;
                
                if (s == null) {
                    copy = null;
                } else {
                    copy = new FeaturedDNASequence();
                    copy.accessionNumber = s.accessionNumber;
                    copy.sequence = s.sequence;
                    copy.identifier = s.identifier;
                }
                
				return copy;
			}*/


			//Web service based section
			//Function to login to the web service	
			public function login(userName:String, password:String):void
			{
				var registryApiService:RegistryAPIService = new RegistryAPIService();
				
	            var loginInfo:Login = new Login();
	            loginInfo.login = userName;
	            loginInfo.password = password;
	            
	            var asyncToken:AsyncToken = registryApiService.login(loginInfo);
				registryApiService.addloginEventListener(onLoginResult);
	            trace("Trying to login..."); 
	            Logger.getInstance().info("Trying to login...");               
			}
		
			private function onLoginResult(event:LoginResultEvent):void
			{
				trace("User successfully logged in: " + event.result._return as String);
				sendNotification(Notifications.LOGIN, event.result._return as String);
				Logger.getInstance().info("User successfully logged in: " + event.result._return as String); 
			}

			//Function to search
       		public function search(searchText:String):void {
	  			var registryApiService:RegistryAPIService = new RegistryAPIService();
	        	
	        	var searchInfo:Search = new Search();
	        	var sID:String = ApplicationFacade.getInstance().sessionId
	        	if(sID == null)
	        		Alert.show("Must log in successfully to search!", "Warning Message");
	        	else
	        	{
	        		searchInfo.sessionId = sID;
	        		searchInfo.query = searchText;
	        		registryApiService.search(searchInfo);
	        	
	        		registryApiService.addsearchEventListener(onSearchResult);
	        		trace("Searching...");
	        		Logger.getInstance().info("Searching...");    
	        	}               
        	}
                        
        	private function onSearchResult(event:SearchResultEvent):void 
        	{                       
                trace("found search");     
				var results:ArrayCollection = event.result as ArrayCollection;
				Logger.getInstance().info("Search done with " + results.length.toString() + " results");
				if(results.length > 0)
					sendNotification(Notifications.FIND_MATCH_FOUND, results);
				else
					sendNotification(Notifications.FIND_MATCH_NOT_FOUND);				                      
       		}
       		
       		
       		public function getSequence(entry:Entry):void
       		{
	       		var registryApiService:RegistryAPIService = new RegistryAPIService();
	       		var getSequence:GetSequence = new GetSequence();
	       		var sID:String = ApplicationFacade.getInstance().sessionId
	        	if(sID == null)
	        		Alert.show("Must log in successfully to get a sequence!", "Warning Message");
	       		else
	       		{
	       			getSequence.sessionId = sID;
	       			getSequence.entryId = entry.recordId;
	       			registryApiService.getSequence(getSequence);
	       			registryApiService.addgetSequenceEventListener(onSequenceResult);
	       			trace("Trying to get sequence...");
	       			Logger.getInstance().info("Trying to get sequence...");
	       		}
       	
       		}
       
       		private function onSequenceResult(event:GetSequenceResultEvent):void
       		{
	       		if(event.result._return == null) 
	       		{
	                 Alert.show("No sequence information for this entry!", "Warning Message");
	                 Logger.getInstance().warning("No sequence information for this entry!");
	                 sendNotification(Notifications.NO_SEQUENCE_FOUND);
	                 return;
	         	}
	
	         	trace("Found sequence");
	         	Logger.getInstance().info("Found sequence");
	         	sendNotification(Notifications.SEQUENCE_FETCHED, event.result._return as FeaturedDNASequence)
       		}

			public function getGenBankFile(entry:Entry):void
			{
				var registryApiService:RegistryAPIService = new RegistryAPIService();
				var getGenBank:GetGenBankSequence = new GetGenBankSequence();
				var sID:String = ApplicationFacade.getInstance().sessionId
	        	if(sID == null)
	        		Alert.show("Must log in successfully to get a GenBank File!", "Warning Message");
				else
	       		{
	       			getGenBank.sessionId = sID;
	       			getGenBank.entryId = entry.recordId;
	       			registryApiService.getGenBankSequence(getGenBank);
	       			registryApiService.addgetGenBankSequenceEventListener(onGenBankResult);
	       			trace("Trying to get GenBank file...");
	       			Logger.getInstance().info("Trying to get GenBank file...");
	       		}
			}
			
			private function onGenBankResult(event:GetGenBankSequenceResultEvent):void
       		{
	       		if(event.result._return == null) 
	       		{
	                 Alert.show("No GenBank file found for this entry!", "Warning Message");
	                 Logger.getInstance().warning("No GenBank file found for this entry!");
	                 //sendNotification(Notifications.NO_GENBANK_FOUND);
	                 return;
	         	}
	
	         	trace("Found sequence");
	         	Logger.getInstance().info("Found Genbank");
	         	sendNotification(Notifications.GENBANK_FETCHED, event.result._return as String)
       		}
			
			

        }
              
}