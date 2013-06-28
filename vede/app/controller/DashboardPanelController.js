/**
 * Dashboard panel controller
 * @class Vede.controller.DashboardPanelController
 */
Ext.define("Vede.controller.DashboardPanelController", {
	extend: "Ext.app.Controller",

	requires: ["Teselagen.manager.ProjectManager"],


	onLastDEProjectsItemClick: function (item,record) {
		Teselagen.manager.ProjectManager.openDeviceDesign(record);
	},

	populateStatisticts: function () {
		Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("getStats", ''),
            // params: {
            //     data: data
            // },
            success: function (response) {
                response = JSON.parse(response.responseText);
                console.log(response);
               	var projectsData = Ext.getCmp('dashboardStats').down('field[cls="projectsCountBox-num"]');
               	var projectsLabel = Ext.getCmp('dashboardStats').down('field[cls="projectsCountBox-desc"]');
               	var designsData = Ext.getCmp('dashboardStats').down('field[cls="designsCountBox-num"]');
               	var designsLabel = Ext.getCmp('dashboardStats').down('field[cls="designsCountBox-desc"]');
               	var sequencesData = Ext.getCmp('dashboardStats').down('field[cls="sequencesCountBox-num"]');
               	var sequencesLabel = Ext.getCmp('dashboardStats').down('field[cls="sequencesCountBox-desc"]');
               	var partsData = Ext.getCmp('dashboardStats').down('field[cls="partsCountBox-num"]');
               	var partsLabel = Ext.getCmp('dashboardStats').down('field[cls="partsCountBox-desc"]');

               	projectsData.setValue(response.numberProjects);
                designsData.setValue(response.numberDesigns);
                sequencesData.setValue(response.numberSequences);
                partsData.setValue(response.numberParts);

                if (response.numberProjects == 1) {
                	projectsLabel.setValue("Project");
                }
                else {
               		projectsLabel.setValue("Projects");
                }
                if (response.numberDesigns == 1) {
                	designsLabel.setValue("Design");
                }
                else {
               		designsLabel.setValue("Designs");
                }if (response.numberSequences == 1) {
                	sequencesLabel.setValue("Sequence");
                }
                else {
               		sequencesLabel.setValue("Sequences");
                }if (response.numberParts == 1) {
                	partsLabel.setValue("Part");
                }
                else {
               		partsLabel.setValue("Parts");
                }
            },
            failure: function(response) {
                console.log('getting stats failed');
            }
        });
	},

//Logic for clicking the 'create new sequence' button from the dashboard.

  onDashNewSequence: function () {
        var self = this;
            console.log("Opening VE Direct Mode");
            Teselagen.manager.ProjectManager.directVEEditingMode = true;

            //Create empty VEProject/Sequence
            Teselagen.manager.ProjectManager.workingSequence = Ext.create("Teselagen.models.VectorEditorProject", {
                name: "Untitled VEProject",
                dateCreated: new Date(),
                dateModified: new Date()
            });

            Teselagen.manager.ProjectManager.workingSequence = Ext.create("Teselagen.models.SequenceFile", {
                sequenceFileFormat: "GENBANK",
                sequenceFileContent: "LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//",
                sequenceFileName: "untitled.gb",
                partSource: "Untitled sequence"
            });

            //Teselagen.manager.ProjectManager.workingSequence.setVectorEditorProject(Teselagen.manager.ProjectManager.workingSequence);
            Vede.application.fireEvent("OpenVectorEditor",Teselagen.manager.ProjectManager.workingSequence);
  },

	init: function () {
    this.application.on(Teselagen.event.AuthenticationEvent.LOGGED_IN,this.populateStatisticts);
    this.application.on("createSequence", this.onDashNewSequence);
		this.control({
			"#designGrid_Panel": {
				itemclick: this.onLastDEProjectsItemClick
			}
		});
		//this.application.on(Teselagen.event.MenuItemEvent.SELECT_WINDOW_OPENED, this.onSelectWindowOpened, this);
	}
});