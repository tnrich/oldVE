Ext.define('Vede.view.de.EugeneRulesImportDialog', {
    extend: 'Ext.window.Window',

    height: 558,
    width: 593,
    title: 'Import Eugene Rules',
    autoScroll: true,

    items: [{
            xtype: 'gridpanel',
            hideHeaders: true,
            height: 122,
            name: 'conflict',
            title: 'Conflict rules',
            columns: [{
                    xtype: 'gridcolumn',
                    dataIndex: 'originalRuleLine',
                    cls: 'gridcolumn-wrap-text',
                    text: '',
                    forceFit: true,
                    flex: 1,
                    draggable: false,
                    sortable: false,
                    hideable: false,
                    menuDisabled: true,
                    renderer: function(val) {
                                return '<div style="white-space:normal !important;">'+ val +'</div>';
                            }

                }
            ],
            viewConfig: {}
        }, {
            xtype: 'gridpanel',
            hideHeaders: true,
            height: 122,
            name: 'new',
            title: 'New rules',
            columns: [{
                    xtype: 'gridcolumn',
                    dataIndex: 'originalRuleLine',
                    text: '',
                    forceFit: true,
                    flex: 1,
                    draggable: false,
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                }
            ],
            viewConfig: {}
        }, {
            xtype: 'gridpanel',
            hideHeaders: true,
            height: 122,
            name: 'ignored',
            title: 'Ignored statements',
            columns: [{
                    xtype: 'gridcolumn',
                    dataIndex: 'originalRuleLine',
                    text: '',
                    forceFit: true,
                    flex: 1,
                    draggable: false,
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                }
            ],
            viewConfig: {}
        }, {
            xtype: 'gridpanel',
            hideHeaders: true,
            height: 122,
            name: 'repeated',
            title: 'Repeated rules',
            columns: [{
                    xtype: 'gridcolumn',
                    dataIndex: 'originalRuleLine',
                    text: '',
                    forceFit: true,
                    flex: 1,
                    draggable: false,
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                }
            ],
            viewConfig: {}
        }, {
            xtype: 'button',
            margin: '10 0 0 10',
            text: 'Ok'
        }, {
            xtype: 'button',
            margin: '10 0 0 10',
            text: 'Cancel'
        }
    ]


});