/**
 * @class Teselagen.models.DigestionSequence
 * Class which contains data about a digestionSequence
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.models.DigestionSequence", {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'sequenceManager', type: 'auto'},
        {name: 'startRestrictionEnzyme', type: 'auto'},
        {name: 'endRestrictionEnzyme', type: 'auto'},
        {name: 'startRelativePosition', type: 'int'},
        {name: 'endRelativePosition', type: 'int'},
    ],
});

