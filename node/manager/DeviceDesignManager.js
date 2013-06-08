/*global module*/

/**
 * Device Design Manager
 * @module ./manager/DeviceDesignManager
 * @author Yuri Bendana
 */

module.exports = function() {

    /**
     * @constructor
     * @param db database connection
     */
    function DeviceDesignManager(pDb) {
        this.db = pDb;
        this.DeviceDesign = this.db.model("devicedesign");
    }

   /**
     * Delete all designs
     */
    DeviceDesignManager.prototype.deleteAll = function(pNext) {
        this.DeviceDesign.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return DeviceDesignManager;
};
