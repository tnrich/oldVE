/**
 * Operating system utilities
 * @class Teselagen.utils.SystemUtils
 */
Ext.define("Teselagen.utils.SystemUtils",{
    singleton: true,
    
    getSystemMonospaceFontFamily: function() {
        var resultFont = "Courier New";

        if(this.isWindowsOS()) {
            resultFont = "Lucida Console";
        } else if(this.isLinuxOS()) {
            resultFont = "Monospace";
        } else if(this.isMacOS()) {
            resultFont = "Monaco";
        }

        return resultFont;
    },

    isWindowsOS: function() {
        return navigator.platform.indexOf("Win") != -1;
    }, 

    isLinuxOS: function() {
        return navigator.platform.indexOf("Linux") != -1;
    },

    isMacOS: function() {
        return navigator.platform.indexOf("Mac") != -1;
    },

    goToUrl: function(url) {
        window.open(url)
    },

    applicationVersion: function(majorVersion) {
        var versionDate = new Date();
        var version = majorVersion + 
            "." + String(versionDate.getFullYear()).substr(2, 2) +
            "." + String(versionDate.getMonth() + 1) + 
            "." + String(versionDate.getDate());
        
        return version;
    }
});
