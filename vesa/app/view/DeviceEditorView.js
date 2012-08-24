var iconsToolbarHTMLSource = ' \
<div id="icon-toolbar" class="toolbar arrow_box hide"> \
<div class="span2"><a href="#" data-toggle="button" class="btn js-add-part">Change icon</a></div> \
<div class="span2"><a href="#" data-toggle="button" class="btn js-rotate">Change Direction</a></div> \
<div class="js-elements hide elements"> \
<h4 class="pull-left">Available icons</h4> \
<a href="#" title="rotate parts" class="btn btn-inverse js-reverse-all-parts pull-right"></a> \
<div style="clear: both;"></div> \
</div> \
</div> \
';

var deviceEditorHTMLSource = iconsToolbarHTMLSource+'\
<div id="designCanvas"> \
</div> \
';

Ext.define('MyApp.view.DeviceEditorView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.DeviceEditorPanel',
    title: 'Device Editor',
    html: deviceEditorHTMLSource,
    afterRender: function(){
        console.log('now is time!');
        $( document ).trigger( 'loadDE' );
    }
});