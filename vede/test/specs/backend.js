/**
 * Unit Tests
 * @author Rodrigo Pavez
 */

Ext.require("Ext.Ajax");

Ext.require("Teselagen.constants.Constants");
//Ext.require("Teselagen.store.*");


Ext.define('sessionData', { 
          singleton: true, 
          data: null,
          baseURL: null
}); 


function ajaxCheck(ajaxMethod,args,cb)
{
	/**
	 * @author Rodrigo Pavez
	 * Custom function for checking ajax request
	 * Need to add in the method: if (cb) return cb(true); // for testing
	 * 
	 * Input: (method,args,cb)
	 * method: Method to test
	 * args: array of arguments
	 * cb (optional): function to be called after success 
	 */

 	var ajaxTimeOut = 10000;

	args.push(function(r){flag=r;});
	var flag = false;
    runs(function () {
        ajaxMethod.apply(this, args);
    });

    waitsFor(function () {
    	if(flag) cb(flag);
        return flag;
    }, "Ajax has not responded in setup timeout", ajaxTimeOut);
};

Ext.onReady(function () {

	var server = 'http://teselagen.local/api/';

    describe("Connection to server", function () {
        it("Setup params", function () {
	        Ext.Ajax.cors = true; // Allow CORS
	        Ext.Ajax.method = 'POST'; // Set POST as default Method
	        sessionData.baseURL = server;
	    });

		it("Checking server "+server+" is running", function () {
			var check = function(cb){
				Ext.Ajax.request({
				    url: server,
				    method: 'GET',
				    success: function(){ return cb(true); },
				    failure: function(){ return cb(false); }
				});};
        	ajaxCheck(check,[],function(res){
        		expect(res).toBe(true);
        	});
	    });
   	});

    describe("Authentication", function () {

	    it("Create Authentication Manager and Login as Root on teselagen.local server", function () {
	        var authenticationManager = Ext.create("Teselagen.manager.AuthenticationManager"); // Created Auth manager
        	var args = ['Guest','','http://teselagen.local/api/'];
        	ajaxCheck(authenticationManager.manualAuth,args,function(){
        		expect(sessionData.AuthResponse).toBeDefined();
        		console.log(sessionData.AuthResponse);
        	});
        });

    });

    describe("Create Project Manager, Get User Profile and Projects", function (){
    	var projectManager;

    	it("Create Project Manager", function () {
    		projectManager = Ext.create("Teselagen.manager.ProjectManager"); // Created Project Manager
    	});

    	it("Get User Profile and Get User Projects", function () {
        	projectManager.loadUser(function(){
         		console.log(projectManager.currentUser);
         		expect(projectManager.currentUser).toBeDefined();
				console.log(projectManager.projects);
				expect(projectManager.projects).toBeDefined();           		
        	});
    	});

    	it("", function () {
   		
    	});

    });


});