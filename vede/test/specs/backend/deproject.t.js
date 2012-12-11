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
     "Teselagen.models.SequenceFile",
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
     "Teselagen.manager.DeviceDesignManager",
     "Teselagen.manager.ProjectManager",
     "Teselagen.manager.AuthenticationManager",
     "Teselagen.manager.SessionManager",
     "Teselagen.store.DeviceEditorProjectStore"
]);

 Ext.onReady(function () {
    var project, design, deproject, projectcreated, deprojectsaved, designsaved, project_id, 
        deproject_id, deprojStore;
    var isTestDataDeleted = false;
    var isDEprojectsDeleted = false;
    var isPartsDeleted = false;
    var isSequencesDeleted = false;
    var parts = [];
    var sequences = [];
    var designsaved = false;
    var deprojectsaved = false;
    var deprojectedited = false;
    var designGenerated = false;
    var designedited = true;
    var sequencesSaved = false;
    var partsSaved = false;
    var constants = Teselagen.constants.Constants;
    var projectManager = Teselagen.manager.ProjectManager;
    var authenticationManager = Teselagen.manager.AuthenticationManager;
    var sessionManager = Teselagen.manager.SessionManager;
    var DeviceDesignManager = Teselagen.manager.DeviceDesignManager;

    describe("Device Editor Project server tests.", function() {
        it("Clear test data", function() {
            runs(function() {
                Ext.Ajax.request({
                    url: "/api/deprojects",
                    method: "DELETE",
                    success: function() {
                        isDEprojectsDeleted = true;
                    }
                });
                Ext.Ajax.request({
                    url: "/api/parts",
                    method: "DELETE",
                    success: function() {
                        isPartsDeleted = true;
                    }
                });
                Ext.Ajax.request({
                    url: "/api/sequences",
                    method: "DELETE",
                    success: function() {
                        isSequencesDeleted = true;
                    }
                });
                waitsFor(function() {
                    isTestDataDeleted = isDEprojectsDeleted && isPartsDeleted && isSequencesDeleted;
                    return isTestDataDeleted;
                }, "test data deleted", 500)
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
            var binsArray = [], sequenceFile;

            for(var binIndex = 0;binIndex<2;binIndex++)
            {
                var newBin = Ext.create("Teselagen.models.J5Bin", {
                    binName: "bin"+binIndex
                });
                var tempParts = [];
                for(var i=0;i<2;i++)
                {
                    var newPart = Ext.create("Teselagen.models.Part", {
                        name: "part"+binIndex+i,
                        genbankStartBP: 1,
                        endBP: 7
                    });
                    parts.push(newPart);
                    tempParts.push(newPart);
                    sequenceFile = Ext.create("Teselagen.models.SequenceFile", {
                       sequenceFileFormat: constants.FASTA,
                       sequenceFileContent: "GATTACA"
                    });
                    sequences.push(sequenceFile);
                }
                newBin.addToParts(tempParts);
                binsArray.push(newBin);
            }

            // CREATE THE COLLECTION WITH BINS
            design = DeviceDesignManager.createDeviceDesignFromBins(binsArray);
            expect(design).toBeDefined();
            designGenerated = true;
        });

        it("Saving Sequences", function () {
            waitsFor(function () { 
                return designGenerated && deprojectsaved;
            }, "design generated and deproject saved", 500);
            runs(function(){
                sequences.forEach(function(sequence,key){
                    sequence.save({
                            success:function(){ 
                                parts[key].setSequenceFile(sequences[key]); // Updated Ids
                                if(key==sequences.length-1) {
                                    sequencesSaved = true; 
                                }
                            }
                    });
                });
            });
        });
        
        it("Saving Parts", function () {
            waitsFor(function () { 
                return sequencesSaved;
            }, "sequences saved", 500);
            runs(function(){
                parts.forEach(function(part,key){
                    part.save({
                        success:function(){
                            if(key==parts.length-1) {
                                partsSaved = true; 
                            }
                        }
                    });
                });
            });

        });

        it("Saving Design", function () {
            waitsFor(function () {
                return partsSaved;
            }, "parts saved", 500);
            runs(function () {
                var deproject_id = deproject.get('id');
                design.set( 'deproject_id', deproject_id );
                deproject.set('id',deproject_id);
                deproject.setDesign(design);
                design.save({
                    success:function(){
                        designsaved = true;
                    }
                });
            });
        });

        it("Edit DE project", function () {
            waitsFor(function () {
                return deprojectsaved;
            }, "DE Project saved", 500);
            runs(function () {
                deproject.set('name','DE Project changed');
                deproject.set('id',deproject_id);
                deproject.save({
                    success: function(){
                        deprojectedited = true;
                    }
                });
            });
        });

        it("Alter design model", function () {
            waitsFor(function () {
                return  deprojectedited;
            }, "editing DE Project", 500);
            runs(function () {
                design.createNewCollection(1);
                design.save({
                    success: function(){
                        designedited = true;
                    }
                });
            });
            waitsFor(function () {
                return  designedited;
            }, "editing DeviceDesign", 500);
            runs(function() {
               expect(designedited).toBe(true); 
            });
            
        });

    });
    
});