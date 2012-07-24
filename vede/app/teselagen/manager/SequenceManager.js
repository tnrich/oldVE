/**
 * @class Teselagen.manager.SequenceManager
 * Main class that provides data to VectorPanel (Pie and Rail representations) and AnnotatePanel.

 * NOTE: This class uses other classes (e.g.{@link Teselagen.bio.sequence.DNATools} )
 * that have inputs of "start" and "end."  Indices begin at 0.
 * The convention used is start is inclusive and end is exclusive:
 *          [start, end)
 * For example, the selection with the following indices
 *          start = 2, end = 5
 * is:
 *          GATTACA
 *          --234--
 *          or 
 *            TTA
 *
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

    /** Calculates the complement sequence
     * @returns {Teselagen.bio.sequence.common.SymbolList} complementSequence 
     */
    getComplementSequence: function() {
        this.updateComplementSequence();
        return this.complementSequence;
    },

    /** Calculates the reverse complement sequence
     * @returns {Teselagen.bio.sequence.common.SymbolList} reverseComplementSequence 
     */
    getReverseComplementSequence: function() {
        this.updateReverseComplementSequence();
        return this.reverseComplementSequence;
    },

    /**
     * Extracts the sub sequence by range.
     * @param {Number} start Range start, inclusive.
     * @param {Number} end Range end, exclusive.
     * @returns {Teselagen.bio.sequence.common.SymbolList} subSequence
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

    /**
     * Extracts the sub sequence manager by range.
     * If the range of the sub sequence you choose is only a subset of a feature, 
     * that feature is not transfered to your new subSequenceManager.
     * @param {Number} start Range start, inclusive.
     * @param {Number} end Range end, exclusive.
     * @returns {Teselagen.manager.SequenceManager} subSequenceManager
     */
    subSequenceManager: function(start, end) {
        var sequence = this.sequence;
        var features = this.features;
        var circular = this.circular;
        var featuredSubSequence = null; //SequenceManger object

        if(start < 0 || end < 0 || start > sequence.length || end > sequence.length) {
            //console.log("HERE");
            //return featuredSubSequence;
            return null;
        }

        var featuredSubSymbolList = this.subSequence(start, end); //SymbolList

        var subFeatures = []; // ArrayCollection?

        // see Teselagen.bio.sequence.common.Annotation for the feature.clone() function

        for (var i=0; i < features.length; i++) {
            var feature = features[i]; //Feature
            var featStart = feature.getStart();
            var featEnd   = feature.getEnd();
            //console.log("SubSeq at: (" + start + ":" + end + "), Feat at:" + featStart + ":" + featEnd + ")");

            if ( start < end && featStart < featEnd ) {
                // ----------FFFFFFFF---------
                //         SSSSSSSSSSSS        or
                //           SSSSSSSS
                if ( start <= featStart && end >= featEnd ) {
                    var clonedFeature1 = feature.clone();
                    clonedFeature1.shift(-start, sequence.length, circular);
                    subFeatures.push(clonedFeature1);
                }
            } else if ( start > end && featStart >= featEnd) {
                // FFFF-------------------FFFF
                // SSSSSS               SSSSSS or 
                // SSSS                   SSSS
                if ( start <= featStart && end >= featEnd) {
                    var clonedFeature2 = feature.clone();
                    clonedFeature2.shift(-start, sequence.length, circular);
                    subFeatures.push(clonedFeature2);
                }
            } else if (start > end && featStart <= featEnd) {
                // ----------FFFFFFFF---------
                // SSSSSS   SSSSSSSSSSSSSSSSSS or
                // SSSSSS    SSSSSSSSSSSSSSSSS
                if ( start <= featStart ) {
                    var clonedFeature3 = feature.clone();
                    clonedFeature3.shift(-start, sequence.length, circular);
                    subFeatures.push(clonedFeature3);

                // ----------FFFFFFFF---------
                // SSSSSSSSSSSS        SSSSSSS or
                // SSSSSSSS            SSSSSSS  (but this means there is no overlap...)
                } else if ( end > featEnd ) {
                    var clonedFeature4 = feature.clone();
                    clonedFeature4.shift(-start, sequence.length, circular);
                    subFeatures.push(clonedFeature4);
                }
            } else {
                return null;
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
     * Adds Feature to sequence manager.
     * @param {Teselagen.bio.sequence.dna.Feature} feature Feature to add
     * @param {Boolean} quiet When true not SequenceManagerEvent will be dispatched
     */
    addFeature: function(feature, quiet) {
        var evt;

        if (!quiet && !this.manualUpdateStarted) {
            // console.log("launch sequence changing, kind feature add: createMemento");
            //var evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: createMemento()  
            //}
            //dispatcher.dispatchEvent(evt);
        }
        this.features.push(feature);

        if (!quiet && !this.manualUpdateStarted) {
            // console.log("launch sequence changing, kind feature add: feature");
            //var evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: feature  
            //}
            //dispatcher.dispatchEvent(evt);
        }
    },

    /**
     * Adds list of Features to sequence manager.
     * @param {Teselagen.bio.sequence.dna.Feature} [featuresToAdd] List of features to add
     * @param{Boolean} quiet When true not SequenceProviderEvent will be dispatched
     * @returns {Boolean} done True if successful, False if nothing was done.
     */
    addFeatures: function(featuresToAdd, quiet) {
        var i, evt;
        if ( !featuresToAdd || featuresToAdd.length === 0) {
            return false; //? null?
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
        return true;
    },

    /**
     * Removes Feature from sequence manager.
     * @param {Teselagen.bio.sequence.dna.Feature} feature Feature to remove
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
     * Remove list of Features to sequence manager.
     * @param {Teselagen.bio.sequence.dna.Feature} [featuresToRemove] List of features to remove
     * @param {Boolean} quiet When true not SequenceProviderEvent will be dispatched
     * @returns {Boolean} done True if successful, False if nothing was done.
     */
    removeFeatures: function(featuresToRemove, quiet) {
        var i, evt;

        if (!featuresToRemove || featuresToRemove < 1) {
            return false;
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
        return true;
    },

    /**
     * Check if SequenceManager has Feature
     * @param {Teselagen.bio.sequence.dna.Feature} feature Feature existance to check
     * @return {Boolean} hasFeature
     */
    hasFeature: function(feature) {
        //return this.features.contains(feature);
        return Ext.Array.contains(this.features, feature);
    },

    /**
     * Insert another sequence manager at position. This method is used on sequence paste. 
     *
     * @param {Teselagen.manager.SequenceManager} sequenceManager SequenceManager to insert
     * @param {Number} position Position where to insert
     * @param {Boolean} quiet When true not SequenceProviderEvent will be dispatched
     */
    insertSequenceManager: function(pSequenceManager, pPosition, pQuiet) {
        var i, evt, insertFeature;

        this.needsRecalculateComplementSequence = true;
        this.needsRecalculateReverseComplementSequence = true;

        if(!pQuiet && !this.manualUpdateStarted) {
            //var evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: createMemento()  
            //}
            //dispatcher.dispatchEvent(evt);
        }
        this.insertSequence(pSequenceManager.getSequence(), pPosition, true);

        for (var i=0; i<pSequenceManager.getFeatures().length; i++) {
            insertFeature = pSequenceManager.getFeatures()[i].clone();
            pSequenceManager.getFeatures()[i].shift(pPosition, this.sequence.length, this.circular);
            this.addFeature(pSequenceManager.getFeatures()[i], true);
        }

        Ext.each(pSequenceManager.getFeatures(), function(pFeature){
            console.log("Called within insertSequenceManager: " +  
                "Feature start: " + pFeature.getStart() + " and Feature end: " + pFeature.getEnd());
        });
        if(!pQuiet && !this.manualUpdateStarted) {
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
     * @param {Teselagen.bio.sequence.common.SymbolList} insertSequence SymbolList to insert
     * @param {Number} position Position where to insert; non-zero based
     * @param {Boolean} quiet When true not SequenceProviderEvent will be dispatched
     * @returns {Boolean} done True if successful, False if nothing was done.
     */
    insertSequence: function(pInsertSequence, pPosition, pQuiet) {
        var lengthBefore, insertSequence, insertSequenceLength;

        if (pPosition < 0 || pPosition > this.sequence.length || pInsertSequence.length < 1 ) {
            return false;
        }
        this.needsRecalculateComplementSequence        = true;
        this.needsRecalculateReverseComplementSequence = true;

        if(!pQuiet && !this.manualUpdateStarted) {
            // evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: createMemento()  
            //}
            //dispatcher.dispatchEvent(evt);
        }

        lengthBefore = this.sequence.length;
        insertSequenceLength = pInsertSequence.getSymbolsLength();

        this.sequence.insertSymbols(pPosition, pInsertSequence.getSymbols());
        // for prior to the fix that allows an array to be taken into insertSymbols
        //this.sequence.insertSymbols(position, [insertSequence.getSymbols()[0], insertSequence.getSymbols()[0]]);
        //console.log(this.sequence.toString() + ":" + insertSequenceLength);

        for (var i=0; i < this.features.length; i++) {
            this.features[i].insertAt(pPosition, insertSequenceLength, lengthBefore, this.circular);
        } 
        if(!pQuiet && !this.manualUpdateStarted) {
            //SEQUENCE_CHANGED
        }
        return false;
    },

    /**
     * TEMP: USING Ext.Error.raise to throw errors for now
     * Remove sequence in range.
     * 
     * @param {Number} startIndex Range start, inclusive.
     * @param {Number} endIndex Range end, exclusive.
     * @param {Boolean} quiet When true not SequenceProviderEvent will be dispatched
     * @returns {Boolean} done True if successful, False if nothing was done.
     */
    removeSequence: function(startIndex, endIndex, quiet) {
        var lengthBefore = this.sequence.length;

        // impossible cases
        if (endIndex < 0 || startIndex < 0 || startIndex > lengthBefore || endIndex > lengthBefore || startIndex == endIndex ) {
            return false;
        }

        needsRecalculateComplementSequence        = true;
        needsRecalculateReverseComplementSequence = true;

        if (!quiet && !this.manualUpdateStarted) {
            //evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: createMemento()  
            //}
            //dispatcher.dispatchEvent(evt);
        }
        var DEBUG_MODE = true;

        var deletions = [];
        var delLength1, delLength2;
        var delLengthBetween, delLengthBefore;
        var lengthBefore2, lengthBefore3;
        var delLengthOutside, delLengthInside;

        var features = this.features;
        var sequence = this.sequence;
        var circular = this.circular;
        var feature, featStart, featEnd;

        for (var i=0; i < features.length; i++) {
            var feature = features[i];
            featStart = feature.getStart();
            featEnd   = feature.getEnd();
            //console.log("Feature Info (" + feature.getName() + ") " + featStart + ":" + featEnd);
            //console.log("remove Info " + startIndex + ":" + endIndex);

            if ( featStart < featEnd ) {
                // Normal Feature
                if ( startIndex < endIndex) {
                    // Normal Selection
                    normFeatureNormSelection();
                } else {
                    // Circular Selection
                    normalFeatureStartEqMoreEnd();
                }
            } else {
                // Circular Feature
                if ( startIndex < endIndex) {
                    // Normal Selection
                    circFeatureNormSelection();
                } else {
                    //Circular Selection
                    circFeatureCircSelection();
                }
            }
            //console.log("New Feature Info (" + feature.getName() + ") " + featStart + ":" + featEnd);
        }

        for (var d=0; d < deletions.length; d++) {
            this.removeFeatures(deletions[d], true);
        }

        if(startIndex > endIndex) {
            sequence.deleteSymbols(0, endIndex);
            sequence.deleteSymbols(startIndex - endIndex, lengthBefore - startIndex);
        } else {
            var removeSequenceLength = endIndex - startIndex;
            sequence.deleteSymbols(startIndex, removeSequenceLength);
        }


        
        if(!quiet && !this.manualUpdateStarted) {
            //dispatcher.dispatchEvent(new SequenceProviderEvent(SequenceProviderEvent.SEQUENCE_CHANGED, SequenceProviderEvent.KIND_SEQUENCE_REMOVE, {position : startIndex, length : length}));
        }

        return true;

        // helper functions here 

        function normFeatureNormSelection() {
            if (DEBUG_MODE) console.log("norm-norm");
            /* Selection before feature => feature shift left
             * |-----SSSSSSSSSSSSSSSSSSSSSSSSS--------------------------------------------------------------------|
             *                                     |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                 */
            if(startIndex < featStart && endIndex <= featStart) {
                feature.deleteAt(startIndex, endIndex - startIndex, lengthBefore, circular);
                //if (DEBUG_MODE) trace("case Fn,Sn 1");
                if (DEBUG_MODE) console.log("case Fn,Sn 1");
            }
            /* Selection after feature => no action
             * |-------------------------------------------------------------SSSSSSSSSSSSSSSSSSSSSSSSS------------|
             *        |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                                              */
            else if(startIndex >= featEnd) {
                // if (DEBUG_MODE) trace("case Fn,Sn 2");
                if (DEBUG_MODE) console.log("case Fn,Sn 2");
            }
            /* Selection cover feature => remove feature
             * |-----------------------------SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS-----------------------|
             *                                  |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                    */
            else if(startIndex <= featStart && featEnd <= (endIndex)) {
                deletions.push(feature);
                //if (DEBUG_MODE) trace("case Fn,Sn 3");
                if (DEBUG_MODE) console.log("case Fn,Sn 3");
            }
            /* Selection inside feature => resize feature
             * |-------------------------------------SSSSSSSSSSSSSSSSSSSSSS---------------------------------------|
             *                                  |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                    */
            else if(((startIndex >= featStart) && ((endIndex) <= featEnd))) {
                feature.deleteAt(startIndex, endIndex - startIndex, lengthBefore, circular);
                //if (DEBUG_MODE) trace("case Fn,Sn 4");
                if (DEBUG_MODE) console.log("case Fn,Sn 4");
            }
            /* Selection left overlap feature => shift & resize feature
             * |-----------------------------SSSSSSSSSSSSSSSSSSSSS------------------------------------------------|
             *                                  |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                    */
            else if(startIndex < featStart && featStart < (endIndex)) {
                delLengthOutside = featStart - startIndex;
                delLengthInside = endIndex - featStart;
                lengthBefore2 = lengthBefore - (featStart - startIndex);
                feature.deleteAt(startIndex, delLengthOutside, lengthBefore, circular);
                feature.deleteAt(featStart, delLengthInside, lengthBefore2, circular);
                //if (DEBUG_MODE) trace("case Fn,Sn 5");
                if (DEBUG_MODE) console.log("case Fn,Sn 5");
            }
            /* Selection right overlap feature => shift & resize feature
             * |-------------------------------------------------SSSSSSSSSSSSSSSSSSSSS----------------------------|
             *                                  |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                    */
            else if(startIndex < featEnd && (endIndex) > featEnd) {
                feature.deleteAt(startIndex, featEnd - startIndex, lengthBefore, circular);
                //if (DEBUG_MODE) trace("case Fn,Sn 6");
                if (DEBUG_MODE) console.log("case Fn,Sn 6");
            } else {
                //Ext.Error.raise("Unhandled editing case!" + " Selection: [" + startIndex + ", " + endIndex + "], Feature: [" + featStart + ", " + featEnd + "], Sequence: " + sequence.seqString());
            }
        };

        function normFeatureCircSelection() {
            if (DEBUG_MODE) console.log("norm-circ");
            /* Selection and feature no overlap => shift left
             * |SSSSSSSSSSS-------------------------------------------------------------------------SSSSSSSSSSSSSS|
             *                                  |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                    */
            if(startIndex > featEnd && (endIndex) <= featStart) {
                feature.shift(-endIndex, lengthBefore, circular); 
                if (DEBUG_MODE) console.log("case Fn,Sc 1");
            }
            /* Selection and feature left partial overlap => cut and shift
             * |SSSSSSSSSSSSSSSSSSSS----------------------------------------------------------------SSSSSSSSSSSSSS|
             *             |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                                         */
            else if(startIndex > featEnd && (endIndex) > featStart && endIndex <= featEnd) {
                delLengthOutside = featStart;
                delLengthInside = endIndex - featStart;
                feature.deleteAt(0, delLengthOutside, lengthBefore, circular); 
                feature.deleteAt(featStart, delLengthInside, lengthBefore, circular); 
                if (DEBUG_MODE) console.log("case Fn,Sc 2");
            }
            /* Selection and feature right partial overlap => cut and shift
             * |SSSSSSSSSSSSSSS--------------------------------------------------------SSSSSSSSSSSSSSSSSSSSSSSSSSS|
             *                                                       |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|               */
            else if(startIndex > featStart && startIndex < featEnd && (endIndex) < featStart) {
                feature.deleteAt(startIndex, featEnd - startIndex, lengthBefore, circular);
                feature.shift(-endIndex, lengthBefore, circular); 
                if (DEBUG_MODE) console.log("case Fn,Sc 3");
            }
            /* Double selection overlap => cut and shift
             * |SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS-----------------SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS|
             *                           |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                          */
            else if(startIndex < featEnd && (endIndex) > featStart) {
                feature.deleteAt(startIndex, featEnd - startIndex, lengthBefore, circular);
                feature.deleteAt(featStart, endIndex - featStart, lengthBefore, circular);
                feature.shift(featStart, lengthBefore, circular);
                if (DEBUG_MODE) console.log("case Fn,Sc 3");
            }
            /* Complete left cover => remove feature
             * |SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS------------------------------SSSSSSSSSSSSSSSSSSSSS|
             *             |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                                        */
            else if(endIndex >= featEnd) {
                deletions.push(feature);
                if (DEBUG_MODE) console.log("case Fn,Sc 4");
            }
            /* Complete right cover => remove feature
             * |SSSSSSSSSSS---------------------------------SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS|
             *                                                     |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|               */
            else if(startIndex <= featStart) {
                deletions.push(feature);
                if (DEBUG_MODE) console.log("case Fn,Sc 5");
            } else {
                //Ext.Error.raise("Unhandled editing case!" + " Selection: [" + startIndex + ", " + endIndex + "], Feature: [" + featStart + ", " + featEnd + "], Sequence: " + sequence.seqString());
            }
        };

        function circFeatureNormSelection() {
            if (DEBUG_MODE) console.log("circ-norm");
            /* Selection between feature start and end
             * |-------------------------------SSSSSSSSSSSSSSSSSSSSSSSSS------------------------------------------|
             *  FFFFFFFFFFFFFFFFFFF|                                               |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            if(startIndex >= featEnd && (endIndex) <= featStart) {
                feature.deleteAt(startIndex, endIndex - startIndex, lengthBefore, circular);
                if (DEBUG_MODE) console.log("case Fc,Sn 1");
            }
            /* Selection inside feature start
             * |----------------------------------------------------------------------SSSSSSSSSSSSSSSSSSSSSSSSS---|
             *  FFFFFFFFFFFFFFFFFFF|                                               |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            else if(startIndex >= featStart) {
                feature.deleteAt(startIndex, endIndex - startIndex, lengthBefore, circular);
                if (DEBUG_MODE) console.log("case Fc,Sn 2");
            }
            /* Selection inside feature end
             * |--SSSSSSSSSSSSSSSSSS------------------------------------------------------------------------------|
             *  FFFFFFFFFFFFFFFFFFFFFFFFF|                                         |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            else if((endIndex) <= featEnd) {
                feature.deleteAt(startIndex, endIndex - startIndex, lengthBefore, circular);
                if (DEBUG_MODE) console.log("case Fc,Sn 3");
            }
            /* Selection in feature start
             * |----------------------------------------------------------------------SSSSSSSSSSSSSSSSSSSSSSSSS---|
             *  FFFFFFFFFFFFFFFFFFF|                                                        |FFFFFFFFFFFFFFFFFFFFF  */
            else if(startIndex >= featEnd && startIndex <= featStart && (endIndex) > featStart) {
                delLengthBefore = featStart - startIndex;
                delLengthInside = endIndex - featStart;
                lengthBefore2 = lengthBefore - delLengthInside;
                feature.deleteAt(featStart, delLengthInside, lengthBefore, circular);
                feature.deleteAt(startIndex, delLengthBefore, lengthBefore2, circular);

                if (DEBUG_MODE) console.log("case Fc,Sn 4a");
                if (DEBUG_MODE) console.log("case Fc,Sn 4b");
            }
            /* Selection in feature end
             * |--SSSSSSSSSSSSSSSSSSSSSSSSSSSSS-------------------------------------------------------------------|
             *  FFFFFFFFFFFFFFFFFFFFFFFFF|                                         |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            else if(startIndex < featEnd && (endIndex) >= featEnd && (endIndex) <= featStart) {
                delLengthOutside = endIndex - featEnd;
                lengthBefore2 = lengthBefore - (featEnd - startIndex);
                feature.deleteAt(startIndex, featEnd - startIndex, lengthBefore, circular);
                feature.deleteAt(featEnd, delLengthOutside, lengthBefore2, circular);

                if (DEBUG_MODE) console.log("case Fc,Sn 5a");
                if (DEBUG_MODE) console.log("case Fc,Sn 5b");
            }
            /* Double ends selection
             * |------------------SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS---------------------|
             *  FFFFFFFFFFFFFFFFFFFFFFFFF|                                         |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            else if(startIndex <= featEnd && featStart <= endIndex - 1) {
                delLengthBetween = featStart - featEnd;
                delLength1 = featEnd - startIndex;
                delLength2 = endIndex - featStart;

                feature.deleteAt(startIndex, delLength1, lengthBefore, circular);
                lengthBefore2 = lengthBefore - delLength1;
                feature.deleteAt(featEnd, delLengthBetween, lengthBefore2, circular);
                lengthBefore3 = lengthBefore2 - delLengthBetween;
                feature.deleteAt(featStart, delLength2, lengthBefore3, circular);

                if(startIndex == 0 && endIndex == lengthBefore) {
                } else if(endIndex == sequence.length) {
                    if (DEBUG_MODE) console.log("case Fc,Sn 6a");
                } else if(startIndex == 0) {
                    if (DEBUG_MODE) console.log("case Fc,Sn 6b");
                } else {
                    if (DEBUG_MODE) console.log("case Fc,Sn 6c");
                }

            } else {
                //Ext.Error.raise("Unhandled editing case!" + " Selection: [" + startIndex + ", " + endIndex + "], Feature: [" + featStart + ", " + featEnd + "], Sequence: " + sequence.seqString());
            }
        };

        function circFeatureCircSelection() {
            if (DEBUG_MODE) console.log("circ-circ");
            /* Selection inside feature
             * |SSSSSSSSSSSSSSSSS--------------------------------------------------------SSSSSSSSSSSSSSSSSSSSSSSSS|
             *  FFFFFFFFFFFFFFFFFFF|                                               |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            if(startIndex > featStart && (endIndex - 1) < featEnd) {
                if (DEBUG_MODE) console.log("case Fc,Sc 1");
                delLength1 = endIndex;
                delLength2 = lengthBefore - startIndex;
                feature.deleteAt(startIndex, delLength2, lengthBefore, circular);
                lengthBefore2 = lengthBefore - delLength2;
                feature.deleteAt(0, delLength1, lengthBefore2, circular);
            }
            /* Selection end overlap
             * |SSSSSSSSSSSSSSSSSSSSSS---------------------------------------------------SSSSSSSSSSSSSSSSSSSSSSSSS|
             *  FFFFFFFFFFFFFFFFFFF|                                               |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            else if(endIndex - 1 >= featEnd && startIndex > featStart && (endIndex - 1) < featStart) {
                if (DEBUG_MODE) console.log("case Fc,Sc 2");
                delLength1 = featEnd;
                delLength2 = lengthBefore - startIndex;
                delLengthBetween = endIndex - featEnd;

                feature.deleteAt(startIndex, delLength2, lengthBefore, circular);
                lengthBefore2 = lengthBefore - delLength2;
                feature.deleteAt(featEnd, delLengthBetween, lengthBefore2, circular);
                lengthBefore3 = lengthBefore2 - delLengthBetween;
                feature.deleteAt(0, delLength1, lengthBefore3, circular);
            }
            /* Selection start overlap
             * |SSSSSSSSSSSSSSSSS-----------------------------------------------SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS|
             *  FFFFFFFFFFFFFFFFFFF|                                               |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            else if(startIndex <= featStart && endIndex < featEnd && startIndex >= featEnd) {
                if (DEBUG_MODE) console.log("case Fc,Sc 3");
                delLengthOutside = featStart - startIndex;
                delLength2 = lengthBefore - featStart;
                feature.deleteAt(featStart, delLength2, lengthBefore, circular);
                lengthBefore2 = lengthBefore - delLength2;
                feature.deleteAt(startIndex, delLengthOutside, lengthBefore2, circular);
                lengthBefore3 = lengthBefore2 - delLengthOutside;
                feature.deleteAt(0, endIndex, lengthBefore3, circular);
            }
            /* Selection inside feature
             * |SSSSSSSSSSSSSSSSSSSSSSS-----------------------------------------SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS|
             *  FFFFFFFFFFFFFFFFFFF|                                               |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            else if(endIndex >= featEnd && startIndex <= featStart && endIndex <= featStart) {
                if (DEBUG_MODE) console.log("case Fc,Sc 4");
                deletions.push(feature);
            }
            /* Selection double end right overlap
             * |SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS----------------------------SSSSSSSSSSSSSSSSSSSSSSSSSS|
             *  FFFFFFFFFFFFFFFFFFF|             |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            else if(endIndex - 1 >= featStart) {
                if (DEBUG_MODE) console.log("case Fc,Sc 5");
                var delLength2a = endIndex - featStart;
                var delLength2b = lengthBefore - startIndex;
                delLengthBetween = featStart - featEnd;
                delLength1 = featEnd;

                feature.deleteAt(0, delLength1, lengthBefore, circular);
                lengthBefore2 = lengthBefore - delLength1;
                feature.deleteAt(0, delLengthBetween, lengthBefore2, circular);
                lengthBefore3 = lengthBefore2 - delLengthBetween;
                feature.deleteAt(0, delLength2a, lengthBefore3, circular);
                var lengthBefore4 = lengthBefore3 - delLength2a;
                feature.deleteAt(lengthBefore4 - delLength2b, delLength2b, lengthBefore4, circular);
            }
            /* Selection double end left overlap
             * |SSSSSSSSSSS---------SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS|
             *  FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                        |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            else if(startIndex <= featEnd) {
                if (DEBUG_MODE) console.log("case Fc,Sc 6");
                var delLength1a = endIndex;
                var delLength1b = featEnd - startIndex;
                delLengthBetween = featStart - featEnd;

                delLength2 = lengthBefore - featStart;
                var newCutStart = startIndex - endIndex;
                feature.deleteAt(0, delLength1a, lengthBefore, circular);
                lengthBefore2 = lengthBefore - delLength1a;
                feature.deleteAt(newCutStart, delLength1b, lengthBefore2, circular);
                lengthBefore3 = lengthBefore2 - delLength1b;
                feature.deleteAt(featEnd, lengthBefore3 - featEnd, lengthBefore3, circular);

            }
            else {
                //Ext.Error.raise("Unhandled editing case!" + " Selection: [" + startIndex + ", " + endIndex + "], Feature: [" + featStart + ", " + featEnd + "], Sequence: " + sequence.seqString());
            }
        };

    },

    /**
     * Get list of features in range
     * 
     * @return List of features
     */
     featuresByRange: function(start, end) {
        var result;
        var features = this.features;

        for (var i=0; i < features.length; i++) {
            if (start < end) {
                if (features[i].start < features[i].end) {
                    if (features[i].start < end  &&  features[i].end > start) {
                        result.push(features[i]);
                    }
                } else {
                    if (start < features[i].end || end > features[i].start) {
                        result.push(features[i]);
                    }
                } 
            } else {
                if (features[i].start <= features[i].end) {
                    if (features[i].start >= end  &&  features[i].end < start) {

                    } else {
                        result.push(features[i]);
                    }
                } else {
                    resutl.push(features[i]);
                }
            }
        }
        return result;
     },

     /**
      * Get list of features at position
      * 
      * @return List of features
      */
    featuresAt: function(position) {
        var result;
        var features = this.features;

        for (var i=0; i < features.length; i++) {
            if (features[i].start <= features[i].end) {
                if (features[i].start < position  && features[i].end > position) {
                    result.push(features[i]);
                }
            } else {
                if (features[i].start < position || features[i].end > position) {
                    result.push(features[i]);
                }
            }
        }
        return result;
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
    * Clone sequence provider
    */
    clone: function() {
        var clonedSeq = Teselagen.bio.sequence.DNATools.createDNA(this.getSequence().seqString());
        var clonedSequenceManager = Ext.create("Teselagen.manager.SequenceManager", {
            name:       this.name,
            circular:   this.circular,
            sequence:   clonedSeq
        });
        var features = this.features;

        if (features && features.length > 0) {
            for (var i=0; i < features.length; i++) {
                clonedSequenceManager.addFeature(features[i], true);
            }
        }
        return clonedSequenceManager;
    },

    /**
     * Reverse sequence
     */
    reverseSequence: function(inputSequenceManager) {
        return true;
    },

    /**
     * Reverse complement sequence
     */
    reverseComplementSequence: function(inputSequenceManager) {
        return true;
    },

    /**
     * Rebase sequence. Rotate sequence to new position.
     */
    rebaseSequence: function(inputSequenceManager) {
        return true;
    },

    toGenbank: function() {
        return true;
    },


    fromGenbank: function(genbank) {
        var result;
        return result;
    },

    fromJbeiSeqXml: function(jbeiSeq) {
        var result;
        return result;
    },

    fromFasta: function(fasta) {
        var result;
        return result;
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
    }


});
