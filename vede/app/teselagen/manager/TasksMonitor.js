/**
 * @class Teselagen.manager.TasksMonitor
 * Class describing a TasksMonitor.
 * TasksMonitor manages communication with the server.
 *
 * @author Rodrigo Pavez
 */
Ext.define("Teselagen.manager.TasksMonitor", {

    singleton: true,
    requires: ["Ext.data.Store",
               "Teselagen.event.CommonEvent"],

    debugFlag : false,
    disabled : false,
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
            url: Teselagen.manager.SessionManager.buildUrl('monitorTasks', ''),
            params: {
            },
            method: 'GET',
            withCredentials: true,
            success: function(response){
                var parsedResponse = JSON.parse(response.responseText);
                self.observeChanges(parsedResponse.j5runs);
                if(typeof (cb) === "function") {cb(parsedResponse); }
            },
            failure: function(){
                self.stop();
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
                    var startDate = new Date(j5run.date);
                    var endDate = Date.now();
                    var elapsed = endDate - startDate;
                    elapsed = Math.round(elapsed/1000);
                    elapsed = self.elapsedDate(elapsed);
                                // Fire change
                    //console.log(j5run);
                    Vede.application.fireEvent(Teselagen.event.CommonEvent.J5_RUN_STATUS_CHANGED, j5run._id, j5run.status);
                    toastr.options.timeOut = 0;
                    jumpRun = j5run;
                    toastr.options.onclick = function() { Vede.application.fireEvent("jumpToJ5Run",jumpRun);}
                    toastr.success("j5 Run for " +j5run.devicedesign_name + " " + j5run.status + "<br>Submitted " + elapsed + " ago <br> Click To See Results", { sticky: true, theme: 'j5-completed', data: j5run});
                    toastr.options.timeOut = 5000;

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
    },

    elapsedDate: function (seconds)
    {
    var numdays = Math.floor((seconds % 31536000) / 86400); 
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    if (numdays>0) {
        return numdays + " days" + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
    }else if (numhours>0) {
        return numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
    }else if (numminutes>0) {
        return numminutes + " minutes " + numseconds + " seconds";
    } else {
    return numseconds + " seconds";
    }
    }

});
