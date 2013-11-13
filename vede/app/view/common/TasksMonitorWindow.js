Ext.define('Vede.view.common.TasksMonitorWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.tasksmonitorwindow',
    cls: 'tasksmonitorwindow',
    width: 800,
    title: 'Task Monitor',
    layout: 'fit',
    modal: false,
    closeAction: 'hide',
    resizable: false,
    height: 400,

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
        columns: [
        {
            xtype: 'gridcolumn',
            text: 'Design name',
            autoScroll: true,
            dataIndex: 'devicedesign_name'
        },
        {
            xtype: 'gridcolumn',
            text: 'Status',
            autoScroll: true,
            dataIndex: 'status'
        },
        {
            xtype: 'gridcolumn',
            text: 'Date',
            autoScroll: true,
            dataIndex: 'date'
        }        
        ],
        listeners: {
            itemclick: function(grid,item){
                Vede.application.fireEvent("jumpToJ5Run",item.raw);
                grid.up("window").close();
        }
    }
    }]
});
