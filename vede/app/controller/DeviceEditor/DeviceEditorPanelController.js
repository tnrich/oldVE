Ext.define('Vede.controller.DeviceEditor.DeviceEditorPanelController', {
    extend: 'Ext.app.Controller',
    requires: ["Ext.draw.*"],

    openProject: function(project) {
        Ext.getCmp('tabpanel').getActiveTab().model = project;
    },

    init: function () {
        this.callParent();
        this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT,
                            this.openProject, this);
    },


    renderDesignInContext: function () {

        Ext.define('Bin', {
            constructor: function (group,bin,x,y) {
                this.group = group;
                this.x = x;
                this.y = y;
                this.bin = bin;

                var bin = this.group.add(Ext.create('Ext.draw.Sprite',{
                    type: 'rect',
                    width: 100,
                    height: 50,
                    radius: 10,
                    fill: 'white',
                    opacity: 0.5,
                    stroke: 'black',
                    'stroke-width': 2,
                    x: this.x,
                    y: this.y
                }));

                var text = this.group.add(Ext.create('Ext.draw.Sprite',{
                    type: "text",
                    text: this.bin.data.binName,
                    fill: "black",
                    font: "14px arial",
                    x: this.x + 30,
                    y: this.y + 15
                }));

                bin.show(true);
                text.show(true);

                bin.addListener('click', function () {
                    console.log('bin clicked');
                });

            }
        });

        var currentTab = Ext.getCmp('tabpanel').getActiveTab();
        var currentModel = currentTab.model;

        var surface = currentTab.query('draw[cls=designCanvas]')[0].surface;
        var bins = currentModel.getDesign().getJ5Collection().bins();
        
        var xPos = 10;
        bins.each(function(bin){
            var binDraw = new Bin(surface,bin,xPos,10);
            xPos += 110;
        });
    }
});
