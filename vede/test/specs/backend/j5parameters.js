/**
 * Testing J5 submission.
 * Creates models and converts to JSON for J5 server submission.
 * @author Diana Wong, Rodrigo Pavez
 */

Ext.syncRequire(["Ext.Ajax",
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
 "Teselagen.models.J5Bin",
 "Teselagen.models.J5Collection",
 "Teselagen.models.EugeneRule",
 "Teselagen.models.SBOLvIconInfo",
 "Teselagen.models.J5Run",
 "Teselagen.models.J5Parameters",
 "Teselagen.models.DownstreamAutomationParameters",
 "Teselagen.models.J5Results",
 "Teselagen.models.DeviceDesign",
 "Teselagen.models.Project",
 "Teselagen.manager.SequenceFileManager",
 "Teselagen.manager.DeviceDesignManager",
 "Teselagen.manager.ProjectManager",
 "Teselagen.manager.AuthenticationManager",
 "Teselagen.manager.ProjectManager",
 "Teselagen.manager.SessionManager"], 
 function () {
    describe("Test j5 Parameters", function () {
        var j5Parameters;

        it("Create j5Parameters Model", function () {

            j5Parameters = Ext.create("Teselagen.models.J5Parameters");
            j5Parameters.setDefaultValues();

        });

        it("Test getParametersAsArray method", function () {
            var j5ParamsArray = j5Parameters.getParametersAsArray(true);
            for(var prop in j5ParamsArray) {
                expect(j5ParamsArray[prop]).toBeDefined();
            }
        });    
    });
});