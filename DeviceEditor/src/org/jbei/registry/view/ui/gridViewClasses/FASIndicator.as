package org.jbei.registry.view.ui.gridViewClasses
{
    import mx.core.UIComponent;
    
    /**
     * @author Joanna Chen
     */
    public class FASIndicator extends UIComponent
    {
        private const INDICATOR_NORMAL_COLOR:uint = 0x2C6BF2;
        private const INDICATOR_CONFLICT_COLOR:uint = 0xE01B1B;
        private const INDICATOR_HEIGHT:Number = 7;
        private const INDICATOR_WIDTH:Number = 13;
        
        private var indicatorColor:uint;
        
        public function FASIndicator()
        {
            super();
            
            width = INDICATOR_WIDTH;
            height = INDICATOR_HEIGHT;
        }
        
        public function set fasConflict(value:Boolean):void
        {
            if (value == true && indicatorColor != INDICATOR_CONFLICT_COLOR) {
                indicatorColor = INDICATOR_CONFLICT_COLOR;
                invalidateDisplayList();
            } else if (value == false && indicatorColor != INDICATOR_NORMAL_COLOR) {
                indicatorColor = INDICATOR_NORMAL_COLOR;
                invalidateDisplayList();
            }
        }
        
        protected override function updateDisplayList(unscaledWidth:Number, unscaledHeight:Number):void
        {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            
            graphics.beginFill(indicatorColor);
            graphics.drawRect(0, 0, INDICATOR_WIDTH, INDICATOR_HEIGHT);
            graphics.endFill();
        }
    }
}