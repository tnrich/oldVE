Ext.define('Vede.controller.AnnotatePanelController', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.manager.SequenceManagerEvent"],

    constructor: {
        updateSequenceChanged: Teselagen.manager.SequenceManagerEvent.SEQUENCE_CHANGED,
        updateSequenceChanging:     Teselagen.manager.SequenceManagerEvent.SEQUENCE_CHANGING,
        //updateKindFeatureAdd:       Teselagen.manager.SequenceManagerEvent.KIND_FEATURE_ADD,
        //updateKindFeatureRemove:    Teselagen.manager.SequenceManagerEvent.KIND_FEATURE_REMOVE,
        //updateKindFeaturesAdd:      Teselagen.manager.SequenceManagerEvent.KIND_FEATURES_ADD,
        //updateKindFeaturesRemove:   Teselagen.manager.SequenceManagerEvent.KIND_FEATURES_REMOVE,
        //updateKindSequenceInsert:   Teselagen.manager.SequenceManagerEvent.KIND_SEQUENCE_INSERT,
        //updateKindSequenceRemove:   Teselagen.manager.SequenceManagerEvent.KIND_SEQUENCE_REMOVE,
        //updateKindKManualUpdate:    Teselagen.manager.SequenceManagerEvent.KIND_MANUAL_UPDATE,
        //updateKindSetMeento:        Teselagen.manager.SequenceManagerEvent.KIND_SET_MEMENTO,
        //updateKindInitialized:      Teselagen.manager.SequenceManagerEvent.KIND_INITIALIZED,
    }


    onLaunch: function() {
        var ap = Ext.getCmp('AnnotatePanel');
        var box = Ext.create('Ext.draw.Sprite',{
            type: 'rect',
            fill: '#79BB3F',
            width: 100,
            height: 30,
            x: 10,
            y: 10,
            listeners: {
                //click: this.onClickPie
            }
        });
        
        var drawComponent2 = Ext.create('Ext.draw.Component', {
            items: [box]
        });
        ap.add(drawComponent2);
        console.log(ap);
        
    }

});
