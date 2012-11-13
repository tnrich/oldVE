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
     * @param {String} url The url from which to retrieve data.
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
     },


     /**
      * Write a string to file.
      * Requires BlobBuilder.js and FileSaver.js.
      *
      * @param {String} text
      * @returns {}
      */
    writeFile: function(pText, pFilename) {
        var bb = new BlobBuilder();
        bb.append(pText);
        saveAs(bb.getBlob("text/plain;charset=utf-8"), pFileName);
    }

 });

