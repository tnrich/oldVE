/**
 * @class Teselagen.manager.AuthenticationManager
 * Holds authentication information
 * @author Rodrigo Pavez
 **/

Ext.define("Teselagen.manager.AuthenticationManager", {
  requires: ["Teselagen.event.AuthenticationEvent", "Vede.view.common.ProjectPanelView", "Vede.view.AuthWindow"],
  alias: "AuthenticationManager",
  singleton: true,
  mixins: {
    observable: "Ext.util.Observable"
  },
  authResponse: null,
  username: null,

  updateSplashScreenMessage: function(message){
    if(splashscreen) Ext.get('splash-text').update(message);
  },

  /*
  * Login
  *
  * This method init the auth process by trying to fetchVariables from
  * /deviceeditor (JSON file containing variables) for automatic authentication
  * If fail proceed to manual authentication process
  */

  Login: function() {
    var self = this;
    self.updateSplashScreenMessage('Getting authentication parameters');
    Ext.Ajax.request({
      url: '/deviceeditor',
      params: {},
      method: 'GET',
      success: function(response) {
        var session = JSON.parse(response.responseText);
        self.username = session.username;
        delete session.username;
        self.sendAuthRequest(session);
      },
      failure: function(response, options) {
        var authDialog = Ext.create('Vede.view.AuthWindow').show();
      }
    });
  },

  /**
   *
   *
   * Input parameters.
   * @param {Object} params (required) {username(optional),password(optional),server(optional),session(optional)}
   * For Automatic Auth use params.session
   * For Manual Auth use params.username, params.password, params.server (optional)
   */

  sendAuthRequest: function(params,cb) {
    var self = this;

    if(params.server) Teselagen.manager.SessionManager.baseURL = params.server; // Set base URL
    
    self.updateSplashScreenMessage('Authenticating to server');
    
    Ext.Ajax.request({
      url: Teselagen.manager.SessionManager.buildUrl('login'),
      params: {
        username: params.username || "",
        password: params.password || "",
        sessionId: params.sessionId || ""
      },
      success: function(response, options) {
        if(params.username) self.username = params.username;
        self.authResponse = JSON.parse(response.responseText);
        self.updateSplashScreenMessage(self.authResponse.msg);
        if(Ext.getCmp('AuthWindow')) Ext.getCmp('AuthWindow').destroy();
        Vede.application.fireEvent(Teselagen.event.AuthenticationEvent.LOGGED_IN);
        if (cb) return cb(true); // for Testing
      },
      failure: function(response, options) {
        self.updateSplashScreenMessage(response.statusText);
        if (cb) return cb(false); // for Testing
      }
    });
  }
});