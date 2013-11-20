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
                } else if(value==="Completed") {
                    return '<div class="status-note status-note-completed" style="margin-right:10px"></div>Completed.'
                } else if(value==="Completed with warnings") {
                    return '<div class="status-note status-note-warning" style="margin-right:10px"></div>Completed with warnings.'
                } else if(value==="Error") {
                    return '<div class="status-note status-note-failed" style="margin-right:10px"></div>Completed'
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
                tooltip: 'Cancel Task',
                enabled: false,
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    if(rec.data.taskType === "j5run") socket.emit('cancelj5run', Teselagen.manager.ProjectManager.currentUser.data.username, rec.data.id );
                    if(rec.data.taskType === "builddna") socket.emit('cancelbuilddna', Teselagen.manager.ProjectManager.currentUser.data.username, rec.data.id );
                    Teselagen.manager.ProjectManager.currentTasks.remove(rec);
                }
            },{
                icon: 'resources/images/ux/task/new-tab.png',
                iconCls: 'task-icon',
                tooltip: 'View Result',
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                }
            }],
            renderer: function(value, metaData, record, row, col, store, gridView) {
                if(record.data.status!=="In progress") {
                    console.log(col);
                    console.log(value);
                }
            }
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
