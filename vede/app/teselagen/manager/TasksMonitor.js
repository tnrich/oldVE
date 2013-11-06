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
               "Teselagen.event.CommonEvent",
               "Teselagen.models.J5Run",
               "Teselagen.manager.SessionManager"],

    debugFlag : false,
    socket: null,

    constructor: function(){
       //if(this.debugFlag) console.log("Tasks Monitor created!");
    },

    bootMonitoring: function(){
        this.monitorServerTasks();
    },    

    startMonitoring: function() {
        //this.monitorServerTasks();
    },

    start: function(){
       //this.startMonitoring();
        //console.log("Tasks Monitor has been enabled.");
    },

    stop: function(boot){
    },

    addJ5RunObserver: function(){},

    monitorServerTasks: function(){
        var self = this;
        if(self.socket) return null;
        socket = io.connect(Teselagen.manager.SessionManager.getBaseURL().replace("/api/",":3000"));

        socket.on('connect',function() {
            
            console.log('Client has connected to the server!');    
            socket.emit('set nickname', "rpavez");   

            socket.on('update',function(data){
                console.log("NEW UPDATE!");

                if(!data)
                {
                    Teselagen.manager.ProjectManager.currentTasks = Ext.create("Ext.data.Store", {
                        model: 'Teselagen.models.J5Run'
                    });
                    return null;
                }

                if(Teselagen.manager.ProjectManager.currentTasks) {
                    Teselagen.manager.ProjectManager.currentTasks.removeAll();
                }
                else
                {
                    Teselagen.manager.ProjectManager.currentTasks = Ext.create("Ext.data.Store", {
                        model: 'Teselagen.models.J5Run'
                    });
                }

                for(var j5runKey in data.jobs)
                {
                    j5run = data.jobs[j5runKey];
                    j5run.date = new Date(j5run.date);
                    Teselagen.manager.ProjectManager.currentTasks.add(j5run);
                }
            });

        });

        socket.on('disconnect', function (socket) {
            console.log('Disconnected');
        });

        self.socket = socket; 
    },

    /*
    addJ5RunObserver: function(j5run){
        if(j5run && j5run.id) this.mon[j5run.id] = j5run.status;
    },

    observeChanges: function(data){
        if(this.debugFlag) console.log("-----------------------");
        if(this.debugFlag) console.log("Observing");
        var self = this;
        var changes = false;
        var anyRunningTask = false;
        Teselagen.manager.ProjectManager.currentTasks.removeAll();

        for(var j5runKey in data)
        {
            var j5run = data[j5runKey];
            j5run.date = new Date(j5run.date);
            Teselagen.manager.ProjectManager.currentTasks.add(j5run);

            if ( j5run.status === "In progress" ) { anyRunningTask = true; }
            if ( self.mon[j5run._id] )
            {
                // Continue observed
                if( self.mon[j5run._id] !== j5run.status ) 
                {
                    // Change
                    if(this.debugFlag) console.log(j5run._id," changed to ",j5run.status);
                    var startDate = jrun.date;
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
    */

});
