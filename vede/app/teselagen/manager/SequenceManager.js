/**
 * SequenceManager
 * @author Diana Wong
 * @author 
 */

Ext.define('Teselagen.manager.SequenceManager', {
    
    constructor: function(inData) {
        
        var name;
        var circular;
        var sequence;
        
        if (inData) {
            name = inData.name,
            circular = inData.circular,
            sequence = inData.sequence,
            features = inData.features
        }
        
        
        
        
        return this;
    }
    
    
});