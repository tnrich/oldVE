Ext.define("Vede.controller.VectorEditor.CreateNewFeatureWindowController", {
    extend: "Ext.app.Controller",
    
    sequenceManager: null,
    
    onWindowShow: function() {
    	Ext.getCmp("createNewFeatureWindowPositiveCheckBox").setValue(true);
    	var typeBox = Ext.getCmp("createNewFeatureWindowTypeComboBox");
    	typeBox.setValue('misc_feature');
    	
    	var grid = Ext.getCmp("createNewFeatureWindowAttributesGridPanel");
    	grid.numberOfLines = grid.getStore().getCount();
    	
    	var seqLen = this.sequenceManager.getSequence().toString().length;
    	if(seqLen==0) seqLen=1;
    	Ext.getCmp("createNewFeatureWindowStartField").setMaxValue(seqLen);
    	Ext.getCmp("createNewFeatureWindowEndField").setMaxValue(seqLen);
    },
    
    onSequenceManagerChanged: function(sequenceManager) {
        this.sequenceManager = sequenceManager;
    },
    
    editAttributes: function(editor, e) {
    	var grid = Ext.getCmp("createNewFeatureWindowAttributesGridPanel");
    	if(e.column.dataIndex=='key') {
    		if(e.value!=e.originalValue && e.originalValue=='' && e.record.data.value=='' && (grid.numberOfLines-1)==e.rowIdx) {
    	    	grid.numberOfLines++;
    	    	grid.store.add({key: '', value: ''});
    		}
    	} else if(e.column.dataIndex=='value') {
    		if(e.value!=e.originalValue && e.originalValue=='' && e.record.data.key=='' && (grid.numberOfLines-1)==e.rowIdx) {
    	    	grid.numberOfLines++;
    	    	grid.store.add({key: '', value: ''});
    		}
    	}
    },
    
    onOKButtonClick: function() {
    	var nameField = Ext.getCmp("createNewFeatureWindowNameField");
    	var name = nameField.getValue();
    	var strand = Ext.getCmp("createNewFeatureWindowStrandRadioGroup").getValue().strandSelector;
    	var type = Ext.getCmp("createNewFeatureWindowTypeComboBox").getValue();
    	var start = Ext.getCmp("createNewFeatureWindowStartField").getValue();
    	var end = Ext.getCmp("createNewFeatureWindowEndField").getValue();
    	if(name==null || name.match(/^\s*$/) || name.length==0) {
    		nameField.setFieldStyle("border-color:red");
    	} else {
    		var grid = Ext.getCmp("createNewFeatureWindowAttributesGridPanel");
    		var featureNotes = new Array();
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

    
    init: function() {
    	this.control({
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
    			blur: this.startFieldBlur
    		},
    		'#createNewFeatureWindowEndField': {
    			blur: this.endFieldBlur
    		}
    	});
    	this.application.on("SequenceManagerChanged", 
                this.onSequenceManagerChanged, this);
    }    
});


