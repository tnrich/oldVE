Ext.define('Vede.view.DeviceEditor.MainToolBar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.DeviceEditorMainToolBar',
    items: [
                {
                    xtype: 'button',
                    id: 'j5Btn',
                    icon: 'resources/images/j5.png',
                    scale: 'medium',
                    tooltip: 'Save to Registry'
                },
                {
                    xtype: 'button',
                    id: 'saveDesignBtn',
                    icon: 'resources/images/save.png',
                    scale: 'medium',
                    tooltip: 'Save Design'
                },
           ]
});
