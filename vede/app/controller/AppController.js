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
        if(document.URL.indexOf("app.teselagen") >= 0 || document.URL.indexOf("dev.teselagen") >= 0) {
            var env;

            if(document.URL.indexOf("app.teselagen") >= 0) {
                env = "production";
            } else if(document.URL.indexOf("dev.teselagen") >= 0) {
                env = "development";
            } else {
                env = "unknown";
            }
        }

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

        // Configure the error handler to send errors to Codebase.
        Ext.Error.handle = function(err) {
            debugger;

            if(true || env === 'production') {
                var stackLines = err.stack.split('\n');
                var stackXML = stackLines.map(function(line) {
                    return '<line>' + line + '</line>';
                }).join('');

                var xml = '<?xml version="1.0" encoding="UTF-8"?>' +
                            '<notice version="2.3">' +
                                '<api-key>40e870e0-c0a6-c307-8bef-37371fd86407</api-key>' +
                                '<notifier>' +
                                    '<name>TeselaGen App</name>' +
                                    '<version>0.0.1</version>' +
                                    '<url>www.teselagen.com</url>' +
                                '</notifier>' +
                                '<error>' +
                                    '<class>' + err.name + '</class>' +
                                    '<message>' + err.message + '</message>' +
                                    '<backtrace>' +
                                        stackXML +
                                    '</backtrace>' +
                                '</error>' +
                                '<server-environment>' +
                                    '<environment-name>' + env + '</environment-name>' +
                                '</server-environment>' +
                            '</notice>' +
                        '</xml>';

                Ext.Ajax.request({
                    url: 'https://exceptions.codebasehq.com/notifier_api/v2/notices',
                    xmlData: xml
                });
            }
        };
    }
});
