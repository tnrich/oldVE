/**
 * SequenceManager
 * Main class that provides data to VectorPanel (Pie and Rail representations) and AnnotatePanel.
 * Based off SequenceProvider.as
 * @author Diana Wong
 * @author Zinovii Dmytriv (original author of SequenceProvider.as)
 */

Ext.define("Teselagen.manager.SequenceManager", {\

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

        dispatcher: null
    },

    mixins: {
        observable: "Ext.util.Observable"
    },

    /**
     * @param {String} name
     * @param {Boolean} circular
     * @param {String} sequence
     * @param {Feature]} features
     * @returns {SequenceManager}
     * @memberOf SequenceManager
     * 
     */
    constructor: function(inData) {
        this.mixins.observable.constructor.call(this, inData);
        this.addEvents("SequenceChanged");

        /*var name;
        var circular;
        var sequence;
        var features;

        var complementSequence;
        var reverseComplementSequence;
        var manualUpdateStarted = false;
        
        var needsRecalculateComplementSequence = true;
        var needsRecalculateReverseComplementSequence = true;
        //var dispactcher;*/

        if (inData) {
            this.name = inData.name || null;
            this.circular = inData.circular || false;
            this.sequence = inData.sequence || null;
            this.features = inData.features || [];
        }

        /*this.getName = function () {
            return this.name;
        }*/
        this.setName = function(pName) {
            //manualUpdateStart();
            this.name = pName;
            //manualUpdateEnd();
        }
        /*this.getCircular = function () {
            return this.circular;
        }*/
        this.setCircular = function(pCircular) {
            //manualUpdateStart();
            this.circular = pCircular;
            //manualUpdateEnd();
        }
        /*this.getSequence = function () {
            return this.sequence;
        }*/
        this.setSequence = function(pSequence) {
            needsRecalculateComplementSequence = true;
            needsRecalculateReverseComplementSequence = true;
            this.sequence = pSequence;
        }
        /*this.getFeatures = function () {
            return this.features;
        }*/
        this.setFeatures = function(pFeatures) {
            this.features = pFeatures;
        }
    },

    getManualUpdateStarted:function() {
        return this.manualUpdateStarted;
    },

    //part of IOriginator Interface
    // Build in lib/common
    createMemento: function() {
        //
        return null;
    },

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

    addEventListener: function(type, listener) {
        //dispatcher.addEventListener(type, listener);
    },

    removeEventListener: function(type, listener) {
        //dispatcher.removeEventListener(type, listener);
    },

    dispatchEvent: function(event) {
        //dispatcher.dispatchEvent(event);
    },

    getComplementSequence: function() {
        //updateComplementSequence();
        return this.complementSequence;
    },

    getReverseComplementSequence: function() {
        //updateReverseComplementSequence();
        return this.reverseComplementSequence;
    },

    /**
     * Sub sequence by range
     * @param {Number} start Range start
     * @param {Number} end Range end
     */
    subSequence: function(start,end) {
        var result = Ext.define("Teselagen.bio.sequence.common.SymbolList"); //SymbolList

        if(start < 0 || end < 0 || start > sequence.length || end > sequence.length) {
            return result;
        }

        if(start > end) {
            //result = DNATools.createDNA(sequence.subList(start, sequence.length).seqString() + sequence.subList(0, end).seqString());
        } else {
            //result = sequence.subList(start, end);
        }

        return result;
    },

    /**
     * Sub sequence manager by range
     * @param {Number} start Range start
     * @param {Number} end Range end
     * Was subSequenceProvider
     */
    subSequenceManager: function(start, end) {
        
        var featuredSubSequence = null; //SequenceManger

        if(start < 0 || end < 0 || start > sequence.length || end > sequence.length) {
            return featuredSubSequence;
        }

        var featuredSubSymbolList = subSequence(start, end); //SymbolList

        var subFeatures = {}; // ArrayCollection?


        for (var i=0; i > features.length; i++) {
            var feature = features[i]; //Feature

            if ( start < end && feature.start < end ) { // only do this when the end is after the start
                if ( start <= feature.start && end >= feature.end ) { //
                    var clonedFeature1 = feature.clone();
                    clonedFeature1.shift(-start, sequence.length, circular);
                    subfeatures.addItem(clonedFeature1);
                }
            } else if ( start > end && feature.start >=feature.end) {
                if ( start <= feature.start && end >= feature.end) {
                    var clonedFeature2 = feature.clone();
                    clonedFeature2.shift(-start, sequence.length, circular);
                    subFeatures.addItem(clonedFeature2);
                }
            } else if (start > end && feature.start <= feature.end) {
                if ( start <= feature.start ) {
                    var clonedFeature3 = feature.clone();
                    clonedFeature3.shift(-start, sequence.length, circular);
                    subFeatures.addItem(clonedFeature3);
                } else if ( end > feature.end ) {
                    var clonedFeature4 = feature.clone();
                    clonedFeature4.shift(-start, sequence.length, circular);
                    subFeatures.addItem(clonedFeature4);
                }
            }
        }
        featuredSubSequence = Ext.create("Teselagen.manager.SequenceManager", {
            name: "Dummy",
            circular: false,
            sequence: featuredSubSymbloList,
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
        
        if (!quiet && !manualUpdateStarted) {
            //var evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: createMemento()  
            //}
            //dispatcher.dispatchEvent(evt);
        }
        features.addItem(feature);

        if (!quiet && !manualUpdateStarted) {
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
        if ( !quiet && !manualUpdateStarted) {
            //evt = Ext.create("SequenceManagerEvent", {
            //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
            //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
            //    blah3: createMemento()  
            //}
            //dispatcher.dispatchEvent(evt)
        }
        for (var i=0; i<featuresToAdd.length; i++) {
            addFeature(featuresToAdd[i], true);
        }
        if (!quiet && !manualUpdateStarted) {
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
        var index = features.getItemIndex(feature);

        if ( index >= 0 ) {
            if (!quiet && !manualUpdateStarted) {
                //evt = Ext.create("SequenceManagerEvent", {
                //    blah1: SequenceProviderEvent.SEQUENCE_CHANGING,
                //    blah2: SequenceProviderEvent.KIND_FEATURE_ADD,
                //    blah3: createMemento()  
                //}
                //dispatcher.dispatchEvent(evt);
            }
            features.removeItemAt(index);
            if (!quiet && !manualUpdateStarted) {
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
        needsRecalculateComplementSequence = true;
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
        var lengthBefore,

        lengthBefore = this.sequence.length;
    },

    fromGenbank: function(genbank) {
        var result;


        return result;

    }


});
