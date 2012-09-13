package org.jbei.registry.models
{
    public class SBOLvIconInfo
    {
        private var _id:String;
        private var _name:String;
        private var _forwardPath:String;
        private var _reversePath:String;
        
        // Constructor
        public function SBOLvIconInfo(id:String, name:String, forwardPath:String, reversePath:String)
        {
            _id = id;
            _name = name;
            _forwardPath = forwardPath;
            _reversePath = reversePath;
        }
        
        // Properties
        public function get id():String
        {
            return _id;
        }
        
        public function get name():String
        {
            return _name;
        }
        
        public function get forwardPath():String
        {
            return _forwardPath;
        }
        
        public function get reversePath():String
        {
            return _reversePath;
        }
    }
}