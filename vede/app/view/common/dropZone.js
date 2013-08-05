Ext.define('Vede.view.common.dropZone', {
	extend: 'Ext.Component',
	alias: 'widget.dropZone',
	requires: [
			"Ext.Component"
	],

	initComponent: function() {
		console.log("dropzone");
		var me = this;
		me.callParent();
	},

	onDestroy: function() {
		this.callParent();
	},

	autoEl: {
		tag: 'div',
		id:  'dropZone-area',
		cls: 'batch-import-area',
		//html: '<h2 id="dropZone"> + Drop files here</h2><div id="dropZone-close"></div>',
		html: '<h2 id="dropZone"> + Drop files here</h2><div id="dropZone-close"></div>',
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

		evt.stopPropagation();
		evt.preventDefault();
		
		//this.processFile(evt);
		//debugger;
		var files = evt.dataTransfer.files;
		$(".batch-import-area").fadeOut("fast");

		this.fireEvent('drop', files);
	},

	handleDragOver: function(evt) {

		evt.stopPropagation();
		evt.preventDefault();

		// $(".batch-import-area").fadeIn("fast");
		evt.dataTransfer.dropEffect = 'copy';
	},

	uploadFile : function(file){
		debugger;
	},
 
	//Handle onDrop
	processFile: function(evt) {     
	  var self = this;
	  var dataTransfer = evt.dataTransfer;
	  if(dataTransfer && dataTransfer.items){
	  	  var items = dataTransfer.items, 
	  	      len   = items.length,
	  	      i, entry;
	  	  for(i=0; i<len; i++){
	 		 entry = items[i]
	                 if(entry.getAsEntry){  //Standard HTML5 API
	                    entry = entry.getAsEntry();
	                 }else if(entry.webkitGetAsEntry){  //WebKit implementation of HTML5 API.
	                    entry = entry.webkitGetAsEntry();
	                 }
	 		 if(entry.isFile){
	 		 	//Handle FileEntry
	 		 	self.readFile(entry, self.uploadFile);
	 		 }else if(entry.isDirectory){
	 		 	//Handle DirectoryEntry
	 		 	self.readFileTree(entry, self.uploadFile);
	 		 }
	  	  }
	  }
	},

	//Explore trough the file tree 
	//@Traverse recursively trough File and Directory entries.
	readFileTree: function(itemEntry, fileCallback) {
		var self = this;
		if (itemEntry.isFile) {
			self.readFile(itemEntry, self.uploadFile);
		} else if (itemEntry.isDirectory) {
			var dirReader = itemEntry.createReader();
			dirReader.readEntries(function(entries) {
				var idx = entries.length;
				while (idx--) {
					console.log(entries[idx]);
					debugger;
					self.readFileTree(entries[idx], self.readFileTree);
				}
			});
		}
	},

	//Read FileEntry to get Native File object.
	readFile: function(fileEntry, callback) {
		//Get File object from FileEntry
		debugger;
		fileEntry.file(function(callback, file) {
			if (callback) {
				callback(file);
			}
		});
	}

});