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

