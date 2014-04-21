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
 *
 * NOTE: When dealing with Features, if there is only one Location, then
 *          sm.getFeatures()[0].getName()
 * is functional.
 * If there is more than one Location, a getLocations()
 * call is necessary:
 *          eg. sm.getFeatures()[0].getLocations[0].getName()
 *
 * REFACTOR NOTE: This class needs to be refactored. This manager represents both a manager as well as the model.
 * The model should not be embedded in the manager.
 *
 * Based off SequenceProvider.as
 *
 * @author Diana Wong
 * @author Zinovii Dmytriv (original author of SequenceProvider.as)
 */

Ext.define("Teselagen.manager.SequenceManager", {


    requires: ["Teselagen.bio.sequence.common.Location",
        "Teselagen.bio.sequence.common.SymbolList",
        "Teselagen.event.SequenceManagerEvent",
        "Teselagen.bio.sequence.dna.Feature",
        "Teselagen.bio.sequence.dna.FeatureNote",
        "Teselagen.bio.sequence.DNATools",
        "Teselagen.utils.FormatUtils",
        "Teselagen.bio.parsers.ParsersManager",
        "Teselagen.bio.parsers.GenbankManager",
        "Teselagen.bio.parsers.Genbank",
        "Teselagen.bio.parsers.GenbankFeatureElement",
        "Teselagen.bio.parsers.GenbankFeatureLocation",
        "Teselagen.bio.parsers.GenbankFeatureQualifier",
        "Teselagen.bio.parsers.GenbankFeaturesKeyword",
        "Teselagen.bio.parsers.GenbankLocusKeyword",
        "Teselagen.bio.parsers.GenbankOriginKeyword",
        "Teselagen.manager.SequenceManagerMemento"
    ],
    /**
     * @cfg {Object} config
     * @cfg {String} name
     * @cfg {Teselagen.bio.sequence.dna.DNASequence} sequence
     */
    config: {
        name: "",
        circular: false,
        sequence: null,
        features: [],

        complementSequence: null,
        reverseComplementSequence: null,
        manualUpdateStarted: false,

        needsRecalculateComplementSequence: true,
        needsRecalculateReverseComplementSequence: true,

        parseMessages: []
    },

    DNATools:                   null,
    updateSequenceChanged:      null, // Teselagen.event.SequenceManagerEvent.SEQUENCE_CHANGED,
    updateSequenceChanging:     null, // Teselagen.event.SequenceManagerEvent.SEQUENCE_CHANGING,
    updateKindFeatureAdd:       null, // Teselagen.event.SequenceManagerEvent.KIND_FEATURE_ADD,
    updateKindFeatureRemove:    null, // Teselagen.event.SequenceManagerEvent.KIND_FEATURE_REMOVE,
    updateKindFeaturesAdd:      null, // Teselagen.event.SequenceManagerEvent.KIND_FEATURES_ADD,
    updateKindFeaturesRemove:   null, // Teselagen.event.SequenceManagerEvent.KIND_FEATURES_REMOVE,
    updateKindSequenceInsert:   null, // Teselagen.event.SequenceManagerEvent.KIND_SEQUENCE_INSERT,
    updateKindSequenceRemove:   null, // Teselagen.event.SequenceManagerEvent.KIND_SEQUENCE_REMOVE,
    updateKindKManualUpdate:    null, // Teselagen.event.SequenceManagerEvent.KIND_MANUAL_UPDATE,
    updateKindSetMemento:       null, // Teselagen.event.SequenceManagerEvent.KIND_SET_MEMENTO,
    updateKindInitialized:      null, // Teselagen.event.SequenceManagerEvent.KIND_INITIALIZED,


    mixins: {
        observable: "Ext.util.Observable"
    },

    /**
     * @param {String} name
     * @param {Boolean} circular
     * @param {Teselagen.bio.sequence.common.SymbolList} sequence
     * @param {Teselagen.bio.sequence.dna.Feature[]} features
     * @returns {Teselagen.manager.SequenceManager}
     * @member Teselagen.manager.SequenceManager
     *
     */
    constructor: function(inData) {
        //this.mixins.observable.constructor.call(this, inData);

        this.DNATools                   = Teselagen.bio.sequence.DNATools;
        //These two are events
        this.updateSequenceChanged      = Teselagen.event.SequenceManagerEvent.SEQUENCE_CHANGED;
        this.updateSequenceChanging     = Teselagen.event.SequenceManagerEvent.SEQUENCE_CHANGING;
        //The following are types of SequenceChanged and SequenceChanging
        this.updateKindFeatureAdd       = Teselagen.event.SequenceManagerEvent.KIND_FEATURE_ADD;
        this.updateKindFeatureRemove    = Teselagen.event.SequenceManagerEvent.KIND_FEATURE_REMOVE;
        this.updateKindFeaturesAdd      = Teselagen.event.SequenceManagerEvent.KIND_FEATURES_ADD;
        this.updateKindFeaturesRemove   = Teselagen.event.SequenceManagerEvent.KIND_FEATURES_REMOVE;
        this.updateKindSequenceInsert   = Teselagen.event.SequenceManagerEvent.KIND_SEQUENCE_INSERT;
        this.updateKindSequenceRemove   = Teselagen.event.SequenceManagerEvent.KIND_SEQUENCE_REMOVE;
        this.updateKindKManualUpdate    = Teselagen.event.SequenceManagerEvent.KIND_MANUAL_UPDATE;
        this.updateKindSetMemento       = Teselagen.event.SequenceManagerEvent.KIND_SET_MEMENTO;
        this.updateKindInitialized      = Teselagen.event.SequenceManagerEvent.KIND_INITIALIZED;

        this.mixins.observable.constructor.call(this, inData);

        //this.addEvents("SequenceChanged");
        /*
        this.addEvents(this.updateSequenceChanged);
        this.addEvents(this.updateSequenceChanging);
        this.addEvents(this.updateKindFeatureAdd);
        this.addEvents(this.updateKindFeatureRemove);
        this.addEvents(this.updateKindFeaturesAdd);
        this.addEvents(this.updateKindFeaturesRemove);
        this.addEvents(this.updateKindSequenceInsert);
        this.addEvents(this.updateKindSequenceRemove);
        this.addEvents(this.updateKindKManualUpdate);
        this.addEvents(this.updateKindSetMemento);
        this.addEvents(this.updateKindInitialized);*/

        //this.callParent([inData]);
        //this.initConfig(inData);


        // Manually set config values. If we use initConfig, manualUpdateStart
        // and End will be called every time one of the values is set.
        if (inData) {
            this.name     = inData.name     || "";
            this.circular = inData.circular || false;
            this.sequence = inData.sequence || Teselagen.bio.sequence.DNATools.createDNA("");
            this.features = inData.features || [];

            this.complementSequence = inData.complementSequence || null;
            this.reverseComplementSequence = inData.reverseComplementSequence || null;
            this.manualUpdateStarted = inData.manualUpdateStarted || false;
            this.needsRecalculateComplementSequence = inData.needsRecalculateComplementSequence || true;
            this.needsRecalculateReverseComplementSequence = inData.needsRecalculateReverseComplementSequence || true;
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
         * @method setCircular
         * @param {Boolean} circular
         */
        this.self.prototype.setCircular = function(pCircular) {
            this.manualUpdateStart();
            this.circular = pCircular;
            this.manualUpdateEnd();
        }
        /**
         * @method setSequence
         * @param {Teselagen.bio.sequence.common.SymbolList} sequence
         */
        this.self.prototype.setSequence = function(pSequence) {
            needsRecalculateComplementSequence = true;
            needsRecalculateReverseComplementSequence = true;
            this.sequence = pSequence;
        }
        /**
         * @method setFeatures
         * @param {Teselagen.bio.sequence.dna.Feature} name
         */
        this.self.prototype.setFeatures = function(pFeatures) {
            this.features = pFeatures;
        }
    },

    /**
     * Adds a message to the parseMessages array. This is meant to hold warnings
     * to be displayed by the import warnings window.
     * @param {String} message The message to add.
     */
    addParseMessage: function(message) {
        this.parseMessages.push(message);
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

        Ext.suspendLayouts();

        Vede.application.fireEvent(this.updateSequenceChanged, this.updateKindSetMemento, null);

        Ext.resumeLayouts(true);
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

        if( pStart < 0 || pEnd < 0 || pStart > this.sequence.getSymbolsLength() || pEnd > this.sequence.getSymbolsLength()) {
            return result;
        }

        if( pStart > pEnd) {
            result = this.DNATools.createDNA(this.sequence.subList(pStart, this.sequence.getSymbolsLength()).seqString() + this.sequence.subList(0, pEnd).seqString());
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

        //console.log("subSeqMan: " + sequence.getSymbolsLength());

        if(pStart < 0 || pEnd < 0 || pStart > sequence.getSymbolsLength() || pEnd > sequence.getSymbolsLength()) {
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
                    clonedFeature1.shift(-pStart, sequence.getSymbolsLength(), circular);
                    subFeatures.push(clonedFeature1);
                }
            } else if ( pStart > pEnd && featStart >= featEnd) {
                // FFFF-------------------FFFF
                // SSSSSS               SSSSSS or
                // SSSS                   SSSS
                if ( pStart <= featStart && pEnd >= featEnd) {
                    var clonedFeature2 = feature.clone();
                    clonedFeature2.shift(-pStart, sequence.getSymbolsLength(), circular);
                    subFeatures.push(clonedFeature2);
                }
            } else if (pStart > pEnd && featStart <= featEnd) {
                // ----------FFFFFFFF---------
                // SSSSSS   SSSSSSSSSSSSSSSSSS or
                // SSSSSS    SSSSSSSSSSSSSSSSS
                if ( pStart <= featStart ) {
                    var clonedFeature3 = feature.clone();
                    clonedFeature3.shift(-pStart, sequence.getSymbolsLength(), circular);
                    subFeatures.push(clonedFeature3);

                // ----------FFFFFFFF---------
                // SSSSSSSSSSSS        SSSSSSS or
                // SSSSSSSS            SSSSSSS  (but this means there is no overlap...)
                } else if ( pEnd > featEnd ) {
                    var clonedFeature4 = feature.clone();
                    clonedFeature4.shift(-pStart, sequence.getSymbolsLength(), circular);
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
     * Adds Feature to sequence manager.
     * @param {Teselagen.bio.sequence.dna.Feature} feature Feature to add
     * @param {Boolean} quiet When true no SequenceManagerEvent will be dispatched
     */
    addFeature: function(pFeature, quiet) {

        if (!quiet && !this.manualUpdateStarted) {
            Vede.application.fireEvent(this.updateSequenceChanging, this.updateKindFeatureAdd, this.createMemento());
        }

        // Ensure that this feature's index is unique among features already present.
        pFeature.setIndex(this.features.length);

        this.features.push(pFeature);

        if (!quiet && !this.manualUpdateStarted) {
            Ext.suspendLayouts();
            Vede.application.fireEvent(this.updateSequenceChanged, this.updateKindFeatureAdd, pFeature);
            Ext.resumeLayouts(true);
        }
    },

    /**
     * Adds list of Features to sequence manager.
     * @param {Teselagen.bio.sequence.dna.Feature[]} featuresToAdd List of features to add
     * @param {Boolean} quiet When true not SequenceProviderEvent will be dispatched
     * @returns {Boolean} done True if successful, False if nothing was done.
     */
    addFeatures: function(pFeaturesToAdd, quiet) {
        if ( !pFeaturesToAdd || pFeaturesToAdd.length === 0) {
            return false; //? null?
        }
        if ( !quiet && !this.manualUpdateStarted) {
            Vede.application.fireEvent(this.updateSequenceChanging, this.updateKindFeaturesAdd, this.createMemento());

        }
        for (var i=0; i < pFeaturesToAdd.length; i++) {
            this.addFeature(pFeaturesToAdd[i], true);
        }
        if (!quiet && !this.manualUpdateStarted) {
            Ext.suspendLayouts();
            Vede.application.fireEvent(this.updateSequenceChanged, this.updateKindFeaturesAdd, pFeaturesToAdd);
            Ext.resumeLayouts(true);
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
        var index = Ext.Array.indexOf(this.features, pFeature);
        if ( index >= 0 ) {
            if (!quiet && !this.manualUpdateStarted) {
                Vede.application.fireEvent(this.updateSequenceChanging, this.updateKindFeatureRemove, this.createMemento());
            }
            //this.features.removeItemAt(index);
            Ext.Array.remove(this.features, pFeature);

            if (!quiet && !this.manualUpdateStarted) {
                Ext.suspendLayouts();
                Vede.application.fireEvent(this.updateSequenceChanged, this.updateKindFeatureRemove, pFeature);
                Ext.resumeLayouts(true);
            }
            return true;
        } else {
            return false;
        }
    },

    /**
     * Remove list of Features to sequence manager.
     * (It is easier to just iterate through your array and use removeFeature() instead.)
     * @param {Teselagen.bio.sequence.dna.Feature[]} featuresToRemove List of features to remove
     * @param {Boolean} quiet When true not SequenceProviderEvent will be dispatched
     * @returns {Boolean} done True if successful, False if nothing was done.
     */
    removeFeatures: function(pFeaturesToRemove, quiet) {
        var i, evt;

        if (!pFeaturesToRemove || pFeaturesToRemove.length === 0) {
            return false;
        }
        if (!pFeaturesToRemove && !this.manualUpdateStarted) {
            Vede.application.fireEvent(this.updateSequenceChanging, this.updateKindFeaturesRemove, this.createMemento());
        }
        for (var i=0; i < pFeaturesToRemove.length; i++) {
            var success = this.removeFeature(pFeaturesToRemove[i], true);
            if (!success) console.warn("Could not remove Feature[" + i  + "] from Sequence.");
        }
        if (!pFeaturesToRemove && !this.manualUpdateStarted) {
            Ext.suspendLayouts();
            Vede.application.fireEvent(this.updateSequenceChanged, this.updateKindFeaturesRemove, pFeaturesToRemove);
            Ext.resumeLayouts(true);
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
     * Converts Features to JSON object to agree with the Teselagen.models.DNAFeature format
     * for loading into properties window
     */
    getFeaturesJSON: function () {
        var features = this.getFeatures();
        var newFeatures = [];
        var length = features.length;

        for (i = 0; i < length; i++) {
            newFeature = features[i].serialize().inData;
            newFeatures.push(newFeature);
        };
        return newFeatures;
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
            Vede.application.fireEvent(this.updateSequenceChanging, this.updateKindSequenceInsert, this.createMemento());
        }
        var success = this.insertSequence(pSequenceManager.getSequence(), pPosition, true);

        if (!success) console.warn("Could not insert a SequenceManager into another SequenceManager.");

        for (var i=0; i<pSequenceManager.getFeatures().length; i++) {
            insertFeature = pSequenceManager.getFeatures()[i].clone();
            //pSequenceManager.getFeatures()[i].shift(pPosition, this.sequence.getSymbolsLength(), this.circular);
            //this.addFeature(pSequenceManager.getFeatures()[i], true); // ERROR need cloning insertFeature

            insertFeature.shift(pPosition, this.sequence.getSymbolsLength(), this.circular);
            this.addFeature(insertFeature, true); // original way
        }

        if(!pQuiet && !this.manualUpdateStarted) {
            Ext.suspendLayouts();
            Vede.application.fireEvent(this.updateSequenceChanged, this.updateKindSequenceInsert, {sequenceProvider: pSequenceManager, position: pPosition});
            Ext.resumeLayouts(true);
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

        if (pPosition < 0 || pPosition > this.sequence.getSymbolsLength() || pInsertSequence.length === 0 ) {
            //console.log(pInsertSequence.seqString());
            return false;
        }
        this.needsRecalculateComplementSequence        = true;
        this.needsRecalculateReverseComplementSequence = true;

        if(!pQuiet && !this.manualUpdateStarted) {
            Vede.application.fireEvent(this.updateSequenceChanging, this.updateKindSequenceInsert, this.createMemento());
        }

        lengthBefore = this.sequence.getSymbolsLength();
        insertSequenceLength = pInsertSequence.getSymbolsLength();

        this.sequence.insertSymbols(pPosition, pInsertSequence.getSymbols());
        // for prior to the fix that allows an array to be taken into insertSymbols
        //this.sequence.insertSymbols(position, [insertSequence.getSymbols()[0], insertSequence.getSymbols()[0]]);
        //console.log(this.sequence.toString() + ":" + insertSequenceLength);

        for (var i=0; i < this.features.length; i++) {
            this.features[i].insertAt(pPosition, insertSequenceLength, lengthBefore, this.circular);
        }
        if(!pQuiet && !this.manualUpdateStarted) {
            Ext.suspendLayouts();
            Vede.application.fireEvent(this.updateSequenceChanged, this.updateKindSequenceInsert, {sequence: pInsertSequence, position: pPosition});
            Ext.resumeLayouts(true);
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
        var lengthBefore = this.sequence.getSymbolsLength();

        //console.log("removeSequence: " + this.sequence);

        // impossible cases
        if (pEndIndex < 0 || pStartIndex < 0 || pStartIndex > lengthBefore || pEndIndex > lengthBefore || pStartIndex === pEndIndex ) {
            return false;
        }

        this.needsRecalculateComplementSequence        = true;
        this.needsRecalculateReverseComplementSequence = true;

        if (!quiet && !this.manualUpdateStarted) {
            Vede.application.fireEvent(this.updateSequenceChanging, this.updateKindSequenceRemove, this.createMemento());
            //DW: Original has bug: used kindSequenceInsert instead
        }
        var DEBUG_MODE = false;

        var deletions = [];
        var delLength1, delLength2;
        var delLengthBetween, delLengthBefore;
        var lengthBefore2, lengthBefore3;
        var delLengthOutside, delLengthInside;

        var features = this.features;
        var sequence = this.sequence;
        var circular = this.circular;
        var feature, featStart, featEnd;

        var removeSequenceLength;

        for (var i=0; i < features.length; i++) {
            var feature = features[i];
            featStart = feature.getStart();
            featEnd   = feature.getEnd();
            //console.log("Feature Info (" + feature.getName() + ") " + featStart + ":" + featEnd);
            //console.log("remove Info " + pStartIndex + ":" + pEndIndex);

            if ( featStart <= featEnd ) {
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
            var success = this.removeFeature(deletions[d], true);
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
            removeSequenceLength = pEndIndex - pStartIndex;
            sequence.deleteSymbols(pStartIndex, removeSequenceLength);
        }



        if(!quiet && !this.manualUpdateStarted) {
            Ext.suspendLayouts();
            Vede.application.fireEvent(this.updateSequenceChanged, this.updateKindSequenceRemove, {position: pStartIndex, length: removeSequenceLength});
            Ext.resumeLayouts(true);
            //DW orig length was length...wrong?
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

                throw Ext.create("Teselagen.bio.BioException", {
                    message: "Unhandled editing case!" + " Selection: [" + pStartIndex + ", " + pEndIndex + "], Feature: [" + featStart + ", " + featEnd + "], Sequence: " + sequence.seqString()
                });
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
                throw Ext.create("Teselagen.bio.BioException", {
                    message: "Unhandled editing case!" + " Selection: [" + pStartIndex + ", " + pEndIndex + "], Feature: [" + featStart + ", " + featEnd + "], Sequence: " + sequence.seqString()
                });
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
                //console.log(feature.getLocations()[0].getStart() +  " : " + feature.getLocations()[0].getEnd());
                feature.deleteAt(pStartIndex, pEndIndex - pStartIndex, lengthBefore, circular);
                if (DEBUG_MODE) console.log("case Fc,Sn 3 ");  ///DEBUGGING HERE
                //console.log(feature.getLocations()[0].getStart() +  " : " + feature.getLocations()[0].getEnd());
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
                } else if(pEndIndex == sequence.getSymbolsLength()) {
                    if (DEBUG_MODE) console.log("case Fc,Sn 6a");
                } else if(pStartIndex == 0) {
                    if (DEBUG_MODE) console.log("case Fc,Sn 6b");
                } else {
                    if (DEBUG_MODE) console.log("case Fc,Sn 6c");
                }

            } else {
                //Ext.Error.raise("Unhandled editing case!" + " Selection: [" + pStartIndex + ", " + pEndIndex + "], Feature: [" + featStart + ", " + featEnd + "], Sequence: " + sequence.seqString());
                throw Ext.create("Teselagen.bio.BioException", {
                    message: "Unhandled editing case!" + " Selection: [" + pStartIndex + ", " + pEndIndex + "], Feature: [" + featStart + ", " + featEnd + "], Sequence: " + sequence.seqString()
                });
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
                //console.log("delLength1a: " + delLength1a);
                //console.log("delLength1b: " + delLength1b);
                //console.log("delLengthBetween: " + delLengthBetween);

                //console.log("StartIndex of cut is less than the feature's end");
                delLength2 = lengthBefore - featStart;
                var newCutStart = pStartIndex - pEndIndex;
                feature.deleteAt(0, delLength1a, lengthBefore, circular);
                //console.log("Current feature properties after deletion 1: " );
                logFeatures();

                lengthBefore2 = lengthBefore - delLength1a;
                feature.deleteAt(newCutStart, delLength1b, lengthBefore2, circular);
                //console.log("Current feature properties after deletion 2: ");
                logFeatures();

                lengthBefore3 = lengthBefore2 - delLength1b;
                feature.deleteAt(featEnd, lengthBefore3 - featEnd, lengthBefore3, circular);
                //console.log("Current feature properties after deletion 3: ");
                logFeatures();
                function logFeatures(){ Ext.each(feature.getLocations(), function(location){
                //console.log("The location properties (start, end): " + location.getStart()+ ", " + location.getEnd());
            });}

            }
            else {
                //Ext.Error.raise("Unhandled editing case!" + " Selection: [" + pStartIndex + ", " + pEndIndex + "], Feature: [" + featStart + ", " + featEnd + "], Sequence: " + sequence.seqString());
                throw Ext.create("Teselagen.bio.BioException", {
                    message: "Unhandled editing case!" + " Selection: [" + pStartIndex + ", " + pEndIndex + "], Feature: [" + featStart + ", " + featEnd + "], Sequence: " + sequence.seqString()
                });
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
                    if (pStart < featEnd || pEnd >= featStart) { //DW; ORIG WAS >, should be inclusive >=
                        result.push(feat); //circ feat
                    }
                }
            } else {            // CIRCULAR selection
                if (featStart <= featEnd) {
                    if (featStart >= pEnd  &&  featEnd <= pStart) {
                    //DW ORIG CODE > instead of >=: featEnd < pStart is WRONG; featEnd is exclusive so need =
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
     * Get list of feature names in range.
     *
     * @param {Number} start Start inclusive
     * @param {Number} end End expclusive
     * @returns {String[]} List of features' names, cleaned up for display in the
     * library.
     */
     featuresByRangeText: function(pStart, pEnd) {
        var features = this.featuresByRange(pStart, pEnd);
        var namesArray = [];
        var result;

        if(features.length === 0) {
            return "None";
        }

        for(var i = 0; i < features.length; i++) {
            namesArray.push(features[i].getName());
        }

        result = namesArray.join(", ");

        // Remove empty feature names.
        result = result.replace(", ,", ", ");

        if(result.charAt(result.length - 1) === ",") {
            result = result.substring(0, result.length - 1);
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
                    // DW : ORIG should be featStart <= not < pPosition
                    result.push(feat);
                }
            } else { // Feat is circular.
                //if (featStart < pPosition || featEnd > pPosition) { //ORIG
                if (featStart <= pPosition || featEnd > pPosition) { // DW: ORIG WAS < instead of <=
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
            Vede.application.fireEvent(this.updateSequenceChanging, this.updateKindKManualUpdate, this.createMemento());
            //dispatcher.dispatchEvent(new SequenceProviderEvent(SequenceProviderEvent.SEQUENCE_CHANGING, SequenceProviderEvent.KIND_MANUAL_UPDATE, createMemento()));
        }
    },

    /**
     * See #manualUpdateStart
     */
    manualUpdateEnd: function() {
        if(this.manualUpdateStarted) {
            Ext.suspendLayouts();
            Vede.application.fireEvent(this.updateSequenceChanged, this.updateKindKManualUpdate, null);
            Ext.resumeLayouts(true);
            //dispatcher.dispatchEvent(new SequenceProviderEvent(SequenceProviderEvent.SEQUENCE_CHANGED, SequenceProviderEvent.KIND_MANUAL_UPDATE, null));

            this.manualUpdateStarted = false;
        }
    },

    /**
    * Clone sequence provider
    *
    * @returns {Teselagen.manager.SequenceManager} clonedSequenceManager Copy of the sequenceManager, deep copy (of sequence and features)
    */
    clone: function() {
        var clonedSeq = Teselagen.bio.sequence.DNATools.createDNA(this.getSequence().seqString());
        var clonedSeqMgr = Ext.create("Teselagen.manager.SequenceManager", {
            name:       this.name,
            circular:   this.circular,
            sequence:   clonedSeq,
            features:   []
        });
        var features = this.features;

        if (features && features.length > 0) {
            for (var i=0; i < features.length; i++) {
                clonedSeqMgr.addFeature(features[i].clone(), true);  //DW: ORIG DOES NOT CLONE FEAT
            }
        }
        return clonedSeqMgr;
    },

    /**
     * Reverse sequence
     * THIS MIGHT BE A BROKEN FUNCTION THAT IS NEVER USED?
     * @param {Teselagen.manager.SequenceManager} inputSequenceManager
     * @returns {Teselagen.manager.SequenceManager} reverseSequenceManger
     */
    reverseSequence: function(pSequenceManager) {

        var revComSeq = Teselagen.bio.sequence.DNATools.reverseComplement(pSequenceManager.getSequence());
        var revSeqMgr = Ext.create("Teselagen.manager.SequenceManager", {
            name:     pSequenceManager.getName(),
            circular: pSequenceManager.getCircular(),
            sequence: revComSeq
        });
        //console.log(pSequenceManager.getSequence().seqString());
        //console.log(revComSeq.seqString());

        var seqLen = pSequenceManager.getSequence().length;

        var feats   = pSequenceManager.getFeatures();

        for (var i=0; i < feats.length; i++) {
            var revFeat, newStart;
            newStart = seqLen - feats[i].getEnd() - 1;
            revFeat = feats[i].clone();
            //console.log("strand: " + revFeat.getStrand());
            revFeat.setStrand(-revFeat.getStrand());
            //console.log("strand: " + revFeat.getStrand());
            revFeat.reverseLocations(revFeat.getStart(), seqLen, pSequenceManager.getCircular());
            revSeqMgr.addFeature(revFeat, true);
        }
        return revSeqMgr;
    },

    /**
     * Reverse complement sequence
     * @returns {Boolean} success
     */
    doReverseComplementSequence: function() {
        this.manualUpdateStart();

        var revComSeq, seqLen, revFeat, newStart, newEnd;

        revComSeq = Teselagen.bio.sequence.DNATools.reverseComplement(this.sequence);
        this.setSequence(revComSeq);

        seqLen = this.sequence.getSymbolsLength();

        var newFeatures = [];
        for (var i=0; i < this.features.length; i++) {
            revFeat = this.features[i].clone(); // DW: ORIG DOES NOT CLONE
            newStart = seqLen - revFeat.getEnd();

            revFeat.setStrand(-revFeat.getStrand());
            revFeat.reverseLocations( newStart, seqLen, this.circular);

            newFeatures.push(revFeat);
        }

        this.features = newFeatures;

        this.needsRecalculateComplementSequence = true;
        this.needsRecalculateReverseComplementSequence = true;

        this.manualUpdateEnd();
        return true;
    },

    /**
     * Rebase sequence. Rotate sequence to new position.
     * Assumes sequence is circular resets new rebase position to be the first index.
     * @param {Number} rebasePosition New position to be the first index
     * @returns {Boolean} done True if successful, False if nothing was done.
     */
    rebaseSequence: function(pRebasePosition) {
        var features = this.features;
        var sequence = this.sequence;
        var seqLen   = this.sequence.getSymbolsLength();

        if(pRebasePosition === undefined || pRebasePosition === 0 || seqLen === 0 || pRebasePosition === seqLen) {
            return false; // nothing to rebase;
        }


        if(pRebasePosition > seqLen) {
            //throw new Error("Invaid rebase position: " + rebasePosition);
            //Ext.Error.raise("Invaid rebase position: " + pRebasePosition);
            throw Ext.create("Teselagen.bio.BioException", {
                message: "Invaid rebase position: " + pRebasePosition
            });
            //console.warn("Invaid rebase position: " + pRebasePosition);
        }

        this.manualUpdateStart();

        this.needsRecalculateComplementSequence = true;
        this.needsRecalculateReverseComplementSequence = true;

        // rebase sequence
        var tmpSequence = sequence.subList(0, pRebasePosition); //symbolList

        sequence.deleteSymbols(0, pRebasePosition);
        sequence.addSymbolList(tmpSequence);  // DW 7.26.2012 added addSymbolList() to SymbolList class to make this work

        // rebase features
        if(features && features.length > 0) {
            for(var i = 0; i < features.length; i++) {
                var shiftBy = -pRebasePosition;
                features[i].shift(shiftBy, seqLen, this.circular);

                // Features can't be rendered with their ends at 0.
                if(features[i].getEnd() === 0) {
                    features[i].setOneEnd(seqLen);
                }
            }
        }

        this.manualUpdateEnd();
        return true;
    },


    /**
     * Converts a Sequence Manager into a Genbank {@link Teselagen.bio.parsers.Genbank}
     * form of the data.
     * @returns {Teselagen.bio.parsers.Genbank} genbank A Genbank model of your data
     */

    toGenbank: function() {

        return Teselagen.utils.FormatUtils.sequenceManagerToGenbank(this);


        /*var result = Ext.create("Teselagen.bio.parsers.Genbank", {});

        // LOCUS
        var date    = (new Date()).toDateString().split(" ");
        var dateStr = date[2] + "-" + date[1].toUpperCase() + "-" + date[3];
        var locusKW = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
            locusName: this.name,
            sequenceLength: this.sequence.getSymbolsLength(),
            linear: !this.circular,
            naType: "DNA",
            strandType: "ds",
            date: dateStr
        });
        result.setLocus(locusKW);

        // FEATURES
        var featKW = Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword", {});
        result.setFeatures(featKW);

        for (var i=0; i < this.features.length; i++) {
            var feat = this.features[i];
            var featElm = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement", {
                keyword: feat.getType(),
                //strand: this.strand,
                strand: feat.getStand(),
                complement: false,
                join: false,
                featureQualifier: [],
                featureLocation: []
            });

            if (feat.getStand() === 1) {
                featElm.setCompelment(false);
            } else {
                featElm.setCompelment(true);
            }

            if (feat.getLocations().length > 1) {
                featElm.setJoin(true);
            }

            featKW.addElement(featElm);

            for (var j=0; j < feat.getLocations().length; j++) {
                var featLoc = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation", {
                    start:  feat.getLocations()[j].getStart(),
                    end:    feat.getLocations()[j].getEnd(),
                    to:     ".."
                });
                featElm.addFeatureLocation(featLoc);
            }

            if (feat.getNotes() !== null) {
                for (var j=0; j < feat.getNotes().length; j++) {
                    var featQual = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {
                        name: feat.getNotes()[j].getName(),
                        value: feat.getNotes()[j].getValue(),
                        quoted: feat.getNotes()[j].getQuoted()
                    });
                    featElm.addFeatureQualifier(featQual);
                }
            }
        }

        // ORIGIN
        var origKW = Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword", {
            sequence: this.sequence.seqString()
        });
        result.setFeatures(origKW);

        return result;*/
    },

    /**
     * Converts a Genbank {@link Teselagen.bio.parsers.Genbank} into a FeaturedDNASequence
     * form of the data.
     *      OUTPUT IS FeaturedDNASequence but not sure if data should be set to "this"
     * @param {Teselagen.bio.parsers.Genbank} genbank A Genbank model of your data
     * @returns {Teselagen.models.FeaturedDNASequence} featuredDNASequence OR THIS OUTPUT
     */
    fromGenbank: function(genbank) {

        var seqMan = Teselagen.utils.FormatUtils.genbankToSequenceManager(genbank);

        return Teselagen.utils.FormatUtils.sequenceManagerToFeaturedDNASequence(seqMan);

        /*var result; // original wants this to be a FeaturedDNASequence NOT SeqMgr!

        var name        = genbank.getLocus().getLocusName();
        var isCirc      = !genbank.getLocus().getLinear(); //genbank.getLocus().getCircular();
        var sequence    = Teselagen.bio.sequence.DNATools.createDNA(genbank.getOrigin().getSequence());
        var features    = [];

        var gbFeats     = genbank.getFeatures().getFeaturesElements();

        for (var i=0; i < gbFeats.length; i++) {
            var locations   = [];
            var notes       = [];
            var featName    = gbFeats[i].getKeyword();
            //var tmpFeat = null;

            for (var j=0; j < gbFeats[i].getFeatureLocation().length; j++) {
                var tmpLoc = Ext.create("Teselagen.bio.sequence.common.Location", {
                    start:  gbFeats[i].getFeatureLocation()[j].getStart(),
                    end:    gbFeats[i].getFeatureLocation()[j].getEnd()
                });
                locations.push(tmpLoc);
            }

            for (var k=0; k < gbFeats[i].getFeatureQualifier().length; k++) {
                var tmpName = gbFeats[i].getFeatureQualifier()[k].getName();
                if (tmpName === "label" | tmpName === "ApEinfo_label" ||
                    tmpName === "note" || tmpName === "gene" ||
                    tmpName === "organism" || tmpName === "name" ) {
                    featName = gbFeats[i].getFeatureQualifier()[k].getValue();
                } //else {
                    //featName = gbFeats[i].getKeyword();
                //}

                var tmpNote = Ext.create("Teselagen.bio.sequence.dna.FeatureNote", {
                    name:   gbFeats[i].getFeatureQualifier()[k].getName(),
                    value:  gbFeats[i].getFeatureQualifier()[k].getValue(),
                    quoted: gbFeats[i].getFeatureQualifier()[k].getQuoted()
                });
                notes.push(tmpNote);
            }

            features[i] = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                name:   featName,
                type:   gbFeats[i].getKeyword(),
                strand: gbFeats[i].getStrand(),
                //start:  gbFeats[i].getFeatureLocation()[0].getStart(),
                //end:    gbFeats[i].getFeatureLocation()[0].getEnd(),
                notes:  notes
            });
            features[i].setNotes(notes);
            features[i].setLocations(locations);
        }

        //result = Ext.create("Teselagen.manager.SequenceManager", {
        //    name: name,
        //    circular: isCirc,
        //    sequence: sequence,
        //    features: features
        //});

        result = Ext.create("Teselagen.models.FeaturedDNASequence", {
            name: name,
            sequence: sequence.seqString(),
            isCircular: isCirc,
            features: features
        });

        this.name = name;
        this.circular = isCirc;
        this.sequence = sequence;
        this.features = features;

        return result;*/
    },

    /**
     * Converts a JbeiSeq XML file into a FeaturedDNASequence form of the data.
     * @param {String} jbeiSeq JbeiSeq XML string of data
     * @returns {Teselagen.models.FeaturedDNASequence} featuredDNASequence or this output?
     */
    fromJbeiSeqXml: function(jbeiSeq) {
        var json = Teselagen.bio.parsers.ParsersManager.jbeiseqXmlToSequenceManager(jbeiXml);
        return Teselagen.bio.parsers.ParsersManager.SequenceManagerToFeaturedDNASequence(json);
    },

    /**
     * Converts a FASTA file into a SequenceManager form of the data.
     * @param {String} pFasta FASTA formated string
     * @returns {Teselagen.models.FeaturedDNASequence} featuredDNASequence or this output
     */
    fromFasta: function(pFasta) {
        return Teselagen.utils.FormatUtils.fastaToFeaturedDNASequence(pFasta);
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

    serialize: function(){
        var data = {};

        var reverseComplement;
        var sequence;

        if(!this.getSequence()) {
            sequence = {
                alphabet: 'dna',
                symbols: ''
            };

            reverseComplement = sequence;
        } else {
            sequence = this.getSequence().serialize();
            reverseComplement = this.getReverseComplementSequence();
        }

        data.features = [];
        data.inData = {
            name: this.getName(),
            circular: this.getCircular(),
            //complementSequence: this.getComplementSequence(),
            reverseComplementSequence: reverseComplement,
            manualUpdateStarted: this.getManualUpdateStarted(),
            needsRecalculateComplementSequence: this.getNeedsRecalculateComplementSequence(),
            //needsRecalculateReverseComplementSequence: this.getNeedsRecalculateReverseComplementSequence()
        }
        this.getFeatures().forEach(function(feature){
            data.features.push(feature.serialize());
        });

        data.sequence = sequence;

        return data;
    },

    deSerialize: function(data){
        var self = this;
        var feature;

        for(var i = 0; i < data.features.length; i++) {
            feature = data.features[i];

            var newFeature = Ext.create("Teselagen.bio.sequence.dna.Feature", feature.inData);
            newFeature.deSerialize(feature);

            self.addFeature(newFeature, true);
        }

        var newSequence = Ext.create("Teselagen.bio.sequence.common.SymbolList",{});
        newSequence.deSerialize(data.sequence);
        this.setSequence(newSequence);
    }
});
