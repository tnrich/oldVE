Ext.define('Vede.view.ve.SaveAsWindow', {
    extend: 'Ext.window.Window',
    requires: ["Teselagen.manager.ProjectManager"],
    title: 'Save As...',
    id: 'SaveAsWindow',
    modal: true,
    layout: {
    	type: 'vbox',
    	align: 'stretch'
    },
    height: 400,
    width: 600,
    
    initComponent: function() {
    	var me = this;
    	Ext.applyIf(me, {
    		items: [
                {
                    xtype: 'textfield',
                    anchor: '100%',
                    height: 30,
                    cls: 'saveAsWindowSearchField',
                    width: '98%',
                    emptyText: 'Filter By Name',
                    listeners: {
                        change: function(field, newValue, oldValue, eOpts) {
                            var store = Teselagen.manager.ProjectManager.sequences;
                            store.clearFilter();
                            store.remoteFilter = true;
                            store.on('load', function(s){ 
                                s.remoteFilter = false; 
                            }, this, { single: true })
                            
                            store.filter("name", Ext.String.escapeRegex(newValue));
                        }
                    }
                },
		        {
                    xtype: 'gridpanel',
                    forceFit: true,
                    flex: 1,
                    id: 'saveAsWindowSequencesGrid',
                    scroll: 'vertical',
                    columns: [{
                            text: 'Sequences',
                            dataIndex: 'name'
                        }, {
                            text: 'Size',
                            dataIndex: 'size',
                        }, {
                            text: 'Features',
                            dataIndex: 'serialize',
                            sortable: false,
                            renderer: function(val) {
                                if(val) {
                                    var features = [];
                                    for(var i=0; i<val.features.length; i++) {
                                        features.push(val.features[i].inData.name);
                                    }
                                    return features;
                                } else {
                                    return "";
                                }
                            }
                        }, {
                            text: 'Last Modified',
                            dataIndex: 'dateModified',
                            renderer: Ext.util.Format.dateRenderer('F d, Y g:i A')
                        }
                    ],
                    dockedItems: [{
                        xtype: 'pagingtoolbar',
                        dock: 'bottom',
                        store: Teselagen.manager.ProjectManager.sequences,
                        displayInfo: true
                    }]
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Save As:',
                    maxHeight: 30,
                    id: 'saveAsWindowSequenceNameField',
                    allowBlank: false,
                }, {
                    xtype: 'container',
                    maxHeight: 40,
                    layout: {
                        pack: 'end',
                        type: 'hbox'
                    },
                    items: [{
                            xtype: 'button',
                            margin: 10,
                            text: 'Cancel',
                            handler: function() {
                                me.down('grid').store.clearFilter();
                                me.down('grid').store.load();
                                me.close();
                            }
                        }, {
                            xtype: 'tbseparator'
                        }, {
                            xtype: 'button',
                            id: 'saveAsWindowOKButton',
                            margin: 10,
                            text: 'Ok'
                        }
                    ]
                }
	        ]
    	});
    	me.callParent(arguments);
    }
});








