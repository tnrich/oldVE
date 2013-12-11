/**
 * Device Editor menu panel
 * @class Vede.view.de.DeviceEditorMenuPanel
 */
Ext.define('Vede.view.de.DeviceEditorMenuPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.DeviceEditorMenuPanel',

    dock: 'top',
    hidden: false,
    cls: 'DeviceEditorMenuPanel',
    width: 150,
    layout: {
        type: 'fit'
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'button',
            text: 'File',
            cls: 'fileMenu',
            menu: {
                xtype: 'menu',
                items: [{
                    xtype: 'menuitem',
                    text: 'Save Design'
                },
                {
                    xtype: 'menuitem',
                    text: 'Clear Design'
                },
                {
                    xtype: 'menuitem',
                    text: 'Delete Design'
                }, 
                {
                    xtype: 'menuitem',
                    text: 'Rename Design'
                }, 
                {
                    xtype: 'filefield',
                    buttonOnly: true,
                    cls: 'importEugeneRulesBtn',
                    buttonConfig: {
                        text: 'Import Eugene Rules',
                        tooltip: 'Import EugeneRules',
                        border: false,
                        style: {
                            left: "-2px"
                        }
                    }
                }
                ]
            }
        }, {
            xtype: 'button',
            text: 'Edit',
            cls: 'editMenu',
            menu: {
                xtype: 'menu',
                items: [{
                    xtype: 'menuitem',
                    text: 'Undo',
                    cls: 'deUndoMenuItem',
                    //disabled: true
                }, {
                    xtype: 'menuitem',
                    text: 'Redo',
                    cls: 'deRedoMenuItem',
                    //disabled: true
                }, {
                    xtype: 'menuitem',
                    text: 'Clear Part',
                    cls: 'clearPartMenuItem',
                    disabled: true
                }, {
                    xtype: 'menuitem',
                    text: 'Remove Column',
                    cls: 'removeColumnMenuItem',
                    disabled: true
                }, {
                    xtype: 'menuitem',
                    text: 'Remove Row',
                    cls: 'removeRowMenuItem',
                    disabled: true
                }, {
                    text: 'Cut Part',
                    cls: 'cutPartMenuItem',
                    disabled: true
                }, {
                    xtype: 'menuitem',
                    text: 'Copy Part',
                    cls: 'copyPartMenuItem',
                    disabled: true
                }, {
                    xtype: 'menuitem',
                    text: 'Paste Part',
                    cls: 'pastePartMenuItem',
                    disabled: true
                }]
            }
        },{
            xtype: 'button',
            text: 'Examples',
            cls: 'examplesMenu',
            menu: {
                xtype: 'menu',
                minWidth: 300,
                width: 300,
                items: [{
                    xtype: 'menuitem',
                    text: 'SLIC/Gibson/CPEC'
                }, {
                    xtype: 'menuitem',
                    text: 'Combinatorial SLIC/Gibson/CPEC'
                }, {
                    xtype: 'menuitem',
                    text: 'Golden Gate'
                }, {
                    xtype: 'menuitem',
                    text: 'Combinatorial Golden Gate'
                }]
            }
        },
        /*        {
            xtype: 'button',
            text: 'Import',
            cls: 'importMenu',
            menu: {
                xtype: 'menu',
                minWidth: 140,
                width: 140,
                items: [{
                    xtype: 'menuitem',
                    cls: 'importXML',
                    text: 'XML file'
                }, {
                    xtype: 'menuitem',
                    cls: 'importJSON',
                    text: 'JSON file'
                }]
            }
        }, 
*/

        {
            xtype: 'filefield',
            buttonOnly: true,
            buttonConfig: {
                text: 'Import',
                scale: 'small',
                tooltip: 'Import File'
            },
            cls: 'DEimportBtn'
        },

        {
            xtype: 'button',
            text: 'Export',
            cls: 'exportMenu',
            menu: {
                xtype: 'menu',
                minWidth: 140,
                width: 140,
                items: [{
                    xtype: 'menuitem',
                    cls: 'exportJSON',
                    text: 'JSON file'
                }, {
                    xtype: 'menuitem',
                    cls: 'exportXML',
                    text: 'XML file'
                }]
            }
        }, {
            xtype: 'button',
            text: 'Insert',
            cls: 'insertMenu',
            menu: {
                xtype: 'menu',
                minWidth: 140,
                width: 140,
                items: [{
                    xtype: 'menuitem',
                    cls: 'row-above',
                    text: 'Row Above',
                    disabled: true
                }, {
                    xtype: 'menuitem',
                    cls: 'row-below',
                    text: 'Row Below',
                    disabled: true
                }, {
                    xtype: 'menuitem',
                    cls: 'column-left',
                    text: 'Column Left',
                    disabled: true
                }, {
                    xtype: 'menuitem',
                    cls: 'column-right',
                    text: 'Column Right',
                    disabled: true
                }]
            }
        }]
    }]
}

);
