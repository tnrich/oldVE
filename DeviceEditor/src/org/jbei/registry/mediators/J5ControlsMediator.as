package org.jbei.registry.mediators
{
    import com.ak33m.rpc.xmlrpc.XMLRPCObject;
    
    import flash.events.Event;
    import flash.events.IOErrorEvent;
    import flash.events.MouseEvent;
    import flash.events.TimerEvent;
    import flash.net.FileFilter;
    import flash.net.FileReference;
    import flash.net.URLRequest;
    import flash.net.URLRequestMethod;
    import flash.net.navigateToURL;
    import flash.utils.ByteArray;
    import flash.utils.Timer;
    
    import mx.collections.ArrayCollection;
    import mx.collections.Sort;
    import mx.collections.SortField;
    import mx.controls.Alert;
    import mx.core.Application;
    import mx.events.FlexEvent;
    import mx.managers.PopUpManager;
    import mx.rpc.AsyncToken;
    import mx.rpc.events.FaultEvent;
    import mx.rpc.events.ResultEvent;
    import mx.utils.Base64Decoder;
    import mx.utils.Base64Encoder;
    import mx.utils.ObjectProxy;
    
    import nochump.util.zip.ZipEntry;
    import nochump.util.zip.ZipFile;
    
    import org.jbei.registry.ApplicationFacade;
    import org.jbei.registry.Constants;
    import org.jbei.registry.Notifications;
    import org.jbei.registry.commands.FunctionMediator;
    import org.jbei.registry.models.DownstreamAutomationParameters;
    import org.jbei.registry.models.J5Parameters;
    import org.jbei.registry.models.Part;
    import org.jbei.registry.models.j5.J5Collection;
    import org.jbei.registry.proxies.DownstreamAutomationParametersProxy;
    import org.jbei.registry.proxies.J5CollectionProxy;
    import org.jbei.registry.proxies.J5ParametersProxy;
    import org.jbei.registry.utils.J5ControlsUtils;
    import org.jbei.registry.utils.ZipMaker;
    import org.jbei.registry.view.ui.Colors;
    import org.jbei.registry.view.ui.PlasmidLinkButtonEvent;
    import org.jbei.registry.view.ui.dialogs.DownstreamAutomationParametersDialog;
    import org.jbei.registry.view.ui.dialogs.J5Controls;
    import org.jbei.registry.view.ui.dialogs.J5ParametersDialog;
    import org.puremvc.as3.interfaces.INotification;
    import org.puremvc.as3.patterns.mediator.Mediator;
    
    public class J5ControlsMediator extends Mediator
    {
        public static const NAME:String = "J5ControlsMediator";
        
        private static const CSV_FILE_TYPES:FileFilter = new FileFilter("CSV File", "*.csv");
        private static const ZIP_FILE_TYPES:FileFilter = new FileFilter("ZIP File", "*.zip");
        private static const ALL_FILE_TYPES:FileFilter = new FileFilter("All Files", "*");

        // XML RPC method names
        private static const GET_LAST_UPDATED_USER_FILES:String = "GetLastUpdatedUserFiles";
        private static const GET_SERVER_J5_PARAMETERS:String = "GetServerJ5Parameters";
        private static const DESIGN_ASSEMBLY:String = "DesignAssembly";
        private static const CONDENSE_MULTIPLE_ASSEMBLY_FILES:String = "CondenseMultipleAssemblyFiles";
        private static const DESIGN_DOWNSTREAM_AUTOMATION:String = "DesignDownstreamAutomation";
        
        private var _j5Controls:J5Controls;
        private var _j5ParametersDialog:J5ParametersDialog;
        private var _downstreamAutomationParametersDialog:DownstreamAutomationParametersDialog;
        
        private var masterPlasmidsListFileRef:FileReference;
        private var masterOligosListFileRef:FileReference;
        private var masterDirectSynthesesListFileRef:FileReference;
        private var userAssemblyFileFileRef:FileReference;
        private var assemblyFilesListFileRef:FileReference;
        private var zippedAssemblyFilesFileRef:FileReference;
        private var sourcePlateListFileRef:FileReference;
        private var zippedPlateFilesFileRef:FileReference;
        private var condensedJ5AssemblyFileFileRef:FileReference;

        private var assemblyMethodOptions:ArrayCollection = new ArrayCollection();

        private var xmlrpcObject:XMLRPCObject;
        
        private var currentRunID:String = null;
        private var runJ5OutputFile:ByteArray;
        private var runJ5OutputFileName:String;
        private var j5ResultsZipFile:ZipFile;
        
        private var isWaitingForCondenseAssembliesResult:Boolean = false;
        private var encodedCondenseAssembliesOutputFile:String;
        private var condenseAssembliesOutputFileName:String;
        
        private var isWaitingForDistributePcrReactionsResult:Boolean = false;
        private var encodedDistributePcrReactionsOutputFile:String;
        private var distributePcrReactionsOutputFileName:String;
        
        private var j5CollectionProxy:J5CollectionProxy = ApplicationFacade.getInstance().retrieveProxy(J5CollectionProxy.NAME) as J5CollectionProxy;
        private var j5ParametersProxy:J5ParametersProxy = ApplicationFacade.getInstance().retrieveProxy(J5ParametersProxy.NAME) as J5ParametersProxy;
        private var downstreamAutomationParametersProxy:DownstreamAutomationParametersProxy = ApplicationFacade.getInstance().retrieveProxy(DownstreamAutomationParametersProxy.NAME) as DownstreamAutomationParametersProxy;
        
        // Constructor
        public function J5ControlsMediator()
        {
            super(NAME, null);
        }
        
        // Public Methods
        public function get functionMediator():FunctionMediator
        {
            return ApplicationFacade.getInstance().retrieveMediator(FunctionMediator.NAME) as FunctionMediator;
        }
        
        public function get mainCanvasMediator():MainCanvasMediator
        {
            return (facade as ApplicationFacade).retrieveMediator(MainCanvasMediator.NAME) as MainCanvasMediator;
        }
        
        public override function listNotificationInterests():Array
        {
            return [
                Notifications.NEW_SHOW_J5_DIALOG
            ];
        }
        
        public override function handleNotification(notification:INotification):void
        {
            switch (notification.getName())
            {
                case Notifications.NEW_SHOW_J5_DIALOG:
                    // create new J5Controls if it does not already exist
                    if (_j5Controls == null) {
                        _j5Controls = new J5Controls();
                        _j5Controls.addEventListener(FlexEvent.CREATION_COMPLETE, onJ5ControlsDialogCreationComplete);
                        setViewComponent(_j5Controls);
                    }
                    
                    showJ5Controls();
                    break;
            }
        }
        
        // Event Handlers
        private function onJ5ControlsDialogCreationComplete(event:FlexEvent):void
        {
            // set default radio button selections
            _j5Controls.generatePlasmidsListRadioButton.selected = true;
            _j5Controls.generateOligosListRadioButton.selected = true;
            _j5Controls.generateDirectSynthesesListRadioButton.selected = true;
            _j5Controls.generateDownstreamAutomationParametersFileRadioButton.selected = true;
            
            // initialize XML RPC
            xmlrpcObject = new XMLRPCObject();
            xmlrpcObject.endpoint = Constants.SERVER_PATH;
            xmlrpcObject.destination = ApplicationFacade.getInstance().rootDir + "/bin/j5_xml_rpc.pl";
            xmlrpcObject.addEventListener(ResultEvent.RESULT, onXMLRPCResult);
            xmlrpcObject.addEventListener(FaultEvent.FAULT, onXMLRPCFault);
            
            var paramObj:Object = new Object();
            paramObj.j5_session_id = ApplicationFacade.getInstance().sessionId;
            var myToken:AsyncToken = xmlrpcObject.GetLastUpdatedUserFiles(paramObj);
            myToken.methodName = GET_LAST_UPDATED_USER_FILES;

            // add event listeners for buttons, etc. (can only be done after creation)
            // Run j5 tab
            _j5Controls.editJ5ParametersButton.addEventListener(MouseEvent.CLICK, onEditJ5ParametersButtonClick);
            _j5Controls.useServerPlasmidsListRadioButton.addEventListener(MouseEvent.CLICK, onUseServerPlasmidsListRadioButtonClick);
            _j5Controls.generatePlasmidsListRadioButton.addEventListener(MouseEvent.CLICK, onGeneratePlasmidsListRadioButtonClick);
            _j5Controls.uploadMasterPlasmidsListButton.addEventListener(MouseEvent.CLICK, onUploadMasterPlasmidsListButtonClick);
            _j5Controls.useServerOligosListRadioButton.addEventListener(MouseEvent.CLICK, onUseServerOligosListRadioButtonClick);
            _j5Controls.generateOligosListRadioButton.addEventListener(MouseEvent.CLICK, onGenerateOligosListRadioButtonClick);
            _j5Controls.uploadMasterOligosListButton.addEventListener(MouseEvent.CLICK, onUploadMasterOligosListButtonClick);
            _j5Controls.useServerDirectSynthesesListRadioButton.addEventListener(MouseEvent.CLICK, onUseServerDirectSynthesesListRadioButtonClick);
            _j5Controls.generateDirectSynthesesListRadioButton.addEventListener(MouseEvent.CLICK, onGenerateDirectSynthesesListRadioButtonClick);
            _j5Controls.uploadMasterDirectSynthesesListButton.addEventListener(MouseEvent.CLICK, onUploadMasterDirectSynthesesListButtonClick);
            _j5Controls.runJ5Button.addEventListener(MouseEvent.CLICK, onRunJ5ButtonClick);
            _j5Controls.runJ5StopWaitingButton.addEventListener(MouseEvent.CLICK, onRunJ5StopWaitingButtonClick);
            _j5Controls.downloadRunJ5ResultsButton.addEventListener(MouseEvent.CLICK, onDownloadRunJ5ResultsButtonClick);
            _j5Controls.loadUserAssemblyFileButton.addEventListener(MouseEvent.CLICK, onLoadUserAssemblyFileButtonClick);
            _j5Controls.plasmidsDataGrid.addEventListener(PlasmidLinkButtonEvent.BUTTON_CLICKED, onPlasmidLinkButtonClick);
            
            // Condense Assembly Files tab
            _j5Controls.uploadAssemblyFilesListButton.addEventListener(MouseEvent.CLICK, onUploadAssemblyFilesListButtonClick);
            _j5Controls.uploadZippedAssemblyFilesButton.addEventListener(MouseEvent.CLICK, onUploadZippedAssemblyFilesButtonClick);
            _j5Controls.condenseAssembliesButton.addEventListener(MouseEvent.CLICK, onCondenseAssembliesButtonClick);
            _j5Controls.condenseAssembliesStopWaitingButton.addEventListener(MouseEvent.CLICK, onCondenseAssembliesStopWaitingButtonClick);
            _j5Controls.downloadCondenseAssembliesResultsButton.addEventListener(MouseEvent.CLICK, onDownloadCondenseAssembliesResultsButtonClick);
            
            // Downstream Automation tab
            _j5Controls.editDownstreamAutomationParametersButton.addEventListener(MouseEvent.CLICK, onEditDownstreamAutomationParametersButtonClick);
            _j5Controls.uploadSourcePlateListButton.addEventListener(MouseEvent.CLICK, onUploadSourcePlateListButtonClick);
            _j5Controls.uploadZippedPlateFilesButton.addEventListener(MouseEvent.CLICK, onUploadZippedPlateFilesButtonClick);
            _j5Controls.uploadCondensedJ5AssemblyFileButton.addEventListener(MouseEvent.CLICK, onUploadCondensedJ5AssemblyFileButtonClick);
            _j5Controls.distributePcrReactionsButton.addEventListener(MouseEvent.CLICK, onDistributePcrReactionsButtonClick);
            _j5Controls.distributePcrStopWaitingButton.addEventListener(MouseEvent.CLICK, onDistributePcrStopWaitingButtonClick);
            _j5Controls.downloadDistributePcrReactionsResultsButton.addEventListener(MouseEvent.CLICK, onDownloadDistributePcrReactionsResultsButtonClick);
            
            // j5 Files tab
            _j5Controls.j5SeqFileGenerateButton.addEventListener(MouseEvent.CLICK, onJ5SeqFileGenerateButtonClick);
            _j5Controls.j5PartsFileGenerateButton.addEventListener(MouseEvent.CLICK, onJ5PartsFileGenerateButtonClick);
            _j5Controls.j5TargetFileGenerateButton.addEventListener(MouseEvent.CLICK, onJ5TargetFileGenerateButtonClick);
            _j5Controls.j5EugeneFileGenerateButton.addEventListener(MouseEvent.CLICK, onJ5EugeneFileGenerateButtonClick);
            _j5Controls.j5GenbankFileGenerateButton.addEventListener(MouseEvent.CLICK, onJ5GenbankFileGenerateButtonClick);
            _j5Controls.j5FastaFileGenerateButton.addEventListener(MouseEvent.CLICK, onJ5FastaFileGenerateButtonClick);
            _j5Controls.j5JbeiSeqFileGenerateButton.addEventListener(MouseEvent.CLICK, onJ5JbeiSeqFileGenerateButtonClick);
            _j5Controls.completeFileGenerateButton.addEventListener(MouseEvent.CLICK, onCompleteFileGenerateButtonClick);
            _j5Controls.j5ParametersGenerateButton.addEventListener(MouseEvent.CLICK, onJ5ParametersGenerateButtonClick);
            _j5Controls.downstreamAutomationParametersGenerateButton.addEventListener(MouseEvent.CLICK, onDownstreamAutomationParametersGenerateButtonClick);
        }
        
        private function onXMLRPCResult(event:ResultEvent):void
        {
            var base64Decoder:Base64Decoder = new Base64Decoder();
            
            switch (event.token.methodName) {
                case GET_LAST_UPDATED_USER_FILES:
                    var j5ParametersFileExistsMatch:Array = String(event.result.j5_parameters_file_exists).match(/^TRUE$/i);
                    var masterPlasmidsFileExistsMatch:Array = String(event.result.master_plasmids_file_exists).match(/^TRUE$/i);
                    var masterOligosFileExistsMatch:Array = String(event.result.master_oligos_file_exists).match(/^TRUE$/i);
                    var masterDirectSynthesesFileExistsMatch:Array = String(event.result.master_direct_syntheses_file_exists).match(/^TRUE$/i);
                    var downstreamAutomationParametersFileExistsMatch:Array = String(event.result.downstream_automation_parameters_file_exists).match(/^TRUE$/i);
                    
                    if (j5ParametersFileExistsMatch != null && j5ParametersFileExistsMatch.length > 0) {
                        //get parameters file from server, update parameters in DE
                        base64Decoder.reset();
                        base64Decoder.decode(event.result.encoded_j5_parameters_file);
                        var j5ParametersFile:String = base64Decoder.toByteArray().toString();
                        sendNotification(Notifications.NEW_UPDATE_J5_PARAMETERS, j5ParametersFile);
                    } //else if there is no j5 parameters file on the server, use defaults (do nothing here)
                    _j5Controls.editJ5ParametersButton.enabled = true;
                    _j5Controls.editJ5ParametersButton.toolTip = "";
                    
                    if (masterPlasmidsFileExistsMatch != null && masterPlasmidsFileExistsMatch.length > 0) {
                        _j5Controls.useServerPlasmidsListRadioButton.enabled = true;
                        _j5Controls.useServerPlasmidsListRadioButton.selected = true;
                    }
                    if (masterOligosFileExistsMatch != null && masterOligosFileExistsMatch.length > 0) {
                        _j5Controls.useServerOligosListRadioButton.enabled = true;
                        _j5Controls.useServerOligosListRadioButton.selected = true;
                    }
                    if (masterDirectSynthesesFileExistsMatch != null && masterDirectSynthesesFileExistsMatch.length > 0) {
                        _j5Controls.useServerDirectSynthesesListRadioButton.enabled = true;
                        _j5Controls.useServerDirectSynthesesListRadioButton.selected = true;
                    }
                    if (downstreamAutomationParametersFileExistsMatch != null && downstreamAutomationParametersFileExistsMatch.length > 0) {
                        _j5Controls.useServerDownstreamAutomationParametersFileRadioButton.enabled = true;
                        _j5Controls.useServerDownstreamAutomationParametersFileRadioButton.selected = true;
                    }
                    
                    _j5Controls.j5Tabs.setFocus();
                    break;
                
                case GET_SERVER_J5_PARAMETERS:
                    j5ParametersFileExistsMatch = String(event.result.j5_parameters_file_exists).match(/^TRUE$/i);
                    if (j5ParametersFileExistsMatch != null && j5ParametersFileExistsMatch.length > 0) {
                        resetJ5ParametersDialogToDefaults(); //since anything not specified in parameters file gets default value
                        //get parameters file from server, update parameters in parameters dialog
                        base64Decoder.reset();
                        base64Decoder.decode(event.result.encoded_j5_parameters_file);
                        j5ParametersFile = base64Decoder.toByteArray().toString();
                        resetJ5ParametersDialogToFile(j5ParametersFile);
                    } else {
                        Alert.show("No existing j5 parameters values available on server. Values not changed.", "Warning Message");
                    }
                    break;
                
                case DESIGN_ASSEMBLY:
                    if (event.token.id == currentRunID) {
                        showRunJ5Button();
                        _j5Controls.runJ5ProgressBar.visible = false;
                        
                        var encodedRunJ5OutputFile:String = event.result.encoded_output_file;
                        runJ5OutputFileName = event.result.output_filename;
                        
                        base64Decoder.reset();
                        base64Decoder.decode(encodedRunJ5OutputFile);
                        runJ5OutputFile = base64Decoder.toByteArray();
                        j5ResultsZipFile = new ZipFile(runJ5OutputFile);
                        
                        populateJ5ResultsDisplay();
                        
                        _j5Controls.downloadRunJ5ResultsButton.visible = true;
                        
                        if (!_j5Controls.useServerPlasmidsListRadioButton.enabled) {
                            _j5Controls.useServerPlasmidsListRadioButton.enabled = true;
                        }
                        if (!_j5Controls.useServerOligosListRadioButton.enabled) {
                            _j5Controls.useServerOligosListRadioButton.enabled = true;
                        }
                        if (!_j5Controls.useServerDirectSynthesesListRadioButton.enabled) {
                            _j5Controls.useServerDirectSynthesesListRadioButton.enabled = true;
                        }
                        
                        currentRunID = null;
                    }
                    break;
                
                case CONDENSE_MULTIPLE_ASSEMBLY_FILES:
                    showCondenseAssembliesButton();
                    _j5Controls.condenseAssembliesProgressBar.visible = false;
                    
                    encodedCondenseAssembliesOutputFile = event.result.encoded_output_file;
                    condenseAssembliesOutputFileName = event.result.output_filename;
                    
                    _j5Controls.downloadCondenseAssembliesResultsButton.visible = true;
                    break;
                
                case DESIGN_DOWNSTREAM_AUTOMATION:
                    showDistributePcrButton();
                    _j5Controls.distributePcrProgressBar.visible = false;
                    
                    encodedDistributePcrReactionsOutputFile = event.result.encoded_output_file;
                    distributePcrReactionsOutputFileName = event.result.output_filename;
                    
                    _j5Controls.downloadDistributePcrReactionsResultsButton.visible = true;
                    
                    if (!_j5Controls.useServerDownstreamAutomationParametersFileRadioButton.enabled) {
                        _j5Controls.useServerDownstreamAutomationParametersFileRadioButton.enabled = true;
                    }
                    break;
            }
        }
        
        private function onXMLRPCFault(event:FaultEvent):void
        {
            switch (event.token.methodName) {
                case GET_LAST_UPDATED_USER_FILES:
                    _j5Controls.editJ5ParametersButton.enabled = true;
                    _j5Controls.editJ5ParametersButton.toolTip = "";
                    Alert.show("Problem communicating with server. Could not retrieve existing j5 parameters values from server. "
                        + "Using defaults.\n\nServer message: " + event.fault.faultString, "Error Message");
                    break;
                
                case GET_SERVER_J5_PARAMETERS:
                    Alert.show("Could not retrieve existing j5 parameters values from server. Values not changed.\n\n"
                        + "Server message: " + event.fault.faultString, "Error Message");
                    break;
                
                case DESIGN_ASSEMBLY:
                    if (event.token.id == currentRunID) {
                        showRunJ5Button();
                        
                        _j5Controls.runJ5ErrorText.text = "Error: " + event.fault.faultString;
                        _j5Controls.runJ5ErrorText.visible = true;
                        _j5Controls.runJ5ProgressBar.visible = false;
                        _j5Controls.runJ5ProgressHBox.width = 0;
                        
                        currentRunID = null;
                    }
                    break;
                
                case CONDENSE_MULTIPLE_ASSEMBLY_FILES:
                    showCondenseAssembliesButton();
                    
                    _j5Controls.condenseAssembliesErrorText.text = "Error: " + event.fault.faultString;
                    _j5Controls.condenseAssembliesErrorText.visible = true;
                    _j5Controls.condenseAssembliesProgressBar.visible = false;
                    _j5Controls.condenseAssembliesProgressHBox.width = 0;
                    break;
                
                case DESIGN_DOWNSTREAM_AUTOMATION:
                    showDistributePcrButton();
                    
                    _j5Controls.distributePcrErrorText.text = "Error: " + event.fault.faultString;
                    _j5Controls.distributePcrErrorText.visible = true;
                    _j5Controls.distributePcrProgressBar.visible = false;
                    _j5Controls.distributePcrProgressHBox.width = 0;
                    break;
            }
        }
        
        private function onLoadError(e:IOErrorEvent):void
        {
            Alert.show("Error loading file : " + e.text, "Error Message");
        }
        
        private function onSaveError(e:IOErrorEvent):void
        {
            Alert.show("Error saving file : " + e.text + "\nPossibly a file is open already with this name", "Error Message");
        }
        
        // event handlers for Run j5 tab
        private function onUseServerPlasmidsListRadioButtonClick(event:Event):void
        {
            masterPlasmidsListFileRef = null;
            _j5Controls.uploadMasterPlasmidsListTextInput.text = "";
        }
        
        private function onUseServerOligosListRadioButtonClick(event:Event):void
        {
            masterOligosListFileRef = null;
            _j5Controls.uploadMasterOligosListTextInput.text = "";
        }
        
        private function onUseServerDirectSynthesesListRadioButtonClick(event:Event):void
        {
            masterDirectSynthesesListFileRef = null;
            _j5Controls.uploadMasterDirectSynthesesListTextInput.text = "";
        }
        
        private function onGeneratePlasmidsListRadioButtonClick(event:MouseEvent):void
        {
            masterPlasmidsListFileRef = null;
            _j5Controls.uploadMasterPlasmidsListTextInput.text = "";
        }
        
        private function onGenerateOligosListRadioButtonClick(event:MouseEvent):void
        {
            masterOligosListFileRef = null;
            _j5Controls.uploadMasterOligosListTextInput.text = "";
        }
        
        private function onGenerateDirectSynthesesListRadioButtonClick(event:MouseEvent):void
        {
            masterDirectSynthesesListFileRef = null;
            _j5Controls.uploadMasterDirectSynthesesListTextInput.text = "";
        }
        
        private function onUploadMasterPlasmidsListButtonClick(event:MouseEvent):void
        {
            if (masterPlasmidsListFileRef == null) {
                masterPlasmidsListFileRef = new FileReference();
                masterPlasmidsListFileRef.addEventListener(Event.SELECT, onMasterPlasmidsListFileSelected);
                masterPlasmidsListFileRef.addEventListener(Event.COMPLETE, onMasterPlamsidsListLoaded);
                masterPlasmidsListFileRef.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
            }
            masterPlasmidsListFileRef.browse([CSV_FILE_TYPES, ALL_FILE_TYPES]);
        }
        
        private function onUploadMasterOligosListButtonClick(event:MouseEvent):void
        {
            if (masterOligosListFileRef == null) {
                masterOligosListFileRef = new FileReference();
                masterOligosListFileRef.addEventListener(Event.SELECT, onMasterOligosListFileSelected);
                masterOligosListFileRef.addEventListener(Event.COMPLETE, onMasterOligosListLoaded);
                masterOligosListFileRef.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
            }
            masterOligosListFileRef.browse([CSV_FILE_TYPES, ALL_FILE_TYPES]);
        }
        
        private function onUploadMasterDirectSynthesesListButtonClick(event:MouseEvent):void
        {
            if (masterDirectSynthesesListFileRef == null) {
                masterDirectSynthesesListFileRef = new FileReference();
                masterDirectSynthesesListFileRef.addEventListener(Event.SELECT, onMasterDirectSynthesesFileSelected);
                masterDirectSynthesesListFileRef.addEventListener(Event.COMPLETE, onMasterDirectSynthesesListLoaded);
                masterDirectSynthesesListFileRef.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
            }
            masterDirectSynthesesListFileRef.browse([CSV_FILE_TYPES, ALL_FILE_TYPES]);
        }
        
        private function onMasterPlasmidsListFileSelected(event:Event):void
        {
            masterPlasmidsListFileRef.load();
        }
        
        private function onMasterOligosListFileSelected(event:Event):void
        {
            masterOligosListFileRef.load();
        }
        
        private function onMasterDirectSynthesesFileSelected(event:Event):void
        {
            masterDirectSynthesesListFileRef.load();
        }
        
        private function onMasterPlamsidsListLoaded(event:Event):void
        {
            //check for valid master plasmids list first
            var linesArray:Array = masterPlasmidsListFileRef.data.toString().split(/\R/);
            var headerFields:Array = linesArray[0].split(/,\s*/);
            if (headerFields.length != 5 || headerFields[0] != "Plasmid Name" ||
                headerFields[1] != "Alias" || headerFields[2] != "Contents" ||
                headerFields[3] != "Length" || headerFields[4] != "Sequence") {

                Alert.show("Invalid master plasmids list file\nPlease check the formatting of the file", "Error Message");
                
                //reset
                masterPlasmidsListFileRef = null;
                _j5Controls.uploadMasterPlasmidsListTextInput.text = "";
                if (_j5Controls.useServerPlasmidsListRadioButton.enabled) {
                    _j5Controls.useServerPlasmidsListRadioButton.selected = true;
                } else {
                    _j5Controls.generatePlasmidsListRadioButton.selected = true;
                }
                
                return;
            }
            
            _j5Controls.plasmidsListFileOptions.selection = null;
            _j5Controls.uploadMasterPlasmidsListTextInput.text = masterPlasmidsListFileRef.name;
        }
        
        private function onMasterOligosListLoaded(event:Event):void
        {
            //check for valid master oligos list first
            var linesArray:Array = masterOligosListFileRef.data.toString().split(/\R/);
            var headerFields:Array = linesArray[0].split(/,\s*/);
            if (headerFields.length != 5 || (headerFields[0] != "Oligo Name" && headerFields[0] != "Oigo Name") || //accounting for typo in example file
                headerFields[1] != "Length" || headerFields[2] != "Tm" ||
                headerFields[3] != "Tm (3' only)" || headerFields[4] != "Sequence") {
                
                Alert.show("Invalid master oligos list file\nPlease check the formatting of the file", "Error Message");
                
                //reset
                masterOligosListFileRef = null;
                _j5Controls.uploadMasterOligosListTextInput.text = "";
                if (_j5Controls.useServerOligosListRadioButton.enabled) {
                    _j5Controls.useServerOligosListRadioButton.selected = true;
                } else {
                    _j5Controls.generateOligosListRadioButton.selected = true;
                }
                
                return;
            }
            
            _j5Controls.oligosListFileOptions.selection = null;
            _j5Controls.uploadMasterOligosListTextInput.text = masterOligosListFileRef.name;
        }
        
        private function onMasterDirectSynthesesListLoaded(event:Event):void
        {
            //check for valid master directy syntheses list first
            var linesArray:Array = masterDirectSynthesesListFileRef.data.toString().split(/\R/);
            var headerFields:Array = linesArray[0].split(/,\s*/);
            if (headerFields.length != 5 || headerFields[0] != "Direct Synthesis Name" ||
                headerFields[1] != "Alias" || headerFields[2] != "Contents" ||
                headerFields[3] != "Length" || headerFields[4] != "Sequence") {
                
                Alert.show("Invalid master direct syntheses list file\nPlease check the formatting of the file", "Error Message");
                
                //reset
                masterDirectSynthesesListFileRef = null;
                _j5Controls.uploadMasterDirectSynthesesListTextInput.text = "";
                if (_j5Controls.useServerDirectSynthesesListRadioButton.enabled) {
                    _j5Controls.useServerDirectSynthesesListRadioButton.selected = true;
                } else {
                    _j5Controls.generateDirectSynthesesListRadioButton.selected = true;
                }
                
                return;
            }
            
            _j5Controls.directSynthesesListFileOptions.selection = null;
            _j5Controls.uploadMasterDirectSynthesesListTextInput.text = masterDirectSynthesesListFileRef.name;
        }
        
        private function onRunJ5ButtonClick(event:Event):void
        {
            //TODO: consider adding some sort of check to make sure all necessary selections have been made before running
            
            showRunJ5StopWaitingButton();
            
            _j5Controls.downloadRunJ5ResultsButton.visible = false;
            _j5Controls.plasmidsDataGrid.dataProvider = new ArrayCollection();
            
            var base64Encoder:Base64Encoder = new Base64Encoder();
            
            base64Encoder.encodeUTFBytes(j5ParametersProxy.createJ5ParametersString());
            var parameterStringEncoded:String = base64Encoder.toString();
            
            base64Encoder.encodeUTFBytes(J5ControlsUtils.createJ5SeqList());
            var seqListEncoded:String = base64Encoder.toString();
            
            var sequenceFileInfos:ArrayCollection = J5ControlsUtils.createCollectionFileData();
            base64Encoder.encodeBytes(ZipMaker.archiveSequencesFiles(sequenceFileInfos));
            var sequencesZipEncoded:String = base64Encoder.toString();
            
            base64Encoder.encodeUTFBytes(J5ControlsUtils.createJ5PartList());
            var partListEncoded:String = base64Encoder.toString();
            
            base64Encoder.encodeUTFBytes(J5ControlsUtils.createJ5TargetList());
            var targetListEncoded:String = base64Encoder.toString();
            
            base64Encoder.encodeUTFBytes(J5ControlsUtils.createJ5EugeneRulesList());
            var eugeneRulesListEncoded:String = base64Encoder.toString();
            
            var masterPlasmidsListEncoded:String;
            var masterPlasmidsListFileName:String;
            if (_j5Controls.useServerPlasmidsListRadioButton.selected) {
                masterPlasmidsListEncoded = "";
                masterPlasmidsListFileName = "";
            } else if (_j5Controls.generatePlasmidsListRadioButton.selected) {
                base64Encoder.encodeUTFBytes(J5ControlsUtils.generateEmptyPlasmidsList());
                masterPlasmidsListEncoded = base64Encoder.toString();
                masterPlasmidsListFileName = "j5_plasmids.csv";
            } else {
                base64Encoder.encodeBytes(masterPlasmidsListFileRef.data);
                masterPlasmidsListEncoded = base64Encoder.toString();
                masterPlasmidsListFileName = masterPlasmidsListFileRef.name;
            }
            
            var masterOligosListEncoded:String;
            var masterOligosListFileName:String;
            if (_j5Controls.useServerOligosListRadioButton.selected) {
                masterOligosListEncoded = "";
                masterOligosListFileName = "";
            } else if (_j5Controls.generateOligosListRadioButton.selected) {
                base64Encoder.encodeUTFBytes(J5ControlsUtils.generateEmptyOligosList());
                masterOligosListEncoded = base64Encoder.toString();
                masterOligosListFileName = "j5_oligos.csv";
            } else {
                base64Encoder.encodeBytes(masterOligosListFileRef.data);
                masterOligosListEncoded = base64Encoder.toString();
                masterOligosListFileName = masterOligosListFileRef.name;
            }
            
            var masterDirectSynthesesListEncoded:String;
            var masterDirectSynthesesListFileName:String;
            if (_j5Controls.useServerDirectSynthesesListRadioButton.selected) {
                masterDirectSynthesesListEncoded = "";
                masterDirectSynthesesListFileName = "";
            } else if (_j5Controls.generateDirectSynthesesListRadioButton.selected) {
                base64Encoder.encodeUTFBytes(J5ControlsUtils.generateEmptyDirectSynthesesList());
                masterDirectSynthesesListEncoded = base64Encoder.toString();
                masterDirectSynthesesListFileName = "j5_directsyntheses.csv";
            } else {
                base64Encoder.encodeBytes(masterDirectSynthesesListFileRef.data);
                masterDirectSynthesesListEncoded = base64Encoder.toString();
                masterDirectSynthesesListFileName = masterDirectSynthesesListFileRef.name;
            }
            
            var paramObj:Object = new Object();
            paramObj.j5_session_id = ApplicationFacade.getInstance().sessionId;
            paramObj.reuse_j5_parameters_file = "FALSE";
            paramObj.encoded_j5_parameters_file = parameterStringEncoded;
            paramObj.reuse_sequences_list_file = "FALSE";
            paramObj.encoded_sequences_list_file = seqListEncoded;
            paramObj.reuse_zipped_sequences_file = "FALSE";
            paramObj.encoded_zipped_sequences_file = sequencesZipEncoded;
            paramObj.reuse_parts_list_file = "FALSE";
            paramObj.encoded_parts_list_file = partListEncoded;
            paramObj.reuse_target_part_order_list_file = "FALSE";
            paramObj.encoded_target_part_order_list_file = targetListEncoded;
            paramObj.reuse_eugene_rules_list_file = "FALSE";
            paramObj.encoded_eugene_rules_list_file = eugeneRulesListEncoded;
            paramObj.reuse_master_plasmids_file = _j5Controls.useServerPlasmidsListRadioButton.selected.toString();
            paramObj.encoded_master_plasmids_file = masterPlasmidsListEncoded;
            paramObj.master_plasmids_list_filename = masterPlasmidsListFileName;
            paramObj.reuse_master_oligos_file = _j5Controls.useServerOligosListRadioButton.selected.toString();
            paramObj.encoded_master_oligos_file = masterOligosListEncoded;
            paramObj.master_oligos_list_filename = masterOligosListFileName;
            paramObj.reuse_master_direct_syntheses_file = _j5Controls.useServerDirectSynthesesListRadioButton.selected.toString();
            paramObj.encoded_master_direct_syntheses_file = masterDirectSynthesesListEncoded;
            paramObj.master_direct_syntheses_list_filename = masterDirectSynthesesListFileName;
            paramObj.assembly_method = _j5Controls.assemblyMethodComboBox.selectedItem.data;
            
            var myToken:AsyncToken = xmlrpcObject.DesignAssembly(paramObj);
//            var myToken:AsyncToken = xmlrpcObject.ReturnErrorMessage();  // for testing
            myToken.methodName = DESIGN_ASSEMBLY;
            myToken.id = (new Date).time.toString();
            currentRunID = myToken.id;
            
            var updateProgressLabelTimer:Timer = new Timer(10000, 1);
            updateProgressLabelTimer.addEventListener(TimerEvent.TIMER, updateRunJ5ProgressLabel);
            updateProgressLabelTimer.start();
            
            _j5Controls.runJ5ProgressBar.label = "Your request has been sent to the server.  Waiting for response...";
            _j5Controls.runJ5ProgressBar.visible = true;
            _j5Controls.runJ5ProgressHBox.width = NaN;
            _j5Controls.runJ5ErrorText.visible = false;
        }
        
        private function updateRunJ5ProgressLabel(event:TimerEvent):void
        {
            if (currentRunID != null) {
                _j5Controls.runJ5ProgressBar.label = "Still waiting...  This may be normal, especially for larger designs.";
            }
        }
        
        private function onRunJ5StopWaitingButtonClick(event:MouseEvent):void
        {
            currentRunID = null;
            _j5Controls.runJ5ProgressBar.visible = false;
            showRunJ5Button();
        }
        
        private function onDownloadRunJ5ResultsButtonClick(event:MouseEvent):void
        {
            var fileRef:FileReference = new FileReference();
            fileRef.addEventListener(IOErrorEvent.IO_ERROR, onSaveError);
            fileRef.save(runJ5OutputFile, runJ5OutputFileName);
            _j5Controls.exit();
        }
        
        private function onLoadUserAssemblyFileButtonClick(event:MouseEvent):void
        {
            if (userAssemblyFileFileRef == null) {
                userAssemblyFileFileRef = new FileReference();
                userAssemblyFileFileRef.addEventListener(Event.SELECT, onUserAssemblyFileSelected);
                userAssemblyFileFileRef.addEventListener(Event.COMPLETE, onUserAssemblyFileLoaded);
                userAssemblyFileFileRef.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
            }
            userAssemblyFileFileRef.browse([ZIP_FILE_TYPES, ALL_FILE_TYPES]);
        }
        
        private function onUserAssemblyFileSelected(event:Event):void
        {
            userAssemblyFileFileRef.load();
        }
        
        private function onUserAssemblyFileLoaded(event:Event):void
        {
            if (!functionMediator.isValidZipFile(userAssemblyFileFileRef.data)) {
                Alert.show("Invalid zip file\nPlease ensure you have selected a zip file", "Error Message");
                return;
            }
            
            j5ResultsZipFile = new ZipFile(userAssemblyFileFileRef.data);
            populateJ5ResultsDisplay();
        }
        
        private function onPlasmidLinkButtonClick(event:PlasmidLinkButtonEvent):void
        {
            var zipEntry:ZipEntry = j5ResultsZipFile.getEntry(event.plasmidFileName);
            var genbankByteArray:ByteArray = j5ResultsZipFile.getInput(zipEntry);
            var genbank:String = genbankByteArray.toString();
            var fileLength:int = genbank.length;
            var encodedGenbank:String = encodeURIComponent(genbank);
            
            //var request:URLRequest = new URLRequest("http://localhost/vectoreditor_sequence.pl"); // for local testing
            var request:URLRequest = new URLRequest(Constants.SERVER_PATH + ApplicationFacade.getInstance().rootDir + "/bin/vectoreditor_sequence.pl");
            request.method = URLRequestMethod.POST;
            request.contentType = "text/plain";
            
            request.data = "fileLength=" + fileLength + "&fileData=" + encodedGenbank;
            
            navigateToURL(request, '_blank');
        }
        
        // event handlers for Condense Assembly Files
        private function onUploadAssemblyFilesListButtonClick(event:MouseEvent):void
        {
            if (assemblyFilesListFileRef == null) {
                assemblyFilesListFileRef = new FileReference();
                assemblyFilesListFileRef.addEventListener(Event.SELECT, onAssemblyFilesListFileSelected);
                assemblyFilesListFileRef.addEventListener(Event.COMPLETE, onAssemblyFilesListLoaded);
                assemblyFilesListFileRef.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
            }
            assemblyFilesListFileRef.browse([CSV_FILE_TYPES, ALL_FILE_TYPES]);
        }
        
        private function onUploadZippedAssemblyFilesButtonClick(event:MouseEvent):void
        {
            if (zippedAssemblyFilesFileRef == null) {
                zippedAssemblyFilesFileRef = new FileReference();
                zippedAssemblyFilesFileRef.addEventListener(Event.SELECT, onZippedAssemblyFilesFileSelected);
                zippedAssemblyFilesFileRef.addEventListener(Event.COMPLETE, onZippedAssemblyFilesLoaded);
                zippedAssemblyFilesFileRef.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
            }
            zippedAssemblyFilesFileRef.browse([ZIP_FILE_TYPES, ALL_FILE_TYPES]);
        }
        
        private function onAssemblyFilesListFileSelected(event:Event):void
        {
            assemblyFilesListFileRef.load();
        }
        
        private function onZippedAssemblyFilesFileSelected(event:Event):void
        {
            zippedAssemblyFilesFileRef.load();
        }
        
        private function onAssemblyFilesListLoaded(event:Event):void
        {
            //check for valid assembly files list first
            var linesArray:Array = assemblyFilesListFileRef.data.toString().split(/\R/);
            var headerFields:Array = linesArray[0].split(/,\s*/);
            if (headerFields.length != 1 || headerFields[0] != "Assembly File Name") {
                Alert.show("Invalid assembly files list file\nPlease check the formatting of the file", "Error Message");
                assemblyFilesListFileRef = null;
                _j5Controls.uploadAssemblyFilesListTextInput.text = "";
            } else { //check passed
                _j5Controls.uploadAssemblyFilesListTextInput.text = assemblyFilesListFileRef.name;
            }
            
            checkReadyToRunCondenseAssemblies()
        }
        
        private function onZippedAssemblyFilesLoaded(event:Event):void
        {
            if (!functionMediator.isValidZipFile(zippedAssemblyFilesFileRef.data)) {
                Alert.show("Invalid zip file\nPlease ensure you have selected a zip file", "Error Message");
                zippedAssemblyFilesFileRef = null;
                _j5Controls.uploadZippedAssemblyFilesTextInput.text = "";
            } else {
                _j5Controls.uploadZippedAssemblyFilesTextInput.text = zippedAssemblyFilesFileRef.name;
            }
            
            checkReadyToRunCondenseAssemblies()
        }
        
        private function onCondenseAssembliesButtonClick(event:MouseEvent):void
        {
            showCondenseAssembliesStopWaitingButton();
            
            _j5Controls.downloadCondenseAssembliesResultsButton.visible = false;
            
            var base64Encoder:Base64Encoder = new Base64Encoder();
            
            base64Encoder.encodeBytes(assemblyFilesListFileRef.data);
            var assemblyFilesListEncoded:String = base64Encoder.toString();
            
            base64Encoder.encodeBytes(zippedAssemblyFilesFileRef.data);
            var zippedAssemblyFilesEncoded:String = base64Encoder.toString();
            
            var paramObj:Object = new Object();
            paramObj.j5_session_id = ApplicationFacade.getInstance().sessionId;
            paramObj.encoded_assembly_files_to_condense_file = assemblyFilesListEncoded;
            paramObj.encoded_zipped_assembly_files_file = zippedAssemblyFilesEncoded;
            
            var myToken:AsyncToken = xmlrpcObject.CondenseMultipleAssemblyFiles(paramObj);
//            var myToken:AsyncToken = xmlrpcObject.ReturnErrorMessage();  //for testing
            myToken.methodName = CONDENSE_MULTIPLE_ASSEMBLY_FILES;
            
            //FIXME: how should timeout be done properly?
            var updateProgressLabelTimer:Timer = new Timer(6000, 1);
            updateProgressLabelTimer.addEventListener(TimerEvent.TIMER, updateCondenseAssembliesProgressLabel);
            updateProgressLabelTimer.start();
            
            _j5Controls.condenseAssembliesProgressBar.label = "Your request has been sent to the server.  Waiting for response...";
            _j5Controls.condenseAssembliesProgressBar.visible = true;
            _j5Controls.condenseAssembliesProgressHBox.width = NaN;
            _j5Controls.condenseAssembliesErrorText.visible = false;
        }
        
        private function updateCondenseAssembliesProgressLabel(event:TimerEvent):void
        {
            _j5Controls.condenseAssembliesProgressBar.label = "Still waiting...  This may be normal, especially for larger designs.";
        }
        
        private function onCondenseAssembliesStopWaitingButtonClick(event:MouseEvent):void
        {
            _j5Controls.condenseAssembliesProgressBar.visible = false;
            showCondenseAssembliesButton();
        }
        
        private function onDownloadCondenseAssembliesResultsButtonClick(event:MouseEvent):void
        {
            var fileRef:FileReference = new FileReference();
            fileRef.addEventListener(IOErrorEvent.IO_ERROR, onSaveError);
            
            var base64Decoder:Base64Decoder = new Base64Decoder();
            base64Decoder.decode(encodedCondenseAssembliesOutputFile);
            var outputFile:ByteArray = base64Decoder.toByteArray();
            
            fileRef.save(outputFile, condenseAssembliesOutputFileName);
            _j5Controls.exit();
        }
        
        // event handlers for Downstream Automation tab
        private function onUploadSourcePlateListButtonClick(event:MouseEvent):void
        {
            if (sourcePlateListFileRef == null) {
                sourcePlateListFileRef = new FileReference();
                sourcePlateListFileRef.addEventListener(Event.SELECT, onSourcePlateListFileSelected);
                sourcePlateListFileRef.addEventListener(Event.COMPLETE, onSourcePlateListLoaded);
                sourcePlateListFileRef.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
            }
            sourcePlateListFileRef.browse([CSV_FILE_TYPES, ALL_FILE_TYPES]);
        }
        
        private function onUploadZippedPlateFilesButtonClick(event:MouseEvent):void
        {
            if (zippedPlateFilesFileRef == null) {
                zippedPlateFilesFileRef = new FileReference();
                zippedPlateFilesFileRef.addEventListener(Event.SELECT, onZippedPlateFilesFileSelected);
                zippedPlateFilesFileRef.addEventListener(Event.COMPLETE, onZippedPlateFilesLoaded);
                zippedPlateFilesFileRef.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
            }
            zippedPlateFilesFileRef.browse([ZIP_FILE_TYPES, ALL_FILE_TYPES]);
        }
        
        private function onUploadCondensedJ5AssemblyFileButtonClick(event:MouseEvent):void
        {
            if (condensedJ5AssemblyFileFileRef == null) {
                condensedJ5AssemblyFileFileRef = new FileReference();
                condensedJ5AssemblyFileFileRef.addEventListener(Event.SELECT, onCondensedJ5AssemblyFileSelected);
                condensedJ5AssemblyFileFileRef.addEventListener(Event.COMPLETE, onCondensedJ5AssemblyFileLoaded);
                condensedJ5AssemblyFileFileRef.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
            }
            condensedJ5AssemblyFileFileRef.browse([CSV_FILE_TYPES, ALL_FILE_TYPES]);
        }
        
        private function onSourcePlateListFileSelected(event:Event):void
        {
            sourcePlateListFileRef.load();
        }
        
        private function onZippedPlateFilesFileSelected(event:Event):void
        {
            zippedPlateFilesFileRef.load();
        }
        
        private function onCondensedJ5AssemblyFileSelected(event:Event):void
        {
            condensedJ5AssemblyFileFileRef.load();
        }
        
        private function onSourcePlateListLoaded(event:Event):void
        {
            //check for valid source plate list first
            var linesArray:Array = sourcePlateListFileRef.data.toString().split(/\R/);
            var headerFields:Array = linesArray[0].split(/,\s*/);
            if (headerFields.length != 1 || headerFields[0].toUpperCase() != "PLATE FILE NAME") {
                Alert.show("Invalid source plate list file\nPlease check the formatting of the file", "Error Message");
                sourcePlateListFileRef = null;
                _j5Controls.uploadSourcePlateListTextInput.text = "";
            } else { //check passed
                _j5Controls.uploadSourcePlateListTextInput.text = sourcePlateListFileRef.name;
            }
            
            checkReadyToRunDistributePcrReactions();
        }
        
        private function onZippedPlateFilesLoaded(event:Event):void
        {
            if (!functionMediator.isValidZipFile(zippedPlateFilesFileRef.data)) {
                Alert.show("Invalid zip file\nPlease ensure you have selected a zip file", "Error Message");
                zippedPlateFilesFileRef = null;
                _j5Controls.uploadZippedPlateFilesTextInput.text = "";
            } else {
                _j5Controls.uploadZippedPlateFilesTextInput.text = zippedPlateFilesFileRef.name;
            }
            
            checkReadyToRunDistributePcrReactions();
        }
        
        private function onCondensedJ5AssemblyFileLoaded(event:Event):void
        {
            //check for valid condensed assembly file first
            var linesArray:Array = condensedJ5AssemblyFileFileRef.data.toString().split(/\R/);
            if (!(linesArray[0] as String).match(/^\"?((Golden-gate)|(SLIC\/Gibson\/CPEC)|(Combinatorial Golden-gate)|(Combinatorial SLIC\/Gibson\/CPEC)|(Condensed))/)) {
                Alert.show("Invalid condensed assembly file\nPlease check the formatting of the file", "Error Message");
                condensedJ5AssemblyFileFileRef = null;
                _j5Controls.uploadCondensedJ5AssemblyFileTextInput.text = "";
            } else {
                _j5Controls.uploadCondensedJ5AssemblyFileTextInput.text = condensedJ5AssemblyFileFileRef.name;
            }
            
            checkReadyToRunDistributePcrReactions();
        }
        
        private function onDistributePcrReactionsButtonClick(event:MouseEvent):void
        {
            showDistributePcrStopWaitingButton();
            
            _j5Controls.downloadDistributePcrReactionsResultsButton.visible = false;
            
            var base64Encoder:Base64Encoder = new Base64Encoder();
            
            var parameterStringEncoded:String
            if (_j5Controls.useServerDownstreamAutomationParametersFileRadioButton.selected) {
                parameterStringEncoded = "";
            } else {
                base64Encoder.encodeUTFBytes(downstreamAutomationParametersProxy.getDownstreamAutomationParametersString());
                parameterStringEncoded = base64Encoder.toString();
            }
            
            base64Encoder.encodeBytes(sourcePlateListFileRef.data);
            var sourcePlateListEncoded:String = base64Encoder.toString();
            
            base64Encoder.encodeBytes(zippedPlateFilesFileRef.data);
            var zippedPlateFilesEncoded:String = base64Encoder.toString();
            
            base64Encoder.encodeBytes(condensedJ5AssemblyFileFileRef.data);
            var condensedJ5AssemblyFileEncoded:String = base64Encoder.toString();
            
            var paramObj:Object = new Object();
            paramObj.j5_session_id = ApplicationFacade.getInstance().sessionId;
            paramObj.reuse_downstream_automation_parameters_file = _j5Controls.useServerDownstreamAutomationParametersFileRadioButton;
            paramObj.encoded_downstream_automation_parameters_file = parameterStringEncoded;
            paramObj.encoded_plate_list_file = sourcePlateListEncoded;
            paramObj.encoded_zipped_plate_files_file = zippedPlateFilesEncoded;
            paramObj.encoded_assembly_to_automate_file = condensedJ5AssemblyFileEncoded;
            paramObj.automation_task = "DistributePcrReactions";
            
            var myToken:AsyncToken = xmlrpcObject.DesignDownstreamAutomation(paramObj);
//            var myToken:AsyncToken = xmlrpcObject.ReturnErrorMessage();  // for testing
            myToken.methodName = DESIGN_DOWNSTREAM_AUTOMATION;
            
            //FIXME: how should timeout be done properly?
            var updateProgressLabelTimer:Timer = new Timer(6000, 1);
            updateProgressLabelTimer.addEventListener(TimerEvent.TIMER, updateDistributePcrProgressLabel);
            updateProgressLabelTimer.start();
            
            _j5Controls.distributePcrProgressBar.label = "Your request has been sent to the server.  Waiting for response...";
            _j5Controls.distributePcrProgressBar.visible = true;
            _j5Controls.distributePcrProgressHBox.width = NaN;
            _j5Controls.distributePcrErrorText.visible = false;
        }
        
        private function updateDistributePcrProgressLabel(event:TimerEvent):void
        {
            _j5Controls.distributePcrProgressBar.label = "Still waiting...  This may be normal, especially for larger designs.";
        }
        
        private function onDistributePcrStopWaitingButtonClick(event:MouseEvent):void
        {
            _j5Controls.distributePcrProgressBar.visible = false;
            showDistributePcrButton();
        }
        
        private function onDownloadDistributePcrReactionsResultsButtonClick(event:MouseEvent):void
        {
            var fileRef:FileReference = new FileReference();
            fileRef.addEventListener(IOErrorEvent.IO_ERROR, onSaveError);
            
            var base64Decoder:Base64Decoder = new Base64Decoder();
            base64Decoder.decode(encodedDistributePcrReactionsOutputFile);
            var outputFile:ByteArray = base64Decoder.toByteArray();
            
            fileRef.save(outputFile, distributePcrReactionsOutputFileName);
            _j5Controls.exit();
        }
        
        // event handlers for j5 Files tab
        private function onJ5SeqFileGenerateButtonClick(event:MouseEvent):void
        {
            var seqList:String = J5ControlsUtils.createJ5SeqList();
            if(seqList != null)
            {
                var fileRef:FileReference = new FileReference();
                fileRef.addEventListener(IOErrorEvent.IO_ERROR, onSaveError);
                fileRef.save(seqList, "SeqList.csv");
            }
        }
        
        private function onJ5PartsFileGenerateButtonClick(event:MouseEvent):void
        {
            var partList:String = J5ControlsUtils.createJ5PartList();
            if(partList != null)
            {
                var fileRef2:FileReference = new FileReference();
                fileRef2.addEventListener(IOErrorEvent.IO_ERROR, onSaveError);
                fileRef2.save(partList, "PartList.csv");	
            }		
        }
        
        private function onJ5TargetFileGenerateButtonClick(event:MouseEvent):void
        {
            
            var targetList:String = J5ControlsUtils.createJ5TargetList();
            if(targetList != null)
            {
                var fileRef3:FileReference = new FileReference();
                fileRef3.addEventListener(IOErrorEvent.IO_ERROR, onSaveError);
                fileRef3.save(targetList, "TargetList.csv");
            }
        }
        
        private function onJ5EugeneFileGenerateButtonClick(event:MouseEvent):void
        {
            var eugeneList:String = J5ControlsUtils.createJ5EugeneRulesList();
            if(eugeneList != null)
            {
                var fileRef4:FileReference = new FileReference();
                fileRef4.addEventListener(IOErrorEvent.IO_ERROR, onSaveError);
                fileRef4.save(eugeneList, "EugeneList.eug");
            }
        }
        
        private function onJ5GenbankFileGenerateButtonClick(event:MouseEvent):void
        {
            var genbankFile:String = J5ControlsUtils.createGenbank();
            if(genbankFile != null)
            {
                var fileRef4:FileReference = new FileReference();
                fileRef4.addEventListener(IOErrorEvent.IO_ERROR, onSaveError);
                var part:Part = (facade as ApplicationFacade).selectedPartRenderer.part;
                fileRef4.save(genbankFile, part.sequenceFile.sequenceFileName);
            }
        }
        
        private function onJ5FastaFileGenerateButtonClick(event:MouseEvent):void
        {			
            var fastaFile:String = J5ControlsUtils.createFasta();
            if(fastaFile != null)
            {
                var fileRef4:FileReference = new FileReference();
                fileRef4.addEventListener(IOErrorEvent.IO_ERROR, onSaveError);
                var part:Part = (facade as ApplicationFacade).selectedPartRenderer.part;
                fileRef4.save(fastaFile, part.sequenceFile.sequenceFileName);
            }
        }
        
        private function onJ5JbeiSeqFileGenerateButtonClick(event:MouseEvent):void
        {			
            var jbeiSeqFile:String = J5ControlsUtils.createJbeiSequenceXml();
            if(jbeiSeqFile != null)
            {
                var fileRef4:FileReference = new FileReference();
                fileRef4.addEventListener(IOErrorEvent.IO_ERROR, onSaveError);
                var part:Part = (facade as ApplicationFacade).selectedPartRenderer.part;
                fileRef4.save(jbeiSeqFile, part.sequenceFile.sequenceFileName);
            }
        }
        
        private function onCompleteFileGenerateButtonClick(event:MouseEvent):void
        {
            var partList:String = J5ControlsUtils.createJ5PartList();
            var targetList:String = J5ControlsUtils.createJ5TargetList();
            var seqList:String = J5ControlsUtils.createJ5SeqList();
            var eugeneList:String = J5ControlsUtils.createJ5EugeneRulesList();
            var fileInfoArray:ArrayCollection = J5ControlsUtils.createCollectionFileData();
            
            var designName:String = mainCanvasMediator.lastLoadString.replace(/\.xml$/,"");
            
            var date:Date = new Date();
            var uniqueString:String = String(date.getFullYear()).substr(2, 2) + "." + String(date.getMonth() + 1) + "." + String(date.getDate()) + 
                "." + String(date.getHours()) + "." + String(date.getMinutes()) + "." + String(date.getSeconds());
            
            var prefix:String = designName + "_" + uniqueString;
            
            var disallowedCharsPattern:RegExp = /\s/g;
            prefix = prefix.replace(disallowedCharsPattern, "_");
            
            var archiveJ5ArchiveByteArray:ByteArray = ZipMaker.archiveJ5Files(partList, targetList, seqList, eugeneList, fileInfoArray);
            var archiveName:String = prefix + "_completeOutput.zip";
            
            var fileReference:FileReference = new FileReference();
            fileReference.addEventListener(IOErrorEvent.IO_ERROR, onExportIOSequenceError);
            fileReference.save(archiveJ5ArchiveByteArray, archiveName);
        }
        
        private function onJ5ParametersGenerateButtonClick(event:MouseEvent):void
        {
            var fileRef:FileReference = new FileReference();
            fileRef.addEventListener(IOErrorEvent.IO_ERROR, onSaveError);
            var parameterList:String = j5ParametersProxy.createJ5ParametersString();
            fileRef.save(parameterList, "j5_parameters.csv");
        }
        
        private function onDownstreamAutomationParametersGenerateButtonClick(event:MouseEvent):void
        {
            var fileRef:FileReference = new FileReference();
            fileRef.addEventListener(IOErrorEvent.IO_ERROR, onSaveError);
            var parameterList:String = downstreamAutomationParametersProxy.getDownstreamAutomationParametersString();
            fileRef.save(parameterList, "downstream_automation_parameters.csv");
        }
        
        private function onExportIOSequenceError(event:IOErrorEvent):void
        {
            Alert.show("Failed to write file!", "Write file error");
        }
        
        // event handlers for j5 Parameters Dialog
        private function onEditJ5ParametersButtonClick(event:Event):void
        {
            if (_j5ParametersDialog == null) {
                _j5ParametersDialog = new J5ParametersDialog();
                _j5ParametersDialog.addEventListener(FlexEvent.CREATION_COMPLETE, onJ5ParametersDialogCreationComplete);
            }
            
            PopUpManager.addPopUp(_j5ParametersDialog, _j5Controls.parent, true);
            PopUpManager.centerPopUp(_j5ParametersDialog);
            
            populateJ5ParametersDialog();
        }
        
        private function onJ5ParametersDialogCreationComplete(event:FlexEvent):void
        {
            _j5ParametersDialog.PTS_comboBox.dataProvider = J5Parameters.booleanOptions;
            _j5ParametersDialog.PSC_comboBox.dataProvider = J5Parameters.booleanOptions;
            _j5ParametersDialog.OSF_ComboBox.dataProvider = J5Parameters.outputSequenceFormatOptions;
            _j5ParametersDialog.SPP_ComboBox.dataProvider = J5Parameters.booleanOptions;
            
            // add event listeners for buttons (can only be done after creation)
            _j5ParametersDialog.returnToDefaultsButton.addEventListener(MouseEvent.CLICK, onJ5ParametersReturnToDefaultsButtonClick);
            _j5ParametersDialog.returnToServerValuesButton.addEventListener(MouseEvent.CLICK, onJ5ParametersReturnToServerValuesButtonClick);
            _j5ParametersDialog.cancelButton.addEventListener(MouseEvent.CLICK, onJ5ParametersCancelButtonClick);
            _j5ParametersDialog.okButton.addEventListener(MouseEvent.CLICK, onJ5ParametersOkButtonClick);
        }
        
        private function onJ5ParametersReturnToDefaultsButtonClick(event:MouseEvent):void
        {
            resetJ5ParametersDialogToDefaults();
        }
        
        private function onJ5ParametersReturnToServerValuesButtonClick(event:MouseEvent):void
        {
            var paramObj:Object = new Object();
            paramObj.j5_session_id = ApplicationFacade.getInstance().sessionId;
            var myToken:AsyncToken = xmlrpcObject.GetLastUpdatedUserFiles(paramObj);
            myToken.methodName = GET_SERVER_J5_PARAMETERS;
        }
        
        private function onJ5ParametersCancelButtonClick(event:MouseEvent):void
        {
            // close without saving
            _j5ParametersDialog.exit();
        }
        
        private function onJ5ParametersOkButtonClick(event:MouseEvent):void
        {
            // save changes to model, then close dialog
            var j5Parameters:J5Parameters = j5ParametersProxy.j5Parameters;
            j5Parameters.masterOligoNumberOfDigitsValue = _j5ParametersDialog.MONOD_stepper.value;
            j5Parameters.masterPlasmidNumberOfDigitsValue = _j5ParametersDialog.MPNOD_stepper.value;
            j5Parameters.gibsonOverlapBPsValue = _j5ParametersDialog.GOB_stepper.value;
            j5Parameters.gibsonOverlapMinTmValue = _j5ParametersDialog.GOMT_stepper.value;
            j5Parameters.gibsonOverlapMaxTmValue = _j5ParametersDialog.GOMAXT_stepper.value;
            j5Parameters.maxOligoLengthBPsValue = _j5ParametersDialog.MOLB_stepper.value;
            j5Parameters.minFragmentSizeGibsonBPsValue = _j5ParametersDialog.MFSGB_stepper.value;
            j5Parameters.goldenGateOverhangBPsValue = _j5ParametersDialog.GGOHB_stepper.value;
            j5Parameters.goldenGateRecognitionSeqValue = _j5ParametersDialog.GGRS_Text.text;
            j5Parameters.goldenGateTerminiExtraSeqValue = _j5ParametersDialog.GGTES_Text.text;
            j5Parameters.maxIdentitiesGoldenGateOverhangsCompatibleValue = _j5ParametersDialog.MIGGOC_stepper.value;
            j5Parameters.oligoSynthesisCostPerBPUSDValue = _j5ParametersDialog.OSCPB_stepper.value;
            j5Parameters.oligoPagePurificationCostPerPieceUSDValue = _j5ParametersDialog.OPPCPP_stepper.value;
            j5Parameters.oligoMaxLengthNoPagePurificationRequiredBPsValue = _j5ParametersDialog.OMLPPRB_stepper.value;
            j5Parameters.minPCRProductBPsValue = _j5ParametersDialog.MPPB_stepper.value;
            j5Parameters.directSynthesisCostPerBPUSDValue = _j5ParametersDialog.DSCPB_stepper.value;
            j5Parameters.directSynthesisMinCostPerPieceUSDValue = _j5ParametersDialog.DSMCPP_stepper.value;
            j5Parameters.primerGCClampValue = _j5ParametersDialog.PGC_stepper.value;
            j5Parameters.primerMinSizeValue = _j5ParametersDialog.PMS_stepper.value;
            j5Parameters.primerMaxSizeValue = _j5ParametersDialog.PMAXS_stepper.value;
            j5Parameters.primerMinTmValue = _j5ParametersDialog.PMT_stepper.value;
            j5Parameters.primerMaxTmValue = _j5ParametersDialog.PMAXT_stepper.value;
            j5Parameters.primerMaxDiffTmValue = _j5ParametersDialog.PMDT_stepper.value;
            j5Parameters.primerMaxSelfAnyThValue = _j5ParametersDialog.PMSAT_stepper.value;
            j5Parameters.primerMaxSelfEndThValue = _j5ParametersDialog.PMSET_stepper.value;
            j5Parameters.primerPairMaxComplAnyThValue = _j5ParametersDialog.PPMCAT_stepper.value;
            j5Parameters.primerPairMaxComplEndThValue = _j5ParametersDialog.PPMCET_stepper.value;
            j5Parameters.primerTmSantaluciaValue = _j5ParametersDialog.PTS_comboBox.selectedItem;
            j5Parameters.primerSaltCorrectionsValue = _j5ParametersDialog.PSC_comboBox.selectedItem;
            j5Parameters.primerDnaConcValue = _j5ParametersDialog.PDC_stepper.value;
            j5Parameters.mispriming3PrimeBoundaryBPToWarnIfHitValue = _j5ParametersDialog.M3BBTWIH_stepper.value;
            j5Parameters.misprimingMinTmValue = _j5ParametersDialog.MMT_stepper.value;
            j5Parameters.misprimingSaltConcValue = _j5ParametersDialog.MSC_stepper.value;
            j5Parameters.misprimingOligoConcValue = _j5ParametersDialog.MOC_stepper.value;
            j5Parameters.outputSequenceFormatValue = _j5ParametersDialog.OSF_ComboBox.selectedItem as String;
            j5Parameters.suppressPurePrimersValue = _j5ParametersDialog.SPP_ComboBox.selectedItem;

            _j5ParametersDialog.exit();
        }
        
        // event handlers for Downstream Automation Parameters Dialog
        private function onEditDownstreamAutomationParametersButtonClick(event:MouseEvent):void
        {
            if (_downstreamAutomationParametersDialog == null) {
                _downstreamAutomationParametersDialog = new DownstreamAutomationParametersDialog();
                _downstreamAutomationParametersDialog.addEventListener(FlexEvent.CREATION_COMPLETE, onDownstreamAutomationParametersDialogCreationComplete);
            }
            
            PopUpManager.addPopUp(_downstreamAutomationParametersDialog, _j5Controls, true);
            PopUpManager.centerPopUp(_downstreamAutomationParametersDialog);
            
            populateDownstreamAutomationParametersDialog();
        }
        
        private function onDownstreamAutomationParametersDialogCreationComplete(event:FlexEvent):void
        {
            _downstreamAutomationParametersDialog.returnToDefaultsButton.addEventListener(MouseEvent.CLICK, onDownstreamAutomationParametersReturnToDefaultsButtonClick);
            _downstreamAutomationParametersDialog.cancelButton.addEventListener(MouseEvent.CLICK, onDownstreamAutomationParametersCancelButtonClick);
            _downstreamAutomationParametersDialog.okButton.addEventListener(MouseEvent.CLICK, onDownstreamAutomationParametersOkButtonClick);
        }
        
        private function onDownstreamAutomationParametersReturnToDefaultsButtonClick(event:MouseEvent):void
        {
            // reset values in dialog, do not reset values in model - user needs to click OK to save
            _downstreamAutomationParametersDialog.mdtazStepper.value = DownstreamAutomationParameters.MDTAZ_DEFAULT;
            _downstreamAutomationParametersDialog.mdtrozaStepper.value = DownstreamAutomationParameters.MDTROZA_DEFAULT;
            _downstreamAutomationParametersDialog.mmcspzStepper.value = DownstreamAutomationParameters.MMCSPZ_DEFAULT;
            _downstreamAutomationParametersDialog.mwvmpStepper.value = DownstreamAutomationParameters.MWVMP_DEFAULT;
            _downstreamAutomationParametersDialog.mctfStepper.value = DownstreamAutomationParameters.MCTF_DEFAULT;
            _downstreamAutomationParametersDialog.mctiStepper.value = DownstreamAutomationParameters.MCTI_DEFAULT;
            _downstreamAutomationParametersDialog.mpvStepper.value = DownstreamAutomationParameters.MPV_DEFAULT;
            _downstreamAutomationParametersDialog.ncmpStepper.value = DownstreamAutomationParameters.NCMP_DEFAULT;
            _downstreamAutomationParametersDialog.nrmpStepper.value = DownstreamAutomationParameters.NRMP_DEFAULT;
            _downstreamAutomationParametersDialog.tdtStepper.value = DownstreamAutomationParameters.TDT_DEFAULT;
            _downstreamAutomationParametersDialog.wptzStepper.value = DownstreamAutomationParameters.WPTZ_DEFAULT;
            _downstreamAutomationParametersDialog.zptbStepper.value = DownstreamAutomationParameters.ZPTB_DEFAULT;
        }
        
        private function onDownstreamAutomationParametersCancelButtonClick(event:MouseEvent):void
        {
            // close without saving
            _downstreamAutomationParametersDialog.exit();
        }
        
        private function onDownstreamAutomationParametersOkButtonClick(event:MouseEvent):void
        {
            // save changes to model, then close dialog
            var downstreamAutomationParameters:DownstreamAutomationParameters = downstreamAutomationParametersProxy.downstreamAutomationParameters;
            downstreamAutomationParameters.maxDeltaTemperatureAdjacentZonesValue = _downstreamAutomationParametersDialog.mdtazStepper.value;
            downstreamAutomationParameters.maxDeltaTemperatureReactionOptimumZoneAcceptableValue = _downstreamAutomationParametersDialog.mdtrozaStepper.value;
            downstreamAutomationParameters.maxMcStepsPerZoneValue = _downstreamAutomationParametersDialog.mmcspzStepper.value;
            downstreamAutomationParameters.maxWellVolumeMultiwellPlateValue = _downstreamAutomationParametersDialog.mwvmpStepper.value;
            downstreamAutomationParameters.mcTemperatureFinalValue = _downstreamAutomationParametersDialog.mctfStepper.value;
            downstreamAutomationParameters.mcTemperatureInitialValue = _downstreamAutomationParametersDialog.mctiStepper.value;
            downstreamAutomationParameters.minPipettingVolumeValue = _downstreamAutomationParametersDialog.mpvStepper.value;
            downstreamAutomationParameters.nColumnsMultiwellPlateValue = _downstreamAutomationParametersDialog.ncmpStepper.value;
            downstreamAutomationParameters.nRowsMultiwellPlateValue = _downstreamAutomationParametersDialog.nrmpStepper.value;
            downstreamAutomationParameters.trialDeltaTemperatureValue = _downstreamAutomationParametersDialog.tdtStepper.value;
            downstreamAutomationParameters.wellsPerThermocyclerZoneValue = _downstreamAutomationParametersDialog.wptzStepper.value;
            downstreamAutomationParameters.zonesPerThermocyclerBlockValue = _downstreamAutomationParametersDialog.zptbStepper.value;
            
            _downstreamAutomationParametersDialog.exit();
        }
        
        // Private Methods
        private function showJ5Controls():void
        {
            PopUpManager.addPopUp(_j5Controls, ApplicationFacade.getInstance().application, true);
            PopUpManager.centerPopUp(_j5Controls);
            setAssemblyMethodOptions();
            checkReadyToRunJ5();
            checkReadyToRunDistributePcrReactions();
            j5FilesButtonsEnable();
        }
        
        private function setAssemblyMethodOptions():void
        {
            assemblyMethodOptions.removeAll();
            
            var collection:J5Collection = j5CollectionProxy.j5Collection;
            if (collection.combinatorial) {
                assemblyMethodOptions.addItem({label:"Combinatorial Mock Assembly", data:"CombinatorialMock"});
                assemblyMethodOptions.addItem({label:"Combinatorial SLIC/Gibson/CPEC", data:"CombinatorialSLICGibsonCPEC"});
                assemblyMethodOptions.addItem({label:"Combinatorial Golden Gate", data:"CombinatorialGoldenGate"});
            } else {
                assemblyMethodOptions.addItem({label:"Mock Assembly", data:"Mock"});
                assemblyMethodOptions.addItem({label:"SLIC/Gibson/CPEC", data:"SLIC/Gibson/CPEC"});
                assemblyMethodOptions.addItem({label:"Golden Gate", data:"GoldenGate"});
            }
            
            _j5Controls.assemblyMethodComboBox.dataProvider = assemblyMethodOptions;
        }
        
        private function checkReadyToRunJ5():void
        {
            if (!j5CollectionProxy.j5Collection.j5Ready) {
                _j5Controls.runJ5Button.enabled = false;
                _j5Controls.cannotRunJ5ReasonLabel.text = "Cannot run j5: Collection is not j5 ready";
                return;
            }
            
            if (currentRunID != null) {
                _j5Controls.runJ5Button.enabled = false;  //something is running
                return;
            }
            
            _j5Controls.runJ5Button.enabled = true;
            _j5Controls.cannotRunJ5ReasonLabel.text = "";
        }
        
        private function showRunJ5Button():void
        {
            _j5Controls.runJ5Button.visible = true;
            _j5Controls.runJ5Button.width = NaN;
            _j5Controls.runJ5StopWaitingButton.visible = false;
            _j5Controls.runJ5StopWaitingButton.width = 0;
        }
        
        private function showRunJ5StopWaitingButton():void
        {
            _j5Controls.runJ5Button.visible = false;
            _j5Controls.runJ5Button.width = 0;
            _j5Controls.runJ5StopWaitingButton.visible = true;
            _j5Controls.runJ5StopWaitingButton.width = NaN;
        }
        
        private function showCondenseAssembliesButton():void
        {
            _j5Controls.condenseAssembliesButton.visible = true;
            _j5Controls.condenseAssembliesButton.width = NaN;
            _j5Controls.condenseAssembliesStopWaitingButton.visible = false;
            _j5Controls.condenseAssembliesStopWaitingButton.width = 0;
        }
        
        private function showCondenseAssembliesStopWaitingButton():void
        {
            _j5Controls.condenseAssembliesButton.visible = false;
            _j5Controls.condenseAssembliesButton.width = 0;
            _j5Controls.condenseAssembliesStopWaitingButton.visible = true;
            _j5Controls.condenseAssembliesStopWaitingButton.width = NaN;
        }
        
        private function showDistributePcrButton():void
        {
            _j5Controls.distributePcrReactionsButton.visible = true;
            _j5Controls.distributePcrReactionsButton.width = NaN;
            _j5Controls.distributePcrStopWaitingButton.visible = false;
            _j5Controls.distributePcrStopWaitingButton.width = 0;
        }
        
        private function showDistributePcrStopWaitingButton():void
        {
            _j5Controls.distributePcrReactionsButton.visible = false;
            _j5Controls.distributePcrReactionsButton.width = 0;
            _j5Controls.distributePcrStopWaitingButton.visible = true;
            _j5Controls.distributePcrStopWaitingButton.width = NaN;
        }
        
        private function j5FilesButtonsEnable():void
        {
            if (j5CollectionProxy.j5Collection.j5Ready == true)
            {
                _j5Controls.completeFileGenerateButton.enabled = true;
                _j5Controls.j5SeqFileGenerateButton.enabled = true;
                _j5Controls.j5PartsFileGenerateButton.enabled = true;
                _j5Controls.j5TargetFileGenerateButton.enabled = true;
            }
            else
            {
                _j5Controls.completeFileGenerateButton.enabled = false;
                _j5Controls.j5SeqFileGenerateButton.enabled = false;
                _j5Controls.j5PartsFileGenerateButton.enabled = false;
                _j5Controls.j5TargetFileGenerateButton.enabled = false;
            }
            
            _j5Controls.j5GenbankFileGenerateButton.enabled = false;
            _j5Controls.j5FastaFileGenerateButton.enabled = false;
            _j5Controls.j5JbeiSeqFileGenerateButton.enabled = false;
            
            if ((facade as ApplicationFacade).selectedPartRenderer != null && (facade as ApplicationFacade).selectedPartRenderer.part.hasSequence)
            {
                var sequenceFileFormat:String = (facade as ApplicationFacade).selectedPartRenderer.part.partVO.sequenceFile.sequenceFileFormat;
                if (sequenceFileFormat == Constants.GENBANK) {
                    _j5Controls.j5GenbankFileGenerateButton.enabled = true;
                } else if (sequenceFileFormat == Constants.FASTA) {
                    _j5Controls.j5FastaFileGenerateButton.enabled = true;
                } else if (sequenceFileFormat == Constants.JBEI_SEQ) {
                    _j5Controls.j5JbeiSeqFileGenerateButton.enabled = true;
                }
            }
        }
        
        private function populateJ5ResultsDisplay():void
        {
            //Populate plasmids tab
            var plasmidNames:ArrayCollection = new ArrayCollection();
            for (var i:int = 0; i < j5ResultsZipFile.size; i++) {
                var zipEntry:ZipEntry = j5ResultsZipFile.entries[i];
                var matchResult:Array = zipEntry.name.match(/\.(gb|fas|fa|fasta)$/);
                if (matchResult != null && matchResult.length > 0) { //if genbank or fasta
                    plasmidNames.addItem(new ObjectProxy({name:zipEntry.name}));
                } else {
                    matchResult = zipEntry.name.match(/\.xml$/);
                    if (matchResult != null && matchResult.length > 0) {
                        var xml:XML = new XML(j5ResultsZipFile.getInput(zipEntry).toString());
                        if (xml.name().toString() == "http://jbei.org/sequence::seq" //if jbei-seq
                            || xml.name().toString() == "http://www.w3.org/1999/02/22-rdf-syntax-ns#::RDF") { //or if SBOL XML
                            plasmidNames.addItem(new ObjectProxy({name:zipEntry.name}));
                        }
                    }
                }
            }
            var sort:Sort = new Sort();
            sort.fields = [new SortField("name")];
            plasmidNames.sort = sort;
            plasmidNames.refresh();
            _j5Controls.plasmidsDataGrid.dataProvider = plasmidNames;
        }
        
        private function checkReadyToRunCondenseAssemblies():void
        {
            if (assemblyFilesListFileRef == null || assemblyFilesListFileRef.data == null) {
                _j5Controls.condenseAssembliesButton.enabled = false;
                _j5Controls.cannotCondenseAssembliesReasonLabel.text = "Cannot condense assemblies: No assembly files to condense list specified";
                return;
            }
            
            if (zippedAssemblyFilesFileRef == null || zippedAssemblyFilesFileRef.data == null) {
                _j5Controls.condenseAssembliesButton.enabled = false;
                _j5Controls.cannotCondenseAssembliesReasonLabel.text = "Cannot condense assemblies: No zipped assembly files specified";
                return;
            }
            
            _j5Controls.condenseAssembliesButton.enabled = true;
            _j5Controls.cannotCondenseAssembliesReasonLabel.text = "";

        }
        
        private function checkReadyToRunDistributePcrReactions():void
        {
            if (sourcePlateListFileRef == null || sourcePlateListFileRef.data == null) {
                _j5Controls.distributePcrReactionsButton.enabled = false;
                _j5Controls.cannotDistributePcrReactionsReasonLabel.text = "Cannot distribute PCR reactions: No Source Plate List";
                return;
            }
            
            if (zippedPlateFilesFileRef == null || zippedPlateFilesFileRef.data == null) {
                _j5Controls.distributePcrReactionsButton.enabled = false;
                _j5Controls.cannotDistributePcrReactionsReasonLabel.text = "Cannot distribute PCR reactions: No Zipped Plate Files";
                return;
            }
            
            if (condensedJ5AssemblyFileFileRef == null || condensedJ5AssemblyFileFileRef.data == null) {
                _j5Controls.distributePcrReactionsButton.enabled = false;
                _j5Controls.cannotDistributePcrReactionsReasonLabel.text = "Cannot distribute PCR reactions: No j5 Assembly File";
                return;
            }
            
            _j5Controls.distributePcrReactionsButton.enabled = true;
            _j5Controls.cannotDistributePcrReactionsReasonLabel.text = "";
        }
        
        private function populateJ5ParametersDialog():void
        {
            // populate J5ParameterDialog with values from J5Parameters model
            var j5Parameters:J5Parameters = j5ParametersProxy.j5Parameters;
            _j5ParametersDialog.MONOD_stepper.value = j5Parameters.masterOligoNumberOfDigitsValue;
            _j5ParametersDialog.MPNOD_stepper.value = j5Parameters.masterPlasmidNumberOfDigitsValue;
            _j5ParametersDialog.GOB_stepper.value = j5Parameters.gibsonOverlapBPsValue;
            _j5ParametersDialog.GOMT_stepper.value = j5Parameters.gibsonOverlapMinTmValue;
            _j5ParametersDialog.GOMAXT_stepper.value = j5Parameters.gibsonOverlapMaxTmValue;
            _j5ParametersDialog.MOLB_stepper.value = j5Parameters.maxOligoLengthBPsValue;
            _j5ParametersDialog.MFSGB_stepper.value = j5Parameters.minFragmentSizeGibsonBPsValue;
            _j5ParametersDialog.GGOHB_stepper.value = j5Parameters.goldenGateOverhangBPsValue;
            _j5ParametersDialog.GGRS_Text.text = j5Parameters.goldenGateRecognitionSeqValue;
            _j5ParametersDialog.GGTES_Text.text = j5Parameters.goldenGateTerminiExtraSeqValue;
            _j5ParametersDialog.MIGGOC_stepper.value = j5Parameters.maxIdentitiesGoldenGateOverhangsCompatibleValue;
            _j5ParametersDialog.OSCPB_stepper.value = j5Parameters.oligoSynthesisCostPerBPUSDValue;
            _j5ParametersDialog.OPPCPP_stepper.value = j5Parameters.oligoPagePurificationCostPerPieceUSDValue;
            _j5ParametersDialog.OMLPPRB_stepper.value = j5Parameters.oligoMaxLengthNoPagePurificationRequiredBPsValue;
            _j5ParametersDialog.MPPB_stepper.value = j5Parameters.minPCRProductBPsValue;
            _j5ParametersDialog.DSCPB_stepper.value = j5Parameters.directSynthesisCostPerBPUSDValue;
            _j5ParametersDialog.DSMCPP_stepper.value = j5Parameters.directSynthesisMinCostPerPieceUSDValue;
            _j5ParametersDialog.PGC_stepper.value = j5Parameters.primerGCClampValue;
            _j5ParametersDialog.PMS_stepper.value = j5Parameters.primerMinSizeValue;
            _j5ParametersDialog.PMAXS_stepper.value = j5Parameters.primerMaxSizeValue;
            _j5ParametersDialog.PMT_stepper.value = j5Parameters.primerMinTmValue;
            _j5ParametersDialog.PMAXT_stepper.value = j5Parameters.primerMaxTmValue;
            _j5ParametersDialog.PMDT_stepper.value = j5Parameters.primerMaxDiffTmValue;
            _j5ParametersDialog.PMSAT_stepper.value = j5Parameters.primerMaxSelfAnyThValue;
            _j5ParametersDialog.PMSET_stepper.value = j5Parameters.primerMaxSelfEndThValue;
            _j5ParametersDialog.PPMCAT_stepper.value = j5Parameters.primerPairMaxComplAnyThValue;
            _j5ParametersDialog.PPMCET_stepper.value = j5Parameters.primerPairMaxComplEndThValue;
            _j5ParametersDialog.PTS_comboBox.selectedItem = j5Parameters.primerTmSantaluciaValue;
            _j5ParametersDialog.PSC_comboBox.selectedItem = j5Parameters.primerSaltCorrectionsValue;
            _j5ParametersDialog.PDC_stepper.value = j5Parameters.primerDnaConcValue;
            _j5ParametersDialog.M3BBTWIH_stepper.value = j5Parameters.mispriming3PrimeBoundaryBPToWarnIfHitValue;
            _j5ParametersDialog.MMT_stepper.value = j5Parameters.misprimingMinTmValue;
            _j5ParametersDialog.MSC_stepper.value = j5Parameters.misprimingSaltConcValue;
            _j5ParametersDialog.MOC_stepper.value = j5Parameters.misprimingOligoConcValue;
            _j5ParametersDialog.OSF_ComboBox.selectedItem = j5Parameters.outputSequenceFormatValue;
            _j5ParametersDialog.SPP_ComboBox.selectedItem = j5Parameters.suppressPurePrimersValue;
        }
        
        private function resetJ5ParametersDialogToDefaults():void
        {
            // reset values in dialog, do not reset values in model - user needs to click OK to save
            _j5ParametersDialog.MONOD_stepper.value = J5Parameters.MONOD_Default;
            _j5ParametersDialog.MPNOD_stepper.value = J5Parameters.MPNOD_Default;
            _j5ParametersDialog.GOB_stepper.value = J5Parameters.GOB_Default;
            _j5ParametersDialog.GOMT_stepper.value = J5Parameters.GOMT_Default;
            _j5ParametersDialog.GOMAXT_stepper.value = J5Parameters.GOMAXT_Default;
            _j5ParametersDialog.MOLB_stepper.value = J5Parameters.MOLB_Default;
            _j5ParametersDialog.MFSGB_stepper.value = J5Parameters.MFSGB_Default;
            _j5ParametersDialog.GGOHB_stepper.value = J5Parameters.GGOHB_Default;
            _j5ParametersDialog.GGRS_Text.text = J5Parameters.GGRS_Default;
            _j5ParametersDialog.GGTES_Text.text = J5Parameters.GGTES_Default;
            _j5ParametersDialog.MIGGOC_stepper.value = J5Parameters.MIGGOC_Default;
            _j5ParametersDialog.OSCPB_stepper.value = J5Parameters.OSCPB_Default;
            _j5ParametersDialog.OPPCPP_stepper.value = J5Parameters.OPPCPP_Default;
            _j5ParametersDialog.OMLPPRB_stepper.value = J5Parameters.OMLPPRB_Default;
            _j5ParametersDialog.MPPB_stepper.value = J5Parameters.MPPB_Default;
            _j5ParametersDialog.DSCPB_stepper.value = J5Parameters.DSCPB_Default;
            _j5ParametersDialog.DSMCPP_stepper.value = J5Parameters.DSMCPP_Default;
            _j5ParametersDialog.PGC_stepper.value = J5Parameters.PGC_Default;
            _j5ParametersDialog.PMS_stepper.value = J5Parameters.PMS_Default;
            _j5ParametersDialog.PMAXS_stepper.value = J5Parameters.PMAXS_Default;
            _j5ParametersDialog.PMT_stepper.value = J5Parameters.PMT_Default;
            _j5ParametersDialog.PMAXT_stepper.value = J5Parameters.PMAXT_Default;
            _j5ParametersDialog.PMDT_stepper.value = J5Parameters.PMDT_Default;
            _j5ParametersDialog.PMSAT_stepper.value = J5Parameters.PMSAT_Default;
            _j5ParametersDialog.PMSET_stepper.value = J5Parameters.PMSET_Default;
            _j5ParametersDialog.PPMCAT_stepper.value = J5Parameters.PPMCAT_Default;
            _j5ParametersDialog.PPMCET_stepper.value = J5Parameters.PPMCET_Default;
            _j5ParametersDialog.PTS_comboBox.selectedItem = J5Parameters.PTS_Default;
            _j5ParametersDialog.PSC_comboBox.selectedItem = J5Parameters.PSC_Default;
            _j5ParametersDialog.PDC_stepper.value = J5Parameters.PDC_Default;
            _j5ParametersDialog.M3BBTWIH_stepper.value = J5Parameters.M3BBTWIH_Default;
            _j5ParametersDialog.MMT_stepper.value = J5Parameters.MMT_Default;
            _j5ParametersDialog.MSC_stepper.value = J5Parameters.MSC_Default;
            _j5ParametersDialog.MOC_stepper.value = J5Parameters.MOC_Default;
            _j5ParametersDialog.OSF_ComboBox.selectedItem = J5Parameters.OSF_Default;
            _j5ParametersDialog.SPP_ComboBox.selectedItem = J5Parameters.SPP_Default;
        }
        
        private function resetJ5ParametersDialogToFile(j5ParametersFile:String):void
        {
            // reset values in dialog, do not reset values in model - user needs to click OK to save
            var lines:Array = j5ParametersFile.split(/\R/);
            
            var alertMessage:String = "";
            
            for (var i:int = 1; i < lines.length ; i++) {
                var fields:Array = (lines[i] as String).split(","); //assumes no commas in first 2 fields of the CSV
                switch ((fields[0] as String).toUpperCase()) {
                    case J5Parameters.MONOD:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.MONOD_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.MONOD + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.MPNOD:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.MPNOD_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.MPNOD + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.GOB:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.GOB_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.GOB + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.GOMT:
                        _j5ParametersDialog.GOMT_stepper.value = fields[1];
                        break;
                    case J5Parameters.GOMAXT:
                        _j5ParametersDialog.GOMAXT_stepper.value = fields[1];
                        break;
                    case J5Parameters.MOLB:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.MOLB_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.MOLB + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.MFSGB:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.MFSGB_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.MFSGB + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.GGOHB:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.GGOHB_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.GGOHB + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.GGRS:
                        _j5ParametersDialog.GGRS_Text.text = fields[1];
                        break;
                    case J5Parameters.GGTES:
                        _j5ParametersDialog.GGTES_Text.text = fields[1];
                        break;
                    case J5Parameters.MIGGOC:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.MIGGOC_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.MIGGOC + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.OSCPB:
                        _j5ParametersDialog.OSCPB_stepper.value = fields[1];
                        break;
                    case J5Parameters.OPPCPP:
                        _j5ParametersDialog.OPPCPP_stepper.value = fields[1];
                        break;
                    case J5Parameters.OMLPPRB:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.OMLPPRB_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.OMLPPRB + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.MPPB:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.MPPB_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.MPPB + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.DSCPB:
                        _j5ParametersDialog.DSCPB_stepper.value = fields[1];
                        break;
                    case J5Parameters.DSMCPP:
                        _j5ParametersDialog.DSMCPP_stepper.value = fields[1];
                        break;
                    case J5Parameters.PGC:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.PGC_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.PGC + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PMS:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.PMS_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.PMS + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PMAXS:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.PMAXS_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.PMAXS + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PMT:
                        _j5ParametersDialog.PMT_stepper.value = fields[1];
                        break;
                    case J5Parameters.PMAXT:
                        _j5ParametersDialog.PMAXT_stepper.value = fields[1];
                        break;
                    case J5Parameters.PMDT:
                        _j5ParametersDialog.PMDT_stepper.value = fields[1];
                        break;
                    case J5Parameters.PMSAT:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.PMSAT_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.PMSAT + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PMSET:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.PMSET_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.PMSET + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PPMCAT:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.PPMCAT_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.PPMCAT + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PPMCET:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.PPMCET_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.PPMCET + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PTS:
                        if (fields[1] == "1") {
                            _j5ParametersDialog.PTS_comboBox.selectedItem = true;
                        } else if (fields[1] == "0") {
                            _j5ParametersDialog.PTS_comboBox.selectedItem = false;
                        } else {
                            alertMessage += J5Parameters.PTS + " has an invalid value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PSC:
                        if (fields[1] == "1") {
                            _j5ParametersDialog.PSC_comboBox.selectedItem = true;
                        } else if (fields[1] == "0") {
                            _j5ParametersDialog.PSC_comboBox.selectedItem = false;
                        } else {
                            alertMessage += J5Parameters.PSC + " has an invalid value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.PDC:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.PDC_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.PDC + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.M3BBTWIH:
                        if (isInt(fields[1])) {
                            _j5ParametersDialog.M3BBTWIH_stepper.value = fields[1];
                        } else {
                            alertMessage += J5Parameters.M3BBTWIH + " has a non-integer value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.MMT:
                        _j5ParametersDialog.MMT_stepper.value = fields[1];
                        break;
                    case J5Parameters.MSC:
                        _j5ParametersDialog.MSC_stepper.value = fields[1];
                        break;
                    case J5Parameters.MOC:
                        _j5ParametersDialog.MOC_stepper.value = fields[1];
                        break;
                    case J5Parameters.OSF:
                        if ((fields[1] as String).toLowerCase() == Constants.GENBANK.toLowerCase()) {
                            _j5ParametersDialog.OSF_ComboBox.selectedItem = Constants.GENBANK;
                        } else if ((fields[1] as String).toLowerCase() == Constants.FASTA.toLowerCase()) {
                            _j5ParametersDialog.OSF_ComboBox.selectedItem = Constants.FASTA;
                        } else if ((fields[1] as String).toLowerCase() == Constants.JBEI_SEQ.toLowerCase()) {
                            _j5ParametersDialog.OSF_ComboBox.selectedItem = Constants.JBEI_SEQ;
                        } else if ((fields[1] as String).toLowerCase() == Constants.SBOL_XML.toLowerCase()) {
                            _j5ParametersDialog.OSF_ComboBox.selectedItem = Constants.SBOL_XML;
                        } else {
                            alertMessage += J5Parameters.OSF + " has an invalid value of " + fields[1] + ".\n";
                        }
                        break;
                    case J5Parameters.SPP:
                        if ((fields[1] as String).toLowerCase() == "true") {
                            _j5ParametersDialog.SPP_ComboBox.selectedItem = true;
                        } else if ((fields[1] as String).toLowerCase() == "false") {
                            _j5ParametersDialog.SPP_ComboBox.selectedItem = false;
                        } else {
                            alertMessage += J5Parameters.SPP + " has an invalid value of " + fields[1] + ".\n";
                        }
                        break;
                }
            }
            
            if (alertMessage != "") {
                Alert.show("The following j5 parameter values are invalid, using defaults for these parameters:\n\n" 
                    + alertMessage, "Warning Message");
            }
        }
        
        private function populateDownstreamAutomationParametersDialog():void
        {
            // populate DownstreamAutomationParameterDialog with values from DownstreamAutomationParameters model
            var downstreamAutomationParameters:DownstreamAutomationParameters = downstreamAutomationParametersProxy.downstreamAutomationParameters;
            _downstreamAutomationParametersDialog.mdtazStepper.value = downstreamAutomationParameters.maxDeltaTemperatureAdjacentZonesValue;
            _downstreamAutomationParametersDialog.mdtrozaStepper.value = downstreamAutomationParameters.maxDeltaTemperatureReactionOptimumZoneAcceptableValue;
            _downstreamAutomationParametersDialog.mmcspzStepper.value = downstreamAutomationParameters.maxMcStepsPerZoneValue;
            _downstreamAutomationParametersDialog.mwvmpStepper.value = downstreamAutomationParameters.maxWellVolumeMultiwellPlateValue;
            _downstreamAutomationParametersDialog.mctfStepper.value = downstreamAutomationParameters.mcTemperatureFinalValue;
            _downstreamAutomationParametersDialog.mctiStepper.value = downstreamAutomationParameters.mcTemperatureInitialValue;
            _downstreamAutomationParametersDialog.mpvStepper.value = downstreamAutomationParameters.minPipettingVolumeValue;
            _downstreamAutomationParametersDialog.ncmpStepper.value = downstreamAutomationParameters.nColumnsMultiwellPlateValue;
            _downstreamAutomationParametersDialog.nrmpStepper.value = downstreamAutomationParameters.nRowsMultiwellPlateValue;
            _downstreamAutomationParametersDialog.tdtStepper.value = downstreamAutomationParameters.trialDeltaTemperatureValue;
            _downstreamAutomationParametersDialog.wptzStepper.value = downstreamAutomationParameters.wellsPerThermocyclerZoneValue;
            _downstreamAutomationParametersDialog.zptbStepper.value = downstreamAutomationParameters.zonesPerThermocyclerBlockValue;
        }
        
        private function isInt(str:String):Boolean //TODO: move to utils and make static?
        {
            var pattern:RegExp = /^-?\d+$/;
            if (pattern.exec(str) != null) {
                return true;
            }
            return false;
        }
    }
}