Ext.define('Vede.view.de.WarningsWindow', {
    extend: 'Ext.window.Window',

    alias: 'widget.warningsWindow',
    cls: 'warningsWindow',
    width: 800,
    height: 400,
    title: 'Warnings',
    layout: 'fit',
    modal: true,

    items: [{
        xtype: 'gridpanel',
        autoScroll: true,
        forceFit: true,
        layout: 'fit',
        columnLines: true,
        rowLines: true,
        viewConfig: {
            listeners: {
                refresh: function(dataview) {
                    var columns = dataview.panel.columns;
                    for(var i = 0; i < columns.length; i++) {
                        columns[i].autoSize();
                    }
                }
            }
        },
        columns: [{
            xtype: 'gridcolumn',
            text: 'Messages',
            autoScroll: true,
            dataIndex: 'messages'
        }]
    }]
});
