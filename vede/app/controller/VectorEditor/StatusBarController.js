/**
 * @class Vede.controller.VectorEditor.StatusBarController
 * Handles the rendering of the VE status bar.
 */
Ext.define("Vede.controller.VectorEditor.StatusBarController", {
    extend: "Ext.app.Controller",

    requires: [
        "Teselagen.event.SelectionEvent",
        "Teselagen.event.SequenceManagerEvent",
        "Teselagen.bio.sequence.DNATools",
        "Teselagen.bio.tools.TemperatureCalculator",
    ],

    DNATools: null,
    SequenceManager: null,
    StatusPanel: null,
    TemperatureCalculator: null,

    CaretEvent: null,
    SelectionEvent: null,
    SequenceManagerEvent: null,

    onLaunch: function() {
        this.StatusPanel = Ext.getCmp("VectorEditorStatusPanel");
    },

    init: function() {
        this.DNATools = Teselagen.bio.sequence.DNATools;
        this.TemperatureCalculator = Teselagen.bio.tools.TemperatureCalculator;

        this.CaretEvent = Teselagen.event.CaretEvent;
        this.SelectionEvent = Teselagen.event.SelectionEvent;
        this.SequenceManagerEvent = Teselagen.event.SequenceManagerEvent;

        this.application.on("SequenceManagerChanged", 
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
        this.StatusPanel.down("tbtext[cls='sequenceLengthText']").setText(
                        this.SequenceManager.getSequence().toString().length);

        this.StatusPanel.down("tbtext[cls='caretPositionText']").setText("0");

        this.onSelectionCanceled();
        this.onSequenceChanged();
    },

    onSequenceManagerChanged: function(newSeqMan) {
        this.SequenceManager = newSeqMan;

        this.reset();
    },
    
    onCaretPositionChanged: function(scope, index) {
        this.StatusPanel.down("tbtext[cls='caretPositionText']").setText(index.toString());
    },

    onSelectionChanged: function(scope, start, end) {
        if(start != end) {
            var selection;
            var selectionLength;
            var selectionLabelText;
            var meltingTemperature;

            selection = this.SequenceManager.subSequence(start, end).toString();

            if(start < end) {
                selectionLength = end - start;
            } else {
                selectionLength = this.SequenceManager.getSequence().toString()
                                                        .length + end - start;
            }

            selectionLabelText = [start + 1, " : ", end, " (", selectionLength, ")"].join("");

            this.StatusPanel.down("tbtext[cls='selectionPositionText']")
                .setText(selectionLabelText);

            meltingTemperature = this.TemperatureCalculator.calculateTemperature(
                this.DNATools.createDNASequence("selection", selection));

            if(meltingTemperature > 0) {
                this.StatusPanel.down("tbtext[cls='meltingTemperatureText']")
                    .setText(meltingTemperature.toFixed(2) + "&deg;C");
            }
        }
    },

    onSelectionCanceled: function() {
        this.StatusPanel.down("tbtext[cls='selectionPositionText']").setText("- : -");

        this.StatusPanel.down("tbtext[cls='meltingTemperatureText']").setText("");
    },

    onSequenceChanged: function() {
        this.StatusPanel.down("tbtext[cls='sequenceLengthText']").setText(
            this.SequenceManager.getSequence().toString().length);
    },
});
