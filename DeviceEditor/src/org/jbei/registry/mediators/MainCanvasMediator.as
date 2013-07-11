// ActionScript file
// Author: Doug Densmore

package org.jbei.registry.mediators
{
        import com.roguedevelopment.objecthandles.ObjectHandleEvent;
        
        import flash.desktop.Clipboard;
        import flash.desktop.ClipboardFormats;
        import flash.events.Event;
        import flash.events.IOErrorEvent;
        import flash.events.KeyboardEvent;
        import flash.net.FileFilter;
        import flash.net.FileReference;
        import flash.utils.ByteArray;
        import flash.utils.Dictionary;
        import flash.utils.Endian;
        
        import mx.collections.ArrayCollection;
        import mx.controls.Alert;
        import mx.core.Application;
        import mx.events.CloseEvent;
        import mx.managers.PopUpManager;
        
        import nochump.util.zip.ZipFile;
        
        import org.jbei.registry.ApplicationFacade;
        import org.jbei.registry.Constants;
        import org.jbei.registry.EmbeddedFiles;
        import org.jbei.registry.Notifications;
        import org.jbei.registry.api.Entry;
        import org.jbei.registry.api.FeaturedDNASequence;
        import org.jbei.registry.api.Name;
        import org.jbei.registry.commands.FunctionMediator;
        import org.jbei.registry.models.EugeneRule;
        import org.jbei.registry.models.Part;
        import org.jbei.registry.models.PartVO;
        import org.jbei.registry.proxies.EntryServiceProxy;
        import org.jbei.registry.proxies.EugeneRuleProxy;
        import org.jbei.registry.proxies.PartProxy;
        import org.jbei.registry.proxies.SequenceFileProxy;
        import org.jbei.registry.utils.FileLoader;
        import org.jbei.registry.utils.Logger;
        import org.jbei.registry.utils.XMLTools;
        import org.jbei.registry.utils.ZipLoader;
        import org.jbei.registry.view.ui.IPartRenderer;
        import org.jbei.registry.view.ui.MainCanvas;
        import org.jbei.registry.view.ui.canvas.CenterCanvas;
        import org.jbei.registry.view.ui.dialogs.ClipboardPasteDialog;
        import org.jbei.registry.view.ui.dialogs.EugeneRulesImportDialog;
        import org.jbei.registry.view.ui.dialogs.J5ImportDialog;
        import org.jbei.registry.view.ui.dialogs.PartDefinitionDialog;
        import org.jbei.registry.view.ui.panels.J5Panel;
        import org.jbei.registry.view.ui.shapes.CollectionShape;
        import org.jbei.registry.view.ui.shapes.RectShape;
        import org.puremvc.as3.interfaces.INotification;
        import org.puremvc.as3.patterns.mediator.Mediator;

        public class MainCanvasMediator extends Mediator
        {
                public static const NAME:String = "MainCanvasMediator";
                
                private static const GENBANK_FILE_TYPES:FileFilter = new FileFilter("Genbank File", "*.gb;*.ape");
                private static const FASTA_FILE_TYPES:FileFilter = new FileFilter("FASTA File", "*.fas");			
                private static const XML_FILE_TYPES:FileFilter = new FileFilter("XML File", "*.xml");
                private static const CSV_FILE_TYPES:FileFilter = new FileFilter("CSV File", "*.csv");
                private static const ZIP_FILE_TYPES:FileFilter = new FileFilter("ZIP File", "*.zip");
                private static const EUGENE_FILE_TYPES:FileFilter = new FileFilter("Eugene File", "*.eug");
                private static const ALL_FILE_TYPES:FileFilter = new FileFilter("All Files", "*");
                
                private var _mainCanvas:MainCanvas;
                
                private var _lastLoadString:String = "new_design.xml";

                private var j5ImportDialog:J5ImportDialog;
                private var fileRef:FileReference;
                private var seqListInfo:ArrayCollection = new ArrayCollection();
                private var genbankZip:ZipFile = null;
                private var partListInfo:ArrayCollection = new ArrayCollection();
                private var targetListInfo:ArrayCollection = new ArrayCollection();
                
                private var eugeneImportDialog:EugeneRulesImportDialog;
                
                private var partDefinitionDialog:PartDefinitionDialog;
                
                private var clipboardPasteDialog:ClipboardPasteDialog;
                
                private var partProxy:PartProxy = ApplicationFacade.getInstance().retrieveProxy(PartProxy.NAME) as PartProxy;
                private var sequenceFileProxy:SequenceFileProxy = ApplicationFacade.getInstance().retrieveProxy(SequenceFileProxy.NAME) as SequenceFileProxy;
                private var eugeneRuleProxy:EugeneRuleProxy = ApplicationFacade.getInstance().retrieveProxy(EugeneRuleProxy.NAME) as EugeneRuleProxy;
                
                // Constructor
                public function MainCanvasMediator(viewComponent:Object=null)
                {
                        super(NAME, viewComponent);
                        _mainCanvas = viewComponent as MainCanvas;
                        
                        //add event listeners
                        _mainCanvas.addEventListener(J5Panel.CHANGE_PART_DEFINITION, showPartDefinitionEditDialog);
                }
                
                // Properties
                public function get mainCanvas():MainCanvas
                {
                    return _mainCanvas; 
                }
                
                public function get functionMediator():FunctionMediator
                {
                    return ApplicationFacade.getInstance().retrieveMediator(FunctionMediator.NAME) as FunctionMediator;
                }
                
                public function get lastLoadString():String
                {
                    return _lastLoadString;
                }
                
                public function set lastLoadString(str:String):void
                {
                    _lastLoadString = str;
                }
                                
                // Public Methods
                public override function listNotificationInterests():Array 
                {
                        return [
/*                              TODO: remove?
                                Notifications.SEQUENCE_MAPPED
                                , Notifications.NO_SEQUENCE_FOUND
                                
                                , Notifications.GENBANK_MAPPED
*/                                
                                , Notifications.NEW_SET_CLIPBOARD_DATA

                                , Notifications.COLLECTION_MODIFIED
                                
                                , Notifications.IMPORT_FETCHED
                                
                                , Notifications.LOAD_XML
                                , Notifications.LOAD_FETCHED

                                , Notifications.NEW_CLEAR_DESIGN
                                
                                , Notifications.NEW_OPEN_J5IMPORT_DIALOG
                                
                                , Notifications.NEW_LOAD_SLIC_EXAMPLE
                                , Notifications.NEW_LOAD_COMBINATORIAL_SLIC_EXAMPLE
                                , Notifications.NEW_LOAD_GOLDEN_GATE_EXAMPLE
                                , Notifications.NEW_LOAD_COMBINATORIAL_GOLDEN_GATE_EXAMPLE
                                
                                , Notifications.NEW_IMPORT_EUGENE_RULES
                                
                                , Notifications.NEW_GENBANK_IMPORT_START
                                , Notifications.NEW_CLIPBOARD_PASTE_START
                        ];
                }
                
                public override function handleNotification(notification:INotification):void
                {
/*                  TODO: remove?
                    var rectShape:RectShape;
                    var part:Part;

                    if (ApplicationFacade.getInstance().getSelectedRectShape() != null) {
                        rectShape = ApplicationFacade.getInstance().getSelectedRectShape();
                        part = rectShape.part;
                    }
*/                    
                        switch(notification.getName()) {
/*                                TODO: remove?
                            	case Notifications.SEQUENCE_MAPPED:
                                        //setJ5(part, notification.getBody()[0]);
                                        //FIXME: setJ5 no longer exists, just set the information directly into the part
                                        //also, this notification should never be sent since MappingBar is currently not visible

                                        sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, part);
                                        sendNotification(Notifications.NEW_UPDATE_STATUS_BAR_BASIC, rectShape);
                                        
                                        functionMediator.setUpCollection();	
                                        break;                                        
                                        
                                //FIXME: remove?
                                case Notifications.NO_SEQUENCE_FOUND:
                                		break;
                                                  
                                case Notifications.GENBANK_MAPPED:
                                        var fileContent:String = notification.getBody() as String;
                                        try {
                                            part.sequenceFile = sequenceFileProxy.addSequenceFile(Constants.GENBANK, fileContent);
                                        } catch (error:Error) {
                                            Alert.show(error.toString(), "Error Message");
                                        }

                                        sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, part);
                                        sendNotification(Notifications.NEW_UPDATE_STATUS_BAR_BASIC, rectShape);
                                		break;
*/                                		                                       
                               	case Notifications.NEW_SET_CLIPBOARD_DATA:
                                        var selectedPartRenderer:IPartRenderer = (facade as ApplicationFacade).selectedPartRenderer;
                                        if(selectedPartRenderer != null && selectedPartRenderer.part != null && !selectedPartRenderer.part.isEmpty())
                                       	{
                                                Clipboard.generalClipboard.clear()
                                                Clipboard.generalClipboard.setData(Constants.PART_CLIPBOARD_KEY, selectedPartRenderer.part);
                                       	}
//                                       	else if (ApplicationFacade.getInstance().getSelectedCollectionShape() != null)
//                                       	{
//                                       			//Just set the copyCollection; actual copy happens during "paste"
//                                       			ApplicationFacade.getInstance().copyCollection = ApplicationFacade.getInstance().getSelectedCollectionShape();
//                                       	}
                                       	else
                                       	{
                                       			Alert.show("Nothing to copy.", "Warning Message");
//                                        		Logger.getInstance().warning("Nothing to copy");
                                        }  
                                        break;
                                        
                                case Notifications.LOAD_XML:          
                                        Alert.show("Are you sure you want to load design?\n\nWARNING:\nThis will clear the current design. Any unsaved changes will be lost.", 
                                            "Load File", Alert.OK | Alert.CANCEL, _mainCanvas, loadListenerXML, null, Alert.OK);
                                        //new FileLoader(XML_FILE_TYPES, this, Notifications.LOAD_FETCHED);
                                        break;
                                         
                                case Notifications.LOAD_FETCHED:
                                        loadDesignXML(notification.getBody() as Array);
                                		break;

                                //TODO: remove? only sent by CenterCanvasMediator
//								case Notifications.COLLECTION_MODIFIED:
//                             			functionMediator.setUpCollection();			
//                             			_mainCanvas.rightCanvas.infoPanel.collectionPanel.clearDisplay();
//                                        _mainCanvas.rightCanvas.infoPanel.collectionPanel.displayCollection(ApplicationFacade.getInstance().getSelectedCollectionShape());
//                             			break;
                                
                                case Notifications.NEW_CLEAR_DESIGN:
                                    _lastLoadString = "new_design.xml"; //reset
                                    break;

                                case Notifications.NEW_OPEN_J5IMPORT_DIALOG:
                                        Alert.show("Are you sure you want to load J5?\n\nWARNING:\nThis will clear the current design. Any unsaved changes will be lost.", 
                                            "Load J5", Alert.OK | Alert.CANCEL, _mainCanvas, loadListenerJ5, null, Alert.OK)
                                        break;
                                
                                case Notifications.NEW_LOAD_SLIC_EXAMPLE:
                                        Alert.show("Are you sure you want to load example?\n\nWARNING:\nThis will clear the current design. Any unsaved changes will be lost.", 
                                            "Load Example", Alert.OK | Alert.CANCEL, _mainCanvas, loadListenerSlicExample, null, Alert.OK)
                                        break;
                                
                                case Notifications.NEW_LOAD_COMBINATORIAL_SLIC_EXAMPLE:
                                        Alert.show("Are you sure you want to load example?\n\nWARNING:\nThis will clear the current design. Any unsaved changes will be lost.", 
                                            "Load Example", Alert.OK | Alert.CANCEL, _mainCanvas, loadListenerCombinatorialSlicExample, null, Alert.OK)
                                    break;
                                
                                case Notifications.NEW_LOAD_GOLDEN_GATE_EXAMPLE:
                                        Alert.show("Are you sure you want to load example?\n\nWARNING:\nThis will clear the current design. Any unsaved changes will be lost.", 
                                            "Load Example", Alert.OK | Alert.CANCEL, _mainCanvas, loadListenerGoldenGateExample, null, Alert.OK)
                                    break;
                                
                                case Notifications.NEW_LOAD_COMBINATORIAL_GOLDEN_GATE_EXAMPLE:
                                        Alert.show("Are you sure you want to load example?\n\nWARNING:\nThis will clear the current design. Any unsaved changes will be lost.", 
                                            "Load Example", Alert.OK | Alert.CANCEL, _mainCanvas, loadListenerCombinatorialGoldenGateExample, null, Alert.OK)
                                        break;
                                
                                case Notifications.NEW_IMPORT_EUGENE_RULES:
                                        fileRef = new FileReference();
                                        fileRef.addEventListener(Event.SELECT, onFileSelect);
                                        fileRef.addEventListener(Event.COMPLETE, openEugeneRulesImportDialog);
                                        fileRef.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
                                        fileRef.browse([EUGENE_FILE_TYPES, ALL_FILE_TYPES]);
                                        break;
                                
                                case Notifications.NEW_GENBANK_IMPORT_START:
                                        openGenbankFileChooser();
                                        break;
                                
                                case Notifications.NEW_CLIPBOARD_PASTE_START:
                                    openClipboardPasteDialog();
                                    break;
                        }
                }
                
                //Private methods
                private function loadListenerXML(eventObj:CloseEvent):void {
                    // Check to see if the OK button was pressed.
                    if (eventObj.detail==Alert.OK) {
                        sendNotification(Notifications.NEW_CLEAR_DESIGN);
                        new FileLoader([XML_FILE_TYPES, ALL_FILE_TYPES], this, Notifications.LOAD_FETCHED);  
                    }
                }
                
                private function loadListenerJ5(eventObj:CloseEvent):void {
                    // Check to see if the OK button was pressed.
                    if (eventObj.detail==Alert.OK) {
                        sendNotification(Notifications.NEW_CLEAR_DESIGN);
                        openJ5ImportDialog();
                    }
                }
                
                private function loadListenerSlicExample(eventObj:CloseEvent):void
                {
                    // Check to see if the OK button was pressed.
                    if (eventObj.detail==Alert.OK) {
                        sendNotification(Notifications.NEW_CLEAR_DESIGN);
                        var designData:Array = new Array();
                        designData[0] = EmbeddedFiles.slicExampleFile;
                        designData[1] = "SLIC_Gibson_CPEC_example.xml";
                        loadDesignXML(designData);
                    }
                }
                
                private function loadListenerCombinatorialSlicExample(eventObj:CloseEvent):void
                {
                    // Check to see if the OK button was pressed.
                    if (eventObj.detail==Alert.OK) {
                        sendNotification(Notifications.NEW_CLEAR_DESIGN);
                        var designData:Array = new Array();
                        designData[0] = EmbeddedFiles.combinatorialSlicExampleFile;
                        designData[1] = "Combinatorial_SLIC_Gibson_CPEC_example.xml";
                        loadDesignXML(designData);
                    }
                }
                
                private function loadListenerGoldenGateExample(eventObj:CloseEvent):void
                {
                    // Check to see if the OK button was pressed.
                    if (eventObj.detail==Alert.OK) {
                        sendNotification(Notifications.NEW_CLEAR_DESIGN);
                        var designData:Array = new Array();
                        designData[0] = EmbeddedFiles.goldenGateExampleFile;
                        designData[1] = "Golden_Gate_example.xml";
                        loadDesignXML(designData);
                    }
                }
                
                private function loadListenerCombinatorialGoldenGateExample(eventObj:CloseEvent):void
                {
                    // Check to see if the OK button was pressed.
                    if (eventObj.detail==Alert.OK) {
                        sendNotification(Notifications.NEW_CLEAR_DESIGN);
                        var designData:Array = new Array();
                        designData[0] = EmbeddedFiles.combinatorialGoldenGateExampleFile;
                        designData[1] = "Combinatorial_Golden_Gate_example.xml";
                        loadDesignXML(designData);
                    }
                }
                
                private function loadDesignXML(designData:Array):void
                {
                    var loadXML:XML = new XML(designData[0] as String);
                    
                    if ((loadXML.name() as QName).localName != "design") {
                        Alert.show("Load failed: file is not a valid design XML", "Error Message");
                        return;
                    }
                    
                    _lastLoadString = designData[1] as String;
                    sendNotification(Notifications.CHANGE_TITLE, _lastLoadString);
                    XMLTools.loadDesignXML(loadXML);
                    sendNotification(Notifications.NEW_UPDATE_BIN_NAME, 0); //FIXME: this doesn't really belong here... 
                        //...but XMLToolsV3 cannot send notification to refresh the first bin's name
                    Logger.getInstance().info("Design loaded"); 
                    sendNotification(Notifications.NEW_UPDATE_DSF_LINES);
                    sendNotification(Notifications.NEW_REFRESH_ALL_PART_RENDERERS);
                    sendNotification(Notifications.NEW_UPDATE_COLLECTION_DISPLAY_INFO);
                }
                
                /* J5ImportDialog Methods ************************************/
                
                private function openJ5ImportDialog():void
                {
                    j5ImportDialog = new J5ImportDialog();
                    
                    j5ImportDialog.addEventListener(J5ImportDialog.IMPORT_SEQ_FILE, onImportSeqFile);
                    j5ImportDialog.addEventListener(J5ImportDialog.IMPORT_ZIPPED_FILE, onImportZippedFile);
                    j5ImportDialog.addEventListener(J5ImportDialog.IMPORT_PART_FILE, onImportPartFile);
                    j5ImportDialog.addEventListener(J5ImportDialog.IMPORT_TARGET_FILE, onImportTargetFile);
                    j5ImportDialog.addEventListener(J5ImportDialog.CLEAR_IMPORTS, onClearImports);
                    j5ImportDialog.addEventListener(J5ImportDialog.COMPLETE_IMPORT, onCompleteJ5Import);
                    j5ImportDialog.addEventListener(J5ImportDialog.CANCEL, onJ5ImportDialogCancel);
                    
                    j5ImportDialog.open(mainCanvas); 
                }
                
                private function onImportSeqFile(event:Event):void
                {
                    fileRef = new FileReference();
                    fileRef.addEventListener(Event.SELECT, onFileSelect);
                    fileRef.addEventListener(Event.COMPLETE, onLoadSeqFileComplete);
                    fileRef.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
                    fileRef.browse([CSV_FILE_TYPES, ALL_FILE_TYPES]);
                }
                
                private function onImportZippedFile(event:Event):void
                {
                    fileRef = new FileReference();
                    fileRef.addEventListener(Event.SELECT, onFileSelect);
                    fileRef.addEventListener(Event.COMPLETE, onLoadZippedFileComplete);
                    fileRef.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
                    fileRef.browse([ZIP_FILE_TYPES, ALL_FILE_TYPES]);
                }
                
                private function onImportPartFile(event:Event):void
                {
                    fileRef = new FileReference();
                    fileRef.addEventListener(Event.SELECT, onFileSelect);
                    fileRef.addEventListener(Event.COMPLETE, onLoadPartFileComplete);
                    fileRef.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
                    fileRef.browse([CSV_FILE_TYPES, ALL_FILE_TYPES]);
                }
                
                private function onImportTargetFile(event:Event):void
                {
                    fileRef = new FileReference();
                    fileRef.addEventListener(Event.SELECT, onFileSelect);
                    fileRef.addEventListener(Event.COMPLETE, onLoadTargetFileComplete);
                    fileRef.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
                    fileRef.browse([CSV_FILE_TYPES, ALL_FILE_TYPES]);
                }
                
                private function onLoadSeqFileComplete(event:Event):void
                {
                    seqListInfo = functionMediator.parseSeqCSV(fileRef.data.toString());
                    if (seqListInfo != null) {
                        j5ImportDialog.setSeqImportLabel(true);
                        j5ImportDialog.seqButtonEnable(false);
                        j5ImportDialog.zippedButtonEnable(true);
                    } else {
                        j5ImportDialog.setSeqImportLabel(false);
                        Alert.show("Invalid j5 CSV file\nPlease check the formatting of the file", "Error Message");
                    }
                    fileRef = null;
                }
                
                private function onLoadZippedFileComplete(event:Event):void
                {
                    if (!functionMediator.isValidZipFile(fileRef.data)) {
                        Alert.show("Invalid zip file\nPlease ensure you have selected a zip file", "Error Message");
                        return;
                    }
                    
                    genbankZip = new ZipFile(fileRef.data);
                    j5ImportDialog.setZippedImportLabel(true);
                    j5ImportDialog.zippedButtonEnable(false);
                    j5ImportDialog.partButtonEnable(true);
                    fileRef = null;
                }
                
                private function onLoadPartFileComplete(event:Event):void
                {
                    partListInfo = functionMediator.parsePartCSV(fileRef.data.toString());
                    if (partListInfo != null) {
                        j5ImportDialog.setPartImportLabel(true);
                        j5ImportDialog.partButtonEnable(false);
                        j5ImportDialog.targetButtonEnable(true);
                    } else {
                        j5ImportDialog.setPartImportLabel(false);
                        Alert.show("Invalid j5 CSV file\nPlease check the formatting of the file", "Error Message");
                    }
                    fileRef = null;
                }
                
                private function onLoadTargetFileComplete(event:Event):void
                {
                    targetListInfo = functionMediator.parseTargetCSV(fileRef.data.toString());
                    if(targetListInfo != null) {
                        j5ImportDialog.setTargetImportLabel(true);
                        j5ImportDialog.targetButtonEnable(false);
                        j5ImportDialog.doneButtonEnable(true);
                    } else {
                        j5ImportDialog.setTargetImportLabel(false);
                        Alert.show("Invalid j5 CSV file\nPlease check the formatting of the file", "Error Message");
                    }	
                    fileRef = null;
                }
                
                private function onClearImports(event:Event):void
                {
                    seqListInfo = new ArrayCollection();
                    partListInfo = new ArrayCollection();
                    targetListInfo = new ArrayCollection();
                    
                    j5ImportDialog.seqButtonEnable(true);
                    j5ImportDialog.zippedButtonEnable(false);
                    j5ImportDialog.partButtonEnable(false);
                    j5ImportDialog.targetButtonEnable(false);
                    
                    j5ImportDialog.setSeqImportLabel(false);
                    j5ImportDialog.setZippedImportLabel(false);
                    j5ImportDialog.setPartImportLabel(false);
                    j5ImportDialog.setTargetImportLabel(false);
                }
                
                private function onCompleteJ5Import(event:Event):void
                {
                    try {
                        functionMediator.loadJ5Info(seqListInfo, genbankZip, partListInfo, targetListInfo);
                    } catch (error:Error) {
                        Alert.show(error.toString(), "Error Message");
                        //TODO should clear canvas occur here instead of just in FunctionMediator.createPartVOs?
                    }
                    PopUpManager.removePopUp(j5ImportDialog);
                }
                
                private function onJ5ImportDialogCancel(event:Event):void
                {   
                    PopUpManager.removePopUp(j5ImportDialog);
                }
                
                /* EugeneRulesImportDialog Methods **************************/
                
                private function openEugeneRulesImportDialog(event:Event):void
                {
                    var parsedEugeneRules:Object = functionMediator.parseEugeneRules(fileRef.data.toString());
                    var conflictingRulesArray:Array = parsedEugeneRules.conflictingRulesArray;
                    var newRulesArray:Array = parsedEugeneRules.newRulesArray;
                    var ignoredLines:Vector.<String> = parsedEugeneRules.ignoredLines;
                    var repeatedRules:Vector.<String> = parsedEugeneRules.repeatedRules;
                    
                    eugeneImportDialog = new EugeneRulesImportDialog();
                    eugeneImportDialog.parsedEugeneRules = parsedEugeneRules;
                    
                    eugeneImportDialog.addEventListener(EugeneRulesImportDialog.SAVE_EUGENE_RULES, onSaveImportedEugeneRules);
                    eugeneImportDialog.addEventListener(EugeneRulesImportDialog.CANCEL, onEugeneRulesImportDialogCancel);
                    
                    PopUpManager.addPopUp(eugeneImportDialog, ApplicationFacade.getInstance().application, true);
                    PopUpManager.centerPopUp(eugeneImportDialog);
                    
                    // populate dialog text
                    var text:String = "";
                    if (conflictingRulesArray.length > 0) {
                        text += "<font color=\"#EE1122\"><b>Rules with Name Conflicts</b>\n";
                        for (var i:int = 0; i < conflictingRulesArray.length; i++) {
                            var ruleInfo:Object = conflictingRulesArray[i];
                            text += "   " + ruleInfo.text + "\n";
                            text += "      - renaming " + ruleInfo.name + " to " + ruleInfo.newName + "\n";
                            text += "      - conflicts with " + ruleInfo.conflictsWith + "\n";
                        }
                        text += "</font>";
                    }
                    if (newRulesArray.length > 0) {
                        text += "<font color=\"#22A050\"><b>New Rules</b>\n";
                        for (i = 0; i < newRulesArray.length; i++) {
                            text += "   " + newRulesArray[i].text + "\n";
                        }
                        text += "</font>";
                    }
                    if (ignoredLines.length > 0) {
                        text += "<font color=\"#999999\"><b>Ignored Lines</b>\n";
                        for (i = 0; i < ignoredLines.length; i++) {
                            text += "   " + ignoredLines[i] + "\n";
                        }
                        text += "</font>";
                    }
                    if (repeatedRules.length > 0) {
                        text += "<b>Repeated Rules</b>\n";
                        for (i = 0; i < repeatedRules.length; i++) {
                            text += "   " + repeatedRules[i] + "\n";
                        }
                    }
                    
                    eugeneImportDialog.rulesListTextArea.htmlText = text;
                    
                    fileRef = null;
                }
                
                private function onSaveImportedEugeneRules(event:Event):void
                {
                    var parsedEugeneRules:Object = eugeneImportDialog.parsedEugeneRules;
                    var conflictingRulesArray:Array = parsedEugeneRules.conflictingRulesArray;
                    var newRulesArray:Array = parsedEugeneRules.newRulesArray;
                    var ruleInfo:Object;
                    
                    //create new rules
                    for (var i:int = 0; i < newRulesArray.length; i++) {
                        ruleInfo = newRulesArray[i];
                        eugeneRuleProxy.addRule(ruleInfo.name, ruleInfo.negationOperator, ruleInfo.operand1, 
                            ruleInfo.compositionalOperator, ruleInfo.operand2);
                    }
                    //create renamed conflicting rules
                    for (i = 0; i < conflictingRulesArray.length; i++) {
                        ruleInfo = conflictingRulesArray[i];
                        eugeneRuleProxy.addRule(ruleInfo.newName, ruleInfo.negationOperator, ruleInfo.operand1, 
                            ruleInfo.compositionalOperator, ruleInfo.operand2);
                    }
                    
                    //update Eugene rules display for part if part is selected
                    if (ApplicationFacade.getInstance().selectedPartRenderer != null) {
                        sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, ApplicationFacade.getInstance().selectedPartRenderer.part);
                    }
                    
                    PopUpManager.removePopUp(eugeneImportDialog);
                }
                
                private function onEugeneRulesImportDialogCancel(event:Event):void
                {   
                    PopUpManager.removePopUp(eugeneImportDialog);
                }
                
                /* Map from Genbank Methods ********************************/
                
                private function openGenbankFileChooser():void
                {
                    fileRef = new FileReference();
                    fileRef.addEventListener(Event.SELECT, onFileSelect);
                    fileRef.addEventListener(Event.COMPLETE, showPartDefinitionDialog);
                    fileRef.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
                    fileRef.browse([GENBANK_FILE_TYPES, ALL_FILE_TYPES]);
                }
                
                public function showPartDefinitionDialog(event:Event):void
                {
                    partDefinitionDialog = new PartDefinitionDialog();
                    partDefinitionDialog.addEventListener(PartDefinitionDialog.DONE, onCompleteGenbankImport);
                    partDefinitionDialog.addEventListener(PartDefinitionDialog.CANCEL, onPartDefinitionDialogCancel);
                    
                    var partSource:String;
                    
                    //genbank file check
                    var fileText:String = fileRef.data.toString();
                    var genbankLocusCheck:RegExp = /^LOCUS *(\S*)/;
                    var genbankLocusCheckResult:Array = genbankLocusCheck.exec(fileText);
                    if (genbankLocusCheckResult != null && genbankLocusCheckResult.length > 1) {
                        var genbankOriginCheck:RegExp = /ORIGIN/;
                        var genbankOriginCheckResult:Array = genbankOriginCheck.exec(fileText);
                        if (genbankOriginCheckResult == null || genbankOriginCheckResult.length < 1) {
                            Alert.show("Invalid genbank file\nPlease check the formatting of the file", "Error Message");
                            return;
                        }
                        partSource = genbankLocusCheckResult[1];
                    } else {
                        Alert.show("Invalid genbank file\nPlease check the formatting of the file", "Error Message");
                        return;
                    }
                    
                    PopUpManager.addPopUp(partDefinitionDialog, ApplicationFacade.getInstance().application, true);
                    PopUpManager.centerPopUp(partDefinitionDialog);

                    partDefinitionDialog.partNameInput.text = (facade as ApplicationFacade).selectedPartRenderer.part.name;
                    
                    //this just displays the part source - stored part source actually comes from addSequenceFile in onCompleteGenbankImport
                    partDefinitionDialog.partSourceInput.text = partSource;
                    partDefinitionDialog.partSourceInput.enabled = false;
                    
                    partDefinitionDialog.sequence = functionMediator.fileToSequence(fileRef.data.toString());
                    
                    partDefinitionDialog.seqTextArea.text = fileRef.data.toString();
                    
                    var features:ArrayCollection = new ArrayCollection();
                    features.addItem({name:"Whole Sequence", start:1, end:partDefinitionDialog.sequence.length, type:"N/A"});
                    features.addItem({name:"Specified Sequence", start:1, end:partDefinitionDialog.sequence.length, type:"N/A"});
                    partDefinitionDialog.featureNameInput.dataProvider = features;
                    
                    partDefinitionDialog.genbankStartBPInput.value = partDefinitionDialog.featureNameInput.selectedItem.start;
                    partDefinitionDialog.endBPInput.value = partDefinitionDialog.featureNameInput.selectedItem.end;
                    partDefinitionDialog.genbankStartBPInput.enabled = false;
                    partDefinitionDialog.endBPInput.enabled = false;
                }
                
                public function showPartDefinitionEditDialog(event:Event):void
                {
                    partDefinitionDialog = new PartDefinitionDialog();
                    partDefinitionDialog.addEventListener(PartDefinitionDialog.DONE, onCompleteGenbankImport);
                    partDefinitionDialog.addEventListener(PartDefinitionDialog.CANCEL, onPartDefinitionDialogCancel);
                    PopUpManager.addPopUp(partDefinitionDialog, ApplicationFacade.getInstance().application, true);
                    PopUpManager.centerPopUp(partDefinitionDialog);
                    
                    var selectedPartVO:PartVO = (facade as ApplicationFacade).selectedPartRenderer.part.partVO;
                    
                    partDefinitionDialog.partNameInput.text = selectedPartVO.name;
                    partDefinitionDialog.partSourceInput.text = selectedPartVO.sequenceFile.partSource;
                    partDefinitionDialog.partSourceInput.enabled = false;
                    
                    partDefinitionDialog.sequence = functionMediator.fileToSequence(selectedPartVO.sequenceFile.sequenceFileContent.toString());
                    
                    partDefinitionDialog.seqTextArea.text = selectedPartVO.sequenceFile.sequenceFileContent.toString();
                    
                    var features:ArrayCollection = new ArrayCollection();
                    features.addItem({name:"Whole Sequence", start:1, end:partDefinitionDialog.sequence.length, type:"N/A"});
                    features.addItem({name:"Specified Sequence", start:selectedPartVO.genbankStartBP, end:selectedPartVO.endBP, type:"N/A"});
                    partDefinitionDialog.featureNameInput.dataProvider = features;
                    
                    if (selectedPartVO.genbankStartBP == 1 && selectedPartVO.endBP == partDefinitionDialog.sequence.length) {
                        partDefinitionDialog.featureNameInput.selectedIndex = 0; //FIXME: should not hard code (whole sequence)
                        partDefinitionDialog.genbankStartBPInput.enabled = false;
                        partDefinitionDialog.endBPInput.enabled = false;
                    } else {
                        partDefinitionDialog.featureNameInput.selectedIndex = 1; //FIXME: should not hard code (specified sequence)
                        partDefinitionDialog.genbankStartBPInput.enabled = true;
                        partDefinitionDialog.endBPInput.enabled = true;
                    }
                    
                    partDefinitionDialog.genbankStartBPInput.value = partDefinitionDialog.featureNameInput.selectedItem.start;
                    partDefinitionDialog.endBPInput.value = partDefinitionDialog.featureNameInput.selectedItem.end;
                    partDefinitionDialog.reverseComplementCheckBox.selected = selectedPartVO.revComp;
                }
             
                private function onCompleteGenbankImport(event:Event):void
                {	
                    var part:Part = (facade as ApplicationFacade).selectedPartRenderer.part;
                    
                    var partName:String = partDefinitionDialog.partNameInput.text;
                    if (partName == "") {
                        Alert.show("Please choose a name for the part.", "Error Message");
                        return;
                    }
                    if (!functionMediator.isLegalName(partName)) {
                        Alert.show("Illegal name. Name can only contain alphanumeric characters, underscore (_), and hyphen (-).", "Error Message");
                        return;
                    }
                    if (partName != part.name && !partProxy.isUniquePartName(partName)) {
                        Alert.show("Name already exists. Please choose a unique name.", "Error Message");
                        return;
                    }
                    
                    var genbankStartBP:Number = partDefinitionDialog.genbankStartBPInput.value;
                    var endBP:Number = partDefinitionDialog.endBPInput.value;
                    var fullSequence:String = partDefinitionDialog.sequence;
                    var featureName:String = partDefinitionDialog.featureNameInput.selectedItem.name as String;
                                                            
                    if(fileRef != null)  // during genbank import
                    {
                        if(fileRef.data != null)
                        {
                            //FIXME need a selection here for genbank vs. FASTA
                            //FIXME: imports are only genbank at the moment
                            try {
                                part.sequenceFile = sequenceFileProxy.addSequenceFile(Constants.GENBANK, fileRef.data.toString(), fileRef.name);
                            
                                part.name = partName;
                                part.revComp = partDefinitionDialog.reverseComplementCheckBox.selected;
                                
                                part.genbankStartBP = genbankStartBP;
                                part.endBP = endBP;
                                
                                sendNotification(Notifications.NEW_REFRESH_LINKED_PART_RENDERERS, part);
                                sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, part);
                                sendNotification(Notifications.NEW_UPDATE_STATUS_BAR_BASIC, ApplicationFacade.getInstance().selectedPartRenderer);
                                
                                functionMediator.setUpCollection();	
                                
                                mainCanvas.rightCanvas.infoPanel.j5Panel.changePartDefButton.enabled = true;
                            } catch (error:Error) {
                                Alert.show(error.toString(), "Error Message");
                            }
                        }
                        fileRef = null;
                    }
                    else  // during change part definition
                    {
                        part.name = partName;
                        part.revComp = partDefinitionDialog.reverseComplementCheckBox.selected;
                        
                        part.genbankStartBP = genbankStartBP;
                        part.endBP = endBP;
                        
                        sendNotification(Notifications.NEW_REFRESH_LINKED_PART_RENDERERS, part);
                        sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, part);
                        sendNotification(Notifications.NEW_UPDATE_STATUS_BAR_BASIC, ApplicationFacade.getInstance().selectedPartRenderer);
                        
                        functionMediator.setUpCollection();	
                        
                        mainCanvas.rightCanvas.infoPanel.j5Panel.changePartDefButton.enabled = true;
                    }
                    
                    PopUpManager.removePopUp(partDefinitionDialog);
                    
                    sendNotification(Notifications.NEW_SET_FOCUS_ON_SELECTED);
                }
                
                private function onPartDefinitionDialogCancel(event:Event):void
                {
                    PopUpManager.removePopUp(partDefinitionDialog);
                    
                    sendNotification(Notifications.NEW_SET_FOCUS_ON_SELECTED);
                    
                    fileRef = null;
                }
                
                /* Map from Clipboard Methods ******************************/
                
                private function openClipboardPasteDialog():void
                {
                    clipboardPasteDialog = new ClipboardPasteDialog();
                    clipboardPasteDialog.addEventListener(ClipboardPasteDialog.CANCEL, onClipboardPasteDialogCancel);
                    clipboardPasteDialog.addEventListener(ClipboardPasteDialog.DONE, onClipboardPasteDialogDone);
                    PopUpManager.addPopUp(clipboardPasteDialog, ApplicationFacade.getInstance().application, true);
                    PopUpManager.centerPopUp(clipboardPasteDialog);
                }
                
                private function onClipboardPasteDialogCancel(event:Event):void
                {
                    PopUpManager.removePopUp(clipboardPasteDialog);
                    
                    sendNotification(Notifications.NEW_SET_FOCUS_ON_SELECTED);
                }
                
                private function onClipboardPasteDialogDone(event:Event):void
                {
                    PopUpManager.removePopUp(clipboardPasteDialog);
                    
                    // copied from showPartDefinitionDialog
                    partDefinitionDialog = new PartDefinitionDialog();
                    
                    partDefinitionDialog.addEventListener(PartDefinitionDialog.DONE, onCompleteClipboardMap);
                    partDefinitionDialog.addEventListener(PartDefinitionDialog.CANCEL, onPartDefinitionDialogCancel);
                    PopUpManager.addPopUp(partDefinitionDialog, ApplicationFacade.getInstance().application, true);
                    PopUpManager.centerPopUp(partDefinitionDialog);
                    
                    partDefinitionDialog.partNameInput.text = (facade as ApplicationFacade).selectedPartRenderer.part.name;
                    partDefinitionDialog.partSourceInput.text = clipboardPasteDialog.sourceName;
                    if (clipboardPasteDialog.sourceName == "") {
                        partDefinitionDialog.partSourceInput.enabled = true;
                    } else {
                        partDefinitionDialog.partSourceInput.enabled = false;
                    }
                    
                    partDefinitionDialog.sequence = clipboardPasteDialog.sequence;
                    
                    if (clipboardPasteDialog.jbeiSequenceXmlString != null) {
                        partDefinitionDialog.seqTextArea.text = clipboardPasteDialog.jbeiSequenceXmlString;
                    } else {
                        partDefinitionDialog.seqTextArea.text = clipboardPasteDialog.sequence;
                    }
                    
                    var features:ArrayCollection = new ArrayCollection();
                    features.addItem({name:"Whole Sequence", start:1, end:partDefinitionDialog.sequence.length, type:"N/A"});
                    features.addItem({name:"Specified Sequence", start:clipboardPasteDialog.genbankStart, end:clipboardPasteDialog.end, type:"N/A"});
                    partDefinitionDialog.featureNameInput.dataProvider = features;
                    
                    partDefinitionDialog.featureNameInput.selectedIndex = 1;
                    partDefinitionDialog.genbankStartBPInput.enabled = true;
                    partDefinitionDialog.endBPInput.enabled = true;
                    partDefinitionDialog.genbankStartBPInput.value = clipboardPasteDialog.genbankStart;
                    partDefinitionDialog.endBPInput.value = clipboardPasteDialog.end;
                }
                
                private function onCompleteClipboardMap(event:Event):void
                {
                    // copied from onCompleteGenbankImport, this is the map from clipboard version
                    var part:Part = (facade as ApplicationFacade).selectedPartRenderer.part;
                    
                    var partName:String = partDefinitionDialog.partNameInput.text;
                    if (partName == "") {
                        Alert.show("Please choose a name for the part.", "Error Message");
                        return;
                    }
                    if (!functionMediator.isLegalName(partName)) {
                        Alert.show("Illegal name. Name can only contain alphanumeric characters, underscore (_), and hyphen (-).", "Error Message");
                        return;
                    }
                    if (partName != part.name && !partProxy.isUniquePartName(partName)) {
                        Alert.show("Name already exists. Please choose a unique name.", "Error Message");
                        return;
                    }
                    
                    var partSource:String = partDefinitionDialog.partSourceInput.text;
                    if (partSource == "") {
                        Alert.show("Please choose a name for the part source.", "Error Message");
                        return;
                    }
                    if (partDefinitionDialog.partSourceInput.enabled && !functionMediator.isLegalName(partSource)) {
                        Alert.show("Illegal name. Source name can only contain alphanumeric characters, underscore (_), and hyphen (-).", "Error Message");
                        return;
                    }
                    
                    var genbankStartBP:Number = partDefinitionDialog.genbankStartBPInput.value;
                    var endBP:Number = partDefinitionDialog.endBPInput.value;
                    var fullSequence:String = partDefinitionDialog.sequence;
                    var featureName:String = partDefinitionDialog.featureNameInput.selectedItem.name as String;
                    
                    try {
                        if (clipboardPasteDialog.jbeiSequenceXmlString != null) {
                            part.sequenceFile = sequenceFileProxy.addSequenceFile(Constants.JBEI_SEQ, clipboardPasteDialog.jbeiSequenceXmlString, partSource + ".xml");
                        } else {
                            var fastaSequence:String = ">" + partSource + "\n" + fullSequence;  //convert to FASTA
                            part.sequenceFile = sequenceFileProxy.addSequenceFile(Constants.FASTA, fastaSequence, partSource + ".fas");
                        }
                        
                        part.name = partName;
                        part.revComp = partDefinitionDialog.reverseComplementCheckBox.selected;
                        
                        part.genbankStartBP = genbankStartBP;
                        part.endBP = endBP;
                        
                        sendNotification(Notifications.NEW_REFRESH_LINKED_PART_RENDERERS, part);
                        sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, part);
                        sendNotification(Notifications.NEW_UPDATE_STATUS_BAR_BASIC, ApplicationFacade.getInstance().getSelectedRectShape());
                        
                        functionMediator.setUpCollection();	
                        
                        mainCanvas.rightCanvas.infoPanel.j5Panel.changePartDefButton.enabled = true;
                    } catch (error:Error) {
                        Alert.show(error.toString(), "Error Message");
                    }
                    
                    PopUpManager.removePopUp(partDefinitionDialog);
                    
                    sendNotification(Notifications.NEW_SET_FOCUS_ON_SELECTED);
                }
                
                /* File Event Handling *************************************/
                
                private function onFileSelect(event:Event):void
                {
                    fileRef.load();
                }
                
                private function onLoadError(e:IOErrorEvent):void
                {
                    Alert.show("Error loading file : " + e.text, "Error Message");
                    
                    fileRef = null;
                }
                
        }
}
