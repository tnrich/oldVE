/**
 * Simulate digestion window
 * @class Vede.view.SimulateDigestionWindow
 */
Ext.define('Vede.view.SimulateDigestionWindow', {
    extend: 'Ext.window.Window',
    requires: ['Ext.form.Panel', 'Ext.ux.form.MultiSelect', 'Ext.ux.form.ItemSelector'],
    height: 500,
    width: 900,
    layout: {
        align: 'stretch',
        type: 'hbox'
    },
    resizable: true,
    constrainHeader: true,
    title: 'Gel Digest',
    modal: true,
    initComponent: function() {
        var groupStore = Ext.create("Ext.data.Store",{
            fields: [ {name: 'name', type: 'string'}, ],
            data: [],
        });

        var enzymeListStore = Ext.create("Ext.data.Store",{
            // store configs
            fields: [ {name: 'name', type: 'string'} ],
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
            items: [ {
                xtype: 'container',
                height: '100%',
                width: '100%',
                layout: {
                    align: 'stretch',
                    type: 'hbox'
                },
                items: [ {
                    xtype: 'panel',
                    width: 300,
                    title: 'Enzymes', 
                    flex: 0,
                    layout: {
                        align: 'stretch',
                        type: 'vbox'
                    },
                    items: [ 
                    {
                    	xtype: 'panel',
                    	flex: 0,
                    	layout: {
                    		align: 'stretch',
                    		type: 'hbox'
                    	},
                    	items: [{
                            xtype: 'combobox',
                            id: 'enzymeGroupSelector-digest',
                            store: groupStore, //change this store to query database
                            flex: 1,
                            editable: false,
                            queryMode: 'local',
                            value: 'Common',
                            displayField: 'name',
                            x: 10,
                            y: 10
                        },
                        {
                            xtype: 'combobox',
                            flex: 1,
                            hideTrigger: true,
                            valueField: 'name',
                            emptyText: 'Search for Enzyme',
                            id: 'enzymeGroupSelector-search',
                            mode: 'local',
                            disabled: false,
                            //store: ['One'], 
                            //disabled: true,
                            x: 235,
                            y: 10
                        }
                    	]
                    },
                    {
                		xtype: 'itemselector',
                		name: 'itemselector',
                        flex: 1,
                		id: 'enzymeListSelector-digest',
                		imagePath: '/extjs/examples/ux/css/images/',
                		store: enzymeListStore,
                		displayField: 'name',
                		valueField: 'name',
                		buttons: ["add", "remove"],
                		buttonsText: {add: ">", remove: "<"},
                		allowBlank: true,
                		msgTarget: 'side',
                		fromTitle: 'Available',
                		toTitle: 'Selected',
                		//x: 10,
                		//y:40
                	},
                	{xtype: 'panel',
                    	flex: 0,
                    	layout: {
                    		align: 'right',
                    		type: 'vbox'
                    	},
                    	items: [
                            {
                                xtype: 'button',
                                id: 'digestButton',
                                width: 90,
                                text: 'Run Digest',
                                flex: 0
                            }
                            ]
                        
                	}
                	]
                },
                {
                    xtype: 'panel',
                    flex: 1,
                    layout: {
                        align: 'stretch',
                        type: 'vbox'
                    },
                    title: 'Digest Results',

                    items: [ {
                        xtype: 'fieldcontainer',
                        height: 40,
                        padding: '10 0 30 10',
                        width: 400,
                        fieldLabel: '',
                        flex: 0,
                        items: [ {
                            xtype: 'combobox',
                            height: 21,
                            id: 'ladderSelector',
                            padding: ' 10 0 0 10',
                            width: 400,
                            value: 'GeneRuler 1kb Plus DNA',
                            store: ['GeneRuler 1kb Plus DNA', 'GeneRuler 100bp Plus DNA'],
                            fieldLabel: 'Ladder',
                            editable: false,
                            x: 10,
                            y: 10,
                        }]},
                        {
                            xtype: 'panel',
                            flex: 1,
                            layout: {
                                type: 'vbox', 
                                align: 'stretch'
                            },
                            bodyStyle: {
                                background: '#000',
                            },
                            items: [ {
                                xtype: 'draw',
                                id: 'drawingSurface',
                                flex: 1,
                                x: 0,
                                y: 0
                            }
                            ]
                        }
                ]
                }
            ]
        }]});
        me.callParent(arguments);
    },

});
