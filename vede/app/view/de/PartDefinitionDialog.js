/**
 * Change part definition panel
 * @class Vede.view.de.PartDefinitionDialog
 */
Ext.define('Vede.view.de.PartDefinitionDialog', {
    extend: 'Ext.window.Window',
    closeAction: "close",

    height: 400,
    width: 590,
    title: 'Specify Part Definition',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'form',
                    height: 400,
                    bodyPadding: '10 10 10 10',
                    width: 590,
                    title: '',
                    items: [
                        {
                            xtype: 'textfield',
                            anchor: '100%',
                            fieldLabel: 'Part Name:',
                            margin: '10 10 0 0',
                            name: 'partName',
                            allowBlank: 'false',
                        },
                        {
                            xtype: 'textfield',
                            anchor: '100%',
                            fieldLabel: 'Part Source',
                            margin: '10 10 0 0',
                            allowBlank: 'false',
                            name: 'partSource',
                            readOnly: true
                        },
                        {
                            xtype: 'textareafield',
                            anchor: '100%',
                            fieldLabel: 'Source Data',
                            labelAlign: 'top',
                            margin: '10 10 0 0',
                            allowBlank: 'false',
                            name: 'sourceData',
                            readOnly: true
                        },
                        {
                            xtype: 'combobox',
                            anchor: '100%',
                            fieldLabel: 'Sequence',
                            store: ['Whole sequence','Specified sequence'],
                            margin: '10 10 0 0',
                            name: 'specifiedSequence',
                            editable: false
                        },
                        {
                            xtype: 'numberfield',
                            anchor: '100%',
                            fieldLabel: 'Start BP',
                            margin: '10 10 0 0',
                            name: 'startBP',
                            minValue: 1
                        },
                        {
                            xtype: 'numberfield',
                            anchor: '100%',
                            fieldLabel: 'Stop BP:',
                            margin: '10 10 0 0',
                            name: 'stopBP',
                            minValue: 1
                        },
                        {
                            xtype: 'checkboxfield',
                            anchor: '100%',
                            fieldLabel: '',
                            boxLabel: 'Reverse Complement',
                            margin: '10 10 30 0',
                            name: 'revComp'
                        },
                        {
                            xtype: 'button',
                            text: 'Save Part',
                            cls: 'saveDefinitionPartBtn',
                            hidden: true
                        },
                        {
                            xtype: 'button',
                            text: 'Done',
                            cls: 'changePartDefinitionDoneBtn'
                        },
                        {
                            xtype: 'button',
                            text: 'Done',
                            cls: 'createNewPartInDE',
                            hidden: true
                        },
                        {
                            xtype: 'button',
                            margin: '0 0 0 10',
                            text: 'Cancel',
                            cls: 'cancelPartDefinitionBtn'
                        },
                        {
                            xtype: 'button',
                            margin: '0 0 0 325',
                            text: 'View in Vector Editor',
                            cls: 'openPartInVEBtn'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    },
    listeners: {
        close: function(win) {
            var currentTab = Ext.getCmp("mainAppPanel").getActiveTab();
            var currentTabEl = (currentTab.getEl());
            currentTabEl.unmask();

            Vede.application.fireEvent(Teselagen.event.DeviceEvent.CLOSE_PART_CREATE_WINDOW);
        }
    }

});
