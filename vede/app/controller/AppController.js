/**
 * @class Vede.controller.AppController
 * Top level application Controller
 */
Ext.define('Vede.controller.AppController', {
    extend: 'Ext.app.Controller',
    init: function() {
    },
    onLaunch: function() {
        Vede.application = this.application;

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
