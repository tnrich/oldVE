Ext.define('Vede.view.common.ProjectPanelView', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.ProjectPanelView',

				
                    region: 'west',
                    split: true,
                    id: 'projectPanel',
                    maxWidth: 230,
                    minWidth: 228,
                    width: 228,
                    collapseDirection: 'left',
                    collapsible: true,
                    frameHeader: false,
                    hideCollapseTool: false,
                    preventHeader: false,
                    title: 'Project',
                    activeTab: 0,
                    plain: false,
                    removePanelHeader: false,
                    items: [
                        {
                            xtype: 'panel',
                            id: 'projectDesignTab',
                            layout: {
                                type: 'fit'
                            },
                            minButtonWidth: 32,
                            tabConfig: {
                                xtype: 'tab',
                                id: 'projectTab1',
                                autoWidth: true,
                                icon: 'resources/images/ux/designTab.png',
                                iconCls: 'projectBarButton'
                            },
                            items: [
                                {
                                    xtype: 'treepanel',
                                    id: 'projectDesignPanel',
                                    title: 'Your Designs',
                                    viewConfig: {

                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            id: 'projectAnalysisTab',
                            layout: {
                                type: 'fit'
                            },
                            tabConfig: {
                                xtype: 'tab',
                                id: 'projectTab2',
                                icon: 'resources/images/ux/graphTab.png',
                                iconCls: 'projectBarButton'
                            },
                            items: [
                                {
                                    xtype: 'treepanel',
                                    id: 'projectAnalysisPanel',
                                    title: 'j5 Results',
                                    viewConfig: {

                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            id: 'projectPartsTab',
                            layout: {
                                type: 'fit'
                            },
                            tabConfig: {
                                xtype: 'tab',
                                id: 'projectTab3',
                                icon: 'resources/images/ux/partsTab.png',
                                iconCls: 'projectBarButton'
                            },
                            items: [
                                {
                                    xtype: 'treepanel',
                                    id: 'projectPartsPanel',
                                    title: 'Your Parts',
                                    viewConfig: {

                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            id: 'projectRegistryTab',
                            layout: {
                                type: 'fit'
                            },
                            tabConfig: {
                                xtype: 'tab',
                                id: 'projectTab4',
                                autoWidth: false,
                                icon: 'resources/images/ux/registryTab.png',
                                iconCls: 'projectBarButton'
                            },
                            items: [
                                {
                                    xtype: 'treepanel',
                                    id: 'projectsRegistryPanel',
                                    title: 'Registry',
                                    viewConfig: {

                                    }
                                }
                            ]
                        }
                    ]
                });