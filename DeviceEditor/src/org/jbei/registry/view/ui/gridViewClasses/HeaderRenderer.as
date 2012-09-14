package org.jbei.registry.view.ui.gridViewClasses
{
    import flash.events.Event;
    import flash.events.MouseEvent;
    
    import mx.controls.Button;
    import mx.controls.Image;
    import mx.controls.Label;
    import mx.core.UIComponent;
    
    import org.jbei.registry.SBOLvIcons;
    import org.jbei.registry.models.SBOLvIconInfo;
    import org.jbei.registry.view.ui.Colors;

    public class HeaderRenderer extends UIComponent
    {
        public static const HEIGHT:int = 70;
        public static const ICON_SIZE:int = 56;
        
        public static const CHANGE_DIRECTION:String = "ChangeDirection";
        public static const CHANGE_ICON:String = "ChangeIcon";
        
        [Embed(source="/assets/editIcon.png")]
        private static const EditIcon:Class;
        
        [Embed(source="/assets/forwardIcon.png")]
        private static const ForwardIcon:Class;
        
        [Embed(source="/assets/reverseIcon.png")]
        private static const ReverseIcon:Class;
        
        private var _column:int;
        
        private var _directionForward:Boolean;
        private var _iconID:String;
        
        private var directionChanged:Boolean = false;
        private var iconIDChanged:Boolean = false;
        
        //UI children
        private var binNameLabel:Label;
        private var editButton:Button;
        private var changeDirectionButton:Button;
        private var icon:Image;
        
        public function HeaderRenderer(imagePath:String = null)
        {
            super();
            
            width = CellRenderer.WIDTH;
            height = HEIGHT;
            
            _directionForward = true;
            _iconID = SBOLvIcons.GENERIC;
        }
        
        public function get column():int
        {
            return _column;
        }
        
        public function set column(c:int):void
        {
            _column = c;
        }
        
        public function set directionForward(value:Boolean):void
        {
            if (value != _directionForward) {
                _directionForward = value;
                directionChanged = true;
                invalidateProperties();
                invalidateDisplayList();
            }
        }
        
        public function set iconID(value:String):void
        {
            if (value != _iconID) {
                _iconID = value;
                iconIDChanged = true;
                invalidateProperties();
                invalidateDisplayList();
            }
        }
        
        public function updateBinName(name:String):void
        {
            if (name != binNameLabel.text) {
                binNameLabel.text = name;
            }
        }
        
        protected override function createChildren():void
        {
            super.createChildren();
            
            if (!icon) {
                icon = new Image();
                icon.source = SBOLvIcons.getIconPath(_iconID, _directionForward);
                icon.move((CellRenderer.WIDTH - ICON_SIZE)/2, 0);
                icon.setActualSize(ICON_SIZE, ICON_SIZE);
                addChild(icon);
            }
            
            if (!editButton) {
                editButton = new Button();
                editButton.setStyle("icon", EditIcon);
                editButton.toolTip = "Change icon";
                editButton.addEventListener(MouseEvent.CLICK, onEditIconClick);
                editButton.move(CellRenderer.WIDTH - 16 - 5, 5);
                editButton.setActualSize(16, 16);
                addChild(editButton);
            }
            
            if (!changeDirectionButton) {
                changeDirectionButton = new Button();
                changeDirectionButton.setStyle("icon", ForwardIcon);
                changeDirectionButton.toolTip = "Change direction";
                changeDirectionButton.addEventListener(MouseEvent.CLICK, onRotateIconClick);
                changeDirectionButton.move(CellRenderer.WIDTH - 16 - 5, 26);
                changeDirectionButton.setActualSize(16, 16);
                addChild(changeDirectionButton);
            }
            
            if (!binNameLabel) {
                binNameLabel = new Label();
                binNameLabel.setStyle("fontSize", 12);
                binNameLabel.setStyle("fontWeight", "bold");
                binNameLabel.move(5,49);
                binNameLabel.setActualSize(CellRenderer.WIDTH - 2 * 5, 25);
                addChild(binNameLabel);
            }
        }
        
        protected override function commitProperties():void
        {
            super.commitProperties();
            
            if (directionChanged && iconIDChanged) {
                icon.source = SBOLvIcons.getIconPath(_iconID, _directionForward);
                changeDirectionButton.setStyle("icon", _directionForward ? ForwardIcon : ReverseIcon);
                directionChanged = false;
                iconIDChanged = false;
            }
            
            if (directionChanged) {
                icon.source = SBOLvIcons.getIconPath(_iconID, _directionForward);
                changeDirectionButton.setStyle("icon", _directionForward ? ForwardIcon : ReverseIcon);
                directionChanged = false;
            }
            
            if (iconIDChanged) {
                icon.source = SBOLvIcons.getIconPath(_iconID, _directionForward);
                iconIDChanged = false;
            }
        }
        
        protected override function updateDisplayList(unscaledWidth:Number, unscaledHeight:Number):void
        {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            
            graphics.clear();
            
            graphics.beginFill(Colors.WHITE);
            graphics.drawRect(1, 1, CellRenderer.WIDTH - 1, HEIGHT - 4);
            graphics.endFill();
        }
        
        private function onEditIconClick(event:MouseEvent):void
        {
            dispatchEvent(new Event(CHANGE_ICON));
        }
        
        private function onRotateIconClick(event:MouseEvent):void
        {
            dispatchEvent(new Event(CHANGE_DIRECTION));
        }
    }
}