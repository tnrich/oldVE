 Ext.define("Teselagen.manager.SequenceManagerEvent", {
    singleton: true,

    SEQUENCE_CHANGING: "SequenceChanging",
    SEQUENCE_CHANGED: "SequenceChanged",
        
    KIND_FEATURE_ADD: "FeatureAddSequenceProviderEvent",
    KIND_FEATURE_REMOVE: "FeatureRemoveSequenceProviderEvent",
    KIND_FEATURES_ADD: "FeaturesAddSequenceProviderEvent",
    KIND_FEATURES_REMOVE: "FeaturesRemoveSequenceProviderEvent",
    KIND_SEQUENCE_INSERT: "SequenceInsertSequenceProviderEvent",
    KIND_SEQUENCE_REMOVE: "SequenceRemoveSequenceProviderEvent",
        
    KIND_MANUAL_UPDATE: "ManualUpdate",
    KIND_SET_MEMENTO: "SetMemento",
        
    KIND_INITIALIZED: "SequenceInitialized"

});
