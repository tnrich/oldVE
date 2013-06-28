/**
 * @class Teselagen.manager.PrinterMonitor
 * Class describing a PrinterMonitor.
 * PrinterMonitor manages communication with the server.
 *
 * @author Rodrigo Pavez
 */
Ext.define("Teselagen.manager.PrinterMonitor", {

    singleton: true,
    requires: ["Ext.data.Store"],

    delay: 1000,
    debugFlag: true,
    feedback: "",
    updateFn: null,
    disabled: true,

    constructor: function(){
        console.log("Printer Monitor created!");
    },

    stopMonitoring: function(){
        console.log("Printer monitor stopped");
        this.disabled = true;
    },

    startMonitoring: function(fn) {
        this.updateFn = fn;
        this.disabled = false;
        var self = this;
        var task = new Ext.util.DelayedTask(function(){
            self.monitorServerTasks();
            if(!self.disabled) task.delay(self.delay);
        });
        
        task.delay(this.delay);
    },


    monitorServerTasks: function(){
        var self = this;
        Ext.Ajax.request({
            url: 'http://localhost:8090/feedback',
            method: 'GET',
            success: function(response){
                var parsedResponse = response.responseText;
                self.observeChanges(parsedResponse);
            }
        });
    },

    observeChanges: function(data){
        if(this.feedback!==data)
        {
            this.feedback = data;
            this.updateFn(this.feedback);
        }
    }

});
