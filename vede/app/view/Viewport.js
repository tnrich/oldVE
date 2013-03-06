/**
 * Viewport that extends AppViewport
 * @ignore
 * @class Vede.view.Viewport
 */
Ext.define('Vede.view.Viewport', {
    extend: 'Vede.view.AppViewport',
    renderTo: Ext.getBody(),
    requires: [
        'Vede.view.AppViewport',
     ]
});

