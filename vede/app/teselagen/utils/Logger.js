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
     * Logs and notifies an informational message
     * @param {String} msg Output message
     * @param {Object} [notify] Notification options. If defined, this message will go to the notifier.
     */
    info: function(pMsg, pNotify) {
        this.logInfo(pMsg);
        this.notifyInfo(pMsg, pNotify);
    },
    
    /**
     * Logs an informational message
     * @param {String} msg Output message
     */
    logInfo: function(pMsg) {
        this.logger.info(pMsg);
    },
    
    /**
     * Notifies an informational message
     * @param {String} msg Output message
     * @param {Object} [opts] Notification options.
     */
    notifyInfo: function(pMsg, pOpts) {
        var opts = pOpts || {};
        this.reset();
        this.notifier.info(pMsg, opts.title, opts);
    },

    /**
     * Logs and notifies a warning
     * @param {String} msg Output message
     * @param {Object} [notify] Notification options. If defined, this message will go to the notifier.
     */
    warn: function(pMsg, pNotify) {
        this.logWarn(pMsg);
        this.notifyWarn(pMsg, pNotify);
    },
    
    /**
     * Logs a warning
     * @param {String} msg Output message
     */
    logWarn: function(pMsg) {
        this.logger.warn(pMsg);
    },
    
    /**
     * Notifies a warning
     * @param {String} msg Output message
     * @param {Object} [opts] Notification options.
     */
    notifyWarn: function(pMsg, pOpts) {
        var opts = pOpts || {};
        this.reset();
        this.notifier.warning(pMsg, opts.title, opts);
    },

    /**
     * Logs and notifies an error
     * @param {String} msg Output message
     * @param {Object} [notify] Notification options. If defined, this message will go to the notifier.
     */
    error: function(pMsg, pNotify) {
        this.logError(pMsg);
        this.notifyError(pMsg, pNotify);
    },
    
    /**
     * Logs an error
     * @param {String} msg Output message
     */
    logError: function(pMsg) {
        this.logger.error(pMsg);
    },
    
    /**
     * Notifies an error
     * @param {String} msg Output message
     * @param {Object} [opts] Notification options.
     */
    notifyError: function(pMsg, pOpts) {
        var opts = pOpts || {};
        this.reset();
        this.notifier.error(pMsg, opts.title, opts);
    },

    /**
     * Reset the notifier
     */
    reset: function() {
        this.notifier.options.onclick = null;
    }
    
 });

