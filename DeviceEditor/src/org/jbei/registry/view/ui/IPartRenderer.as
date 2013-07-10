package org.jbei.registry.view.ui
{
    import org.jbei.registry.models.Part;

    /**
     * @author Joanna Chen
     */
    public interface IPartRenderer
    {
//        function get directionForward():Boolean;
//        function set directionForward(value:Boolean):void;
        
        function set borderColor(value:uint):void;
        
//        function get eugeneIndicatorVisible():Boolean;
        function set eugeneIndicatorVisible(value:Boolean):void;
        
//        function get fasConflict():Boolean;
        function set fasConflict(value:Boolean):void;
        
//        function get fasIndicatorVisible():Boolean;
        function set fasIndicatorVisible(value:Boolean):void;
        
        function set linkedSelected(value:Boolean):void;
        
//        function get selected():Boolean;
        function set selected(value:Boolean):void;
        
        function get part():Part;
        function set part(value:Part):void;
        
        function updateLabel():void;
    }
}