Ext.define('Vede.view.common.DeletePartConfirmationWindow', {
    extend: 'Ext.window.Window',

    alias: 'widget.deletepartconfirmationwindow',
    cls: 'DeletePartConfirmationWindow',
    width: 800,
    height: 400,
    title: 'Designs Affected By Part Deletion',
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
            text: 'File Name',
            dataIndex: 'fileName',
        }, {
            xtype: 'gridcolumn',
            text: 'Sequence Name',
            dataIndex: 'partSource'
        }, {
            xtype: 'gridcolumn',
            text: 'Messages',
            autoScroll: true,
            dataIndex: 'messages',
            renderer: function(val, meta) {
                meta.style = 'text-overflow: clip';
                if(val.length) {
                    return val.join('<br>');
                } else {
                    return 'No errors.';
                }
            }
        }]
    }]
});
