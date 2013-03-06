requirejs.config({
    baseUrl: '/assets/js/',
    paths: {
        jquery: 'lib/jquery.min',
        jqueryui: 'lib/jquery-ui.min',
        domready: 'lib/domReady',
        bootstrap: 'lib/bootstrap.min',
        filesaver: 'lib/FileSaver.min',
        blobbuilder: 'lib/BlobBuilder.min',
        json2: 'lib/json2',
        oop: 'lib/oop',
        underscore: 'lib/underscore-min',
        x2js: 'lib/x2js',
        md5: 'lib/md5',
        prettydate: 'lib/prettyDate',
        jszip:'lib/jszip',
        jszipload:'lib/jszip-load',
        jszipdeflate:'lib/jszip-deflate',
        base64:'lib/base64',
        urlparser:'lib/jquery.urlparser.min',
        application: 'application'
    },
    shim: {
        'jqueryui': ['jquery'],
        'bootstrap': ['jquery'],
        'urlparser': ['jquery'],
        'jszipload': ['jszip'],
        'jszipdeflate' : ['jszip']
    }
});


define('core',['jquery','bootstrap','oop'],function ( $ ) {return $;});
define('plugins',['jqueryui','bootstrap','prettydate','x2js'],function ( $ ) {return $;});
define('utils',['filesaver','blobbuilder','json2','underscore','md5','jszip','jszipload','base64','urlparser'],function ( $ ) {return $;});


require(['application']);

requirejs.onError = function (err) {
    console.log("error detected!");
    console.log(err.requireType);
    if (err.requireType === 'timeout') {
        console.log('modules: ' + err.requireModules);
    }

    throw err;
};