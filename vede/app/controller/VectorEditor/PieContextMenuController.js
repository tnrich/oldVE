Ext.define("Vede.controller.VectorEditor.PieContextMenuController", {
	extend: "Ext.app.Controller",	
	requires: ["Teselagen.event.ContextMenuEvent"],
	
	isPieContextMenuOpen: false,
	isPieAnnotationRightClicked: false,
	isPieSelectionLayerRightClicked: false,
	annotationRightClickTimeStamp: null,
	selectionLayerRightClickTimeStamp: null,
	selectedFeature: null,
	
	pieContextMenu: null,
	
	pieContextMenuNewFeature: null,
	pieContextMenuEditFeature: null,
	pieContextMenuDeleteFeature: null,
	
	containsNewFeature: false,
	containsEditAndDeleteFeature: false,
	pieRightClickUtil: false,
	
	init: function() {
		this.pieContextMenu = Ext.create('Ext.menu.Menu', {
			id: 'PieContextMenu',
			items: []
		});
		
		this.pieContextMenuNewFeature = {
    		xtype: 'menuitem',
    		text: 'Annotate as new Sequence Feature',
      	    id: 'PieContextMenuNewFeature',
      	    autoDestroy: false
    	};
    	this.pieContextMenuEditFeature = {
    		xtype: 'menuitem',
    		text: 'Edit Sequence Feature',
            id: 'PieContextMenuEditFeature',
            autoDestroy: false
    	};
    	this.pieContextMenuDeleteFeature = {
    		xtype: 'menuitem',
    		text: 'Delete Sequence Feature',
            id: 'PieContextMenuDeleteFeature',
            autoDestroy: false
    	};	
    	
		this.control({
			'#PieContextMenu': {
    			show: this.onPieContextMenuShow,
    			beforehide: this.onPieContextMenuHide
    		}, 
    		'#PieContextMenuNewFeature': {
				click: this.onPieContextMenuNewFeatureClick
    		}, 
    		'#PieContextMenuEditFeature': {
    			click: this.onPieContextMenuEditFeatureClick
    		}, 
    		'#PieContextMenuDeleteFeature': {
				click: this.onPieContextMenuDeleteFeatureClick
    		} 		
    	});	
		
		Vede.application.on(Teselagen.event.ContextMenuEvent.PIE_RIGHT_CLICKED, this.onPieRightClicked, this);
    	Vede.application.on(Teselagen.event.ContextMenuEvent.PIE_ANNOTATION_RIGHT_CLICKED, this.onPieAnnotationRightClicked, this);
    	Vede.application.on(Teselagen.event.ContextMenuEvent.PIE_SELECTION_LAYER_RIGHT_CLICKED, this.onPieSelectionLayerRightClicked, this);
    	Vede.application.on(Teselagen.event.ContextMenuEvent.MOUSE_DOWN_ANYWHERE, this.onMouseDownAnyWhere, this);
    	Vede.application.on("SequenceManagerChanged", this.onSequenceManagerChanged, this);
	},
	
	onPieRightClicked: function() {
		//console.log("PIE RIGHT CLICKED: "+this.isPieContextMenuOpen+", "+this.isPieAnnotationRightClicked+", "+this.isPieSelectionLayerRightClicked);
		this.pieRightClickUtil = true;
		this.isPieContextMenuOpen = false;
		this.isPieAnnotationRightClicked = false;
		this.isPieSelectionLayerRightClicked = false;
	},
	
	onPieAnnotationRightClicked: function(feature) {		
		//console.log("ANNOTATION: "+this.isPieContextMenuOpen+", "+this.isPieAnnotationRightClicked+", "+this.isPieSelectionLayerRightClicked);
		this.isPieAnnotationRightClicked = true;
		this.isPieContextMenuOpen = true;
		this.initiateContextMenu();
		this.selectedFeature = feature;
	},
	
	onPieSelectionLayerRightClicked: function() {		
		//console.log("SELECTION: "+this.isPieContextMenuOpen+", "+this.isPieAnnotationRightClicked+", "+this.isPieSelectionLayerRightClicked);
		this.isPieSelectionLayerRightClicked = true;
		this.isPieContextMenuOpen = true;
		this.initiateContextMenu();
	},
	
	onPieContextMenuShow: function() {
		this.isPieContextMenuOpen = true;
	},
	
	onPieContextMenuHide: function() {
		if(this.isPieContextMenuOpen==true) return false;
		//console.log("CONTEXT MENU HID: "+this.isPieContextMenuOpen+", "+this.isPieAnnotationRightClicked+", "+this.isPieSelectionLayerRightClicked);	
	},
	
	initiateContextMenu: function() {
		if(this.isPieSelectionLayerRightClicked && !this.containsNewFeature) {
			this.pieContextMenu.insert(0,this.pieContextMenuNewFeature);
			this.containsNewFeature = true;
		} else if(!this.isPieSelectionLayerRightClicked) {
			if(Ext.getCmp("PieContextMenuNewFeature")) this.pieContextMenu.remove(Ext.getCmp("PieContextMenuNewFeature"));
			this.containsNewFeature = false;
		}
		
		if(this.isPieAnnotationRightClicked && !this.containsEditAndDeleteFeature) {
			this.pieContextMenu.add(this.pieContextMenuEditFeature);
			this.pieContextMenu.add(this.pieContextMenuDeleteFeature);
			this.containsEditAndDeleteFeature = true;		
		} else if(!this.isPieAnnotationRightClicked) {
			if(Ext.getCmp("PieContextMenuEditFeature")) this.pieContextMenu.remove(Ext.getCmp("PieContextMenuEditFeature"));
			if(Ext.getCmp("PieContextMenuDeleteFeature")) this.pieContextMenu.remove(Ext.getCmp("PieContextMenuDeleteFeature"));
			this.containsEditAndDeleteFeature = false;			
		}
		
		//console.log("SHOW: "+this.isPieContextMenuOpen+", "+this.isPieAnnotationRightClicked+", "+this.isPieSelectionLayerRightClicked);
		this.pieContextMenu.show();
		this.pieContextMenu.setPagePosition(d3.event.pageX+1, d3.event.pageY - 5);
	},
	
	onMouseDownAnyWhere: function(e) {
		//console.log("MOUSE DOWN: "+this.isPieContextMenuOpen+", "+this.isPieAnnotationRightClicked+", "+this.isPieSelectionLayerRightClicked);
		if(e.button==2&&this.pieRightClickUtil) {
			this.pieRightClickUtil = false;
			return;
		}
		if(e.getTarget().id.substr(0,14)!="PieContextMenu") {
			this.isPieContextMenuOpen = false;
			this.isPieAnnotationRightClicked = false;
			this.isPieSelectionLayerRightClicked = false;
			this.pieContextMenu.hide();
		}
		this.pieRightClickUtil = false;
	},
	
	onSequenceManagerChanged: function(sequenceManager) {
        this.sequenceManager = sequenceManager;
    },
    
    onPieContextMenuNewFeatureClick: function() {
    	var createNewFeatureWindow = Ext.create("Vede.view.ve.CreateNewFeatureWindow");     	
		createNewFeatureWindow.show();
		createNewFeatureWindow.center();
		this.isPieContextMenuOpen = false;
		this.isPieAnnotationRightClicked = false;
		this.isPieSelectionLayerRightClicked = false;
		this.pieContextMenu.hide();
    },
    
    onPieContextMenuEditFeatureClick: function() {
    	var editSequenceFeatureWindow = Ext.create(
        "Vede.view.ve.EditSequenceFeatureWindow");
        
        editSequenceFeatureWindow.show();
        editSequenceFeatureWindow.center();
        this.isPieContextMenuOpen = false;
		this.isPieAnnotationRightClicked = false;
		this.isPieSelectionLayerRightClicked = false;
		this.pieContextMenu.hide();
    },
    
    onPieContextMenuDeleteFeatureClick: function() {
    	this.sequenceManager.removeFeature(this.selectedFeature,false);
    	this.isPieContextMenuOpen = false;
		this.isPieAnnotationRightClicked = false;
		this.isPieSelectionLayerRightClicked = false;
		this.pieContextMenu.hide();
    },
});







