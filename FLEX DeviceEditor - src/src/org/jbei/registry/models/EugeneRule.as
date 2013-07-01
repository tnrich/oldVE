package org.jbei.registry.models
{
    public class EugeneRule
    {
        [Deprecated]
        public static const NOTMORETHAN:String = "NOTMORETHAN";
        [Deprecated]
        public static const NOTWITH:String = "NOTWITH";
        
        public static const AFTER:String = "AFTER";
        public static const BEFORE:String = "BEFORE";
        public static const WITH:String = "WITH";
        public static const THEN:String = "THEN";
        public static const NEXTTO:String = "NEXTTO";
        public static const MORETHAN:String = "MORETHAN";
        
        private var _name:String;
        private var _negationOperator:Boolean;
        private var _operand1:PartVO;
        private var _compositionalOperator:String;
        private var _operand2:*;
        
        public function EugeneRule()
        {
        }
        
        public function get name():String
        {
            return _name;
        }
        
        public function set name(name:String):void
        {
            _name = name;
        }
        
        public function get negationOperator():Boolean
        {
            return _negationOperator;
        }
        
        public function set negationOperator(value:Boolean):void
        {
            _negationOperator = value;
        }
        
        public function get operand1():PartVO
        {
            return _operand1;
        }
        
        public function set operand1(operand1:PartVO):void
        {
            _operand1 = operand1;
        }
        
        public function get compositionalOperator():String
        {
            return _compositionalOperator;
        }
        
        public function set compositionalOperator(op:String):void
        {
            _compositionalOperator = op;
        }
        
        public function get operand2():* //Number or PartVO
        {
            return _operand2;
        }
        
        public function set operand2(operand:*):void
        {
            if (operand is Number || operand is PartVO) {
                _operand2 = operand;
            } else {
                throw new Error("Illegal operand2. Must be a Number or PartVO");
            }
        }
    }
}