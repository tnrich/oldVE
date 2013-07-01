/**
 * Project operations.
 * @class Teselagen.manager.ProjectManager
 * @author Rodrigo Pavez
 */
Ext.define("Teselagen.manager.ProjectManager", {

    requires: ["Teselagen.event.ProjectEvent", "Teselagen.store.UserStore", "Vede.view.de.DeviceEditor", "Teselagen.manager.SessionManager", "Teselagen.manager.DeviceDesignManager", "Teselagen.utils.FormatUtils", "Teselagen.models.J5Bin", "Teselagen.models.Part","Teselagen.models.VectorEditorProject", "Ext.window.MessageBox"],
    alias: "ProjectManager",
    mixins: {
        observable: "Ext.util.Observable"
    },
    singleton: true,
    currentUser: null, // current User model
    projects: null, // Store of available projects
    workingProject: null, // working Project model
    workingSequence: null, // working Sequence model
    workingSequenceFileManager: null, // Current SequenceFileManager (which controls Vector Editor)
    sequenceStore: null,

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
            //Load the projects store
            var projectsStore = self.currentUser.projects().load(
                function (projects, operation, success) {
                    if(!success) { Ext.Error.raise("Error loading projects"); }
                    self.projects = projectsStore; //Set the working project
                    Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE); // Fire the renderProject treeEvent to load ProjectExplorer
                }
            );
        });
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
        var ModelId = model.data.id;
        tabPanel.items.items.forEach(function (tab, key) {
            if(tab.model && tab.initialCls === tabName) {
                if(tab.model.data.id === ModelId) {
                    duplicated = true;
                    tabPanel.setActiveTab(key);
                    if(typeof (cb2) === "function") { cb2(); }
                }
            }
        });
        if(!duplicated) { return cb(tabPanel); }
        else { console.log("Trying to open duplicated tab!"); }
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
                model: DeviceDesign
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

    /**
     * openDeviceDesign
     * Opens a DeviceDesign model in a new tab.
     * @param {Teselagen.models.DeviceDesign} Receives a DeviceDesign model (already loaded)
     */
    openDeviceDesign: function (selectedDesign) {
        this.checkDuplicatedTabs(selectedDesign, "DeviceEditorTab", function (tabPanel) {
            //Ext.getCmp("mainAppPanel").getActiveTab().el.mask("Loading Design");
            //Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();
            tabPanel.add(Ext.create("Vede.view.de.DeviceEditor", {
                title: "Device Editor | " + selectedDesign.data.name,
                model: selectedDesign,
                modelId: selectedDesign.data.id
            })).show();
            if(selectedDesign.data.id) Vede.application.fireEvent("loadEugeneRules"); // Fires event to load eugeneRules
            Ext.getCmp("projectTreePanel").expandPath("/root/" + selectedDesign.data.project_id + "/" + selectedDesign.data.id);

        });
    },

    /**
     * deleteDeviceDesign
     * Delete DeviceDesign Tab
     * @param {Teselagen.models.DeviceDEsign} Receives a DeviceDesign model (already loaded)
     */
    DeleteDeviceDesign: function (devicedesign, tab) {
        Ext.getCmp("mainAppPanel").getActiveTab().el.mask("Deleting design");
        var project_id = devicedesign.data.project_id;
        var designs = Teselagen.manager.ProjectManager.workingProject.designs();
        designs.remove(devicedesign);
        devicedesign.destroy(true);
        designs.sync();
        Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE,null, function () {
            Ext.getCmp("projectTreePanel").expandPath("/root/" + project_id);
            Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();
        });
        Ext.getCmp("mainAppPanel").remove(tab);
        /*
        var store =  Teselagen.manager.ProjectManager.workingProject.designs();
        store.remove(devicedesign);

        store.sync({
            callback: function () {
                Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE);
                Ext.getCmp("mainAppPanel").remove(tab);
            }
        });
        */
    },

    /**
     * openSequence
     * Opens a SequenceFile model in a new tab.
     * @param {model} Receives a j5Report model (already loaded)
     */
    openSequence: function (sequence) {
    	//console.log("Opening Sequence");
    	this.workingSequence = sequence;
        Vede.application.fireEvent("OpenVectorEditor",this.workingSequence);

        Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
//            new Ext.util.DelayedTask(function() {
        		
        		var sequence = Teselagen.manager.ProjectManager.workingSequence;
                Ext.getCmp("projectTreePanel").expandPath('/root/'+sequence.data.project_id,null,null,function(item,item2){
                    Ext.getCmp("projectTreePanel").getSelectionModel().select(item2.findChild('id',sequence.data.id,true));                    
                });
                
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
                Vede.application.fireEvent("SequenceManagerChanged", seqMgr);
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
                    Ext.getCmp("mainAppPanel").getActiveTab().el.mask("Creating new project");
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
    createNewSequence: function (project, veprojectNames) {
        var onPromptClosed = function (btn, text) {
                if(btn === "ok") {
                    text = Ext.String.trim(text);
                	if(text === "") { return Ext.MessageBox.prompt("Name", "Please enter a sequence name:", onPromptClosed, this); }
                    for (var j=0; j<veprojectNames.length; j++) {
                        if (veprojectNames[j]===text) { return Ext.MessageBox.prompt("Name", "A sequence with this name already exists in this project. Please enter another name:", onPromptClosed, this); }
                    }
                    Ext.getCmp("mainAppPanel").getActiveTab().el.mask("Creating new sequence");
                    var self = this;

                    var newSequenceFile = Ext.create("Teselagen.models.SequenceFile", {
                        sequenceFileFormat: "GENBANK",
                        sequenceFileContent: "LOCUS       "+text+"                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//",
                        sequenceFileName: "untitled.gb",
                        partSource: "Untitled sequence",
                        name: text
                    });

                    project.sequences().add(newSequenceFile);
                    newSequenceFile.set("project_id",project.data.id);
                    
                    newSequenceFile.save({
                        callback: function () {
                            Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                                Ext.getCmp("projectTreePanel").expandPath("/root/" + project.data.id + "/" + newSequenceFile.data.id);
                                Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();
                                self.openSequence(newSequenceFile);
                                toastr.info ("New Sequence Successfully Created");
                            });
                        }
                    });

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
                        if (projectNames[j]===text) { return Ext.MessageBox.prompt("Name", "A design with this name already exists in this project. Please enter another name:", onPromptClosed, this); }
                    }
                    var oldTab = Ext.getCmp("mainAppPanel").getActiveTab();
                    oldTab.el.mask("Generating Design");
                    var self = this;
                    if(project) {

                        var binsArray = [];
                        var parts = [];

                        for(var binIndex = 0; binIndex < 1; binIndex++) {
                            var newBin = Ext.create("Teselagen.models.J5Bin", {
                                binName: "Bin1"
                            });
                            var tempParts = [];
                            for(var i = 0; i < 2; i++) {
                                var newPart = Ext.create("Teselagen.models.Part", {
                                    name: "",
                                    phantom: true
                                });
                                parts.push(newPart);
                                tempParts.push(newPart);
                                newBin.parts().add(newPart);
                            }
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

                Vede.application.fireEvent("OpenVectorEditor",this.workingSequence);

                var menuItem = Ext.ComponentQuery.query('#saveSequenceBtn')[0];
    },

    /*
    * Creates a new VEProject based on an existing sequence
    * DEPRECATED
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
