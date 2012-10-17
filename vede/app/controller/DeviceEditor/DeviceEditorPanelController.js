Ext.define('Vede.controller.DeviceEditor.DeviceEditorPanelController', {
    extend: 'Ext.app.Controller',
    requires: [
        "Ext.draw.*"
    ],

    renderDesignInContext: function () {
        var currentTab = Ext.getCmp('tabpanel').getActiveTab();
        var currentModel = currentTab.model;

        var canvas = currentTab.query('container[cls=designCanvas]')[0];

        console.log(canvas);

        // Add a circle sprite
        var myCircle = canvas.surface.add({
            type: 'circle',
            x: 100,
            y: 100,
            radius: 100,
            fill: '#cc5'
        });

        // Now do stuff with the sprite, like changing its properties:
        myCircle.setAttributes({
            fill: '#ccc'
        }, true);

        // or animate an attribute on the sprite
        myCircle.animate({
            to: {
                fill: '#555'
            },
            duration: 2000
        });

        // Add a mouseup listener to the sprite
        myCircle.addListener('mouseup', function () {
            alert('mouse upped!');
        });

        
        canvas.setVisible(true);

    },

    init: function () {
        this.callParent();
        //this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT,this.openProject, this);
        //console.log(Ext.getCmp('tabpanel').getActiveTab().query('textfield[cls=partNameField]'));
        this.control({
            'textfield[cls="partNameField"]': {
                keydown: function (field, e) {
                    console.log(e);
                    if(e.getKey() == e.ENTER) {
                        e.stopEvent();
                        console.log('Enter pressed');
                    }
                },
                focus: function () {
                    var currentModel = Ext.getCmp('tabpanel').getActiveTab().model;
                    console.log(currentModel);
                }
            }
        });

    }

});