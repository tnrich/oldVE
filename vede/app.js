var splashscreen;

Ext.onReady(function() {
    // Start the mask on the body and get a reference to the mask
    splashscreen = Ext.getBody().mask('Loading application', 'splashscreen');
    // Add a new class to this mask as we want it to look different from the default.
    splashscreen.addCls('splashscreen');

    // Insert a new div before the loading icon where we can place our logo.
    Ext.DomHelper.insertFirst(Ext.query('.x-mask-msg')[0], {
        cls: 'x-splash-icon'
    });

    console.log("Trying to get session data");
        // Execute ajax to get data
        Ext.Ajax.request({
            url: '/deviceeditor',
            params: {},
            success: function(response){
                var response = JSON.parse(response.responseText);
                    Ext.create("Ext.Window",{
                        title : 'Welcome '+response.username+'!',
                        width : 500,                            
                        height: 100,
                        closable : true,                           
                        html : 'sessionId:'+response.sessionId,                         
                        modal : true
                        }).show();
            }
    });

});

/*global console*/
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        Ext: '.',
        'Ext.ux': '../extjs/examples/ux',
        Teselagen: './app/teselagen',
        'Teselagen.bio':'../biojs/src/teselagen/bio'
    }
});

Ext.application({
    autoCreateViewport: true,
    name: 'Vede',
    views: [
        'AppViewport',
        'FileImportWindow',
        'SimulateDigestionWindow'
    ],
    controllers: [
        'ActionStackController',
        'AppController',
        'AnnotatePanelController',
        'FindPanelController',
        'MainMenuController',
        'MainPanelController',
        'MainToolbarController',
        'PieController',
        'RailController',
        'RestrictionEnzymeController',
        'SelectWindowController',
        'SequenceController',
        'VectorPanelController',
        'SimulateDigestionController',
        'DeviceEditor.MainMenuController',
        'DeviceEditor.MainToolbarController',
        'DeviceEditor.DeviceEditorPanelController'
    ],
    errorHandler: function(err) {
        console.warn(err);
        return true;
    },
    launch: function() {
        Ext.Error.notify = false; // prevent ie6 and ie7 popup
        Ext.Error.handle = this.errorHandler; // handle errors raised by Ext.Error

        // Setup a task to fadeOut the splashscreen
        var task = new Ext.util.DelayedTask(function() {
            // Fade out the body mask
            splashscreen.fadeOut({
                duration: 1000,
                remove:true
            });
            // Fade out the icon and message
            splashscreen.next().fadeOut({
                duration: 1000,
                remove:true,
                listeners: {
                    afteranimate: function() {
                        // Set the body as unmasked after the animation
                        Ext.getBody().unmask();
                    }
                }
            });
        });
        // Run the fade 500 milliseconds after launch.
        task.delay(0);
    }
});

