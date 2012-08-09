StartTest(function(t) {
    var window;
    Ext.widget('window', {
       title: 'Test Window',
       x: 10
    }).show();
    window = Ext.create("Vede.view.FileImportWindow");
    window.show();
});
