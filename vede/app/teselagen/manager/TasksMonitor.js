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
               "Teselagen.manager.SessionManager",
               "Teselagen.utils.SystemUtils",
               "Teselagen.manager.ProjectManager",
               "Teselagen.models.Task"],

    debugFlag : false,
    socket: null,

    constructor: function(){
    },

    bootMonitoring: function(){
        this.monitorServerTasks();
    },

    startMonitoring: function() {
    },

    start: function(){
    },

    stop: function(boot){
    },

    addJ5RunObserver: function(j5Run) {
        Vede.application.fireEvent(Teselagen.event.CommonEvent.LOAD_J5_RUNS);
    },

    monitorServerTasks: function(){
        var self = this;
        if(self.socket) return null;

        Teselagen.utils.SystemUtils.loadJs( Teselagen.manager.SessionManager.buildUrl("socket.io/socket.io.js") ,function(){

            if(typeof io === 'undefined') {
                console.log("Socket IO not loaded!");
                return false;
            }

            if(socket) {
                console.log("Socket already coonected!");
                return false;
            }

            socket = io.connect(Teselagen.manager.SessionManager.getBaseURL().replace("/api/",":3000"));

            socket.on('message',function(msg) {
                console.log(msg);
            });

            socket.on('connect',function() {

                console.log('SOCKET.IO : Connected');
                socket.emit('set nickname', Teselagen.manager.ProjectManager.currentUser.get('username') );

                socket.on('j5completed',function(data){
                    console.log(data);
                    var startDate = new Date(data.date);
                    var endDate = new Date(data.endDate);
                    var elapsed = endDate - startDate;
                    console.log(startDate, endDate, elapsed);
                    elapsed = Math.round(elapsed/1000);
                    elapsed = self.elapsedDate(elapsed);
                    toastr.options.onclick = function() { Vede.application.fireEvent(Teselagen.event.CommonEvent.JUMPTOJ5RUN, data, true);};
                    toastr.success("j5 Run for " +data.devicedesign_name + " " + data.status + "<br>Submitted " + elapsed + " ago <br> Click To See Results", { sticky: true, theme: 'j5-completed', data: data});
                    toastr.options.timeOut = 5000;
                    var tab = Ext.getCmp("mainAppPanel").query("component[title='" + data.devicedesign_name + "']")[0];
                    var j5tab = Ext.getCmp("mainAppPanel").query("component[title='" + data.devicedesign_name + " j5 Report']")[0];
                    if(tab) {
                        var btn = tab.query("button[cls='runj5Btn']")[0];
                        btn.enable();
                        btn.setText("Submit Run to j5");
                        $(btn.el.dom).find(".loader-mini").remove();
                        Vede.application.fireEvent(Teselagen.event.CommonEvent.J5_RUN_STATUS_CHANGED, false);
                    }

                    if(j5tab) {
                        Vede.application.fireEvent(Teselagen.event.CommonEvent.JUMPTOJ5RUN, data, false);
                    }
                });

                socket.on('update',function(data){
                    if(!data)
                    {
                        Teselagen.manager.ProjectManager.currentTasks = Ext.create("Ext.data.Store", {
                            model: 'Teselagen.models.Task'
                        });
                        return null;
                    }

                    if(Teselagen.manager.ProjectManager.currentTasks) {
                        Teselagen.manager.ProjectManager.currentTasks.removeAll();
                    }
                    else
                    {
                        Teselagen.manager.ProjectManager.currentTasks = Ext.create("Ext.data.Store", {
                            model: 'Teselagen.models.Task'
                        });
                    }

                    for(var taskKey in data.tasks)
                    {
                        task = data.tasks[taskKey];
                        task.dateStarted = new Date(task.dateStarted);
                        task.devicedesign_id = task.run.devicedesign_id;
                        task.project_id = task.run.project_id;
                        Teselagen.manager.ProjectManager.currentTasks.insert(0,task);
                    }

                });

                socket.on('canceled', function(data) {
                    console.log(data);
                    console.log("here");
                    var tab = Ext.getCmp("mainAppPanel").query("component[title='" + data.devicedesign_name + "']")[0];
                    var btn = tab.query("button[cls='runj5Btn']")[0];
                    btn.enable();
                    btn.setText("Submit Run to j5");
                    $(btn.el.dom).find(".loader-mini").remove();
                    Vede.application.fireEvent(Teselagen.event.CommonEvent.J5_RUN_STATUS_CHANGED, false);
                });

                socket.on('j5error', function(data) {
                    console.log("j5 error");
                    /*
                    console.log(data);
                    console.log("here");
                    var tab = Ext.getCmp("mainAppPanel").query("component[title='" + data.devicedesign_name + "']")[0];
                    var btn = tab.query("button[cls='runj5Btn']")[0];
                    btn.enable();
                    btn.setText("Submit Run to j5");
                    $(btn.el.dom).find(".loader-mini").remove();
                    Vede.application.fireEvent(Teselagen.event.CommonEvent.J5_RUN_STATUS_CHANGED, false);
                    */
                });

            });

            socket.on('disconnect', function (socket) {
                console.log('Disconnected');
            });

            self.socket = socket;

        });
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
