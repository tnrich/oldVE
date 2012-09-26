/**
 * @class Teselagen.manager.AuthenticationManager
 * Holds authentication information
 * @author Rodrigo Pavez
**/

 Ext.define("Teselagen.manager.AuthenticationManager", {
     requires: ["Teselagen.event.AuthenticationEvent",
     "Vede.view.ProjectPanelView"],
     alias: "AuthenticationManager",
     sessionData: null,
     mixins: {
        observable: "Ext.util.Observable"
   	 },
   	 sessionData: null,
     /**
      * @param {Teselagen.manager.SequenceManager} sequenceManager The
      * SequenceManager to undo/redo actions for.
      */
     constructor: function() {
     },


     /**
      * Fires event to init all ajax calls that depend on an active sessionId
      */
     logIn: function(event,inData) {
		  Vede.application.fireEvent(Teselagen.event.AuthenticationEvent.LOGGED_IN);
      Ext.getCmp("ProjectPanel").store.load();

     }
});