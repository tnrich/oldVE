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
    width: 540,
    
    initComponent: function() {
    	var me = this;
    	Ext.applyIf(me, {
    		items: [
		        {
		        	xtype: 'container',
		        	layout: {
		            	type: 'hbox',
		            	align: 'stretch'
		            },
		            flex: 0.9,
		            padding: '20 15 20 15',
		            items: [
	                    {
	                    	xtype: 'gridpanel',
                            forceFit: true,
                            id: 'saveAsWindowProjectsGrid',
                            scroll: 'vertical',
                            flex: 0.3,
                            store: Teselagen.manager.ProjectManager.projects,
                            columns: [
                                {header: 'Projects', dataIndex: 'name'}
                            ]
	                    },{
	                    	xtype: 'gridpanel',
                            forceFit: true,
                            id: 'saveAsWindowSequencesGrid',
                            scroll: 'vertical',
                            flex: 0.7,
                            //store: Teselagen.manager.ProjectManager.projects.getAt(0).sequencesStore,
                            columns: [
                                {header: 'Sequences', dataIndex: 'name'}
                            ]
	                    }
                    ]
		        },{
                    xtype: 'textfield',
                    fieldLabel: 'Sequence Name',
                    id: 'saveAsWindowSequenceNameField',
                    allowBlank: false,
                    padding: '20 15 10 15'
                },{
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
									    id: 'saveAsWindowNewProjectButton',
									    margin: 10,
									    padding: 5,
									    text: 'New Project'
									},
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
                                      id: 'saveAsWindowOKButton',
                                      margin: 10,
                                      padding: 5,
                                      text: 'Ok'                                          
                                  }
                              ]
                          }
                      ]
                  }
                          
	        ]
    	});
    	me.callParent(arguments);
    }
    
});








