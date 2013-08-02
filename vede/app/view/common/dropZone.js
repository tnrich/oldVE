Ext.define('Vede.view.common.dropZone', {
	extend: 'Ext.Component',
	alias: 'widget.dropZone',
	requires: [
			"Ext.Component"
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
		cls: 'title-bar',
		html: '<h2 id="dropZone"> + Drop files here</h2>'
	},
	
	listeners: {
		afterrender: function(cmp) {
			var dropZone = cmp.getEl().dom;
			var handleFileSelect = cmp.handleFileSelect.bind(cmp);
			dropZone.addEventListener('dragover', cmp.handleDragOver, false, cmp);
			dropZone.addEventListener('drop', handleFileSelect, false, cmp);
		}
	},

	handleFileSelect: function (evt) {
		evt.stopPropagation();
		evt.preventDefault();

		var files = evt.dataTransfer.files;

		this.fireEvent('drop',files);
	},

	handleDragOver: function (evt){
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy';
	}

});