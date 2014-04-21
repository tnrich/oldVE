/**
 * Operating system utilities
 * @class Teselagen.utils.SystemUtils
 */
Ext.define("Teselagen.utils.SystemUtils",{
    singleton: true,
    
    loadJs: function(url,cb){
      var script = document.createElement('script');
      script.setAttribute('src', url);
      script.setAttribute('type', 'text/javascript');
     
      var loaded = false;
      var loadFunction = function () {
        if (loaded) return;
        loaded = true;
        cb & cb();
      };
      script.onload = loadFunction;
      script.onreadystatechange = loadFunction;
      document.getElementsByTagName("head")[0].appendChild(script);
    },

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
    },

    getBaseURL: function () {
    var url = location.href;  // entire url including querystring - also: window.location.href;
    var baseURL = url.substring(0, url.indexOf('/', 14));


    if (baseURL.indexOf('http://localhost') != -1) {
        // Base Url for localhost
        var url = location.href;  // window.location.href;
        var pathname = location.pathname;  // window.location.pathname;
        var index1 = url.indexOf(pathname);
        var index2 = url.indexOf("/", index1 + 1);
        var baseLocalUrl = url.substr(0, index2);

        return baseLocalUrl + "/";
    }
    else {
        // Root Url for domain name
        return baseURL + "/";
    }

    }
});
