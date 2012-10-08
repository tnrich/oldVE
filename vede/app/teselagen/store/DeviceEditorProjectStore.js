

Ext.define("Teselagen.store.DeviceEditorProjectStore", {
  	extend: 'Ext.data.store',
	id: 'DeviceEditorProjectStore',
  	autoLoad: false,
	proxy: {
		type: 'localstorage',
		id: 'TEST-STORE',
	} 
});
