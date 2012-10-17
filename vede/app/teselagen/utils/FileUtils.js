/**
 * @class Teselagen.utils.FileUtils
 *
 * 
 *
 * @author Diana Wong
 */

Ext.define("Teselagen.utils.FileUtils", {

	singleton: true,

    requires: [
    	"Ext.Ajax"
    ],


    /**
     * Loads a file using an Ajax request, synchronously.
     * @param {String} url The url to retrieve data from.
     * Uses a synchronus Ajax request.
     * @param {String} url Url path to file
     * @returns {String} file as a string
     */
    loadFile: function(url) {

        var str;

        Ext.Ajax.request({
            url: url,
            async: false,
            disableCaching: true,
            success: function(response) {
                str = response.responseText;
            },
            failure: function(response, opts) {
                console.warn('Could not load: ' + url + '\nServer-side failure with status code ' + response.status);
                throw Ext.create("Teselagen.bio.BioException", {
                    message: 'Could not load: ' + url + '\nServer-side failure with status code ' + response.status
                });
            }
        });
        return str;
     }

 });

