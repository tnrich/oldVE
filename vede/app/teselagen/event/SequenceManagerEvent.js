/**
 * SequenceManager events.
 * @author Diana Wong
 * @author Zinovii Dmytriv (original author of SequenceProviderEvent.as)
 */

Ext.define("Teselagen.event.SequenceManagerEvent", {
    singleton: true,


    // Events with listeners
    SEQUENCE_MANAGER_CHANGED: "SequenceManagerChanged",
    SEQUENCE_CHANGING: "SequenceChanging",
    SEQUENCE_CHANGED: "SequenceChanged",

    // Flags for the events. There should be no listeners on these.
    KIND_FEATURE_ADD: "FeatureAddSequenceProviderEvent",
    KIND_FEATURE_REMOVE: "FeatureRemoveSequenceProviderEvent",
    KIND_FEATURES_ADD: "FeaturesAddSequenceProviderEvent",
    KIND_FEATURES_REMOVE: "FeaturesRemoveSequenceProviderEvent",
    KIND_SEQUENCE_INSERT: "SequenceInsertSequenceProviderEvent",
    KIND_SEQUENCE_REMOVE: "SequenceRemoveSequenceProviderEvent",
    KIND_MANUAL_UPDATE: "ManualUpdate",
    KIND_SET_MEMENTO: "SetMemento",
    KIND_INITIALIZED: "SequenceInitialized",

    // not needed
    //NEEDS_RECALCULATE_COMPLEMENT_SEQUENCE: "RecalculateComplementSequence",
    // NEEDS_RECALCULATE_REVERSE_COMPLEMENT_SEQUENCE: "RecalculateReverseComplementSequence"

});
