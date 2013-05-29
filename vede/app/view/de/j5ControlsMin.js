/**
 * j5 controls view
 * @class Vede.view.de.j5ControlsMin
 */
Ext.define('Vede.view.de.j5ControlsMin', {
    extend: 'Ext.window.Window',
    closeAction: 'hide',
    height: 130,
    width: 525,
    layout: {
        align: 'stretch',
        type: 'vbox'
    },
    title: 'j5 Controls',
    resizable: false,
    constrainHeader: true,
    resizeHandles: 's',
    draggable: false,
    modal: true,

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                    xtype: 'container',
                    layout: {
                        type: 'hbox'
                    },
                    padding: 5,
                    items: [{
                        xtype: 'combobox',
                        minHeight: 33,
                        cls: 'assemblyMethodSelector',
                        fieldLabel: '<b>Assembly Method:</b>',
                        labelCls: 'assembly-label',
                        labelSeparator: ' ',
                        labelWidth: 110,
                        width:350,
                        queryMode: 'local',
                        displayField: 'assemblyMethod',
                        valueField: 'assemblyMethod'
                        }, {
                        xtype: 'container',
                        layout: {
                            type: 'hbox',
                            pack: 'start'
                        },
                        minHeight: 23,
                        padding: 5,
                        items: [{
                            xtype: 'button',
                            flex: 1,
                            height: 23,
                            cls: 'runj5Btn',
                            overCls: 'runj5Btn-over',
                            maxHeight: 23,
                            width: 140,
                            minHeight: 23,
                            enableToggle: true,
                            pressed: false,
                            text: '<b>Run j5</b>'
                        }, {
                            xtype: 'button',
                            flex: 1,
                            height: 23,
                            cls: 'downloadj5Btn',
                            margin: '0 0 0 10',
                            maxHeight: 23,
                            maxWidth: 140,
                            minHeight: 23,
                            enableToggle: true,
                            pressed: false,
                            text: '<b>Download Results</b>',
                            hidden: true
                        }]
                        }]
                    },{
                        xtype: 'container',
                        cls: 'j5progressContainer',
                        layout: {
                            type: 'hbox',
                            pack: 'start'
                        },
                        padding: 5,
                        height: 30,
                        hidden: true,
                        items: [{
                            xtype: 'container',
                            height: 25,
                            cls: 'progress progress-info progress-striped active',
                            width: 495,
                            items: [{
                                xtype: 'container',
                                height:25,
                                cls: 'bar',
                                width: 475                            }]
                        },{
                           xtype: 'button',
                           cls: 'stopj5runBtn',
                           height: 25,
                           margin: '0 0 0 5',
                           text: 'Cancel Run'
                        }]
                    },  {
                        xtype: 'displayfield',
                        padding: 5,
                        hidden: true,
                        height: 15,
                        cls: 'j5ResponseTextField',
                        value: '',
                        hideLabel: true
                    },{
                        xtype: 'container',
                        cls: 'loadAssemblyContainer',
                        padding: 5,
                        layout: {
                            align: 'stretch',
                            pack: 'end',
                            type: 'hbox'
                        },
                        items: [{
                            xtype: 'filefield',
                            minHeight: 35,
                            buttonOnly: true,
                            cls: 'loadAssemblyBtn',
                            validateOnChange: false,
                            margin: '10 0 10 0',
                            buttonText: '<b>Load Existing Assembly File</b>',
                            hidden: true
                        }]
                }]
        });

        me.callParent(arguments);
    }
});
