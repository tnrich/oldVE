var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
    title       : 'Awesome Test Suite',

    preload     : [
        '../../extjs/resources/css/ext-all.css',
        '../../extjs/ext-all-debug.js',
        {
            text: 'Ext.Loader.setConfig({enabled: true})'
        }
    ],

    loaderPath : {
        Teselagen: '../app/teselagen',
        'Teselagen.bio':'../../biojs/src/teselagen/bio',
        Vede: '../app'
    }
});
