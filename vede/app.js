var splashscreen;
var session;

Ext.define('sessionData', { 
          singleton: true, 
          data: null
      }); 

Ext.onReady(function() {
    // Start the mask on the body and get a reference to the mask
    splashscreen = Ext.getBody().mask('<span id="splash-text">Loading application</span>', 'splashscreen');
    // Add a new class to this mask as we want it to look different from the default.
    splashscreen.addCls('splashscreen');

    // Insert a new div before the loading icon where we can place our logo.
    Ext.DomHelper.insertFirst(Ext.query('.x-mask-msg')[0], {
        cls: 'x-splash-icon'
    });
});

/*global console*/
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        Ext: '.',
        'Ext.ux': '../extjs/examples/ux',
        Teselagen: './app/teselagen',
        'Teselagen.bio': '../biojs/src/teselagen/bio'
    }
});

Ext.application({
    autoCreateViewport: true,
    name: 'Vede',
    views: ['AppViewport', 'FileImportWindow', 'SimulateDigestionWindow'],
    controllers: ['ActionStackController', 'AppController', 'AnnotatePanelController', 'FindPanelController', 'MainMenuController', 'MainPanelController', 'MainToolbarController', 'PieController', 'RailController', 'RestrictionEnzymeController', 'SelectWindowController', 'SequenceController', 'VectorPanelController', 'SimulateDigestionController', 'DeviceEditor.MainMenuController', 'DeviceEditor.MainToolbarController', 'DeviceEditor.DeviceEditorPanelController'],
    errorHandler: function(err) {
        console.warn(err);
        return true;
    },
    require: ["Teselagen.event.AuthenticationEvent", "Teselagen.manager.AuthenticationManager"],
    launch: function() {

        this.authenticationManager = Ext.create("Teselagen.manager.AuthenticationManager");
        var that = this;

        var showDevInfo = function() {
                console.log("Showing dev info");
                Ext.create("Ext.Window", {
                    title: 'Welcome ' + sessionData.data.username + '!',
                    width: 500,
                    height: 100,
                    closable: true,
                    html: 'J5 sessionId: ' + sessionData.data.sessionId,
                    modal: true
                }).show();
            }

        var authenticate =  function() {
                Ext.get('splash-text').update('Authenticating to server');
                Ext.Ajax.request({
                    url: '/api/login',
                    params: {
                        sessionId: sessionData.data.sessionId
                    },
                    success: function(response) {
                        var data = JSON.parse(response.responseText);
                        if(data.firstTime) sessionData.firstTime = data.firstTime;
                        Ext.get('splash-text').update(data.msg);
                        that.authenticationManager.logIn("LoggedIn");
                    },
                   failure : function(response, options){ 
                       Ext.get('splash-text').update(response.responseText);
                   }
                }); 
       };

        var logIn = function() {
                Ext.get('splash-text').update('Getting authentication parameters');
                Ext.Ajax.request({
                    url: '/deviceeditor',
                    params: {},
                    success: function(response) {
                        session = JSON.parse(response.responseText);
                        sessionData.data = session;
                        authenticate();
                    }
                });
            };

        Ext.Error.notify = false; // prevent ie6 and ie7 popup
        Ext.Error.handle = this.errorHandler; // handle errors raised by Ext.Error

        logIn();

        // Setup a task to fadeOut the splashscreen
        var task = new Ext.util.DelayedTask(function() {
            // Fade out the body mask
            splashscreen.fadeOut({
                duration: 1000,
                remove: true
            });
            // Fade out the icon and message
            splashscreen.next().fadeOut({
                duration: 1000,
                remove: true,
                listeners: {
                    afteranimate: function() {
                        // Set the body as unmasked after the animation
                        console.log('First time user:'+data.firstTime);
                        showDevInfo();
                        Ext.getBody().unmask();

                    }
                }
            });
        });
        // Run the fade 500 milliseconds after launch.
        //task.delay(0);

        var AuthenticationEvent = Teselagen.event.AuthenticationEvent;
        this.on(AuthenticationEvent.LOGGED_IN, function(){
            task.delay(0);
        });

    }
});