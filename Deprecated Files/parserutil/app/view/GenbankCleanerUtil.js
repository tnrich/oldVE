/*
 * File: app/view/GenbankCleanerUtil.js
 *
 * This file was generated by Sencha Architect version 2.1.0.
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

Ext.define('TeselagenUtils.view.GenbankCleanerUtil', {
    extend: 'Ext.window.Window',

    height: 356,
    width: 573,
    title: 'Teselagen Genbank Parser Utility',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'form',
                    height: 320,
                    bodyPadding: 10,
                    title: '',
                    id: 'gbFileCleanerForm',
                    items: [
                        {
                            xtype: 'fieldset',
                            height: 86,
                            title: 'Genbank File Cleaner',
                            items: [
                                {
                                    xtype: 'filefield',
                                    name: 'importedFile',
                                    anchor: '100%',
                                    fieldLabel: '',
                                    msgTarget: 'side',
                                    allowBlank: false,
                                    listeners: {
                                        'change': function (filefield, value) {
                                            filefield.inputEl.dom.value = filefield.inputEl.dom.value.replace('C:\\fakepath\\', '');
                                        }
                                    }
                                },
                                {
                                    xtype: 'button',
                                    id: 'cleanAndDownloadBtn',
                                    text: 'Clean and Download'
                                }
                            ]
                        },
                        {
                            xtype: 'textareafield',
                            anchor: '100%',
                            id: 'loggerField',
                            height: 185
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});