/**
 * @class Vede.controller.VectorEditor.StatusBarController
 * Handles the rendering of the VE status bar.
 * NOTE: Uses setHTML on text display elements. Using this instead of setText
 * avoids (extremely) expensive layout runs every time the text is updated. It
 * also means we must set each text field to a fixed width, as their widths are
 * not adjusted automatically when using setHTML.
 */
Ext.define("Vede.controller.VectorEditor.StatusBarController", {
    extend: "Ext.app.Controller",

    requires: [
        "Teselagen.event.SelectionEvent",
        "Teselagen.event.SequenceManagerEvent",
        "Teselagen.bio.sequence.DNATools",
        "Teselagen.bio.tools.TemperatureCalculator"
    ],

    DNATools: null,
    SequenceManager: null,
    StatusPanel: null,
    TemperatureCalculator: null,

    CaretEvent: null,
    SelectionEvent: null,
    SequenceManagerEvent: null,

    caretPositionText: null,
    permissionText: null,
    sequenceLengthText: null,

    onTabChange: function(mainAppPanel, newTab, oldTab) {
        if(newTab.initialCls === "VectorEditorPanel") {
            this.StatusPanel = newTab.down("component[cls='VectorEditorStatusPanel']");
            this.caretPositionText = this.StatusPanel.down("tbtext[cls='caretPositionText']");
            this.meltingTemperatureText = this.StatusPanel.down("tbtext[cls='meltingTemperatureText']");
            this.permissionText = this.StatusPanel.down("tbtext[cls='permissionText']");
            this.selectionPositionText = this.StatusPanel.down("tbtext[cls='selectionPositionText']");
            this.sequenceLengthText = this.StatusPanel.down("tbtext[cls='sequenceLengthText']");

            this.onSequenceManagerChanged(newTab.model);
        }
    },

    init: function() {
        this.DNATools = Teselagen.bio.sequence.DNATools;
        this.TemperatureCalculator = Teselagen.bio.tools.TemperatureCalculator;

        this.CaretEvent = Teselagen.event.CaretEvent;
        this.SelectionEvent = Teselagen.event.SelectionEvent;
        this.SequenceManagerEvent = Teselagen.event.SequenceManagerEvent;

        this.control({
            "#mainAppPanel": {
                tabchange: this.onTabChange
            }
        });

        this.application.on(Teselagen.event.SequenceManagerEvent.SEQUENCE_MANAGER_CHANGED, 
                            this.onSequenceManagerChanged, this);

        this.application.on(this.CaretEvent.CARET_POSITION_CHANGED,
                            this.onCaretPositionChanged, this);

        this.application.on(this.SelectionEvent.SELECTION_CHANGED,
                            this.onSelectionChanged, this);

        this.application.on(this.SelectionEvent.SELECTION_CANCELED,
                            this.onSelectionCanceled, this);

        this.application.on(this.SequenceManagerEvent.SEQUENCE_CHANGED,
                            this.onSequenceChanged, this);
    },

    reset: function() {
        this.sequenceLengthText.el.setHTML(
                        this.SequenceManager.getSequence().toString().length);

        this.caretPositionText.el.setHTML("0");

        this.permissionText.el.setHTML("Editable");
        this.permissionText.el.setStyle("top", "0px");

        this.onSelectionCanceled();
        this.onSequenceChanged();
    },

    onSequenceManagerChanged: function(newSeqMan) {
        this.SequenceManager = newSeqMan;
        this.reset();
    },
    
    onCaretPositionChanged: function(scope, index) {
        var stringIndex = index.toString();

        if(this.caretPositionText.el.getHTML() !== stringIndex) {
            this.caretPositionText.el.setHTML(stringIndex);
        }
    },

    onSelectionChanged: function(scope, start, end) {
        if(start != end) {
            var selection;
            var selectionLength;
            var selectionLabelText;
            var meltingTemperature;

            selection = this.SequenceManager.getSequence().toString().substr(start, end);

            if(start < end) {
                selectionLength = end - start;
            } else {
                selectionLength = this.SequenceManager.getSequence().toString()
                                                        .length + end - start;
            }

            selectionLabelText = [start + 1, " : ", end, " (", selectionLength, ")"].join("");

            this.selectionPositionText.el.setHTML(selectionLabelText);

            var self = this;

            // With large sequences, calculating the melting temperature takes a
            // long time, adding lag to the app when selecting. This code will
            // only calculate the temperature if the selection doesn't change
            // for 500 milliseconds.
            clearTimeout(this.tempTimeout);

            this.tempTimeout = setTimeout(function() {
                meltingTemperature = self.TemperatureCalculator.calculateTemperature(selection);
                
                if(meltingTemperature > 0) {
                    self.meltingTemperatureText.el.setHTML(meltingTemperature.toFixed(2) + "&deg;C");
                    self.meltingTemperatureText.el.setStyle("top", "1px");
                }
            }, 500);
        }
    },

    onSelectionCanceled: function() {
        this.selectionPositionText.el.setHTML("- : -");
        this.meltingTemperatureText.el.setHTML("");
        this.meltingTemperatureText.el.setStyle("top", "1px");
    },

    onSequenceChanged: function() {
        this.sequenceLengthText.el.setHTML(
            this.SequenceManager.getSequence().toString().length);
    }
});
