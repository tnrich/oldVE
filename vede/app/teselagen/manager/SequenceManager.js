/**
 * SequenceManager
 * Main class that provides data to VectorPanel (Pie and Rail representations) and AnnotatePanel.
 * Based off SequenceProvider.as
 * @author Diana Wong
 * @author Zinovii Dmytriv (original author of SequenceProvider.as)
 */

Ext.define('Teselagen.manager.SequenceManager', {

    constructor: function(inData) {
        var that = this;

        var name;
        var circular;
        var sequence;
        var features;

        var complementSequence;
        var reverseComplementSequence;
        var manualUpdateStarted = false;
        var needsRecalculateComplementSequence = true;
        var needsRecalculateReverseComplementSequence = true;
        //var dispactcher;

        if (inData) {
            name = inData.name || null;
            circular = inData.circular || false;
            sequence = inData.sequence || null;
            features = inData.features || [];
        }

        this.getName = function () {
            return = that.name;
        }
        this.setName = function(pName) {
            //manualUpdateStart();
            that.name = pName;
            //manualUpdateEnd();
        }
        this.getCircular = function () {
            return = that.circular;
        }
        this.setCircular = function(pCircular) {
            //manualUpdateStart();
            that.circular = pCircular;
            //manualUpdateEnd();
        }
        this.getSequence = function () {
            return = that.sequence;
        }
        this.setSequence = function(pSequence) {
            needsRecalculateComplementSequence = true;
            needsRecalculateReverseComplementSequence = true;
            that.sequence = pSequence;
        }
        this.getFeatures = function () {
            return = that.features;
        }
        this.setFeatures = function(pFeatures) {
            that.features = pFeatures;
        }


        return this;
    },
    
    getManualUpdateStarted:function() {
        return manualUpdateStarted;
    },
    
    //part of IOriginator Interface
    // Build in lib/common
    createMemento: function() {
        //
    },
    
    setMemento: function(pMemento) {
        var sequenceManagerMemento = pMemento;
        
        //BUILD SequenceManagerMemento == SequenceProviderMemento class in lib/common
        name = sequenceManagerMemento.name;
        circular = sequenceManagerMemento.circular;
        sequence = sequenceManagerMemento.sequence;
        features = sequenceManagerMemento.features;
        
        needsRecalculateComplementSequence = true;
        needsRecalculateReverseComplementSequence = true;
        
        //dispatcher;
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
        return complementSequence;
    },
    
    getReverseComplementSequence: function() {
        //updateReverseComplementSequence();
        return reverseComplementSequence;
    },
    
    /**
     * Sub sequence by range
     * @param {int} start Range start
     * @param {int} end Range end
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
     * @param {int} start Range start
     * @param {int} end Range end
     */
    subSequenceProvider: function(start, end) {
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
                    //var clonedFeature1 = feature.clone();
                    //clonedFeature1.shift(-start, sequence.length, circular);
                    //subfeatures.addItem(clonedFeature1);
                }
            } else if ( start > end && feature.start >=feature.end) {
                if ( start <= feature.start && end >= feature.end) {
                    var clonedFeature2 = feature.clone();
                    clonedFeature2.shif(-start, sequence.length, circular);
                    subFeatures.addItem(clonedFeature2);
                }
            } else if (start > end && feature.start <= feature.end) {
                if ( start <= feature.start ) {
                    var 
                }
            }
                }
            }
            }
        }
        
        
    }
    

    fromGenbank: function(genbank) {
        var result;


        return result;

    }


});