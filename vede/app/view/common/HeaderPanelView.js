/**
 * Header panel view
 * @class Vede.view.common.HeaderPanelView
 */
Ext.define('Vede.view.common.HeaderPanelView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.HeaderPanelView',

	region: 'north',
	id: 'headerPanel',
	cls: 'navbar navbar-static-top',
	margin: '0 0 15 0',
	layout: 'fit',
	items: [{
		xtype: 'container',
		cls: 'navbar-inner',
		html: '<ul class="nav"><li id="headerUserIcon"><a href="" class="dropdown-toggle headerUserField" data-toggle="dropdown"><b class="caret"></b></a><ul class="dropdown-menu"><li><a href="">Reconnect</a></li><li><a href="">Logout</a></li></ul></li><li id="help_btn"><a href="">Help</a></li></ul>',
		items: [{
			xtype: 'image',
			id: 'headerIcon',
			src: 'resources/images/teselagen_toplogo_alt.png'
		}]
	}]
});