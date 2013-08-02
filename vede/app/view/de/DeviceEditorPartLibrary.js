Ext.define('Vede.view.de.DeviceEditorPartLibrary', {
    extend: 'Ext.window.Window',
    requires: ["Teselagen.event.DeviceEvent"],
    title: "Part Library",
    cls: 'deviceEditorPartLibrary',
    height: 400,
    width: 700,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    closeAction: "close",
    items: [
        {
            xtype: 'textfield',
            layout: {
                type: 'fit',
                align: 'stretch'
            },
            anchor: '100%',
            height: 30,
            cls: 'partLibrarySearchField',
            width: '98%',
            emptyText: 'Search Part Library',
            emptyCls: 'empty-search-field',
            margin: 13,
            listeners: {
                change: function(field, newValue, oldValue, eOpts) {
                    var win = this.up("window");
                    var grid = win.down("gridpanel[name='deviceEditorPartLibraryGrid']");
                    grid.store.clearFilter();

                    if (newValue) {
                        var matcher = new RegExp(Ext.String.escapeRegex(newValue), "i");
                        grid.store.filter({
                            filterFn: function(record) {
                                return matcher.test(record.get('name')) ||
                                    matcher.test(record.get('genbankStartBP')) ||
                                    matcher.test(record.get('endBP')) ||
                                    matcher.test(record.get('fas')) ||
                                    matcher.test(record.get('revComp')) || 
                                    matcher.test(record.get('partSource'));
                            }
                        });
                    }
                }
            }
        },
        {
            xtype: "gridpanel",
            flex: 1,
            name: "deviceEditorPartLibraryGrid",
            border: false,
            columns: [
                    {
                        xtype: 'gridcolumn',
                        text: 'Name',
                        width: 180,
                        dataIndex: 'name'
                    }, {
                        xtype: 'gridcolumn',
                        text: 'Start BP',
                        width: 100,
                        dataIndex: 'genbankStartBP'
                    },{
                        xtype: 'gridcolumn',
                        text: 'Stop BP',
                        width: 100,
                        dataIndex: 'endBP'
                    },
                    {
                        xtype: 'gridcolumn',
                        text: 'FAS',
                        width: 80,
                        dataIndex: 'fas'
                    },
                    {
                        xtype: 'gridcolumn',
                        text: 'Reverse?',
                        dataIndex: 'revComp',
                        width: 100,
                        renderer: function(val) {
                            val = String(val);
                            val = val.charAt(0).toUpperCase() + val.slice(1);
                            return val;
                        }
                    },
                    {
                        xtype: 'gridcolumn',
                        flex: 1,
                        text: 'Source',
                        width: 80,
                        dataIndex: 'partSource'
                    }
                ],
            listeners: {
                "itemclick": function(grid, part){
                    Vede.application.fireEvent(Teselagen.event.DeviceEvent.VALIDATE_DUPLICATED_PART_NAME, part, part.get("name"), function(identicalPart) {
                        var inspectorController = Vede.application.getController("DeviceEditor.InspectorController");

                        var bin = Teselagen.manager.DeviceDesignManager.getBinByIndex(inspectorController.activeProject,inspectorController.selectedBinIndex);
                        if(bin) {
                            // If the part already exists in the design,
                            // map it to the selected cell. If not,
                            // map the new part to the selected cell
                            // and add it to the design's parts store.
                            var partAdded = false;
                            if(identicalPart) {
                                part = identicalPart;
                            } else {
                                inspectorController.activeProject.parts().add(part);
                                partAdded = true;
                            }
                            
                            var oldPart = inspectorController.selectedCell.getPart();
                            
                            inspectorController.selectedCell.setPart(part);
                            inspectorController.selectedPart = part;
                            var yIndex = inspectorController.activeProject.bins().getAt(inspectorController.selectedBinIndex).cells().indexOf(inspectorController.selectedCell);
                            
                            Teselagen.manager.GridCommandPatternManager.addCommand({
                                type: "PART",
                                data: {
                                    type: "ADD",
                                    x: inspectorController.selectedBinIndex,
                                    y: yIndex,
                                    oldPart: oldPart,
                                    newPart: part,
                                    partAdded: partAdded
                                }
                            });
                            
                            Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_CELL, 
                                    inspectorController.selectedCell, inspectorController.selectedBinIndex, yIndex);
                            
                            grid.up("window").close();
                            var currentTab = Ext.getCmp("mainAppPanel").getActiveTab();
                            var currentTabEl = (currentTab.getEl());
                            currentTabEl.unmask(); 
                        } else {
                            Ext.MessageBox.alert("Error","Failed mapping part from library");
                        }
                    });
                },
                itemcontextmenu: function(view, record, item, index, event) {
    //          Register the context node with the menu so that a Menu Item's handler function can access
    //          it via its parentMenu property.
                var menu = Ext.create("Ext.menu.Menu", {
                    cls: 'partLibraryMenu',
                    items: [{
                        text: 'View in Vector Editor',
                        cls: 'partLibraryViewBtn',
                        listeners: {
                            click: function(item, e, opt) {
                                sequence = Teselagen.manager.ProjectManager.sequences.getById(record.data.sequencefile_id);
                                Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_SEQUENCE_IN_VE, sequence, record);
                            }
                        }
                    }]
                });
                menu.showAt(event.getXY());
                event.stopEvent();
                event.preventDefault;
            }
            }
        }
        ],
    listeners: {
        "close": function(win) {
            var currentTab = Ext.getCmp("mainAppPanel").getActiveTab();
            var currentTabEl = (currentTab.getEl());
            currentTabEl.unmask(); 
        }
    }
});