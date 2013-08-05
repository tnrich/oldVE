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
    loadUser: function () {
        // Set the username into headerUserField and set the welcomeUser name (This should be refactored on a cleaner way)
        Ext.get("headerUserIcon").down(".headerUserField").dom.innerHTML = Teselagen.manager.AuthenticationManager.username+"<b class=\"caret\"></b>";
        if(Ext.getCmp("welcomeUserIcon")) { Ext.getCmp("welcomeUserIcon").setText(Teselagen.manager.AuthenticationManager.username); }

        // Generate empty user store
        var users = Ext.create("Teselagen.store.UserStore"); //Store of users (Will only contain the current user)
        var self = this;

        // Load user store
        var usersStore = users.load(function (users, operation, success) {
            if(!success) { Ext.Error.raise("Error loading user"); }
            // Select first user in the store (current user)
            self.currentUser = usersStore.first();

            var projectsStore = self.currentUser.projects().load(
                function (projects, operation, success) {
                    if(!success) { Ext.Error.raise("Error loading projects"); }
                    self.projects = projectsStore; //Set the working project
                    Teselagen.manager.ProjectExplorerManager.load();
                    //Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE); // Fire the renderProject treeEvent to load ProjectExplorer
                }
            );

            self.reloadSources();

        });
    },

    reloadSources: function(){
        var self = this;
        var sequencesStore = self.currentUser.sequences().load(
           function (sequences, operation, success){
                self.sequences = sequencesStore;


                var partsStore = self.currentUser.parts().load(
                    function (parts, operation, success){
                        self.parts = partsStore;

                        var parts = self.parts.getRange();
                        var sequenceId;
                        
                        // When the user's parts store is loaded, the parts have sequencefile_id
                        // fields, but the getSequenceFile method returns null. We iterate through
                        // the parts and call each one's setSequenceFile method as a fix.
                        for(var i = 0; i < parts.length; i++) {
                            var part = parts[i];
                            sequenceId = parts[i].get("sequencefile_id");
                            if(sequenceId && !part.getSequenceFile()) {
                                part.setSequenceFile(user.sequences().getById(sequenceId));
                            }
                        }


                    }
                );

           }
        );
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

    openSequenceLibrary: function () {
        var dashPanel = Ext.getCmp("DashboardPanel");
        sequenceGrid = dashPanel.down("gridpanel[name='SequenceLibraryGrid']");    
        if(sequenceGrid) sequenceGrid.reconfigure(Teselagen.manager.ProjectManager.sequences);

        dashPanel.getActiveTab().el.unmask();
    },

    openPartLibrary: function () {
        var dashPanel = Ext.getCmp("DashboardPanel");

        var parts = this.parts;
        if(parts) {
            parts.each(function(part) {
                if(part.getSequenceFile()) {
                    var sequence = Teselagen.manager.ProjectManager.currentUser.sequences().getById(part.data.sequencefile_id);
                    var sequenceManager = Teselagen.manager.SequenceFileManager.sequenceFileToSequenceManager(sequence);
                    var features = sequenceManager.featuresByRange(part.data.genbankStartBP, part.data.endBP);
                    // debugger;
                    console.log(features);
                    if(sequence) part.data.partSource = sequence.data.name;
                } else {
                    part.set("partSource", "");
                }
            });

            partGrid = dashPanel.down("gridpanel[name='PartLibraryGrid']"); 
            if(partGrid) partGrid.reconfigure(parts);
        }


        dashPanel.getActiveTab().el.unmask();
    },

    /**
     * openDeviceDesign
     * Opens a DeviceDesign model in a new tab.
     * @param {Teselagen.models.DeviceDesign} Receives a DeviceDesign model (already loaded)
     */
    openDeviceDesign: function (selectedDesign) {
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

            tabPanel.add(Ext.create("Vede.view.de.DeviceEditor", {
                title: selectedDesign.data.name,
                model: selectedDesign,
                icon: "resources/images/ux/tab-design-icon.png",
                iconCls: "tab-icon",
                modelId: selectedDesign.data.id
            })).show();
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
        Ext.getCmp("mainAppPanel").getActiveTab().el.mask("Deleting design", "loader rspin");
        $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");
        var project_id = devicedesign.data.project_id;
        var project = Teselagen.manager.ProjectManager.currentUser.projects().getById(project_id);
        //console.log(project);
        this.workingProject = project;
        //console.log(Teselagen.manager.ProjectManager.workingProject);
        Teselagen.manager.GridManager.setListenersEnabled(false);
        var designs = Teselagen.manager.ProjectManager.workingProject.designs();
        designs.remove(devicedesign);
        devicedesign.destroy();
        designs.sync();
        Teselagen.manager.GridManager.setListenersEnabled(true);
        Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE,null, function () {
            Ext.getCmp("projectTreePanel").expandPath("/root/" + project_id);
            Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();
        });
        if(tab) {
        	Ext.getCmp("mainAppPanel").remove(tab);
        }
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
//            new Ext.util.DelayedTask(function() {
        		
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
                        name: text,
                        dateCreated: new Date(),
                        dateModified: new Date()
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

                    /*
                    Ext.MessageBox.show({
                        title: "Name",
                        msg: "A sequence with this name already exists in this project. <p> Please enter another name:",
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
                    */                         
                        
                    
                    Ext.getCmp("mainAppPanel").getActiveTab().el.mask("Creating new sequence", "loader rspin");
                    $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

                    var self = this;

                    var newSequenceFile = Ext.create("Teselagen.models.SequenceFile", {
                        sequenceFileFormat: "GENBANK",
                        sequenceFileContent: "LOCUS       "+text+"                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//",
                        sequenceFileName: "untitled.gb",
                        partSource: "Untitled sequence",
                        dateCreated: new Date(),
                        dateModified: new Date(),
                        name: text
                    });

                    //project.sequences().add(newSequenceFile);
                    //newSequenceFile.set("project_id",project.data.id);
                    
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
                        /*
                        parts.forEach(function (part, partIndex) {
                            part.save({
                                callback: function () {
                                    if(partIndex === parts.length - 1) { afterPartsSaved(); }
                                }
                            });
                        });
                        */
                        afterPartsSaved();
                    }
                } else { return false; }
        };
        Ext.MessageBox.prompt("Name", "Please enter a design name:", onPromptClosed, this);

    },

    createDirectVESession: function() {
        this.directVEEditingMode = true;

                //Create empty VEProject/Sequence
                this.workingSequence = Ext.create("Teselagen.models.VectorEditorProject", {
                    name: "Untitled VEProject",
                    dateCreated: new Date(),
                    dateModified: new Date()
                });

                this.workingSequence = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "GENBANK",
                    sequenceFileContent: "LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//",
                    sequenceFileName: "untitled.gb",
                    partSource: "Untitled sequence"
                });

                Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_SEQUENCE_IN_VE, this.workingSequence);

                var menuItem = Ext.ComponentQuery.query('#saveSequenceBtn')[0];
    },

    /*
    * Creates a new VEProject based on an existing sequence
    * @deprecated
    */
    createNewVEProject: function(){
        console.log("Deprecated");
        /*
        var self = this;
        var onPromptClosed = function (btn, text) {
                if(btn === "ok") {
                    if(text === "") { return Ext.MessageBox.prompt("Name", "Please enter a vector editor project name:", onPromptClosed, this); }
                    Ext.getCmp("mainAppPanel").getActiveTab().el.mask("Creating new ve project");
                    var self = this;
                    var veproject = Ext.create("Teselagen.models.VectorEditorProject", {
                        name: text,
                        dateCreated: new Date(),
                        dateModified: new Date()
                    });

                    var project = Teselagen.manager.ProjectManager.workingProject;

                    project.veprojects().add(veproject);
                    veproject.setSequenceFile(sequence);
                    veproject.save({callback: function(){

                        sequence.setVectorEditorProject(veproject);
                        sequence.set("veproject_id",veproject.data.id);

                        sequence.save({
                            callback: function () {

                                veproject.set("sequencefile_id",sequence.data.id);
                                veproject.save();

                                Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                                    Ext.getCmp("projectTreePanel").expandPath("/root/" + project.data.id + "/" + veproject.data.id);
                                    Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();
                                    self.openSequence(veproject);
                                });
                            }
                        });
                    }});

                } else {
                    return false;
                }
            };

        Ext.MessageBox.prompt("Name", "Please enter a sequence name:", onPromptClosed, this);
        */
    },


});
