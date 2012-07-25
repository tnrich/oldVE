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
        "Teselagen.event.SequenceManagerEvent",
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
        updateSequenceChanged: Teselagen.event.SequenceManagerEvent.SEQUENCE_CHANGED,


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
     * @param {Teselagen.manager.SequenceManagerMemento} memento 
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
    subSequence: function(pStart, pEnd) {
        var result = null;// = Ext.define("Teselagen.bio.sequence.common.SymbolList"); //SymbolList

        if( pStart < 0 || pEnd < 0 || pStart > this.sequence.length || pEnd > this.sequence.length) {
            return result;
        }
        //console.log("subsequence");
        if( pStart > pEnd) {
            result = Teselagen.bio.sequence.DNATools.createDNA(this.sequence.subList(pStart, this.sequence.length).seqString() + this.sequence.subList(0, pEnd).seqString());
        } else {
            result = this.sequence.subList(pStart, pEnd);
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
    subSequenceManager: function(pStart, pEnd) {
        var sequence = this.sequence;
        var features = this.features;
        var circular = this.circular;
        var featuredSubSequence = null; //SequenceManger object

        if(pStart < 0 || pEnd < 0 || pStart > sequence.length || pEnd > sequence.length) {
            //console.log("HERE");
            //return featuredSubSequence;
            return null;
        }

        var featuredSubSymbolList = this.subSequence(pStart, pEnd); //SymbolList

        var subFeatures = []; // ArrayCollection?

        // see Teselagen.bio.sequence.common.Annotation for the feature.clone() function

        for (var i=0; i < features.length; i++) {
            var feature = features[i]; //Feature
            var featStart = feature.getStart();
            var featEnd   = feature.getEnd();
            //console.log("SubSeq at: (" + pStart + ":" + pEnd + "), Feat at:" + featStart + ":" + featEnd + ")");

            if ( pStart < pEnd && featStart < featEnd ) {
                // ----------FFFFFFFF---------
                //         SSSSSSSSSSSS        or
                //           SSSSSSSS
                if ( pStart <= featStart && pEnd >= featEnd ) {
                    var clonedFeature1 = feature.clone();
                    clonedFeature1.shift(-pStart, sequence.length, circular);
                    subFeatures.push(clonedFeature1);
                }
            } else if ( pStart > pEnd && featStart >= featEnd) {
                // FFFF-------------------FFFF
                // SSSSSS               SSSSSS or 
                // SSSS                   SSSS
                if ( pStart <= featStart && pEnd >= featEnd) {
                    var clonedFeature2 = feature.clone();
                    clonedFeature2.shift(-pStart, sequence.length, circular);
                    subFeatures.push(clonedFeature2);
                }
            } else if (pStart > pEnd && featStart <= featEnd) {
                // ----------FFFFFFFF---------
                // SSSSSS   SSSSSSSSSSSSSSSSSS or
                // SSSSSS    SSSSSSSSSSSSSSSSS
                if ( pStart <= featStart ) {
                    var clonedFeature3 = feature.clone();
                    clonedFeature3.shift(-pStart, sequence.length, circular);
                    subFeatures.push(clonedFeature3);

                // ----------FFFFFFFF---------
                // SSSSSSSSSSSS        SSSSSSS or
                // SSSSSSSS            SSSSSSS  (but this means there is no overlap...)
                } else if ( pEnd > featEnd ) {
                    var clonedFeature4 = feature.clone();
                    clonedFeature4.shift(-pStart, sequence.length, circular);
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
    addFeature: function(pFeature, quiet) {
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
        this.features.push(pFeature);

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
    addFeatures: function(pFeaturesToAdd, quiet) {
        var i, evt;
        if ( !pFeaturesToAdd || pFeaturesToAdd.length === 0) {
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
        for (var i=0; i < pFeaturesToAdd.length; i++) {
            this.addFeature(pFeaturesToAdd[i], true);
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
     * @returns {Boolean} done True if successful, False if nothing was done.
     */
    removeFeature: function(pFeature, quiet) {
        var evt;
        //var index = this.features.getItemIndex(feature);
        var index = Ext.Array.indexOf(this.features, pFeature);
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
            Ext.Array.remove(this.features, pFeature);

            if (!quiet && !this.manualUpdateStarted) {
                //evt = Ext.create("SequenceManagerEvent", {
                //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
                //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
                //    blah3: feature  
                //}
                //dispatcher.dispatchEvent(evt);
            }
            return true;
        } else {
            return false;
        }
    },

    /**
     * Remove list of Features to sequence manager.
     * (It is easier to just iterate through your array and use removeFeature() instead.)
     * @param {Teselagen.bio.sequence.dna.Feature[]} [featuresToRemove] List of features to remove
     * @param {Boolean} quiet When true not SequenceProviderEvent will be dispatched
     * @returns {Boolean} done True if successful, False if nothing was done.
     */
    removeFeatures: function(pFeaturesToRemove, quiet) {
        var i, evt;

        if (!pFeaturesToRemove || pFeaturesToRemove.length === 0) {
            return false;
        }
        if (!pFeaturesToRemove && !this.manualUpdateStarted) {
            //evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: createMemento()  
            //}
            //dispatcher.dispatchEvent(evt);
        }
        for (var i=0; i < pFeaturesToRemove.length; i++) {
            var success = this.removeFeature(pFeaturesToRemove[i], true);
            if (!success) console.warn("Could not remove Feature[" + i  + "] from Sequence.");
        }
        if (!pFeaturesToRemove && !this.manualUpdateStarted) {
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
    hasFeature: function(pFeature) {
        //return this.features.contains(feature);
        return Ext.Array.contains(this.features, pFeature);
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

        var features = this.getFeatures();

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
        var success = this.insertSequence(pSequenceManager.getSequence(), pPosition, true);

        if (!success) console.warn("Could not insert a SequenceManager into another SequenceManager.");

        //for (var i=0; i<features.length; i++) {
        //    console.log("This Feat: (" + features[i].getStart() + "," + features[0].getEnd() + ")");
        //}

        for (var i=0; i<pSequenceManager.getFeatures().length; i++) {
            insertFeature = pSequenceManager.getFeatures()[i].clone();
            //pSequenceManager.getFeatures()[i].shift(pPosition, this.sequence.length, this.circular);
            //this.addFeature(pSequenceManager.getFeatures()[i], true); // ERROR need cloning insertFeature
            
            insertFeature.shift(pPosition, this.sequence.length, this.circular);
            this.addFeature(insertFeature, true); // original way
        }

        //Ext.each(pSequenceManager.getFeatures(), function(pFeature){
        //    console.log("Called within insertSequenceManager: " +  
        //        "Feature start: " + pFeature.getStart() + " and Feature end: " + pFeature.getEnd());
        //});

        //for (var i=0; i<features.length; i++) {
        //    console.log("New Feat: (" + features[i].getStart() + "," + features[0].getEnd() + ")");
        //}

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

        if (pPosition < 0 || pPosition > this.sequence.length || pInsertSequence.length === 0 ) {
            console.log(pInsertSequence.seqString());
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
        return true;
    },

    /**
     * TEMP: USING Ext.Error.raise to throw errors for now
     * Remove sequence in range.
     * 
     * @param {Number} pStartIndex Range start, inclusive.
     * @param {Number} pEndIndex Range end, exclusive.
     * @param {Boolean} quiet When true not SequenceProviderEvent will be dispatched
     * @returns {Boolean} done True if successful, False if nothing was done.
     */
    removeSequence: function(pStartIndex, pEndIndex, quiet) {
        var lengthBefore = this.sequence.length;

        // impossible cases
        if (pEndIndex < 0 || pStartIndex < 0 || pStartIndex > lengthBefore || pEndIndex > lengthBefore || pStartIndex === pEndIndex ) {
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
            //console.log("remove Info " + pStartIndex + ":" + pEndIndex);

            if ( featStart < featEnd ) {
                // Normal Feature
                if ( pStartIndex < pEndIndex) {
                    // Normal Selection
                    normFeatureNormSelection();
                } else {
                    // Circular Selection
                    normFeatureCircSelection();
                }
            } else {
                // Circular Feature
                if ( pStartIndex < pEndIndex) {
                    // Normal Selection
                    circFeatureNormSelection();
                } else {
                    //Circular Selection
                    circFeatureCircSelection();
                }
            }
            //console.log("New Feature Info (" + feature.getName() + ") " + featStart + ":" + featEnd);
        }

        // Deleting entire features if necessary 
        for (var d=0; d < deletions.length; d++) {
            //console.log(deletions.length);
            var success = this.removeFeature(deletions[d], false);
            if (!success) console.warn("Could not delete Features when removing Sequence.");
        }

        //if (deletions.length > 0) {
        //    var success = this.removeFeatures(deletions, true);
        //    if (!success) console.warn("Could not delete Features when removing Sequence.");
        //}

        // Readjusting sequence indices
        if(pStartIndex > pEndIndex) {
            sequence.deleteSymbols(0, pEndIndex);
            sequence.deleteSymbols(pStartIndex - pEndIndex, lengthBefore - pStartIndex);
        } else {
            var removeSequenceLength = pEndIndex - pStartIndex;
            sequence.deleteSymbols(pStartIndex, removeSequenceLength);
        }


        
        if(!quiet && !this.manualUpdateStarted) {
            //dispatcher.dispatchEvent(new SequenceProviderEvent(SequenceProviderEvent.SEQUENCE_CHANGED, SequenceProviderEvent.KIND_SEQUENCE_REMOVE, {position : pStartIndex, length : length}));
        }

        return true;

        // Helper Functions here
        // These take care of existing this.features that may be affected by an inserted seq/seqMgr
        // 

        function normFeatureNormSelection() {
            if (DEBUG_MODE) console.log("norm-norm");
            /* Selection before feature => feature shift left
             * |-----SSSSSSSSSSSSSSSSSSSSSSSSS--------------------------------------------------------------------|
             *                                     |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                 */
            if(pStartIndex < featStart && pEndIndex <= featStart) { //correct for indices
                feature.deleteAt(pStartIndex, pEndIndex - pStartIndex, lengthBefore, circular);
                //if (DEBUG_MODE) trace("case Fn,Sn 1");
                if (DEBUG_MODE) console.log("case Fn,Sn 1");
            }
            /* Selection after feature => no action
             * |-------------------------------------------------------------SSSSSSSSSSSSSSSSSSSSSSSSS------------|
             *        |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                                              */
            else if(pStartIndex >= featEnd) { // Do nothing
                // if (DEBUG_MODE) trace("case Fn,Sn 2");
                if (DEBUG_MODE) console.log("case Fn,Sn 2");
            }
            /* Selection cover feature => remove feature
             * |-----------------------------SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS-----------------------|
             *                                  |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                    */
            else if(pStartIndex <= featStart && featEnd <= (pEndIndex)) {  // delete feature entirely
                deletions.push(feature);
                //if (DEBUG_MODE) trace("case Fn,Sn 3");
                if (DEBUG_MODE) console.log("case Fn,Sn 3");
            }
            /* Selection inside feature => resize feature
             * |-------------------------------------SSSSSSSSSSSSSSSSSSSSSS---------------------------------------|
             *                                  |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                    */
            else if(((pStartIndex >= featStart) && ((pEndIndex) <= featEnd))) { //delete part of feature
                feature.deleteAt(pStartIndex, pEndIndex - pStartIndex, lengthBefore, circular);
                //if (DEBUG_MODE) trace("case Fn,Sn 4");
                if (DEBUG_MODE) console.log("case Fn,Sn 4");
            }
            /* Selection left overlap feature => shift & resize feature
             * |-----------------------------SSSSSSSSSSSSSSSSSSSSS------------------------------------------------|
             *                                  |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                    */
            else if(pStartIndex < featStart && featStart < (pEndIndex)) {
                delLengthOutside = featStart - pStartIndex;
                delLengthInside = pEndIndex - featStart;
                lengthBefore2 = lengthBefore - (featStart - pStartIndex);
                feature.deleteAt(pStartIndex, delLengthOutside, lengthBefore, circular);
                feature.deleteAt(featStart, delLengthInside, lengthBefore2, circular);
                //if (DEBUG_MODE) trace("case Fn,Sn 5");
                if (DEBUG_MODE) console.log("case Fn,Sn 5");
            }
            /* Selection right overlap feature => shift & resize feature
             * |-------------------------------------------------SSSSSSSSSSSSSSSSSSSSS----------------------------|
             *                                  |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                    */
            else if(pStartIndex < featEnd && (pEndIndex) > featEnd) {
                feature.deleteAt(pStartIndex, featEnd - pStartIndex, lengthBefore, circular);
                //if (DEBUG_MODE) trace("case Fn,Sn 6");
                if (DEBUG_MODE) console.log("case Fn,Sn 6");
            } else {
                //Ext.Error.raise("Unhandled editing case!" + " Selection: [" + pStartIndex + ", " + pEndIndex + "], Feature: [" + featStart + ", " + featEnd + "], Sequence: " + sequence.seqString());
            }
        };

        function normFeatureCircSelection() {
            if (DEBUG_MODE) console.log("norm-circ");
            /* Selection and feature no overlap => shift left
             * |SSSSSSSSSSS-------------------------------------------------------------------------SSSSSSSSSSSSSS|
             *                                  |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                    */
            if(pStartIndex > featEnd && (pEndIndex) <= featStart) {
                feature.shift(-pEndIndex, lengthBefore, circular); 
                if (DEBUG_MODE) console.log("case Fn,Sc 1");
            }
            /* Selection and feature left partial overlap => cut and shift
             * |SSSSSSSSSSSSSSSSSSSS----------------------------------------------------------------SSSSSSSSSSSSSS|
             *             |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                                         */
            else if(pStartIndex > featEnd && (pEndIndex) > featStart && pEndIndex <= featEnd) {
                delLengthOutside = featStart;
                delLengthInside = pEndIndex - featStart;
                feature.deleteAt(0, delLengthOutside, lengthBefore, circular); 
                feature.deleteAt(featStart, delLengthInside, lengthBefore, circular); 
                if (DEBUG_MODE) console.log("case Fn,Sc 2");
            }
            /* Selection and feature right partial overlap => cut and shift
             * |SSSSSSSSSSSSSSS--------------------------------------------------------SSSSSSSSSSSSSSSSSSSSSSSSSSS|
             *                                                       |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|               */
            else if(pStartIndex > featStart && pStartIndex < featEnd && (pEndIndex) < featStart) {
                feature.deleteAt(pStartIndex, featEnd - pStartIndex, lengthBefore, circular);
                feature.shift(-pEndIndex, lengthBefore, circular); 
                if (DEBUG_MODE) console.log("case Fn,Sc 3");
            }
            /* Double selection overlap => cut and shift
             * |SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS-----------------SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS|
             *                           |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                          */
            else if(pStartIndex < featEnd && (pEndIndex) > featStart) {
                feature.deleteAt(pStartIndex, featEnd - pStartIndex, lengthBefore, circular);
                feature.deleteAt(featStart, pEndIndex - featStart, lengthBefore, circular);
                feature.shift(featStart, lengthBefore, circular);
                if (DEBUG_MODE) console.log("case Fn,Sc 3");
            }
            /* Complete left cover => remove feature
             * |SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS------------------------------SSSSSSSSSSSSSSSSSSSSS|
             *             |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|                                                        */
            else if(pEndIndex >= featEnd) {
                deletions.push(feature);
                if (DEBUG_MODE) console.log("case Fn,Sc 4");
            }
            /* Complete right cover => remove feature
             * |SSSSSSSSSSS---------------------------------SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS|
             *                                                     |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|               */
            else if(pStartIndex <= featStart) {
                deletions.push(feature);
                if (DEBUG_MODE) console.log("case Fn,Sc 5");
            } else {
                //Ext.Error.raise("Unhandled editing case!" + " Selection: [" + pStartIndex + ", " + pEndIndex + "], Feature: [" + featStart + ", " + featEnd + "], Sequence: " + sequence.seqString());
            }
        };

        function circFeatureNormSelection() {
            if (DEBUG_MODE) console.log("circ-norm");
            /* Selection between feature start and end
             * |-------------------------------SSSSSSSSSSSSSSSSSSSSSSSSS------------------------------------------|
             *  FFFFFFFFFFFFFFFFFFF|                                               |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            if(pStartIndex >= featEnd && (pEndIndex) <= featStart) {
                feature.deleteAt(pStartIndex, pEndIndex - pStartIndex, lengthBefore, circular);
                if (DEBUG_MODE) console.log("case Fc,Sn 1");
            }
            /* Selection inside feature start
             * |----------------------------------------------------------------------SSSSSSSSSSSSSSSSSSSSSSSSS---|
             *  FFFFFFFFFFFFFFFFFFF|                                               |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            else if(pStartIndex >= featStart) {
                feature.deleteAt(pStartIndex, pEndIndex - pStartIndex, lengthBefore, circular);
                if (DEBUG_MODE) console.log("case Fc,Sn 2");
            }
            /* Selection inside feature end
             * |--SSSSSSSSSSSSSSSSSS------------------------------------------------------------------------------|
             *  FFFFFFFFFFFFFFFFFFFFFFFFF|                                         |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            else if((pEndIndex) <= featEnd) {
                feature.deleteAt(pStartIndex, pEndIndex - pStartIndex, lengthBefore, circular);
                if (DEBUG_MODE) console.log("case Fc,Sn 3");
            }
            /* Selection in feature start
             * |----------------------------------------------------------------------SSSSSSSSSSSSSSSSSSSSSSSSS---|
             *  FFFFFFFFFFFFFFFFFFF|                                                        |FFFFFFFFFFFFFFFFFFFFF  */
            else if(pStartIndex >= featEnd && pStartIndex <= featStart && (pEndIndex) > featStart) {
                delLengthBefore = featStart - pStartIndex;
                delLengthInside = pEndIndex - featStart;
                lengthBefore2 = lengthBefore - delLengthInside;
                feature.deleteAt(featStart, delLengthInside, lengthBefore, circular);
                feature.deleteAt(pStartIndex, delLengthBefore, lengthBefore2, circular);

                if (DEBUG_MODE) console.log("case Fc,Sn 4a");
                if (DEBUG_MODE) console.log("case Fc,Sn 4b");
            }
            /* Selection in feature end
             * |--SSSSSSSSSSSSSSSSSSSSSSSSSSSSS-------------------------------------------------------------------|
             *  FFFFFFFFFFFFFFFFFFFFFFFFF|                                         |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            else if(pStartIndex < featEnd && (pEndIndex) >= featEnd && (pEndIndex) <= featStart) {
                delLengthOutside = pEndIndex - featEnd;
                lengthBefore2 = lengthBefore - (featEnd - pStartIndex);
                feature.deleteAt(pStartIndex, featEnd - pStartIndex, lengthBefore, circular);
                feature.deleteAt(featEnd, delLengthOutside, lengthBefore2, circular);

                if (DEBUG_MODE) console.log("case Fc,Sn 5a");
                if (DEBUG_MODE) console.log("case Fc,Sn 5b");
            }
            /* Double ends selection
             * |------------------SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS---------------------|
             *  FFFFFFFFFFFFFFFFFFFFFFFFF|                                         |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            else if(pStartIndex <= featEnd && featStart <= pEndIndex - 1) {
                delLengthBetween = featStart - featEnd;
                delLength1 = featEnd - pStartIndex;
                delLength2 = pEndIndex - featStart;

                feature.deleteAt(pStartIndex, delLength1, lengthBefore, circular);
                lengthBefore2 = lengthBefore - delLength1;
                feature.deleteAt(featEnd, delLengthBetween, lengthBefore2, circular);
                lengthBefore3 = lengthBefore2 - delLengthBetween;
                feature.deleteAt(featStart, delLength2, lengthBefore3, circular);

                if(pStartIndex == 0 && pEndIndex == lengthBefore) {
                } else if(pEndIndex == sequence.length) {
                    if (DEBUG_MODE) console.log("case Fc,Sn 6a");
                } else if(pStartIndex == 0) {
                    if (DEBUG_MODE) console.log("case Fc,Sn 6b");
                } else {
                    if (DEBUG_MODE) console.log("case Fc,Sn 6c");
                }

            } else {
                //Ext.Error.raise("Unhandled editing case!" + " Selection: [" + pStartIndex + ", " + pEndIndex + "], Feature: [" + featStart + ", " + featEnd + "], Sequence: " + sequence.seqString());
            }
        };

        function circFeatureCircSelection() {
            if (DEBUG_MODE) console.log("circ-circ");
            /* Selection inside feature
             * |SSSSSSSSSSSSSSSSS--------------------------------------------------------SSSSSSSSSSSSSSSSSSSSSSSSS|
             *  FFFFFFFFFFFFFFFFFFF|                                               |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            if(pStartIndex > featStart && (pEndIndex - 1) < featEnd) {
                if (DEBUG_MODE) console.log("case Fc,Sc 1");
                delLength1 = pEndIndex;
                delLength2 = lengthBefore - pStartIndex;
                feature.deleteAt(pStartIndex, delLength2, lengthBefore, circular);
                lengthBefore2 = lengthBefore - delLength2;
                feature.deleteAt(0, delLength1, lengthBefore2, circular);
            }
            /* Selection end overlap
             * |SSSSSSSSSSSSSSSSSSSSSS---------------------------------------------------SSSSSSSSSSSSSSSSSSSSSSSSS|
             *  FFFFFFFFFFFFFFFFFFF|                                               |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            else if(pEndIndex - 1 >= featEnd && pStartIndex > featStart && (pEndIndex - 1) < featStart) {
                if (DEBUG_MODE) console.log("case Fc,Sc 2");
                delLength1 = featEnd;
                delLength2 = lengthBefore - pStartIndex;
                delLengthBetween = pEndIndex - featEnd;

                feature.deleteAt(pStartIndex, delLength2, lengthBefore, circular);
                lengthBefore2 = lengthBefore - delLength2;
                feature.deleteAt(featEnd, delLengthBetween, lengthBefore2, circular);
                lengthBefore3 = lengthBefore2 - delLengthBetween;
                feature.deleteAt(0, delLength1, lengthBefore3, circular);
            }
            /* Selection start overlap
             * |SSSSSSSSSSSSSSSSS-----------------------------------------------SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS|
             *  FFFFFFFFFFFFFFFFFFF|                                               |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            else if(pStartIndex <= featStart && pEndIndex < featEnd && pStartIndex >= featEnd) {
                if (DEBUG_MODE) console.log("case Fc,Sc 3");
                delLengthOutside = featStart - pStartIndex;
                delLength2 = lengthBefore - featStart;
                feature.deleteAt(featStart, delLength2, lengthBefore, circular);
                lengthBefore2 = lengthBefore - delLength2;
                feature.deleteAt(pStartIndex, delLengthOutside, lengthBefore2, circular);
                lengthBefore3 = lengthBefore2 - delLengthOutside;
                feature.deleteAt(0, pEndIndex, lengthBefore3, circular);
            }
            /* Selection inside feature
             * |SSSSSSSSSSSSSSSSSSSSSSS-----------------------------------------SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS|
             *  FFFFFFFFFFFFFFFFFFF|                                               |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            else if(pEndIndex >= featEnd && pStartIndex <= featStart && pEndIndex <= featStart) {
                if (DEBUG_MODE) console.log("case Fc,Sc 4");
                deletions.push(feature);
            }
            /* Selection double end right overlap
             * |SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS----------------------------SSSSSSSSSSSSSSSSSSSSSSSSSS|
             *  FFFFFFFFFFFFFFFFFFF|             |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
            else if(pEndIndex - 1 >= featStart) {
                if (DEBUG_MODE) console.log("case Fc,Sc 5");
                var delLength2a = pEndIndex - featStart;
                var delLength2b = lengthBefore - pStartIndex;
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
            else if(pStartIndex <= featEnd) {
                if (DEBUG_MODE) console.log("case Fc,Sc 6");
                var delLength1a = pEndIndex;
                var delLength1b = featEnd - pStartIndex;
                delLengthBetween = featStart - featEnd;

                delLength2 = lengthBefore - featStart;
                var newCutStart = pStartIndex - pEndIndex;
                feature.deleteAt(0, delLength1a, lengthBefore, circular);
                lengthBefore2 = lengthBefore - delLength1a;
                feature.deleteAt(newCutStart, delLength1b, lengthBefore2, circular);
                lengthBefore3 = lengthBefore2 - delLength1b;
                feature.deleteAt(featEnd, lengthBefore3 - featEnd, lengthBefore3, circular);

            }
            else {
                //Ext.Error.raise("Unhandled editing case!" + " Selection: [" + pStartIndex + ", " + pEndIndex + "], Feature: [" + featStart + ", " + featEnd + "], Sequence: " + sequence.seqString());
            }
        };

    },

    /**
     * Get list of features in range
     *
     * @param {Number} start Start inclusive
     * @param {Number} end End expclusive 
     * @returns {Teselagen.bio.sequence.dna.Feature[]} features List of features
     */
     featuresByRange: function(pStart, pEnd) {
        var result = [];
        var feat, featStart, featEnd;

        for (var i=0; i < this.features.length; i++) {
            feat        = this.features[i];
            featStart   = feat.getStart();
            featEnd     = feat.getEnd();

            if (pStart < pEnd) { // NORMAL selection
                if (featStart <= featEnd) {
                    if (featStart < pEnd  &&  featEnd > pStart) {
                        result.push(feat);
                    }
                } else {
                    //if (pStart < featEnd || pEnd > featStart) { //ORIG
                    if (pStart < featEnd || pEnd >= featStart) { //DW; should be inclusive
                        result.push(feat); //circ feat
                    }
                } 
            } else {            // CIRCULAR selection
                if (featStart <= featEnd) {
                    if (featStart >= pEnd  &&  featEnd <= pStart) { 
                    //DW orig code WRONG: featEnd < pStart is WRONG; featEnd is exclusive so need =
                        // none
                    } else {
                        result.push(feat);
                    }
                } else {
                    result.push(feat); //circ feat, push all since selection is circ
                }
            }
        }
        return result;
     },

     /**
      * Get list of features at position
      *
      * @param {Number} position Index at which to search for features.
      * @returns {Teselagen.bio.sequence.dna.Feature[]} features List of features
      */
    featuresAt: function(pPosition) {
        var result = [];
        var feat, featStart, featEnd;

        for (var i=0; i < this.features.length; i++) {
            feat        = this.features[i];
            featStart   = feat.getStart();
            featEnd     = feat.getEnd();
            if (featStart <= featEnd) { //Feat is normal
                if (featStart <= pPosition  && featEnd > pPosition) {
                    // DW should be featStart <= not < pPosition 
                    result.push(feat);
                }
            } else { // Feat is circular.
                //if (featStart < pPosition || featEnd > pPosition) { //ORIG
                if (featStart <= pPosition || featEnd > pPosition) { // DW: ORIG WAS WRONG
                    result.push(feat);
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
     * @param {Teselagen.manager.SequenceManager} inputSequenceManager
     * @returns {Teselagen.manager.SequenceManager} reverseSequenceManger
     */
    reverseSequence: function(pSequenceManager) {

        var revComSeq = Teselagen.bio.sequence.DNATools.reverseComplement(pSequenceManager.getSequence());
        /*var revSeqMgr = Ext.create("Teselagen.manager.SequenceManager", {
            name:     pSequenceManager.getName(),
            circular: pSequenceManager.getCircular(),
            sequence: pSequenceManager.getSequence()
        }

        var seqLen = pSequenceManager.getSequence().length;

        var feats   = pSequenceManager.getFeatures();

        for (var i=0; i < feats.length; i++) {
            var newStart = seqLen - feats[i].getEnd() - 1;
            //var revFeat.
        }


        return revSeqMgr;*/
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
        if(this.getNeedsRecalculateComplementSequence()) {
            this.complementSequence = Teselagen.bio.sequence.DNATools.complement(this.sequence);

            this.needsRecalculateComplementSequence = false;
        }
    },
    /**
     *
     * @private
     */
    updateReverseComplementSequence: function() {
        if(this.getNeedsRecalculateReverseComplementSequence()) {
            this.reverseComplementSequence = Teselagen.bio.sequence.DNATools.reverseComplement(this.sequence);

            this.needsRecalculateReverseComplementSequence = false;
        }
    }


});
