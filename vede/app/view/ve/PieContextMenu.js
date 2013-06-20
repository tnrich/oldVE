/**
 * @deprecated
 */
Ext.define('Vede.view.ve.PieContextMenu', {
    extend: 'Ext.menu.Menu',
    id: 'PieContextMenu',
    items: [{
  	    text: 'Annotate as new Sequence Feature',
  	    id: 'PieContextMenuNewFeature',
  	    //autoDestroy: false,
  	    //disabled: true
	  },{
        xtype: 'menuseparator',
        id: 'PieContextMenuSeparator0',
        //autoDestroy: false,
      },{
        text: 'Edit Sequence Feature',
        id: 'PieContextMenuEditFeature',
        //autoDestroy: false,
        //disabled: true
      },{
        text: 'Delete Sequence Feature',
        id: 'PieContextMenuDeleteFeature',
        //autoDestroy: false,
        //disabled: true
      }],
});