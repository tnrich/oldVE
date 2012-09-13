package org.jbei.registry.mediators
{
    import flash.events.Event;
    import flash.events.MouseEvent;
    
    import mx.collections.ArrayCollection;
    import mx.controls.Alert;
    import mx.controls.dataGridClasses.DataGridColumn;
    import mx.core.Application;
    import mx.events.CloseEvent;
    import mx.events.ItemClickEvent;
    import mx.managers.PopUpManager;
    
    import org.jbei.registry.ApplicationFacade;
    import org.jbei.registry.Constants;
    import org.jbei.registry.Notifications;
    import org.jbei.registry.SBOLvIcons;
    import org.jbei.registry.commands.FunctionMediator;
    import org.jbei.registry.models.EugeneRule;
    import org.jbei.registry.models.Part;
    import org.jbei.registry.models.PartVO;
    import org.jbei.registry.models.j5.J5Bin;
    import org.jbei.registry.models.j5.J5Collection;
    import org.jbei.registry.proxies.EugeneRuleProxy;
    import org.jbei.registry.proxies.J5CollectionProxy;
    import org.jbei.registry.proxies.PartProxy;
    import org.jbei.registry.view.ui.Colors;
    import org.jbei.registry.view.ui.IPartRenderer;
    import org.jbei.registry.view.ui.canvas.RightCanvas;
    import org.jbei.registry.view.ui.dialogs.EugeneRuleDialog;
    import org.jbei.registry.view.ui.panels.CollectionPanel;
    import org.jbei.registry.view.ui.panels.InfoPanel;
    import org.jbei.registry.view.ui.panels.J5Panel;
    import org.jbei.registry.view.ui.shapes.CollectionShape;
    import org.jbei.registry.view.ui.shapes.RectShape;
    import org.puremvc.as3.interfaces.INotification;
    import org.puremvc.as3.patterns.mediator.Mediator;
    
    public class RightCanvasMediator extends Mediator
    {
        public static const NAME:String = "RightCanvasMediator";
        
        private var rightCanvas:RightCanvas;
        private var j5Panel:J5Panel;
        private var collectionPanel:CollectionPanel;
        
        private var eugeneRuleDialog:EugeneRuleDialog;

        private var partProxy:PartProxy = ApplicationFacade.getInstance().retrieveProxy(PartProxy.NAME) as PartProxy;
        private var eugeneRuleProxy:EugeneRuleProxy = ApplicationFacade.getInstance().retrieveProxy(EugeneRuleProxy.NAME) as EugeneRuleProxy;
        private var j5CollectionProxy:J5CollectionProxy = ApplicationFacade.getInstance().retrieveProxy(J5CollectionProxy.NAME) as J5CollectionProxy;
        
        public function RightCanvasMediator(viewComponent:Object=null)
        {
            super(NAME, viewComponent);
            rightCanvas = viewComponent as RightCanvas;
            j5Panel = rightCanvas.infoPanel.j5Panel;
            collectionPanel = rightCanvas.infoPanel.collectionPanel;
            
            rightCanvas.infoPanel.addEventListener(InfoPanel.COLLECTION_TAB_CLICKED, onCollectionTabClicked);
                
            j5Panel.addEventListener(J5Panel.EDIT_J5_NAME, editJ5Name);
            j5Panel.addEventListener(J5Panel.EDIT_J5_FAS, editJ5FAS);
            j5Panel.addEventListener(J5Panel.ADD_EUGENE_RULE, addEugeneRule);
            j5Panel.addEventListener(J5Panel.DELETE_EUGENE_RULE, deleteEugeneRule);
            
            collectionPanel.circularLinearRadioButtonGroup.addEventListener(ItemClickEvent.ITEM_CLICK, circularLinearRadioButtonChanged);
            collectionPanel.addEventListener(CollectionPanel.SHOW_BIN_ITEMS, showBinItems);
            collectionPanel.addEventListener(CollectionPanel.BIN_NAME_CHANGED, changeBinName);
            collectionPanel.addEventListener(CollectionPanel.UPDATE_DSF_LINES, updateDSFLines);
            collectionPanel.expandBinInfoGridButton.addEventListener(MouseEvent.CLICK, expandBinInfoGridButtonClicked);
            collectionPanel.addBinButton.addEventListener(MouseEvent.CLICK, addBinButtonHandler);
            collectionPanel.removeBinButton.addEventListener(MouseEvent.CLICK, deleteBinButtonHandler);
        }
        
        private function get functionMediator():FunctionMediator
        {
            return ApplicationFacade.getInstance().retrieveMediator(FunctionMediator.NAME) as FunctionMediator;
        }
        
        public override function listNotificationInterests():Array
        {
            return [ //Notifications.NEW_CLEAR_DISPLAY_INFO
                , Notifications.NEW_UPDATE_PART_DISPLAY_INFO
                , Notifications.NEW_UPDATE_COLLECTION_DISPLAY_INFO
            ];
        }
        
        public override function handleNotification(notification:INotification):void
        {
            switch (notification.getName()) {
//                case Notifications.NEW_CLEAR_DISPLAY_INFO:
//                    clearPartDisplay();
//                    clearCollectionDisplay();
//                    break;
                
                case Notifications.NEW_UPDATE_PART_DISPLAY_INFO:
                    var part:Part = notification.getBody() as Part;
                    //Change the focus of the info panel
                    rightCanvas.infoPanel.partFocus();
                    //Display the J5 info
                    displayPartInfo(part);
                    break;
                
                case Notifications.NEW_UPDATE_COLLECTION_DISPLAY_INFO:
                    rightCanvas.infoPanel.collectionFocus();
                    displayCollectionInfo();
                    break;
            }
        }
        
        // Event handlers
        private function onCollectionTabClicked(event:Event):void
        {
            displayCollectionInfo();
        }
        
        private function editJ5Name(event:Event):void
        {
            var partRenderer:IPartRenderer = (facade as ApplicationFacade).selectedPartRenderer;
            
            if (partRenderer == null) {
                Alert.show("No part selected", "Error Message");
                return;
            }
            
            var part:Part = partRenderer.part;
            
            if (j5Panel.partNameInput.text == "") {
                Alert.show("Cannot change name to blank. Please enter a name to change.\nReverting to old name.", "Error Message");
                //guarantees that mapped parts cannot have no name
                j5Panel.partNameInput.text = part.name;
                return;
            }
            
            if (j5Panel.partNameInput.text == part.name) {
                return; //no change was made
            }
            
            if (!functionMediator.isLegalName(j5Panel.partNameInput.text)) {
                Alert.show("Illegal name. Name can only contain alphanumeric characters, underscore (_), and hyphen (-).\nReverting to old name.", "Error Message");
                j5Panel.partNameInput.text = part.name;
                return;
            }
            
            if (!partProxy.isUniquePartName(j5Panel.partNameInput.text)) {
                Alert.show("Name already exists. Please choose a unique name.\nReverting to old name.", "Error Message");
                j5Panel.partNameInput.text = part.name;
                return;
            }
            
            part.name = j5Panel.partNameInput.text;
            sendNotification(Notifications.NEW_REFRESH_LINKED_PART_RENDERERS, part);
            setRuleButtonsAccess(part);
            functionMediator.setUpCollection();
        }
        
        private function editJ5FAS(event:Event):void 
        {
            var partRenderer:IPartRenderer = (facade as ApplicationFacade).selectedPartRenderer;
            
            if(partRenderer == null) {
                Alert.show("No part selected", "Error Message");
                return;
            }
            
            var part:Part = partRenderer.part;
            
            if(part.hasSequence == false)
            {
                displayPartInfo(part);
                Alert.show("Part must have a sequence to add j5 data!", "Error Message");	
            }
            else
            {
                if(j5Panel.fasBox.selectedItem == J5Panel.NO_FAS) {
                    part.fas = "";
                    partRenderer.fasIndicatorVisible = false;
                } else {
                    part.fas = j5Panel.fasBox.selectedItem as String;
                    partRenderer.fasIndicatorVisible = true;
                }
                
                var bin:J5Bin = j5CollectionProxy.getBinAssignment(part);
                if (bin != null) {  // if part is in a bin
                    sendNotification(Notifications.NEW_CHECK_BIN_FAS, bin);
                }
            }
        }
        
        private function addEugeneRule(event:Event):void
        {
            eugeneRuleDialog = new EugeneRuleDialog();
            eugeneRuleDialog.addEventListener(EugeneRuleDialog.SAVE_EUGENE_RULE, saveEugeneRule);
            eugeneRuleDialog.addEventListener(EugeneRuleDialog.CLOSE_EUGENE_RULE_DIALOG, closeEugeneRuleDialog);
            eugeneRuleDialog.titleText = "Add Eugene Rule";
            eugeneRuleDialog.partVO = (facade as ApplicationFacade).selectedPartRenderer.part.partVO;
            PopUpManager.addPopUp(eugeneRuleDialog, ApplicationFacade.getInstance().application, true);
            PopUpManager.centerPopUp(eugeneRuleDialog);
        }
        
        private function deleteEugeneRule(event:Event):void
        {
            var selectedRule:EugeneRule = j5Panel.eugeneRulesDataGrid.selectedItem as EugeneRule;
            if (selectedRule == null) {
                Alert.show("No rule selected for deletion.", "Warning messgae");
            } else {
                Alert.show("Are you sure you want to delete this Eugene rule?", "Delete Rule", 
                    Alert.OK | Alert.CANCEL, null, deleteEugeneRuleConfirmed, null, Alert.OK);
            }
        }
        
        private function deleteEugeneRuleConfirmed(event:CloseEvent):void
        {
            if (event.detail == Alert.OK) {
                var selectedRule:EugeneRule = j5Panel.eugeneRulesDataGrid.selectedItem as EugeneRule;
                eugeneRuleProxy.deleteItem(selectedRule);
                j5Panel.eugeneRulesDataGrid.dataProvider.removeItemAt(j5Panel.eugeneRulesDataGrid.dataProvider.getItemIndex(selectedRule));
            }
        }
        
        private function saveEugeneRule(event:Event):void
        {
            try {
                var operator:String = eugeneRuleDialog.operatorComboBox.selectedItem as String;
                var negationOperator:Boolean;
                var compositionalOperator:String;
                if (operator.substr(0,4) == "NOT ") {
                    negationOperator = true;
                    compositionalOperator = operator.substr(4);
                } else {
                    negationOperator = false;
                    compositionalOperator = operator;
                }
                
                var operand2:*;
                if (compositionalOperator == EugeneRule.MORETHAN) {
                    operand2 = eugeneRuleDialog.operand2NumericStepper.value;
                } else {
                    operand2 = eugeneRuleDialog.operand2ComboBox.selectedItem;
                }
                
                var newEugeneRule:EugeneRule = eugeneRuleProxy.addRule(
                    eugeneRuleDialog.nameTextInput.text, negationOperator, 
                    eugeneRuleDialog.partVO, compositionalOperator, operand2);
                j5Panel.eugeneRulesDataGrid.dataProvider.addItem(newEugeneRule);

                closeEugeneRuleDialog(event);
            } catch (error:Error) {
                Alert.show(error.toString(), "Error Message");
            }
        }
        
        private function closeEugeneRuleDialog(event:Event):void
        {
            PopUpManager.removePopUp(eugeneRuleDialog);
        }
        
        private function circularLinearRadioButtonChanged(event:ItemClickEvent):void
        {
            //TODO convert to grid view
//            var centerCanvasMediator:CenterCanvasMediator = facade.retrieveMediator(CenterCanvasMediator.NAME) as CenterCanvasMediator;
            
            //update model and appearnace of collection shape
            if (event.item == Constants.LINEAR) {
                j5CollectionProxy.setCollectionCircular(false);
//                centerCanvasMediator.collectionShape.toggleRoundedCorners(false);
            } else if (event.item == Constants.CIRCULAR) {
                j5CollectionProxy.setCollectionCircular(true);
//                centerCanvasMediator.collectionShape.toggleRoundedCorners(true);
            }
        }
        
        private function showBinItems(event:Event):void
        {
            var binContentsText:String = "";
            var binIndex:int = collectionPanel.binInfoGrid.selectedIndex;
            var bin:J5Bin = j5CollectionProxy.j5Collection.binsVector[binIndex];
            
            for(var index:int = 0; index < bin.binItemsVector.length; index++)
            {
                var part:Part = bin.binItemsVector[index];
                
                if (!part.isEmpty()) {
                    if (part.name != "") {
                        binContentsText += part.name + " " + part.fas + "\n";
                    } else {
                        binContentsText += "Un-named Shape " + index + " \n";
                    }
                }
            }
            
            if (binContentsText == "") {
                binContentsText = "Nothing in Bin!";
            }

            collectionPanel.binContents.text = binContentsText;
        }
        
        private function changeBinName(event:Event):void
        {
            sendNotification(Notifications.NEW_UPDATE_BIN_NAME, collectionPanel.binInfoGrid.selectedIndex);
        }
        
        private function updateDSFLines(event:Event):void
        {
            sendNotification(Notifications.NEW_UPDATE_DSF_LINES);
        }
        
        private function expandBinInfoGridButtonClicked(event:MouseEvent):void
        {
            if (collectionPanel.expandBinInfoGridButton.label == "Collapse Table") {
                rightCanvas.percentWidth = 20;
                
                var oldPolicy:String = collectionPanel.binInfoGrid.horizontalScrollPolicy;
                collectionPanel.binInfoGrid.horizontalScrollPolicy = "on";
                collectionPanel.dsfColumn.visible = false;
                collectionPanel.dsfColumn.width = 0;
                collectionPanel.froColumn.visible = false;
                collectionPanel.froColumn.width = 0;
                collectionPanel.extra5PrimeBpsColumn.visible = false;
                collectionPanel.froColumn.width = 0;
                collectionPanel.extra3PrimeBpsColumn.visible = false;
                collectionPanel.froColumn.width = 0;
                collectionPanel.binInfoGrid.horizontalScrollPolicy = oldPolicy;
                
                collectionPanel.expandBinInfoGridButton.label = "Expand Table";
                
                collectionPanel.abbreviationsText.htmlText = "<u>Abbreviations</u><br/><b>FAS</b>: Forced Assembly Strategy";
            } else {
                rightCanvas.width = 550;
                collectionPanel.dsfColumn.visible = true;
                collectionPanel.froColumn.visible = true;
                collectionPanel.extra5PrimeBpsColumn.visible = true;
                collectionPanel.extra3PrimeBpsColumn.visible = true;
                
                oldPolicy = collectionPanel.binInfoGrid.horizontalScrollPolicy;
                collectionPanel.binInfoGrid.horizontalScrollPolicy = "on";
                var columnWidth:Number = collectionPanel.binInfoGrid.width / collectionPanel.binInfoGrid.columnCount;
                for each (var column:DataGridColumn in collectionPanel.binInfoGrid.columns) {
                    column.width = columnWidth;
                }
                collectionPanel.binInfoGrid.horizontalScrollPolicy = oldPolicy;
                
                collectionPanel.expandBinInfoGridButton.label = "Collapse Table";
                
                collectionPanel.abbreviationsText.htmlText = "<u>Abbreviations</u><br/><b>FAS</b>: Forced Assembly Strategy<br/>" +
                    "<b>DSF</b>: Direct Synthesis Firewall<br/><b>FRO</b>: Forced Relative Overhang<br/>" +
                    "<b>5' Ex</b>: 5' Extra CPEC overhang bps<br/><b>3' Ex</b>: 3' Extra CPEC overhang bps";
            }
        }
        
        private function addBinButtonHandler(event:MouseEvent):void
        {
            var allBins:Vector.<J5Bin> = j5CollectionProxy.j5Collection.binsVector;
            var binName:String;
            var defaultNamePrefix:String = "No_Name";
            var defaultNameRegex:RegExp = /^No_Name(\d+)$/;
            var regexResult:Array;
            var highestDefaultNameIndex:int = 0;
            
            for (var i:int = 0; i < allBins.length; i++) {
                binName = allBins[i].binName;
                regexResult = defaultNameRegex.exec(binName);
                if (regexResult != null && regexResult.length > 0) {
                    if (regexResult[1] > highestDefaultNameIndex) {
                        highestDefaultNameIndex = regexResult[1];
                    }
                }
            }
            
            j5CollectionProxy.addBin(defaultNamePrefix + (highestDefaultNameIndex + 1), collectionPanel.binInfoGrid.selectedIndex);
            functionMediator.setUpCollection();
            displayCollectionInfo();
        }
        
        private function deleteBinButtonHandler(event:MouseEvent):void
        {
            if (j5CollectionProxy.j5Collection.binCount() <= 1) {
                Alert.show("Cannot remove any more bins.", "Warning Message");
                return;
            }
            
            j5CollectionProxy.deleteBin(collectionPanel.binInfoGrid.selectedIndex);
            sendNotification(Notifications.NEW_BIN_DELETED, collectionPanel.binInfoGrid.selectedIndex);
            functionMediator.setUpCollection();
            displayCollectionInfo();
        }
        
        // Private methods
        private function displayPartInfo(part:Part):void
        {
            if(j5Panel.initialized != false)
            {
                if (part == null) {
                    clearPartDisplay();
                    return;
                }
                
                j5Panel.partNameInput.text = part.name;
                if (part.sequenceFile == null) {
                    j5Panel.partSourceValueLabel.text = "";
                    j5Panel.reverseComplementValueLabel.text = "";
                    j5Panel.changePartDefButton.enabled = false;
                } else {
                    j5Panel.partSourceValueLabel.text = part.sequenceFile.partSource;
                    j5Panel.reverseComplementValueLabel.text = part.revComp.toString().toUpperCase();
                    j5Panel.changePartDefButton.enabled = true;
                }
                if (part.genbankStartBP < 1) {
                    j5Panel.genbankStartBPValueLabel.text = "";
                } else {
                    j5Panel.genbankStartBPValueLabel.text = part.genbankStartBP.toString();
                }
                if (part.endBP < 1) {
                    j5Panel.endBPValueLabel.text = "";
                } else {
                    j5Panel.endBPValueLabel.text = part.endBP.toString();
                }
                j5Panel.fasBox.selectedIndex = fasIndex(part.fas);	
                
                //copy rules for part into an ArrayCollection in order to use as a dataProvider
                var eugeneRulesVector:Vector.<EugeneRule> = eugeneRuleProxy.getRulesByPartVO(part.partVO);
                var eugeneRulesArrayCollection:ArrayCollection = new ArrayCollection();
                for (var i:int = 0; i < eugeneRulesVector.length; i++) {
                    eugeneRulesArrayCollection.addItem(eugeneRulesVector[i]);
                }
                j5Panel.eugeneRulesDataGrid.dataProvider = eugeneRulesArrayCollection;
                //TODO: sort?
                
                setJ5PanelPermissions(part);
            }		
        }
        
        private function fasIndex(s:String):int
        {
            var i:int;
            var array:ArrayCollection = j5Panel.fasBox.dataProvider as ArrayCollection;
            for(i=0; i<array.length; i++)
            {		
                if(array[i] as String == s)
                    return i;
            }
            return 0;
        }
        
        private function clearPartDisplay():void
        {
            if(j5Panel.initialized != false)
            {
                j5Panel.partNameInput.text = "";
                j5Panel.partSourceValueLabel.text = "";
                j5Panel.reverseComplementValueLabel.text = "";
                j5Panel.genbankStartBPValueLabel.text = "";
                j5Panel.endBPValueLabel.text = "";
                j5Panel.fasBox.selectedIndex = 0;
                
                j5Panel.eugeneRulesDataGrid.dataProvider = null;
                
                j5Panel.mapWarningLabel.visible = false;
                j5Panel.partNameInput.enabled = false;
                j5Panel.partNameSaveButton.enabled = false;
                j5Panel.changePartDefButton.enabled = false;
                j5Panel.fasBox.enabled = false;
                j5Panel.addRuleButton.enabled = false;
                j5Panel.deleteRuleButton.enabled = false;
            }			
        }
        
        private function setJ5PanelPermissions(part:Part):void
        {
            if(j5Panel.initialized != false)
            {
                if (part != null && part.hasSequence)
                {
                    j5Panel.mapWarningLabel.visible = false;
                    j5Panel.partNameInput.enabled = true;
                    j5Panel.partNameSaveButton.enabled = true
                    j5Panel.fasBox.enabled = true;	
                }
                    
                else
                {
                    j5Panel.mapWarningLabel.text = "Map icon to a sequence to edit!";
                    j5Panel.mapWarningLabel.visible = true;
                    j5Panel.partNameInput.enabled = true;
                    j5Panel.partNameSaveButton.enabled = true
                    j5Panel.fasBox.enabled = false;
                }
                
                setRuleButtonsAccess(part);
            }
        }
        
        private function setRuleButtonsAccess(part:Part):void
        {
            if (part == null || part.name == "") {
                j5Panel.addRuleButton.enabled = false;
                j5Panel.deleteRuleButton.enabled = false;
            } else {
                j5Panel.addRuleButton.enabled = true;
                j5Panel.deleteRuleButton.enabled = true;
            }
        }
        
        private function displayCollectionInfo():void
        {
            var collection:J5Collection = j5CollectionProxy.j5Collection;
            
            if (collection == null) {
                clearCollectionDisplay();
                return;
            }
            
            collectionPanel.binInfoGrid.enabled = true;
            collectionPanel.addBinButton.enabled = true;
            collectionPanel.removeBinButton.enabled = true;                

            j5Ready(collection);
            combinatorial(collection);
            if (collection.isCircular) {
                collectionPanel.circularRadioButton.selected = true;
            } else {
                collectionPanel.linearRadioButton.selected = true;
            }
            
            var i:int;
            var dataProvider:ArrayCollection = new ArrayCollection();
            for(i=0; i< collection.binCount(); i++)
            { 	
                var bin:J5Bin = collection.binsVector[i];
                
                var direction:String = bin.directionForward ? "forward" : "reverse";
                
                var itemCount:int = 0;
                for (var j:int = 0; j < bin.binItemsVector.length; j++) {
                    if (!bin.binItemsVector[j].isEmpty()) {
                        itemCount++;
                    }
                }
                
                var froValue:String = "";
                if (bin.fro != null) {
                    froValue = bin.fro.toString();
                }
                
                var fasValue:String = "";
                if (bin.fas == "Embed_in_primer_reverse") {
                    fasValue = "Reverse Primer";
                } else if (bin.fas == "Embed_in_primer_forward") {
                    fasValue = "Forward Primer";
                } else {
                    fasValue = bin.fas;
                }
                
                var extra5PrimeBpsValue:String = "";
                if (bin.extra5PrimeBps != null) {
                    extra5PrimeBpsValue = bin.extra5PrimeBps.toString();
                }
                
                var extra3PrimeBpsValue:String = "";
                if (bin.extra3PrimeBps != null) {
                    extra3PrimeBpsValue = bin.extra3PrimeBps.toString();
                }
                
                dataProvider.addItem({name:bin.binName, direction:direction, itemCount:itemCount.toString(), dsf:bin.dsf.toString(), 
                    fro:froValue, fas:fasValue, extra5PrimeBps: extra5PrimeBpsValue, extra3PrimeBps: extra3PrimeBpsValue});
            }
            collectionPanel.binInfoGrid.dataProvider = dataProvider;
            
            collectionPanel.binContents.text = "";
            
            collectionPanel.collection = collection;
        }
        
        //Set the j5Ready label text and color
        private function j5Ready(collection:J5Collection):void
        {
            if(collection.j5Ready)
            {
                collectionPanel.j5ReadyText.text = "True";
                collectionPanel.j5ReadyText.setStyle("color", Colors.COLLECTION_GREEN);
            }
            else
            {
                collectionPanel.j5ReadyText.text = "False";
                collectionPanel.j5ReadyText.setStyle("color", Colors.RED);
            }
        }
        
        //Set the combinatorial label text and color
        private function combinatorial(collection:J5Collection):void
        {
            if(collection.combinatorial)
            {
                collectionPanel.combinatorialText.text = "True";
                collectionPanel.combinatorialText.setStyle("color", Colors.COMBIN_PURPLE);
            }
            else
            {
                collectionPanel.combinatorialText.text = "False";
                collectionPanel.combinatorialText.setStyle("color", Colors.COLLECTION_BLUE);
            }
        }
        
        private function clearCollectionDisplay():void
        {
            collectionPanel.binInfoGrid.dataProvider = null;
            if(collectionPanel.binContents != null)
                collectionPanel.binContents.text = "";
            
            collectionPanel.j5ReadyText.text = "";
            collectionPanel.combinatorialText.text = "";
            collectionPanel.binInfoGrid.enabled = false;
            collectionPanel.addBinButton.enabled = false;
            collectionPanel.removeBinButton.enabled = false;
        }
    }
}