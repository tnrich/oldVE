/**
 * Vector Editor main toolbar
 * @class Vede.view.ve.VectorEditorMainToolBar
 */
Ext.define('Vede.view.ve.VectorEditorMainToolBar', {
    extend: 'Ext.toolbar.Toolbar',
    cls: 'VectorEditorMainToolBar',
    alias: 'widget.VectorEditorMainToolBar',
    items: [
    {
        xtype: 'button',
        cls: 'saveSequenceBtn',
        scale: 'medium',
        icon: 'resources/images/save.png',
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
        cls: 'importSequenceBtn',
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
        }
    },
    {
        xtype: 'tbseparator',
        cls: 'vetbseparator',
        height: 20
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
        height: 20
    },

    //        {
    //            xtype: 'button',
    //            cls: 'saveBtn',
    //            icon: 'resources/images/export_disabled.png',
    //            scale: 'medium',
    //            tooltip: 'Save Project'
    //        },
    //        {
    //            xtype: 'button',
    //            cls: 'exportBtn',
    //            icon: 'resources/images/save_disabled.png',
    //            scale: 'medium',
    //            tooltip: 'Save to Registry'
    //        },
    //        {
    //            xtype: 'button',
    //            cls: 'projectPropsBtn',
    //            icon: 'resources/images/project_properties.png',
    //            scale: 'medium',
    //            tooltip: 'Project Properties'
    //        },
    {
        xtype: 'button',
        cls: 'undoBtn',
        icon: 'resources/images/undo_new.png',
        scale: 'medium',
        tooltip: 'Undo'
    },
    {
        xtype: 'tbseparator',
        cls: 'vetbseparator',
        height: 20
    }, {
        xtype: 'button',
        cls: 'redoBtn',
        icon: 'resources/images/redo_new.png',
        scale: 'medium',
        tooltip: 'Redo'
    },
    {
        xtype: 'tbseparator',
        cls: 'vetbseparator',
        height: 20
    },
    {
        xtype: 'button',
        cls: 'circularBtn',
        enableToggle: true,
        icon: 'resources/images/circular.png',
        pressed: true,
        scale: 'medium',
        tooltip: 'Circular View'
    },
    {
        xtype: 'tbseparator',
        cls: 'vetbseparator',
        height: 20
    },
    {
        xtype: 'button',
        cls: 'linearBtn',
        enableToggle: true,
        icon: 'resources/images/linear.png',
        scale: 'medium',
        tooltip: 'Linear View'
    },
    {
        xtype: 'tbseparator',
        cls: 'vetbseparator',
        height: 20
    },
    //        {
    //            xtype: 'button',
    //            cls: 'copyBtn',
    //            icon: 'resources/images/copy_disabled.png',
    //            scale: 'medium',
    //            tooltip: 'Copy'
    //        },
    //        {
    //            xtype: 'button',
    //            cls: 'cutBtn',
    //            icon: 'resources/images/cut_disabled.png',
    //            scale: 'medium',
    //            tooltip: 'Cut'
    //        },
    //        {
    //            xtype: 'button',
    //            cls: 'pasteBtn',
    //            icon: 'resources/images/paste_disabled.png',
    //            scale: 'medium',
    //            tooltip: 'Paste'
    //        },
    //        {
    //            xtype: 'button',
    //            cls: 'safeBtn',
    //            icon: 'resources/images/safe_editing.png',
    //            scale: 'medium',
    //            tooltip: 'Safe Editing'
    //        },
    //        {
    //            xtype: 'button',
    //            cls: 'findBtn',
    //            icon: 'resources/images/find.png',
    //            scale: 'medium',
    //            tooltip: 'Find...'
    //        },
    {
        xtype: 'button',
        cls: 'featuresBtn',
        enableToggle: true,
        focusCls: '', // Without this, the button will not be toggled until it loses focus for some reason.
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
        cls: 'cutSitesBtn',
        enableToggle: true,
        focusCls: '', // Without this, the button will not be toggled until it loses focus for some reason.
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
        cls: 'orfsBtn',
        enableToggle: true,
        focusCls: '', // Without this, the button will not be toggled until it loses focus for some reason.
        icon: 'resources/images/orf.png',
        scale: 'medium',
        tooltip: 'Show ORF'
    },
    {
        xtype: 'tbseparator',
        cls: 'vetbseparator',
        height: 20
    },
    {
        xtype: 'button',
        cls: 'fullscreenBtn',
        scale: 'medium',
        icon: 'resources/images/fullscreen.png',
        tooltip: 'Toggle fullscreen'
    }
    //        {
    //            xtype: 'button',
    //            cls: 'reBtn',
    //            icon: 'resources/images/restriction_enzymes.png',
    //            scale: 'medium',
    //            tooltip: 'Show Restriction Enzymes'
    //        },
    //        {
    //            xtype: 'button',
    //            cls: 'propsBtn',
    //            icon: 'resources/images/properties.png',
    //            scale: 'medium',
    //            tooltip: 'Properties'
    //        },
    ]
});
