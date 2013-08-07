/**
 * Dashboard panel controller
 * @class Vede.controller.DashboardPanelController
 */
Ext.define("Vede.controller.DashboardPanelController", {
	extend: "Ext.app.Controller",

	requires: ["Teselagen.event.ProjectEvent",
               "Teselagen.manager.ProjectManager",
               "Teselagen.manager.DeviceDesignManager",
               "Teselagen.bio.parsers.ParsersManager",
               "Vede.view.ve.VectorViewer"],

    VectorViewer: null,

    onBeforeTabChange: function() {
        if(this.VectorViewer) {
            this.VectorViewer.hide();
        }
    },

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

    /**
     * TODO: Not used anymore?
     * @deprecated
     */
  DashNewSequence: function () {
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
      Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_SEQUENCE_IN_VE, Teselagen.manager.ProjectManager.workingSequence);
  },

  onTabChange: function(tabPanel, newTab, oldTab) {

      if(newTab.initialCls == "sequenceLibraryPanel") {

        var currentTab = Ext.getCmp("DashboardPanel").getActiveTab();
        var sequenceTab = Ext.getCmp("DashboardPanel").down("panel[cls='sequenceLibraryPanel']");
        currentTab.el.mask("Loading j5 report", "loader rspin");
        $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

        if (newTab == sequenceTab ) {
          Teselagen.manager.ProjectManager.openSequenceLibrary();
        }

      }
      else if(newTab.initialCls == "partLibraryPanel") {

        var currentTab = Ext.getCmp("DashboardPanel").getActiveTab();
        var partTab = Ext.getCmp("DashboardPanel").down("panel[cls='partLibraryPanel']");
        currentTab.el.mask("Loading Part Library", "loader rspin");
        $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

        if (newTab == partTab ) {
          Teselagen.manager.ProjectManager.openPartLibrary();
        }

      }
  },

    onSequenceGridItemClick: function(row,record) {
        var currentTab = Ext.getCmp("mainAppPanel");
        currentTab.el.mask("Loading Sequence", "loader rspin")
        $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

        var ext = record.data.sequenceFileName.split('.').pop();
        Ext.defer(function() {
            Teselagen.manager.ProjectManager.openSequence(record);
            currentTab.el.unmask();
        }, 10);
    },

    /**
     * Show the vector viewer when the mouse moves over a part in the grid, if
     * the part has a valid sequence file.
     */
    onSequenceGridItemMouseEnter: function(grid, sequenceFile, el, index, event) {
        var sequenceContainer = grid.up("#sequenceLibraryArea");

        if(!this.VectorViewer) {
            this.VectorViewer = Ext.create("Vede.view.ve.VectorViewer").show();

            this.VectorViewer.el.on("mouseleave", this.onVectorViewerMouseLeave, this);

        }

        this.VectorViewer.show();
        this.VectorViewer.setSequenceFile(sequenceFile);

        this.VectorViewer.setPosition(grid.getX() + grid.getWidth() - this.VectorViewer.width, 
                                      sequenceContainer.getY() + sequenceContainer.getHeight() / 2 - this.VectorViewer.height / 2);
    },

    /**
     * Hide the vector viewer when the mouse leaves the current grid
     * element, as long as the mouse isn't moving into the vector viewer itself.
     */
    onSequenceGridItemMouseLeave: function(grid, part, el, index, event) {
        if(this.VectorViewer) {
            var movingToElement = event.getRelatedTarget();

            if(!movingToElement || movingToElement.id.indexOf("vectorviewer") === -1) {
                this.VectorViewer.hide();
            }
        }
    },

    onPartGridItemClick: function(row,record) {
        var currentTab = Ext.getCmp("mainAppPanel");
        currentTab.el.mask("Loading Sequence", "loader rspin")
        $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

        sequence = Teselagen.manager.ProjectManager.sequences.getById(record.data.sequencefile_id);

        Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_SEQUENCE_IN_VE, sequence, record);
        currentTab.el.unmask();
    },

    /**
     * Show the vector viewer when the mouse moves over a part in the grid, if
     * the part has a valid sequence file.
     */
    onPartGridItemMouseEnter: function(grid, part, el, index, event) {
        var sequenceContainer = grid.up("container[cls='partLibraryContainer']");

        if(part.getSequenceFile()) {
            if(!this.VectorViewer) {
                this.VectorViewer = Ext.create("Vede.view.ve.VectorViewer").show();

                this.VectorViewer.el.on("mouseleave", this.onVectorViewerMouseLeave, this);

            }

            this.VectorViewer.show();
            this.VectorViewer.setPart(part);

            this.VectorViewer.setPosition(grid.getX() + grid.getWidth() - this.VectorViewer.width, 
                                          sequenceContainer.getY() + sequenceContainer.getHeight() / 2 - this.VectorViewer.height / 2);
        } else {
            if(this.VectorViewer) {
                this.VectorViewer.hide();
            }
        }
    },

    /**
     * Hide the vector viewer when the mouse leaves the current grid
     * element, as long as the mouse isn't moving into the vector viewer itself.
     */
    onPartGridItemMouseLeave: function(grid, part, el, index, event) {
        if(this.VectorViewer) {
            var movingToElement = event.getRelatedTarget();

            if(!movingToElement || movingToElement.id.indexOf("vectorviewer") === -1) {
                this.VectorViewer.hide();
            }
        }
    },

    onVectorViewerMouseLeave: function(event, target) {
        var target = event.getRelatedTarget();

        // Check if we are mousing into an item on the grid. If not, hide the
        // vector viewer.
        if(!target || target.className.toString().indexOf("grid") === -1) {
            this.VectorViewer.hide();
        }
    },

    onLaunch: function () {
        this.tabPanel = Ext.getCmp("mainAppPanel");
        this.tabPanel.on("tabchange", this.populateStatisticts);

        Ext.getCmp("DashboardPanel").on("tabchange", this.onTabChange);
    },

  	init: function () {
        this.ProjectEvent = Teselagen.event.ProjectEvent;

        this.application.on(Teselagen.event.AuthenticationEvent.LOGGED_IN,this.populateStatisticts);
        this.application.on(Teselagen.event.AuthenticationEvent.POPULATE_STATS,this.populateStatisticts);
        this.application.on(Teselagen.event.ProjectEvent.CREATE_SEQUENCE,this.DashNewSequence);

	     	this.control({
            "#mainAppPanel": {
                beforetabchange: this.onBeforeTabChange
            },
            "#designGrid_Panel": {
                itemclick: this.onLastDEProjectsItemClick
            },
            "gridpanel[name='SequenceLibraryGrid']": {
                itemclick: this.onSequenceGridItemClick,
                itemmouseenter: this.onSequenceGridItemMouseEnter,
                itemmouseleave: this.onSequenceGridItemMouseLeave
            },
            "gridpanel[name='PartLibraryGrid']": {
                itemclick: this.onPartGridItemClick,
                itemmouseenter: this.onPartGridItemMouseEnter,
                itemmouseleave: this.onPartGridItemMouseLeave
            }
		});
		//this.application.on(Teselagen.event.MenuItemEvent.SELECT_WINDOW_OPENED, this.onSelectWindowOpened, this);
	}
});
