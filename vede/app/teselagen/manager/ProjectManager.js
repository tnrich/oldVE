/**
 * Project operations.
 * @class Teselagen.manager.ProjectManager
 * @author Rodrigo Pavez
 */
Ext.define("Teselagen.manager.ProjectManager", {

    requires: ["Teselagen.event.DeviceEvent",
               "Teselagen.event.ProjectEvent", 
               "Teselagen.event.SequenceManagerEvent", 
               "Teselagen.store.UserStore", 
               "Teselagen.manager.SessionManager", 
               "Teselagen.manager.SequenceManager", 
               "Teselagen.manager.DeviceDesignManager", 
               "Teselagen.utils.FormatUtils", 
               "Teselagen.models.J5Bin", 
               "Teselagen.models.Part",
               "Teselagen.models.VectorEditorProject", 
               "Vede.view.de.DeviceEditor", 
               "Ext.window.MessageBox",
                "Teselagen.manager.ProjectExplorerManager"
               ],
    alias: "ProjectManager",
    mixins: {
        observable: "Ext.util.Observable"
    },
    singleton: true,
    currentUser: null, // current User model
    projects: null, // Store of available projects
    parts: null,
    sequences: null,
    workingProject: null, // working Project model
    workingSequence: null, // working Sequence model
    workingSequenceFileManager: null, // Current SequenceFileManager (which controls Vector Editor)

    /**
     * @member Teselagen.manager.ProjectManager
     * Loads a user, sets currentUser, load projects and fire renderProjectTree (ProjectExplorer)
     */
    loadUser: function (cb) {
        // Set the username into headerUserField and set the welcomeUser name (This should be refactored on a cleaner way)
        Ext.get("headerUserIcon").down(".headerUserField").dom.innerHTML = Teselagen.manager.AuthenticationManager.username+"<b class=\"caret\"></b>";
        if(Ext.getCmp("welcomeUserIcon")) { Ext.getCmp("welcomeUserIcon").setText(Teselagen.manager.AuthenticationManager.username); }

        // Generate empty user store
        var users = Ext.create("Teselagen.store.UserStore"); //Store of users (Will only contain the current user)
        var self = this;
        var sequenceLibraryGrid = Ext.getCmp("sequenceLibrary");

        self.currentUser = Teselagen.manager.UserManager.user;
        self.sequences = self.currentUser.sequences();
        self.parts = self.currentUser.parts();

        self.sequences.pageSize = 20;
        self.parts.pageSize = 20;

        self.sequences.remoteFilter = true;
        self.sequences.remoteSort = true;
        self.parts.remoteFilter = true;
        self.parts.remoteSort = true;


        self.sequences.loadPage(1);
        self.parts.loadPage(1);

        /*
        self.currentTasks = Ext.create("Ext.data.Store", {
            fields: [
                {name: 'devicedesign_name', type: 'auto'},
                {name: 'status', type: 'auto'},
                {name: 'date', type: 'auto'}
            ]
        });
        */

        var projectsStore = self.currentUser.projects().load(
            function (projects, operation, success) {
                if(!success) { Ext.Error.raise("Error loading projects"); }
                self.projects = projectsStore;
            }
        );

        if( typeof(cb) == "function" ) cb();
    },

    /**
     * checkDuplicatedTabs
     * For a given model and type of tab find for duplicated.
     * @param {model} Receives a sequenceFile (already loaded)
     * @param {model} Receives a sequenceFile (already loaded)
     * @param {function} Callback function returning the tabPanel (doesn't return if fail)
     */
    checkDuplicatedTabs: function (model, tabName, cb, cb2) {
        var tabPanel = Ext.getCmp("mainAppPanel");
        var duplicated = false;
        var duplicatedTab;
        var ModelId;

        if(tabName !== "VectorEditorPanel") {
            ModelId = model.data.id;
            tabPanel.items.items.forEach(function (tab, key) {
                if(tab.model && tab.initialCls === tabName) {
                    if(tab.model.data.id === ModelId) {
                        duplicated = true;
                        duplicatedTab = tab;
                        tabPanel.setActiveTab(key);
                        if(typeof (cb2) === "function") { cb2(); }
                    }
                }
            });
        } else {
            tabPanel.items.items.forEach(function (tab, key) {
                if(tab.sequenceFile && model && tab.sequenceFile.get("id") === model.get("id")) {
                    duplicated = true;
                    duplicatedTab = tab;
                    tabPanel.setActiveTab(key);
                    if(typeof (cb2) === "function") { cb2(duplicatedTab); }
                }
            });
        }

        if(!duplicated) { return cb(tabPanel); }
        else { 
            duplicatedTab.el.unmask();
            //console.log("Trying to open duplicated tab!"); 
        }

    },

    /**
     * openj5Report
     * Opens a j5Report model in a new tab.
     * @param {Teselagen.models.DeviceDesign} Receives a DeviceDesign model (already loaded)
     */
    openj5Report: function (DeviceDesign,cb) {
        var self = this;
        this.checkDuplicatedTabs(DeviceDesign, "j5ReportTab", function () {
            var tabPanel = Ext.getCmp("mainAppPanel");
            var newj5ReportPanel = Ext.create("Vede.view.j5Report.j5ReportPanel", {
                title: DeviceDesign.data.name + " j5 Report",
                model: DeviceDesign,
                icon: "resources/images/ux/tab-report-icon.png",
                iconCls: "tab-icon"
            });

            tabPanel.add(newj5ReportPanel).show();
            tabPanel.setActiveTab(newj5ReportPanel);
            if(typeof (cb) === "function") { cb(); }
        },
        function(){
            if(typeof (cb) === "function") { cb(); }
        }
        );
    },

    openSequenceLibrary: function (itemCount, searchString) {
        var dashPanel = Ext.getCmp("DashboardPanel");
        var sequenceGrid = dashPanel.down("gridpanel[name='SequenceLibraryGrid']");   
        var sequences = Teselagen.manager.ProjectManager.sequences;

        dashPanel.getActiveTab().el.unmask(); 
        if(sequenceGrid) 
        {
            if(!itemCount) {
                if(Math.round(sequenceGrid.getHeight()/33)>20){sequences.pageSize = Math.round(sequenceGrid.getHeight()/33);}
            } else {
                sequences.pageSize = itemCount;
            }

            if(searchString) {
                sequences.remoteFilter = true;
                sequences.on('load', function(s){ 
                    s.remoteFilter = false; 
                }, this, { single: true });

                sequences.filter("name", Ext.String.escapeRegex(searchString));
            } else {
                sequences.loadPage(1);
            }

            sequenceGrid.reconfigure(sequences);
            sequenceGrid.down('pagingtoolbar').bind(sequences);
            sequenceGrid.down('pagingtoolbar').doRefresh();
        }
    },

    openPartLibrary: function (itemCount) {
        Ext.suspendLayouts();
        var dashPanel = Ext.getCmp("DashboardPanel");

        partGrid = dashPanel.down("gridpanel[name='PartLibraryGrid']"); 
        var parts = Teselagen.manager.ProjectManager.parts;

        if(partGrid) {
            if(!itemCount) {
                if(Math.round(partGrid.getHeight()/33)>20){parts.pageSize = Math.round(partGrid.getHeight()/33);}
            } else {
                parts.pageSize = itemCount;
            }
            parts.clearFilter();
            parts.loadPage(1);
            partGrid.reconfigure(parts);
            partGrid.down('pagingtoolbar').bind(parts);
            partGrid.down('pagingtoolbar').doRefresh();
        }

        dashPanel.getActiveTab().el.unmask();

        Ext.resumeLayouts(true);
    },

    /**
     * openDeviceDesign
     * Opens a DeviceDesign model in a new tab.
     * @param {Teselagen.models.DeviceDesign} Receives a DeviceDesign model (already loaded)
     */
    openDeviceDesign: function (selectedDesign) {
        var self = this;
        this.checkDuplicatedTabs(selectedDesign, "DeviceEditorTab", function (tabPanel) {

            // Set part_id fields on each cell.
            selectedDesign.bins().each(function(bin){
                bin.cells().each(function(cell){
                    cell.setPart( selectedDesign.parts().getById( cell.data.part_id ) );
                });
            });

            // Set sequencefile_id fields on each part.
            selectedDesign.parts().each(function(part) {
                var sequenceFile = part.getSequenceFile();
                if(sequenceFile) {
                    part.set("sequencefile_id", sequenceFile.getId());
                }
            });

            var newTab = Ext.create("Vede.view.de.DeviceEditor", {
                title: selectedDesign.data.name,
                model: selectedDesign,
                icon: "resources/images/ux/tab-design-icon.png",
                iconCls: "tab-icon",
                modelId: selectedDesign.data.id
            });

            tabPanel.add(newTab).show();

            if(selectedDesign.data.id) Vede.application.fireEvent(Teselagen.event.DeviceEvent.LOAD_EUGENE_RULES); // Fires event to load eugeneRules
            Ext.getCmp("projectTreePanel").expandPath("/root/" + selectedDesign.data.project_id + "/" + selectedDesign.data.id);
        });
    },

    /**
     * deleteDeviceDesign
     * Delete DeviceDesign Tab
     * @param {Teselagen.models.DeviceDEsign} Receives a DeviceDesign model (already loaded)
     */
    DeleteDeviceDesign: function (devicedesign, tab) {
        var tabPanel = Ext.getCmp("mainAppPanel");
        var project_id = devicedesign.data.project_id;
        var project = Teselagen.manager.ProjectManager.currentUser.projects().getById(project_id);

        this.workingProject = project;
        Teselagen.manager.GridManager.setListenersEnabled(false);
        var designs = Teselagen.manager.ProjectManager.workingProject.designs();

        designs.remove(devicedesign);
        devicedesign.destroy();

        Teselagen.manager.GridManager.setListenersEnabled(true);

        Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
            Ext.getCmp("projectTreePanel").expandPath("/root/" + project_id);
            Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();
        });

        // Delete all tabs which have the design as a model. (Includes J5 Reports tabs.)
        tabPanel.items.each(function(tab) {
            if(tab.model && tab.model.getId() === devicedesign.getId()) {
                tabPanel.remove(tab);
            }
        });

        Vede.application.fireEvent("PopulateStats");
    },

    /**
     * deleteProject
     * Delete Project Tab
     * @param {Teselagen.models.Project} Receives a Project model (already loaded)
     */
    deleteProject: function (project, tab) {
        var tabPanel = Ext.getCmp("mainAppPanel");
        var project_id = project.data.project_id;

        this.workingProject = null;

        var childsToClose = [];
        project.designs().each(function(design){
            childsToClose.push(design.id);
        });

        this.projects.remove(project);
        project.destroy();

        Teselagen.manager.GridManager.setListenersEnabled(true);

        Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
            Ext.getCmp("projectTreePanel").expandPath("/root/");
            Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();
        });

        tabPanel.items.each(function(tab) {
            if(tab.model && childsToClose.indexOf(tab.model.getId()!=-1)) {
                tabPanel.remove(tab);
            }
        });

        Vede.application.fireEvent("PopulateStats");
    },

    /**
     * Deletes the given sequence and updates designs associated with the affected parts.
     * @param {Teselagen.models.Sequence} sequence The sequence to delete.
     * @param {Object[]} affectedParts The parts that will be removed in object form.
     */
    deleteSequence: function(sequence, affectedParts) {
        var design;
        var part;
        var tabs = Ext.getCmp("mainAppPanel").items.getRange();

        if(affectedParts.length > 0) {
            for(var i = 0; i < tabs.length; i++) {
                design = tabs[i].model;

                if(tabs[i].initialCls === 'DeviceEditorTab') {
                    for(var j = 0; j < affectedParts.length; j++) {
                        part = design.parts().getById(affectedParts[j].id);

                        if(part) {
                            Teselagen.manager.DeviceDesignManager.removePartFromDesign(design, part);
                        }
                    }
                }
            }
        }

        sequence.destroy();
    },

    /**
     * Deletes the given part and removes it from any open designs.
     * @param {Teselagen.models.Part} part The part to delete.
     */
    deletePart: function(part) {
        var design;
        var tabs = Ext.getCmp("mainAppPanel").items.getRange();

        for(var i = 0; i < tabs.length; i++) {
            design = tabs[i].model;

            if(tabs[i].initialCls === 'DeviceEditorTab' && design.parts().indexOf(part) !== -1) {
                Teselagen.manager.DeviceDesignManager.removePartFromDesign(design, part);
            }
        }

        part.destroy();
        Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE);
    },

    /**
     * openSequence
     * Opens a SequenceFile model in a new tab.
     * @param {model} Receives a j5Report model (already loaded)
     */
    openSequence: function (sequence) {
        console.log("Opening Sequence");
        this.workingSequence = sequence;
        Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_SEQUENCE_IN_VE, this.workingSequence);

        Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
            //new Ext.util.DelayedTask(function() {
                var sequence = Teselagen.manager.ProjectManager.workingSequence;
                //Ext.getCmp("projectTreePanel").expandPath('/root/',null,null,function(item,item2){
                    var rootNode = Ext.getCmp("projectTreePanel").getRootNode();
                    var sequenceNode = rootNode.findChild('id',sequence.data.id,true);
                    if(sequenceNode) Ext.getCmp("projectTreePanel").getSelectionModel().select(sequenceNode);
                //});

 //           }).delay(500);
        });
    },

    /**
     * Returns a list of all designs which contain the given part.
     * @param {Teselagen.models.Part} part The part to return designs for.
     */
    getDesignsInvolvingPart: function(part, callback) {
        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("getDesignsWithPart", ""),
            method: "GET",
            withCredentials: true,
            params: {
                part: JSON.stringify(part.data)
            },
            success: function(response) {
                return callback(JSON.parse(response.responseText).designs);
            },
            failure: function(response) {
                console.log("Error getting designs involving part.");
                console.log(response);

                return callback(false);
            }
        });
    },

    /**
     * Returns a list of all parts deriving from the given sequence, as well as designs they are in.
     * @param {Teselagen.models.Sequence} sequence The sequence.
     */
    getPartsAndDesignsBySequence: function(sequence, callback) {
        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("getPartsAndDesignsBySequence", ""),
            method: "GET",
            withCredentials: true,
            params: {
                sequenceId: JSON.stringify(sequence.get("id"))
            },
            success: function(response) {
                return callback(JSON.parse(response.responseText).parts);
            },
            failure: function(response) {
                console.log("Error getting parts involving sequence.");
                console.log(response);

                return callback(false);
            }
        });
    },

    /**
     * openPart
     * Opens the sequence associated to a Part in a new tab
     * @param {model} Receives a Part model (already loaded)
     */
    openPart: function (part) {
        //console.log("Opening Sequence Associated to Part");
        var self = this;
        part.getSequenceFile({
            callback: function (record, operation,success) {
                if(!success) { Ext.Error.raise("Error loading associated sequence file"); }
                self.workingSequence = part.getSequenceFile();
                var tabPanel = Ext.getCmp("mainAppPanel");
                tabPanel.setActiveTab(1);
                var gb = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(self.workingSequence.data.sequenceFileContent);
                var seqMgr = Teselagen.utils.FormatUtils.genbankToSequenceManager(gb);
                Vede.application.fireEvent(Teselagen.event.SequenceManagerEvent.SEQUENCE_MANAGER_CHANGED, seqMgr);
            }
        });
    },

    /**
     * createNewProject
     * prompts for a project name and creates a new project
     */
    createNewProject: function () {

        var onPromptClosed = function (btn, text) {
                if(btn === "ok") {
                	text = Ext.String.trim(text);
                	if(text === "") { return Ext.MessageBox.prompt("Name", "Please enter a project name:", onPromptClosed, this); }
                    Ext.getCmp("mainAppPanel").getActiveTab().el.mask("Creating new project", "loader rspin");
                    $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

                    var self = this;
                    var project = Ext.create("Teselagen.models.Project", {
                        name: text
                    });

                    this.currentUser.projects().add(project);
                    project.save({
                        callback: function () {
                            self.workingProject = project;
                            Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                                Ext.getCmp("projectTreePanel").expandPath("/root/" + project.data.id);
                                Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();
                                Vede.application.fireEvent("PopulateStats");
                            });
                        }
                    });

                } else {
                    return false;
                }
            };

        Ext.MessageBox.prompt("Name", "Please enter a project name:", onPromptClosed, this);
    },

    /*
    * Creates a new Sequence given a project
    * @param {model} Project model
    */
    createNewSequence: function (project) {
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
                    var seqMan = Teselagen.manager.SequenceFileManager.sequenceFileToSequenceManager(newSequenceFile);
                    newSequenceFile.setSequenceManager(seqMan);

                    newSequenceFile.save({
                        callback: function () {
                            Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                                Ext.getCmp("projectTreePanel").expandPath("/root/" + newSequenceFile.data.id);
                                Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();
                                self.openSequence(newSequenceFile);
                                toastr.info ("New Sequence Created");
                            });
                        }
                    });

                    Vede.application.fireEvent("PopulateStats");

                } else {
                    return false;
                }
            };

        Ext.MessageBox.prompt("Name", "Please enter a sequence name:", onPromptClosed, this);
    },

    /*
    * Creates a new DeviceDesign given a project and projectNames
    * @param {model} Project model
    * @param {Array[]} Array of names
    */
    createNewDeviceDesignAtProject: function (project, projectNames) {
        var onPromptClosed = function (btn, text) {
                if(btn ==="ok") {
                	text = Ext.String.trim(text);
                	if(text === "") { return Ext.MessageBox.prompt("Name", "Please enter a design name:", onPromptClosed, this); }
                    for (var j=0; j<projectNames.length; j++) {
                        if (projectNames[j]===text) {
                            Ext.MessageBox.show({
                                title: "Name",
                                msg: "A design with this name already exists in this project. <p> Please enter another name:",
                                buttons: Ext.MessageBox.OKCANCEL,
                                fn: onPromptClosed,
                                prompt: true,
                                cls: "sequencePrompt-box",
                                scope: this,
                                style: {
                                    "text-align": "center"
                                },
                                scope: this,
                                layout: {
                                    align: "center"
                                },
                                items: [
                                    {
                                        xtype: "textfield",
                                        layout: {
                                            align: "center"
                                        },
                                        width: 50
                                    }
                                ]
                            });
                            return Ext.MessageBox;
                            
                        }
                    };
                    var oldTab = Ext.getCmp("mainAppPanel").getActiveTab();
                    oldTab.el.mask("Generating Design", "loader rspin");
                    $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

                    var self = this;

                    Vede.application.fireEvent("PopulateStats");

                    if(project) {

                        var binsArray = [];
                        var parts = [];

                        for(var binIndex = 0; binIndex < 1; binIndex++) {
                            var newBin = Ext.create("Teselagen.models.J5Bin", {
                                binName: "Bin1"
                            });

                            var newCell = Ext.create("Teselagen.models.Cell", {
                                index: 0,
                                part_id: null
                            });

                            var newCell2 = Ext.create("Teselagen.models.Cell", {
                                index: 1,
                                part_id: null
                            });

                            newBin.cells().insert(0, newCell);
                            newBin.cells().insert(1, newCell2);

                            binsArray.push(newBin);
                        }

                        var afterPartsSaved = function () {

                                var design = Teselagen.manager.DeviceDesignManager.createDeviceDesignFromBins(binsArray);
                                design.set("name",text);
                                design.set("project_id",project.data.id);
                                project.designs().add(design);

                                design.save({
                                    success: function(record, operation) {
                                        Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                                            //console.log("Expanding " + "/root/" + project.data.id + "/" + design.data.id);
                                            Ext.getCmp("projectTreePanel").expandPath("/root/" + project.data.id);
                                            oldTab.el.unmask();
                                            Ext.getCmp("projectTreePanel").selectPath("/root/" + project.data.id + "/" + design.data.id);
                                        });
                                        self.openDeviceDesign(design);
                                    }
                                });

                            };

                        afterPartsSaved();
                    }
                } else { return false; }
        };
        Ext.MessageBox.prompt("Name", "Please enter a design name:", onPromptClosed, this);

    },

    renamePartinOpenDesigns: function(part, text) {
        var tabPanel = Ext.getCmp("mainAppPanel");
        var tabs = tabPanel.items.items;

        tabs.forEach(function(tab) {
            if(tab.initialCls == "DeviceEditorTab") {
                var gridPart = tab.model.partsStore.data.getByKey(part.data.id);
                if(gridPart) {
                    gridPart.set('name', text);
                }
            }
        });
    }

});
