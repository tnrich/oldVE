/**
 * Device Editor Part Library
 * @class Vede.view.de.PartLibraryPanel
 */
Ext.define('Vede.view.PartLibraryWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.partLibrary',
    title: 'Part Library',
    height: 400,
    width: 400,
    layout: 'fit',
    modal: true,
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
        }
    }
});