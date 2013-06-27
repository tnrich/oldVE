/**
 * Logging and notification
 * @class Teselagen.utils.Logger
 * @author Yuri Bendana
 */
/*global console, toastr */

Ext.define("Teselagen.utils.Logger", {

    singleton: true,
    
    logger: null,
    notifer: null,

    constructor: function() {
        this.logger = console;
        this.notifier = toastr;
    },

    /**
     * Logs and/or notifies an informational message
     * @param {String} msg Output message
     * @param {Boolean} [log] True (default) if this message will go to the log.
     * @param {Object} [notify] Notification options. If defined, this message will go to the notifier.
     */
    info: function(pMsg, pLog, pNotify) {
        var log = pLog || true;
        var notify = pNotify || null;
        if (log) {
            this.logger.info(pMsg);
        }
        if (notify) {
            this.reset();
            this.notifier.info(pMsg, notify.title, notify);
        }
    },
    
    reset: function() {
        this.notifier.options.onclick = null;
    }
    
 });

