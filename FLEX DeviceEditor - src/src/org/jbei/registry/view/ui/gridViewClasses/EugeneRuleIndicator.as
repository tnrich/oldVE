package org.jbei.registry.view.ui.gridViewClasses
{
    import mx.core.UIComponent;
    
    import org.jbei.registry.Constants;
    
    /**
     * @author Joanna Chen
     */
    public class EugeneRuleIndicator extends UIComponent
    {
        private const INDICATOR_COLOR:uint = 0xFF9F30;
        private const INDICATOR_RADIUS:Number = 4;
        
        public function EugeneRuleIndicator()
        {
            super();
            
            width = 2 * INDICATOR_RADIUS;
            height = 2 * INDICATOR_RADIUS;
        }
        
        protected override function measure():void
        {
            super.measure();
            
            measuredWidth = 2 * INDICATOR_RADIUS;
            measuredHeight = 2 * INDICATOR_RADIUS;
        }
        
        protected override function updateDisplayList(unscaledWidth:Number, unscaledHeight:Number):void
        {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            
            graphics.beginFill(INDICATOR_COLOR);
            graphics.drawCircle(INDICATOR_RADIUS, INDICATOR_RADIUS, INDICATOR_RADIUS);
            graphics.endFill();
        }
    }
}