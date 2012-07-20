/**
 * SequenceManager
 * Main class that provides data to VectorPanel (Pie and Rail representations) and AnnotatePanel.
 * Based off SequenceProvider.as
 * @author Diana Wong
 * @author Zinovii Dmytriv (original author of SequenceProvider.as)
 */

Ext.define("Teselagen.manager.SequenceManager", {


    requires: ["Teselagen.bio.sequence.common.Location",
        "Teselagen.bio.sequence.common.SymbolList",
        "Teselagen.manager.SequenceManagerEvent",
        "Teselagen.bio.sequence.DNATools"
    ],
    /**
     * @cfg {Object} config
     * @cfg {String} name
     * @cfg {Teselagen.bio.sequence.dna.DNASequence} sequence
     */
    config: {
        name: null,
        circular: false,
        sequence: null,
        features: [],

        complementSequence: null,
        reverseComplementSequence: null,
        manualUpdateStarted: false,

        needsRecalculateComplementSequence: true,
        needsRecalculateReverseComplementSequence: true
    },

    DNATools: null,
    updateSequenceChanged: null, //     Teselagen.manager.SequenceManagerEvent.SEQUENCE_CHANGED,
    //updateSequenceChanging:     Teselagen.manager.SequenceManagerEvent.SEQUENCE_CHANGING,
    //updateKindFeatureAdd:       Teselagen.manager.SequenceManagerEvent.KIND_FEATURE_ADD,
    //updateKindFeatureRemove:    Teselagen.manager.SequenceManagerEvent.KIND_FEATURE_REMOVE,
    //updateKindFeaturesAdd:      Teselagen.manager.SequenceManagerEvent.KIND_FEATURES_ADD,
    //updateKindFeaturesRemove:   Teselagen.manager.SequenceManagerEvent.KIND_FEATURES_REMOVE,
    //updateKindSequenceInsert:   Teselagen.manager.SequenceManagerEvent.KIND_SEQUENCE_INSERT,
    //updateKindSequenceRemove:   Teselagen.manager.SequenceManagerEvent.KIND_SEQUENCE_REMOVE,
    //updateKindKManualUpdate:    Teselagen.manager.SequenceManagerEvent.KIND_MANUAL_UPDATE,
    //updateKindSetMeento:        Teselagen.manager.SequenceManagerEvent.KIND_SET_MEMENTO,
    //updateKindInitialized:      Teselagen.manager.SequenceManagerEvent.KIND_INITIALIZED,


    mixins: {
        observable: "Ext.util.Observable"
    },

    /**
     * @param {String} name
     * @param {Boolean} circular
     * @param {Teselagen.bio.sequence.common.SymbolList} sequence
     * @param {[Teselagen.bio.sequence.dna.Feature]} features
     * @returns {SequenceManager}
     * @memberOf SequenceManager
     * 
     */
    constructor: function(inData) {
        this.mixins.observable.constructor.call(this, inData);

        //DNATools: Teselagen.bio.sequence.DNATools,
        updateSequenceChanged: Teselagen.manager.SequenceManagerEvent.SEQUENCE_CHANGED,


        this.addEvents("SequenceChanged");
        //this.addEvents(this.updateSequenceChanged);


        if (inData) {
            this.name     = inData.name     || null;
            this.circular = inData.circular || false;
            this.sequence = inData.sequence || null;
            this.features = inData.features || [];
        }
        /**
         * @param {String} name
         */
        this.self.prototype.setName = function(pName) {
            this.manualUpdateStart();
            this.name = pName;
            this.manualUpdateEnd();
        }
        /**
         * @param {Boolean} circular
         */
        this.self.prototype.setCircular = function(pCircular) {
            this.manualUpdateStart();
            this.circular = pCircular;
            this.manualUpdateEnd();
        }
        /**
         * @param {Teselagen.bio.sequence.common.SymbolList} sequence
         */
        this.self.prototype.setSequence = function(pSequence) {
            needsRecalculateComplementSequence = true;
            needsRecalculateReverseComplementSequence = true;
            this.sequence = pSequence;
        }
        /**
         * @param {Teselagen.bio.sequence.dna.Feature} name
         */
        this.self.prototype.setFeatures = function(pFeatures) {
            this.features = pFeatures;
        }
    },

    /**
     * @param {Boolean} manualUpdateStarted Manual update event started 
     */
    getManualUpdateStarted:function() {
        return this.manualUpdateStarted;
    },

    /**
     * @returns {Teselagen.manager.SequenceManagerMemento} memento 
     */
    createMemento: function() {
        var clonedFeatures = [];

        if (this.features && this.features.length > 0) {
            for (var i=0; i< this.features.length; i++) {
                clonedFeatures.push(this.features[i].clone());
            }
        }
        var seq = Teselagen.bio.sequence.DNATools.createDNA(this.sequence.toString());
        //
        return Ext.create("Teselagen.manager.SequenceManagerMemento", {
            name:     this.name,
            circular: this.circular,
            sequence: seq,
            features: clonedFeatures
        });
    },

    /**
     * @params {Teselagen.manager.SequenceManagerMemento} memento 
     */
    setMemento: function(pMemento) {
        var sequenceManagerMemento = pMemento;

        //BUILD SequenceManagerMemento == SequenceProviderMemento class in lib/common
        this.name     = sequenceManagerMemento.name;
        this.circular = sequenceManagerMemento.circular;
        this.sequence = sequenceManagerMemento.sequence;
        this.features = sequenceManagerMemento.features;

        this.needsRecalculateComplementSequence = true;
        this.needsRecalculateReverseComplementSequence = true;

        //this.dispatcher;
    },

    // to AnnotatePanelController.js
    addEventListener: function(type, listener) {
        //dispatcher.addEventListener(type, listener);
    },
    // to AnnotatePanelController.js
    removeEventListener: function(type, listener) {
        //dispatcher.removeEventListener(type, listener);
    },
    // to AnnotatePanelController.js
    dispatchEvent: function(event) {
        //dispatcher.dispatchEvent(event);
    },

    /**
     * @returns {Teselagen.bio.sequence.common.SymbolList} complementSequence 
     */
    getComplementSequence: function() {
        this.updateComplementSequence();
        return this.complementSequence;
    },

    /**
     * @returns {Teselagen.bio.sequence.common.SymbolList} reverseComplementSequence 
     */
    getReverseComplementSequence: function() {
        this.updateReverseComplementSequence();
        return this.reverseComplementSequence;
    },

    /**
     * Sub sequence by range
     * @param {Number} start Range start
     * @param {Number} end Range end
     */
    subSequence: function(start, end) {
        var result = null;// = Ext.define("Teselagen.bio.sequence.common.SymbolList"); //SymbolList

        if(start < 0 || end < 0 || start > this.sequence.length || end > this.sequence.length) {
            return result;
        }
        //console.log("subsequence");
        if(start > end) {
            result = Teselagen.bio.sequence.DNATools.createDNA(this.sequence.subList(start, this.sequence.length).seqString() + this.sequence.subList(0, end).seqString());
        } else {
            result = this.sequence.subList(start, end);
        }

        return result;
    },

    /** THIS DOES NOT WORK YET
     * Sub sequence manager by range
     * @param {Number} start Range start
     * @param {Number} end Range end
     * Was subSequenceProvider
     */
    subSequenceManager: function(start, end) {
        var sequence = this.sequence;
        var features = this.features;
        var featuredSubSequence = null; //SequenceManger

        if(start < 0 || end < 0 || start > sequence.length || end > sequence.length) {
            return featuredSubSequence;
        }

        var featuredSubSymbolList = this.subSequence(start, end); //SymbolList

        var subFeatures = []; // ArrayCollection?

        console.log(start + ":" + end + ":" + features.length);

        for (var i=0; i < features.length; i++) {
            var feature = features[i]; //Feature
            console.log(start + ":" + end + ":" + feature.getStart() + ":" + feature.getEnd());

            if ( start < end && feature.getStart() < end ) { // only do this when the end is after the start
                if ( start <= feature.getStart() && end >= feature.end ) { // When the 
                    var clonedFeature1 = feature.clone();
                    clonedFeature1.shift(-start, sequence.length, circular);
                    subfeatures.push(clonedFeature1);
                }
            } else if ( start > end && feature.getStart() >= feature.getEnd()) {
                if ( start <= feature.getStart() && end >= feature.getEnd()) {
                    var clonedFeature2 = feature.clone();
                    clonedFeature2.shift(-start, sequence.length, circular);
                    subFeatures.push(clonedFeature2);
                }
            } else if (start > end && feature.getStart() <= feature.getEnd()) {
                if ( start <= feature.getStart() ) {
                    var clonedFeature3 = feature.clone();
                    clonedFeature3.shift(-start, sequence.length, circular);
                    subFeatures.push(clonedFeature3);
                } else if ( end > feature.getEnd() ) {
                    var clonedFeature4 = feature.clone();
                    clonedFeature4.shift(-start, sequence.length, circular);
                    subFeatures.push(clonedFeature4);
                }
            }
        }
        featuredSubSequence = Ext.create("Teselagen.manager.SequenceManager", {
            name: "Dummy",
            circular: false,
            sequence: featuredSubSymbolList,
            features: subFeatures
        });
        return featuredSubSequence;
    },

    /**
     * Adds feature to sequence manager
     * @param {Feature} feature Feature to add
     * @param {Boolean} quiet When true not SequenceManagerEvent will be dispatched (???)
     */
    addFeature: function(feature, quiet) {
        var evt;

        if (!quiet && !this.manualUpdateStarted) {
            console.log("launch sequence changing, kind feature add: createMemento");
            //var evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: createMemento()  
            //}
            //dispatcher.dispatchEvent(evt);
        }
        this.features.push(feature);

        if (!quiet && !this.manualUpdateStarted) {
            console.log("launch sequence changing, kind feature add: feature");
            //var evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: feature  
            //}
            //dispatcher.dispatchEvent(evt);
        }
    },

    /**
     * Adds list of features to sequence provider
     * @param {[Features]} featuresToAdd List of features to add
     * @param{Boolean} quiet When true not SequenceProviderEvent will be dispatched
     */
    addFeatures: function(featuresToAdd, quiet) {
        var i, evt;
        if ( !featuresToAdd || featuresToAdd.length === 0) {
            return null; //? null?
        }
        if ( !quiet && !this.manualUpdateStarted) {
            //evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: createMemento()  
            //}
            //dispatcher.dispatchEvent(evt)
        }
        for (var i=0; i<featuresToAdd.length; i++) {
            this.addFeature(featuresToAdd[i], true);
        }
        if (!quiet && !this.manualUpdateStarted) {
            //evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: feature  
            //}
            //dispatcher.dispatchEvent(evt);
        }

    },

    /**
     * Removes feature from sequence manager
     * @param {Feature} feature Feature to remove
     * @param {Boolean} quiet When true not SequenceProviderEvent will be dispatched
     */
    removeFeature: function(feature, quiet) {
        var evt;
        //var index = this.features.getItemIndex(feature);
        var index = Ext.Array.indexOf(this.features, feature);
        if ( index >= 0 ) {
            if (!quiet && !this.manualUpdateStarted) {
                //evt = Ext.create("SequenceManagerEvent", {
                //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
                //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
                //    blah3: createMemento()  
                //}
                //dispatcher.dispatchEvent(evt);
            }
            //this.features.removeItemAt(index);
            Ext.Array.remove(this.features, feature);
            if (!quiet && !this.manualUpdateStarted) {
                //evt = Ext.create("SequenceManagerEvent", {
                //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
                //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
                //    blah3: feature  
                //}
                //dispatcher.dispatchEvent(evt);
            }
        }
    },

    /**
     * Remove list of features to sequence provider
     * @param {[Features]} featuresToRemove List of features to remove
     * @param {Boolean} quiet When true not SequenceProviderEvent will be dispatched
     */
    removeFeatures: function(featuresToRemove, quiet) {
        var i, evt;

        if (!featuresToRemove || featuresToRemove < 1) {
            return null;
        }

        if (!featuresToRemove && !manualUpdateStarted) {
            //evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: createMemento()  
            //}
            //dispatcher.dispatchEvent(evt);
        }
        for (var i=0; i<featuresToRemove.length; i++) {
            removeFeature(featureToremove[i], true);
        }
        if (!featuresToRemove && !manualUpdateStarted) {
            //evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: features
            //}
            //dispatcher.dispatchEvent(evt);
        }
    },

    /**
     * Check if sequenceProvider has feature
     * @param {Feature} feature Feature existance to check
     */
    hasFeature: function(feature) {
        return features.contains(feature);
    },

    /**
     * Insert another sequence manager at position. This method is used on sequence paste. 
     * SEQUENCE PASTE?
     * @param {SequenceManger} sequenceManger SequenceManager to insert
     * @param {Number} position Position where to insert
     * @param {Boolean} quiet When true not SequenceProviderEvent will be dispatched
     */
    insertSequenceManger: function(sequenceManger, position, quiet) {
        var i, evt, insertFeature;

        needsRecalculateComplementSequence = true;
        needsRecalculateReverseComplementSequence = true;

        if(!quiet && !manualUpdateStarted) {
            //var evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: createMemento()  
            //}
            //dispatcher.dispatchEvent(evt);
        }
        insertSequence(sequenceManagers.sequence, position, true);
        for (var i=0; i<sequenceManager.features.length; i++) {
            //insertFeature = sequenceManager.features[i].clone();
            insertFeature.shift(position, sequence.length, circular);
            addFeature(insertFeature, true);
        }
        if(!quiet && !manualUpdateStarted) {
            //evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: sequenceManager, position???
            //}
            //dispatcher.dispatchEvent(evt);
        }

    },

    /**
     * Insert another sequence at position. This method is used on sequence paste
     * 
     * @param {SymbolList} insertSequence SymbolList to insert
     * @param {Number} position Position where to insert
     * @param {Boolean} quiet When true not SequenceProviderEvent will be dispatched
     */
    insertSequence: function(insertSequence, position, quiet) {
        var i, evt, lengthBefore, insertSequenceLength, feature;

        if (position < 0 || position > sequence.length || insertSequence.length < 1 ) {
            return null;
        }
        needsRecalculateComplementSequence        = true;
        needsRecalculateReverseComplementSequence = true;

        if(!quiet && !manualUpdateStarted) {
            // evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: createMemento()  
            //}
            //dispatcher.dispatchEvent(evt);
        }
        lengthBefore = sequence.length;
        sequence.insertSymbols(position, insertSequence);
        insertSequenceLength = insertSequence.length;

        for (var i=0; i<features.length; i++) {
            //feature
        } 
    },

    /**
     * Remove sequence in range
     * 
     * @param startIndex Range start 
     * @param endIndex Range end 
     * @param quiet When true not SequenceProviderEvent will be dispatched
     */
    removeSequence: function(start, end, quiet) {
        var evt;
        var lengthBefore = this.sequence.length;

        // impossible cases
        if (end < 0 || start < 0 || start > lengthBefore || end > lengthBefore || start == end ) {
            return;
        }

        needsRecalculateComplementSequence        = true;
        needsRecalculateReverseComplementSequence = true;

        if (!quiet && !manualUpdateStarted) {
            //evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: createMemento()  
            //}
            //dispatcher.dispatchEvent(evt);
        }

    },


    /**
     * Use this method for manually operate sequence changing state.
     * 
     * <pre>
     * Usage:
     * 
     * sequenceProvider.manualUpdateStart();
     * sequenceProvider.addFeature(feature1);
     * sequenceProvider.addFeature(feature2);
     * sequenceProvider.addFeature(feature3);
     * sequenceProvider.removeFeature(feature4);
     * sequenceProvider.manualUpdateEnd(); // only here SequenceManagerEvent.SEQUENCE_CHANGED will be trigered.
     * </pre>
     */
    manualUpdateStart: function() {
        if(!this.manualUpdateStarted) {
            this.manualUpdateStarted = true;

            //dispatcher.dispatchEvent(new SequenceProviderEvent(SequenceProviderEvent.SEQUENCE_CHANGING, SequenceProviderEvent.KIND_MANUAL_UPDATE, createMemento()));
        }
    },

    /**
     * @see manualUpdateStart
     */
    manualUpdateEnd: function() {
        if(this.manualUpdateStarted) {
            //dispatcher.dispatchEvent(new SequenceProviderEvent(SequenceProviderEvent.SEQUENCE_CHANGED, SequenceProviderEvent.KIND_MANUAL_UPDATE, null));

            this.manualUpdateStarted = false;
        }
    },

    /**
     *
     * @private
     */
    updateComplementSequence: function() {
        if(this.needsRecalculateComplementSequence) {
            this.complementSequence = Teselagen.bio.sequence.DNATools.complement(this.sequence);

            this.needsRecalculateComplementSequence = false;
        }
    },
    /**
     *
     * @private
     */
    updateReverseComplementSequence: function() {
        if(this.needsRecalculateReverseComplementSequence) {
            this.reverseComplementSequence = Teselagen.bio.sequence.DNATools.reverseComplement(this.sequence);

            this.needsRecalculateReverseComplementSequence = false;
        }
    },



    fromGenbank: function(genbank) {
        var result;


        return result;

    }


});
