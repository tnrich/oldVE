/**
 * @class Teselagen.manager.J5CommunicationManager
 * Class describing a J5CommunicationManager.
 * J5CommunicationManager manages communication with the server.
 *
 * @author Rodrigo Pavez, Diana Wong
 */
Ext.define("Teselagen.manager.J5CommunicationManager", {

    singleton: true,

    currentResults: null,

    requires: ["Teselagen.bio.util.Sha256", "Teselagen.constants.Constants", "Ext.data.Store","Teselagen.manager.SessionManager"],

    statics: {},

    j5Parameters: null,

    masterFiles: null,

    assemblyMethod: null,

    designDownstreamAutomationResults: null,

    constructor: function () {},

    cancelj5Run: function(j5run_id,server,cb){
        var self = this;
        var j5run = (self.currentResults) ? self.currentResults.j5run : null;
        if(j5run || j5run_id&&server)
        {
            if(j5run&&!j5run_id&!server)
            {
                j5run_id = j5run.id;
                server = j5run.process.server
            }


            Ext.Ajax.request({
                url: 'http://'+server+'/cancelj5run',
                method: 'POST',
                params: {
                    id: j5run_id
                },
                success: function(response){
                    if(typeof(cb) == "function") return cb(false);
                    console.log(JSON.parse(response.responseText));
                },
                timeout: 100000
            });

        }
        else
        {
            console.log("No j5run to cancel");
        }
    },

    downloadCondenseAssemblyResults: function(btn){
        var response = this.condenseAssemblyFilesResults;
        var endDate = new Date(response.endDate);
        var fileName = "j5_CondenseAssemblies_"+endDate+"_"+response.username;
        var byteArray = Base64Binary.decodeArrayBuffer(response.data.encoded_output_file);
        var bb = new BlobBuilder();
        bb.append(byteArray);
        saveAs(bb.getBlob("data:application/stream;"), fileName);
        btn.toggle();
    },

    condenseAssemblyFiles: function(data,cb){
        toastr.options.onclick = null;
        
        toastr.info("Condensing Assembly Files...");

        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var inspector = currentTab.down('InspectorPanel');

        var self = this;
        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("condenseAssemblyFiles", ''),
            params: {
                data: JSON.stringify(data)
            },
            success: function (response) {
                response = JSON.parse(response.responseText);
                if(response.fault)
                {
                    return cb(false,response.fault);
                }
                var condenseAssembliesBtn = inspector.down("button[cls='downloadCondenseAssemblyResultsBtn']");
                condenseAssembliesBtn.show();


                toastr.options.onclick = null;
                
                toastr.success("Assembly Files Ready to Download");
                self.condenseAssemblyFilesResults = response;
                return cb(true);

            },
            failure: function(response, opts) {
                return cb(false,response);
            },
            timeout: 100000
        });
    },

    distributePCRRequest: function(data,cb){
        toastr.options.onclick = null;
        
        toastr.info("Distributing PCR Reactions...");

        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var inspector = currentTab.down('InspectorPanel');

        var files = {};
        files.encoded_plate_list_file = data.sourcePlateFileText;
        files.encoded_zipped_plate_files_file = data.zippedPlateFilesSelector;
        files.encoded_assembly_to_automate_file = data.assemblyFileText;

        var self = this;
        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("DesignDownstreamAutomation", ''),
            params: {
                files: JSON.stringify(files),
                params: JSON.stringify(data.params),
                reuseParams: data.reuse
            },
            success: function (response) {
                response = JSON.parse(response.responseText);
                if(response.fault)
                {
                    return cb(false,response.fault);
                }
                var downloadBtn = inspector.down('button[cls=downloadDownstreamAutomationBtn]');
                downloadBtn.show();


                toastr.options.onclick = null;
                
                toastr.success("PCR Distribution Complete");

                self.designDownstreamAutomationResults = response;

                return cb(true);

            },
            failure: function(response, opts) {
                return cb(false,response);
            },
            timeout: 100000
        });
    },

    /**
     * Generates an AJAX request to the j5 server.
     */
    generateAjaxRequest: function (cb) {


        var deproject = Ext.getCmp('mainAppPanel').getActiveTab().model;

        var self = this;
        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("executej5", ''),
            timeout: 100000,
            params: {
                deProjectId: deproject.data.id,
                parameters: JSON.stringify(this.j5Parameters),
                masterFiles: JSON.stringify(this.masterFiles),
                assemblyMethod: self.assemblyMethod
            },
            success: function (response) {
                response = JSON.parse(response.responseText);
                if(response.fault)
                {
                    return cb(false,response.fault);
                }
                self.currentResults = response;
                Teselagen.manager.TasksMonitor.addJ5RunObserver(self.currentResults.j5run);

                return cb(true,response);
            },
            failure: function(response) {
                if(response.status == -1) return cb(false,{"responseText":"Execution aborted."});
                else return cb(false,response);
            }
        });
        
    },
    downloadResults: function (btn) {
        if(this.currentResults) location.href="data:application/zip;base64,"+Teselagen.manager.SessionManager.buildUrl(this.currentResults.zipfile, "");
        btn.toggle();
    },

    downloadDownstreamAutomationResults: function(btn){
        var response = this.designDownstreamAutomationResults;
        var endDate = new Date(response.endDate);
        var fileName = "j5_DownstreamAutomation_"+endDate+"_"+response.username;
        var byteArray = Base64Binary.decodeArrayBuffer(response.data.encoded_output_file);
        var bb = new BlobBuilder();
        bb.append(byteArray);
        saveAs(bb.getBlob("data:application/stream;"), fileName);
        btn.toggle();
    },

    setParameters: function(j5Parameters, masterFiles, assemblyMethod, circular) {
        this.j5Parameters = j5Parameters.getParametersAsArray(circular);
        this.masterFiles = masterFiles;
        this.assemblyMethod = assemblyMethod;
    }
});
