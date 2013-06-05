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

    bootMonitoring: function(){
        var self = this;
        this.monitorServerTasks(function(data){
            var monitor = false;
            for(var j5run in data)
            {
                if (data[j5run].status === "In progress") monitor = true;
            }
            if(monitor) self.start();
            else self.stop(true);
        });
    },    

    startMonitoring: function() {
        var self = this;
        var task = new Ext.util.DelayedTask(function(){
            self.monitorServerTasks();
            if(self.runFlag) task.delay(self.delay);
        });
        
        task.delay(this.delay);
    },

    start: function(){
        this.runFlag = true;
        this.startMonitoring();
        console.log("Tasks Monitor has been enabled.");
    },

    stop: function(boot){
        this.runFlag = false;
        if(!boot) console.log("Tasks Monitor has been disabled.");
    },

    monitorServerTasks: function(cb){
        var self = this;
        Ext.Ajax.request({
            url: '/api/monitorTasks',
            params: {
            },
            method: 'GET',
            success: function(response){
                var parsedResponse = JSON.parse(response.responseText);
                self.observeChanges(parsedResponse.j5runs);
                if(typeof (cb) === "function") { cb(parsedResponse); }
            }
        });
    },

    observeChanges: function(data){
        if(this.debugFlag) console.log("-----------------------");
        if(this.debugFlag) console.log("Observing");
        var self = this;
        var changes = false;
        var anyRunningTask = false;
        for(var j5runKey in data)
        {
            var j5run = data[j5runKey]
            if ( j5run.status === "In progress" ) { anyRunningTask = true; }
            if ( self.mon[j5run._id] )
            {
                // Continue observed
                if( self.mon[j5run._id] !== j5run.status ) 
                {
                    // Change
                    if(this.debugFlag) console.log(j5run._id," changed to ",j5run.status);

                    // Fire change
                    // Vede.application.fireEvent("j5runstatusChanged",j5run._id,j5run.status);
                    $.jGrowl("j5 Run " + j5run.status, { sticky: true, theme: 'j5-completed'});

                    self.mon[j5run._id] = j5run.status; // Set the changed
                    changes = true;
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

        if(!changes&&!anyRunningTask) self.stop(true);
    }

});