/**
 * @class Teselagen.manager.AuthenticationManager
 * Holds authentication information
 * @author Rodrigo Pavez
 **/

Ext.define("Teselagen.manager.AuthenticationManager", {
  requires: ["Teselagen.event.AuthenticationEvent", "Vede.view.common.ProjectPanelView", "Vede.view.AuthWindow"],
  alias: "AuthenticationManager",
  mixins: {
    observable: "Ext.util.Observable"
  },
  /**
   * @param {Teselagen.manager.SequenceManager} sequenceManager The
   * SequenceManager to undo/redo actions for.
   */
  constructor: function() {
  },


  /**
   * Fires event to init all ajax calls that depend on an active sessionId
   */
  loggedIn: function() {

        //if (sessionData.data.firstTime) showDevInfo.delay(1500);
        Ext.getCmp('headerUserIcon').setText(sessionData.data.username);
        //Ext.getCmp("projectDesignPanel").store.load();        

        //Vede.application.fireEvent(Teselagen.event.AuthenticationEvent.LOGGED_IN);
  },
  manualAuth: function(username,password,server,cb) {
    
    sessionData.baseURL = server;
    if(Ext.get('splash-text')) Ext.get('splash-text').update('Authenticating to server');
    Ext.Ajax.request({
      url: sessionData.baseURL + 'login',
      params: {
        username: username,
        password: password
      },
      success: function(response) {
        var parsedResponse = JSON.parse(response.responseText);
        sessionData.AuthResponse = parsedResponse;
        sessionData.data = {};
        sessionData.data.firstTime = parsedResponse.firstTime;
        if(Ext.get('splash-text')) Ext.get('splash-text').update(parsedResponse.msg);
        Vede.application.fireEvent(Teselagen.event.AuthenticationEvent.LOGGED_IN);
        if(Ext.getCmp('AuthWindow')) Ext.getCmp('AuthWindow').destroy();
        if (cb) return cb(true); // for testing
      },
      failure: function(response, options) {
        if(response.responseText != '')
        {
          console.log(response.responseText);
          var parsedResponse = JSON.parse(response.responseText);
          Ext.get('splash-text').update(parsedResponse.msg);
        }
        if( response.status == 0 ) Ext.get('splash-text').update('Server offline.');
      }
    });
  },
  guestAuth: function(server){

    sessionData.baseURL = server;

    Ext.get('splash-text').update('Logging in as Guest');
    sessionData.data = {
      username: "Guest",
      sessionId: "000",
      userId: "0"
    };
    this.authenticate();  
  }
  ,
  authenticate: function(app) {
        var that = this;
        Ext.get('splash-text').update('Authenticating to server');
        Ext.Ajax.request({
          url: sessionData.baseURL + 'login',
          params: {
            sessionId: sessionData.data.sessionId
          },
          success: function(response) {
            var parsedResponse = JSON.parse(response.responseText);
            sessionData.AuthResponse = parsedResponse;
            sessionData.data.firstTime = parsedResponse.firstTime;
            Ext.get('splash-text').update(parsedResponse.msg);
            that.loggedIn();
            if(Vede.application) Vede.application.fireEvent(Teselagen.event.AuthenticationEvent.LOGGED_IN);
            else app.fireEvent(Teselagen.event.AuthenticationEvent.LOGGED_IN);
            if(Ext.getCmp('AuthWindow')) Ext.getCmp('AuthWindow').destroy();
          },
          failure: function(response, options) {
            Ext.get('splash-text').update(response.responseText);
            if( response.status == 0 ||  response.status == 503 ||  response.status == 404 ) Ext.get('splash-text').update('Server offline.');
          }
        });
      }
  ,

  login: function(app) {

    var that = this;

    var showDevInfo = new Ext.util.DelayedTask(function() {
      Ext.create("Ext.Window", {
        title: 'Welcome ' + sessionData.data.username + '!',
        width: 500,
        height: 100,
        closable: true,
        html: JSON.stringify(sessionData),
        modal: true
      }).show();
    });


    var fetchVariables = function() {
        Ext.get('splash-text').update('Getting authentication parameters');
        Ext.Ajax.request({
          url: '/deviceeditor',
          params: {},
          method: 'GET',
          success: function(response) {
            session = JSON.parse(response.responseText);
            sessionData.data = session;
            that.authenticate(app);
          },
          failure: function(response, options) {
            Ext.get('splash-text').update('Automatic login failed.');
            var authDialog = Ext.create('Vede.view.AuthWindow');
            authDialog.show(); 
            console.log('Automatic login failed. Starting StandAlone Authentication.');
          }
        });
      };

    fetchVariables();

  }
});