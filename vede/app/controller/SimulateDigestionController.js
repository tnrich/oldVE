Ext.define('Vede.controller.SimulateDigestionController', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.manager.RestrictionEnzymeGroupManager"],

    GroupManager: null,
    managerWindow: null,
    digestPanel: null,
    digestSpriteGroup: null,

    init: function() {
        this.GroupManager = Teselagen.manager.RestrictionEnzymeGroupManager;

        this.control({
            "#enzymeGroupSelector-digest": {
                change: this.onEnzymeGroupSelected
            },
            '#digestButton':{
                click: this.onDigestButtonClick
            },
        
            "#ladderSelector": {
                change: this.updateLadderLane
            }
        });

        this.application.on({
            SimulateDigestionWindowOpened: this.onSimulateDigestionOpened, 
            scope: this
        });
    },

    onSimulateDigestionOpened: function(manager) {
        this.managerWindow = manager;
        console.log("trying to init");
        if(!this.GroupManager.getIsInitialized()) {
            this.GroupManager.initialize();
        }
        console.log("fired");

        var nameData = [];
        var groupSelector = this.managerWindow.query("#enzymeGroupSelector-digest")[0];
        console.log(groupSelector);
        Ext.each(this.GroupManager.getGroupNames(), function(name) {
            groupSelector.store.add({"name": name});
        });
        this.onEnzymeGroupSelected(groupSelector);
        // Set the value in the combobox to the first element by default.
        groupSelector.setValue(groupSelector.store.getAt("0").get("name"));
        this.initializeDigestDrawingPanel();
    },

    /**
     * Populates the itemselector field with enzyme names.
     * Called when the user selects a new group in the combobox.
     */
    onEnzymeGroupSelected: function(combobox) {
        var newGroup = this.GroupManager.groupByName(combobox.getValue());
        var selector = this.managerWindow.query("#enzymeListSelector-digest")[0];
        var newStoreData = [];
        console.log(selector.store);
        selector.store.removeAll(true);

        Ext.each(newGroup.getEnzymes(), function(enzyme) {
            selector.store.add({"name": enzyme.getName()});
        });

        selector.store.sort();
        selector.bindStore(selector.store);
    },

    onDigestButtonClick: function(){
        console.log("Digesting!");
    },

    initializeDigestDrawingPanel: function(){
        this.digestPanel = this.managerWindow.query("#drawingSurface")[0];
        this.digestSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
            surface: this.digestPanel.surface
        });
       var digestBG = Ext.create('Ext.draw.Sprite', {
            type: 'rect',
            height: 400,
            width: 445,
            fill: '#000',
            x: 0,
            y: 0
        });
        this.digestSpriteGroup.add(digestBG);
        this.showSprites(this.digestSpriteGroup);
    },

    updateLadderLane: function(combobox){
        console.log("changing ladder");
       var band3000 = Ext.create('Ext.draw.Sprite', {
            type: 'rect',
            fill: '#fff',
            height: 2,
            width: 100,
      //      surface: this.digestPanel.surface,
            x: 50,
            y: 50
        });
        var band2000 = Ext.create('Ext.draw.Sprite', {
            type: 'rect',
            fill: '#fff',
            height: 2,
            width: 100,
      //      surface: this.digestPanel.surface,
            x: 50,
            y: 100
        });


       this.digestSpriteGroup.add(band2000);
       this.digestSpriteGroup.add(band3000);
       this.showSprites(this.digestSpriteGroup);
    },

    updateSampleLane: function(selectedEnzymes){
    },

    showSprites: function(pSpriteGroup){
       var tempSurface = this.digestPanel.surface;
       pSpriteGroup.each(function(band){
           tempSurface.add(band);
       });
       pSpriteGroup.show(true);

    },


});
