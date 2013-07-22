package org.jbei.registry.view.ui
{
    import flash.events.Event;
    
    public class PlasmidLinkButtonEvent extends Event
    {
        public static const BUTTON_CLICKED:String = "buttonClicked";
        
        private var _plasmidFileName:String;
        
        // Constructor
        public function PlasmidLinkButtonEvent(type:String, plasmidFileName:String, bubbles:Boolean=true, cancelable:Boolean=true)
        {
            super(type, bubbles, cancelable);
            
            _plasmidFileName = plasmidFileName;
        }
        
        public function get plasmidFileName():String
        {
            return _plasmidFileName;
        }
        
        public function set plasmidFileName(name:String):void
        {
            _plasmidFileName = name;
        }
    }
}