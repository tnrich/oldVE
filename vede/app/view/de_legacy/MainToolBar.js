Ext.define('Vede.view.de_legacy.MainToolBar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.DeviceEditorLegacyMainToolBar',
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
                }
           ]
});
