/**
 * @class Vede.controller.AppController
 * Top level application Controller
 */
Ext.define('Vede.controller.AppController', {
    extend: 'Ext.app.Controller',
    requires: ["Teselagen.event.ContextMenuEvent"],
    init: function() {
        Vede.application = this.application;
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
        Ext.EventManager.addListener(Ext.getBody(), 'mousedown', function(e){
        	Vede.application.fireEvent(Teselagen.event.ContextMenuEvent.MOUSE_DOWN_ANYWHERE, e);
        });
    }
});
