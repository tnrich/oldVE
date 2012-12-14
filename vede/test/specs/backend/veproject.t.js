/**
 * Vector Editor Project tests that access the server.
 * @author  Rodrigo Pavez, Yuri Bendana
 */

Ext.require(["Ext.Ajax",
 "Teselagen.bio.util.StringUtil",
 "Teselagen.bio.util.XmlToJson",
 "Teselagen.bio.util.Sha256",
 "Teselagen.bio.parsers.GenbankManager",
 "Teselagen.bio.parsers.ParsersManager",
 "Teselagen.utils.SequenceUtils",
 "Teselagen.utils.FormatUtils",
 "Teselagen.utils.DeXmlUtils",
 "Teselagen.constants.Constants",
 "Teselagen.models.SequenceFile",
 "Teselagen.models.Part",
 "Teselagen.models.Project",
 "Teselagen.models.VectorEditorProject",
 "Teselagen.manager.SequenceFileManager",
 "Teselagen.manager.AuthenticationManager",
 "Teselagen.manager.ProjectManager"]);

Ext.onReady(function () {
    var project, design, deproject, projectManager, authenticationManager, deprojectsaved, designsaved;
    var veproject_id;
    var veprojectEdited = false;
    var veprojectsaved = false;
    var sequenceSaved = false;
    var sequenceEdited = false;
    var createdSequenceFile = false;
    var isTestDataDeleted = false;
    var projectManager = Teselagen.manager.ProjectManager; // Now is singleton
    var authenticationManager = Teselagen.manager.AuthenticationManager; // Now is singleton

    describe("Vector Editor Project server tests.", function () {
        it("Clear test data", function() {
            runs(function() {
                Ext.Ajax.request({
                    url: "/api/veprojects",
                    method: "DELETE",
                    success: function() {
                        isTestDataDeleted = true;
                    }
                });
            });
        });

        it("Create VE Project", function () {
            waitsFor(function() {
                return isTestDataDeleted;
            }, "deleted test data", 500);
            runs(function () {
                veproject = Ext.create("Teselagen.models.VectorEditorProject", {
                    name: "My VE Project #1"
                });
                var currentProject = projectManager.currentUser.projects().last();
                currentProject.veprojects().add(veproject);
                veproject.save({
                    success: function(){
                        veprojectsaved = true;
                    }
                });

            });
        });
            
        it("Create new SequenceFile", function () {
            waitsFor(function () {
                return veprojectsaved;
            }, "saving VE project", 500);
            runs(function() {
                var selectedFile = '/test/data/sequences/gen_bank_ex.gb';
                Ext.Ajax.request({
                    url: selectedFile,
                    method: 'GET',
                    success: function(response){
                        var text = response.responseText;
                        newSequence = Ext.create("Teselagen.models.SequenceFile", {
                            sequenceFileName: "gen_bank_ex.gb",
                            sequenceFileFormat: "Genbank",
                            sequenceFileContent: text
                        });
                        createdSequenceFile = true;
                    }
                });
            });
            waitsFor(function () {
                return createdSequenceFile;
            }, "creating SequenceFile", 500);
            runs(function () {
                veproject_id = veproject.get('id');
                expect (Ext.isEmpty(veproject_id)).toBe(false);
                veproject.setSequenceFile(newSequence);
                newSequence.set( 'veproject_id', veproject_id );
                newSequence.save({
                    success: function() {
                        sequenceSaved = true;
                    }
                });
            });
        });

        it("Edit VE Project", function () {
            waitsFor(function () {
                return veprojectsaved;
            }, "saving SequenceFile", 500);
            runs(function () {
                console.log(veproject);
                veproject.set('name','Modified VEProject Name');
                veproject.save({
                    success: function(){
                        veprojectEdited = true;
                    }
                });
            });
            waitsFor(function() {
                return veprojectEdited;
            }, "VE project edited", 500);
            runs(function() {
                expect(veprojectEdited).toBe(true);
            })
        });
        
        it("Edit Sequence", function () {
            waitsFor(function () {
                return sequenceSaved;
            }, "saving SequenceFile", 500);
            runs(function () {
                newSequence.set('sequenceFileName','Modified Sequence FileName');
                newSequence.save({
                    success: function(){
                        sequenceEdited = true;
                    }
                });
            });
            waitsFor(function() {
                return sequenceEdited;
            }, "sequence edited", 500);
            runs(function() {
                expect(sequenceEdited).toBe(true);
            })
        });
        
    });

});