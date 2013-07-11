/**
 * BaseRegistryAPIServiceService.as
 * This file was auto-generated from WSDL by the Apache Axis2 generator modified by Adobe
 * Any change made to this file will be overwritten when the code is re-generated.
 */
package org.jbei.registry.api
{
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.utils.getDefinitionByName;
	import flash.utils.getQualifiedClassName;
	import mx.controls.treeClasses.DefaultDataDescriptor;
	import mx.utils.ObjectUtil;
	import mx.utils.ObjectProxy;
	import mx.messaging.events.MessageFaultEvent;
	import mx.messaging.MessageResponder;
	import mx.messaging.messages.SOAPMessage;
	import mx.messaging.messages.ErrorMessage;
   	import mx.messaging.ChannelSet;
	import mx.messaging.channels.DirectHTTPChannel;
	import mx.rpc.*;
	import mx.rpc.events.*;
	import mx.rpc.soap.*;
	import mx.rpc.wsdl.*;
	import mx.rpc.xml.*;
	import mx.rpc.soap.types.*;
	import mx.collections.ArrayCollection;
	
	/**
	 * Base service implementation, extends the AbstractWebService and adds specific functionality for the selected WSDL
	 * It defines the options and properties for each of the WSDL's operations
	 */ 
	public class BaseRegistryAPIService extends AbstractWebService
    {
		private var results:Object;
		private var schemaMgr:SchemaManager;
		private var BaseRegistryAPIServiceService:WSDLService;
		private var BaseRegistryAPIServicePortType:WSDLPortType;
		private var BaseRegistryAPIServiceBinding:WSDLBinding;
		private var BaseRegistryAPIServicePort:WSDLPort;
		private var currentOperation:WSDLOperation;
		private var internal_schema:BaseRegistryAPIServiceSchema;
	
		/**
		 * Constructor for the base service, initializes all of the WSDL's properties
		 * @param [Optional] The LCDS destination (if available) to use to contact the server
		 * @param [Optional] The URL to the WSDL end-point
		 */
		public function BaseRegistryAPIService(destination:String=null, rootURL:String=null)
		{
			super(destination, rootURL);
			if(destination == null)
			{
				//no destination available; must set it to go directly to the target
				this.useProxy = false;
			}
			else
			{
				//specific destination requested; must set proxying to true
				this.useProxy = true;
			}
			
			if(rootURL != null)
			{
				this.endpointURI = rootURL;
			} 
			else 
			{
				this.endpointURI = null;
			}
			internal_schema = new BaseRegistryAPIServiceSchema();
			schemaMgr = new SchemaManager();
			for(var i:int;i<internal_schema.schemas.length;i++)
			{
				internal_schema.schemas[i].targetNamespace=internal_schema.targetNamespaces[i];
				schemaMgr.addSchema(internal_schema.schemas[i]);
			}
BaseRegistryAPIServiceService = new WSDLService("BaseRegistryAPIServiceService");
			BaseRegistryAPIServicePort = new WSDLPort("BaseRegistryAPIServicePort",BaseRegistryAPIServiceService);
        	BaseRegistryAPIServiceBinding = new WSDLBinding("BaseRegistryAPIServiceBinding");
	        BaseRegistryAPIServicePortType = new WSDLPortType("BaseRegistryAPIServicePortType");
       		BaseRegistryAPIServiceBinding.portType = BaseRegistryAPIServicePortType;
       		BaseRegistryAPIServicePort.binding = BaseRegistryAPIServiceBinding;
       		BaseRegistryAPIServiceService.addPort(BaseRegistryAPIServicePort);
       		BaseRegistryAPIServicePort.endpointURI = "https://registry.jbei.org/api/RegistryAPI";
       		if(this.endpointURI == null)
       		{
       			this.endpointURI = BaseRegistryAPIServicePort.endpointURI; 
       		} 
       		
			var requestMessage:WSDLMessage;
			var responseMessage:WSDLMessage;
			//define the WSDLOperation: new WSDLOperation(methodName)
            var getGenBankSequence:WSDLOperation = new WSDLOperation("getGenBankSequence");
				//input message for the operation
    	        requestMessage = new WSDLMessage("getGenBankSequence");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","getGenBankSequence"),null,new QName("https://api.registry.jbei.org/","getGenBankSequence")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("getGenBankSequenceResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","getGenBankSequenceResponse"),null,new QName("https://api.registry.jbei.org/","getGenBankSequenceResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				getGenBankSequence.inputMessage = requestMessage;
	        getGenBankSequence.outputMessage = responseMessage;
            getGenBankSequence.schemaManager = this.schemaMgr;
            getGenBankSequence.soapAction = "\"\"";
            getGenBankSequence.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(getGenBankSequence);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var hasReadPermissions:WSDLOperation = new WSDLOperation("hasReadPermissions");
				//input message for the operation
    	        requestMessage = new WSDLMessage("hasReadPermissions");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","hasReadPermissions"),null,new QName("https://api.registry.jbei.org/","hasReadPermissions")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("hasReadPermissionsResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","hasReadPermissionsResponse"),null,new QName("https://api.registry.jbei.org/","hasReadPermissionsResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				hasReadPermissions.inputMessage = requestMessage;
	        hasReadPermissions.outputMessage = responseMessage;
            hasReadPermissions.schemaManager = this.schemaMgr;
            hasReadPermissions.soapAction = "\"\"";
            hasReadPermissions.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(hasReadPermissions);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var getOriginalGenBankSequence:WSDLOperation = new WSDLOperation("getOriginalGenBankSequence");
				//input message for the operation
    	        requestMessage = new WSDLMessage("getOriginalGenBankSequence");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","getOriginalGenBankSequence"),null,new QName("https://api.registry.jbei.org/","getOriginalGenBankSequence")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("getOriginalGenBankSequenceResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","getOriginalGenBankSequenceResponse"),null,new QName("https://api.registry.jbei.org/","getOriginalGenBankSequenceResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				getOriginalGenBankSequence.inputMessage = requestMessage;
	        getOriginalGenBankSequence.outputMessage = responseMessage;
            getOriginalGenBankSequence.schemaManager = this.schemaMgr;
            getOriginalGenBankSequence.soapAction = "\"\"";
            getOriginalGenBankSequence.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(getOriginalGenBankSequence);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var updatePlasmid:WSDLOperation = new WSDLOperation("updatePlasmid");
				//input message for the operation
    	        requestMessage = new WSDLMessage("updatePlasmid");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","updatePlasmid"),null,new QName("https://api.registry.jbei.org/","updatePlasmid")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("updatePlasmidResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","updatePlasmidResponse"),null,new QName("https://api.registry.jbei.org/","updatePlasmidResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				updatePlasmid.inputMessage = requestMessage;
	        updatePlasmid.outputMessage = responseMessage;
            updatePlasmid.schemaManager = this.schemaMgr;
            updatePlasmid.soapAction = "\"\"";
            updatePlasmid.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(updatePlasmid);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var uploadSequence:WSDLOperation = new WSDLOperation("uploadSequence");
				//input message for the operation
    	        requestMessage = new WSDLMessage("uploadSequence");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","uploadSequence"),null,new QName("https://api.registry.jbei.org/","uploadSequence")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("uploadSequenceResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","uploadSequenceResponse"),null,new QName("https://api.registry.jbei.org/","uploadSequenceResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				uploadSequence.inputMessage = requestMessage;
	        uploadSequence.outputMessage = responseMessage;
            uploadSequence.schemaManager = this.schemaMgr;
            uploadSequence.soapAction = "\"\"";
            uploadSequence.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(uploadSequence);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var getFastaSequence:WSDLOperation = new WSDLOperation("getFastaSequence");
				//input message for the operation
    	        requestMessage = new WSDLMessage("getFastaSequence");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","getFastaSequence"),null,new QName("https://api.registry.jbei.org/","getFastaSequence")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("getFastaSequenceResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","getFastaSequenceResponse"),null,new QName("https://api.registry.jbei.org/","getFastaSequenceResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				getFastaSequence.inputMessage = requestMessage;
	        getFastaSequence.outputMessage = responseMessage;
            getFastaSequence.schemaManager = this.schemaMgr;
            getFastaSequence.soapAction = "\"\"";
            getFastaSequence.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(getFastaSequence);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var hasWritePermissions:WSDLOperation = new WSDLOperation("hasWritePermissions");
				//input message for the operation
    	        requestMessage = new WSDLMessage("hasWritePermissions");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","hasWritePermissions"),null,new QName("https://api.registry.jbei.org/","hasWritePermissions")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("hasWritePermissionsResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","hasWritePermissionsResponse"),null,new QName("https://api.registry.jbei.org/","hasWritePermissionsResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				hasWritePermissions.inputMessage = requestMessage;
	        hasWritePermissions.outputMessage = responseMessage;
            hasWritePermissions.schemaManager = this.schemaMgr;
            hasWritePermissions.soapAction = "\"\"";
            hasWritePermissions.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(hasWritePermissions);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var createPlasmid:WSDLOperation = new WSDLOperation("createPlasmid");
				//input message for the operation
    	        requestMessage = new WSDLMessage("createPlasmid");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","createPlasmid"),null,new QName("https://api.registry.jbei.org/","createPlasmid")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("createPlasmidResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","createPlasmidResponse"),null,new QName("https://api.registry.jbei.org/","createPlasmidResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				createPlasmid.inputMessage = requestMessage;
	        createPlasmid.outputMessage = responseMessage;
            createPlasmid.schemaManager = this.schemaMgr;
            createPlasmid.soapAction = "\"\"";
            createPlasmid.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(createPlasmid);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var isAuthenticated:WSDLOperation = new WSDLOperation("isAuthenticated");
				//input message for the operation
    	        requestMessage = new WSDLMessage("isAuthenticated");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","isAuthenticated"),null,new QName("https://api.registry.jbei.org/","isAuthenticated")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("isAuthenticatedResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","isAuthenticatedResponse"),null,new QName("https://api.registry.jbei.org/","isAuthenticatedResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				isAuthenticated.inputMessage = requestMessage;
	        isAuthenticated.outputMessage = responseMessage;
            isAuthenticated.schemaManager = this.schemaMgr;
            isAuthenticated.soapAction = "\"\"";
            isAuthenticated.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(isAuthenticated);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var getSequence:WSDLOperation = new WSDLOperation("getSequence");
				//input message for the operation
    	        requestMessage = new WSDLMessage("getSequence");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","getSequence"),null,new QName("https://api.registry.jbei.org/","getSequence")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("getSequenceResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","getSequenceResponse"),null,new QName("https://api.registry.jbei.org/","getSequenceResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				getSequence.inputMessage = requestMessage;
	        getSequence.outputMessage = responseMessage;
            getSequence.schemaManager = this.schemaMgr;
            getSequence.soapAction = "\"\"";
            getSequence.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(getSequence);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var mylogout:WSDLOperation = new WSDLOperation("logout");
				//input message for the operation
    	        requestMessage = new WSDLMessage("logout");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","logout"),null,new QName("https://api.registry.jbei.org/","logout")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("logoutResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","logoutResponse"),null,new QName("https://api.registry.jbei.org/","logoutResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				mylogout.inputMessage = requestMessage;
	        mylogout.outputMessage = responseMessage;
            mylogout.schemaManager = this.schemaMgr;
            mylogout.soapAction = "\"\"";
            mylogout.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(mylogout);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var getNumberOfPublicEntries:WSDLOperation = new WSDLOperation("getNumberOfPublicEntries");
				//input message for the operation
    	        requestMessage = new WSDLMessage("getNumberOfPublicEntries");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","getNumberOfPublicEntries"),null,new QName("https://api.registry.jbei.org/","getNumberOfPublicEntries")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("getNumberOfPublicEntriesResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","getNumberOfPublicEntriesResponse"),null,new QName("https://api.registry.jbei.org/","getNumberOfPublicEntriesResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				getNumberOfPublicEntries.inputMessage = requestMessage;
	        getNumberOfPublicEntries.outputMessage = responseMessage;
            getNumberOfPublicEntries.schemaManager = this.schemaMgr;
            getNumberOfPublicEntries.soapAction = "\"\"";
            getNumberOfPublicEntries.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(getNumberOfPublicEntries);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var removeEntry:WSDLOperation = new WSDLOperation("removeEntry");
				//input message for the operation
    	        requestMessage = new WSDLMessage("removeEntry");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","removeEntry"),null,new QName("https://api.registry.jbei.org/","removeEntry")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("removeEntryResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","removeEntryResponse"),null,new QName("https://api.registry.jbei.org/","removeEntryResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				removeEntry.inputMessage = requestMessage;
	        removeEntry.outputMessage = responseMessage;
            removeEntry.schemaManager = this.schemaMgr;
            removeEntry.soapAction = "\"\"";
            removeEntry.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(removeEntry);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var updateStrain:WSDLOperation = new WSDLOperation("updateStrain");
				//input message for the operation
    	        requestMessage = new WSDLMessage("updateStrain");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","updateStrain"),null,new QName("https://api.registry.jbei.org/","updateStrain")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("updateStrainResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","updateStrainResponse"),null,new QName("https://api.registry.jbei.org/","updateStrainResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				updateStrain.inputMessage = requestMessage;
	        updateStrain.outputMessage = responseMessage;
            updateStrain.schemaManager = this.schemaMgr;
            updateStrain.soapAction = "\"\"";
            updateStrain.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(updateStrain);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var login:WSDLOperation = new WSDLOperation("login");
				//input message for the operation
    	        requestMessage = new WSDLMessage("login");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","login"),null,new QName("https://api.registry.jbei.org/","login")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("loginResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","loginResponse"),null,new QName("https://api.registry.jbei.org/","loginResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				login.inputMessage = requestMessage;
	        login.outputMessage = responseMessage;
            login.schemaManager = this.schemaMgr;
            login.soapAction = "\"\"";
            login.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(login);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var getByPartNumber:WSDLOperation = new WSDLOperation("getByPartNumber");
				//input message for the operation
    	        requestMessage = new WSDLMessage("getByPartNumber");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","getByPartNumber"),null,new QName("https://api.registry.jbei.org/","getByPartNumber")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("getByPartNumberResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","getByPartNumberResponse"),null,new QName("https://api.registry.jbei.org/","getByPartNumberResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				getByPartNumber.inputMessage = requestMessage;
	        getByPartNumber.outputMessage = responseMessage;
            getByPartNumber.schemaManager = this.schemaMgr;
            getByPartNumber.soapAction = "\"\"";
            getByPartNumber.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(getByPartNumber);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var createStrain:WSDLOperation = new WSDLOperation("createStrain");
				//input message for the operation
    	        requestMessage = new WSDLMessage("createStrain");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","createStrain"),null,new QName("https://api.registry.jbei.org/","createStrain")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("createStrainResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","createStrainResponse"),null,new QName("https://api.registry.jbei.org/","createStrainResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				createStrain.inputMessage = requestMessage;
	        createStrain.outputMessage = responseMessage;
            createStrain.schemaManager = this.schemaMgr;
            createStrain.soapAction = "\"\"";
            createStrain.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(createStrain);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var search:WSDLOperation = new WSDLOperation("search");
				//input message for the operation
    	        requestMessage = new WSDLMessage("search");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","search"),null,new QName("https://api.registry.jbei.org/","search")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("searchResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","searchResponse"),null,new QName("https://api.registry.jbei.org/","searchResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				search.inputMessage = requestMessage;
	        search.outputMessage = responseMessage;
            search.schemaManager = this.schemaMgr;
            search.soapAction = "\"\"";
            search.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(search);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var createPart:WSDLOperation = new WSDLOperation("createPart");
				//input message for the operation
    	        requestMessage = new WSDLMessage("createPart");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","createPart"),null,new QName("https://api.registry.jbei.org/","createPart")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("createPartResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","createPartResponse"),null,new QName("https://api.registry.jbei.org/","createPartResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				createPart.inputMessage = requestMessage;
	        createPart.outputMessage = responseMessage;
            createPart.schemaManager = this.schemaMgr;
            createPart.soapAction = "\"\"";
            createPart.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(createPart);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var createSequence:WSDLOperation = new WSDLOperation("createSequence");
				//input message for the operation
    	        requestMessage = new WSDLMessage("createSequence");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","createSequence"),null,new QName("https://api.registry.jbei.org/","createSequence")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("createSequenceResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","createSequenceResponse"),null,new QName("https://api.registry.jbei.org/","createSequenceResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				createSequence.inputMessage = requestMessage;
	        createSequence.outputMessage = responseMessage;
            createSequence.schemaManager = this.schemaMgr;
            createSequence.soapAction = "\"\"";
            createSequence.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(createSequence);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var tblastx:WSDLOperation = new WSDLOperation("tblastx");
				//input message for the operation
    	        requestMessage = new WSDLMessage("tblastx");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","tblastx"),null,new QName("https://api.registry.jbei.org/","tblastx")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("tblastxResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","tblastxResponse"),null,new QName("https://api.registry.jbei.org/","tblastxResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				tblastx.inputMessage = requestMessage;
	        tblastx.outputMessage = responseMessage;
            tblastx.schemaManager = this.schemaMgr;
            tblastx.soapAction = "\"\"";
            tblastx.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(tblastx);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var removeSequence:WSDLOperation = new WSDLOperation("removeSequence");
				//input message for the operation
    	        requestMessage = new WSDLMessage("removeSequence");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","removeSequence"),null,new QName("https://api.registry.jbei.org/","removeSequence")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("removeSequenceResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","removeSequenceResponse"),null,new QName("https://api.registry.jbei.org/","removeSequenceResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				removeSequence.inputMessage = requestMessage;
	        removeSequence.outputMessage = responseMessage;
            removeSequence.schemaManager = this.schemaMgr;
            removeSequence.soapAction = "\"\"";
            removeSequence.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(removeSequence);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var blastn:WSDLOperation = new WSDLOperation("blastn");
				//input message for the operation
    	        requestMessage = new WSDLMessage("blastn");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","blastn"),null,new QName("https://api.registry.jbei.org/","blastn")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("blastnResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","blastnResponse"),null,new QName("https://api.registry.jbei.org/","blastnResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				blastn.inputMessage = requestMessage;
	        blastn.outputMessage = responseMessage;
            blastn.schemaManager = this.schemaMgr;
            blastn.soapAction = "\"\"";
            blastn.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(blastn);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var updatePart:WSDLOperation = new WSDLOperation("updatePart");
				//input message for the operation
    	        requestMessage = new WSDLMessage("updatePart");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","updatePart"),null,new QName("https://api.registry.jbei.org/","updatePart")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("updatePartResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","updatePartResponse"),null,new QName("https://api.registry.jbei.org/","updatePartResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				updatePart.inputMessage = requestMessage;
	        updatePart.outputMessage = responseMessage;
            updatePart.schemaManager = this.schemaMgr;
            updatePart.soapAction = "\"\"";
            updatePart.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(updatePart);
			//define the WSDLOperation: new WSDLOperation(methodName)
            var getByRecordId:WSDLOperation = new WSDLOperation("getByRecordId");
				//input message for the operation
    	        requestMessage = new WSDLMessage("getByRecordId");
            				requestMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","getByRecordId"),null,new QName("https://api.registry.jbei.org/","getByRecordId")));
                requestMessage.encoding = new WSDLEncoding();
                requestMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
			requestMessage.encoding.useStyle="literal";
                
                responseMessage = new WSDLMessage("getByRecordIdResponse");
            				responseMessage.addPart(new WSDLMessagePart(new QName("https://api.registry.jbei.org/","getByRecordIdResponse"),null,new QName("https://api.registry.jbei.org/","getByRecordIdResponse")));
                responseMessage.encoding = new WSDLEncoding();
                responseMessage.encoding.namespaceURI="https://api.registry.jbei.org/";
                responseMessage.encoding.useStyle="literal";				
				getByRecordId.inputMessage = requestMessage;
	        getByRecordId.outputMessage = responseMessage;
            getByRecordId.schemaManager = this.schemaMgr;
            getByRecordId.soapAction = "\"\"";
            getByRecordId.style = "document";
            BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.addOperation(getByRecordId);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","arrayList"),org.jbei.registry.api.ArrayList);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","hasWritePermissions"),org.jbei.registry.api.HasWritePermissions);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","abstractList"),org.jbei.registry.api.AbstractList);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","name"),org.jbei.registry.api.Name);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","search"),org.jbei.registry.api.Search);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","getOriginalGenBankSequenceResponse"),org.jbei.registry.api.GetOriginalGenBankSequenceResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","abstractCollection"),org.jbei.registry.api.AbstractCollection);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","removeSequenceResponse"),org.jbei.registry.api.RemoveSequenceResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","isAuthenticatedResponse"),org.jbei.registry.api.IsAuthenticatedResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","getByPartNumberResponse"),org.jbei.registry.api.GetByPartNumberResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","ServiceException"),org.jbei.registry.api.ServiceException);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","updateStrainResponse"),org.jbei.registry.api.UpdateStrainResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","fundingSource"),org.jbei.registry.api.FundingSource);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","login"),org.jbei.registry.api.Login);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","updateStrain"),org.jbei.registry.api.UpdateStrain);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","createSequence"),org.jbei.registry.api.CreateSequence);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","isAuthenticated"),org.jbei.registry.api.IsAuthenticated);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","entry"),org.jbei.registry.api.Entry);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","createPlasmidResponse"),org.jbei.registry.api.CreatePlasmidResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","getSequenceResponse"),org.jbei.registry.api.GetSequenceResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","createPartResponse"),org.jbei.registry.api.CreatePartResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","featuredDNASequence"),org.jbei.registry.api.FeaturedDNASequence);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","createSequenceResponse"),org.jbei.registry.api.CreateSequenceResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","tblastx"),org.jbei.registry.api.Tblastx);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","searchResult"),org.jbei.registry.api.SearchResult);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","uploadSequence"),org.jbei.registry.api.UploadSequence);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","loginResponse"),org.jbei.registry.api.LoginResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","createPart"),org.jbei.registry.api.CreatePart);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","ServicePermissionException"),org.jbei.registry.api.ServicePermissionException);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","part"),org.jbei.registry.api.Part);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","getByPartNumber"),org.jbei.registry.api.GetByPartNumber);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","getNumberOfPublicEntriesResponse"),org.jbei.registry.api.GetNumberOfPublicEntriesResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","SessionException"),org.jbei.registry.api.SessionException);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","plasmid"),org.jbei.registry.api.Plasmid);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","createStrainResponse"),org.jbei.registry.api.CreateStrainResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","removeSequence"),org.jbei.registry.api.RemoveSequence);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","getByRecordIdResponse"),org.jbei.registry.api.GetByRecordIdResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","strain"),org.jbei.registry.api.Strain);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","partNumber"),org.jbei.registry.api.PartNumber);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","updatePartResponse"),org.jbei.registry.api.UpdatePartResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","simpleDNASequence"),org.jbei.registry.api.SimpleDNASequence);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","getByRecordId"),org.jbei.registry.api.GetByRecordId);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","blastResult"),org.jbei.registry.api.BlastResult);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","link"),org.jbei.registry.api.Link);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","uploadSequenceResponse"),org.jbei.registry.api.UploadSequenceResponse);
							SchemaTypeRegistry.getInstance().registerCollectionClass(new QName("https://api.registry.jbei.org/","blastnResponse"),org.jbei.registry.api.BlastnResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","updatePart"),org.jbei.registry.api.UpdatePart);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","dnaFeatureNote"),org.jbei.registry.api.DnaFeatureNote);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","getGenBankSequenceResponse"),org.jbei.registry.api.GetGenBankSequenceResponse);
							SchemaTypeRegistry.getInstance().registerCollectionClass(new QName("https://api.registry.jbei.org/","searchResponse"),org.jbei.registry.api.SearchResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","updatePlasmid"),org.jbei.registry.api.UpdatePlasmid);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","logout"),org.jbei.registry.api.Logout);
							SchemaTypeRegistry.getInstance().registerCollectionClass(new QName("https://api.registry.jbei.org/","tblastxResponse"),org.jbei.registry.api.TblastxResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","createStrain"),org.jbei.registry.api.CreateStrain);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","updatePlasmidResponse"),org.jbei.registry.api.UpdatePlasmidResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","getGenBankSequence"),org.jbei.registry.api.GetGenBankSequence);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","hasWritePermissionsResponse"),org.jbei.registry.api.HasWritePermissionsResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","hasReadPermissions"),org.jbei.registry.api.HasReadPermissions);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","getOriginalGenBankSequence"),org.jbei.registry.api.GetOriginalGenBankSequence);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","hasReadPermissionsResponse"),org.jbei.registry.api.HasReadPermissionsResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","blastn"),org.jbei.registry.api.Blastn);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","getNumberOfPublicEntries"),org.jbei.registry.api.GetNumberOfPublicEntries);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","dnaFeature"),org.jbei.registry.api.DnaFeature);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","selectionMarker"),org.jbei.registry.api.SelectionMarker);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","getFastaSequence"),org.jbei.registry.api.GetFastaSequence);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","entryFundingSource"),org.jbei.registry.api.EntryFundingSource);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","logoutResponse"),org.jbei.registry.api.LogoutResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","createPlasmid"),org.jbei.registry.api.CreatePlasmid);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","getFastaSequenceResponse"),org.jbei.registry.api.GetFastaSequenceResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","removeEntryResponse"),org.jbei.registry.api.RemoveEntryResponse);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","getSequence"),org.jbei.registry.api.GetSequence);
							SchemaTypeRegistry.getInstance().registerClass(new QName("https://api.registry.jbei.org/","removeEntry"),org.jbei.registry.api.RemoveEntry);
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param getGenBankSequence
		 * @return Asynchronous token
		 */
		public function getGenBankSequence(getGenBankSequence:GetGenBankSequence):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["getGenBankSequence"] = getGenBankSequence;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("getGenBankSequence");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param hasReadPermissions
		 * @return Asynchronous token
		 */
		public function hasReadPermissions(hasReadPermissions:HasReadPermissions):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["hasReadPermissions"] = hasReadPermissions;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("hasReadPermissions");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param getOriginalGenBankSequence
		 * @return Asynchronous token
		 */
		public function getOriginalGenBankSequence(getOriginalGenBankSequence:GetOriginalGenBankSequence):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["getOriginalGenBankSequence"] = getOriginalGenBankSequence;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("getOriginalGenBankSequence");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param updatePlasmid
		 * @return Asynchronous token
		 */
		public function updatePlasmid(updatePlasmid:UpdatePlasmid):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["updatePlasmid"] = updatePlasmid;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("updatePlasmid");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param uploadSequence
		 * @return Asynchronous token
		 */
		public function uploadSequence(uploadSequence:UploadSequence):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["uploadSequence"] = uploadSequence;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("uploadSequence");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param getFastaSequence
		 * @return Asynchronous token
		 */
		public function getFastaSequence(getFastaSequence:GetFastaSequence):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["getFastaSequence"] = getFastaSequence;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("getFastaSequence");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param hasWritePermissions
		 * @return Asynchronous token
		 */
		public function hasWritePermissions(hasWritePermissions:HasWritePermissions):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["hasWritePermissions"] = hasWritePermissions;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("hasWritePermissions");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param createPlasmid
		 * @return Asynchronous token
		 */
		public function createPlasmid(createPlasmid:CreatePlasmid):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["createPlasmid"] = createPlasmid;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("createPlasmid");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param isAuthenticated
		 * @return Asynchronous token
		 */
		public function isAuthenticated(isAuthenticated:IsAuthenticated):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["isAuthenticated"] = isAuthenticated;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("isAuthenticated");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param getSequence
		 * @return Asynchronous token
		 */
		public function getSequence(getSequence:GetSequence):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["getSequence"] = getSequence;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("getSequence");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param logout
		 * @return Asynchronous token
		 */
		public function mylogout(logout:Logout):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["logout"] = logout;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("logout");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param getNumberOfPublicEntries
		 * @return Asynchronous token
		 */
		public function getNumberOfPublicEntries(getNumberOfPublicEntries:GetNumberOfPublicEntries):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["getNumberOfPublicEntries"] = getNumberOfPublicEntries;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("getNumberOfPublicEntries");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param removeEntry
		 * @return Asynchronous token
		 */
		public function removeEntry(removeEntry:RemoveEntry):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["removeEntry"] = removeEntry;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("removeEntry");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param updateStrain
		 * @return Asynchronous token
		 */
		public function updateStrain(updateStrain:UpdateStrain):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["updateStrain"] = updateStrain;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("updateStrain");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param login
		 * @return Asynchronous token
		 */
		public function login(login:Login):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["login"] = login;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("login");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param getByPartNumber
		 * @return Asynchronous token
		 */
		public function getByPartNumber(getByPartNumber:GetByPartNumber):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["getByPartNumber"] = getByPartNumber;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("getByPartNumber");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param createStrain
		 * @return Asynchronous token
		 */
		public function createStrain(createStrain:CreateStrain):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["createStrain"] = createStrain;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("createStrain");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param search
		 * @return Asynchronous token
		 */
		public function search(search:Search):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["search"] = search;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("search");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param createPart
		 * @return Asynchronous token
		 */
		public function createPart(createPart:CreatePart):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["createPart"] = createPart;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("createPart");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param createSequence
		 * @return Asynchronous token
		 */
		public function createSequence(createSequence:CreateSequence):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["createSequence"] = createSequence;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("createSequence");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param tblastx
		 * @return Asynchronous token
		 */
		public function tblastx(tblastx:Tblastx):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["tblastx"] = tblastx;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("tblastx");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param removeSequence
		 * @return Asynchronous token
		 */
		public function removeSequence(removeSequence:RemoveSequence):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["removeSequence"] = removeSequence;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("removeSequence");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param blastn
		 * @return Asynchronous token
		 */
		public function blastn(blastn:Blastn):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["blastn"] = blastn;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("blastn");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param updatePart
		 * @return Asynchronous token
		 */
		public function updatePart(updatePart:UpdatePart):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["updatePart"] = updatePart;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("updatePart");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
		/**
		 * Performs the low level call to the server for the operation
		 * It passes along the headers and the operation arguments
		 * @param getByRecordId
		 * @return Asynchronous token
		 */
		public function getByRecordId(getByRecordId:GetByRecordId):AsyncToken
		{
			var headerArray:Array = new Array();
            var out:Object = new Object();
            out["getByRecordId"] = getByRecordId;
	            currentOperation = BaseRegistryAPIServiceService.getPort("BaseRegistryAPIServicePort").binding.portType.getOperation("getByRecordId");
            var pc:PendingCall = new PendingCall(out,headerArray);
            call(currentOperation,out,pc.token,pc.headers);
            return pc.token;
		}
        /**
         * Performs the actual call to the remove server
         * It SOAP-encodes the message using the schema and WSDL operation options set above and then calls the server using 
         * an async invoker
         * It also registers internal event handlers for the result / fault cases
         * @private
         */
        private function call(operation:WSDLOperation,args:Object,token:AsyncToken,headers:Array=null):void
        {
	    	var enc:SOAPEncoder = new SOAPEncoder();
	        var soap:Object = new Object;
	        var message:SOAPMessage = new SOAPMessage();
	        enc.wsdlOperation = operation;
	        soap = enc.encodeRequest(args,headers);
	        message.setSOAPAction(operation.soapAction);
	        message.body = soap.toString();
	        message.url=endpointURI;
            var inv:AsyncRequest = new AsyncRequest();
            inv.destination = super.destination;
            //we need this to handle multiple asynchronous calls 
            var wrappedData:Object = new Object();
            wrappedData.operation = currentOperation;
            wrappedData.returnToken = token;
            if(!this.useProxy)
            {
            	var dcs:ChannelSet = new ChannelSet();	
	        	dcs.addChannel(new DirectHTTPChannel("direct_http_channel"));
            	inv.channelSet = dcs;
            }                
            var processRes:AsyncResponder = new AsyncResponder(processResult,faultResult,wrappedData);
            inv.invoke(message,processRes);
		}
        
        /**
         * Internal event handler to process a successful operation call from the server
         * The result is decoded using the schema and operation settings and then the events get passed on to the actual facade that the user employs in the application 
         * @private
         */
		private function processResult(result:Object,wrappedData:Object):void
           {
           		var headers:Object;
           		var token:AsyncToken = wrappedData.returnToken;
                var currentOperation:WSDLOperation = wrappedData.operation;
                var decoder:SOAPDecoder = new SOAPDecoder();
                decoder.resultFormat = "object";
                decoder.headerFormat = "object";
                decoder.multiplePartsFormat = "object";
                decoder.ignoreWhitespace = true;
                decoder.makeObjectsBindable=false;
                decoder.wsdlOperation = currentOperation;
                decoder.schemaManager = currentOperation.schemaManager;
                var body:Object = result.message.body;
                var stringResult:String = String(body);
                if(stringResult == null  || stringResult == "")
                	return;
                var soapResult:SOAPResult = decoder.decodeResponse(result.message.body);
                if(soapResult.isFault)
                {
	                var faults:Array = soapResult.result as Array;
	                for each (var soapFault:Fault in faults)
	                {
		                var soapFaultEvent:FaultEvent = FaultEvent.createEvent(soapFault,token,null);
		                token.dispatchEvent(soapFaultEvent);
	                }
                } else {
	                result = soapResult.result;
	                headers = soapResult.headers;
	                var event:ResultEvent = ResultEvent.createEvent(result,token,null);
	                event.headers = headers;
	                token.dispatchEvent(event);
                }
           }
           	/**
           	 * Handles the cases when there are errors calling the operation on the server
           	 * This is not the case for SOAP faults, which is handled by the SOAP decoder in the result handler
           	 * but more critical errors, like network outage or the impossibility to connect to the server
           	 * The fault is dispatched upwards to the facade so that the user can do something meaningful 
           	 * @private
           	 */
			private function faultResult(error:MessageFaultEvent,token:Object):void
			{
				//when there is a network error the token is actually the wrappedData object from above	
				if(!(token is AsyncToken))
					token = token.returnToken;
				token.dispatchEvent(new FaultEvent(FaultEvent.FAULT,true,true,new Fault(error.faultCode,error.faultString,error.faultDetail)));
			}
		}
	}

	import mx.rpc.AsyncToken;
	import mx.rpc.AsyncResponder;
	import mx.rpc.wsdl.WSDLBinding;
                
    /**
     * Internal class to handle multiple operation call scheduling
     * It allows us to pass data about the operation being encoded / decoded to and from the SOAP encoder / decoder units. 
     * @private
     */
    class PendingCall
    {
		public var args:*;
		public var headers:Array;
		public var token:AsyncToken;
		
		public function PendingCall(args:Object, headers:Array=null)
		{
			this.args = args;
			this.headers = headers;
			this.token = new AsyncToken(null);
		}
	}