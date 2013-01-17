/**
 * Vector Editor main toolbar
 * @class Vede.view.ve.VectorEditorMainToolBar
 */
Ext.define('Vede.view.ve.VectorEditorMainToolBar', {
    extend: 'Ext.toolbar.Toolbar',
    id: 'VectorEditorMainToolBar',
    alias: 'widget.VectorEditorMainToolBar',
    items: [
        {
            xtype: 'button',
            id: 'exportBtn',
            icon: 'resources/images/export.png',
            scale: 'medium',
            tooltip: 'Save to Registry'
        },
        {
            xtype: 'button',
            id: 'saveBtn',
            icon: 'resources/images/save.png',
            scale: 'medium',
            tooltip: 'Save Project'
        },
        {
            xtype: 'button',
            id: 'projectPropsBtn',
            icon: 'resources/images/project_properties.png',
            scale: 'medium',
            tooltip: 'Project Properties'
        },
        {
            xtype: 'button',
            id: 'circularViewBtn',
            enableToggle: true,
            icon: 'resources/images/pie.png',
            pressed: true,
            scale: 'medium',
            tooltip: 'Circular View'
        },
        {
            xtype: 'button',
            id: 'linearViewBtn',
            enableToggle: true,
            icon: 'resources/images/rail.png',
            scale: 'medium',
            tooltip: 'Linear View'
        },
        {
            xtype: 'button',
            id: 'copyBtn',
            icon: 'resources/images/copy.png',
            scale: 'medium',
            tooltip: 'Copy'
        },
        {
            xtype: 'button',
            id: 'cutBtn',
            icon: 'resources/images/cut.png',
            scale: 'medium',
            tooltip: 'Cut'
        },
        {
            xtype: 'button',
            id: 'pasteBtn',
            icon: 'resources/images/paste.png',
            scale: 'medium',
            tooltip: 'Paste'
        },
        {
            xtype: 'button',
            id: 'undoBtn',
            icon: 'resources/images/undo.png',
            scale: 'medium',
            tooltip: 'Undo'
        },
        {
            xtype: 'button',
            id: 'redoBtn',
            icon: 'resources/images/redo.png',
            scale: 'medium',
            tooltip: 'Redo'
        },
        {
            xtype: 'button',
            id: 'safeBtn',
            icon: 'resources/images/safe_editing.png',
            scale: 'medium',
            tooltip: 'Safe Editing'
        },
        {
            xtype: 'button',
            id: 'findBtn',
            icon: 'resources/images/find.png',
            scale: 'medium',
            tooltip: 'Find...'
        },
        {
            xtype: 'button',
            id: 'featuresBtn',
            enableToggle: true,
            icon: 'resources/images/features.png',
            pressed: true,
            scale: 'medium',
            tooltip: 'Show Features'
        },
        {
            xtype: 'button',
            id: 'cutsitesBtn',
            enableToggle: true,
            icon: 'resources/images/cut_sites.png',
            scale: 'medium',
            tooltip: 'Show Cut Sites'
        },
        {
            xtype: 'button',
            id: 'orfsBtn',
            enableToggle: true,
            icon: 'resources/images/orf.png',
            scale: 'medium',
            tooltip: 'Show ORF'
        },
        {
            xtype: 'button',
            id: 'reBtn',
            icon: 'resources/images/restriction_enzymes.png',
            scale: 'medium',
            tooltip: 'Show Restriction Enzymes'
        },
        {
            xtype: 'button',
            id: 'propsBtn',
            icon: 'resources/images/properties.png',
            scale: 'medium',
            tooltip: 'Properties'
        }
    ]
});
