Ext.define('Vede.view.ve.PropertiesWindow', {
    extend: 'Ext.window.Window',
    requires: ["Teselagen.manager.ProjectManager"],
    title: 'Properties',
    id: 'PropertiesWindow',
    modal: true,
    layout: {
    	type: 'vbox',
    	align: 'stretch'
    },
    height: 435,
    width: 400,
    
    
    initComponent: function() {
    	var me = this;
    	Ext.applyIf(me, {
    		items: [
		        {
		        	xtype: 'textfield',
                    fieldLabel: 'Sequence Name',
                    id: 'propertiesWindowSequenceNameField',
                    allowBlank: false,
		        },
		        {
		            xtype: 'textareafield',
		            fieldLabel: 'Description',
                    id: 'propertiesWindowDescriptionArea',
                    height: 100
		        },
		        {
		        	xtype: 'textfield',
                    fieldLabel: 'Owner',
                    id: 'propertiesWindowOwnerField',
                    disabled: true,
                    disabledCls: 'x-panel',
		        },
		        {
		        	xtype: 'textfield',
                    fieldLabel: 'Created',
                    id: 'propertiesWindowCreatedField',
                    disabled: true,
                    disabledCls: 'x-panel',
		        },
		        {
		        	xtype: 'textfield',
                    fieldLabel: 'Last Modified',
                    id: 'propertiesWindowLastModifiedField',
                    disabled: true,
                    disabledCls: 'x-panel',
		        },
		        /*{
		        	xtype: 'gridpanel',
                    forceFit: true,
                    id: 'propertiesWindowPermissionsGrid',
                    
		        },*/
		        {
                    xtype: 'panel',
                    dock: 'bottom',
                    border: 0,
                    height: 50,
                    dockedItems: [
                        {
                            xtype: 'panel',
                            dock: 'top',
                            layout: {
                                pack: 'end',
                                type: 'hbox'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    margin: 10,
                                    padding: 5,
                                    text: 'Cancel',
                                    handler: function() {me.close();}
                                },
                                {
                                    xtype: 'tbseparator'
                                },
                                {
                                    xtype: 'button',
                                    id: 'propertiesWindowOKButton',
                                    margin: 10,
                                    padding: 5,
                                    text: 'Ok',                                    
                                }
                            ]
                        }
                    ]
                }
	        ]
    	});
    	me.callParent(arguments);
    },
});