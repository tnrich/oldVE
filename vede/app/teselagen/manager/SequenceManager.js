/**
 * SequenceManager
 * Main class that provides data to VectorPanel (Pie and Rail representations) and AnnotatePanel.
 * Based off SequenceProvider.as
 * @author Diana Wong
 * @author Zinovii Dmytriv (original author)
 */

Ext.define('Teselagen.manager.SequenceManager', {
    
    constructor: function(inData) {
        var that = this;
        
        var name;
        var circular;
        var sequence;
        var features;
        
        if (inData) {
            name = inData.name,
            circular = inData.circular,
            sequence = inData.sequence,
            features = inData.features
        }
        
        this.getName = function () {
            return = that.name;
        }
        this.setName = function(pName) {
            that.name = pName;
        }
        this.getCircular = function () {
            return = that.circular;
        }
        this.setCircular = function(pCircular) {
            that.circular = pCircular;
        }
        this.getSequence = function () {
            return = that.sequence;
        }
        this.setSequence = function(pSequence) {
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
    
    fromGenbank: function(genbank) {
        var result;
        
        
        
        return result;
        
    }
    
    
});