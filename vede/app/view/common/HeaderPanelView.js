var headerHTML = '\
 <div class="navbar"> \
    <div class="navbar-inner"> \
<div class="container"> \
 \
        <button type="button" class="btn btn-navbar" data-toggle="collapse" data \-target=".nav-collapse"> \
        <span class="icon-bar"></span> \
        <span class="icon-bar"></span> \
        <span class="icon-bar"></span> \
         </button> \
     \
     \
            <div class="brand">TeselaGen</div>           \
             \
    <div class="nav-collapse collapse" style="height:0px;"> \
             \
                  <ul class="nav" id="main_nav"> \
                                                <li id="home_nav" class="active"><a \ id="home_init" href="#welcome" data \-toggle="tab">Home</a></li> \
                        <li id="abt_nav" class=""> \
                                       <a id="abt_init" href="#about_us" data \-toggle="tab">About</a></li> \
                        <li id="contact_nav" class=""> \
                                       <a id="con_init" href="#contact_us" data \-toggle="tab">Contact</a></li>    \
                                 \
                                          </ul> \
                       \
                <ul class="nav pull-right">       \
                                 \
                      <li class=""><a id="login_nav" href="/user/registration">Sign U \p</a></li> \
                </ul> \
                    \
                  <ul class="nav pull-right"> \
                        <li class=""><a class="topbar_btn btn-primary" id="login_nav" \ style="margin:0; padding:15px 25px 15px 25px; color:#EEE;" \ href="/user/login">Login</a></li> \
                \
                   </ul> \
             \
                                         \
                         \
                        </div> \
                        </div> \
                        </div> \
</div>';


/**
 * Header panel view
 * @class Vede.view.common.HeaderPanelView
 */
Ext.define('Vede.view.common.HeaderPanelView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.HeaderPanelView',

	region: 'north',
	height: 50,
	id: 'headerPanel',
	layout: {
		align: 'stretch',
		type: 'hbox'
	},
	html: headerHTML
});