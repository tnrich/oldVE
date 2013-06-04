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
        cls: 'saveSequenceBtn',
        icon: 'resources/images/save.png',
        scale: 'medium',
        tooltip: 'Save Sequence to Database'
    },
    {
        xtype: 'tbseparator',
        cls: 'vetbseparator',
        height: 20
    },
    {
        xtype: 'filefield',
        buttonOnly: true,
        buttonText: '',
        buttonConfig: {
            icon: 'resources/images/import_new.png',
            scale: 'medium',
            tooltip: 'Open a Sequence File'
        },
        listeners: {
            render: {
                fn: function(field) {
                    field.el.set({title: "Open a Sequence File"});
                }
            }
        },
        id: 'importBtn',
    },
    {
        xtype: 'tbseparator',
        cls: 'vetbseparator',
        height: 20,
    },
    {
        xtype: 'button',
        cls: 'createPartBtn',
        icon: 'resources/images/create.png',
        scale: 'medium',
        tooltip: 'Create Part'
    },
    {
        xtype: 'tbseparator',
        cls: 'vetbseparator',
        height: 20,
    },

    //        {
    //            xtype: 'button',
    //            id: 'saveBtn',
    //            icon: 'resources/images/export_disabled.png',
    //            scale: 'medium',
    //            tooltip: 'Save Project'
    //        },
    //        {
    //            xtype: 'button',
    //            id: 'exportBtn',
    //            icon: 'resources/images/save_disabled.png',
    //            scale: 'medium',
    //            tooltip: 'Save to Registry'
    //        },
    //        {
    //            xtype: 'button',
    //            id: 'projectPropsBtn',
    //            icon: 'resources/images/project_properties.png',
    //            scale: 'medium',
    //            tooltip: 'Project Properties'
    //        },
    {
        xtype: 'button',
        id: 'undoViewBtn',
        icon: 'resources/images/undo_new.png',
        scale: 'medium',
        tooltip: 'Undo'
    },
    {
        xtype: 'tbseparator',
        cls: 'vetbseparator',
        height: 20,
    }, {
        xtype: 'button',
        id: 'redoViewBtn',
        icon: 'resources/images/redo_new.png',
        scale: 'medium',
        tooltip: 'Redo'
    },
    {
        xtype: 'tbseparator',
        cls: 'vetbseparator',
        height: 20,
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
        xtype: 'tbseparator',
        cls: 'vetbseparator',
        height: 20,
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
        xtype: 'tbseparator',
        cls: 'vetbseparator',
        height: 20,
    },
    //        {
    //            xtype: 'button',
    //            id: 'copyBtn',
    //            icon: 'resources/images/copy_disabled.png',
    //            scale: 'medium',
    //            tooltip: 'Copy'
    //        },
    //        {
    //            xtype: 'button',
    //            id: 'cutBtn',
    //            icon: 'resources/images/cut_disabled.png',
    //            scale: 'medium',
    //            tooltip: 'Cut'
    //        },
    //        {
    //            xtype: 'button',
    //            id: 'pasteBtn',
    //            icon: 'resources/images/paste_disabled.png',
    //            scale: 'medium',
    //            tooltip: 'Paste'
    //        },
    //        {
    //            xtype: 'button',
    //            id: 'safeBtn',
    //            icon: 'resources/images/safe_editing.png',
    //            scale: 'medium',
    //            tooltip: 'Safe Editing'
    //        },
    //        {
    //            xtype: 'button',
    //            id: 'findBtn',
    //            icon: 'resources/images/find.png',
    //            scale: 'medium',
    //            tooltip: 'Find...'
    //        },
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
        xtype: 'tbseparator',
        cls: 'vetbseparator',
        height: 20
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
        xtype: 'tbseparator',
        cls: 'vetbseparator',
        height: 20
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
        id: 'fullscreen',
        scale: 'medium',
        icon: 'resources/images/fullscreen.png',
        tooltip: 'Toggle fullscreen'
    },
    //        {
    //            xtype: 'button',
    //            id: 'reBtn',
    //            icon: 'resources/images/restriction_enzymes.png',
    //            scale: 'medium',
    //            tooltip: 'Show Restriction Enzymes'
    //        },
    //        {
    //            xtype: 'button',
    //            id: 'propsBtn',
    //            icon: 'resources/images/properties.png',
    //            scale: 'medium',
    //            tooltip: 'Properties'
    //        },
    ]
});
