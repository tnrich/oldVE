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
            dataIndex: 'taskName'
        },
        {
            xtype: 'gridcolumn',
            text: 'Task Type',
            autoScroll: true,
            dataIndex: 'taskType',
        },
        {
            xtype: 'gridcolumn',
            text: 'Status',
            autoScroll: true,
            dataIndex: 'status',
            renderer: function(value) {
                if(value==="In progress") {
                    return '<div class="pace-activity"></div>Running...'
                }
            }
        },
        {
            xtype: 'gridcolumn',
            text: 'Date Initialized',
            autoScroll: true,
            dataIndex: 'dateStarted'
        },
        {
            xtype:'actioncolumn',
            align: 'center',
            items: [{
                icon: 'resources/images/ux/task/blocked.png',
                iconCls: 'task-icon',
                hidden: true,
                tooltip: 'Cancel Task',
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    var id = rec.data.taskRefID;
                    socket.emit('cancelj5run', id );
                    Teselagen.manager.ProjectManager.currentTasks.remove(rec);
                }
            },{
                icon: 'resources/images/ux/task/new-tab.png',
                hidden: true,
                iconCls: 'task-icon',
                tooltip: 'View Result',
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    alert("Edit " + rec.get('firstname'));
                    debugger;
                }
            }]
        }      
        ],
        //listeners: {
        //    itemclick: function(grid,item){
        //        Vede.application.fireEvent("jumpToJ5Run",item.raw);
        //        grid.up("window").close();
        //}
        //}
    }]
});
