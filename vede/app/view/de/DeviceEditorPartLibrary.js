Ext.define('Vede.view.de.DeviceEditorPartLibrary', {
    extend: 'Ext.window.Window',

    title: "Part Library",
    cls: 'deviceEditorPartLibrary',
    height: 400,
    width: 700,
    layout: "fit",
    items: {
        xtype: "gridpanel",
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
                Vede.application.fireEvent(self.DeviceEvent.VALIDATE_DUPLICATED_PART_NAME, part, part.get("name"), function(identicalPart) {
                    var self = this;
                    var bin = self.DeviceDesignManager.getBinByIndex(self.activeProject,self.selectedBinIndex);
                    if(bin) {
                        // If the part already exists in the design,
                        // map it to the selected cell. If not,
                        // map the new part to the selected cell
                        // and add it to the design's parts store.
                        var partAdded = false;
                        if(identicalPart) {
                            part = identicalPart;
                        } else {
                            self.activeProject.parts().add(part);
                            partAdded = true;
                        }
                        
                        var oldPart = self.selectedCell.getPart();
                        
                        self.selectedCell.setPart(part);
                        self.selectedPart = part;
                        var yIndex = self.activeProject.bins().getAt(self.selectedBinIndex).cells().indexOf(self.selectedCell);
                        
                        Teselagen.manager.GridCommandPatternManager.addCommand({
                            type: "PART",
                            data: {
                                type: "ADD",
                                x: self.selectedBinIndex,
                                y: yIndex,
                                oldPart: oldPart,
                                newPart: part,
                                partAdded: partAdded
                            }
                        });
                        
                        Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_CELL, 
                                self.selectedCell, self.selectedBinIndex, yIndex);
                        
                        selectWindow.close();
                        var currentTab = Ext.getCmp("mainAppPanel").getActiveTab();
                        var currentTabEl = (currentTab.getEl());
                        currentTabEl.unmask(); 
                    } else {
                        Ext.MessageBox.alert("Error","Failed mapping part from library");
                    }
                });
            },
        }
    },
    listeners: {
        "close": function(win) {
            var currentTab = Ext.getCmp("mainAppPanel").getActiveTab();
            var currentTabEl = (currentTab.getEl());
            currentTabEl.unmask(); 
        }
    }
});