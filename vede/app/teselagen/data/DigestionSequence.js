/**
 * @class Teselagen.data.DigestionSequence
 * Class which contains data about a digestionSequence
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.data.DigestionSequence", {
    extend: 'Ext.data.Model',
    fields: [
        {name: '_sequenceManager', type: 'auto'},
        {name: '_startRestrictionEnzyme', type: 'auto'},
        {name: '_endRestrictionEnzyme', type: 'auto'},
        {name: '_startRelativePosition', type: 'int'},
        {name: '_endRelativePosition', type: 'int'},
    ],
});

