package org.jbei.registry.mediators
{
    import com.degrafa.paint.SolidStroke;
    import com.roguedevelopment.objecthandles.ObjectHandleEvent;
    import com.roguedevelopment.objecthandles.SelectionManager;
    
    import flash.desktop.Clipboard;
    import flash.events.Event;
    import flash.events.IOErrorEvent;
    import flash.events.KeyboardEvent;
    import flash.events.MouseEvent;
    import flash.geom.Point;
    import flash.net.FileReference;
    import flash.ui.Keyboard;
    
    import mx.collections.ArrayCollection;
    import mx.controls.Alert;
    import mx.controls.Image;
    import mx.core.Application;
    import mx.effects.Parallel;
    import mx.graphics.GradientBase;
    import mx.graphics.Stroke;
    import mx.managers.PopUpManager;
    import mx.utils.object_proxy;
    
    import org.jbei.registry.ApplicationFacade;
    import org.jbei.registry.Constants;
    import org.jbei.registry.Notifications;
    import org.jbei.registry.SBOLvIcons;
    import org.jbei.registry.api.Entry;
    import org.jbei.registry.api.FeaturedDNASequence;
    import org.jbei.registry.commands.FunctionMediator;
    import org.jbei.registry.models.EugeneRule;
    import org.jbei.registry.models.Part;
    import org.jbei.registry.models.PartVO;
    import org.jbei.registry.models.SBOLvIconInfo;
    import org.jbei.registry.models.j5.J5Bin;
    import org.jbei.registry.models.j5.J5Collection;
    import org.jbei.registry.view.ui.shapes.BaseShape;
    import org.jbei.registry.view.ui.shapes.CollectionShape;
    import org.jbei.registry.view.ui.shapes.RectShape;
    import org.jbei.registry.proxies.EntryServiceProxy;
    import org.jbei.registry.proxies.EugeneRuleProxy;
    import org.jbei.registry.proxies.J5CollectionProxy;
    import org.jbei.registry.proxies.PartProxy;
    import org.jbei.registry.proxies.SequenceFileProxy;
    import org.jbei.registry.utils.Logger;
    import org.jbei.registry.utils.XMLTools;
    import org.jbei.registry.utils.XMLToolsV3;
    import org.jbei.registry.view.ui.Colors;
    import org.jbei.registry.view.ui.canvas.CenterCanvas;
    import org.jbei.registry.view.ui.canvas.GridCanvas;
    import org.jbei.registry.view.ui.dialogs.ClipboardPasteDialog;
    import org.jbei.registry.view.ui.dialogs.CollectionConfigure;
    import org.jbei.registry.view.ui.dialogs.PartDefinitionDialog;
    import org.jbei.registry.view.ui.dialogs.PasteDialog;
    import org.puremvc.as3.interfaces.INotification;
    import org.puremvc.as3.patterns.mediator.Mediator;
    import org.puremvc.as3.patterns.observer.Notification;
    import org.puremvc.as3.patterns.proxy.Proxy;
    
    public class CenterCanvasMediator extends Mediator
    {
        public static const NAME:String = "CenterCanvasMediator";
        
        private var partProxy:PartProxy = ApplicationFacade.getInstance().retrieveProxy(PartProxy.NAME) as PartProxy;
        private var j5CollectionProxy:J5CollectionProxy = ApplicationFacade.getInstance().retrieveProxy(J5CollectionProxy.NAME) as J5CollectionProxy;
        private var sequenceFileProxy:SequenceFileProxy = ApplicationFacade.getInstance().retrieveProxy(SequenceFileProxy.NAME) as SequenceFileProxy;
        private var eugeneRuleProxy:EugeneRuleProxy = ApplicationFacade.getInstance().retrieveProxy(EugeneRuleProxy.NAME) as EugeneRuleProxy
        
        private var _centerCanvas:CenterCanvas;
        
        private var _rectShapes:Vector.<RectShape> = new Vector.<RectShape>;
        private var _collectionShape:CollectionShape = null;
        
        private var pasteDialog:PasteDialog;
        private var clipboardPasteDialog:ClipboardPasteDialog;
        private var partDefinitionDialog:PartDefinitionDialog;
        private var clipboardPart:Part;
        
        private var globalMousePoint:Point;
        private var oldCollectionShapePosition:Point;
        private var oldCollectionShapeWidth:Number;
        private var oldCollectionShapeHeight:Number;
        private var rectShapeSize:Number = Constants.RECT_SHAPE_DEFAULT_SIZE;
        private var selectedRectShapePosition:Point = new Point(0, 0);
                
        public function CenterCanvasMediator(viewComponent:CenterCanvas)
        {
            super(NAME, viewComponent);
            _centerCanvas = viewComponent as CenterCanvas;
            
            _centerCanvas.addEventListener(Event.COPY, onCopy);
            _centerCanvas.addEventListener(Event.PASTE, onPaste);
            _centerCanvas.addEventListener(Event.CLEAR, onClear);
            _centerCanvas.addEventListener(KeyboardEvent.KEY_UP, keyPressed);
            _centerCanvas.gridCanvas.addEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
            _centerCanvas.addEventListener(CenterCanvas.DESELECT, shapeDeselected);
            _centerCanvas.addEventListener(CenterCanvas.CLIPBOARD_PASTE_BEGIN, onShowClipboardPasteDialog);
            _centerCanvas.addEventListener(CenterCanvas.CHANGE_ICON, changeIcon);
        }
        
        public function get rectShapes():Vector.<RectShape>
        {
            return _rectShapes;
        }
        
        public function get collectionShape():CollectionShape
        {
            return _collectionShape;
        }
        
        public function get functionMediator():FunctionMediator
        {
            return ApplicationFacade.getInstance().retrieveMediator(FunctionMediator.NAME) as FunctionMediator;
        }
        
        public function get mainCanvasMediator():MainCanvasMediator
        {
            return ApplicationFacade.getInstance().retrieveMediator(MainCanvasMediator.NAME) as MainCanvasMediator;
        }
        
        public override function listNotificationInterests():Array
        {
            return [
                Notifications.PART_STATUS_CHANGED
                
                , Notifications.NEW_ADD_RECT_SHAPE
                , Notifications.NEW_LEFT_CANVAS_COLLECTION_CLICKED
                
                , Notifications.NEW_REFRESH_ALL_RECT_SHAPES
                
                , Notifications.NEW_CHANGE_ICON
                
                , Notifications.NEW_SAVE_XML
                
                , Notifications.NEW_CLEAR_DESIGN
                
                , Notifications.NEW_EUGENE_RULE_ADDED_DELETED
            ];
        }

        public override function handleNotification(notification:INotification):void
        {
            var part:Part;
            var linkedRectShapes:Vector.<RectShape>;
            var selectedRectShape:RectShape;
            var i:int;
            
            switch (notification.getName())
            {
                case Notifications.PART_STATUS_CHANGED:
                    part = notification.getBody() as Part;
                    linkedRectShapes = findLinkedRectShapes(part.partVO);
                    
                    for (i = 0; i<linkedRectShapes.length; i++) {
                        /*if (part.hasSequence == false && part.hasEntry == true) {
                            relevantRectShapes[i].setStroke(Colors.NO_SEQ_ORANGE);
                        } else */if (part.hasSequence == false) {
                            linkedRectShapes[i].setStroke(Colors.RED);
                        } else if (linkedRectShapes.length > 1) {
                            linkedRectShapes[i].setStroke(Colors.RESTRICTED_BLUE);
                        } else {
                            linkedRectShapes[i].setStroke(Colors.MAPPED_GREY);
                        }
                    }
                    break;
                
                case Notifications.NEW_ADD_RECT_SHAPE:
                    var iconID:String = notification.getBody() as String;
                    insertNewRectShape(iconID);
                    break;
                
                case Notifications.NEW_LEFT_CANVAS_COLLECTION_CLICKED:
                    if (_collectionShape != null) {
                        SelectionManager.instance.selectNone();  // otherwise SelectionManager still thinks something is selected
                        Alert.show("Multiple collections are not allowed.", "Error Message");
                        return;
                    }
                    
                    //collectionShape = notification.getBody() as CollectionShape;
                    addCollection();
                    break;
                
                case Notifications.NEW_REFRESH_ALL_RECT_SHAPES:
                    for (i = 0; i<_rectShapes.length; i++) {
                        part = _rectShapes[i].part;
                        /*if (part.hasSequence == false && part.hasEntry == true) {
                            _rectShapes[i].setStroke(Colors.NO_SEQ_ORANGE);
                        } else */if (part.hasSequence == false) {
                            _rectShapes[i].setStroke(Colors.RED);
                        } else if (findLinkedRectShapes(part.partVO).length > 1) { // if part has multiple copies
                            _rectShapes[i].setStroke(Colors.RESTRICTED_BLUE);
                        } else {
                            _rectShapes[i].setStroke(Colors.MAPPED_GREY);
                        }
                        _rectShapes[i].updateLabel(part.name);
                    }
                    
                    selectedRectShape = ApplicationFacade.getInstance().getSelectedRectShape();
                    clearHighlightShadowCopies();
                    highlightShadowCopies(selectedRectShape);
                    
                    break;
                
                case Notifications.NEW_CHANGE_ICON:
                    selectedRectShape = ApplicationFacade.getInstance().getSelectedRectShape();
                    var shadowCopies:Vector.<RectShape> = findLinkedRectShapes(selectedRectShape.part.partVO);
                    
                    //change icon ID in partVO
                    selectedRectShape.part.partVO.iconID = notification.getBody() as String;
                    
                    //update images
                    for (var j:int = 0; j<shadowCopies.length; j++) {
                        var imagePath:String = SBOLvIcons.getIconPath(shadowCopies[j].part.iconID, shadowCopies[j].part.directionForward);
                        shadowCopies[j].setImage(imagePath);
                    }
                    break;
                
                case Notifications.NEW_SAVE_XML:
                    var designXML:XML = XMLToolsV3.generateDesignXML(_rectShapes, _collectionShape);
                    if (designXML != null) {  //do not save if deprecated part icon images are being used
                        var outputString:String = '<?xml version="1.0" encoding="UTF-8"?>\n' + designXML.toXMLString();
                        var fileRef:FileReference = new FileReference()
                        fileRef.addEventListener(IOErrorEvent.IO_ERROR, ioError);
                        fileRef.addEventListener(Event.COMPLETE, designXMLSaved);
                        fileRef.save(outputString, mainCanvasMediator.lastLoadString);
                        Logger.getInstance().info("Design saved");     
                    }
                    break;
                
                case Notifications.NEW_CLEAR_DESIGN:
                    //clear shapes
                    _centerCanvas.gridCanvas.removeAllChildren();
                    _rectShapes.splice(0, rectShapes.length);
                    _collectionShape = null;
                    
                    //clear proxies
                    partProxy.deleteAllItems();
                    j5CollectionProxy.deleteItem();
                    
                    rectShapeSize = Constants.RECT_SHAPE_DEFAULT_SIZE;
                    
                    mainCanvasMediator.lastLoadString = "new_design.xml";
                    
                    sendNotification(Notifications.NEW_CLEAR_DISPLAY_INFO);
                    break;
                
                case Notifications.NEW_EUGENE_RULE_ADDED_DELETED:
                    var affectedEugeneRule:EugeneRule = notification.getBody() as EugeneRule;
                    var hasEugeneRules:Boolean;
                    
                    if (affectedEugeneRule != null) {
                        //refresh affected rectShapes (those associated with the operands of the affectedEugeneRule)
                        hasEugeneRules = eugeneRuleProxy.getRulesByPartVO(affectedEugeneRule.operand1).length > 0 ? true : false;
                        linkedRectShapes = findLinkedRectShapes(affectedEugeneRule.operand1);
                        for (j = 0; j < linkedRectShapes.length; j++) {
                            linkedRectShapes[j].eugeneRuleIndicator.visible = hasEugeneRules;
                        }
                        
                        if (affectedEugeneRule.operand2 is PartVO) {
                            hasEugeneRules = eugeneRuleProxy.getRulesByPartVO(affectedEugeneRule.operand2).length > 0 ? true : false;
                            linkedRectShapes = findLinkedRectShapes(affectedEugeneRule.operand2);
                            for (j = 0; j < linkedRectShapes.length; j++) {
                                linkedRectShapes[j].eugeneRuleIndicator.visible = hasEugeneRules;
                            }
                        }
                    } else { //no affected eugeneRules specified (probably a delete all), so refresh all rectShapes
                        for (i = 0; i < rectShapes.length; i++) {
                            hasEugeneRules = eugeneRuleProxy.getRulesByPartVO(rectShapes[i].part.partVO).length > 0 ? true : false;
                            rectShapes[i].eugeneRuleIndicator.visible = hasEugeneRules;
                        }
                    }
                    break;
            }
        }
        
        // Public methods to do with RectShapes and Parts
        public function createRectShape(position:Point, part:Part, initialSelect:Boolean):RectShape
        {
            var rectShape:RectShape = new RectShape();
            rectShape.part = part;
            rectShape.position = position;
            rectShape.initialSelect = initialSelect;
            
            rectShape.initShape();

            rectShape.addEventListener(ObjectHandleEvent.OBJECT_SELECTED, onRectShapeSelected);
            rectShape.addEventListener(ObjectHandleEvent.OBJECT_MOVED_EVENT, onRectShapeMoved);
            rectShape.addEventListener(ObjectHandleEvent.OBJECT_RESIZED_EVENT, onRectShapeResized);
            rectShape.addEventListener(ObjectHandleEvent.OBJECT_RESIZING_EVENT, onRectShapeResizing);
            
            rectShape.minHeight = Constants.RECT_SHAPE_MIN_SIZE;
            rectShape.minWidth = Constants.RECT_SHAPE_MIN_SIZE;
            rectShape.maxHeight = Constants.RECT_SHAPE_DEFAULT_SIZE;
            rectShape.maxWidth = Constants.RECT_SHAPE_DEFAULT_SIZE;
            
            _rectShapes.push(rectShape);
            
            var gridCanvas:GridCanvas = _centerCanvas.gridCanvas;
            gridCanvas.addChild(rectShape);
            
            try {
                rectShape.setImage(SBOLvIcons.getIconPath(part.iconID, part.directionForward));
            } catch (error:Error) {
                Alert.show(error.message + "\n\nUsing generic icon for part " + rectShape.part.name + ".", "Warning Message");
                rectShape.setImage(SBOLvIcons.getIconPath(SBOLvIcons.GENERIC, part.directionForward));
            }
            
            if (part.fas != "") {
                toggleFasIndicator(rectShape, true);
            }
            
            rectShape.setFocus();

            sendNotification(Notifications.PART_STATUS_CHANGED, rectShape.part);
            
            return rectShape;
        }
        
        public function findLinkedRectShapes(partVO:PartVO):Vector.<RectShape>
        {
            var result:Vector.<RectShape> = new Vector.<RectShape>;
            for (var j:int = 0; j<_rectShapes.length; j++) {
                if (_rectShapes[j].part.partVO == partVO) {
                    result.push(_rectShapes[j]);
                }
            }
            return result;
        }
        
        public function findRectShape(part:Part):RectShape
        {
            for (var i:int = 0; i<_rectShapes.length; i++) {
                if (_rectShapes[i].part == part) {
                    return _rectShapes[i];
                }
            }
            return null;
        }
        
        public function deleteRectShape(rectShape:RectShape):void
        {            
            //remove part
            partProxy.deleteItem(rectShape.part);
            
            //remove from UI
            if (rectShape.parent != null) {
                rectShape.parent.removeChild(rectShape);
            }
            
            //remove from list of known RectShapes
            for (var i:int = 0; i<_rectShapes.length; i++) {
                if (_rectShapes[i] == rectShape) {
                    _rectShapes.splice(i, 1);
                    break;
                }
            }
        }
        
        public function insertNewRectShape(iconID:String):RectShape
        {
            var gridCanvas:GridCanvas = _centerCanvas.gridCanvas;
            var position:Point = new Point(gridCanvas.height/2, gridCanvas.width/2);
            if (isPointInCollection(gridCanvas.localToGlobal(position))) {
                position.y = _collectionShape.y + _collectionShape.height + Constants.COLLECTION_OUTSIDE_MARGIN;
            }
            
            var part:Part = partProxy.createPart();
            part.iconID = iconID;
            
            var newRectShape:RectShape = createRectShape(position, part, true);
            
            //copy the label info
            newRectShape.setLabel();
            
            return newRectShape;
        }
        
        public function toggleFasIndicator(rectShape:RectShape, isOn:Boolean):void {
            if (!rectShape.fasIndicator.visible && isOn) {
                rectShape.fasIndicator.fill = rectShape.blueFill; //always turn on as no conflict, adjusted later
            }
            rectShape.fasIndicator.visible = isOn;
        }
        
        public function updateFasIndicatorColor(bin:J5Bin):void
        {
            for (var i:int = 0; i < bin.binItemsVector.length; i++) {
                var part:Part = bin.binItemsVector[i];
                var rectShape:RectShape;
                if (part.fas != "") { //if part has a FAS, i.e. if the FAS indicator is on
                    rectShape = findRectShape(part);
                    if (part.fas != bin.fas) {
                        rectShape.fasIndicator.fill = rectShape.redFill;
                    } else {
                        rectShape.fasIndicator.fill = rectShape.blueFill;
                    }
                }
            }
        }
        
        /** 
        * Resets the size and forced assembly strategy indicator color of the rectShape
        * to that of a rectShape outside a collection.  Call this method when a rectShape 
        * has been moved out of a collection.  
        * 
        * @param rectShape  the rectShape to be resized and recolored because it 
        *                   was moved out of a collection 
        */
        public function resetRectShapeOutOfCollection(rectShape:RectShape):void
        {
            rectShape.width = Constants.RECT_SHAPE_DEFAULT_SIZE;
            rectShape.height = Constants.RECT_SHAPE_DEFAULT_SIZE;
            rectShape.fasIndicator.fill = rectShape.blueFill;
        }
        
        // Public methods to do with CollectionShapes
        public function createNewCollectionShape(point:Point, width:Number, height:Number):CollectionShape
        {
            if (_collectionShape != null) {
                throw new Error("Multiple collections are not allowed.");
            }
            
            var j5Collection:J5Collection = createNewJ5Collection();
            
            _collectionShape = new CollectionShape();
            _collectionShape.collection = j5Collection;
            
            _collectionShape.initShape();
            _collectionShape.initCollectionShape(point, width, height);
            
            oldCollectionShapePosition = new Point(_collectionShape.x, _collectionShape.y);
            oldCollectionShapeWidth = _collectionShape.width;
            oldCollectionShapeHeight = _collectionShape.height;
            
            _collectionShape.addEventListener(ObjectHandleEvent.OBJECT_SELECTED, onCollectionSelected);
            _collectionShape.addEventListener(ObjectHandleEvent.OBJECT_MOVED_EVENT, onCollectionMoved);
            _collectionShape.addEventListener(ObjectHandleEvent.OBJECT_RESIZED_EVENT, onCollectionResized);
            _collectionShape.addEventListener(ObjectHandleEvent.OBJECT_MOVING_EVENT, onCollectionShapeMoving);
            _collectionShape.addEventListener(ObjectHandleEvent.OBJECT_RESIZING_EVENT, onCollectionShapeResizing);
            
            return _collectionShape;
        }
        
        public function insertNewCollectionShape(binCount:int, name:String):void
        {
            var point:Point = new Point(0, 0);
            var width:Number = binCount * 2 * Constants.RECT_SHAPE_DEFAULT_SIZE;
            var height:Number = 2 * (Constants.BIN_MARGIN + Constants.RECT_SHAPE_DEFAULT_SIZE) + Constants.BIN_MARGIN;
            
            var newCollection:CollectionShape = createNewCollectionShape(point, width, height);
            
            newCollection.setTextLabel();
            newCollection.textLabelValue(name);
            
            _centerCanvas.gridCanvas.addChild(newCollection);
            
            //The placement of this initBins function is specfic, it has to come after the collection shape has been given a parent
            newCollection.collection.initBins(binCount);
            newCollection.createBinLines();
            collectionShape.addLabels();
            newCollection.moveToBack();
            newCollection.calculateMinHeight();
            newCollection.calculateMinWidth();
            
            var freeRectShapes:Vector.<RectShape> = findFreeRectShapes();
            for (var i:int = 0; i < freeRectShapes.length; i++) {
                adjustRectShapePosition(freeRectShapes[i]);
            }
        }

        //FIXME: this is the same as get collectionShape()
        public function findCollectionShape(j5Collection:J5Collection):CollectionShape
        {
            return _collectionShape;
        }

        public function addCollection():void
        {
            configureCollection();
            //FIXME
            functionMediator.setUpCollection();			
        }
        
        public function configureCollection():void
        {
            var collectionConfigure:CollectionConfigure = new CollectionConfigure();
            //collectionConfigure.collection = c;
            collectionConfigure.centerCanvas = _centerCanvas;
            PopUpManager.addPopUp(collectionConfigure, ApplicationFacade.getInstance().application, true);
            PopUpManager.centerPopUp(collectionConfigure);
        }

        public function deleteCollectionShape(collectionShape:CollectionShape):void
        {
            //remove from UI
            if (collectionShape.parent != null) {
                collectionShape.parent.removeChild(collectionShape);
            }
            
            _collectionShape = null;
            
            //remove associated J5Collection and J5Bins
            (facade.retrieveProxy(J5CollectionProxy.NAME) as J5CollectionProxy).deleteItem();
        }
        
        // Public methods to do with J5Bins
        //TODO: remove
        public function createNewJ5Bin(name:String, j5Collection:J5Collection, index:int = -1):J5Bin
        {
            var j5Bin:J5Bin = new J5Bin(name);
            j5Collection.addBin(j5Bin, index);
            return j5Bin;
        }
        
        //TODO: remove?
        public function copyEmptyJ5Bin(parent:J5Collection, j5Bin:J5Bin):J5Bin
        {
            var copy:J5Bin = createNewJ5Bin(j5Bin.binName, parent);
            copy.dsf = j5Bin.dsf;
            copy.fro = j5Bin.fro;
            copy.fas = j5Bin.fas;
            copy.extra5PrimeBps = j5Bin.extra5PrimeBps;
            copy.extra3PrimeBps = j5Bin.extra3PrimeBps;
            
            return copy;
        }
        
        public function addBin(index:int):void
        {
            var binWidth:Number = _collectionShape.width / _collectionShape.numBins;
            
            createNewJ5Bin("No_Name" + _collectionShape.numBins.toString(), _collectionShape.collection, index);
            
            //expand collectionShape width
            _collectionShape.width = Math.floor(binWidth * _collectionShape.numBins);
            
            //shift rectShapes from higher bins right by one bin-width
            if (index != -1) {  // if index is -1, bin is added at end and nothing needs to be moved
                var bin:J5Bin;
                var rectShape:RectShape;
                for (var i:int = index; i < _collectionShape.numBins; i++) {
                    bin = _collectionShape.collection.binsVector[i];
                    for (var j:int = 0; j < bin.binItemsVector.length; j++) {
                        rectShape = findRectShape(bin.binItemsVector[j]);
                        rectShape.x = rectShape.x + binWidth;
                    }
                }
            }
            
            //move any free rectShapes that overlap the collectionShape
            var freeRectShapes:Vector.<RectShape> = findFreeRectShapes();
            for (i = 0; i < freeRectShapes.length; i++) {
                if (!(freeRectShapes[i].y + freeRectShapes[i].height < _collectionShape.y || freeRectShapes[i].y > _collectionShape.y + _collectionShape.height
                    || freeRectShapes[i].x + freeRectShapes[i].width < _collectionShape.x || freeRectShapes[i].x > _collectionShape.x + _collectionShape.width)) {
                    freeRectShapes[i].y = _collectionShape.y + _collectionShape.height + Constants.COLLECTION_OUTSIDE_MARGIN;
                }
            }
            
            //if bin inserted at beginning, fas check needs to be run on second bin in case a part with DIGEST fas got moved there
            if (index == 0) {
                sendNotification(Notifications.NEW_CHECK_BIN_FAS, _collectionShape.collection.binsVector[1]);
            }
            
            _collectionShape.fixBinLines();
            _collectionShape.addLabels();
            _collectionShape.calculateMinWidth();
            
            sendNotification(Notifications.COLLECTION_MODIFIED);
        }
        
        public function removeBin(index:int):void
        {
            if(_collectionShape.numBins > 1)
            {
                var binWidth:Number = _collectionShape.width / _collectionShape.numBins;
                
                if (index == -1) {
                    index = _collectionShape.numBins - 1;
                }
                
                var bin:J5Bin;
                var rectShape:RectShape;
                
                //move parts out of the bin to be deleted, unless it's the last one (collection will shrink so the parts will end up outside)
                bin = _collectionShape.collection.binsVector[index];
                for (var j:int = 0; j < bin.binItemsVector.length; j++) {
                    rectShape = findRectShape(bin.binItemsVector[j]);
                    if (index != _collectionShape.numBins - 1) {
                        rectShape.y = collectionShape.y + collectionShape.height + Constants.COLLECTION_OUTSIDE_MARGIN;
                    }
                    rectShape.width = Constants.RECT_SHAPE_DEFAULT_SIZE;
                    rectShape.height = Constants.RECT_SHAPE_DEFAULT_SIZE;
                }
                
                _collectionShape.collection.deleteBin(index);
                
                //shrink collectionShape width
                _collectionShape.width = Math.floor(binWidth * _collectionShape.numBins);
                
                //shift rectShapes from higher bins left by one bin-width
                for (var i:int = index; i < _collectionShape.numBins; i++) {
                    bin = _collectionShape.collection.binsVector[i];
                    for (j = 0; j < bin.binItemsVector.length; j++) {
                        rectShape = findRectShape(bin.binItemsVector[j]);
                        rectShape.x = rectShape.x - binWidth;
                    }
                }
                
                _collectionShape.fixBinLines();
                _collectionShape.addLabels();
                _collectionShape.calculateMinWidth();
                
                sendNotification(Notifications.COLLECTION_MODIFIED);
            }
            else
                Alert.show("Can't remove any more bins\nAt this point you should just delete the collection.", "Warning Message");
        }
        
        // Public functions to do with J5Collections
        public function createNewJ5Collection():J5Collection
        {
            var j5Collection:J5Collection = new J5Collection();
            var j5CollectionProxy:J5CollectionProxy = ApplicationFacade.getInstance().retrieveProxy(J5CollectionProxy.NAME) as J5CollectionProxy;
            j5CollectionProxy.addItem(j5Collection);

            return j5Collection;
        }

        //Copy this collection but with empty bins
        //FIXME: does this even make sense to do? will result in 2 possibly different collections with the same name
        public function copyEmptyJ5Collection(j5Collection:J5Collection):J5Collection
        {
            //FIXME:this should not be calling new J5Collection()
            var copyColl:J5Collection = new J5Collection();
            var copyCollectionShape:CollectionShape = findCollectionShape(copyColl);
            copyColl.initialized = true;
            
            for(var index:int = 0; index<j5Collection.binCount(); index++)
            {
                var bin:J5Bin = j5Collection.binsVector[index] as J5Bin;				
                var copyBin:J5Bin = copyEmptyJ5Bin(copyColl, bin);
            }
            
            return copyColl;
        }
        
        //Assign a shape to its bin number; return -1 if outside the collection area
        public function getBinAssignment(rectShape:RectShape):int
        {
            if (_collectionShape == null) {
                return -1;
            }
            
            var part:Part = rectShape.part;
            var collection:J5Collection = _collectionShape.collection;
            var bin:J5Bin;
            var binNumber:int = -1;
            
            for (var i:int = 0; i < collection.binCount(); i++) {
                bin = collection.binsVector[i];
                for (var j:int = 0; j < bin.binItemsVector.length; j++) {
                    if (part == bin.binItemsVector[j]) {
                        binNumber = i;
                        break;
                    }
                }
            }
            
            return binNumber;
        }
        
        public function checkAllBinFAS():void
        {
            if (_collectionShape == null) {
                return;
            }
            
            var bins:Vector.<J5Bin> = _collectionShape.collection.binsVector;
            
            for (var i:int = 0; i < bins.length; i++) {
                sendNotification(Notifications.NEW_CHECK_BIN_FAS, bins[i]);
            }
        }
        
        public function fixIconLabel(rectShape:RectShape):void
        {
            rectShape.textLabel.y = rectShape.height;
        }
        
        public function adjustRectShapePosition(rectShape:RectShape):void
        {
            var binIndex:int = getBinAssignment(rectShape);
            
            if (binIndex >= 0) {  // rectShape is in a collection
                //move rectShape that is not completely inside a bin so it is
                if (rectShape.y + rectShape.height > _collectionShape.y + _collectionShape.height - Constants.BIN_MARGIN) {  // if rectShape overlaps bottom of collection
                    rectShape.y = _collectionShape.y + _collectionShape.height - Constants.BIN_MARGIN - rectShape.height;
                }
                if (rectShape.y < _collectionShape.y + Constants.BIN_MARGIN) {  // if rectShape overlaps top of collection
                    rectShape.y = _collectionShape.y + Constants.BIN_MARGIN;
                }
                if (rectShape.x + rectShape.width > _collectionShape.x + _collectionShape.getBinRightBoundary(binIndex) - Constants.BIN_MARGIN) {  // if rectShape overlaps right of bin
                    rectShape.x = _collectionShape.x + _collectionShape.getBinRightBoundary(binIndex) - Constants.BIN_MARGIN - rectShape.width;
                }
                if (rectShape.x < _collectionShape.x + _collectionShape.getBinLeftBoundary(binIndex) + Constants.BIN_MARGIN) {  // if rectShape overlaps left of bin
                    rectShape.x = _collectionShape.x + _collectionShape.getBinLeftBoundary(binIndex) + Constants.BIN_MARGIN;
                }
            } else {
                //move rectShape that is partly overlapping collection so it does not
                if (_collectionShape != null
                    && !(rectShape.y + rectShape.height <= _collectionShape.y - Constants.COLLECTION_OUTSIDE_MARGIN || rectShape.y >= _collectionShape.y + _collectionShape.height + Constants.COLLECTION_OUTSIDE_MARGIN
                        || rectShape.x + rectShape.width <= _collectionShape.x - Constants.COLLECTION_OUTSIDE_MARGIN || rectShape.x >= _collectionShape.x + _collectionShape.width + Constants.COLLECTION_OUTSIDE_MARGIN)) {  //FIXME to pop out all rectShapes that are supposed to
                    if (rectShape.y + rectShape.height > _collectionShape.y - Constants.COLLECTION_OUTSIDE_MARGIN && rectShape.y < _collectionShape.y) {  // top
                        rectShape.y = _collectionShape.y - rectShape.height - Constants.COLLECTION_OUTSIDE_MARGIN;
                        if (rectShape.y < 0) {  // if off the canvas, move to bottom
                            rectShape.y = _collectionShape.y + _collectionShape.height + Constants.COLLECTION_OUTSIDE_MARGIN;
                        }
                    } else if (rectShape.y < _collectionShape.y + _collectionShape.height + Constants.COLLECTION_OUTSIDE_MARGIN && rectShape.y + rectShape.height > _collectionShape.y + _collectionShape.height) {  // bottom
                        rectShape.y = _collectionShape.y + _collectionShape.height + Constants.COLLECTION_OUTSIDE_MARGIN;
                    } else if (rectShape.x + rectShape.width > _collectionShape.x - Constants.COLLECTION_OUTSIDE_MARGIN && rectShape.x < _collectionShape.x) {  // left
                        rectShape.x = _collectionShape.x - rectShape.width - Constants.COLLECTION_OUTSIDE_MARGIN;
                        if (rectShape.x < 0) {  // if off the canvas, move to right
                            rectShape.x = _collectionShape.x + _collectionShape.width + Constants.COLLECTION_OUTSIDE_MARGIN;
                        }
                    } else if (rectShape.x < _collectionShape.x + _collectionShape.width + Constants.COLLECTION_OUTSIDE_MARGIN && rectShape.x + rectShape.width > _collectionShape.x + _collectionShape.width) {  // right
                        rectShape.x = _collectionShape.x + _collectionShape.width + Constants.COLLECTION_OUTSIDE_MARGIN;
                    } else {
                        rectShape.y = _collectionShape.y + _collectionShape.height + Constants.COLLECTION_OUTSIDE_MARGIN;
                    }
                }
            }
        }
        
        // Private methods
        
        private function highlightShadowCopies(rectShape:RectShape):void
        {
            if (rectShape == null) {
                return;
            }
            var relevantRectShapes:Vector.<RectShape> = findLinkedRectShapes(rectShape.part.partVO);
            for (var i:int = 0; i<relevantRectShapes.length; i++) {
                relevantRectShapes[i].setStrokeWeight(2);
            }
        }
        
        private function clearHighlightShadowCopies():void
        {
            for (var i:int = 0; i<_rectShapes.length; i++) {
                _rectShapes[i].setStrokeWeight(1);
            }
        }

        private function isPointInCollection(point:Point):Boolean
        {
            //point is in global coordinate system, convert to gridCanvas content coordinate system
            point = _centerCanvas.gridCanvas.globalToContent(point);
            
            if (_collectionShape != null 
                && point.x >= _collectionShape.x && point.x <= _collectionShape.x + _collectionShape.width
                && point.y >= _collectionShape.y && point.y <= _collectionShape.y + _collectionShape.height) {
                return true;
            }
            return false;
        }
        
        private function findFreeRectShapes():Vector.<RectShape>
        {
            var freeRectShapes:Vector.<RectShape> = new Vector.<RectShape>;
            
            for (var i:int = 0; i < _rectShapes.length; i++) {
                if (getBinAssignment(_rectShapes[i]) < 0) {
                    freeRectShapes.push(_rectShapes[i]);
                }
            }
            
            return freeRectShapes;
        }
        
        private function deleteSelectedRectShape():void
        {
            var rectShape:RectShape = ApplicationFacade.getInstance().getSelectedRectShape();
            var binNumber:int = getBinAssignment(rectShape);
            
            //if in bin, delete part from bin first
            if (binNumber >= 0) {
                _collectionShape.collection.binsVector[binNumber].removeFromBin(rectShape.part);
                sendNotification(Notifications.NEW_CHECK_BIN_FAS, _collectionShape.collection.binsVector[binNumber]);
                functionMediator.setUpCollection();       			
            }
            
            deleteRectShape(rectShape);
            SelectionManager.instance.selectNone();
            
            
            sendNotification(Notifications.NEW_REFRESH_ALL_RECT_SHAPES);
            sendNotification(Notifications.NEW_CLEAR_DISPLAY_INFO);
        }
        
        private function deleteSelectedCollectionShape():void
        {
            deleteCollectionShape(ApplicationFacade.getInstance().getSelectedCollectionShape());
            SelectionManager.instance.selectNone();
            sendNotification(Notifications.NEW_CLEAR_DISPLAY_INFO);
        }
        
        // Event Handlers
        private function onRectShapeSelected(event:Event):void
        {
            var rectShape:RectShape = event.target as RectShape;
            rectShape.moveToFront();
            rectShape.setFocus();
            
            selectedRectShapePosition.x = rectShape.x;
            selectedRectShapePosition.y = rectShape.y;
            
            sendNotification(Notifications.NEW_REFRESH_ALL_RECT_SHAPES);
            sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, rectShape.part);
            sendNotification(Notifications.NEW_UPDATE_STATUS_BAR_BASIC, rectShape);
        }
        
        private function onRectShapeMoved(event:ObjectHandleEvent) : void
        {
            var rectShape:RectShape = event.target as RectShape;
            var binNumber:int = getBinAssignment(rectShape);
            
            //remove part from old bin if it was in one
            if (binNumber >= 0) {
                _collectionShape.collection.binsVector[binNumber].removeFromBin(rectShape.part);
                sendNotification(Notifications.NEW_CHECK_BIN_FAS, _collectionShape.collection.binsVector[binNumber]);
            }

            //add part to new bin if in collection, resize if necessary
            globalMousePoint = event.target.localToGlobal(new Point(rectShape.mouseX, rectShape.mouseY));
            if (isPointInCollection(globalMousePoint)) {
                var bin:J5Bin = _collectionShape.whichBin(globalMousePoint);
                var position:uint = functionMediator.determinePositionInBin(rectShape, bin);
                bin.addToBin(rectShape.part, position);
                rectShape.width = rectShapeSize;
                rectShape.height = rectShapeSize;
                sendNotification(Notifications.NEW_CHECK_BIN_FAS, bin);
            } else {
                resetRectShapeOutOfCollection(rectShape);
            }
            
            //keep rectShapes from being dragged off the canvas
            if (rectShape.x < 0) {
                rectShape.x = 0;
            }
            if (rectShape.y < 0) {
                rectShape.y = 0;
            }
            
            fixIconLabel(rectShape);
            adjustRectShapePosition(rectShape);
            
            if (_collectionShape != null) {
                _collectionShape.calculateMinHeight();
            }
            
            selectedRectShapePosition.x = rectShape.x;
            selectedRectShapePosition.y = rectShape.y;

            functionMediator.setUpCollection();
            sendNotification(Notifications.NEW_UPDATE_STATUS_BAR_BASIC, rectShape);
        }
        
        private function onRectShapeResized(event:Event):void
        {
            var rectShape:RectShape = event.target as RectShape;
            
            rectShape.x = selectedRectShapePosition.x;
            rectShape.y = selectedRectShapePosition.y;
            
            if (j5CollectionProxy.isInCollection(rectShape.part)) {
                rectShape.width = rectShapeSize;
                rectShape.height = rectShapeSize;
            } else {
                rectShape.width = Constants.RECT_SHAPE_DEFAULT_SIZE;
                rectShape.height = Constants.RECT_SHAPE_DEFAULT_SIZE;
            }
            
            fixIconLabel(rectShape);
        }
        
        private function onRectShapeResizing(event:Event) : void
        {
            var rectShape:RectShape = event.target as RectShape;
            fixIconLabel(rectShape);
        }
        
        private function onRectShapeKeyPressed(event:KeyboardEvent):void
        {
            if (event.keyCode == Keyboard.DELETE) {
                deleteSelectedRectShape();
            }
        }
        
        private function keyPressed(event:KeyboardEvent):void
        {
            if (ApplicationFacade.getInstance().getSelectedRectShape() != null) {
                onRectShapeKeyPressed(event);
            } else if (ApplicationFacade.getInstance().getSelectedCollectionShape() != null) {
                onCollectionKeyPressed(event);
            }
        }
        
        private function onCollectionSelected(event:Event):void
        {
            var collShape:CollectionShape = event.target as CollectionShape;
            
            collShape.moveToBack();
            
            oldCollectionShapePosition.x = collShape.x;
            oldCollectionShapePosition.y = collShape.y;
            oldCollectionShapeHeight = collShape.height;
            oldCollectionShapeWidth = collShape.width;

            sendNotification(Notifications.NEW_REFRESH_ALL_RECT_SHAPES);  //to clear highlights
            sendNotification(Notifications.NEW_UPDATE_COLLECTION_DISPLAY_INFO, event.target as CollectionShape);
        }
        
        private function onCollectionMoved(event:ObjectHandleEvent):void
        {
            var collShape:CollectionShape = event.target as CollectionShape;
            
            //keep collectionShapes from being dragged off the canvas
            if (collShape.x < 0) {
                collShape.x = 0;
            }
            if (collShape.y < 0) {
                collShape.y = 0;
            }
            
            //move any free rectShapes that are overlapping the collection out
            var freeRectShapes:Vector.<RectShape> = findFreeRectShapes();
            for (var i:int = 0; i < freeRectShapes.length; i++) {
                adjustRectShapePosition(freeRectShapes[i]);
            }
            
            moveRectShapesOnCollectionShapeMoving(collShape);
        }
        
        private function onCollectionResized(event:ObjectHandleEvent):void
        {
            var collShape:CollectionShape = event.target as CollectionShape;
            collShape.fixBinLines();
            collShape.addLabels();
            
            //move any free rectShapes that are overlapping the collection out
            var freeRectShapes:Vector.<RectShape> = findFreeRectShapes();
            for (var i:int = 0; i < freeRectShapes.length; i++) {
                adjustRectShapePosition(freeRectShapes[i]);
            }
            
            adjustRectShapesOnCollectionShapeResizing(collShape);
        }
        
        private function onCollectionKeyPressed(event:KeyboardEvent):void
        {            
            if (event.keyCode == Keyboard.DELETE) {
                deleteSelectedCollectionShape();
            }
        }
        
        private function onCollectionShapeMoving(event:ObjectHandleEvent):void
        {
            var collShape:CollectionShape = event.target as CollectionShape;
            moveRectShapesOnCollectionShapeMoving(collShape);
        }
            
        private function moveRectShapesOnCollectionShapeMoving(collShape:CollectionShape):void
        {
            var deltaX:Number = collShape.x - oldCollectionShapePosition.x;
            var deltaY:Number = collShape.y - oldCollectionShapePosition.y;
            
            var bin:J5Bin;
            var rectShape:RectShape;
            //for each rect shape in the collection, move it
            for (var i:int = 0; i < collShape.collection.binCount(); i++) {
                bin = collShape.collection.binsVector[i];
                for (var j:int = 0; j < bin.binItemsVector.length; j++) {
                    rectShape = findRectShape(bin.binItemsVector[j]);
                    rectShape.x = rectShape.x + deltaX;
                    rectShape.y = rectShape.y + deltaY;
                }
            }
            
            oldCollectionShapePosition.x = collShape.x;
            oldCollectionShapePosition.y = collShape.y;
        }
        
        private function onCollectionShapeResizing(event:ObjectHandleEvent):void
        {
            var collShape:CollectionShape = event.target as CollectionShape;
            adjustRectShapesOnCollectionShapeResizing(collShape);
        }
        
        public function adjustRectShapesOnCollectionShapeResizing(collShape:CollectionShape):void
        {
            var collShapeX:Number = collShape.x;
            var collShapeY:Number = collShape.y;
            var collShapeWidth:Number = collShape.width;
            var collShapeHeight:Number = collShape.height;
            var oldBinWidth:Number = oldCollectionShapeWidth / collShape.numBins;
            var newBinWidth:Number = collShapeWidth / collShape.numBins;
            
            var maxPartsInBin:uint = 1;  // don't want the collection height to go to 0 even if there are no parts in the collection
            for (var i:int = 0; i < collShape.collection.binCount(); i++) {
                if (collShape.collection.binsVector[i].binItemsVector.length > maxPartsInBin) {
                    maxPartsInBin = collShape.collection.binsVector[i].binItemsVector.length;
                }
            }
            var rectShapeVertSize:Number = (collShapeHeight - (maxPartsInBin + 1) * Constants.BIN_MARGIN) / maxPartsInBin;
            var rectShapeHorizSize:Number = newBinWidth - 2 * Constants.BIN_MARGIN
            var newRectShapeSize:Number = Math.floor(Math.min(rectShapeVertSize, rectShapeHorizSize, Constants.RECT_SHAPE_DEFAULT_SIZE));
            if (newRectShapeSize < Constants.RECT_SHAPE_MIN_SIZE) {
                newRectShapeSize = Constants.RECT_SHAPE_MIN_SIZE;
            }
            
            var binScaleX:Number = (newBinWidth - 2 * Constants.BIN_MARGIN - newRectShapeSize + 1) / (oldBinWidth - 2 * Constants.BIN_MARGIN - rectShapeSize + 1);
            var binScaleY:Number = (collShapeHeight - 2 * Constants.BIN_MARGIN - newRectShapeSize + 1) / (oldCollectionShapeHeight - 2 * Constants.BIN_MARGIN - rectShapeSize + 1);
            
            //trace("binWidth: " + newBinWidth + "  binScaleX: " + binScaleX);
            //trace(collShapeX + "     " + (newBinWidth + collShapeX) + "     " + (2 * newBinWidth + collShapeX) + "     " + (3 * newBinWidth + collShapeX) + "     " + (collShapeWidth + collShapeX));
            
            var bin:J5Bin;
            var rectShape:RectShape;
            //for each rect shape in the collection, move and resize (if necessary) it
            //NOTE: Canvas (which rectShape is) rounds its x and y down to the nearest 0.05
            for (i = 0; i < collShape.collection.binCount(); i++) {
                bin = collShape.collection.binsVector[i];
                for (var j:int = 0; j < bin.binItemsVector.length; j++) {
                    rectShape = findRectShape(bin.binItemsVector[j]);
                    
                    //trace((rectShape.x - (collShapeX + i * oldBinWidth + Constants.BIN_MARGIN)) + "   " + rectShape.x + "   " + (collShapeX + i * oldBinWidth + Constants.BIN_MARGIN) + "   " + binScaleX + "   " + (collShapeX + i * newBinWidth + Constants.BIN_MARGIN));
                    //      distance from bin margin                                                        old position          old bin margin position                                         binScaleX           new bin margin position
                    rectShape.x = ((rectShape.x - (collShapeX + i * oldBinWidth + Constants.BIN_MARGIN)) * binScaleX) + (collShapeX + i * newBinWidth + Constants.BIN_MARGIN);
                    //trace((rectShape.y - (collShapeY + Constants.BIN_MARGIN)) + "     " + rectShape.height + "     " + (collShapeHeight - 2 * Constants.BIN_MARGIN) + "     " + (collShapeHeight - 2 * Constants.BIN_MARGIN - (rectShape.y - (collShapeY + Constants.BIN_MARGIN))));
                    //      distance from bin margin                                        rectShape height             height between bin margins                               distance from top of rectShape to bottom bin margin
                    rectShape.y = ((rectShape.y - (collShapeY + Constants.BIN_MARGIN)) * binScaleY) + (collShapeY + Constants.BIN_MARGIN);
                    //trace(rectShape.x);
                    
                    rectShape.width = newRectShapeSize;
                    rectShape.height = newRectShapeSize;
                    
                    //make sure the rectShape stays in the bin area (they sometimes have a tendancy to shift out of their bins)
                    if (rectShape.x + rectShape.width > collShapeX + (i + 1) * newBinWidth - Constants.BIN_MARGIN) {  // right
                        rectShape.x = collShapeX + (i + 1) * newBinWidth - Constants.BIN_MARGIN - rectShape.width;
                    }
                    if (rectShape.x < collShapeX + i * newBinWidth + Constants.BIN_MARGIN) {  // left
                        rectShape.x = collShapeX + i * newBinWidth + Constants.BIN_MARGIN;
                    }
                    if (rectShape.y + rectShape.height > collShapeY + collShapeHeight - Constants.BIN_MARGIN) {  // bottom
                        rectShape.y = collShapeY + collShapeHeight - Constants.BIN_MARGIN - rectShape.height;
                    }
                    if (rectShape.y < collShapeY + Constants.BIN_MARGIN) {  // top
                        rectShape.y = collShapeY + Constants.BIN_MARGIN;
                    }
                    
                    fixIconLabel(rectShape);
                }
            }
            
            oldCollectionShapeWidth = collShapeWidth;
            oldCollectionShapeHeight = collShapeHeight;
            rectShapeSize = newRectShapeSize;
        }
        
        private function onCopy(event:Event):void
        {
            sendNotification(Notifications.NEW_SET_CLIPBOARD_DATA);
        }
        
        private function onPaste(event:Event):void
        {
            if (Clipboard.generalClipboard.hasFormat(Constants.PART_CLIPBOARD_KEY)) {
                clipboardPart = Clipboard.generalClipboard.getData(Constants.PART_CLIPBOARD_KEY) as Part;

                //this links up the sequenceFile if it already exists or adds it to sequenceFileProxy if it does not
                if (clipboardPart.sequenceFile != null) {
                    try {
                        clipboardPart.sequenceFile = sequenceFileProxy.addSequenceFile(clipboardPart.sequenceFile.sequenceFileFormat, clipboardPart.sequenceFile.sequenceFileContent, clipboardPart.sequenceFile.sequenceFileName);
                    } catch (error:Error) {
                        Alert.show(error.toString(), "Error Message");
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
        
        private function onClear(event:Event):void {  //this is delete
            if (ApplicationFacade.getInstance().getSelectedRectShape() != null) {
                deleteSelectedRectShape();
            } else if (ApplicationFacade.getInstance().getSelectedCollectionShape() != null) {
                deleteSelectedCollectionShape();
            }
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
        
        private function pasteCopiedPart(isShadowCopy:Boolean, newName:String = ""):RectShape
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
                newPartVO.sequenceFile = clipboardPart.sequenceFile;
                newPartVO.iconID = clipboardPart.iconID;
                
                part = partProxy.createPart(newPartVO);
            }
            
            //copy the direction and FAS
            part.directionForward = clipboardPart.directionForward;
            part.fas = clipboardPart.fas;
            
            //create the RectShape
            var newRectShape:RectShape = createRectShape(_centerCanvas.gridCanvas.globalToContent(globalMousePoint), part, true);
            var hasEugeneRules:Boolean = eugeneRuleProxy.getRulesByPartVO(part.partVO).length > 0 ? true: false;
            if (hasEugeneRules) {
                newRectShape.eugeneRuleIndicator.visible = true;
            }
            
            //put in bin if appropriate
            if (isPointInCollection(globalMousePoint)) {
                var bin:J5Bin = _collectionShape.whichBin(globalMousePoint);
                var position:uint = functionMediator.determinePositionInBin(newRectShape, bin);
                bin.addToBin(part, position);
                newRectShape.width = rectShapeSize;
                newRectShape.height = rectShapeSize;
                fixIconLabel(newRectShape);
            }
            
            adjustRectShapePosition(newRectShape);
            
            if (_collectionShape != null) {
                _collectionShape.calculateMinHeight();
            }
            
            //copy the label info
            newRectShape.setLabel();
            newRectShape.updateLabel();
            
            sendNotification(Notifications.PART_STATUS_CHANGED, newRectShape.part);
            return newRectShape;								
        }
        
        private function onCancelPasteDialog(event:Event):void
        {
            PopUpManager.removePopUp(pasteDialog);
        }
        
        private function onMouseMove(event:MouseEvent):void
        {
            globalMousePoint = event.target.localToGlobal(new Point(event.localX, event.localY));
            
            var binIndex:int;
            if (isPointInCollection(globalMousePoint)) {
                binIndex = _collectionShape.whichBinIndex(globalMousePoint);
                //trace("bin " + binIndex);
                
            }
            
            //trace(_centerCanvas.gridCanvas.contentMouseX + ", " + _centerCanvas.gridCanvas.contentMouseY);
        }
        
        private function shapeDeselected(event:Event):void
        {
            sendNotification(Notifications.NEW_REFRESH_ALL_RECT_SHAPES);
            sendNotification(Notifications.NEW_CLEAR_DISPLAY_INFO);
        }
        
        private function onShowClipboardPasteDialog(event:Event):void
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
        }
        
        private function onClipboardPasteDialogDone(event:Event):void
        {
            PopUpManager.removePopUp(clipboardPasteDialog);
            
            // copied from MainCanvasMediator.showPartDefinitionDialog
            partDefinitionDialog = new PartDefinitionDialog();
            
            partDefinitionDialog.addEventListener(PartDefinitionDialog.DONE, onPartDefinitionDialogDone);
            partDefinitionDialog.addEventListener(PartDefinitionDialog.CANCEL, onPartDefinitionDialogCancel);
            PopUpManager.addPopUp(partDefinitionDialog, ApplicationFacade.getInstance().application, true);
            PopUpManager.centerPopUp(partDefinitionDialog);
                    
            partDefinitionDialog.partNameInput.text = ApplicationFacade.getInstance().getSelectedRectShape().part.name;
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
        
        private function onPartDefinitionDialogDone(event:Event):void
        {
            // copied from MainCanvasMediator.onCompleteGenbankImport
            // this is the map from clipboard version
            var partName:String = partDefinitionDialog.partNameInput.text;
            if (partName == "") {
                Alert.show("Please choose a name for the part.", "Error Message");
                return;
            }
            if (!functionMediator.isLegalName(partName)) {
                Alert.show("Illegal name. Name can only contain alphanumeric characters, underscore (_), and hyphen (-).", "Error Message");
                return;
            }
            if (partName != ApplicationFacade.getInstance().getSelectedRectShape().part.name && !partProxy.isUniquePartName(partName)) {
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
            
            var part:Part = ApplicationFacade.getInstance().getSelectedRectShape().part;
            
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
                
                sendNotification(Notifications.NEW_REFRESH_ALL_RECT_SHAPES);
                sendNotification(Notifications.NEW_UPDATE_PART_DISPLAY_INFO, part);
                sendNotification(Notifications.NEW_UPDATE_STATUS_BAR_BASIC, ApplicationFacade.getInstance().getSelectedRectShape());
                
                functionMediator.setUpCollection();	
                
                mainCanvasMediator.mainCanvas.rightCanvas.infoPanel.j5Panel.changePartDefButton.enabled = true;
            } catch (error:Error) {
                Alert.show(error.toString(), "Error Message");
            }
            
            PopUpManager.removePopUp(partDefinitionDialog);
        }
        
        private function onPartDefinitionDialogCancel(event:Event):void
        {
            PopUpManager.removePopUp(partDefinitionDialog);
        }
        
        private function ioError(e:IOErrorEvent):void
        {
            Alert.show("Error saving file : " + e.text + "\nPossibly a file is open already with this name", "Error Message");
        }
        
        private function designXMLSaved(e:Event):void
        {
            var fr:FileReference = e.target as FileReference;
            
            sendNotification(Notifications.CHANGE_TITLE, fr.name);
            mainCanvasMediator.lastLoadString = fr.name;
            Logger.getInstance().info("Design saved");
        }
        
        private function changeIcon(event:Event):void
        {
            sendNotification(Notifications.NEW_OPEN_CHANGE_ICON_DIALOG);
        }
    }
}