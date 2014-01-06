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

        // Increase the timeout time for ajax requests.
        Ext.Ajax.timeout = 60000;

        // Prevent backspace key and control + arrow keys from sending the user
        // back a page.
        Ext.EventManager.addListener(Ext.getBody(), 'keydown', function(e){
            var type = e.getTarget().tagName.toLowerCase();
            var reg = /input|select|textarea|text|password|file/i;

            if(e.getKey() == '8' || (e.isNavKeyPress() && e.ctrlKey)) {
                if(!reg.test(type)) {
                    e.preventDefault();
                }
            }
        });
        Ext.EventManager.addListener(Ext.getBody(), 'mousedown', function(e){
            Vede.application.fireEvent(Teselagen.event.ContextMenuEvent.MOUSE_DOWN_ANYWHERE, e);
        });
    }
});
