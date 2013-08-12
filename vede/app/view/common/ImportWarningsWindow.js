Ext.define('Vede.view.common.ImportWarningsWindow', {
    extend: 'Ext.window.Window',

    alias: 'widget.importwarningswindow',
    cls: 'ImportWarningsWindow',
    autoScroll: true,
    width: 800,
    height: 400,
    title: 'Batch Import Summary',
    layout: 'fit',

    items: [{
        xtype: 'gridpanel',
        forceFit: true,
        layout: 'fit',
        columnLines: true,
        rowLines: true,
        columns: [{
            xtype: 'gridcolumn',
            text: 'File Name',
            dataIndex: 'fileName'
        }, {
            xtype: 'gridcolumn',
            text: 'Messages',
            dataIndex: 'messages',
            renderer: function(val) {
                if(val.length) {
                    return val.join('<br>');
                } else {
                    return 'No errors.';
                }
            }
        }]
    }]
});
