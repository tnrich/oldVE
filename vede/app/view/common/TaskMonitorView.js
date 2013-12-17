Ext.define('Vede.view.common.TaskMonitorView', {
    requires: ['Teselagen.event.CommonEvent'],
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
        id: 'tasksGrid',
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
            width: 300,
            minWidth: 300,
            flex: 1,
            renderer: function(value) {
                if(value==="In progress") {
                    return '<div class="pace-activity"></div>Running...'
                } else if(value==="Completed") {
                    return '<div class="status-note status-note-completed" style="margin-right:10px"></div>Completed.'
                } else if(value==="Completed with warnings") {
                    return '<div class="status-note status-note-warning" style="margin-right:10px"></div>Completed with warnings.'
                } else if(value==="Error") {
                    return '<div class="status-note status-note-failed" style="margin-right:10px"></div>Failed.'
                } else if(value==="Canceled") {
                    return '<div class="status-note status-note-failed" style="margin-right:10px"></div>Canceled.'
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
                iconCls: 'task-icon task-cancel x-hidden',
                tooltip: 'Cancel Task',
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    if(rec.data.taskType === "j5run") socket.emit('cancelj5run', Teselagen.manager.ProjectManager.currentUser.data.username, rec.data.id );
                    if(rec.data.taskType === "builddna") socket.emit('cancelbuilddna', Teselagen.manager.ProjectManager.currentUser.data.username, rec.data.id );
                    Teselagen.manager.ProjectManager.currentTasks.remove(rec);
                },
                getClass: function(v, meta, rec) {
                      if(rec.data.status != "In progress") {
                          return 'x-hide-display';
                      }
                  }
            }]
        },
        {
            xtype:'actioncolumn',
            align: 'center',
            items: [{
                icon: 'resources/images/ux/task/new-tab.png',
                iconCls: 'task-icon task-link',
                tooltip: 'View Result',
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    var data = {
                        devicedesign_id: rec.data.devicedesign_id,
                        project_id: rec.data.project_id,
                        _id: rec.data.id
                    };
                    Vede.application.fireEvent(Teselagen.event.CommonEvent.JUMPTOJ5RUN, data, true);
                }
            }]
        }]
    }]
});
