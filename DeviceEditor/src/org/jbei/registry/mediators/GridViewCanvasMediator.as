package org.jbei.registry.mediators
{
    import flash.desktop.Clipboard;
    import flash.display.Graphics;
    import flash.events.ContextMenuEvent;
    import flash.events.Event;
    import flash.events.KeyboardEvent;
    import flash.events.MouseEvent;
    import flash.ui.ContextMenu;
    import flash.ui.Keyboard;
    
    import mx.controls.Alert;
    import mx.controls.Button;
    import mx.controls.Image;
    import mx.events.ListEvent;
    import mx.managers.PopUpManager;
    
    import org.jbei.registry.ApplicationFacade;
    import org.jbei.registry.Constants;
    import org.jbei.registry.Notifications;
    import org.jbei.registry.SBOLvIcons;
    import org.jbei.registry.commands.FunctionMediator;
    import org.jbei.registry.models.EugeneRule;
    import org.jbei.registry.models.Part;
    import org.jbei.registry.models.PartVO;
    import org.jbei.registry.models.SequenceFile;
    import org.jbei.registry.models.j5.J5Bin;
    import org.jbei.registry.proxies.EugeneRuleProxy;
    import org.jbei.registry.proxies.J5CollectionProxy;
    import org.jbei.registry.proxies.PartProxy;
    import org.jbei.registry.proxies.SequenceFileProxy;
    import org.jbei.registry.view.ui.Colors;
    import org.jbei.registry.view.ui.IPartRenderer;
    import org.jbei.registry.view.ui.dialogs.ChangeIconDialog;
    import org.jbei.registry.view.ui.dialogs.PasteDialog;
    import org.jbei.registry.view.ui.gridViewClasses.CellRenderer;
    import org.jbei.registry.view.ui.gridViewClasses.GridViewCanvas;
    import org.jbei.registry.view.ui.gridViewClasses.HeaderRenderer;
    import org.puremvc.as3.interfaces.INotification;
    import org.puremvc.as3.patterns.mediator.Mediator;
    
    /**
     * @author Joanna Chen
     */
    public class GridViewCanvasMediator extends Mediator
    {
        public static const NAME:String = "GridViewCanvasMediator";
        
        public static const INIT_NUM_COLUMNS:int = 1;
        public static const INIT_NUM_ROWS:int = 2;
        
        private var gridViewCanvas:GridViewCanvas;
        
        private var changeIconDialog:ChangeIconDialog;
        private var changeIconBinIndex:int;
        
        private var pasteDialog:PasteDialog;
        private var clipboardPart:Part;
        private var isCut:Boolean;
        private var cutCellRenderer:CellRenderer;
        
        private var headerVector:Vector.<HeaderRenderer>;
        private var cellsTable:Vector.<Vector.<CellRenderer>>; //outer is column, inner is row
        private var numRows:int;
        
        private var partProxy:PartProxy = ApplicationFacade.getInstance().retrieveProxy(PartProxy.NAME) as PartProxy;
        private var j5CollectionProxy:J5CollectionProxy = ApplicationFacade.getInstance().retrieveProxy(J5CollectionProxy.NAME) as J5CollectionProxy;
        private var sequenceFileProxy:SequenceFileProxy = ApplicationFacade.getInstance().retrieveProxy(SequenceFileProxy.NAME) as SequenceFileProxy;
        private var eugeneRuleProxy:EugeneRuleProxy = ApplicationFacade.getInstance().retrieveProxy(EugeneRuleProxy.NAME) as EugeneRuleProxy

        public function GridViewCanvasMediator(viewComponent:GridViewCanvas)
        {
            super(NAME, viewComponent);
            gridViewCanvas = viewComponent as GridViewCanvas;
            
            gridViewCanvas.addEventListener(MouseEvent.CLICK, onCanvasClick);

            //add context menu for catching right clicks
            gridViewCanvas.contextMenu = new ContextMenu();
            gridViewCanvas.contextMenu.hideBuiltInItems();
            gridViewCanvas.contextMenu.addEventListener(ContextMenuEvent.MENU_SELECT, onCanvasClick);
            
            CellRenderer.MAP_GENBANK_MENU_ITEM.addEventListener(ContextMenuEvent.MENU_ITEM_SELECT, onMapGenbankMenuItemSelect);
            CellRenderer.MAP_CLIPBOARD_MENU_ITEM.addEventListener(ContextMenuEvent.MENU_ITEM_SELECT, onMapClipboardMenuItemSelect);
        }
        
        public function get functionMediator():FunctionMediator
        {
            return ApplicationFacade.getInstance().retrieveMediator(FunctionMediator.NAME) as FunctionMediator;
        }
        
        public override function listNotificationInterests():Array
        {
            return [
                Notifications.NEW_MEDIATORS_REGISTERED
                
                , Notifications.NEW_REFRESH_LINKED_PART_RENDERERS
                , Notifications.NEW_REFRESH_ALL_PART_RENDERERS
                
                , Notifications.NEW_EUGENE_RULE_ADDED_DELETED
                
                , Notifications.NEW_CLEAR_DESIGN
                
                , Notifications.NEW_BIN_ADDED
                , Notifications.NEW_BIN_DELETED
                
                , Notifications.NEW_UPDATE_BIN_NAME
                , Notifications.NEW_UPDATE_DSF_LINES
                
                , Notifications.NEW_CUT
                , Notifications.NEW_COPY
                , Notifications.NEW_PASTE
                , Notifications.NEW_CLEAR
                
                , Notifications.NEW_SET_FOCUS_ON_SELECTED
            ];
        }
        
        public override function handleNotification(notification:INotification):void
        {
            switch (notification.getName())
            {
                case Notifications.NEW_MEDIATORS_REGISTERED:
                    createInitialGrid();
                    break;
                
                case Notifications.NEW_REFRESH_LINKED_PART_RENDERERS:
                    var part:Part = notification.getBody() as Part;
                    var linkedCellRenderers:Vector.<CellRenderer> = findLinkedCellRenderers(part.partVO);

                    //set border color
                    var color:uint;
                    if (part.hasSequence == false) {
                        color = Colors.UNMAPPED_RED;
                    } else if (linkedCellRenderers.length > 1) {
                        color = Colors.RESTRICTED_BLUE;
                    } else {
                        color = Colors.MAPPED_GREY;
                    }
                    
                    for (var i:int = 0; i < linkedCellRenderers.length; i++) {
                        linkedCellRenderers[i].borderColor = color;
                        linkedCellRenderers[i].updateLabel();
                    }
                    break;
                
                case Notifications.NEW_REFRESH_ALL_PART_RENDERERS:
                    for (var c:int = 0; c < cellsTable.length; c++) {
                        for (var r:int = 0; r < cellsTable[c].length; r++) {
                            part = cellsTable[c][r].part;
                            if (part != null && !part.isEmpty()) {
                                if (part.hasSequence == false) {
                                    cellsTable[c][r].borderColor = Colors.UNMAPPED_RED;
                                } else if (findLinkedCellRenderers(part.partVO).length > 1) { // if part has multiple copies
                                    cellsTable[c][r].borderColor = Colors.RESTRICTED_BLUE;
                                } else {
                                    cellsTable[c][r].borderColor = Colors.MAPPED_GREY;
                                }
                            }
                        }
                    }
                    break;
                
                case Notifications.NEW_EUGENE_RULE_ADDED_DELETED:
                    var affectedEugeneRule:EugeneRule = notification.getBody() as EugeneRule;
                    var hasEugeneRules:Boolean;
                    
                    if (affectedEugeneRule != null) {
                        //refresh affected cellRenderers (those associated with the operands of the affectedEugeneRule)
                        hasEugeneRules = eugeneRuleProxy.getRulesByPartVO(affectedEugeneRule.operand1).length > 0 ? true : false;
                        linkedCellRenderers = findLinkedCellRenderers(affectedEugeneRule.operand1);
                        for (var j:int = 0; j < linkedCellRenderers.length; j++) {
                            linkedCellRenderers[j].eugeneIndicatorVisible = hasEugeneRules;
                        }
                        
                        if (affectedEugeneRule.operand2 is PartVO) {
                            hasEugeneRules = eugeneRuleProxy.getRulesByPartVO(affectedEugeneRule.operand2).length > 0 ? true : false;
                            linkedCellRenderers = findLinkedCellRenderers(affectedEugeneRule.operand2);
                            for (j = 0; j < linkedCellRenderers.length; j++) {
                                linkedCellRenderers[j].eugeneIndicatorVisible = hasEugeneRules;
                            }
                        }
                    }/* else { //no affected eugeneRules specified (probably a delete all), so refresh all cellRenderers
                        for (i = 0; i < rectShapes.length; i++) {
                            hasEugeneRules = eugeneRuleProxy.getRulesByPartVO(rectShapes[i].part.partVO).length > 0 ? true : false;
                            rectShapes[i].eugeneRuleIndicator.visible = hasEugeneRules;
                        }
                    } */ //TODO: write a separate notification for clear all if needed outside of clear design
                    break;
                
                case Notifications.NEW_CLEAR_DESIGN:
                    //clear canvas
                    gridViewCanvas.gridHeaderCanvas.removeAllChildren();
                    gridViewCanvas.gridCellsCanvas.removeAllChildren();
                    gridViewCanvas.partHoldingArea.removeAllChildren();
                    
                    //clear proxies
                    partProxy.deleteAllItems();
                    j5CollectionProxy.deleteItem();
                    
                    //reset initial grid
                    createInitialGrid();
                    
                    sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, null);
                    sendNotification(Notifications.NEW_UPDATE_COLLECTION_DISPLAY_INFO);
                    break;
                
                case Notifications.NEW_BIN_ADDED:
                    var index:int = int(notification.getBody());
                    if (index == -1) { //add at end
                        index = cellsTable.length;
                    }
                    
                    addColumn(index);
                    
                    //TODO: fas check if first bin added, check combinatorial/j5ready
                    
                    break;
                
                case Notifications.NEW_BIN_DELETED:
                    index = int(notification.getBody());
                    if (index == -1) { //remove at end
                        index = cellsTable.length - 1;
                    }
                    
                    removeColumn(index);
                    
                    //TODO: fas check on first bin, check combinatorial/j5ready
                    
                    break;
                
                case Notifications.NEW_UPDATE_BIN_NAME:
                    var binIndex:int = notification.getBody() as int;
                    headerVector[binIndex].updateBinName(j5CollectionProxy.j5Collection.binsVector[binIndex].binName);
                    break;
                
                case Notifications.NEW_UPDATE_DSF_LINES:
                    redrawHeader();
                    redrawGrid();
                    break;
                
                case Notifications.NEW_CUT:
                    cut();
                    break;
                
                case Notifications.NEW_COPY:
                    copy();
                    break;
                
                case Notifications.NEW_PASTE:
                    paste();
                    break;
                
                case Notifications.NEW_CLEAR:
                    clear();
                    break;
                
                case Notifications.NEW_SET_FOCUS_ON_SELECTED:
                    var selectedCellRenderer:CellRenderer = (facade as ApplicationFacade).selectedPartRenderer as CellRenderer;
                    if (selectedCellRenderer != null) {
                        selectedCellRenderer.setFocus();
                    } else {
                        gridViewCanvas.setFocus();
                    }
                    break;
            }
        }
        
        public function addPart(part:Part, column:int, row:int):void
        {
            if (cellsTable[column][row].part != null && !cellsTable[column][row].part.isEmpty()) {
                Alert.show("Oops, something went wrong.  There is already a part in column " + column + 
                    " row " + row + " (zero-indexed).  Cannot add part.", "Error Message");
                //NOTE: the part may still be added to a bin even if adding it to to the view goes wrong
                return;
            }
            
            if (cellsTable[column][row].part != null) {
                //delete existing empty part from proxy and bin
                j5CollectionProxy.removeFromBin(cellsTable[column][row].part, column);
                partProxy.deleteItem(cellsTable[column][row].part)
            }
            
            cellsTable[column][row].part = part;
            cellsTable[column][row].updateLabel();
            //TODO: set border color ...is this needed?
            
            if (eugeneRuleProxy.getRulesByPartVO(part.partVO).length > 0) {
                cellsTable[column][row].eugeneIndicatorVisible = true;
            } else {
                cellsTable[column][row].eugeneIndicatorVisible = false;
            }
            
            if (part.fas != "") {
                cellsTable[column][row].fasIndicatorVisible = true;
            } else {
                cellsTable[column][row].fasIndicatorVisible = false;
            }
        }
        
        public function addRows(numToAdd:int):void
        {
            if (numToAdd <= 0) {
                return;
            }
            
            for (var c:int = 0; c < cellsTable.length; c++) { //for each column
                for (var r:int = 0; r < numToAdd; r++) { //for each row to add
                    var cellRenderer:CellRenderer = createCellRenderer(c, numRows + r);
                    gridViewCanvas.gridCellsCanvas.addChild(cellRenderer);
                    cellsTable[c].push(cellRenderer);
                }
            }
            
            numRows += numToAdd;
            
            redrawGrid();
        }
        
        public function getColumnContents(columnNumber:int):Vector.<Part>
        {
            var columnParts:Vector.<Part> = new Vector.<Part>;
            var column:Vector.<CellRenderer> = cellsTable[columnNumber];
            
            for (var i:int = 0; i < column.length; i++) {
                columnParts.push(column[i].part);
            }
            
            return columnParts;
        }
        
        public function loadToPartHoldingArea(part:Part):void
        {
            var cellRenderer:CellRenderer = createCellRenderer(-1, -1);
            gridViewCanvas.partHoldingArea.addChild(cellRenderer);
            
            cellRenderer.part = part;
            
            if (eugeneRuleProxy.getRulesByPartVO(part.partVO).length > 0) {
                cellRenderer.eugeneIndicatorVisible = true;
            } else {
                cellRenderer.eugeneIndicatorVisible = false;
            }
            
            if (part.fas != "") {
                cellRenderer.fasIndicatorVisible = true;
            } else {
                cellRenderer.fasIndicatorVisible = false;
            }
            
            sendNotification(Notifications.NEW_REFRESH_LINKED_PART_RENDERERS, part); //set border color and update label
        }
        
        /** 
         * Moves the part specified to the part holding area.  This does NOT 
         * remove the part from the j5Bin it was in. This also will NOT 
         * trigger a bin FAS check, since it is used by the digest rule to 
         * move violating parts out of the bin. 
         * 
         * @param part  the part to move to the part holding area
         */
        public function movePartToHoldingArea(part:Part):void
        {
            var cellRenderer:CellRenderer = findCellRenderer(part);
            var column:int = cellRenderer.column;
            var row:int = cellRenderer.row;
            
            //remove from grid area
            gridViewCanvas.gridCellsCanvas.removeChild(cellRenderer);
            cellRenderer.column = -1;
            cellRenderer.row = -1;
            cellRenderer.fasConflict = false;
            
            //add to holding area
            gridViewCanvas.partHoldingArea.addChild(cellRenderer);
            
            //replace with a new cellRenderer
            var newCellRenderer:CellRenderer = createCellRenderer(column, row);
            gridViewCanvas.gridCellsCanvas.addChild(newCellRenderer);
            cellsTable[column].splice(row, 1, newCellRenderer);
        }
        
        public function refreshHeaderGraphics():void
        {
            for (var i:int = 0; i < headerVector.length; i++) {
                var bin:J5Bin = j5CollectionProxy.j5Collection.binsVector[i];
                headerVector[i].directionForward = bin.directionForward;
                headerVector[i].iconID = bin.iconID;
            }
        }
        
        /** 
         * Removes the part specified from the cellRenderer it was in.  This
         * does NOT remove the part from the partProxy or the j5Bin it was in. 
         * This also will NOT trigger a bin FAS check, since it is used by the
         * digest rule to move violating parts out of the bin. 
         * 
         * @param part  the part to remove from its cellRenderer
         */
        public function removePart(part:Part):void
        {
            var cellRenderer:CellRenderer = findCellRenderer(part);
            
            //unselect cell if selected
            if (cellRenderer.selected) {
                (facade as ApplicationFacade).selectedPartRenderer = null;
                cellRenderer.selected = false;
                updateLinkedSelected(null);
                sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, null);
            }
            
            //remove part from cell renderer
            cellRenderer.part = null;
            cellRenderer.updateLabel();
            cellRenderer.eugeneIndicatorVisible = false;
            cellRenderer.fasIndicatorVisible = false;
            
            //reset border colors of linked parts
            sendNotification(Notifications.NEW_REFRESH_LINKED_PART_RENDERERS, part);
        }
        
        public function updateFasIndicatorColor(bin:J5Bin):void
        {
            var binIndex:int = j5CollectionProxy.getBinIndex(bin);
            
            for (var row:int = 0; row < cellsTable[binIndex].length; row++) {
                var cellRenderer:CellRenderer = cellsTable[binIndex][row];
                if (cellRenderer.part != null && !cellRenderer.part.isEmpty() //if there is a non-empty part
                        && cellRenderer.part.fas != "") { //if part has a FAS, i.e. if the FAS indicator is on
                    if (cellRenderer.part.fas == bin.fas) {
                        cellRenderer.fasConflict = false;
                    } else {
                        cellRenderer.fasConflict = true;
                    }
                }
            }
        }
        
        //Private Methods
        private function createInitialGrid():void
        {
            numRows = INIT_NUM_ROWS;
            
            //initialize cellsTable
            headerVector = new Vector.<HeaderRenderer>();
            cellsTable = new Vector.<Vector.<CellRenderer>>();
            
            //create collection 
            j5CollectionProxy.createCollection(INIT_NUM_COLUMNS);
            sendNotification(Notifications.NEW_UPDATE_COLLECTION_DISPLAY_INFO);
        }
        
        private function addColumn(index:int):void
        {
            var cellRenderer:CellRenderer;
            var headerRenderer:HeaderRenderer;
            
            //move cell renderers to make room for new column, if needed
            for (var c:int = index; c < cellsTable.length; c++) {
                for (var r:int = 0; r < cellsTable[c].length; r++) {
                    cellRenderer = cellsTable[c][r];
                    cellRenderer.column++;
                    cellRenderer.x = cellRenderer.column * CellRenderer.WIDTH;
                }
            }
            
            //move header items to make room for new column, if needed
            for (c = index; c < headerVector.length; c++) {
                headerRenderer = headerVector[c];
                headerRenderer.column++;
                headerRenderer.x = headerRenderer.column * CellRenderer.WIDTH;
            }
            
            //add cells
            cellsTable.splice(index, 0, new Vector.<CellRenderer>());
            for (var row:int = 0; row < numRows; row++) {
                cellRenderer = createCellRenderer(index,row);
                gridViewCanvas.gridCellsCanvas.addChild(cellRenderer);
                cellsTable[index].push(cellRenderer);
            }
            
            //add header
            headerRenderer = createHeaderRenderer(index);
            headerVector.splice(index, 0, headerRenderer);
            gridViewCanvas.gridHeaderCanvas.addChild(headerRenderer);
            headerRenderer.updateBinName(j5CollectionProxy.j5Collection.binsVector[index].binName);

            //redraw grid and header lines
            redrawGrid();
            redrawHeader();
        }
        
        private function createCellRenderer(column:int, row:int):CellRenderer
        {
            var cellRenderer:CellRenderer = new CellRenderer();
            
            cellRenderer.column = column;
            cellRenderer.row = row;
            cellRenderer.x = column * CellRenderer.WIDTH;
            cellRenderer.y = row * CellRenderer.HEIGHT;
            cellRenderer.addEventListener(MouseEvent.CLICK, onCellRendererClick);
            cellRenderer.addEventListener(CellRenderer.RIGHT_CLICK, onCellRendererClick);
            
            return cellRenderer;
        }
        
        private function createHeaderRenderer(column:int):HeaderRenderer
        {
            var bin:J5Bin = j5CollectionProxy.j5Collection.binsVector[column];
            var imagePath:String = SBOLvIcons.getIconPath(bin.iconID, bin.directionForward);

            var headerRenderer:HeaderRenderer = new HeaderRenderer(imagePath);
            
            headerRenderer.column = column;
            headerRenderer.x = column * CellRenderer.WIDTH;
            headerRenderer.addEventListener(HeaderRenderer.CHANGE_ICON, onChangeIconClick);
            headerRenderer.addEventListener(HeaderRenderer.CHANGE_DIRECTION, onChangeDirectionClick);
            
            return headerRenderer;
        }
        
        private function redrawGrid():void
        {
            var numColumns:int = cellsTable.length;
            
            var g:Graphics = gridViewCanvas.gridCellsCanvas.graphics;
            g.clear();
            g.lineStyle(1,0xDDDDDD);
            for (var vLineNum:int = 0; vLineNum <= numColumns; vLineNum++) {
                g.moveTo(vLineNum * CellRenderer.WIDTH, 0);
                g.lineTo(vLineNum * CellRenderer.WIDTH, numRows * CellRenderer.HEIGHT);
            }
            for (var hLineNum:int = 0; hLineNum <= numRows; hLineNum++) {
                g.moveTo(0, hLineNum * CellRenderer.HEIGHT);
                g.lineTo(numColumns * CellRenderer.WIDTH, hLineNum * CellRenderer.HEIGHT);
            }
            
            //DSF lines
            g.lineStyle(1, Colors.DSF_RED);
            var j5BinsVector:Vector.<J5Bin> = j5CollectionProxy.j5Collection.binsVector;
            for (var binNum:int = 0; binNum < j5BinsVector.length; binNum++) {
                if (j5BinsVector[binNum].dsf) {
                    g.moveTo((binNum + 1) * CellRenderer.WIDTH, 0);
                    g.lineTo((binNum + 1) * CellRenderer.WIDTH, numRows * CellRenderer.HEIGHT);
                }
            }
        }
        
        private function redrawHeader():void
        {
            var numColumns:int = cellsTable.length;
            
            var g:Graphics = gridViewCanvas.gridHeaderCanvas.graphics;
            g.clear();
            g.lineStyle(1, 0xDDDDDD);
            for (var column:int = 0; column <= numColumns; column++) {
                g.moveTo(column * CellRenderer.WIDTH, 0);
                g.lineTo(column * CellRenderer.WIDTH, HeaderRenderer.HEIGHT);
            }
            g.moveTo(0, 0);
            g.lineTo(numColumns * CellRenderer.WIDTH, 0);
            g.lineStyle(4, 0xDDDDDD);
            g.moveTo(0, HeaderRenderer.HEIGHT - 1);
            g.lineTo(numColumns * CellRenderer.WIDTH, HeaderRenderer.HEIGHT - 1);
            
            //DSF lines
            g.lineStyle(1, Colors.DSF_RED);
            var j5BinsVector:Vector.<J5Bin> = j5CollectionProxy.j5Collection.binsVector;
            for (var binNum:int = 0; binNum < j5BinsVector.length; binNum++) {
                if (j5BinsVector[binNum].dsf) {
                    g.moveTo((binNum + 1) * CellRenderer.WIDTH, 0);
                    g.lineTo((binNum + 1) * CellRenderer.WIDTH, HeaderRenderer.HEIGHT);
                }
            }
        }
        
        private function findLinkedCellRenderers(partVO:PartVO):Vector.<CellRenderer>
        {
            var result:Vector.<CellRenderer> = new Vector.<CellRenderer>;
            for (var i:int = 0; i < cellsTable.length; i++) {
                for (var j:int = 0; j < cellsTable[i].length; j++) {
                    if (cellsTable[i][j].part != null && cellsTable[i][j].part.partVO == partVO) {
                        result.push(cellsTable[i][j]);
                    }
                }
            }
            
            if (result.length == 0) { //this means the part is not in the collection and is in the holding area
                var holdingAreaParts:Array = gridViewCanvas.partHoldingArea.getChildren();
                for (i = 0; i < holdingAreaParts.length; i++) {
                    if ((holdingAreaParts[i] as CellRenderer).part.partVO == partVO) {
                        result.push(holdingAreaParts[i]);
                        break;
                    }
                }
            }
            return result;
        }
        
        private function findCellRenderer(part:Part):CellRenderer
        {
            for (var i:int = 0; i < cellsTable.length; i++) {
                for (var j:int = 0; j < cellsTable[i].length; j++) {
                    if (cellsTable[i][j].part == part) {
                        return cellsTable[i][j];
                    }
                }
            }
            //FIXME: this currently does not look through the part holding area, does it need to?
            return null;
        }
        
        private function removeColumn(index:int):void
        {
            //remove cells
            var removedCellRenderer:CellRenderer;
            for (var row:int = 0; row < numRows; row++) {
                removedCellRenderer = gridViewCanvas.gridCellsCanvas.removeChild(cellsTable[index][row]) as CellRenderer;
                if (removedCellRenderer.part != null) {
                    if (removedCellRenderer.part.isEmpty()) {
                        //unselect cell if selected
                        if (removedCellRenderer.selected) {
                            (facade as ApplicationFacade).selectedPartRenderer = null;
                            sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, null);
                        }
                        
                        //remove part
                        partProxy.deleteItem(removedCellRenderer.part);
                    } else if (findLinkedCellRenderers(removedCellRenderer.part.partVO).length > 1) {
                        //unselect cell if selected
                        if (removedCellRenderer.selected) {
                            (facade as ApplicationFacade).selectedPartRenderer = null;
                            sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, null);
                        }
                        
                        //remove part
                        partProxy.deleteItem(removedCellRenderer.part);
                        
                        //reset border colors of linked parts
                        var part:Part = removedCellRenderer.part;
                        removedCellRenderer.part = null;
//                        updateLinkedSelected(removedCellRenderer); //FIXME: this didn't fix the problem
                        sendNotification(Notifications.NEW_REFRESH_LINKED_PART_RENDERERS, part);
                    } else {
                        //move to part holding area
                        removedCellRenderer.column = -1;
                        removedCellRenderer.row = -1;
                        gridViewCanvas.partHoldingArea.addChild(removedCellRenderer);
                    }
                }
            }
            cellsTable.splice(index, 1);
            
            //remove header
            gridViewCanvas.gridHeaderCanvas.removeChild(headerVector[index]);
            headerVector.splice(index, 1);
            
            //move cell renderers to fill up removed column
            var cellRenderer:CellRenderer;
            for (var c:int = index; c < cellsTable.length; c++) { //start at index since the column has already been removed
                for (var r:int = 0; r < cellsTable[c].length; r++) {
                    cellRenderer = cellsTable[c][r];
                    cellRenderer.column--;
                    cellRenderer.x = cellRenderer.column * CellRenderer.WIDTH;
                }
            }
            
            //move header items to fill up removed column
            for (c = index; c < headerVector.length; c++) {
                var headerRenderer:HeaderRenderer = headerVector[c];
                headerRenderer.column--;
                headerRenderer.x = headerRenderer.column * CellRenderer.WIDTH;
            }
            
            //redraw grid and header lines
            redrawGrid();
            redrawHeader();
        }
        
        private function updateLinkedSelected(selectedCellRenderer:CellRenderer):void
        {
            if (selectedCellRenderer == null || selectedCellRenderer.part == null || selectedCellRenderer.part.isEmpty()) {
                for (var i:int = 0; i < cellsTable.length; i++) {
                    for (var j:int = 0; j < cellsTable[i].length; j++) {
                        cellsTable[i][j].linkedSelected = false;
                    }
                }
            } else {
                for (i = 0; i < cellsTable.length; i++) {
                    for (j = 0; j < cellsTable[i].length; j++) {
                        var otherCellRenderer:CellRenderer = cellsTable[i][j];
                        if (otherCellRenderer.part != null) {
                            if (otherCellRenderer.part.partVO == selectedCellRenderer.part.partVO) {
                                otherCellRenderer.linkedSelected = true;
                            } else {
                                otherCellRenderer.linkedSelected = false;
                            }
                        }
                    }
                }
            }
        }
        
        //Event handlers
        private function onCellRendererClick(event:Event):void
        {
            var clickedCellRenderer:CellRenderer = event.currentTarget as CellRenderer;
            var selectedPartRenderer:IPartRenderer = (facade as ApplicationFacade).selectedPartRenderer;
            
            clickedCellRenderer.setFocus();
            event.stopPropagation(); //so the canvas never sees the click
            
            trace("*click* : " + clickedCellRenderer.column + ", " + clickedCellRenderer.row);
            
            //create empty part if it doesn't already exist for this cell
            if (clickedCellRenderer.part == null) {
                clickedCellRenderer.part = partProxy.createPart();
                
                //determine position and add to bin
                var position:int = 0;
                for (var k:int = 0; k < clickedCellRenderer.row; k++) {
                    if (cellsTable[clickedCellRenderer.column][k].part != null) {
                        position++;
                    }
                }
                j5CollectionProxy.addToBin(clickedCellRenderer.part, clickedCellRenderer.column, position);
            }
            
            //add row if a cell in the bottom row is clicked
            if (clickedCellRenderer.row == numRows - 1) {
                addRows(1);
            }
            
            if (clickedCellRenderer != selectedPartRenderer) { //selection changed
                //unselect the previously selected cell
                if (selectedPartRenderer != null) {
                    selectedPartRenderer.selected = false;
                }
                
                //select the clicked cell
                clickedCellRenderer.selected = true;
                (facade as ApplicationFacade).selectedPartRenderer = clickedCellRenderer;
                
                //set and unset linkedSelected on other cells
                updateLinkedSelected(clickedCellRenderer);
                
                //send notification to update part info panel
                sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, clickedCellRenderer.part);
            }
        }
        
        private function onCanvasClick(event:Event):void
        {
            var selectedPartRenderer:IPartRenderer = (facade as ApplicationFacade).selectedPartRenderer;
            
            trace("*click* : canvas");
            
            if (selectedPartRenderer != null) { //selection changed, deselect cell
                //unselect the previously selected cell
                selectedPartRenderer.selected = false;
                (facade as ApplicationFacade).selectedPartRenderer = null;
                
                //unset linkedSelected on other cells
                updateLinkedSelected(null);
                
                //send notification to update part info panel
                sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, null);
                //FIXME display collection info instead?
            }
        }
        
        private function onMapGenbankMenuItemSelect(event:ContextMenuEvent):void
        {
            sendNotification(Notifications.NEW_GENBANK_IMPORT_START);
        }
        
        private function onMapClipboardMenuItemSelect(event:ContextMenuEvent):void
        {
            sendNotification(Notifications.NEW_CLIPBOARD_PASTE_START);
        }
        
        private function cut():void
        {
            var selectedCellRenderer:CellRenderer = (facade as ApplicationFacade).selectedPartRenderer as CellRenderer;
            if (selectedCellRenderer == null || selectedCellRenderer.part == null || selectedCellRenderer.part.isEmpty()) {
                Alert.show("Nothing to cut.", "Warning Message");
                return;
            }
            
            isCut = true;
            sendNotification(Notifications.NEW_SET_CLIPBOARD_DATA);
            cutCellRenderer = (facade as ApplicationFacade).selectedPartRenderer as CellRenderer;
        }
        
        private function copy():void
        {
            var selectedCellRenderer:CellRenderer = (facade as ApplicationFacade).selectedPartRenderer as CellRenderer;
            if (selectedCellRenderer != null && selectedCellRenderer.column == -1) {
                Alert.show("Cannot copy from part holding area.  Please use Cut instead.", "Error Message");
                return;
            }
            
            isCut = false;
            sendNotification(Notifications.NEW_SET_CLIPBOARD_DATA);
        }
        
        private function paste():void
        {
            var selectedCellRenderer:CellRenderer = (facade as ApplicationFacade).selectedPartRenderer as CellRenderer;
            if (selectedCellRenderer == null) {
                Alert.show("Cannot paste here. Must paste in a column/row location.", "Warning Message");
                return;
            }
            
            if (selectedCellRenderer.part != null && !selectedCellRenderer.part.isEmpty()) {
                Alert.show("Cannot paste.  There is already something here.", "Error Message");
                return;
            }
            
            if (Clipboard.generalClipboard.hasFormat(Constants.PART_CLIPBOARD_KEY)) {
                clipboardPart = Clipboard.generalClipboard.getData(Constants.PART_CLIPBOARD_KEY) as Part;
                
                if (isCut) {
                    if (cutCellRenderer.part != clipboardPart) {
                        //clipboard part is from another instance
                        isCut = false;
                    } else {
                        //skip dialog and do linked paste
                        pasteCutPart();
                        return;
                    }
                }
                
                //this links up the sequenceFile if it already exists
                if (clipboardPart.sequenceFile != null) {
                    var matchingSequenceFile:SequenceFile = sequenceFileProxy.getItemByHash(clipboardPart.sequenceFile.hash)
                    if (matchingSequenceFile != null && matchingSequenceFile.sequenceFileName == clipboardPart.sequenceFile.sequenceFileName) {
                        clipboardPart.sequenceFile = matchingSequenceFile;
                    }
                }
                
                pasteDialog = new PasteDialog();
                pasteDialog.addEventListener(PasteDialog.PASTE_PART, onDonePasteDialog);
                pasteDialog.addEventListener(PasteDialog.CANCEL, onCancelPasteDialog);
                PopUpManager.addPopUp(pasteDialog, ApplicationFacade.getInstance().application, true);
                PopUpManager.centerPopUp(pasteDialog);
                
                pasteDialog.nameTextInput.text = clipboardPart.name;
                
                //check name and sequence conditions
                var allPartVOs:Vector.<PartVO> = partProxy.partVOs;
                pasteDialog.linkedPasteRadioButton.enabled = false;
                for (var i:int = 0; i<allPartVOs.length; i++) {
                    if (clipboardPart.partVO.isEqual(allPartVOs[i])) {
                        pasteDialog.linkedPasteRadioButton.enabled = true;
                        break;
                    }
                }
                if (pasteDialog.linkedPasteRadioButton.enabled == false) {
                    pasteDialog.regularPasteRadioButton.selected = true;
                }
            } else {
                Alert.show("Paste not supported for clipboard contents.", "Warning Message");
            }
        }
        
        private function pasteCutPart():void
        {
            //remove part from cut cell (but don't delete it, so Eugene rules aren't lost)
            if (cutCellRenderer.column != -1) {
                j5CollectionProxy.removeFromBin(cutCellRenderer.part, cutCellRenderer.column);
                sendNotification(Notifications.NEW_CHECK_BIN_FAS, j5CollectionProxy.j5Collection.binsVector[cutCellRenderer.column]);
                cutCellRenderer.part = null;
                cutCellRenderer.updateLabel();
                cutCellRenderer.eugeneIndicatorVisible = false;
                cutCellRenderer.fasIndicatorVisible = false;
            } else { //else it's being cut from part holding area
                gridViewCanvas.partHoldingArea.removeChild(cutCellRenderer);
            }
                
            //add to canvas
            var selectedCellRenderer:CellRenderer = (facade as ApplicationFacade).selectedPartRenderer as CellRenderer;
            addPart(clipboardPart, selectedCellRenderer.column, selectedCellRenderer.row);
            sendNotification(Notifications.NEW_REFRESH_LINKED_PART_RENDERERS, clipboardPart); //needed to set border color ...why would this change though?
            
            //determine position and add to bin
            var position:int = 0;
            for (var i:int = 0; i < selectedCellRenderer.row; i++) {
                if (cellsTable[selectedCellRenderer.column][i].part != null) {
                    position++;
                }
            }
            j5CollectionProxy.addToBin(clipboardPart, selectedCellRenderer.column, position);
            sendNotification(Notifications.NEW_CHECK_BIN_FAS, j5CollectionProxy.j5Collection.binsVector[selectedCellRenderer.column]);
            functionMediator.setUpCollection();
            
            selectedCellRenderer.setFocus();
            
            sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, clipboardPart);
            
            isCut = false;
        }
        
        private function onDonePasteDialog(event:Event):void
        {
            if (pasteDialog.pasteOptionsRadioButtons.selectedValue == "regularPaste") {
                var newName:String = pasteDialog.nameTextInput.text;
                if (newName == "") {
                    Alert.show("Please choose a name for the part.", "Error Message");
                } else if (!functionMediator.isLegalName(newName)) {
                    Alert.show("Illegal name. Name can only contain alphanumeric characters, underscore (_), and hyphen (-).", "Error Message");
                } else if (!partProxy.isUniquePartName(newName)) {
                    Alert.show("Name already exists. Please choose a unique name or select linked paste if appropriate.", "Error Message");
                } else {
                    pasteCopiedPart(false, newName);
                    PopUpManager.removePopUp(pasteDialog);
                }
            } else if (pasteDialog.pasteOptionsRadioButtons.selectedValue == "linkedPaste") {
                pasteCopiedPart(true);
                PopUpManager.removePopUp(pasteDialog);
            } else {
                Alert.show("Please select a valid paste option.", "No option selected");
            }
        }
        
        private function pasteCopiedPart(isShadowCopy:Boolean, newName:String = ""):void
        {
            //create the part
            var part:Part;
            if (isShadowCopy) {
                part = partProxy.createPart(partProxy.getPartVOByName(clipboardPart.name));
            } else {
                //copy the PartVO
                var newPartVO:PartVO = new PartVO();
                newPartVO.name = newName;  //change the name
                newPartVO.revComp = clipboardPart.revComp;
                newPartVO.genbankStartBP = clipboardPart.genbankStartBP;
                newPartVO.endBP = clipboardPart.endBP;
                
                //this links up the sequenceFile if it already exists or adds it to sequenceFileProxy if it does not
                if (clipboardPart.sequenceFile != null) {
                    try {
                        newPartVO.sequenceFile = sequenceFileProxy.addSequenceFile(clipboardPart.sequenceFile.sequenceFileFormat, 
                            clipboardPart.sequenceFile.sequenceFileContent, clipboardPart.sequenceFile.sequenceFileName);
                    } catch (error:Error) {
                        Alert.show("Cannot paste part.  Problem with sequence.\n\n" + error.toString(), "Error Message");
                        return;
                    }
                }
                
                part = partProxy.createPart(newPartVO);
            }
            
            //copy the FAS
            part.fas = clipboardPart.fas;
            
            //add to canvas
            var selectedCellRenderer:CellRenderer = (facade as ApplicationFacade).selectedPartRenderer as CellRenderer;
            addPart(part, selectedCellRenderer.column, selectedCellRenderer.row);
            sendNotification(Notifications.NEW_REFRESH_LINKED_PART_RENDERERS, part);
            
            //determine position and add to bin
            var position:int = 0;
            for (var i:int = 0; i < selectedCellRenderer.row; i++) {
                if (cellsTable[selectedCellRenderer.column][i].part != null) {
                    position++;
                }
            }
            j5CollectionProxy.addToBin(part, selectedCellRenderer.column, position);
            sendNotification(Notifications.NEW_CHECK_BIN_FAS, j5CollectionProxy.j5Collection.binsVector[selectedCellRenderer.column]);
            functionMediator.setUpCollection();
            
            updateLinkedSelected(selectedCellRenderer);
            selectedCellRenderer.setFocus();
            
            sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, part);
        }
        
        private function onCancelPasteDialog(event:Event):void
        {
            PopUpManager.removePopUp(pasteDialog);
            
            ((facade as ApplicationFacade).selectedPartRenderer as CellRenderer).setFocus();
        }
        
        private function clear():void
        {
            var selectedCellRenderer:CellRenderer = (facade as ApplicationFacade).selectedPartRenderer as CellRenderer;
            if (selectedCellRenderer == null || selectedCellRenderer.part == null || selectedCellRenderer.part.isEmpty()) {
                Alert.show("Nothing to delete", "Warning Message");
            } else if (selectedCellRenderer.column == -1) { //deleting from part holding area
                partProxy.deleteItem(selectedCellRenderer.part);
                gridViewCanvas.partHoldingArea.removeChild(selectedCellRenderer);
                (facade as ApplicationFacade).selectedPartRenderer = null;
                sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, null);
            } else {
                j5CollectionProxy.removeFromBin(selectedCellRenderer.part, selectedCellRenderer.column);
                partProxy.deleteItem(selectedCellRenderer.part);
                selectedCellRenderer.part = null;
                
                //create empty part since the cell will still be selected
                addPart(partProxy.createPart(), selectedCellRenderer.column, selectedCellRenderer.row);

                //determine position and add to bin
                var position:int = 0;
                for (var k:int = 0; k < selectedCellRenderer.row; k++) {
                    if (cellsTable[selectedCellRenderer.column][k].part != null) {
                        position++;
                    }
                }
                j5CollectionProxy.addToBin(selectedCellRenderer.part, selectedCellRenderer.column, position);
                
                updateLinkedSelected(selectedCellRenderer);
                
                sendNotification(Notifications.NEW_CHECK_BIN_FAS, j5CollectionProxy.j5Collection.binsVector[selectedCellRenderer.column]);
                functionMediator.setUpCollection();
                sendNotification(Notifications.NEW_REFRESH_ALL_PART_RENDERERS);
                sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, selectedCellRenderer.part);
            }
        }
        
        private function onChangeIconClick(event:Event):void
        {
            var headerRenderer:HeaderRenderer = event.target as HeaderRenderer;
            changeIconBinIndex = headerRenderer.column;
            changeIconDialog = new ChangeIconDialog();
            PopUpManager.addPopUp(changeIconDialog, ApplicationFacade.getInstance().application, true);
            PopUpManager.centerPopUp(changeIconDialog);
            changeIconDialog.imageTileList.dataProvider = SBOLvIcons.sbolvIconsDataProvider;
            changeIconDialog.imageTileList.addEventListener(ListEvent.ITEM_CLICK, changeIcon);  //must be added after creation of popup
            changeIconDialog.addEventListener(ChangeIconDialog.CANCEL, onChangeIconDialogCancel);

        }
        
        private function changeIcon(event:ListEvent):void
        {
            //store iconID
            var iconID:String = event.itemRenderer.data.id;
            var bin:J5Bin = j5CollectionProxy.j5Collection.binsVector[changeIconBinIndex];
            bin.iconID = iconID;
            
            //update header renderer
            headerVector[changeIconBinIndex].iconID = iconID;
            
            PopUpManager.removePopUp(changeIconDialog);
        }
        
        private function onChangeIconDialogCancel(event:Event):void
        {
            PopUpManager.removePopUp(changeIconDialog);
        }
        
        private function onChangeDirectionClick(event:Event):void
        {
            //store direction
            var changeColumn:int = (event.target as HeaderRenderer).column;
            var bin:J5Bin = j5CollectionProxy.j5Collection.binsVector[changeColumn];
            var newDirectionForward:Boolean = !bin.directionForward;
            bin.directionForward = newDirectionForward;
            
            //update header renderer and collection info panel
            headerVector[changeColumn].directionForward = newDirectionForward;
            sendNotification(Notifications.NEW_UPDATE_COLLECTION_DISPLAY_INFO);
        }
    }
}