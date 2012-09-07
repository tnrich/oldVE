
/**
 * @class Teselagen.utils.DeXmlUtils
 * @author Diana Wong
 */

Ext.define("Teselagen.utils.DeXmlUtils", {


    requires: [
        "Teselagen.bio.util.StringUtil",
        "Teselagen.bio.util.XmlToJson"
    ],

    singleton: true,
    constructor: function() {
        XmlToJson = Teselagen.bio.util.XmlToJson;
    },


    /**
     * 
     */
     deXmlToJson: function(xmlStr) {

        var json = XmlToJson.xml_str2json(xmlStr);

        return json;
     }


});