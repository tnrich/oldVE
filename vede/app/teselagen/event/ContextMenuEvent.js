/**
 * @singleton
 * Events for firing and editing context menus. 
 * Events for when context menu items are clicked could be added here. 
 */
Ext.define("Teselagen.event.ContextMenuEvent", {
    singleton: true,
    
    MOUSE_DOWN_ANYWHERE: "MouseDownAnyWhere",
    
    
    // fired with feature as args
    PIE_ANNOTATION_RIGHT_CLICKED: "PieAnnotationRightClicked",

    PIE_SELECTION_LAYER_RIGHT_CLICKED: "PieSelectionLayerRightClicked",
    
    PIE_RIGHT_CLICKED: "PieRightClicked",
    
    PIE_NONRIGHT_MOUSE_DOWN: "PieNonrightMouseDown"
    
    
    
    //VectorPanelAnnotationContextMenu //look for more (like maybe in sequence panel context menus)   
    
});