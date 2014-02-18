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

        if(Ext.getCmp("partLibrarySearch").value) {
            Ext.getCmp("partLibrarySearch").setValue("");
        }
    },

    onMainAppPanelTabChange: function(mainAppPanel, newTab, oldTab) {
        if(newTab.initialCls === "DashboardPanelTab") {
            if(newTab.getActiveTab().initialCls === "sequenceLibraryPanel") {
                var searchField = Ext.ComponentQuery.query("textfield[cls='sequenceLibrarySearchField']")[0];
                Teselagen.manager.ProjectManager.openSequenceLibrary(null, 
                                                            searchField.getValue());
            }

            this.populateStatistics();
        }
    },

    onLastDEProjectsItemClick: function (item,record) {
        Teselagen.manager.ProjectManager.openDeviceDesign(record);
    },

    checkVerification: function() {
        if(!Teselagen.manager.UserManager.user) {
            return;
        }

        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("checkEmailVerifiedStatus", ''),
            success:function(response) {
                console.log(response);
            }
    },

    populateStatistics: function () {
        if(!Teselagen.manager.UserManager.user) {
            return;
        }

        var currentTab = Ext.getCmp("DashboardPanel").getActiveTab();
        var pagingToolbar;
        if(currentTab) pagingToolbar = currentTab.down('pagingtoolbar');

        if(pagingToolbar) pagingToolbar.doRefresh();

        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("getStats", ''),
            WithCredentials: true,
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

    onTabChange: function(tabPanel, newTab, oldTab) {
        if(newTab.initialCls == "sequenceLibraryPanel") {
            var currentTab = Ext.getCmp("DashboardPanel").getActiveTab();
            var searchField = Ext.ComponentQuery.query("textfield[cls='sequenceLibrarySearchField']")[0];

            var sequenceTab = Ext.getCmp("DashboardPanel").down("panel[cls='sequenceLibraryPanel']");
            currentTab.el.mask("Loading j5 report", "loader rspin");
            $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

            if (newTab == sequenceTab ) {
                Teselagen.manager.ProjectManager.openSequenceLibrary(null, 
                                                        searchField.getValue());
            }
            else
            {
              currentTab.down('pagingtoolbar').doRefresh();
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
            else
            {
              Teselagen.manager.ProjectManager.parts.clearFilter();
              currentTab.down('pagingtoolbar').doRefresh();
            }
        }
    },

  // onMainTabChange: function(tabPanel, newTab, oldTab) {
  //   console.log(newTab);
  //   if(newTab.xtype == "DashboardPanelView") {
  //         Teselagen.manager.ProjectManager.parts.clearFilter();
  //         Ext.getCmp("partLibrarySearch").setValue("");
  //   }
  // },

    onSequenceGridItemClick: function(row,record) {
        var currentTab = Ext.getCmp("mainAppPanel");
        currentTab.el.mask("Loading Sequence", "loader rspin");
        $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

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

        var scrollOffset = grid.el.dom.scrollHeight > grid.el.dom.offsetHeight;

        if(scrollOffset) {
            this.VectorViewer.setPosition(grid.getX() + grid.getWidth() - this.VectorViewer.width - 15,
                                          sequenceContainer.getY() + sequenceContainer.getHeight() / 2 - this.VectorViewer.height / 2);
        } else {
            this.VectorViewer.setPosition(grid.getX() + grid.getWidth() - this.VectorViewer.width,
                                          sequenceContainer.getY() + sequenceContainer.getHeight() / 2 - this.VectorViewer.height / 2);
        }
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

        sequence = record.getSequenceFile();

        Ext.defer(function() {
            Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_SEQUENCE_IN_VE, sequence, record);
            currentTab.el.unmask();
        }, 10);
    },

    /**
     * Show the vector viewer when the mouse moves over a part in the grid, if
     * the part has a valid sequence file.
     */
    onPartGridItemMouseEnter: function(grid, part, el, index, event) {
        var sequenceContainer = grid.up("container[cls='partLibraryContainer']");
        var self = this;
        part.getSequenceFile({
            callback: function(sequenceFile){

                if(sequenceFile) {

                    if(!self.VectorViewer) {
                        self.VectorViewer = Ext.create("Vede.view.ve.VectorViewer").show();

                        self.VectorViewer.el.on("mouseleave", self.onVectorViewerMouseLeave, self);

                    }

                    self.VectorViewer.show();
                    self.VectorViewer.setPart(part);

                    var scrollOffset = grid.el.dom.scrollHeight > grid.el.dom.offsetHeight;

                    if(scrollOffset) {
                        self.VectorViewer.setPosition(grid.getX() + grid.getWidth() - self.VectorViewer.width - 15, 
                                                      sequenceContainer.getY() + sequenceContainer.getHeight() / 2 - self.VectorViewer.height / 2);
                    } else {
                        self.VectorViewer.setPosition(grid.getX() + grid.getWidth() - self.VectorViewer.width,
                                                      sequenceContainer.getY() + sequenceContainer.getHeight() / 2 - self.VectorViewer.height / 2);
                    }
                }
                else {
                    if(self.VectorViewer) {
                        self.VectorViewer.hide();
                    }
                }
          }});
    },

    DashNewSequence: function () {
        Teselagen.manager.ProjectManager.directVEEditingMode = true;

        var newSeq = Ext.create("Teselagen.models.SequenceFile", {
            sequenceFileFormat: "GENBANK",
            sequenceFileContent: "LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//",
            sequenceFileName: "untitled.gb",
            partSource: "Untitled sequence",
            serialize: JSON.parse('{"features": [], "inData": {"name": "no_name", "circular": true, "manualUpdateStarted": false, "needsRecalculateComplementSequence": false }, "sequence": {"alphabet": "dna", "symbols": ""} }')
        });

        Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_SEQUENCE_IN_VE, newSeq);
    },

    onDeleteSequence: function(sequence) {
        Teselagen.manager.ProjectManager.getPartsAndDesignsBySequence(sequence, function(parts) {
            var confirmationWindow = Ext.create("Vede.view.common.DeleteSequenceConfirmationWindow");
            var callback = function() {
                Teselagen.manager.ProjectManager.deleteSequence(sequence, parts);
            };

            if(parts !== false) {
                confirmationWindow.show();
                confirmationWindow.callback = callback;

                if(parts.length > 0) {
                    confirmationWindow.down('gridpanel').reconfigure(parts);
                } else {
                    confirmationWindow.down('displayfield').setValue('Deleting this sequence will not affect any parts. However, you cannot undo this action.');
                    confirmationWindow.down('gridpanel').hide();
                }
            } else {
                Ext.Msg.alert('Network Error', 'We could not determine which parts are associated with that sequence.');
            }
        });
    },

    onDeletePart: function(part) {
        Teselagen.manager.ProjectManager.getDesignsInvolvingPart(part, function(affectedDesigns) {
            var confirmationWindow = Ext.create("Vede.view.common.DeletePartConfirmationWindow");
            var callback = function() {
                Teselagen.manager.ProjectManager.deletePart(part);
            };

            if(affectedDesigns !== false) {
                confirmationWindow.show();
                confirmationWindow.callback = callback;

                if(affectedDesigns.length > 0) {
                    confirmationWindow.down('gridpanel').reconfigure(affectedDesigns);
                } else {
                    confirmationWindow.down('displayfield').setValue('Deleting this part will not affect any designs. However, you cannot undo this action.');
                    confirmationWindow.down('gridpanel').hide();
                }
            } else {
                Ext.Msg.alert('Network Error', 'We could not determine which designs are associated with that part.');
            }
        });
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
        target = event.getRelatedTarget();

        // Check if we are mousing into an item on the grid. If not, hide the
        // vector viewer.
        if(!target || target.className.toString().indexOf("grid") === -1) {
            this.VectorViewer.hide();
        }
    },

    onSequenceLibraryImportChange: function(field, value) {
        var items = field.extractFileInput().files;
        var file;
        var sequenceLibrary = Ext.getCmp("sequenceLibrary");

        setTimeout(function(){
            $(".batch-import-area").fadeOut("fast");
            $("#headerProgressBox").fadeIn();
            $("#headerProgressCancelBtn").on("click", function() {
                Teselagen.bio.parsers.ParsersManager.batchImportQueue = [];
                console.log(Teselagen.bio.parsers.ParsersManager.batchImportQueue);
                return false;
            });
        },25);

        sequenceLibrary.el.mask("Importing Sequence(s)", "loader rspin");
        $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

        Teselagen.bio.parsers.ParsersManager.startCount = 0;
        Teselagen.bio.parsers.ParsersManager.progressIncrement = 100/items.length;

        for (var i = 0; i < items.length; i++) {
            file = items[i];

            Teselagen.bio.parsers.ParsersManager.batchImportQueue.push(file);
            Teselagen.bio.parsers.ParsersManager.processQueue(function(errorStore) {
                var warningsWindow = Ext.create('Vede.view.common.ImportWarningsWindow').show();
                warningsWindow.down('gridpanel').reconfigure(errorStore);
            });
        }

        Ext.defer(function() {
            sequenceLibrary.el.unmask();
        }, 10);
    },

    onSequenceCodonJuggle: function(record) {
        var win = Ext.create('Vede.view.tools.CodonJuggle', {renderTo: Ext.get('sequenceLibraryArea'), record: record}).show();
        var sequenceManager = record.getSequenceManager();
        var fasta = Teselagen.bio.parsers.ParsersManager.genbankToFasta(sequenceManager.toGenbank());
        win.down('textareafield[name="record"]').setValue(record);
        win.down('textareafield[name="file"]').setValue(fasta);
        win.down('textareafield[name="type"]').setValue("sequence");
        win.down('displayfield[cls="cjSequenceName"]').setValue(record.get("name"));
        win.down('displayfield[cls="cjSequenceSize"]').setValue(record.get("size"));

    },

    onPartCodonJuggle: function(record) {
        var win = Ext.create('Vede.view.tools.CodonJuggle', {renderTo: Ext.get('partLibraryArea')}).show();
        var sequenceManager = record.getSequenceFile().getSequenceManager();
        var subSequence = sequenceManager.subSequenceManager(record.get('genbankStartBP'), record.get('endBP'));
        var fasta = Teselagen.bio.parsers.ParsersManager.genbankToFasta(subSequence.toGenbank());
        win.down('textareafield[name="record"]').setValue(record);
        win.down('textareafield[name="file"]').setValue(subSequence);
        win.down('textareafield[name="type"]').setValue("part");
        win.down('displayfield[cls="cjSequenceName"]').setValue(record.get("name"));
        win.down('displayfield[cls="cjSequenceSize"]').setValue(record.get("size"));
    },

    onCodonJuggleCreateSequence: function(success) {
        success.responseObject.parsedResponse.shift();
        var newSeq = success.responseObject.parsedResponse.join('');
        
        if(success.type=='sequence') {
            var onPromptClosed = function (btn, text) {
                    if(btn === "ok") {
                        text = Ext.String.trim(text);
                        if(text === "") { return Ext.MessageBox.prompt("Name", "Please enter a sequence name:", onPromptClosed, this); }

                        Ext.getCmp("mainAppPanel").getActiveTab().el.mask("Creating new sequence", "loader rspin");
                        $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

                        var self = this;

                        var newSequenceFile = Ext.create("Teselagen.models.SequenceFile", {
                            sequenceFileFormat: "GENBANK",
                            sequenceFileContent: "LOCUS       "+text+"                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//",
                            sequenceFileName: "untitled.gb",
                            partSource: "Untitled sequence",
                            name: text
                        });

                        // Give the sequence file a blank sequence manager, so that it's serialize field will be populated.
                        var seqMan = success.record.getSequenceManager();
                        seqMan.sequence = Teselagen.bio.sequence.DNATools.createDNA(newSeq);
                        var rawGenbank = seqMan.toGenbank().toString();
                        seqMan.toGenbank().setLocus(text);
                        seqMan.name = text;
                        newSequenceFile.set('name', text);
                        newSequenceFile.setSequenceFileContent(rawGenbank);
                        newSequenceFile.setSequenceManager(seqMan);

                        newSequenceFile.save({
                            callback: function () {
                                Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                                    Ext.getCmp("projectTreePanel").expandPath("/root/" + newSequenceFile.data.id);
                                    Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();
                                    Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_SEQUENCE_IN_VE, newSequenceFile);
                                    toastr.info ("New Sequence Created");
                                    Vede.application.fireEvent("PopulateStats");
                                });
                            }
                        });

                    } else {
                        return false;
                    }
                };

            Ext.MessageBox.prompt("Name", "Please enter a sequence name:", onPromptClosed, this);
        }
    },

    onLaunch: function () {
        Ext.getCmp("DashboardPanel").on("tabchange", this.onTabChange);
    },

    init: function () {
        this.ProjectEvent = Teselagen.event.ProjectEvent;

        this.application.on(Teselagen.event.AuthenticationEvent.LOGGED_IN, this.populateStatistics);
        this.application.on(Teselagen.event.AuthenticationEvent.LOGGED_IN, this.checkVerification);
        this.application.on(Teselagen.event.AuthenticationEvent.POPULATE_STATS, this.populateStatistics);
        this.application.on(Teselagen.event.ProjectEvent.CREATE_SEQUENCE, this.DashNewSequence);
        this.application.on(Teselagen.event.CommonEvent.DELETE_PART, this.onDeletePart);
        this.application.on(Teselagen.event.CommonEvent.DELETE_SEQUENCE, this.onDeleteSequence);
        this.application.on(Teselagen.event.ProjectEvent.CREATE_SEQUENCE_JUGGLE, this.onCodonJuggleCreateSequence);

        this.control({
            "#mainAppPanel": {
                Beforetabchange: this.onBeforeTabChange,
                tabchange: this.onMainAppPanelTabChange
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
            },
            "filefield[cls='sequenceLibraryImportButton']": {
                change: this.onSequenceLibraryImportChange
            }
        });
    }
});
