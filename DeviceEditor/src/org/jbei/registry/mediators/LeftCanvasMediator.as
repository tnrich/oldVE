package org.jbei.registry.mediators
{
    import com.roguedevelopment.objecthandles.ObjectHandleEvent;
    
    import flash.events.Event;
    import flash.events.KeyboardEvent;
    import flash.events.MouseEvent;
    import flash.geom.Point;
    
    import mx.collections.ArrayCollection;
    import mx.containers.Box;
    import mx.controls.Image;
    import mx.controls.TileList;
    import mx.controls.ToolTip;
    import mx.events.ListEvent;
    import mx.managers.PopUpManager;
    import mx.managers.ToolTipManager;
    
    import org.jbei.registry.ApplicationFacade;
    import org.jbei.registry.Notifications;
    import org.jbei.registry.SBOLvIcons;
    import org.jbei.registry.api.Entry;
    import org.jbei.registry.view.ui.shapes.CollectionShape;
    import org.jbei.registry.view.ui.shapes.RectShape;
    import org.jbei.registry.view.ui.Colors;
    import org.jbei.registry.view.ui.canvas.LeftCanvas;
    import org.jbei.registry.view.ui.canvas.PartsCanvas;
    import org.jbei.registry.view.ui.dialogs.ChangeIconDialog;
    import org.puremvc.as3.interfaces.INotification;
    import org.puremvc.as3.patterns.mediator.Mediator;
    
    public class LeftCanvasMediator extends Mediator
    {
        public static const NAME:String = "LeftCanvasMediator";
        
        private var _leftCanvas:LeftCanvas;
        
        private var changeIconDialog:ChangeIconDialog;
        
        private var _imagePaths:Array = new Array();
        
        [Bindable]
        private var imagePathsDataProvider:ArrayCollection;
        
        private var sbolvIconsDataProvider:ArrayCollection;
        
        private var collectionIconList:Vector.<CollectionShape> = new Vector.<CollectionShape>;
        
        
        public function LeftCanvasMediator(viewComponent:LeftCanvas)
        {
            super(NAME, viewComponent);
            _leftCanvas = viewComponent as LeftCanvas;
            
            //get all the paths for the images
            initSbolvIconsDataProvider();
            _leftCanvas.partsPanel.partsCanvas.imageTileList.dataProvider = sbolvIconsDataProvider;
            _leftCanvas.partsPanel.partsCanvas.imageTileList.addEventListener(ListEvent.ITEM_CLICK, addRectShape);
            
            initCollectionShapeIcons();
        }
        
        public function get imagePaths():Array
        {
            return _imagePaths;
        }
        
        public override function listNotificationInterests():Array
        {
            return [Notifications.NEW_OPEN_CHANGE_ICON_DIALOG
            ];
        }
        
        public override function handleNotification(notification:INotification):void
        {
            switch (notification.getName()) {
                case Notifications.NEW_OPEN_CHANGE_ICON_DIALOG:
                    openChangeIconDialog();
                    break;
            }
        }
        
        public function initCollectionShapeIcons():void
        {
            //Staring point
            var point:Point = new Point(10, 10);
            var newCollection:CollectionShape = createCollectionShape(point);
            
            newCollection.completeLock();
            newCollection.setTextLabel();
                        
            _leftCanvas.partsPanel.collectionCanvas.addChild(newCollection);	
        }
        
        private function initSbolvIconsDataProvider():void
        {
            sbolvIconsDataProvider = new ArrayCollection();
            
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.PROMOTER));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.OPERATOR_SITE));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.CDS));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.FIVE_PRIME_UTR));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.TERMINATOR));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.INSULATOR));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.RIBONUCLEASE_SITE));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.RNA_STABILITY_ELEMENT));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.PROTEASE_SITE));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.PROTEIN_STABILITY_ELEMENT));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.ORIGIN_OF_REPLICATION));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.PRIMER_BINDING_SITE));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.RESTRICTION_ENZYME_RECOGNITION_SITE));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.FIVE_PRIME_OVERHANG));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.THREE_PRIME_OVERHANG));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.RESTRICTION_SITE_NO_OVERHANG));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.ASSEMBLY_JUNCTION));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.SIGNATURE));
            sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.GENERIC));
        }

        // Event Handlers
        private function addRectShape(event:ListEvent):void
        {
            var iconID:String = event.itemRenderer.data.id;
            sendNotification(Notifications.NEW_ADD_RECT_SHAPE, iconID);
        }
        
        private function createCollectionShape(point:Point):CollectionShape
        {
            var collectionShape:CollectionShape = new CollectionShape();
            collectionShape.initShape();
            collectionShape.initCollectionShape(point);
            
            collectionShape.addEventListener(ObjectHandleEvent.OBJECT_SELECTED, onCollectionShapeClicked);

            collectionIconList.push(collectionShape);
            
            return collectionShape;
        }
        
        private function onCollectionShapeClicked(event:Event):void
        {
            sendNotification(Notifications.NEW_LEFT_CANVAS_COLLECTION_CLICKED);
        }
        
        private function openChangeIconDialog():void
        {
            changeIconDialog = new ChangeIconDialog();
            PopUpManager.addPopUp(changeIconDialog, ApplicationFacade.getInstance().application, true);
            PopUpManager.centerPopUp(changeIconDialog);
            changeIconDialog.imageTileList.dataProvider = sbolvIconsDataProvider;
            changeIconDialog.imageTileList.addEventListener(ListEvent.ITEM_CLICK, changeIcon);  //must be added after creation of popup
            changeIconDialog.addEventListener(ChangeIconDialog.CANCEL, onChangeIconDialogCancel);
        }
        
        private function changeIcon(event:ListEvent):void
        {
            var iconID:String = event.itemRenderer.data.id;
            sendNotification(Notifications.NEW_CHANGE_ICON, iconID);
            PopUpManager.removePopUp(changeIconDialog);
        }
        
        private function onChangeIconDialogCancel(event:Event):void
        {
            PopUpManager.removePopUp(changeIconDialog);
        }
    }
}