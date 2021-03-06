/*
 * File: app/controller/AppController.js
 *
 * This file was generated by Sencha Architect version 2.1.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.0.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Vesa.controller.AppController', {
    extend: 'Ext.app.Controller',

    init: function(application) {

    },

    onLaunch: function() {
        Vesa.application = this.application;

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
