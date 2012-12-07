/**
 * Device Editor Project tests that access the server.
 * @author Rodrigo Pavez, Yuri Bendana
 */

/*global beforeEach, describe, it, expect, runs, waitsFor*/

Ext.require(["Ext.Ajax",
//     "Teselagen.bio.util.StringUtil",
//     "Teselagen.bio.util.XmlToJson",
//     "Teselagen.bio.util.Sha256",
//     "Teselagen.bio.parsers.GenbankManager",
//     "Teselagen.bio.parsers.ParsersManager",
//     "Teselagen.utils.SequenceUtils",
//     "Teselagen.utils.FormatUtils",
//     "Teselagen.utils.DeXmlUtils",
     "Teselagen.constants.Constants",
//     "Teselagen.models.SequenceFile",
//     "Teselagen.models.Part",
//     "Teselagen.models.J5Bin",
//     "Teselagen.models.J5Collection",
//     "Teselagen.models.EugeneRule",
//     "Teselagen.models.SBOLvIconInfo",
//     "Teselagen.models.J5Run",
//     "Teselagen.models.J5Parameters",
//     "Teselagen.models.DownstreamAutomationParameters",
//     "Teselagen.models.J5Results",
//     "Teselagen.models.DeviceDesign",
     "Teselagen.models.DeviceEditorProject",
//     "Teselagen.manager.SequenceFileManager",
//     "Teselagen.manager.DeviceDesignManager",
     "Teselagen.manager.ProjectManager",
     "Teselagen.manager.AuthenticationManager",
     "Teselagen.manager.SessionManager",
     "Teselagen.store.DeviceEditorProjectStore"
]);

 Ext.onReady(function () {
    var project, design, deproject, projectcreated, deprojectsaved, designsaved, project_id, 
        deproject_id, deprojStore;
    var isTestDataDeleted = false;
    var parts = [];
    var sequences = [];
    var designsaved = false;
    var deprojectsaved = false;
    var designGenerated = false;
    var sequencesSaved = false;
    var partsSaved = false;
    var constants = Teselagen.constants.Constants;
    var projectManager = Teselagen.manager.ProjectManager;
    var authenticationManager = Teselagen.manager.AuthenticationManager;
    var sessionManager = Teselagen.manager.SessionManager;

    describe("Device Editor Project server tests.", function() {
        it("Clear test data", function() {
            runs(function() {
                Ext.Ajax.request({
                    url: "/api/deprojects",
                    method: "DELETE",
                    success: function() {
                        isTestDataDeleted = true;
                    }
                });
            });
        });

        it("Create DE Project", function () {
            waitsFor(function() {
                return isTestDataDeleted;
            }, "deleted test data", 500);
            runs(function () {
                deproject = Ext.create("Teselagen.models.DeviceEditorProject", {
                    name: "My DE Project #1",
                    dateCreated: new Date(),
                    dateModified: new Date()
                });
                var currentProject = projectManager.currentUser.projects().last();
                currentProject.deprojects().add(deproject);
                deproject.save({
                    success: function(){
                        deproject_id = deproject.getId();
                        deprojectsaved = true;
                    }
                });
            });
        });
        
        it("Generate in-memory DE Design", function () {
            // In creating this design, use bare minimum required fields
            // Will build this from the models.
            // The correct way would be to use DeviceDesignManager.js
            // Create Bin1 with 2 Part with 1 SequenceFile each
            var DeviceDesignManager = Teselagen.manager.DeviceDesignManager;
            var binsArray = [];

            for(var binIndex = 0;binIndex<6;binIndex++)
            {
                var newBin = Ext.create("Teselagen.models.J5Bin", {
                    binName: "bin"+binIndex
                });
                var tempParts = [];
                for(var i=0;i<6;i++)
                {
                    var newPart = Ext.create("Teselagen.models.Part", {
                        name: "part1a",
                        genbankStartBP: 1,
                        endBP: 7
                    });
                    parts.push(newPart);
                    tempParts.push(newPart);
                }
                newBin.addToParts(tempParts);
                binsArray.push(newBin);
            }

            // CREATE THE COLLECTION WITH BINS
            design = DeviceDesignManager.createDeviceDesignFromBins(binsArray);

            expect(design).toBeDefined();
            designGenerated = true;
        });

        xit("Saving Sequences", function () {
            waitsFor(function () { 
                return designGenerated && deprojectsaved;
            }, "design generated and deproject saved", 500);
            runs(function(){
                sequences.forEach(function(sequence,key){
                    sequence.save({
                            callback:function(){ 
                                parts[key].setSequenceFile(sequences[key]); // Updated Ids
                                if(key==sequences.length-1) sequencesSaved = true; 
                            }
                    });
                });
            });
        });
        
        xit("Saving Parts", function () {
            waitsFor(function () { 
                return sequencesSaved;
            }, "sequences saved", 500);
            runs(function(){
                parts.forEach(function(part,key){
                    part.save({
                        callback:function(){
                            if(key==parts.length-1) partsSaved = true; 
                        }
                    });
                });
            });

        });

        xit("Saving Design", function () {
            waitsFor(function () {
                return partsSaved;
            }, "parts saved", 500);
            runs(function () {
                var deproject_id = deproject.get('id');
                design.set( 'deproject_id', deproject_id );
                deproject.set('id',deproject_id);
                deproject.setDesign(design);
                design.save({
                    callback:function(){
                        designsaved = true;
                    }
                });
            });
        });

    });


    /*

    var projectedited = false;
    describe("Editing Project", function () {
        it("Alter design model", function () {
            
            runs(function () {
                console.log("Editing Project");
                project.set('name','changed name');
                project.set('id',project_id);
                project.save({
                    callback: function(){
                        projectedited = true;
                    }
                });
            });
            
            waitsFor(function () {
                if(projectcreated) return true; else return false;
            }, "Saving DE Design Timeout", 9000);

        });

        it("Get Altered Project", function () {

            runs(function () {
                //console.log(project);
            });

            waitsFor(function () {
                if(projectedited) return true; else return false;
            }, "Editing Project Timeout", 9000);

        });

    });
    
    var deprojectedited = false;
    
    describe("Editing DE Project", function () {
        it("Alter design model", function () {
            
            waitsFor(function () {
                if(projectedited&&deprojectsaved) return true; else return false;
            }, "Project editing Timeout", 9000);


            runs(function () {
                console.log("Editing DE Project");
                deproject.set('name','DE Project changed');
                deproject.set('id',deproject_id);
                console.log(deproject);
                deproject.save({
                    callback: function(){
                        deprojectedited = true;
                    }
                });
            });
            
        });

        it("Get Altered DE Project", function () {
            waitsFor(function () {
                if(deprojectedited) return true; else return false;
            }, "Editing DE Project Timeout", 9000);


            runs(function () {
                //console.log(deproject);
            });
        });

    });
    
    var designedited = true;
    */
    /*
    describe("Editing DE Design", function () {
        it("Alter design model", function () {
            
            waitsFor(function () {
                if(deprojectedited) return true; else return false;
            }, "Editing DE Project Timeout", 9000);


            runs(function () {
                console.log("Editing design");
                design.createNewCollection(1);
                design.save({
                    callback: function(){
                        console.log("Design edited!");
                        designedited = true;
                    }
                });
            });
            
        });

        it("Get Altered design model", function () {
            waitsFor(function () {
                if(designedited) return true; else return false;
            }, "Editing Design Timeout", 9000);


            runs(function () {
                var editedDesign = deproject.getDesign();
                //console.log(editedDesign);
            });
        });

    });
*/
    
});