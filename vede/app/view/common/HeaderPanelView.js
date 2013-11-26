/**
 * Header panel view
 * @class Vede.view.common.HeaderPanelView
 */
Ext.define('Vede.view.common.HeaderPanelView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.HeaderPanelView',
	emitNavAction  : function(e, target) {
       return this.fireEvent('navaction', this, e, target);
    },
	region: 'north',
	id: 'headerPanel',
	cls: 'navbar navbar-static-top',
	margin: '0 0 10 0',
	layout: 'fit',
	items: [
		{
			xtype: 'panel',
			id: 'header-browser-warning',
			html: 'Warning: TeselaGen Beta works best in a Google Chrome Browser.',
            height: 40,
            padding: 10,
            width: 400,
            hidden: true
		},
		{
		xtype: 'container',
		id: 'headerPanel-navbar',
		cls: 'navbar-inner',
		html: '<ul class="nav"><li><div id="headerProgressBox"><div id="headerProgressBar" class="progress progress-info progress-striped active"><div class="bar" id="headerProgress"></div></div><div id="headerProgressText"></div><div id="headerProgressCancel"><a href="" id="headerProgressCancelBtn">Cancel</a></div></div></li><li id="headerUserIcon"><a class="dropdown-toggle headerUserField" data-toggle="dropdown"><b class="caret"></b></a><ul class="dropdown-menu"><li><a id="auth-reconnect-btn">Reconnect</a></li><li><a id="auth-logout-btn">Logout</a></li></ul></li><li><a id="tasks_btn">Tasks</a></li><li><a id="help_btn">Help</a></li></ul></ul>',
		items: [
		{
			xtype: 'image',
			id: 'headerIcon',
			src: 'http://app.teselagen.com.s3-website-us-west-1.amazonaws.com/resources/images/teselagen_toplogo.png'
		}
		]
	}]
});
