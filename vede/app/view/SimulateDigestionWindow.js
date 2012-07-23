/*
 * File: app/view/SimulateDigestionWindow.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.0.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */
//Ext.Loader.setConfig({enabled: true});
/*Ext.require([
    'Ext.form.Panel',
    'Ext.ux.form.MultiSelect',
    'Ext.ux.form.ItemSelector'
]);*/
Ext.define('Vede.view.SimulateDigestionWindow', {
    extend: 'Ext.window.Window',
    requires: ['Ext.form.Panel', 'Ext.ux.form.MultiSelect', 'Ext.ux.form.ItemSelector'],
    height: 500,
    width: 900,
    resizable: false,
    title: 'Gel Digest',
    id: "simulateDigestionWindow",
    resizable: false,
    modal: true,
    initComponent: function() {
        var me = this;
                Ext.applyIf(me, {
            dockedItems: [
                {
                    xtype: 'container',
                    height: 470,
                    width: 500,
                    layout: {
                        align: 'stretch',
                        type: 'hbox'
                    },
                    items: [
                        {
                            xtype: 'panel',
                            width: 500,
                            title: 'Enzymes', 
                            flex: 1,
                            layout: {
                                type: 'absolute'
                            } ,
                            items: [
                                {
                                    xtype: 'combobox',
                                    width: 180,
                                    fieldLabel: '',
                                    editable: false,
                                    store: ['Common', 'REBASE', 'Berkeley BioBricks', 
                                            'MIT BioBricks', 'Fermentas Fast Digest'], //change this store to query database
                                    value: 'Common',
                                    listeners: { 
                                        select: function(combo, record, index){
                                            var newEnzymeSet = combo.getValue();
                                            console.log(combo.getValue() + ": okay?");
                                            var reGroupManager = Ext.create("Teselagen.manager.RestrictionEnzymeGroupManager", {});
                                            console.log("This far");
                                            reGroupManager.initialize();
                                            var newGroup = reGroupManager.groupByName(newEnzymeSet);
                                            console.log(newGroup.systemGroups);
                                        }
                                    },
                                    x: 10,
                                    y: 10
                                },
                                {
                                    xtype: 'combobox',
                                    width: 180,
                                    hideTrigger: true,
                                    store: ['AatII', 'Acc65I', 'AccI', 'Not', 'Bam', 'XhoI'], //change this to query database
                                    fieldLabel: '',
                                    hideLabel: true,
                                    triggerAction: 'query',
                                    typeAhead: true,
                                    //disabled: true,
                                    x: 235,
                                    y: 10
                                },
                                {
                                   xtype: 'itemselector', 
                    title: "Enzymes",
                    height: 400,
                    width: 420,
        id: 'itemselector-field',
                    imagePath: '../../extjs/examples/ux/css/images/',
        store: [[123,'One Hundred Twenty Three'],
                    ['1', 'One'], ['2', 'Two'], ['3', 'Three'], ['4', 'Four'], ['5', 'Five'],
                    ['6', 'Six'], ['7', 'Seven'], ['8', 'Eight'], ['9', 'Nine']],
        autoShow: true,
        displayField: 'text',
        valueField: 'value',
        value: ['3', '4', '6'],
        allowBlank: false,
        msgTarget: 'side',
        x: 10,
        y: 40
                                    
                                }
                            ] 
                        },
                        
                        {
                            xtype: 'panel',
                            height: 500,
                            width: 300,
                            layout: {
                                align: 'middle',
                                type: 'hbox'
                            },
                            dock: 'right',
                            title: 'Digest Results',
                            flex: 1,
                        
                            dockedItems: [
                        {
                            xtype: 'container',
                            height: 400,
                            width: 460,
                            layout: {
                                align: 'middle',
                                type: 'hbox'
                            },
                            dock: 'bottom',
                            items: [
                                {
                                    xtype: 'panel',
                                    height: 400,
                                    width: 400,
                                    layout: {
                                        type: 'absolute'
                                    },
                                    flex: 1,
                                    items: [{
                                        xtype: 'draw',
                                        id: 'drawingSurface',
                                            items: [{
                                                type: 'rect',
                                                fill: '#000',
                                                width: 400,
                                                height: 400,
                                                x: 0,
                                                y: 0
                                            }]
                                    }]
                                },
                            ]
                        }
                    ],
                        
                       items: [
                        {
                            xtype: 'fieldcontainer',
                            height: 40,
                            padding: '10 0 30 10',
                            width: 400,
                            fieldLabel: '',
                            items: [
                                {
                                    xtype: 'combobox',
                                    height: 21,
                                    padding: ' 10 0 0 10',
                                    width: 327,
                                    fieldLabel: 'Ladder',
                                    labelWidth: 50
                                }
                            ]
                        }
                    ] 
                        //
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
    }

});
