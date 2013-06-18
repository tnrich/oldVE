Ext.define("Vede.controller.VectorEditor.EditSequenceFeatureWindowController", {
	extend: "Ext.app.Controller",
	
	requires: ["Teselagen.event.ContextMenuEvent"],
               
	actionStackManager: null,
    sequenceManager: null,
    selectedStart: null,
    selectedEnd: null,
    selectedFeature: null,
    
    onSequenceManagerChanged: function(sequenceManager) {
        this.sequenceManager = sequenceManager;
    },
    
    onActionStackManagerChanged: function(actionStackManager) {
        this.actionStackManager = actionStackManager;
    },
    
    onSelectionChanged: function(scope, start, end) {	
    	this.selectedStart = start;
    	this.selectedEnd = end;   	
    },
    
    onWindowShow: function() {	
    	var seqLen = this.sequenceManager.getSequence().toString().length;
    	if(seqLen==0) seqLen=1;
    	Ext.getCmp("editSequenceFeatureWindowStartField").setMaxValue(seqLen);
    	Ext.getCmp("editSequenceFeatureWindowEndField").setMaxValue(seqLen);
    	
    	Ext.getCmp('editSequenceFeatureWindowNameField').setValue(this.selectedFeature.getName());
    	
    	var strand = this.selectedFeature.getStrand(); 
    	if(strand==1) Ext.getCmp("editSequenceFeatureWindowPositiveCheckBox").setValue(true);
    	else if(strand==-1) Ext.getCmp("editSequenceFeatureWindowNegativeCheckBox").setValue(true);
    	
    	Ext.getCmp('editSequenceFeatureWindowTypeComboBox').setValue(this.selectedFeature.getType());
    	Ext.getCmp('editSequenceFeatureWindowStartField').setValue(this.selectedFeature.getStart()+1);
    	Ext.getCmp('editSequenceFeatureWindowEndField').setValue(this.selectedFeature.getEnd());
    	
    	// Not sure about the significance of featureNotes.quoted
    	var featureNotes = this.selectedFeature.getNotes();
    	var grid = Ext.getCmp('editSequenceFeatureWindowAttributesGridPanel');
    	grid.store.removeAll();
    	for(var i=0;i<featureNotes.length;i++) {
    		grid.store.add({key: featureNotes[i].getName(), value: featureNotes[i].getValue()});
    	}
    	grid.numberOfLines = featureNotes.length+1;
    	if (featureNotes.length<4) {
    		for(var i=0;i<4-featureNotes.length;i++) {
    			grid.store.add({key: '', value: ''});
    		}
    	} else {
    		grid.store.add({key: '', value: ''});
    	}
    },
    
    editAttributes: function(editor, e) {
    	var grid = Ext.getCmp("editSequenceFeatureWindowAttributesGridPanel");
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
    
    onPieAnnotationRightClicked: function(feature) {
    	this.selectedFeature = feature;
    	this.selectedStart = feature.getStart();
    	this.selectedEnd = feature.getEnd();
    },
    
    startFieldBlur: function() {
    	if(!Ext.getCmp("editSequenceFeatureWindowStartField").isValid()) {
    		var value = Ext.getCmp("editSequenceFeatureWindowStartField").getValue();
	    	var seqLen = this.sequenceManager.getSequence().toString().length;
	    	if(seqLen==0) seqLen=1;
	    	if(value>seqLen) Ext.getCmp("editSequenceFeatureWindowStartField").setValue(seqLen);
	    	else if(value==0) Ext.getCmp("editSequenceFeatureWindowStartField").setValue(1);
	    	else if(value==null) Ext.getCmp("editSequenceFeatureWindowStartField").setValue(1);
	    	else Ext.getCmp("editSequenceFeatureWindowStartField").setValue(1);	    	
    	}   	
    },
    startFieldChange: function() {
    	this.application.fireEvent(Teselagen.event.SelectionEvent.SELECTION_CHANGED,this,Ext.getCmp("editSequenceFeatureWindowStartField").getValue()-1,this.selectedEnd);  
    },
    endFieldBlur: function() {
    	if(!Ext.getCmp("editSequenceFeatureWindowEndField").isValid()) {
    		var value = Ext.getCmp("editSequenceFeatureWindowEndField").getValue();
	    	var seqLen = this.sequenceManager.getSequence().toString().length;
	    	if(seqLen==0) seqLen=1;
	    	if(value>seqLen) Ext.getCmp("editSequenceFeatureWindowEndField").setValue(seqLen);
	    	else if(value==0) Ext.getCmp("editSequenceFeatureWindowEndField").setValue(1);
	    	else if(value==null) Ext.getCmp("editSequenceFeatureWindowEndField").setValue(1);
	    	else Ext.getCmp("editSequenceFeatureWindowEndField").setValue(1);	    	
    	}  	
    },
    endFieldChange: function() {
    	this.application.fireEvent(Teselagen.event.SelectionEvent.SELECTION_CHANGED,this,this.selectedStart,Ext.getCmp("editSequenceFeatureWindowEndField").getValue());
    },
    
    onEditSequenceFeatureWindowDeleteButton: function() {  	
    	this.sequenceManager.removeFeature(this.selectedFeature,false);
    	Ext.getCmp("EditSequenceFeature").close();
    },
    
    onEditSequenceFeatureWindowOKButtonClick: function() {    	
    	var nameField = Ext.getCmp("editSequenceFeatureWindowNameField");
    	var name = nameField.getValue();
    	var strand = Ext.getCmp("editSequenceFeatureWindowStrandRadioGroup").getValue().strandSelector;
    	var type = Ext.getCmp("editSequenceFeatureWindowTypeComboBox").getValue();
    	var start = Ext.getCmp("editSequenceFeatureWindowStartField").getValue()-1;
    	var end = Ext.getCmp("editSequenceFeatureWindowEndField").getValue();
    	if(name==null || name.match(/^\s*$/) || name.length==0) {
    		nameField.setFieldStyle("border-color:red");
    	} else {
    		var grid = Ext.getCmp("editSequenceFeatureWindowAttributesGridPanel");
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
    		
    		//Feature removed and added this way so that "undo" and "redo" works properly.
    		var memento = this.sequenceManager.createMemento();  		
    		this.sequenceManager.removeFeature(this.selectedFeature,true);
            Vede.application.fireEvent(this.sequenceManager.updateSequenceChanging, this.sequenceManager.updateKindFeatureAdd, memento);
            this.sequenceManager.features.push(newFeature);
            Vede.application.fireEvent(this.sequenceManager.updateSequenceChanged, this.sequenceManager.updateKindFeatureAdd, newFeature);
	    	Ext.getCmp("EditSequenceFeature").close();
    	}
    },
    
    init: function() {
    	this.control({   		
    		'#EditSequenceFeature': {
    			show: this.onWindowShow
    		},
    		'#editSequenceFeatureWindowAttributesGridPanel': {
    			validateedit: this.editAttributes
    		},
    		'#editSequenceFeatureWindowOKButton': {
    			click: this.onEditSequenceFeatureWindowOKButtonClick
    		},
    		'#editSequenceFeatureWindowStartField': {
    			blur: this.startFieldBlur,
    			change: this.startFieldChange
    		},
    		'#editSequenceFeatureWindowEndField': {
    			blur: this.endFieldBlur,
    			change: this.endFieldChange
    		}
    	});
    	this.application.on("SequenceManagerChanged", 
                this.onSequenceManagerChanged, this);
    	this.application.on(Teselagen.event.ContextMenuEvent.PIE_ANNOTATION_RIGHT_CLICKED, 
                this.onPieAnnotationRightClicked, this);
    	this.application.on("VectorPanelAnnotationContextMenu", 
                this.onPieAnnotationRightClicked, this);
    	this.application.on("ActionStackChanged", 
                this.onActionStackManagerChanged, this);
    }

});