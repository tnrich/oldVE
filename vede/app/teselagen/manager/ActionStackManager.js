/**
 * @class Teselagen.manager.ActionStackManager
 * Holds a stack of the user's previous actions and uses these to manage the 
 * undo and redo functions.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author of ActionStack.as)
 */
 Ext.define("Teselagen.manager.ActionStackManager", {
     requires: ["Teselagen.event.ActionStackEvent"],

     config: {
         sequenceManager: null
     },

     ActionStackEvent: null,

     undoStack: [],
     redoStack: [],

     /**
      * @param {Teselagen.manager.SequenceManager} sequenceManager The
      * SequenceManager to undo/redo actions for.
      */
     constructor: function(inData) {
         this.initConfig(inData);

         this.ActionStackEvent = Teselagen.event.ActionStackEvent;
     },

     /**
      * Undoes the previous action.
      */
     undo: function() {
         if(this.undoStack.length == 0) {
             return;
         }

         var item = this.undoStack.pop();
         this.redoStack.push(this.getSequenceManager().createMemento());

         this.getSequenceManager().setMemento(item);

         Vede.application.fireEvent(this.ActionStackEvent.ACTION_STACK_CHANGED);
     },

     /**
      * Redoes the previously undone action.
      */
     redo: function() {
         if(this.redoStack.length == 0) {
             return;
         }

         var item = this.redoStack.pop();
         this.undoStack.push(this.getSequenceManager().createMemento());

         this.getSequenceManager().setMemento(item);

         Vede.application.fireEvent(this.ActionStackEvent.ACTION_STACK_CHANGED);
     },

     /**
      * Adds the given memento to the undo stack.
      * @param {Teselagen.manager.SequenceManagerMemento} memento The memento to
      * be added.
      */
     add: function(memento) {
         this.undoStack.push(memento);
         this.redoStack = [];

         Vede.application.fireEvent(this.ActionStackEvent.ACTION_STACK_CHANGED);
     },

     /**
      * Removes all items from the undo and redo stacks.
      */
     clear: function() {
         this.undoStack = [];
         this.redoStack = [];

         Vede.application.fireEvent(this.ActionStackEvent.ACTION_STACK_CHANGED);
     }
 });

 
 
 