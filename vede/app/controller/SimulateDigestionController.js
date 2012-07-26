Ext.define('Vede.controller.SimulateDigestionController', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.manager.RestrictionEnzymeGroupManager"],

    GroupManager: null,
    managerWindow: null,
    digestPanel: null,

    digestSpriteGroup: null,
    ladderSpriteGroup: null,
    sampleSpriteGroup: null,

    ladderLane: null,
    sampleLane: null,

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
        this.updateSampleLane();
    },

    initializeDigestDrawingPanel: function(){
        this.digestPanel = this.managerWindow.query("#drawingSurface")[0];
        this.digestSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
            surface: this.digestPanel.surface
        });
                console.log('test');
        //console.log(this.ladderLane.getLadder());
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
       
        this.ladderSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
            surface: this.digestPanel.surface
        });

        this.ladderLane = Ext.create("Teselagen.models.digest.LadderLane", {
            ladder: "test",
        });
        var ladderSelector = this.managerWindow.query("#ladderSelector")[0];
        this.updateLadderLane(ladderSelector);
    },

    updateLadderLane: function(combobox){
        this.ladderSpriteGroup.destroy();
        this.ladderSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
            surface: this.digestPanel.surface
        });

        this.ladderLane.updateLadderLane(combobox.getValue());
        Ext.each(this.ladderLane.getBandYPositions(), function(yPosition, index){
             var gelBand = Ext.create('Ext.draw.Sprite', {
                type: 'rect',
                fill: '#fff',
                height: 2,
                width: 100,
          //      surface: this.digestPanel.surface,
                x: 100,
                y: yPosition
            });
            var bandText = Ext.create('Ext.draw.Sprite', {
                type: 'text',
                text: this.ladderLane.getLadder()[index],
                fill: '#fff',
                size: 50,
          //      surface: this.digestPanel.surface,
                x: 40,
                y: yPosition
            });

            this.ladderSpriteGroup.add(bandText); 
            this.ladderSpriteGroup.add(gelBand); 
        
        }, this);

        this.showSprites(this.ladderSpriteGroup);
console.log("changing ladder");
    },

    updateSampleLane: function(selectedEnzymes){
        console.log("Updating sample...");
    },

    showSprites: function(pSpriteGroup){
       var tempSurface = this.digestPanel.surface;
       pSpriteGroup.each(function(band){
           tempSurface.add(band);
       });
       pSpriteGroup.show(true);

    },


});
