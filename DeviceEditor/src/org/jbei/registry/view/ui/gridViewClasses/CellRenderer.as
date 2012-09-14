package org.jbei.registry.view.ui.gridViewClasses
{
    import flash.desktop.Clipboard;
    import flash.display.Graphics;
    import flash.events.ContextMenuEvent;
    import flash.events.Event;
    import flash.events.MouseEvent;
    import flash.ui.ContextMenu;
    import flash.ui.ContextMenuItem;
    
    import mx.containers.Canvas;
    import mx.controls.Label;
    import mx.core.Container;
    import mx.core.UIComponent;
    
    import org.jbei.registry.Constants;
    import org.jbei.registry.models.Part;
    import org.jbei.registry.view.ui.Colors;
    import org.jbei.registry.view.ui.IPartRenderer;
    
    /**
     * @author Joanna Chen
     */
    public class CellRenderer extends UIComponent implements IPartRenderer
    {
        public static const WIDTH:int = 150;
        public static const HEIGHT:int = 40;
        
        public static const RIGHT_CLICK:String = "rightClick";
        
        private static const HIGHLIGHT_ALPHA:Number = 0.05;
        private static const HIGHLIGHT_COLOR:uint = 0x0051FF;
        private static const RECTANGLE_MARGIN:Number = 3;
        
        public static const MAP_GENBANK_MENU_ITEM:ContextMenuItem = new ContextMenuItem("Map from Genbank");
        public static const MAP_CLIPBOARD_MENU_ITEM:ContextMenuItem = new ContextMenuItem("Map from Clipboard");
        
        private var _column:int;
        private var _row:int;
        
        private var _borderColor:uint = Colors.UNMAPPED_RED;
        private var _borderThickness:Number; //internally calculated
        private var _eugeneIndicatorVisible:Boolean = false;
        private var _fasConflict:Boolean = false;
        private var _fasIndicatorVisible:Boolean = false;
        private var _linkedSelected:Boolean = false;
        private var _selected:Boolean = false;
        
        private var _part:Part;
        
        private var fasConflictChanged:Boolean = false;
        
        private var customContextMenu:ContextMenu;
        
        //UI children
        private var nameLabel:Label;
        private var transparentClickOverlay:Canvas;
        private var eugeneIndicator:EugeneRuleIndicator;
        private var fasIndicator:FASIndicator;

        public function CellRenderer()
        {
            super();
            
            width = WIDTH;
            height = HEIGHT;
            
            //add right click menu
            customContextMenu = new ContextMenu();
            
            customContextMenu.hideBuiltInItems();
            customContextMenu.clipboardMenu = true;
            customContextMenu.clipboardItems.selectAll = false;
            
            contextMenu = customContextMenu;
            
            customContextMenu.customItems = new Array;
            customContextMenu.customItems.push(MAP_GENBANK_MENU_ITEM);
            customContextMenu.customItems.push(MAP_CLIPBOARD_MENU_ITEM);

            customContextMenu.addEventListener(ContextMenuEvent.MENU_SELECT, onContextMenuSelect);
        }
        
        public function get column():int
        {
            return _column;
        }
        
        public function set column(c:int):void
        {
            _column = c;
        }
        
        public function get row():int
        {
            return _row;
        }
        
        public function set row(r:int):void
        {
            _row = r;
        }
        
        public function set borderColor(value:uint):void
        {
            if (value != _borderColor) {
                _borderColor = value;
                invalidateDisplayList();
            }
        }
        
        public function get eugeneIndicatorVisible():Boolean //TODO: are these getters necessary? remove if not
        {
            return _eugeneIndicatorVisible;
        }
        
        public function set eugeneIndicatorVisible(value:Boolean):void
        {
            if (value != _eugeneIndicatorVisible) {
                _eugeneIndicatorVisible = value;
                invalidateProperties();
                invalidateDisplayList();
            }
        }
        
        public function get fasConflict():Boolean
        {
            return _fasConflict;
        }
        
        public function set fasConflict(value:Boolean):void
        {
            if (value != _fasConflict) {
                _fasConflict = value;
                fasConflictChanged = true;
                invalidateProperties();
                invalidateDisplayList();
            }
        }
        
        public function get fasIndicatorVisible():Boolean
        {
            return _fasIndicatorVisible;
        }
        
        public function set fasIndicatorVisible(value:Boolean):void
        {
            if (value != _fasIndicatorVisible) {
                _fasIndicatorVisible = value;
                invalidateProperties();
                invalidateDisplayList();
            }
        }
        
        public function set linkedSelected(value:Boolean):void
        {
            if (value != _linkedSelected) {
                _linkedSelected = value;
                invalidateProperties();
                invalidateDisplayList();
            }
        }
        
        public function get selected():Boolean
        {
            return _selected;
        }
        
        public function set selected(value:Boolean):void
        {
            if (value != _selected) {
                _selected = value;
                invalidateProperties();
                invalidateDisplayList();
            }
        }
        
        public function get part():Part
        {
            return _part;
        }
        
        public function set part(value:Part):void
        {
            if (value != _part) {
                _part = value;
                invalidateProperties();
                invalidateDisplayList();
            }
            
            //TODO: reset properties on part delete
        }
        
        public function updateLabel():void
        {
            if (part == null) {
                nameLabel.text = "";
                return;
            }
            
            if (_part.name != nameLabel.text) {
                nameLabel.text = _part.name;
                invalidateProperties(); //to trigger redraw if part became non-empty by getting a name
                invalidateDisplayList();
            }
        }
        
        protected override function createChildren():void
        {
            super.createChildren();
            
            if (!nameLabel) {
                nameLabel = new Label();
                nameLabel.setStyle("fontSize", 12);
                nameLabel.setStyle("fontWeight", "bold");
                nameLabel.move(5,10);
                nameLabel.setActualSize(WIDTH - 2 * 5, 25);
                addChild(nameLabel);
            }
            
            if (!transparentClickOverlay && nameLabel != null) {
                //need this on top of nameLabel in order for clipboard context menu to work correctly
                //otherwise the TextField object in nameLabel will take control of clipboard context menu state
                transparentClickOverlay = new Canvas();
                var g:Graphics = transparentClickOverlay.graphics;
                g.beginFill(0xFFFFFF, 0);
                g.drawRect(RECTANGLE_MARGIN, RECTANGLE_MARGIN, width-2*RECTANGLE_MARGIN, height-2*RECTANGLE_MARGIN);
                g.endFill();
                addChild(transparentClickOverlay);
            }
        }
        
        protected override function commitProperties():void
        {
            super.commitProperties();
            
            //TODO: flags for which properties needs to be updated
            
            if (_part == null || _part.isEmpty()) {
                _borderThickness = NaN;
            } else if (_selected || _linkedSelected ) {
                _borderThickness = 2;
            } else {
                _borderThickness = 1;
            }
            
            if (_eugeneIndicatorVisible && !eugeneIndicator) { //turn on Eugene indicator
                eugeneIndicator = new EugeneRuleIndicator();
                addChild(eugeneIndicator);
                eugeneIndicator.move(unscaledWidth - 5 - eugeneIndicator.width, unscaledHeight - 5 - eugeneIndicator.height);
                eugeneIndicator.setActualSize(eugeneIndicator.width, eugeneIndicator.height);
            }
            
            if (_eugeneIndicatorVisible == false && eugeneIndicator != null) { //turn off Eugene indicator
                removeChild(eugeneIndicator);
                eugeneIndicator = null;
            }
            
            if (_fasIndicatorVisible && !fasIndicator) { //turn on FAS indicator
                fasIndicator = new FASIndicator();
                fasIndicator.fasConflict = _fasConflict; //set color
                fasConflictChanged = false;
                addChild(fasIndicator);
                fasIndicator.move(5, 5);
                fasIndicator.setActualSize(fasIndicator.width, fasIndicator.height);
            }
            
            if (_fasIndicatorVisible == false && fasIndicator != null) { //turn off FAS indicator
                removeChild(fasIndicator);
                fasIndicator = null;
            }
            
            if (fasConflictChanged && fasIndicator != null) { //update FAS indicator color
                fasIndicator.fasConflict = _fasConflict;
                fasConflictChanged = false;
            }
        }
        
        protected override function updateDisplayList(unscaledWidth:Number, unscaledHeight:Number):void
        {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            
            graphics.clear();
            
            graphics.lineStyle(_borderThickness, _borderColor);
            graphics.beginFill(HIGHLIGHT_COLOR, _selected ? HIGHLIGHT_ALPHA : 0);
            graphics.drawRect(RECTANGLE_MARGIN, RECTANGLE_MARGIN, width-2*RECTANGLE_MARGIN, height-2*RECTANGLE_MARGIN);
            graphics.endFill();
        }
        
        private function onContextMenuSelect(event:ContextMenuEvent):void
        {
            dispatchEvent(new Event(RIGHT_CLICK));
            
            if (_part == null || _part.isEmpty()) {
                customContextMenu.clipboardItems.copy = false;
                customContextMenu.clipboardItems.cut = false;
                customContextMenu.clipboardItems.clear = false;
            } else {
                customContextMenu.clipboardItems.copy = true;
                customContextMenu.clipboardItems.cut = true;
                customContextMenu.clipboardItems.clear = true;
            }
            
            if (column == -1) {
                //cell is in part holding area (outside collection); can only cut, not copy
                customContextMenu.clipboardItems.copy = false;
            }
            
            if (Clipboard.generalClipboard.hasFormat(Constants.PART_CLIPBOARD_KEY) && (_part == null || _part.isEmpty())) {
                customContextMenu.clipboardItems.paste = true;
            } else {
                customContextMenu.clipboardItems.paste = false;
            }
        }
    }
}