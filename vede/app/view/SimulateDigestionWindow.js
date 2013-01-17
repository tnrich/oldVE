/**
 * Simulate digestion window
 * @class Vede.view.SimulateDigestionWindow
 */
Ext.define('Vede.view.SimulateDigestionWindow', {
    extend: 'Ext.window.Window',
    requires: ['Ext.form.Panel', 'Ext.ux.form.MultiSelect', 'Ext.ux.form.ItemSelector'],
    height: 500,
    width: 900,
    resizable: false,
    title: 'Gel Digest',
    modal: true,
    //var enzymeStore = 
    initComponent: function() {
        var groupStore = Ext.create("Ext.data.Store",{
   fields: [
      {name: 'name', type: 'string'},
   ],
    data: [],
});

        var enzymeListStore = Ext.create("Ext.data.Store",{
   // store configs
   fields: [
      {name: 'name', type: 'string'}
   ],
    data: [],
            autoLoad: true,
    sorters: [{property: "name", direction: "ASC"}]
});

var searchStore = Ext.create("Ext.data.Store",{
   // store configs
   fields: ['name'],
    data: [],
});

        var me = this;
                Ext.applyIf(me, {
            dockedItems: [
                {
                    xtype: 'container',
                    height: 470,
                    width: 500,
                    layout: {
                        align: 'stretch',
                        type: 'hbox'
                    },
                    items: [
                        {
                            xtype: 'panel',
                            width: 500,
                            title: 'Enzymes', 
                            flex: 1,
                            layout: {
                                type: 'absolute'
                            } ,
                            items: [
                                {
                                    xtype: 'combobox',
                                    id: 'enzymeGroupSelector-digest',
                                    store: groupStore, //change this store to query database
                                    width: 195,
                                    editable: false,
                                    queryMode: 'local',
                                    value: 'Common',
                                    displayField: 'name',
                                    x: 10,
                                    y: 10
                                },
                                {
                                    xtype: 'combobox',
                                    width: 195,
                                    hideTrigger: true,
                                    valueField: 'name',
                                    emptyText: 'Search for Enzyme',
                                    id: 'enzymeGroupSelector-search',
                                    mode: 'local',
                                    disabled: true,
                                    store: ['One'], 
                                    //disabled: true,
                                    x: 235,
                                    y: 10
                                },
                                {
                                    xtype: 'itemselector', 
                                    height: 370,
                                    width: 420,
                                    id: 'enzymeListSelector-digest',
                                    imagePath: '../../extjs/examples/ux/css/images/',
                                    store: enzymeListStore,
                                    displayField: 'name',
                                    buttons: ["oneRight", "allRight",
                                              "oneLeft", "allLeft"],
                                    buttonsText: {oneRight: ">", allRight: ">>",
                                                  oneLeft: "<", allLeft: "<<"},
                                     valueField: 'name',
                                    x: 10,
                                    y: 40
                                    
                                },
                                {
                                    xtype: 'button',
                                    id: 'digestButton',
                                    width: 90,
                                    text: 'Run Digest',
                                    x: 340,
                                    y: 415
                                }
                            ] 
                        },
                        
                        {
                            xtype: 'panel',
                            height: 500,
                            width: 400,
                            layout: {
                                align: 'middle',
                                type: 'hbox'
                            },
                            dock: 'right',
                            title: 'Digest Results',
                            flex: 1,
                        
                            dockedItems: [
                        {
                            xtype: 'container',
                            height: 400,
                            width: 460,
                            layout: {
                                align: 'middle',
                                type: 'hbox'
                            },
                            dock: 'bottom',
                            items: [
                                {
                                    xtype: 'panel',
                                    height: 400,
                                    width: 400,
                                    layout: {
                                        type: 'absolute'
                                    },
                                    flex: 1,
                                    items: [{
                                        xtype: 'draw',
                                        id: 'drawingSurface',
                                        height: 400,
                                        width: 445,
                                        x: 0,
                                        y: 0
                                            /*items: [{
                                                type: 'rect',
                                                fill: '#000',
                                                width: 400,
                                                height: 400,
                                                x: 0,
                                                y: 0
                                            }]*/
                                    }]
                                },
                            ]
                        }
                    ],
                        
                       items: [
                        {
                            xtype: 'fieldcontainer',
                            height: 40,
                            padding: '10 0 30 10',
                            width: 400,
                            fieldLabel: '',
                            items: [
                                {
                                    xtype: 'combobox',
                                    height: 21,
                                    id: 'ladderSelector',
                                    padding: ' 10 0 0 10',
                                    width: 327,
                                    value: 'GeneRuler 1kb Plus DNA',
                                    store: ['GeneRuler 1kb Plus DNA', 
                                            'GeneRuler 100bp Plus DNA'],
                                    fieldLabel: 'Ladder',
                                    editable: false,
                                    x: 10,
                                    y: 10,

                                }
                            ]
                        }
                    ] 
                        //
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
    },

});
