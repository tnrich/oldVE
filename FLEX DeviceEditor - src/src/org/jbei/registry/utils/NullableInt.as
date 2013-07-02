package org.jbei.registry.utils
{
    public class NullableInt
    {
        private var _value:int;
        
        public function NullableInt(i:int)
        {
            _value = i;
        }
        
        public function get value():int
        {
            return _value;
        }
        
        public function toString():String
        {
            return _value.toString();
        }
    }
}