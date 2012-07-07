/**
 * SequenceManager
 * Main class that provides data to VectorPanel (Pie and Rail representations) and AnnotatePanel.
 * Based off SequenceProvider.as
 * @author Diana Wong
 * @author Zinovii Dmytriv (original author)
 */

Ext.define('Teselagen.manager.SequenceManager', {
    
    constructor: function(inData) {
        
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
        
        
        
        
        return this;
    }
    
    
});