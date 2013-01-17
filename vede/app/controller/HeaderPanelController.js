/**
 * Header panel controller
 * @class Vede.controller.HeaderPanelController
 */
Ext.define('Vede.controller.HeaderPanelController', {
    extend: 'Ext.app.Controller',
    requires: ["Teselagen.manager.ProjectManager","Teselagen.event.ProjectEvent",'Ext.window.MessageBox'],
    ProjectManagerWindow : null,
    helpWindow : null,
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
            url: '/api/sendFeedback',
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
            url: '/api/sendFeedback',
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

    init: function() {
     	this.control({
     		"#help_btn": {
     			click: this.onHelpBtnClick
     		},
            "#reportFeedbackBtn": {
                click: this.onReportFeedbackBtnClick
            },
            "#reportErrorBtn": {
                click: this.onReportErrorBtnClick
            }
     	});
    }
});
