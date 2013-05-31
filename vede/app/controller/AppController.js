/**
 * @class Vede.controller.AppController
 * Top level application Controller
 */
Ext.define('Vede.controller.AppController', {
    extend: 'Ext.app.Controller',
    init: function() {
        Vede.application = Vede.app;
    },
    onLaunch: function() {
        Ext.tip.QuickTipManager.init();

        // Prevent backspace key and control + arrow keys from sending the user
        // back a page.
        Ext.EventManager.addListener(Ext.getBody(), 'keydown', function(e){
            if(e.getTarget().type != 'text' && 
                (e.getKey() == '8' || 
                (e.isNavKeyPress() && e.ctrlKey)
                )){

                e.preventDefault();
            }
        }); 
    }
});
