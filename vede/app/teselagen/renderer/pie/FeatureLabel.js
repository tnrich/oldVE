/**
 * @class Teselagen.renderer.pie.FeatureLabel
 * Class which generates labels for features in the pie view.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.renderer.pie.FeatureLabel", {
    extend: "Teselagen.renderer.common.Label",

    config: {
        center: null,
    },

    constructor: function(inData) {
        this.callParent(arguments);
        this.initConfig(inData);
    },

    labelText: function() {
        var label = [];

        // If the name is null or empty, iterate through notes and attempt to
        // find a suitable note to use as a label.
        if(!this.annotation.getName() || !this.StringUtil.trim(this.annotation.getName())) {
            var notes = this.annotation.getNotes();

            Ext.each(notes, function(note) {
                if(note.getName() == "label") {
                    label = note.getValue();
                    return false;
                } else if(note.getName() == "apeinfo_label" || 
                          note.getName() == "note" ||
                          note.getName() == "gene") {
                    label = note.getValue();
                }
            });
        } else {
            label = this.annotation.getName();
        }

        if(label == null) {
            label = "";
        }

        return label;
    }
});
