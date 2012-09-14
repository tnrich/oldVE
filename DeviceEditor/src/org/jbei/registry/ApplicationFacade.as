// ActionScript file

//Author: Doug Densmore

package org.jbei.registry
{

    import com.roguedevelopment.objecthandles.Selectable;
    import com.roguedevelopment.objecthandles.SelectionManager;
    
    import org.jbei.registry.commands.CheckBinFasCommand;
    import org.jbei.registry.commands.FunctionMediator;
    import org.jbei.registry.commands.InitializationCommand;
    import org.jbei.registry.commands.SaveDesignXMLCommand;
    import org.jbei.registry.commands.UpdateJ5ParametersCommand;
    import org.jbei.registry.view.ui.IPartRenderer;
    import org.jbei.registry.view.ui.MainCanvas;
    import org.jbei.registry.view.ui.shapes.CollectionShape;
    import org.jbei.registry.view.ui.shapes.RectShape;
    import org.puremvc.as3.patterns.facade.Facade;

	public class ApplicationFacade extends Facade
	{
        public static const DRAG_DROP_VIEW:String = "dragDropView";
        public static const GRID_VIEW:String = "gridView";
	
		private var _application:DeviceEditor;
		
		//Used to keep the j5 session id information 
		private var _sessionId:String;

        //Used to keep the root directory of the j5 installation
        private var _rootDir:String;
        
        //Used to keep a global version of the latest copied shape
		private var _copyShape:RectShape = null;
		
		//Used to keep a global version of the latest copied collection
		private var _copyCollection:CollectionShape = null;
        
        //Keep the state of DeviceEditor properties
        private var _isDigestRuleEnabled:Boolean = true; //enabled by default
        
        //Keep track of the view in use
        private var _activeView:String = GRID_VIEW;
        
        private var _selectedPartRenderer:IPartRenderer;

		// Properties get and set functions
        public function get application():DeviceEditor
        {
        	return _application;
        }
	
		public function set sessionId(value:String):void
        {
       		_sessionId = value;
        }
                
        public function get sessionId():String
        {
        	return _sessionId;
        }
        
        public function set rootDir(value:String):void
        {
            _rootDir = value;
        }
        
        public function get rootDir():String
        {
            return _rootDir;
        }

   
        // Protected Methods
        protected override function initializeController():void
        {
               super.initializeController();
                        
               registerCommand(Notifications.INITIALIZATION, InitializationCommand);
               //registerCommand(Notifications.ADD_COLLECTION, AddCollectionCommand);
               
               //register new Commands here
               registerCommand(Notifications.NEW_CHECK_BIN_FAS, CheckBinFasCommand);
               registerCommand(Notifications.NEW_UPDATE_J5_PARAMETERS, UpdateJ5ParametersCommand);
               registerCommand(Notifications.NEW_SAVE_XML, SaveDesignXMLCommand);
       }


		// System Public Methods
        public static function getInstance():ApplicationFacade
        {
        		if(instance == null) {
                	instance = new ApplicationFacade();
                }
                        
        	return instance as ApplicationFacade;
        }


        public function initializeApplication(app:DeviceEditor):void
        {
        	_application = app;
       	}
       	
       	
       	public function initializeComponents(mainCanvas:MainCanvas):void
        {
           //FIXME - Not the cleanest implementation.....
           _application.mappingBar.mainCanvas = mainCanvas;
           _application.statusBar.mainCanvas = mainCanvas;
        }
        
        public function set copyShape(s:RectShape):void
        {
        	_copyShape = s;
        	//need to clear the other 
        	_copyCollection = null;
        }
        
        public function set copyCollection(c:CollectionShape):void
        {
        	_copyCollection = c;
        	//need to clear the other 
        	_copyShape = null;
        }
        
        public function get copyShape():RectShape
        {
        	return _copyShape;
        }
        
        public function get copyCollection():CollectionShape
        {
        	return _copyCollection;
        }

        public function getSelectedRectShape():RectShape
        {
            var selectedShape:Selectable = SelectionManager.instance.currentlySelected;
            if (selectedShape is RectShape) {
                return selectedShape as RectShape;
            } else {
                return null;
            }
        }
        
        public function getSelectedCollectionShape():CollectionShape
        {
            var selectedShape:Selectable = SelectionManager.instance.currentlySelected;
            if (selectedShape is CollectionShape) {
                return selectedShape as CollectionShape;
            } else {
                return null;
            }
        }
        
        public function get isDigestRuleEnabled():Boolean
        {
            return _isDigestRuleEnabled;
        }
        
        public function set isDigestRuleEnabled(b:Boolean):void
        {
            _isDigestRuleEnabled = b;
        }
        
        public function get activeView():String
        {
            return _activeView;
        }
        
        public function set activeView(value:String):void
        {
            _activeView = value;
        }
        
        public function get selectedPartRenderer():IPartRenderer
        {
            if (_activeView == DRAG_DROP_VIEW) {
                return getSelectedRectShape();
            } else {
                return _selectedPartRenderer;
            }
        }
        
        public function set selectedPartRenderer(value:IPartRenderer):void
        {
            _selectedPartRenderer = value;
        }
    }
	
}
