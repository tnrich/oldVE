/**
 * RegistryAPIServiceService.as
 * This file was auto-generated from WSDL by the Apache Axis2 generator modified by Adobe
 * Any change made to this file will be overwritten when the code is re-generated.
 */
 /**
  * Usage example: to use this service from within your Flex application you have two choices:
  * Use it via Actionscript only
  * Use it via MXML tags
  * Actionscript sample code:
  * Step 1: create an instance of the service; pass it the LCDS destination string if any
  * var myService:RegistryAPIService= new RegistryAPIService();
  * Step 2: for the desired operation add a result handler (a function that you have already defined previously)  
  * myService.addgetGenBankSequenceEventListener(myResultHandlingFunction);
  * Step 3: Call the operation as a method on the service. Pass the right values as arguments:
  * myService.getGenBankSequence(mygetGenBankSequence,mysessionId,myentryId);
  *
  * MXML sample code:
  * First you need to map the package where the files were generated to a namespace, usually on the <mx:Application> tag, 
  * like this: xmlns:srv="org.jbei.registry.api.*"
  * Define the service and within its tags set the request wrapper for the desired operation
  * <srv:RegistryAPIService id="myService">
  *   <srv:getGenBankSequence_request_var>
  *		<srv:GetGenBankSequence_request getGenBankSequence=myValue,sessionId=myValue,entryId=myValue/>
  *   </srv:getGenBankSequence_request_var>
  * </srv:RegistryAPIService>
  * Then call the operation for which you have set the request wrapper value above, like this:
  * <mx:Button id="myButton" label="Call operation" click="myService.getGenBankSequence_send()" />
  */
package org.jbei.registry.api
{
	import mx.rpc.AsyncToken;
	import flash.events.EventDispatcher;
	import mx.rpc.events.ResultEvent;
	import mx.rpc.events.FaultEvent;
	import flash.utils.ByteArray;
	import mx.rpc.soap.types.*;

    /**
     * Dispatches when a call to the operation getGenBankSequence completes with success
     * and returns some data
     * @eventType GetGenBankSequenceResultEvent
     */
    [Event(name="GetGenBankSequence_result", type="org.jbei.registry.api.GetGenBankSequenceResultEvent")]
    
    /**
     * Dispatches when a call to the operation hasReadPermissions completes with success
     * and returns some data
     * @eventType HasReadPermissionsResultEvent
     */
    [Event(name="HasReadPermissions_result", type="org.jbei.registry.api.HasReadPermissionsResultEvent")]
    
    /**
     * Dispatches when a call to the operation getOriginalGenBankSequence completes with success
     * and returns some data
     * @eventType GetOriginalGenBankSequenceResultEvent
     */
    [Event(name="GetOriginalGenBankSequence_result", type="org.jbei.registry.api.GetOriginalGenBankSequenceResultEvent")]
    
    /**
     * Dispatches when a call to the operation updatePlasmid completes with success
     * and returns some data
     * @eventType UpdatePlasmidResultEvent
     */
    [Event(name="UpdatePlasmid_result", type="org.jbei.registry.api.UpdatePlasmidResultEvent")]
    
    /**
     * Dispatches when a call to the operation uploadSequence completes with success
     * and returns some data
     * @eventType UploadSequenceResultEvent
     */
    [Event(name="UploadSequence_result", type="org.jbei.registry.api.UploadSequenceResultEvent")]
    
    /**
     * Dispatches when a call to the operation getFastaSequence completes with success
     * and returns some data
     * @eventType GetFastaSequenceResultEvent
     */
    [Event(name="GetFastaSequence_result", type="org.jbei.registry.api.GetFastaSequenceResultEvent")]
    
    /**
     * Dispatches when a call to the operation hasWritePermissions completes with success
     * and returns some data
     * @eventType HasWritePermissionsResultEvent
     */
    [Event(name="HasWritePermissions_result", type="org.jbei.registry.api.HasWritePermissionsResultEvent")]
    
    /**
     * Dispatches when a call to the operation createPlasmid completes with success
     * and returns some data
     * @eventType CreatePlasmidResultEvent
     */
    [Event(name="CreatePlasmid_result", type="org.jbei.registry.api.CreatePlasmidResultEvent")]
    
    /**
     * Dispatches when a call to the operation isAuthenticated completes with success
     * and returns some data
     * @eventType IsAuthenticatedResultEvent
     */
    [Event(name="IsAuthenticated_result", type="org.jbei.registry.api.IsAuthenticatedResultEvent")]
    
    /**
     * Dispatches when a call to the operation getSequence completes with success
     * and returns some data
     * @eventType GetSequenceResultEvent
     */
    [Event(name="GetSequence_result", type="org.jbei.registry.api.GetSequenceResultEvent")]
    
    /**
     * Dispatches when a call to the operation logout completes with success
     * and returns some data
     * @eventType LogoutResultEvent
     */
    [Event(name="Logout_result", type="org.jbei.registry.api.LogoutResultEvent")]
    
    /**
     * Dispatches when a call to the operation getNumberOfPublicEntries completes with success
     * and returns some data
     * @eventType GetNumberOfPublicEntriesResultEvent
     */
    [Event(name="GetNumberOfPublicEntries_result", type="org.jbei.registry.api.GetNumberOfPublicEntriesResultEvent")]
    
    /**
     * Dispatches when a call to the operation removeEntry completes with success
     * and returns some data
     * @eventType RemoveEntryResultEvent
     */
    [Event(name="RemoveEntry_result", type="org.jbei.registry.api.RemoveEntryResultEvent")]
    
    /**
     * Dispatches when a call to the operation updateStrain completes with success
     * and returns some data
     * @eventType UpdateStrainResultEvent
     */
    [Event(name="UpdateStrain_result", type="org.jbei.registry.api.UpdateStrainResultEvent")]
    
    /**
     * Dispatches when a call to the operation login completes with success
     * and returns some data
     * @eventType LoginResultEvent
     */
    [Event(name="Login_result", type="org.jbei.registry.api.LoginResultEvent")]
    
    /**
     * Dispatches when a call to the operation getByPartNumber completes with success
     * and returns some data
     * @eventType GetByPartNumberResultEvent
     */
    [Event(name="GetByPartNumber_result", type="org.jbei.registry.api.GetByPartNumberResultEvent")]
    
    /**
     * Dispatches when a call to the operation createStrain completes with success
     * and returns some data
     * @eventType CreateStrainResultEvent
     */
    [Event(name="CreateStrain_result", type="org.jbei.registry.api.CreateStrainResultEvent")]
    
    /**
     * Dispatches when a call to the operation search completes with success
     * and returns some data
     * @eventType SearchResultEvent
     */
    [Event(name="Search_result", type="org.jbei.registry.api.SearchResultEvent")]
    
    /**
     * Dispatches when a call to the operation createPart completes with success
     * and returns some data
     * @eventType CreatePartResultEvent
     */
    [Event(name="CreatePart_result", type="org.jbei.registry.api.CreatePartResultEvent")]
    
    /**
     * Dispatches when a call to the operation createSequence completes with success
     * and returns some data
     * @eventType CreateSequenceResultEvent
     */
    [Event(name="CreateSequence_result", type="org.jbei.registry.api.CreateSequenceResultEvent")]
    
    /**
     * Dispatches when a call to the operation tblastx completes with success
     * and returns some data
     * @eventType TblastxResultEvent
     */
    [Event(name="Tblastx_result", type="org.jbei.registry.api.TblastxResultEvent")]
    
    /**
     * Dispatches when a call to the operation removeSequence completes with success
     * and returns some data
     * @eventType RemoveSequenceResultEvent
     */
    [Event(name="RemoveSequence_result", type="org.jbei.registry.api.RemoveSequenceResultEvent")]
    
    /**
     * Dispatches when a call to the operation blastn completes with success
     * and returns some data
     * @eventType BlastnResultEvent
     */
    [Event(name="Blastn_result", type="org.jbei.registry.api.BlastnResultEvent")]
    
    /**
     * Dispatches when a call to the operation updatePart completes with success
     * and returns some data
     * @eventType UpdatePartResultEvent
     */
    [Event(name="UpdatePart_result", type="org.jbei.registry.api.UpdatePartResultEvent")]
    
    /**
     * Dispatches when a call to the operation getByRecordId completes with success
     * and returns some data
     * @eventType GetByRecordIdResultEvent
     */
    [Event(name="GetByRecordId_result", type="org.jbei.registry.api.GetByRecordIdResultEvent")]
    
	/**
	 * Dispatches when the operation that has been called fails. The fault event is common for all operations
	 * of the WSDL
	 * @eventType mx.rpc.events.FaultEvent
	 */
    [Event(name="fault", type="mx.rpc.events.FaultEvent")]

	public class RegistryAPIService extends EventDispatcher implements IRegistryAPIService
	{
    	private var _baseService:BaseRegistryAPIService;
        
        /**
         * Constructor for the facade; sets the destination and create a baseService instance
         * @param The LCDS destination (if any) associated with the imported WSDL
         */  
        public function RegistryAPIService(destination:String=null,rootURL:String=null)
        {
        	_baseService = new BaseRegistryAPIService(destination,rootURL);
        }
        
		//stub functions for the getGenBankSequence operation
          

        /**
         * @see IRegistryAPIService#getGenBankSequence()
         */
        public function getGenBankSequence(getGenBankSequence:GetGenBankSequence):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.getGenBankSequence(getGenBankSequence);
            _internal_token.addEventListener("result",_getGenBankSequence_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#getGenBankSequence_send()
		 */    
        public function getGenBankSequence_send():AsyncToken
        {
        	return getGenBankSequence(_getGenBankSequence_request.getGenBankSequence);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _getGenBankSequence_request:GetGenBankSequence_request;
		/**
		 * @see IRegistryAPIService#getGenBankSequence_request_var
		 */
		[Bindable]
		public function get getGenBankSequence_request_var():GetGenBankSequence_request
		{
			return _getGenBankSequence_request;
		}
		
		/**
		 * @private
		 */
		public function set getGenBankSequence_request_var(request:GetGenBankSequence_request):void
		{
			_getGenBankSequence_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _getGenBankSequence_lastResult:GetGenBankSequenceResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#getGenBankSequence_lastResult
		 */	  
		public function get getGenBankSequence_lastResult():GetGenBankSequenceResponse
		{
			return _getGenBankSequence_lastResult;
		}
		/**
		 * @private
		 */
		public function set getGenBankSequence_lastResult(lastResult:GetGenBankSequenceResponse):void
		{
			_getGenBankSequence_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addgetGenBankSequence()
		 */
		public function addgetGenBankSequenceEventListener(listener:Function):void
		{
			addEventListener(GetGenBankSequenceResultEvent.GetGenBankSequence_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _getGenBankSequence_populate_results(event:ResultEvent):void
		{
			var e:GetGenBankSequenceResultEvent = new GetGenBankSequenceResultEvent();
		            e.result = event.result as GetGenBankSequenceResponse;
		                       e.headers = event.headers;
		             getGenBankSequence_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the hasReadPermissions operation
          

        /**
         * @see IRegistryAPIService#hasReadPermissions()
         */
        public function hasReadPermissions(hasReadPermissions:HasReadPermissions):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.hasReadPermissions(hasReadPermissions);
            _internal_token.addEventListener("result",_hasReadPermissions_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#hasReadPermissions_send()
		 */    
        public function hasReadPermissions_send():AsyncToken
        {
        	return hasReadPermissions(_hasReadPermissions_request.hasReadPermissions);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _hasReadPermissions_request:HasReadPermissions_request;
		/**
		 * @see IRegistryAPIService#hasReadPermissions_request_var
		 */
		[Bindable]
		public function get hasReadPermissions_request_var():HasReadPermissions_request
		{
			return _hasReadPermissions_request;
		}
		
		/**
		 * @private
		 */
		public function set hasReadPermissions_request_var(request:HasReadPermissions_request):void
		{
			_hasReadPermissions_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _hasReadPermissions_lastResult:HasReadPermissionsResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#hasReadPermissions_lastResult
		 */	  
		public function get hasReadPermissions_lastResult():HasReadPermissionsResponse
		{
			return _hasReadPermissions_lastResult;
		}
		/**
		 * @private
		 */
		public function set hasReadPermissions_lastResult(lastResult:HasReadPermissionsResponse):void
		{
			_hasReadPermissions_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addhasReadPermissions()
		 */
		public function addhasReadPermissionsEventListener(listener:Function):void
		{
			addEventListener(HasReadPermissionsResultEvent.HasReadPermissions_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _hasReadPermissions_populate_results(event:ResultEvent):void
		{
			var e:HasReadPermissionsResultEvent = new HasReadPermissionsResultEvent();
		            e.result = event.result as HasReadPermissionsResponse;
		                       e.headers = event.headers;
		             hasReadPermissions_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the getOriginalGenBankSequence operation
          

        /**
         * @see IRegistryAPIService#getOriginalGenBankSequence()
         */
        public function getOriginalGenBankSequence(getOriginalGenBankSequence:GetOriginalGenBankSequence):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.getOriginalGenBankSequence(getOriginalGenBankSequence);
            _internal_token.addEventListener("result",_getOriginalGenBankSequence_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#getOriginalGenBankSequence_send()
		 */    
        public function getOriginalGenBankSequence_send():AsyncToken
        {
        	return getOriginalGenBankSequence(_getOriginalGenBankSequence_request.getOriginalGenBankSequence);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _getOriginalGenBankSequence_request:GetOriginalGenBankSequence_request;
		/**
		 * @see IRegistryAPIService#getOriginalGenBankSequence_request_var
		 */
		[Bindable]
		public function get getOriginalGenBankSequence_request_var():GetOriginalGenBankSequence_request
		{
			return _getOriginalGenBankSequence_request;
		}
		
		/**
		 * @private
		 */
		public function set getOriginalGenBankSequence_request_var(request:GetOriginalGenBankSequence_request):void
		{
			_getOriginalGenBankSequence_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _getOriginalGenBankSequence_lastResult:GetOriginalGenBankSequenceResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#getOriginalGenBankSequence_lastResult
		 */	  
		public function get getOriginalGenBankSequence_lastResult():GetOriginalGenBankSequenceResponse
		{
			return _getOriginalGenBankSequence_lastResult;
		}
		/**
		 * @private
		 */
		public function set getOriginalGenBankSequence_lastResult(lastResult:GetOriginalGenBankSequenceResponse):void
		{
			_getOriginalGenBankSequence_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addgetOriginalGenBankSequence()
		 */
		public function addgetOriginalGenBankSequenceEventListener(listener:Function):void
		{
			addEventListener(GetOriginalGenBankSequenceResultEvent.GetOriginalGenBankSequence_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _getOriginalGenBankSequence_populate_results(event:ResultEvent):void
		{
			var e:GetOriginalGenBankSequenceResultEvent = new GetOriginalGenBankSequenceResultEvent();
		            e.result = event.result as GetOriginalGenBankSequenceResponse;
		                       e.headers = event.headers;
		             getOriginalGenBankSequence_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the updatePlasmid operation
          

        /**
         * @see IRegistryAPIService#updatePlasmid()
         */
        public function updatePlasmid(updatePlasmid:UpdatePlasmid):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.updatePlasmid(updatePlasmid);
            _internal_token.addEventListener("result",_updatePlasmid_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#updatePlasmid_send()
		 */    
        public function updatePlasmid_send():AsyncToken
        {
        	return updatePlasmid(_updatePlasmid_request.updatePlasmid);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _updatePlasmid_request:UpdatePlasmid_request;
		/**
		 * @see IRegistryAPIService#updatePlasmid_request_var
		 */
		[Bindable]
		public function get updatePlasmid_request_var():UpdatePlasmid_request
		{
			return _updatePlasmid_request;
		}
		
		/**
		 * @private
		 */
		public function set updatePlasmid_request_var(request:UpdatePlasmid_request):void
		{
			_updatePlasmid_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _updatePlasmid_lastResult:UpdatePlasmidResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#updatePlasmid_lastResult
		 */	  
		public function get updatePlasmid_lastResult():UpdatePlasmidResponse
		{
			return _updatePlasmid_lastResult;
		}
		/**
		 * @private
		 */
		public function set updatePlasmid_lastResult(lastResult:UpdatePlasmidResponse):void
		{
			_updatePlasmid_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addupdatePlasmid()
		 */
		public function addupdatePlasmidEventListener(listener:Function):void
		{
			addEventListener(UpdatePlasmidResultEvent.UpdatePlasmid_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _updatePlasmid_populate_results(event:ResultEvent):void
		{
			var e:UpdatePlasmidResultEvent = new UpdatePlasmidResultEvent();
		            e.result = event.result as UpdatePlasmidResponse;
		                       e.headers = event.headers;
		             updatePlasmid_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the uploadSequence operation
          

        /**
         * @see IRegistryAPIService#uploadSequence()
         */
        public function uploadSequence(uploadSequence:UploadSequence):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.uploadSequence(uploadSequence);
            _internal_token.addEventListener("result",_uploadSequence_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#uploadSequence_send()
		 */    
        public function uploadSequence_send():AsyncToken
        {
        	return uploadSequence(_uploadSequence_request.uploadSequence);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _uploadSequence_request:UploadSequence_request;
		/**
		 * @see IRegistryAPIService#uploadSequence_request_var
		 */
		[Bindable]
		public function get uploadSequence_request_var():UploadSequence_request
		{
			return _uploadSequence_request;
		}
		
		/**
		 * @private
		 */
		public function set uploadSequence_request_var(request:UploadSequence_request):void
		{
			_uploadSequence_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _uploadSequence_lastResult:UploadSequenceResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#uploadSequence_lastResult
		 */	  
		public function get uploadSequence_lastResult():UploadSequenceResponse
		{
			return _uploadSequence_lastResult;
		}
		/**
		 * @private
		 */
		public function set uploadSequence_lastResult(lastResult:UploadSequenceResponse):void
		{
			_uploadSequence_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#adduploadSequence()
		 */
		public function adduploadSequenceEventListener(listener:Function):void
		{
			addEventListener(UploadSequenceResultEvent.UploadSequence_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _uploadSequence_populate_results(event:ResultEvent):void
		{
			var e:UploadSequenceResultEvent = new UploadSequenceResultEvent();
		            e.result = event.result as UploadSequenceResponse;
		                       e.headers = event.headers;
		             uploadSequence_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the getFastaSequence operation
          

        /**
         * @see IRegistryAPIService#getFastaSequence()
         */
        public function getFastaSequence(getFastaSequence:GetFastaSequence):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.getFastaSequence(getFastaSequence);
            _internal_token.addEventListener("result",_getFastaSequence_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#getFastaSequence_send()
		 */    
        public function getFastaSequence_send():AsyncToken
        {
        	return getFastaSequence(_getFastaSequence_request.getFastaSequence);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _getFastaSequence_request:GetFastaSequence_request;
		/**
		 * @see IRegistryAPIService#getFastaSequence_request_var
		 */
		[Bindable]
		public function get getFastaSequence_request_var():GetFastaSequence_request
		{
			return _getFastaSequence_request;
		}
		
		/**
		 * @private
		 */
		public function set getFastaSequence_request_var(request:GetFastaSequence_request):void
		{
			_getFastaSequence_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _getFastaSequence_lastResult:GetFastaSequenceResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#getFastaSequence_lastResult
		 */	  
		public function get getFastaSequence_lastResult():GetFastaSequenceResponse
		{
			return _getFastaSequence_lastResult;
		}
		/**
		 * @private
		 */
		public function set getFastaSequence_lastResult(lastResult:GetFastaSequenceResponse):void
		{
			_getFastaSequence_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addgetFastaSequence()
		 */
		public function addgetFastaSequenceEventListener(listener:Function):void
		{
			addEventListener(GetFastaSequenceResultEvent.GetFastaSequence_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _getFastaSequence_populate_results(event:ResultEvent):void
		{
			var e:GetFastaSequenceResultEvent = new GetFastaSequenceResultEvent();
		            e.result = event.result as GetFastaSequenceResponse;
		                       e.headers = event.headers;
		             getFastaSequence_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the hasWritePermissions operation
          

        /**
         * @see IRegistryAPIService#hasWritePermissions()
         */
        public function hasWritePermissions(hasWritePermissions:HasWritePermissions):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.hasWritePermissions(hasWritePermissions);
            _internal_token.addEventListener("result",_hasWritePermissions_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#hasWritePermissions_send()
		 */    
        public function hasWritePermissions_send():AsyncToken
        {
        	return hasWritePermissions(_hasWritePermissions_request.hasWritePermissions);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _hasWritePermissions_request:HasWritePermissions_request;
		/**
		 * @see IRegistryAPIService#hasWritePermissions_request_var
		 */
		[Bindable]
		public function get hasWritePermissions_request_var():HasWritePermissions_request
		{
			return _hasWritePermissions_request;
		}
		
		/**
		 * @private
		 */
		public function set hasWritePermissions_request_var(request:HasWritePermissions_request):void
		{
			_hasWritePermissions_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _hasWritePermissions_lastResult:HasWritePermissionsResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#hasWritePermissions_lastResult
		 */	  
		public function get hasWritePermissions_lastResult():HasWritePermissionsResponse
		{
			return _hasWritePermissions_lastResult;
		}
		/**
		 * @private
		 */
		public function set hasWritePermissions_lastResult(lastResult:HasWritePermissionsResponse):void
		{
			_hasWritePermissions_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addhasWritePermissions()
		 */
		public function addhasWritePermissionsEventListener(listener:Function):void
		{
			addEventListener(HasWritePermissionsResultEvent.HasWritePermissions_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _hasWritePermissions_populate_results(event:ResultEvent):void
		{
			var e:HasWritePermissionsResultEvent = new HasWritePermissionsResultEvent();
		            e.result = event.result as HasWritePermissionsResponse;
		                       e.headers = event.headers;
		             hasWritePermissions_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the createPlasmid operation
          

        /**
         * @see IRegistryAPIService#createPlasmid()
         */
        public function createPlasmid(createPlasmid:CreatePlasmid):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.createPlasmid(createPlasmid);
            _internal_token.addEventListener("result",_createPlasmid_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#createPlasmid_send()
		 */    
        public function createPlasmid_send():AsyncToken
        {
        	return createPlasmid(_createPlasmid_request.createPlasmid);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _createPlasmid_request:CreatePlasmid_request;
		/**
		 * @see IRegistryAPIService#createPlasmid_request_var
		 */
		[Bindable]
		public function get createPlasmid_request_var():CreatePlasmid_request
		{
			return _createPlasmid_request;
		}
		
		/**
		 * @private
		 */
		public function set createPlasmid_request_var(request:CreatePlasmid_request):void
		{
			_createPlasmid_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _createPlasmid_lastResult:CreatePlasmidResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#createPlasmid_lastResult
		 */	  
		public function get createPlasmid_lastResult():CreatePlasmidResponse
		{
			return _createPlasmid_lastResult;
		}
		/**
		 * @private
		 */
		public function set createPlasmid_lastResult(lastResult:CreatePlasmidResponse):void
		{
			_createPlasmid_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addcreatePlasmid()
		 */
		public function addcreatePlasmidEventListener(listener:Function):void
		{
			addEventListener(CreatePlasmidResultEvent.CreatePlasmid_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _createPlasmid_populate_results(event:ResultEvent):void
		{
			var e:CreatePlasmidResultEvent = new CreatePlasmidResultEvent();
		            e.result = event.result as CreatePlasmidResponse;
		                       e.headers = event.headers;
		             createPlasmid_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the isAuthenticated operation
          

        /**
         * @see IRegistryAPIService#isAuthenticated()
         */
        public function isAuthenticated(isAuthenticated:IsAuthenticated):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.isAuthenticated(isAuthenticated);
            _internal_token.addEventListener("result",_isAuthenticated_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#isAuthenticated_send()
		 */    
        public function isAuthenticated_send():AsyncToken
        {
        	return isAuthenticated(_isAuthenticated_request.isAuthenticated);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _isAuthenticated_request:IsAuthenticated_request;
		/**
		 * @see IRegistryAPIService#isAuthenticated_request_var
		 */
		[Bindable]
		public function get isAuthenticated_request_var():IsAuthenticated_request
		{
			return _isAuthenticated_request;
		}
		
		/**
		 * @private
		 */
		public function set isAuthenticated_request_var(request:IsAuthenticated_request):void
		{
			_isAuthenticated_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _isAuthenticated_lastResult:IsAuthenticatedResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#isAuthenticated_lastResult
		 */	  
		public function get isAuthenticated_lastResult():IsAuthenticatedResponse
		{
			return _isAuthenticated_lastResult;
		}
		/**
		 * @private
		 */
		public function set isAuthenticated_lastResult(lastResult:IsAuthenticatedResponse):void
		{
			_isAuthenticated_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addisAuthenticated()
		 */
		public function addisAuthenticatedEventListener(listener:Function):void
		{
			addEventListener(IsAuthenticatedResultEvent.IsAuthenticated_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _isAuthenticated_populate_results(event:ResultEvent):void
		{
			var e:IsAuthenticatedResultEvent = new IsAuthenticatedResultEvent();
		            e.result = event.result as IsAuthenticatedResponse;
		                       e.headers = event.headers;
		             isAuthenticated_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the getSequence operation
          

        /**
         * @see IRegistryAPIService#getSequence()
         */
        public function getSequence(getSequence:GetSequence):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.getSequence(getSequence);
            _internal_token.addEventListener("result",_getSequence_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#getSequence_send()
		 */    
        public function getSequence_send():AsyncToken
        {
        	return getSequence(_getSequence_request.getSequence);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _getSequence_request:GetSequence_request;
		/**
		 * @see IRegistryAPIService#getSequence_request_var
		 */
		[Bindable]
		public function get getSequence_request_var():GetSequence_request
		{
			return _getSequence_request;
		}
		
		/**
		 * @private
		 */
		public function set getSequence_request_var(request:GetSequence_request):void
		{
			_getSequence_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _getSequence_lastResult:GetSequenceResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#getSequence_lastResult
		 */	  
		public function get getSequence_lastResult():GetSequenceResponse
		{
			return _getSequence_lastResult;
		}
		/**
		 * @private
		 */
		public function set getSequence_lastResult(lastResult:GetSequenceResponse):void
		{
			_getSequence_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addgetSequence()
		 */
		public function addgetSequenceEventListener(listener:Function):void
		{
			addEventListener(GetSequenceResultEvent.GetSequence_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _getSequence_populate_results(event:ResultEvent):void
		{
			var e:GetSequenceResultEvent = new GetSequenceResultEvent();
		            e.result = event.result as GetSequenceResponse;
		                       e.headers = event.headers;
		             getSequence_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the logout operation
          

        /**
         * @see IRegistryAPIService#logout()
         */
        public function mylogout(logout:Logout):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.mylogout(logout);
            _internal_token.addEventListener("result",_logout_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#logout_send()
		 */    
        public function mylogout_send():AsyncToken
        {
        	return mylogout(_logout_request.logout);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _logout_request:Logout_request;
		/**
		 * @see IRegistryAPIService#logout_request_var
		 */
		[Bindable]
		public function get mylogout_request_var():Logout_request
		{
			return _logout_request;
		}
		
		/**
		 * @private
		 */
		public function set mylogout_request_var(request:Logout_request):void
		{
			_logout_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _mylogout_lastResult:LogoutResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#logout_lastResult
		 */	  
		public function get mylogout_lastResult():LogoutResponse
		{
			return _mylogout_lastResult;
		}
		/**
		 * @private
		 */
		public function set mylogout_lastResult(lastResult:LogoutResponse):void
		{
			_mylogout_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addlogout()
		 */
		public function addmylogoutEventListener(listener:Function):void
		{
			addEventListener(LogoutResultEvent.Logout_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _logout_populate_results(event:ResultEvent):void
		{
			var e:LogoutResultEvent = new LogoutResultEvent();
		            e.result = event.result as LogoutResponse;
		                       e.headers = event.headers;
		             mylogout_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the getNumberOfPublicEntries operation
          

        /**
         * @see IRegistryAPIService#getNumberOfPublicEntries()
         */
        public function getNumberOfPublicEntries(getNumberOfPublicEntries:GetNumberOfPublicEntries):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.getNumberOfPublicEntries(getNumberOfPublicEntries);
            _internal_token.addEventListener("result",_getNumberOfPublicEntries_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#getNumberOfPublicEntries_send()
		 */    
        public function getNumberOfPublicEntries_send():AsyncToken
        {
        	return getNumberOfPublicEntries(_getNumberOfPublicEntries_request.getNumberOfPublicEntries);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _getNumberOfPublicEntries_request:GetNumberOfPublicEntries_request;
		/**
		 * @see IRegistryAPIService#getNumberOfPublicEntries_request_var
		 */
		[Bindable]
		public function get getNumberOfPublicEntries_request_var():GetNumberOfPublicEntries_request
		{
			return _getNumberOfPublicEntries_request;
		}
		
		/**
		 * @private
		 */
		public function set getNumberOfPublicEntries_request_var(request:GetNumberOfPublicEntries_request):void
		{
			_getNumberOfPublicEntries_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _getNumberOfPublicEntries_lastResult:GetNumberOfPublicEntriesResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#getNumberOfPublicEntries_lastResult
		 */	  
		public function get getNumberOfPublicEntries_lastResult():GetNumberOfPublicEntriesResponse
		{
			return _getNumberOfPublicEntries_lastResult;
		}
		/**
		 * @private
		 */
		public function set getNumberOfPublicEntries_lastResult(lastResult:GetNumberOfPublicEntriesResponse):void
		{
			_getNumberOfPublicEntries_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addgetNumberOfPublicEntries()
		 */
		public function addgetNumberOfPublicEntriesEventListener(listener:Function):void
		{
			addEventListener(GetNumberOfPublicEntriesResultEvent.GetNumberOfPublicEntries_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _getNumberOfPublicEntries_populate_results(event:ResultEvent):void
		{
			var e:GetNumberOfPublicEntriesResultEvent = new GetNumberOfPublicEntriesResultEvent();
		            e.result = event.result as GetNumberOfPublicEntriesResponse;
		                       e.headers = event.headers;
		             getNumberOfPublicEntries_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the removeEntry operation
          

        /**
         * @see IRegistryAPIService#removeEntry()
         */
        public function removeEntry(removeEntry:RemoveEntry):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.removeEntry(removeEntry);
            _internal_token.addEventListener("result",_removeEntry_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#removeEntry_send()
		 */    
        public function removeEntry_send():AsyncToken
        {
        	return removeEntry(_removeEntry_request.removeEntry);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _removeEntry_request:RemoveEntry_request;
		/**
		 * @see IRegistryAPIService#removeEntry_request_var
		 */
		[Bindable]
		public function get removeEntry_request_var():RemoveEntry_request
		{
			return _removeEntry_request;
		}
		
		/**
		 * @private
		 */
		public function set removeEntry_request_var(request:RemoveEntry_request):void
		{
			_removeEntry_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _removeEntry_lastResult:RemoveEntryResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#removeEntry_lastResult
		 */	  
		public function get removeEntry_lastResult():RemoveEntryResponse
		{
			return _removeEntry_lastResult;
		}
		/**
		 * @private
		 */
		public function set removeEntry_lastResult(lastResult:RemoveEntryResponse):void
		{
			_removeEntry_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addremoveEntry()
		 */
		public function addremoveEntryEventListener(listener:Function):void
		{
			addEventListener(RemoveEntryResultEvent.RemoveEntry_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _removeEntry_populate_results(event:ResultEvent):void
		{
			var e:RemoveEntryResultEvent = new RemoveEntryResultEvent();
		            e.result = event.result as RemoveEntryResponse;
		                       e.headers = event.headers;
		             removeEntry_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the updateStrain operation
          

        /**
         * @see IRegistryAPIService#updateStrain()
         */
        public function updateStrain(updateStrain:UpdateStrain):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.updateStrain(updateStrain);
            _internal_token.addEventListener("result",_updateStrain_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#updateStrain_send()
		 */    
        public function updateStrain_send():AsyncToken
        {
        	return updateStrain(_updateStrain_request.updateStrain);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _updateStrain_request:UpdateStrain_request;
		/**
		 * @see IRegistryAPIService#updateStrain_request_var
		 */
		[Bindable]
		public function get updateStrain_request_var():UpdateStrain_request
		{
			return _updateStrain_request;
		}
		
		/**
		 * @private
		 */
		public function set updateStrain_request_var(request:UpdateStrain_request):void
		{
			_updateStrain_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _updateStrain_lastResult:UpdateStrainResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#updateStrain_lastResult
		 */	  
		public function get updateStrain_lastResult():UpdateStrainResponse
		{
			return _updateStrain_lastResult;
		}
		/**
		 * @private
		 */
		public function set updateStrain_lastResult(lastResult:UpdateStrainResponse):void
		{
			_updateStrain_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addupdateStrain()
		 */
		public function addupdateStrainEventListener(listener:Function):void
		{
			addEventListener(UpdateStrainResultEvent.UpdateStrain_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _updateStrain_populate_results(event:ResultEvent):void
		{
			var e:UpdateStrainResultEvent = new UpdateStrainResultEvent();
		            e.result = event.result as UpdateStrainResponse;
		                       e.headers = event.headers;
		             updateStrain_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the login operation
          

        /**
         * @see IRegistryAPIService#login()
         */
        public function login(login:Login):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.login(login);
            _internal_token.addEventListener("result",_login_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#login_send()
		 */    
        public function login_send():AsyncToken
        {
        	return login(_login_request.login);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _login_request:Login_request;
		/**
		 * @see IRegistryAPIService#login_request_var
		 */
		[Bindable]
		public function get login_request_var():Login_request
		{
			return _login_request;
		}
		
		/**
		 * @private
		 */
		public function set login_request_var(request:Login_request):void
		{
			_login_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _login_lastResult:LoginResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#login_lastResult
		 */	  
		public function get login_lastResult():LoginResponse
		{
			return _login_lastResult;
		}
		/**
		 * @private
		 */
		public function set login_lastResult(lastResult:LoginResponse):void
		{
			_login_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addlogin()
		 */
		public function addloginEventListener(listener:Function):void
		{
			addEventListener(LoginResultEvent.Login_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _login_populate_results(event:ResultEvent):void
		{
			var e:LoginResultEvent = new LoginResultEvent();
		            e.result = event.result as LoginResponse;
		                       e.headers = event.headers;
		             login_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the getByPartNumber operation
          

        /**
         * @see IRegistryAPIService#getByPartNumber()
         */
        public function getByPartNumber(getByPartNumber:GetByPartNumber):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.getByPartNumber(getByPartNumber);
            _internal_token.addEventListener("result",_getByPartNumber_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#getByPartNumber_send()
		 */    
        public function getByPartNumber_send():AsyncToken
        {
        	return getByPartNumber(_getByPartNumber_request.getByPartNumber);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _getByPartNumber_request:GetByPartNumber_request;
		/**
		 * @see IRegistryAPIService#getByPartNumber_request_var
		 */
		[Bindable]
		public function get getByPartNumber_request_var():GetByPartNumber_request
		{
			return _getByPartNumber_request;
		}
		
		/**
		 * @private
		 */
		public function set getByPartNumber_request_var(request:GetByPartNumber_request):void
		{
			_getByPartNumber_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _getByPartNumber_lastResult:GetByPartNumberResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#getByPartNumber_lastResult
		 */	  
		public function get getByPartNumber_lastResult():GetByPartNumberResponse
		{
			return _getByPartNumber_lastResult;
		}
		/**
		 * @private
		 */
		public function set getByPartNumber_lastResult(lastResult:GetByPartNumberResponse):void
		{
			_getByPartNumber_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addgetByPartNumber()
		 */
		public function addgetByPartNumberEventListener(listener:Function):void
		{
			addEventListener(GetByPartNumberResultEvent.GetByPartNumber_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _getByPartNumber_populate_results(event:ResultEvent):void
		{
			var e:GetByPartNumberResultEvent = new GetByPartNumberResultEvent();
		            e.result = event.result as GetByPartNumberResponse;
		                       e.headers = event.headers;
		             getByPartNumber_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the createStrain operation
          

        /**
         * @see IRegistryAPIService#createStrain()
         */
        public function createStrain(createStrain:CreateStrain):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.createStrain(createStrain);
            _internal_token.addEventListener("result",_createStrain_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#createStrain_send()
		 */    
        public function createStrain_send():AsyncToken
        {
        	return createStrain(_createStrain_request.createStrain);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _createStrain_request:CreateStrain_request;
		/**
		 * @see IRegistryAPIService#createStrain_request_var
		 */
		[Bindable]
		public function get createStrain_request_var():CreateStrain_request
		{
			return _createStrain_request;
		}
		
		/**
		 * @private
		 */
		public function set createStrain_request_var(request:CreateStrain_request):void
		{
			_createStrain_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _createStrain_lastResult:CreateStrainResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#createStrain_lastResult
		 */	  
		public function get createStrain_lastResult():CreateStrainResponse
		{
			return _createStrain_lastResult;
		}
		/**
		 * @private
		 */
		public function set createStrain_lastResult(lastResult:CreateStrainResponse):void
		{
			_createStrain_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addcreateStrain()
		 */
		public function addcreateStrainEventListener(listener:Function):void
		{
			addEventListener(CreateStrainResultEvent.CreateStrain_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _createStrain_populate_results(event:ResultEvent):void
		{
			var e:CreateStrainResultEvent = new CreateStrainResultEvent();
		            e.result = event.result as CreateStrainResponse;
		                       e.headers = event.headers;
		             createStrain_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the search operation
          

        /**
         * @see IRegistryAPIService#search()
         */
        public function search(search:Search):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.search(search);
            _internal_token.addEventListener("result",_search_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#search_send()
		 */    
        public function search_send():AsyncToken
        {
        	return search(_search_request.search);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _search_request:Search_request;
		/**
		 * @see IRegistryAPIService#search_request_var
		 */
		[Bindable]
		public function get search_request_var():Search_request
		{
			return _search_request;
		}
		
		/**
		 * @private
		 */
		public function set search_request_var(request:Search_request):void
		{
			_search_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _search_lastResult:SearchResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#search_lastResult
		 */	  
		public function get search_lastResult():SearchResponse
		{
			return _search_lastResult;
		}
		/**
		 * @private
		 */
		public function set search_lastResult(lastResult:SearchResponse):void
		{
			_search_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addsearch()
		 */
		public function addsearchEventListener(listener:Function):void
		{
			addEventListener(SearchResultEvent.Search_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _search_populate_results(event:ResultEvent):void
		{
			var e:SearchResultEvent = new SearchResultEvent();
		            e.result = event.result as SearchResponse;
		                       e.headers = event.headers;
		             search_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the createPart operation
          

        /**
         * @see IRegistryAPIService#createPart()
         */
        public function createPart(createPart:CreatePart):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.createPart(createPart);
            _internal_token.addEventListener("result",_createPart_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#createPart_send()
		 */    
        public function createPart_send():AsyncToken
        {
        	return createPart(_createPart_request.createPart);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _createPart_request:CreatePart_request;
		/**
		 * @see IRegistryAPIService#createPart_request_var
		 */
		[Bindable]
		public function get createPart_request_var():CreatePart_request
		{
			return _createPart_request;
		}
		
		/**
		 * @private
		 */
		public function set createPart_request_var(request:CreatePart_request):void
		{
			_createPart_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _createPart_lastResult:CreatePartResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#createPart_lastResult
		 */	  
		public function get createPart_lastResult():CreatePartResponse
		{
			return _createPart_lastResult;
		}
		/**
		 * @private
		 */
		public function set createPart_lastResult(lastResult:CreatePartResponse):void
		{
			_createPart_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addcreatePart()
		 */
		public function addcreatePartEventListener(listener:Function):void
		{
			addEventListener(CreatePartResultEvent.CreatePart_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _createPart_populate_results(event:ResultEvent):void
		{
			var e:CreatePartResultEvent = new CreatePartResultEvent();
		            e.result = event.result as CreatePartResponse;
		                       e.headers = event.headers;
		             createPart_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the createSequence operation
          

        /**
         * @see IRegistryAPIService#createSequence()
         */
        public function createSequence(createSequence:CreateSequence):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.createSequence(createSequence);
            _internal_token.addEventListener("result",_createSequence_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#createSequence_send()
		 */    
        public function createSequence_send():AsyncToken
        {
        	return createSequence(_createSequence_request.createSequence);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _createSequence_request:CreateSequence_request;
		/**
		 * @see IRegistryAPIService#createSequence_request_var
		 */
		[Bindable]
		public function get createSequence_request_var():CreateSequence_request
		{
			return _createSequence_request;
		}
		
		/**
		 * @private
		 */
		public function set createSequence_request_var(request:CreateSequence_request):void
		{
			_createSequence_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _createSequence_lastResult:CreateSequenceResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#createSequence_lastResult
		 */	  
		public function get createSequence_lastResult():CreateSequenceResponse
		{
			return _createSequence_lastResult;
		}
		/**
		 * @private
		 */
		public function set createSequence_lastResult(lastResult:CreateSequenceResponse):void
		{
			_createSequence_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addcreateSequence()
		 */
		public function addcreateSequenceEventListener(listener:Function):void
		{
			addEventListener(CreateSequenceResultEvent.CreateSequence_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _createSequence_populate_results(event:ResultEvent):void
		{
			var e:CreateSequenceResultEvent = new CreateSequenceResultEvent();
		            e.result = event.result as CreateSequenceResponse;
		                       e.headers = event.headers;
		             createSequence_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the tblastx operation
          

        /**
         * @see IRegistryAPIService#tblastx()
         */
        public function tblastx(tblastx:Tblastx):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.tblastx(tblastx);
            _internal_token.addEventListener("result",_tblastx_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#tblastx_send()
		 */    
        public function tblastx_send():AsyncToken
        {
        	return tblastx(_tblastx_request.tblastx);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _tblastx_request:Tblastx_request;
		/**
		 * @see IRegistryAPIService#tblastx_request_var
		 */
		[Bindable]
		public function get tblastx_request_var():Tblastx_request
		{
			return _tblastx_request;
		}
		
		/**
		 * @private
		 */
		public function set tblastx_request_var(request:Tblastx_request):void
		{
			_tblastx_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _tblastx_lastResult:TblastxResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#tblastx_lastResult
		 */	  
		public function get tblastx_lastResult():TblastxResponse
		{
			return _tblastx_lastResult;
		}
		/**
		 * @private
		 */
		public function set tblastx_lastResult(lastResult:TblastxResponse):void
		{
			_tblastx_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addtblastx()
		 */
		public function addtblastxEventListener(listener:Function):void
		{
			addEventListener(TblastxResultEvent.Tblastx_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _tblastx_populate_results(event:ResultEvent):void
		{
			var e:TblastxResultEvent = new TblastxResultEvent();
		            e.result = event.result as TblastxResponse;
		                       e.headers = event.headers;
		             tblastx_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the removeSequence operation
          

        /**
         * @see IRegistryAPIService#removeSequence()
         */
        public function removeSequence(removeSequence:RemoveSequence):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.removeSequence(removeSequence);
            _internal_token.addEventListener("result",_removeSequence_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#removeSequence_send()
		 */    
        public function removeSequence_send():AsyncToken
        {
        	return removeSequence(_removeSequence_request.removeSequence);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _removeSequence_request:RemoveSequence_request;
		/**
		 * @see IRegistryAPIService#removeSequence_request_var
		 */
		[Bindable]
		public function get removeSequence_request_var():RemoveSequence_request
		{
			return _removeSequence_request;
		}
		
		/**
		 * @private
		 */
		public function set removeSequence_request_var(request:RemoveSequence_request):void
		{
			_removeSequence_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _removeSequence_lastResult:RemoveSequenceResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#removeSequence_lastResult
		 */	  
		public function get removeSequence_lastResult():RemoveSequenceResponse
		{
			return _removeSequence_lastResult;
		}
		/**
		 * @private
		 */
		public function set removeSequence_lastResult(lastResult:RemoveSequenceResponse):void
		{
			_removeSequence_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addremoveSequence()
		 */
		public function addremoveSequenceEventListener(listener:Function):void
		{
			addEventListener(RemoveSequenceResultEvent.RemoveSequence_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _removeSequence_populate_results(event:ResultEvent):void
		{
			var e:RemoveSequenceResultEvent = new RemoveSequenceResultEvent();
		            e.result = event.result as RemoveSequenceResponse;
		                       e.headers = event.headers;
		             removeSequence_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the blastn operation
          

        /**
         * @see IRegistryAPIService#blastn()
         */
        public function blastn(blastn:Blastn):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.blastn(blastn);
            _internal_token.addEventListener("result",_blastn_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#blastn_send()
		 */    
        public function blastn_send():AsyncToken
        {
        	return blastn(_blastn_request.blastn);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _blastn_request:Blastn_request;
		/**
		 * @see IRegistryAPIService#blastn_request_var
		 */
		[Bindable]
		public function get blastn_request_var():Blastn_request
		{
			return _blastn_request;
		}
		
		/**
		 * @private
		 */
		public function set blastn_request_var(request:Blastn_request):void
		{
			_blastn_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _blastn_lastResult:BlastnResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#blastn_lastResult
		 */	  
		public function get blastn_lastResult():BlastnResponse
		{
			return _blastn_lastResult;
		}
		/**
		 * @private
		 */
		public function set blastn_lastResult(lastResult:BlastnResponse):void
		{
			_blastn_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addblastn()
		 */
		public function addblastnEventListener(listener:Function):void
		{
			addEventListener(BlastnResultEvent.Blastn_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _blastn_populate_results(event:ResultEvent):void
		{
			var e:BlastnResultEvent = new BlastnResultEvent();
		            e.result = event.result as BlastnResponse;
		                       e.headers = event.headers;
		             blastn_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the updatePart operation
          

        /**
         * @see IRegistryAPIService#updatePart()
         */
        public function updatePart(updatePart:UpdatePart):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.updatePart(updatePart);
            _internal_token.addEventListener("result",_updatePart_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#updatePart_send()
		 */    
        public function updatePart_send():AsyncToken
        {
        	return updatePart(_updatePart_request.updatePart);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _updatePart_request:UpdatePart_request;
		/**
		 * @see IRegistryAPIService#updatePart_request_var
		 */
		[Bindable]
		public function get updatePart_request_var():UpdatePart_request
		{
			return _updatePart_request;
		}
		
		/**
		 * @private
		 */
		public function set updatePart_request_var(request:UpdatePart_request):void
		{
			_updatePart_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _updatePart_lastResult:UpdatePartResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#updatePart_lastResult
		 */	  
		public function get updatePart_lastResult():UpdatePartResponse
		{
			return _updatePart_lastResult;
		}
		/**
		 * @private
		 */
		public function set updatePart_lastResult(lastResult:UpdatePartResponse):void
		{
			_updatePart_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addupdatePart()
		 */
		public function addupdatePartEventListener(listener:Function):void
		{
			addEventListener(UpdatePartResultEvent.UpdatePart_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _updatePart_populate_results(event:ResultEvent):void
		{
			var e:UpdatePartResultEvent = new UpdatePartResultEvent();
		            e.result = event.result as UpdatePartResponse;
		                       e.headers = event.headers;
		             updatePart_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//stub functions for the getByRecordId operation
          

        /**
         * @see IRegistryAPIService#getByRecordId()
         */
        public function getByRecordId(getByRecordId:GetByRecordId):AsyncToken
        {
         	var _internal_token:AsyncToken = _baseService.getByRecordId(getByRecordId);
            _internal_token.addEventListener("result",_getByRecordId_populate_results);
            _internal_token.addEventListener("fault",throwFault); 
            return _internal_token;
		}
        /**
		 * @see IRegistryAPIService#getByRecordId_send()
		 */    
        public function getByRecordId_send():AsyncToken
        {
        	return getByRecordId(_getByRecordId_request.getByRecordId);
        }
              
		/**
		 * Internal representation of the request wrapper for the operation
		 * @private
		 */
		private var _getByRecordId_request:GetByRecordId_request;
		/**
		 * @see IRegistryAPIService#getByRecordId_request_var
		 */
		[Bindable]
		public function get getByRecordId_request_var():GetByRecordId_request
		{
			return _getByRecordId_request;
		}
		
		/**
		 * @private
		 */
		public function set getByRecordId_request_var(request:GetByRecordId_request):void
		{
			_getByRecordId_request = request;
		}
		
	  		/**
		 * Internal variable to store the operation's lastResult
		 * @private
		 */
        private var _getByRecordId_lastResult:GetByRecordIdResponse;
		[Bindable]
		/**
		 * @see IRegistryAPIService#getByRecordId_lastResult
		 */	  
		public function get getByRecordId_lastResult():GetByRecordIdResponse
		{
			return _getByRecordId_lastResult;
		}
		/**
		 * @private
		 */
		public function set getByRecordId_lastResult(lastResult:GetByRecordIdResponse):void
		{
			_getByRecordId_lastResult = lastResult;
		}
		
		/**
		 * @see IRegistryAPIService#addgetByRecordId()
		 */
		public function addgetByRecordIdEventListener(listener:Function):void
		{
			addEventListener(GetByRecordIdResultEvent.GetByRecordId_RESULT,listener);
		}
			
		/**
		 * @private
		 */
        private function _getByRecordId_populate_results(event:ResultEvent):void
		{
			var e:GetByRecordIdResultEvent = new GetByRecordIdResultEvent();
		            e.result = event.result as GetByRecordIdResponse;
		                       e.headers = event.headers;
		             getByRecordId_lastResult = e.result;
		             dispatchEvent(e);
	        		}
		
		//service-wide functions
		/**
		 * @see IRegistryAPIService#getWebService()
		 */
		public function getWebService():BaseRegistryAPIService
		{
			return _baseService;
		}
		
		/**
		 * Set the event listener for the fault event which can be triggered by each of the operations defined by the facade
		 */
		public function addRegistryAPIServiceFaultEventListener(listener:Function):void
		{
			addEventListener("fault",listener);
		}
		
		/**
		 * Internal function to re-dispatch the fault event passed on by the base service implementation
		 * @private
		 */
		 
		 private function throwFault(event:FaultEvent):void
		 {
		 	dispatchEvent(event);
		 }
    }
}
