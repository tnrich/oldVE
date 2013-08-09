Ext.define('Vede.view.common.dropZone', {
	extend: 'Ext.Component',
	alias: 'widget.dropZone',
	requires: [
			"Ext.Component",
			"Teselagen.bio.parsers.ParsersManager"
	],

	initComponent: function() {
		var me = this;
		me.callParent();
	},

	onDestroy: function() {
		this.callParent();
	},

	autoEl: {
		tag: 'div',
		id:  'dropZone',
		cls: 'batch-import-area',
		hidden: true,
		html: '<h2> + Drop files here</h2><div id="dropZone-close"></div>',
	},

	listeners: {
		afterrender: function(cmp) {
			var dropZone = cmp.getEl().dom;
			var sequenceLibrary = Ext.getCmp("sequenceLibraryArea").getEl().dom;
			var handleFileSelect = cmp.handleFileSelect.bind(cmp);
			sequenceLibrary.addEventListener('dragenter', cmp.handleDragEnter, false, cmp);
			dropZone.addEventListener('dragleave', cmp.handleDragLeave, false, cmp);
			dropZone.addEventListener('dragover', cmp.handleDragOver, false, cmp);
			dropZone.addEventListener('drop', handleFileSelect, false, cmp);
		}
	},

	handleDragEnter: function(evt, cmp) {
		$(".batch-import-area").fadeIn("fast");
	},

	handleDragLeave: function(evt, cmp) {
		$(".batch-import-area").stop().fadeOut("fast");
	},

	handleFileSelect: function(evt) {

		$(".batch-import-area").fadeOut("fast");

		evt.stopPropagation();
		evt.preventDefault();
		
		this.processFiles(evt);

		var sequenceLibrary = Ext.getCmp("sequenceLibrary");
		sequenceLibrary.el.mask("Importing Sequence(s)", "loader rspin");
        $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");


	},

	handleDragOver: function(evt) {

		evt.stopPropagation();
		evt.preventDefault();

		// $(".batch-import-area").fadeIn("fast");
		evt.dataTransfer.dropEffect = 'copy';
	},
 
	//Handle onDrop
	processFiles: function(evt) {     

		var length = evt.dataTransfer.items.length;

        for (var i = 0; i < length; i++) {
            var entries = [];
            entries[0] = evt.dataTransfer.items[i].webkitGetAsEntry();
            this.readDirectory(entries,this);
        }

        var sequenceLibrary = Ext.getCmp("sequenceLibrary");
        sequenceLibrary.el.unmask();
	},

	// Recursive directory read 
	readDirectory: function (entries,scope) {
		var self = scope;
	    for (i = 0; i < entries.length; i++) {
	        if (entries[i].isDirectory) {

	            console.log("Reading folder: ",entries[i].name);
	            var directoryReader = entries[i].createReader();
	            self.getAllEntries(
	                    directoryReader,
	                    self.readDirectory
	                );

	        } else {
	            console.log("Reading file: ",entries[i].name);
	            entries[i].file(self.readFile, self.errorHandler);
	        }
	    }
	},

	// This is needed to get all directory entries as one 
	// call of readEntries may not return all items. Works a 
	// bit like stream reader.  
	getAllEntries: function (directoryReader, callback) {
		var self = this;
	    var entries = [];

	    var toArray = function (list) {
		    return Array.prototype.slice.call(list || [], 0);
		};

	    var readEntries = function () {
	        directoryReader.readEntries(function (results) {
	            if (!results.length) {
	                entries.sort();
	                callback(entries,self);
	            } else {
	                entries = entries.concat(toArray(results));
	                readEntries();
	            }
	        }, self.errorHandler);
	    };

	    readEntries();
	},

	readFile: function (file) {
	    Teselagen.bio.parsers.ParsersManager.parseAndImportFile(file);
	},

	errorHandler: function (e) {
    	console.log('FileSystem API error code: ' + e.code)
	}





});