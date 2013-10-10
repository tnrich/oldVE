/**
 * @class Teselagen.utils.NameUtils
 */
Ext.define("Teselagen.utils.NameUtils", {
    singleton: true,

    /**
     * Determines if string is only alphanumeric with underscores "_" or hyphens "-".
     * (REFACTORED FROM DEVICEDESIGNMANAGER)
     * @param {String} pName
     * @returns {Boolean}
     */
    isLegalName: function(pName) {
        var str = pName.toString();
        if (str.match(/[^a-zA-Z0-9_\-]/) !== null) {
            return false;
        } else {
            return true;
        }
    },

    /**
     * Reformat name to be only alphanumeric with underscores "_" or hyphens "-".
     * Replaces special characters with underscores.
     *(REFACTORED FROM DEVICEDESIGNMANAGER)
     * @param {String} pName
     * @returns {String} New name.
     */
    reformatName: function(pName) {
        return pName.toString().replace(/[^a-zA-Z0-9_\-]/g, "_");
    }
});
