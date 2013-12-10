/**
 * Header panel controller
 * @class Vede.controller.HeaderPanelController
 */
Ext.define('Vede.controller.HeaderPanelController', {
    extend: 'Ext.app.Controller',
    requires: ["Teselagen.manager.ProjectManager","Teselagen.event.ProjectEvent",'Ext.window.MessageBox','Teselagen.manager.SessionManager'],
    ProjectManagerWindow : null,
    header: null,

    helpWindow : null,
    tasksWindow: null,
    
    onHelpBtnClick: function(button, e, options) {
        if(!this.helpWindow || !this.helpWindow.body) this.helpWindow = Ext.create("Vede.view.HelpWindow").show();
    },
    closeProjectManagerWindow : function(){
        this.ProjectManagerWindow.close();
    },

    onReportFeedbackBtnClick: function(btn){
        var feedback = btn.up('form').getForm().findField('feedback').getValue();
        var self = this;
        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("sendFeedback", ""),
            params: {
                feedback: feedback,
                user_id: Teselagen.manager.ProjectManager.currentUser.data.id,
                user: Teselagen.manager.ProjectManager.currentUser.data.username
            },
            method: 'POST',
            success: function(response){
                Ext.MessageBox.alert('Send Feedback', 'Thanks for your feedback.', function(){
                    self.helpWindow.close();
                });
            }
        });
    },

    onReportErrorBtnClick: function(btn){
        var error = btn.up('form').getForm().findField('error').getValue();
        var error_feedback = btn.up('form').getForm().findField('error_feedback').getValue();
        var self = this;
        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("sendFeedback", ""),
            params: {
                error: error,
                error_feedback: error_feedback,
                user_id: Teselagen.manager.ProjectManager.currentUser.data.id,
                user: Teselagen.manager.ProjectManager.currentUser.data.username
            },
            method: 'POST',
            success: function(response){
                Ext.MessageBox.alert('Send Feedback', 'Error reporting received. A ticket has been created to followup this error.', function(){
                    self.helpWindow.close();
                });
            }
        });
    },

    onTasksBtnClick: function(){
        if(this.tasksWindow) this.tasksWindow.toggleCollapse();
        else 
        {
            this.tasksWindow = Ext.getCmp('taskMonitor').expand();
            console.log(Teselagen.manager.ProjectManager.currentTasks);
            this.tasksWindow.down('gridpanel').reconfigure(Teselagen.manager.ProjectManager.currentTasks);
        }
    },

    init: function() {

     	this.control({
            "#headerPanel": {
                afterrender: this.onRender
            },
            "#help_btn": {
                click: this.onHelpBtnClick
            },
     		// "#tasks_btn": {
     		// 	click: this.onTasksBtnClick
     		// },
            "#reportFeedbackBtn": {
                click: this.onReportFeedbackBtnClick
            },
            "#reportErrorBtn": {
                click: this.onReportErrorBtnClick
            }
     	});
    },


    onRender: function() {
        Ext.get("help_btn").on('click', this.onHelpBtnClick);
        // Ext.get("tasks_btn").on('click', this.onTasksBtnClick);

        if(!Ext.isChrome) {
            Ext.getCmp('header-browser-warning').show();
        }
    }
});