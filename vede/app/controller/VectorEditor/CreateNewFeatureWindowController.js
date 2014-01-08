Ext.define("Vede.controller.VectorEditor.CreateNewFeatureWindowController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.SequenceManagerEvent"],

    sequenceManager: null,
    selectedStart: null,
    selectedEnd: null,

    onWindowShow: function() {
        Ext.getCmp("createNewFeatureWindowPositiveCheckBox").setValue(true);
        var typeBox = Ext.getCmp("createNewFeatureWindowTypeComboBox");
        typeBox.setValue('misc_feature');

        var grid = Ext.getCmp("createNewFeatureWindowAttributesGridPanel");

        var seqLen = this.sequenceManager.getSequence().toString().length;
        if(seqLen==0) seqLen=1;
        Ext.getCmp("createNewFeatureWindowStartField").setMaxValue(seqLen);
        Ext.getCmp("createNewFeatureWindowEndField").setMaxValue(seqLen);

        if (this.selectedStart) {
            Ext.getCmp("createNewFeatureWindowStartField").setValue(this.selectedStart+1);
        }
        if (this.selectedEnd) {
           Ext.getCmp("createNewFeatureWindowEndField").setValue(this.selectedEnd);
        }
    },

    onSequenceManagerChanged: function(sequenceManager) {
        this.sequenceManager = sequenceManager;
    },

    onSelectionChanged: function(scope, start, end) {
        this.selectedStart = start;
        this.selectedEnd = end;
    },

    editAttributes: function(editor, e) {
        var grid = Ext.getCmp("createNewFeatureWindowAttributesGridPanel");
        if(e.column.dataIndex=='key') {
            if(e.value!=e.originalValue && e.originalValue=='' && e.record.data.value=='' && (grid.numberOfLines-1)==e.rowIdx) {
                grid.numberOfLines++;
                if (grid.numberOfLines>4) grid.store.add({key: '', value: ''});
            }
        } else if(e.column.dataIndex=='value') {
            if(e.value!=e.originalValue && e.originalValue=='' && e.record.data.key=='' && (grid.numberOfLines-1)==e.rowIdx) {
                grid.numberOfLines++;
                if (grid.numberOfLines>4) grid.store.add({key: '', value: ''});
            }
        }
    },

    onOKButtonClick: function() {
        var nameField = Ext.getCmp("createNewFeatureWindowNameField");
        var name = nameField.getValue();
        var strand = Ext.getCmp("createNewFeatureWindowStrandRadioGroup").getValue().strandSelector;
        var type = Ext.getCmp("createNewFeatureWindowTypeComboBox").getValue();
        var start = Ext.getCmp("createNewFeatureWindowStartField").getValue()-1;
        var end = Ext.getCmp("createNewFeatureWindowEndField").getValue();
        if(!name || name.match(/^\s*$/) || name.length === 0) {
            nameField.setFieldStyle("border-color:red");
        } else {
            var grid = Ext.getCmp("createNewFeatureWindowAttributesGridPanel");
            var featureNotes = [];

            for (var i=0;i<grid.numberOfLines;i++) {
                var record = grid.store.getAt(i);
                var key = record.get('key');
                var value = record.get('value');
                if (!(key==null || key.length==0 || key.match(/^\s*$/)) || !(value==null || value.length==0 || value.match(/^\s*$/))) { // Change depending on restrictions on Notes
                    var newFeatureNote = Ext.create("Teselagen.bio.sequence.dna.FeatureNote",{
                        name: key,
                        value: value
                    });
                    featureNotes.push(newFeatureNote);
                }
            }

            var newFeature = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                name: name,
                type: type,
                start: start,
                end: end,
                strand: strand,
                notes: featureNotes
            });

            this.sequenceManager.addFeature(newFeature);
            Ext.getCmp("CreateNewFeature").close();
            Vede.application.fireEvent('rerenderFeaturesGrid');
            Vede.application.fireEvent('toggleFeatureEditOptions');
        }
    },

    startFieldBlur: function() {
        if(!Ext.getCmp("createNewFeatureWindowStartField").isValid()) {
            var value = Ext.getCmp("createNewFeatureWindowStartField").getValue();
            var seqLen = this.sequenceManager.getSequence().toString().length;
            if(seqLen==0) seqLen=1;
            if(value>seqLen) Ext.getCmp("createNewFeatureWindowStartField").setValue(seqLen);
            else if(value==0) Ext.getCmp("createNewFeatureWindowStartField").setValue(1);
            else if(value==null) Ext.getCmp("createNewFeatureWindowStartField").setValue(1);
            else Ext.getCmp("createNewFeatureWindowStartField").setValue(1);
        }
    },
    startFieldChange: function() {
        this.application.fireEvent(Teselagen.event.SelectionEvent.SELECTION_CHANGED,this,Ext.getCmp("createNewFeatureWindowStartField").getValue()-1,this.selectedEnd);
    },
    endFieldBlur: function() {
        if(!Ext.getCmp("createNewFeatureWindowEndField").isValid()) {
            var value = Ext.getCmp("createNewFeatureWindowEndField").getValue();
            var seqLen = this.sequenceManager.getSequence().toString().length;
            if(seqLen==0) seqLen=1;
            if(value>seqLen) Ext.getCmp("createNewFeatureWindowEndField").setValue(seqLen);
            else if(value==0) Ext.getCmp("createNewFeatureWindowEndField").setValue(1);
            else if(value==null) Ext.getCmp("createNewFeatureWindowEndField").setValue(1);
            else Ext.getCmp("createNewFeatureWindowEndField").setValue(1);
        }
    },
    endFieldChange: function() {
        this.application.fireEvent(Teselagen.event.SelectionEvent.SELECTION_CHANGED,this,this.selectedStart,Ext.getCmp("createNewFeatureWindowEndField").getValue());
    },

    onTabChange: function(mainAppPanel, newTab) {
        if(newTab.initialCls === "VectorEditorPanel") {
            this.onSequenceManagerChanged(newTab.model);
        }
    },

    init: function() {
        this.SequenceManagerEvent = Teselagen.event.SequenceManagerEvent;

        this.control({
            '#mainAppPanel': {
                tabchange: this.onTabChange
            },
            '#createNewFeatureWindowAttributesGridPanel': {
                validateedit: this.editAttributes
            },
            '#createNewFeatureWindowOKButton': {
                click: this.onOKButtonClick
            },
            '#CreateNewFeature': {
                show: this.onWindowShow
            },
            '#createNewFeatureWindowStartField': {
                blur: this.startFieldBlur,
                change: this.startFieldChange
            },
            '#createNewFeatureWindowEndField': {
                blur: this.endFieldBlur,
                change: this.endFieldChange
            }
        });
        this.application.on(this.SequenceManagerEvent.SEQUENCE_MANAGER_CHANGED,
                this.onSequenceManagerChanged, this);
        this.application.on(Teselagen.event.SelectionEvent.SELECTION_CHANGED,
                this.onSelectionChanged,this);
    }
});


