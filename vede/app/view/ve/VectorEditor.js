Ext.define('Vede.view.ve.VectorEditor', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.VectorEditorPanel',
	id: 'VectorEditor',
	layout: {
		type: 'fit'
	},
	title: 'Vector Editor',
	dockedItems: [{
		xtype: 'panel',
		dock: 'top',
		id: 'MainMenuPanel',
		layout: {
			align: 'stretch',
			type: 'vbox'
		},
		items: [{
			xtype: 'toolbar',
			flex: 1,
			hidden: false,
			id: 'VectorEditorMenuBar',
			autoScroll: false,
			items: [{
				xtype: 'button',
				text: 'File',
				menu: {
					xtype: 'menu',
					floating: true,
					minWidth: 140,
					width: 120,
					collapsed: false,
					collapsible: false,
					hideCollapseTool: false,
					titleCollapse: false,
					plain: false,
					items: [{
						xtype: 'menuitem',
						id: 'importMenuItem',
						plain: false,
						text: 'Import from File'
					}, {
						xtype: 'menuitem',
						text: 'Download Genbank'
					}, {
						xtype: 'menuseparator'
					}, {
						xtype: 'menuitem',
						text: 'Project Properties'
					}, {
						xtype: 'menuitem',
						text: 'Print',
						menu: {
							xtype: 'menu',
							width: 120,
							items: [{
								xtype: 'menuitem',
								text: 'Sequence'
							}, {
								xtype: 'menuitem',
								text: 'Circular View'
							}, {
								xtype: 'menuitem',
								text: 'Linear View'
							}]
						}
					}]
				}
			}, {
				xtype: 'button',
				text: 'Edit',
				menu: {
					xtype: 'menu',
					minWidth: 150,
					width: 120,
					items: [{
						xtype: 'menuitem',
						id: 'undoMenuItem',
						text: 'Undo'
					}, {
						xtype: 'menuitem',
						id: 'redoMenuItem',
						text: 'Redo'
					}, {
						xtype: 'menuseparator'
					}, {
						xtype: 'menuitem',
						text: 'Copy'
					}, {
						xtype: 'menuitem',
						text: 'Cut'
					}, {
						xtype: 'menuitem',
						text: 'Paste'
					}, {
						xtype: 'menuseparator'
					}, {
						xtype: 'menuitem',
						id: 'findMenuItem',
						text: 'Find...'
					}, {
						xtype: 'menuitem',
						text: 'Go To...'
					}, {
						xtype: 'menuseparator'
					}, {
						xtype: 'menuitem',
						id: 'selectMenuItem',
						text: 'Select...'
					}, {
						xtype: 'menuitem',
						id: 'selectAllMenuItem',
						text: 'Select All'
					}, {
						xtype: 'menuitem',
						id: 'selectInverseMenuItem',
						text: 'Select Inverse'
					}, {
						xtype: 'menuseparator'
					}, {
						xtype: 'menuitem',
						itemId: 'reverseComplementMenuItem',
						text: 'Reverse Complement'
					}, {
						xtype: 'menuitem',
						id: 'rebaseMenuItem',
						text: 'Rotate to Here'
					}]
				}
			}, {
				xtype: 'button',
				text: 'View',
				menu: {
					xtype: 'menu',
					width: 120,
					items: [{
						xtype: 'menucheckitem',
						id: 'circularViewMenuItem',
						text: 'Circular',
						checked: true,
						group: 'lineType'
					}, {
						xtype: 'menucheckitem',
						id: 'linearViewMenuItem',
						text: 'Linear',
						group: 'lineType'
					}, {
						xtype: 'menuseparator'
					}, {
						xtype: 'menucheckitem',
						id: 'featuresMenuItem',
						text: 'Features',
						checked: true
					}, {
						xtype: 'menucheckitem',
						id: 'cutSitesMenuItem',
						text: 'Cut Sites'
					}, {
						xtype: 'menucheckitem',
						id: 'orfsMenuItem',
						text: 'ORF'
					}, {
						xtype: 'menuseparator'
					}, {
						xtype: 'menucheckitem',
						id: 'showComplementaryMenuItem',
						text: 'Complementary',
						checked: true
					}, {
						xtype: 'menucheckitem',
						id: 'showSpacesMenuItem',
						text: 'Spaces',
						checked: true
					}, {
						xtype: 'menucheckitem',
						id: 'showSequenceAAMenuItem',
						text: 'Sequence AA'
					}, {
						xtype: 'menucheckitem',
						id: 'showRevcomAAMenuItem',
						text: 'Revcom AA'
					}, {
						xtype: 'menuseparator'
					}, {
						xtype: 'menucheckitem',
						id: 'featureLabelsMenuItem',
						text: 'Feature Labels',
						checked: true
					}, {
						xtype: 'menucheckitem',
						id: 'cutSiteLabelsMenuItem',
						text: 'Cut Site Labels',
						checked: true
					}]
				}
			}, {
				xtype: 'button',
				text: 'Tools',
				menu: {
					xtype: 'menu',
					minWidth: 140,
					width: 120,
					items: [{
						xtype: 'menuitem',
						text: 'Create New Feature'
					}, {
						xtype: 'menuitem',
						id: 'restrictionEnzymesManagerMenuItem',
						text: 'Restriction Enzymes Manager'
					}, {
						xtype: 'menuitem',
						id: 'simulateDigestionMenuItem',
						text: 'Simulate Digestion'
					}, {
						xtype: 'menuitem',
						text: 'Properties'
					}, {
						xtype: 'menuseparator'
					}, {
						xtype: 'menuitem',
						text: 'Preferences'
					}]
				}
			}, {
				xtype: 'button',
				text: 'Help',
				menu: {
					xtype: 'menu',
					width: 120,
					items: [{
						xtype: 'menuitem',
						text: 'Suggest Feature'
					}, {
						xtype: 'menuitem',
						text: 'Report Bug'
					}, {
						xtype: 'menuseparator'
					}, {
						xtype: 'menuitem',
						text: 'About'
					}]
				}
			}]
		}, {
			xtype: 'toolbar',
			flex: 2,
			id: 'VectorEditorMainToolBar',
			items: [{
				xtype: 'button',
				id: 'exportBtn',
				icon: 'resources/images/export.png',
				scale: 'medium',
				tooltip: 'Save to Registry'
			}, {
				xtype: 'button',
				id: 'saveBtn',
				icon: 'resources/images/save.png',
				scale: 'medium',
				tooltip: 'Save Project'
			}, {
				xtype: 'button',
				id: 'projectPropsBtn',
				icon: 'resources/images/project_properties.png',
				scale: 'medium',
				tooltip: 'Project Properties'
			}, {
				xtype: 'button',
				id: 'circularViewBtn',
				enableToggle: true,
				icon: 'resources/images/pie.png',
				pressed: true,
				scale: 'medium',
				tooltip: 'Circular View'
			}, {
				xtype: 'button',
				id: 'linearViewBtn',
				enableToggle: true,
				icon: 'resources/images/rail.png',
				scale: 'medium',
				tooltip: 'Linear View'
			}, {
				xtype: 'button',
				id: 'copyBtn',
				icon: 'resources/images/copy.png',
				scale: 'medium',
				tooltip: 'Copy'
			}, {
				xtype: 'button',
				id: 'cutBtn',
				icon: 'resources/images/cut.png',
				scale: 'medium',
				tooltip: 'Cut'
			}, {
				xtype: 'button',
				id: 'pasteBtn',
				icon: 'resources/images/paste.png',
				scale: 'medium',
				tooltip: 'Paste'
			}, {
				xtype: 'button',
				id: 'undoBtn',
				icon: 'resources/images/undo.png',
				scale: 'medium',
				tooltip: 'Undo'
			}, {
				xtype: 'button',
				id: 'redoBtn',
				icon: 'resources/images/redo.png',
				scale: 'medium',
				tooltip: 'Redo'
			}, {
				xtype: 'button',
				id: 'safeBtn',
				icon: 'resources/images/safe_editing.png',
				scale: 'medium',
				tooltip: 'Safe Editing'
			}, {
				xtype: 'button',
				id: 'findBtn',
				icon: 'resources/images/find.png',
				scale: 'medium',
				tooltip: 'Find...'
			}, {
				xtype: 'button',
				id: 'featuresBtn',
				enableToggle: true,
				icon: 'resources/images/features.png',
				pressed: true,
				scale: 'medium',
				tooltip: 'Show Features'
			}, {
				xtype: 'button',
				id: 'cutsitesBtn',
				enableToggle: true,
				icon: 'resources/images/cut_sites.png',
				scale: 'medium',
				tooltip: 'Show Cut Sites'
			}, {
				xtype: 'button',
				id: 'orfsBtn',
				enableToggle: true,
				icon: 'resources/images/orf.png',
				scale: 'medium',
				tooltip: 'Show ORF'
			}, {
				xtype: 'button',
				id: 'reBtn',
				icon: 'resources/images/restriction_enzymes.png',
				scale: 'medium',
				tooltip: 'Show Restriction Enzymes'
			}, {
				xtype: 'button',
				id: 'propsBtn',
				icon: 'resources/images/properties.png',
				scale: 'medium',
				tooltip: 'Properties'
			}]
		}]
	}, {
		xtype: 'panel',
		dock: 'bottom',
		height: 23,
		id: 'StatusPanel',
		layout: {
			type: 'fit'
		},
		headerPosition: 'bottom',
		dockedItems: [{
			xtype: 'toolbar',
			dock: 'top',
			id: 'StatusBar',
			items: [{
				xtype: 'tbfill'
			}, {
				xtype: 'tbseparator'
			}, {
				xtype: 'tbtext',
				text: 'Read only'
			}, {
				xtype: 'tbseparator'
			}, {
				xtype: 'tbspacer',
				width: 10
			}, {
				xtype: 'tbseparator'
			}, {
				xtype: 'tbtext',
				text: '- : -'
			}, {
				xtype: 'tbseparator'
			}, {
				xtype: 'tbtext',
				text: '0'
			}]
		}]
	}],
	items: [{
		xtype: 'panel',
		id: 'VectorEditorPanel',
		layout: {
			align: 'stretch',
			type: 'hbox'
		},
		items: [{
			xtype: 'panel',
			flex: 1,
			flex: 1,
			floating: false,
			id: 'VectorPanel',
			layout: {
				type: 'fit'
			},
			animCollapse: false,
			collapseDirection: 'left',
			collapsed: false,
			collapsible: true,
			title: 'Vector',
			items: [{
				xtype: 'container',
				id: 'PieContainer',
				layout: {
					type: 'fit'
				}
			}, {
				xtype: 'container',
				hidden: false,
				id: 'RailContainer',
				layout: {
					type: 'fit'
				}
			}]
		}, {
			xtype: 'splitter',
			collapseTarget: 'prev'
		}, {
			xtype: 'panel',
			flex: 2,
			id: 'AnnotatePanel',
			autoScroll: true,
			layout: {
				type: 'fit'
			},
			animCollapse: false,
			collapsible: false,
			title: 'Annotate',
			items: [{
				xtype: 'container',
				overflowY: 'scroll',
				id: 'AnnotateContainer',
				layout: {
					type: 'fit'
				}
			}]
		}]
	}]
});