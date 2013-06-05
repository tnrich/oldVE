/**
 * @class Teselagen.manager.TasksMonitor
 * Class describing a TasksMonitor.
 * TasksMonitor manages communication with the server.
 *
 * @author Rodrigo Pavez
 */
Ext.define("Teselagen.manager.TasksMonitor", {

    singleton: true,
    requires: ["Ext.data.Store"],

    debugFlag : false,
    runFlag : true,

    mon: {}, // Object to observe
    delay: 1000,

    constructor: function(){
        if(this.debugFlag) console.log("Tasks Monitor created!");
    },

    startMonitoring: function() {
        var self = this;
        var task = new Ext.util.DelayedTask(function(){
            self.monitorServerTasks();
            if(runFlag) task.delay(self.delay);
        });
        
        task.delay(this.delay);

    },

    stop: function(){
        this.runFlag = false;
        console.log("Tasks Monitor has been disabled.");
    },

    monitorServerTasks: function(){
        var self = this;
        Ext.Ajax.request({
            url: '/api/monitorTasks',
            params: {
            },
            method: 'GET',
            success: function(response){
                self.observeChanges(JSON.parse(response.responseText).j5runs);
            }
        });
    },

    observeChanges: function(data){
        if(this.debugFlag) console.log("-----------------------");
        if(this.debugFlag) console.log("Observing");
        var self = this;
        for(var j5runKey in data)
        {
            var j5run = data[j5runKey]

            if ( self.mon[j5run._id] )
            {
                // Continue observed
                if( self.mon[j5run._id] !== j5run.status ) 
                {
                    // Change
                    if(this.debugFlag) console.log(j5run._id," changed to ",j5run.status);

                    // Fire change
                    Vede.application.fireEvent("j5runstatusChanged",j5run._id,j5run.status);

                    self.mon[j5run._id] = j5run.status; // Set the changed
                }
                else
                {
                    // No change
                    if(this.debugFlag) console.log(j5run._id," remain the same");
                }
            }
            else
            {
                // Start observing
                self.mon[j5run._id] = j5run.status;
            }
        };
    }

});