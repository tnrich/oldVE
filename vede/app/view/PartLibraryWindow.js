/**
 * Device Editor Pat Library
 * @class Vede.view.de.PartLibraryPanel
 */
Ext.define('Vede.view.PartLibraryWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.partLibrary',
    title: 'Part Library',
    height: 200,
    width: 400,
    layout: 'fit',
    closeAction: 'hide',
    //renderTo: currentTabEl,
    items: {
        xtype: 'grid',
        id: 'partLibraryGridList',
        border: false,
        columns: {
            items: {
                text: "Name",
                dataIndex: "name"
            },
            defaults: {
                flex: 1
            }
        },
        listeners: {
            "itemclick": function(grid, part, item) {
                /*
                var bin = self.DeviceDesignManager.getBinByPart(self.activeProject,
                self.selectedPart);

                part.getSequenceFile({
                    callback: function(sequence) {
                        if (bin) {
                            var insertIndex = bin.parts().indexOf(self.selectedPart);
                            var binIndex = self.DeviceDesignManager.getBinIndex(self.activeProject, bin);
                            bin.parts().removeAt(insertIndex);
                            bin.parts().insert(insertIndex, part);
                            self.onReRenderDECanvasEvent();
                            selectWindow.close();
                            self.selectedPart = part;
                            self.onReRenderDECanvasEvent();
                            Vede.application.fireEvent(self.DeviceEvent.MAP_PART, self.selectedPart);
                        } else {
                            Ext.MessageBox.alert('Error', 'Failed mapping part from library');
                        }
                    }
                });
                */
            }
        }
    }
});