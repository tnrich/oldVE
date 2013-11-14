Ext.define('Vede.view.common.TaskMonitorView', {
    extend: 'Ext.panel.Panel',
    id: 'taskMonitor',
    alias: 'widget.TaskMonitorView',
    cls: 'tasksmonitorwindow',
    width: '100%',
    title: 'Task Monitor',
    layout: 'fit',
    closeAction: 'hide',
    resizable: false,
    collapsed: true,
    draggable: false,
    collapseMode: 'mini',
    collapsible: true,
    header: true,
    region: 'south',
    height: 200,
    y: '80%',

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
            text: 'TaskName',
            autoScroll: true,
            dataIndex: 'task_name'
        },
        {
            xtype: 'gridcolumn',
            text: 'Task Type',
            autoScroll: true,
            dataIndex: 'task_type'
        },
        {
            xtype: 'gridcolumn',
            text: 'Status',
            autoScroll: true,
            dataIndex: 'status'
        },
        {
            xtype: 'gridcolumn',
            text: 'Date Initialized',
            autoScroll: true,
            dataIndex: 'date'
        },
        {
            xtype: 'gridcolumn',
            text: 'Options',
            autoScroll: true,
            dataIndex: 'options'
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
