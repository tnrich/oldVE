/**
 * @class Vede.controller.AppController
 * Top level application Controller
 */
Ext.define('Vede.controller.AppController', {
    extend: 'Ext.app.Controller',
    init: function() {
    },
    onLaunch: function() {
        Vede.app = this.application;
    }
});
