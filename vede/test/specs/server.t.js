/**
 * Testing J5 submission.
 * Creates models and converts to JSON for J5 server submission.
 * @author Diana Wong, Rodrigo Pavez
 */

Ext.syncRequire(["Ext.Ajax", "Teselagen.bio.util.StringUtil", "Teselagen.bio.util.XmlToJson", "Teselagen.bio.util.Sha256", "Teselagen.bio.parsers.GenbankManager", "Teselagen.bio.parsers.ParsersManager", "Teselagen.utils.SequenceUtils", "Teselagen.utils.FormatUtils", "Teselagen.utils.DeXmlUtils", "Teselagen.constants.Constants", "Teselagen.models.SequenceFile", "Teselagen.models.Part", "Teselagen.models.J5Bin", "Teselagen.models.J5Collection", "Teselagen.models.EugeneRule", "Teselagen.models.SBOLvIconInfo", "Teselagen.models.J5Run", "Teselagen.models.J5Parameters", "Teselagen.models.DownstreamAutomationParameters", "Teselagen.models.J5Results", "Teselagen.models.DeviceDesign", "Teselagen.models.Project", "Teselagen.manager.SequenceFileManager", "Teselagen.manager.EugeneRuleManager", "Teselagen.manager.DeviceDesignManager"], function () {
    console.log('Requires are ready');


    Ext.define('sessionData', {
        singleton: true,
        data: null,
        baseURL: 'http://teselagen.local/api/'
    });

    function ajaxCheck(ajaxMethod, args, cb) {
        /**
         * @author Rodrigo Pavez
         * Custom function for checking ajax request
         * Need to add in the method: if (cb) return cb(true); // for testing
         *
         * Input: (method,args,cb)
         * method: Method to test
         * args: array of arguments
         * cb (optional): function to be called after success
         */

        var ajaxTimeOut = 10000;

        args.push(function (r) {
            flag = r;
        });
        var flag = false;
        runs(function () {
            ajaxMethod.apply(this, args);
        });

        waitsFor(function () {
            if(flag) cb(flag);
            return flag;
        }, "Ajax has not responded in setup timeout", ajaxTimeOut);
    };


    var design, deproject, projectManager;
    var server = 'http://teselagen.local/api/';

    describe("Connection to server", function () {
        it("Setup params", function () {
            Ext.Ajax.cors = true; // Allow CORS
            Ext.Ajax.method = 'POST'; // Set POST as default Method
            sessionData.baseURL = server;
        });

        it("Checking server " + server + " is running", function () {
            var check = function (cb) {
                    Ext.Ajax.request({
                        url: server,
                        method: 'GET',
                        success: function () {
                            return cb(true);
                        },
                        failure: function () {
                            return cb(false);
                        }
                    });
                };
            ajaxCheck(check, [], function (res) {
                expect(res).toBe(true);
            });
        });
    });

    describe("Authentication", function () {

        it("Create Authentication Manager and Login as Root on teselagen.local server", function () {
            var authenticationManager = Ext.create("Teselagen.manager.AuthenticationManager"); // Created Auth manager
            var args = ['rpavez', '', 'http://teselagen.local/api/'];
            ajaxCheck(authenticationManager.manualAuth, args, function () {
                expect(sessionData.AuthResponse).toBeDefined();
            });
        });

    });

    describe("Create Project Manager, Get User Profile and Projects", function () {

        it("Create Project Manager", function () {
            projectManager = Ext.create("Teselagen.manager.ProjectManager"); // Created Project Manager
        });

        it("Get User Profile and Get User Projects", function () {

            runs(function () {

                projectManager.loadUser(function () {
                    expect(projectManager.currentUser).toBeDefined();
                    expect(projectManager.projects).toBeDefined();
                });


            });

            waitsFor(function () {
                if(sessionData.AuthResponse) return true;
                else return false;
            }, "Auth took too much time", 750);

        });

        it("", function () {

        });

    });

    //Sha256              = Teselagen.bio.util.Sha256;
    //SequenceFileManager = Teselagen.manager.SequenceFileManager;
    DeviceDesignManager = Teselagen.manager.DeviceDesignManager;

    describe("Create DeviceEditor Project and Design and Attach to project", function () {

        it("Generate in-memory DE Design", function () {

            // In creating this design, use bare minimum required fields
            // Will build this from the models.
            // The correct way would be to use DeviceDesignManager.js
            // Create Bin1 with 2 Part with 1 SequenceFile each
            seq1a = Ext.create("Teselagen.models.SequenceFile", {
                sequenceFileFormat: "Fasta",
                sequenceFileConttent: ">seq1a\nGATTACA"
            });
            part1a = Ext.create("Teselagen.models.Part", {
                name: "part1a",
                genbankStartBP: 1,
                endBP: 10
            });
            part1a.setSequenceFile(seq1a);


            seq1b = Ext.create("Teselagen.models.SequenceFile", {
                sequenceFileFormat: "Fasta",
                sequenceFileContent: ">seq1b\nTTTTTTTTTT"
            });
            part1b = Ext.create("Teselagen.models.Part", {
                name: "part1b",
                genbankStartBP: 20,
                endBP: 30
            });
            part1b.setSequenceFile(seq1b);

            bin1 = Ext.create("Teselagen.models.J5Bin", {
                binName: "bin1"
            });
            bin1.addToParts([part1a, part1b]);

            // Create Bin2 with 1 Part with 1 SequenceFile
            seq2a = Ext.create("Teselagen.models.SequenceFile", {
                sequenceFileFormat: "Fasta",
                sequenceFileContent: ">seq1b\nAAAAAAAAA"
            });
            part2a = Ext.create("Teselagen.models.Part", {
                name: "part2a",
                genbankStartBP: 1,
                endBP: 10
            });
            part2a.setSequenceFile(seq2a);

            bin2 = Ext.create("Teselagen.models.J5Bin", {
                binName: "bin2"
            });
            bin2.addToParts(part2a);

            // CREATE THE COLLECTION WITH BINS
            design = DeviceDesignManager.createDeviceDesignFromBins([bin1, bin2]);

            // EUGENE RULE
            rule1 = Ext.create("Teselagen.models.EugeneRule", {
                name: "rule1",
                negationOperator: false,
                compositionalOperator: "BEFORE",
                operand2: part2a
            });
            rule1.setOperand1(part1a);
            design.addToRules(rule1);

        });

        it("Generate DE Project and Save to Server", function () {

            waits(500);

            runs(function () {
                
                deproject = Ext.create("Teselagen.models.DeviceEditorProject", {
                    id: undefined,
                    project_id: undefined,
                    name: "My Project"
                });

                //deproject.save();
                deproject.setDesign(design);
                projectManager.currentUser.projects().add(deproject);
                projectManager.currentUser.save(); 


            });

        });

    });

    describe("Save the design to server", function () {

        it("Save DE Design to Server", function () {

            runs(function () {
                design.save();
            });

            waitsFor(function () {
                if(design) return true;
                else return false;
            }, "DE Project creation took too much time", 100);


        });

    });

});