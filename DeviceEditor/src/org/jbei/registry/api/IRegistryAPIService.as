
/**
 * Service.as
 * This file was auto-generated from WSDL by the Apache Axis2 generator modified by Adobe
 * Any change made to this file will be overwritten when the code is re-generated.
 */
package org.jbei.registry.api{
	import mx.rpc.AsyncToken;
	import flash.utils.ByteArray;
	import mx.rpc.soap.types.*;
               
    public interface IRegistryAPIService
    {
    	//Stub functions for the getGenBankSequence operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param getGenBankSequence
    	 * @param sessionId
    	 * @param entryId
    	 * @return An AsyncToken
    	 */
    	function getGenBankSequence(getGenBankSequence:GetGenBankSequence):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function getGenBankSequence_send():AsyncToken;
        
        /**
         * The getGenBankSequence operation lastResult property
         */
        function get getGenBankSequence_lastResult():GetGenBankSequenceResponse;
		/**
		 * @private
		 */
        function set getGenBankSequence_lastResult(lastResult:GetGenBankSequenceResponse):void;
       /**
        * Add a listener for the getGenBankSequence operation successful result event
        * @param The listener function
        */
       function addgetGenBankSequenceEventListener(listener:Function):void;
       
       
        /**
         * The getGenBankSequence operation request wrapper
         */
        function get getGenBankSequence_request_var():GetGenBankSequence_request;
        
        /**
         * @private
         */
        function set getGenBankSequence_request_var(request:GetGenBankSequence_request):void;
                   
    	//Stub functions for the hasReadPermissions operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param hasReadPermissions
    	 * @param sessionId
    	 * @param entryId
    	 * @return An AsyncToken
    	 */
    	function hasReadPermissions(hasReadPermissions:HasReadPermissions):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function hasReadPermissions_send():AsyncToken;
        
        /**
         * The hasReadPermissions operation lastResult property
         */
        function get hasReadPermissions_lastResult():HasReadPermissionsResponse;
		/**
		 * @private
		 */
        function set hasReadPermissions_lastResult(lastResult:HasReadPermissionsResponse):void;
       /**
        * Add a listener for the hasReadPermissions operation successful result event
        * @param The listener function
        */
       function addhasReadPermissionsEventListener(listener:Function):void;
       
       
        /**
         * The hasReadPermissions operation request wrapper
         */
        function get hasReadPermissions_request_var():HasReadPermissions_request;
        
        /**
         * @private
         */
        function set hasReadPermissions_request_var(request:HasReadPermissions_request):void;
                   
    	//Stub functions for the getOriginalGenBankSequence operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param getOriginalGenBankSequence
    	 * @param sessionId
    	 * @param entryId
    	 * @return An AsyncToken
    	 */
    	function getOriginalGenBankSequence(getOriginalGenBankSequence:GetOriginalGenBankSequence):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function getOriginalGenBankSequence_send():AsyncToken;
        
        /**
         * The getOriginalGenBankSequence operation lastResult property
         */
        function get getOriginalGenBankSequence_lastResult():GetOriginalGenBankSequenceResponse;
		/**
		 * @private
		 */
        function set getOriginalGenBankSequence_lastResult(lastResult:GetOriginalGenBankSequenceResponse):void;
       /**
        * Add a listener for the getOriginalGenBankSequence operation successful result event
        * @param The listener function
        */
       function addgetOriginalGenBankSequenceEventListener(listener:Function):void;
       
       
        /**
         * The getOriginalGenBankSequence operation request wrapper
         */
        function get getOriginalGenBankSequence_request_var():GetOriginalGenBankSequence_request;
        
        /**
         * @private
         */
        function set getOriginalGenBankSequence_request_var(request:GetOriginalGenBankSequence_request):void;
                   
    	//Stub functions for the updatePlasmid operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param updatePlasmid
    	 * @param sessionId
    	 * @param plasmid
    	 * @return An AsyncToken
    	 */
    	function updatePlasmid(updatePlasmid:UpdatePlasmid):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function updatePlasmid_send():AsyncToken;
        
        /**
         * The updatePlasmid operation lastResult property
         */
        function get updatePlasmid_lastResult():UpdatePlasmidResponse;
		/**
		 * @private
		 */
        function set updatePlasmid_lastResult(lastResult:UpdatePlasmidResponse):void;
       /**
        * Add a listener for the updatePlasmid operation successful result event
        * @param The listener function
        */
       function addupdatePlasmidEventListener(listener:Function):void;
       
       
        /**
         * The updatePlasmid operation request wrapper
         */
        function get updatePlasmid_request_var():UpdatePlasmid_request;
        
        /**
         * @private
         */
        function set updatePlasmid_request_var(request:UpdatePlasmid_request):void;
                   
    	//Stub functions for the uploadSequence operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param sessionId
    	 * @param entryId
    	 * @param sequence
    	 * @param uploadSequence
    	 * @return An AsyncToken
    	 */
    	function uploadSequence(uploadSequence:UploadSequence):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function uploadSequence_send():AsyncToken;
        
        /**
         * The uploadSequence operation lastResult property
         */
        function get uploadSequence_lastResult():UploadSequenceResponse;
		/**
		 * @private
		 */
        function set uploadSequence_lastResult(lastResult:UploadSequenceResponse):void;
       /**
        * Add a listener for the uploadSequence operation successful result event
        * @param The listener function
        */
       function adduploadSequenceEventListener(listener:Function):void;
       
       
        /**
         * The uploadSequence operation request wrapper
         */
        function get uploadSequence_request_var():UploadSequence_request;
        
        /**
         * @private
         */
        function set uploadSequence_request_var(request:UploadSequence_request):void;
                   
    	//Stub functions for the getFastaSequence operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param getFastaSequence
    	 * @param sessionId
    	 * @param entryId
    	 * @return An AsyncToken
    	 */
    	function getFastaSequence(getFastaSequence:GetFastaSequence):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function getFastaSequence_send():AsyncToken;
        
        /**
         * The getFastaSequence operation lastResult property
         */
        function get getFastaSequence_lastResult():GetFastaSequenceResponse;
		/**
		 * @private
		 */
        function set getFastaSequence_lastResult(lastResult:GetFastaSequenceResponse):void;
       /**
        * Add a listener for the getFastaSequence operation successful result event
        * @param The listener function
        */
       function addgetFastaSequenceEventListener(listener:Function):void;
       
       
        /**
         * The getFastaSequence operation request wrapper
         */
        function get getFastaSequence_request_var():GetFastaSequence_request;
        
        /**
         * @private
         */
        function set getFastaSequence_request_var(request:GetFastaSequence_request):void;
                   
    	//Stub functions for the hasWritePermissions operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param sessionId
    	 * @param entryId
    	 * @param hasWritePermissions
    	 * @return An AsyncToken
    	 */
    	function hasWritePermissions(hasWritePermissions:HasWritePermissions):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function hasWritePermissions_send():AsyncToken;
        
        /**
         * The hasWritePermissions operation lastResult property
         */
        function get hasWritePermissions_lastResult():HasWritePermissionsResponse;
		/**
		 * @private
		 */
        function set hasWritePermissions_lastResult(lastResult:HasWritePermissionsResponse):void;
       /**
        * Add a listener for the hasWritePermissions operation successful result event
        * @param The listener function
        */
       function addhasWritePermissionsEventListener(listener:Function):void;
       
       
        /**
         * The hasWritePermissions operation request wrapper
         */
        function get hasWritePermissions_request_var():HasWritePermissions_request;
        
        /**
         * @private
         */
        function set hasWritePermissions_request_var(request:HasWritePermissions_request):void;
                   
    	//Stub functions for the createPlasmid operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param createPlasmid
    	 * @param sessionId
    	 * @param plasmid
    	 * @return An AsyncToken
    	 */
    	function createPlasmid(createPlasmid:CreatePlasmid):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function createPlasmid_send():AsyncToken;
        
        /**
         * The createPlasmid operation lastResult property
         */
        function get createPlasmid_lastResult():CreatePlasmidResponse;
		/**
		 * @private
		 */
        function set createPlasmid_lastResult(lastResult:CreatePlasmidResponse):void;
       /**
        * Add a listener for the createPlasmid operation successful result event
        * @param The listener function
        */
       function addcreatePlasmidEventListener(listener:Function):void;
       
       
        /**
         * The createPlasmid operation request wrapper
         */
        function get createPlasmid_request_var():CreatePlasmid_request;
        
        /**
         * @private
         */
        function set createPlasmid_request_var(request:CreatePlasmid_request):void;
                   
    	//Stub functions for the isAuthenticated operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param sessionId
    	 * @param isAuthenticated
    	 * @return An AsyncToken
    	 */
    	function isAuthenticated(isAuthenticated:IsAuthenticated):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function isAuthenticated_send():AsyncToken;
        
        /**
         * The isAuthenticated operation lastResult property
         */
        function get isAuthenticated_lastResult():IsAuthenticatedResponse;
		/**
		 * @private
		 */
        function set isAuthenticated_lastResult(lastResult:IsAuthenticatedResponse):void;
       /**
        * Add a listener for the isAuthenticated operation successful result event
        * @param The listener function
        */
       function addisAuthenticatedEventListener(listener:Function):void;
       
       
        /**
         * The isAuthenticated operation request wrapper
         */
        function get isAuthenticated_request_var():IsAuthenticated_request;
        
        /**
         * @private
         */
        function set isAuthenticated_request_var(request:IsAuthenticated_request):void;
                   
    	//Stub functions for the getSequence operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param getSequence
    	 * @param sessionId
    	 * @param entryId
    	 * @return An AsyncToken
    	 */
    	function getSequence(getSequence:GetSequence):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function getSequence_send():AsyncToken;
        
        /**
         * The getSequence operation lastResult property
         */
        function get getSequence_lastResult():GetSequenceResponse;
		/**
		 * @private
		 */
        function set getSequence_lastResult(lastResult:GetSequenceResponse):void;
       /**
        * Add a listener for the getSequence operation successful result event
        * @param The listener function
        */
       function addgetSequenceEventListener(listener:Function):void;
       
       
        /**
         * The getSequence operation request wrapper
         */
        function get getSequence_request_var():GetSequence_request;
        
        /**
         * @private
         */
        function set getSequence_request_var(request:GetSequence_request):void;
                   
    	//Stub functions for the logout operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param sessionId
    	 * @param logout
    	 * @return An AsyncToken
    	 */
    	function mylogout(logout:Logout):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function mylogout_send():AsyncToken;
        
        /**
         * The mylogout operation lastResult property
         */
        function get mylogout_lastResult():LogoutResponse;
		/**
		 * @private
		 */
        function set mylogout_lastResult(lastResult:LogoutResponse):void;
       /**
        * Add a listener for the mylogout operation successful result event
        * @param The listener function
        */
       function addmylogoutEventListener(listener:Function):void;
       
       
        /**
         * The mylogout operation request wrapper
         */
        function get mylogout_request_var():Logout_request;
        
        /**
         * @private
         */
        function set mylogout_request_var(request:Logout_request):void;
                   
    	//Stub functions for the getNumberOfPublicEntries operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param getNumberOfPublicEntries
    	 * @return An AsyncToken
    	 */
    	function getNumberOfPublicEntries(getNumberOfPublicEntries:GetNumberOfPublicEntries):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function getNumberOfPublicEntries_send():AsyncToken;
        
        /**
         * The getNumberOfPublicEntries operation lastResult property
         */
        function get getNumberOfPublicEntries_lastResult():GetNumberOfPublicEntriesResponse;
		/**
		 * @private
		 */
        function set getNumberOfPublicEntries_lastResult(lastResult:GetNumberOfPublicEntriesResponse):void;
       /**
        * Add a listener for the getNumberOfPublicEntries operation successful result event
        * @param The listener function
        */
       function addgetNumberOfPublicEntriesEventListener(listener:Function):void;
       
       
        /**
         * The getNumberOfPublicEntries operation request wrapper
         */
        function get getNumberOfPublicEntries_request_var():GetNumberOfPublicEntries_request;
        
        /**
         * @private
         */
        function set getNumberOfPublicEntries_request_var(request:GetNumberOfPublicEntries_request):void;
                   
    	//Stub functions for the removeEntry operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param removeEntry
    	 * @param sessionId
    	 * @param entryId
    	 * @return An AsyncToken
    	 */
    	function removeEntry(removeEntry:RemoveEntry):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function removeEntry_send():AsyncToken;
        
        /**
         * The removeEntry operation lastResult property
         */
        function get removeEntry_lastResult():RemoveEntryResponse;
		/**
		 * @private
		 */
        function set removeEntry_lastResult(lastResult:RemoveEntryResponse):void;
       /**
        * Add a listener for the removeEntry operation successful result event
        * @param The listener function
        */
       function addremoveEntryEventListener(listener:Function):void;
       
       
        /**
         * The removeEntry operation request wrapper
         */
        function get removeEntry_request_var():RemoveEntry_request;
        
        /**
         * @private
         */
        function set removeEntry_request_var(request:RemoveEntry_request):void;
                   
    	//Stub functions for the updateStrain operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param updateStrain
    	 * @param sessionId
    	 * @param strain
    	 * @return An AsyncToken
    	 */
    	function updateStrain(updateStrain:UpdateStrain):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function updateStrain_send():AsyncToken;
        
        /**
         * The updateStrain operation lastResult property
         */
        function get updateStrain_lastResult():UpdateStrainResponse;
		/**
		 * @private
		 */
        function set updateStrain_lastResult(lastResult:UpdateStrainResponse):void;
       /**
        * Add a listener for the updateStrain operation successful result event
        * @param The listener function
        */
       function addupdateStrainEventListener(listener:Function):void;
       
       
        /**
         * The updateStrain operation request wrapper
         */
        function get updateStrain_request_var():UpdateStrain_request;
        
        /**
         * @private
         */
        function set updateStrain_request_var(request:UpdateStrain_request):void;
                   
    	//Stub functions for the login operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param login
    	 * @param login
    	 * @param password
    	 * @return An AsyncToken
    	 */
    	function login(login:Login):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function login_send():AsyncToken;
        
        /**
         * The login operation lastResult property
         */
        function get login_lastResult():LoginResponse;
		/**
		 * @private
		 */
        function set login_lastResult(lastResult:LoginResponse):void;
       /**
        * Add a listener for the login operation successful result event
        * @param The listener function
        */
       function addloginEventListener(listener:Function):void;
       
       
        /**
         * The login operation request wrapper
         */
        function get login_request_var():Login_request;
        
        /**
         * @private
         */
        function set login_request_var(request:Login_request):void;
                   
    	//Stub functions for the getByPartNumber operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param sessionId
    	 * @param partNumber
    	 * @param getByPartNumber
    	 * @return An AsyncToken
    	 */
    	function getByPartNumber(getByPartNumber:GetByPartNumber):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function getByPartNumber_send():AsyncToken;
        
        /**
         * The getByPartNumber operation lastResult property
         */
        function get getByPartNumber_lastResult():GetByPartNumberResponse;
		/**
		 * @private
		 */
        function set getByPartNumber_lastResult(lastResult:GetByPartNumberResponse):void;
       /**
        * Add a listener for the getByPartNumber operation successful result event
        * @param The listener function
        */
       function addgetByPartNumberEventListener(listener:Function):void;
       
       
        /**
         * The getByPartNumber operation request wrapper
         */
        function get getByPartNumber_request_var():GetByPartNumber_request;
        
        /**
         * @private
         */
        function set getByPartNumber_request_var(request:GetByPartNumber_request):void;
                   
    	//Stub functions for the createStrain operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param createStrain
    	 * @param sessionId
    	 * @param strain
    	 * @return An AsyncToken
    	 */
    	function createStrain(createStrain:CreateStrain):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function createStrain_send():AsyncToken;
        
        /**
         * The createStrain operation lastResult property
         */
        function get createStrain_lastResult():CreateStrainResponse;
		/**
		 * @private
		 */
        function set createStrain_lastResult(lastResult:CreateStrainResponse):void;
       /**
        * Add a listener for the createStrain operation successful result event
        * @param The listener function
        */
       function addcreateStrainEventListener(listener:Function):void;
       
       
        /**
         * The createStrain operation request wrapper
         */
        function get createStrain_request_var():CreateStrain_request;
        
        /**
         * @private
         */
        function set createStrain_request_var(request:CreateStrain_request):void;
                   
    	//Stub functions for the search operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param search
    	 * @param sessionId
    	 * @param query
    	 * @return An AsyncToken
    	 */
    	function search(search:Search):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function search_send():AsyncToken;
        
        /**
         * The search operation lastResult property
         */
        function get search_lastResult():SearchResponse;
		/**
		 * @private
		 */
        function set search_lastResult(lastResult:SearchResponse):void;
       /**
        * Add a listener for the search operation successful result event
        * @param The listener function
        */
       function addsearchEventListener(listener:Function):void;
       
       
        /**
         * The search operation request wrapper
         */
        function get search_request_var():Search_request;
        
        /**
         * @private
         */
        function set search_request_var(request:Search_request):void;
                   
    	//Stub functions for the createPart operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param createPart
    	 * @param sessionId
    	 * @param part
    	 * @return An AsyncToken
    	 */
    	function createPart(createPart:CreatePart):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function createPart_send():AsyncToken;
        
        /**
         * The createPart operation lastResult property
         */
        function get createPart_lastResult():CreatePartResponse;
		/**
		 * @private
		 */
        function set createPart_lastResult(lastResult:CreatePartResponse):void;
       /**
        * Add a listener for the createPart operation successful result event
        * @param The listener function
        */
       function addcreatePartEventListener(listener:Function):void;
       
       
        /**
         * The createPart operation request wrapper
         */
        function get createPart_request_var():CreatePart_request;
        
        /**
         * @private
         */
        function set createPart_request_var(request:CreatePart_request):void;
                   
    	//Stub functions for the createSequence operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param sessionId
    	 * @param entryId
    	 * @param sequence
    	 * @param createSequence
    	 * @return An AsyncToken
    	 */
    	function createSequence(createSequence:CreateSequence):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function createSequence_send():AsyncToken;
        
        /**
         * The createSequence operation lastResult property
         */
        function get createSequence_lastResult():CreateSequenceResponse;
		/**
		 * @private
		 */
        function set createSequence_lastResult(lastResult:CreateSequenceResponse):void;
       /**
        * Add a listener for the createSequence operation successful result event
        * @param The listener function
        */
       function addcreateSequenceEventListener(listener:Function):void;
       
       
        /**
         * The createSequence operation request wrapper
         */
        function get createSequence_request_var():CreateSequence_request;
        
        /**
         * @private
         */
        function set createSequence_request_var(request:CreateSequence_request):void;
                   
    	//Stub functions for the tblastx operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param tblastx
    	 * @param sessionId
    	 * @param querySequence
    	 * @return An AsyncToken
    	 */
    	function tblastx(tblastx:Tblastx):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function tblastx_send():AsyncToken;
        
        /**
         * The tblastx operation lastResult property
         */
        function get tblastx_lastResult():TblastxResponse;
		/**
		 * @private
		 */
        function set tblastx_lastResult(lastResult:TblastxResponse):void;
       /**
        * Add a listener for the tblastx operation successful result event
        * @param The listener function
        */
       function addtblastxEventListener(listener:Function):void;
       
       
        /**
         * The tblastx operation request wrapper
         */
        function get tblastx_request_var():Tblastx_request;
        
        /**
         * @private
         */
        function set tblastx_request_var(request:Tblastx_request):void;
                   
    	//Stub functions for the removeSequence operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param sessionId
    	 * @param entryId
    	 * @param removeSequence
    	 * @return An AsyncToken
    	 */
    	function removeSequence(removeSequence:RemoveSequence):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function removeSequence_send():AsyncToken;
        
        /**
         * The removeSequence operation lastResult property
         */
        function get removeSequence_lastResult():RemoveSequenceResponse;
		/**
		 * @private
		 */
        function set removeSequence_lastResult(lastResult:RemoveSequenceResponse):void;
       /**
        * Add a listener for the removeSequence operation successful result event
        * @param The listener function
        */
       function addremoveSequenceEventListener(listener:Function):void;
       
       
        /**
         * The removeSequence operation request wrapper
         */
        function get removeSequence_request_var():RemoveSequence_request;
        
        /**
         * @private
         */
        function set removeSequence_request_var(request:RemoveSequence_request):void;
                   
    	//Stub functions for the blastn operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param sessionId
    	 * @param querySequence
    	 * @param blastn
    	 * @return An AsyncToken
    	 */
    	function blastn(blastn:Blastn):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function blastn_send():AsyncToken;
        
        /**
         * The blastn operation lastResult property
         */
        function get blastn_lastResult():BlastnResponse;
		/**
		 * @private
		 */
        function set blastn_lastResult(lastResult:BlastnResponse):void;
       /**
        * Add a listener for the blastn operation successful result event
        * @param The listener function
        */
       function addblastnEventListener(listener:Function):void;
       
       
        /**
         * The blastn operation request wrapper
         */
        function get blastn_request_var():Blastn_request;
        
        /**
         * @private
         */
        function set blastn_request_var(request:Blastn_request):void;
                   
    	//Stub functions for the updatePart operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param updatePart
    	 * @param sessionId
    	 * @param part
    	 * @return An AsyncToken
    	 */
    	function updatePart(updatePart:UpdatePart):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function updatePart_send():AsyncToken;
        
        /**
         * The updatePart operation lastResult property
         */
        function get updatePart_lastResult():UpdatePartResponse;
		/**
		 * @private
		 */
        function set updatePart_lastResult(lastResult:UpdatePartResponse):void;
       /**
        * Add a listener for the updatePart operation successful result event
        * @param The listener function
        */
       function addupdatePartEventListener(listener:Function):void;
       
       
        /**
         * The updatePart operation request wrapper
         */
        function get updatePart_request_var():UpdatePart_request;
        
        /**
         * @private
         */
        function set updatePart_request_var(request:UpdatePart_request):void;
                   
    	//Stub functions for the getByRecordId operation
    	/**
    	 * Call the operation on the server passing in the arguments defined in the WSDL file
    	 * @param sessionId
    	 * @param entryId
    	 * @param getByRecordId
    	 * @return An AsyncToken
    	 */
    	function getByRecordId(getByRecordId:GetByRecordId):AsyncToken;
        /**
         * Method to call the operation on the server without passing the arguments inline.
         * You must however set the _request property for the operation before calling this method
         * Should use it in MXML context mostly
         * @return An AsyncToken
         */
        function getByRecordId_send():AsyncToken;
        
        /**
         * The getByRecordId operation lastResult property
         */
        function get getByRecordId_lastResult():GetByRecordIdResponse;
		/**
		 * @private
		 */
        function set getByRecordId_lastResult(lastResult:GetByRecordIdResponse):void;
       /**
        * Add a listener for the getByRecordId operation successful result event
        * @param The listener function
        */
       function addgetByRecordIdEventListener(listener:Function):void;
       
       
        /**
         * The getByRecordId operation request wrapper
         */
        function get getByRecordId_request_var():GetByRecordId_request;
        
        /**
         * @private
         */
        function set getByRecordId_request_var(request:GetByRecordId_request):void;
                   
        /**
         * Get access to the underlying web service that the stub uses to communicate with the server
         * @return The base service that the facade implements
         */
        function getWebService():BaseRegistryAPIService;
	}
}