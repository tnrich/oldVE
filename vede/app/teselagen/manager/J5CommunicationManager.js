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

    requires: ["Teselagen.bio.util.Sha256", "Teselagen.constants.Constants", "Ext.data.Store"],

    statics: {},

    j5Parameters: null,

    masterFiles: null,

    assemblyMethod: null,

    designDownstreamAutomationResults: null,

    constructor: function () {},

    downloadCondenseAssemblyResults: function(btn){
        var response = this.condenseAssemblyFilesResults;
        var byteArray = Base64Binary.decodeArrayBuffer(response.encoded_output_file);
        var bb = new BlobBuilder();
        bb.append(byteArray);
        saveAs(bb.getBlob("data:application/stream;"), response.output_filename);
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
                
                var condenseAssembliesBtn = inspector.down("button[cls='downloadCondenseAssemblyResultsBtn']");
                condenseAssembliesBtn.show();


                toastr.options.onclick = null;
                toastr.success("Assembly Files Ready to Download");

                self.condenseAssemblyFilesResults = response;
                return cb(true);

            },
            failure: function(response, opts) {
                return cb(false,response);
            }
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

                var downloadBtn = inspector.down('button[cls=downloadDownstreamAutomationBtn]');
                downloadBtn.show();
                self.designDownstreamAutomationResults = response;


                toastr.options.onclick = null;
                toastr.success("PCR Distribution Complete");

                return cb(true);

            },
            failure: function(response, opts) {
                return cb(false,response);
            }
        });
    },

    /**
     * Generates an AJAX request to the j5 server.
     */
    generateAjaxRequest: function (cb) {
//        console.log("Starting Ajax Request");

        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        // var runj5Btn = currentTab.j5Window.query('button[cls=//runj5Btn]')[0];
        // var resultsGrid = currentTab.j5Window.query('gridpanel[title=Plasmids]')[0];
        
        //resultsGrid.store.removeAll();

        //runj5Btn.toggle();

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
                
                self.currentResults = response;

                //var downloadBtn = currentTab.j5Window.query('button[cls=downloadj5Btn]')[0];
                /*
                var store = new Ext.data.JsonStore({
                    proxy: {
                        type: 'memory',
                        data:  self.currentResults.j5Results.assemblies,
                        reader: {
                            type: 'json',
                            root: 'files'
                        }
                    },
                    fields: ['name','sizeBP','size','fileContent']
                });
                */
                //store.load();
                //store.sort('name','ASC');
                //resultsGrid.reconfigure(store);
                //ownloadBtn.show();

                return cb(true,response);
            },
            failure: function(response) {
                if(response.status == -1) return cb(false,{"responseText":"Execution aborted."});
                else return cb(false,response);
            }
        });
        
    },
    downloadResults: function (btn) {
        if(this.currentResults) location.href="data:application/zip;base64,"+this.currentResults.zipfile;
        btn.toggle();
    },

    downloadDownstreamAutomationResults: function(btn){
        var response = this.designDownstreamAutomationResults;
        var byteArray = Base64Binary.decodeArrayBuffer(response.encoded_output_file);
        var bb = new BlobBuilder();
        bb.append(byteArray);
        saveAs(bb.getBlob("data:application/stream;"), response.output_filename);
        btn.toggle();
    },

    setParameters: function(j5Parameters,masterFiles,assemblyMethod){
        this.j5Parameters = j5Parameters.getParametersAsArray(true);
        this.masterFiles = masterFiles;
        this.assemblyMethod = assemblyMethod;
    }

});