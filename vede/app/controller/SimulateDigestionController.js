Ext.define('Vede.controller.SimulateDigestionController', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.manager.RestrictionEnzymeGroupManager",
               "Teselagen.bio.tools.DigestionCalculator",
               "Teselagen.bio.sequence.DNATools"],

    GroupManager: null,
    DigestionCalculator: null,
    DNATools: null,

    managerWindow: null,
    digestPanel: null,

    digestSpriteGroup: null,
    ladderSpriteGroup: null,
    sampleSpriteGroup: null,

    ladderLane: null,
    sampleLane: null,
    tempDNA: null,

    groupSelector: null,
    enzymeListSelector: null,

    init: function() {
        this.GroupManager = Teselagen.manager.RestrictionEnzymeGroupManager;
        this.DigestionCalculator = Teselagen.bio.tools.DigestionCalculator;
        this.DNATools = Teselagen.bio.sequence.DNATools;
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
        //this.DigestionCalculator = Teselagen.bio.tools.DigestionCalculator;
        //this.DNATools = Teselagen.bio.sequence.DNATools;
var groupSelector = this.managerWindow.query("#enzymeGroupSelector-digest")[0];
        this.enzymeListSelector = this.managerWindow.query("#enzymeListSelector-digest")[0];
        console.log("trying to init");
        if(!this.GroupManager.getIsInitialized()) {
            this.GroupManager.initialize();
        }
        console.log("fired");

        var nameData = [];
        //Add names of groups to combobox
        Ext.each(this.GroupManager.getGroupNames(), function(name) {
            groupSelector.store.add({"name": name});
        });

        // Set the value in the group combobox to the first element by default.
        groupSelector.setValue(groupSelector.store.getAt("0").get("name"));

        var startGroup = this.GroupManager.groupByName(groupSelector.store.getAt("0").get("name"));
        var groupArray = [];
        Ext.each(startGroup.getEnzymes(), function(enzyme) {
            groupArray.push({name: enzyme.getName()});
        });
        console.log(groupArray)
        this.enzymeListSelector.store.loadData(groupArray);
        this.enzymeListSelector.bindStore(this.enzymeListSelector.store);

        this.initializeDigestDrawingPanel();
        var completeSequence = String("gacgtcttatgacaacttgacggctacatcattcactttttcttcacaaccggcacggaactcgctcgggctggccccggtgcattttttaaatacccgcgagaaatagagttgatcgtcaaaaccaacattgcgaccgacggtggcgataggcatccgggtggtgctcaaaagcagcttcgcctggctgatacgttggtcctcgcgccagcttaagacgctaatccctaactgctggcggaaaagatgtgacagacgcgacggcgacaagcaaacatgctgtgcgacgctggcgatatcaaaattgctgtctgccaggtgatcgctgatgtactgacaagcctcgcgtacccgattatccatcggtggatggagcgactcgttaatcgcttccatgcgccgcagtaacaattgctcaagcagatttatcgccagcagctccgaatagcgcccttccccttgcccggcgttaatgatttgcccaaacaggtcgctgaaatgcggctggtgcgcttcatccgggcgaaagaaccccgtattggcaaatattgacggccagttaagccattcatgccagtaggcgcgcggacgaaagtaaacccactggtgataccattcgcgagcctccggatgacgaccgtagtgatgaatctctcctggcgggaacagcaaaatatcacccggtcggcaaacaaattctcgtccctgatttttcaccaccccctgaccgcgaatggtgagattgagaatataacctttcattcccagcggtcggtcgataaaaaaatcgagataaccgttggcctcaatcggcgttaaacccgccaccagatgggcattaaacgagtatcccggcagcaggggatcattttgcgcttcagccatacttttcatactcccgccattcagagaagaaaccaattgtccatattgcatcagacattgccgtcactgcgtcttttactggctcttctcgctaaccaaaccggtaaccccgcttattaaaagcattctgtaacaaagcgggaccaaagccatgacaaaaacgcgtaacaaaagtgtctataatcacggcagaaaagtccacattgattatttgcacggcgtcacactttgctatgccatagcatttttatccataagattagcggattctacctgacgctttttatcgcaactctctactgtttctccatacccgtttttttgggaatttttaagaaggagatatacatatggaaaataacgctttattagaacaaataatcaatgaagttttaaaaaatatgggtggcagtggtagcgggagctcgggtggctcaggctctggttccagtaaaggagaagaacttttcactggagttgtcccaattcttgttg aattagatggtgatgttaatgggcacaaattttctgtcagtggagagggtgaaggtgatgcaacatacggaaaacttacccttaaatttatttgcactactggaaaactacctgttccatggccaacacttgtcactactttctcttatggtgttcaatgcttttcccgttatccggatcatatgaaacggcatgactttttcaagagtgccatgcccgaaggttatgtacaggaacgcactatatctttcaaagatgacgggaactacaagacgcgtgctgaagtcaagtttgaaggtgatacccttgttaatcgtatcgagttaaaaggtattgattttaaagaagatggaaacattctcggacacaaactcgaatacaactataactcacacaatgtatacatcacggcagacaaacaaaagaatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcagaccattatcaacaaaatactccaattggcgatggccctgtccttttaccagacaaccattacctgtcgacacaatctgccctttcgaaagatcccaacgaaaagcgtgacc acatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgagctcggcggcggcgcggcgaacgatgaaaactatgcgctggcggcgtaaatcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttg tttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctg cgtttatacctagggtacgggttttgctgcccgcaaacgggctgttctggtgttgctagtttgttatcagaatcgcagatccggcttcagccggtttgccggctgaaagcgctatttctt ccagaattgccatgattttttccccacgggaggcgtcactggctcccgtgttgtcggcag ctttgattcgataagcagcatcgcctgtttcaggctgtctatgtgtgactgttgagctgtaacaagttgtctcaggtgttcaatttcatgttctagttgctttgttttactggtttcacc tgttctattaggtgttacatgctgttcatctgttacattgtcgatctgttcatggtgaac agctttgaatgcaccaaaaactcgtaaaagctctgatgtatctatcttttttacaccgtt ttcatctgtgcatatggacagttttccctttgatatgtaacggtgaacagttgttctact tttgtttgttagtcttgatgcttcactgatagatacaagagccataagaacctcagatcc ttccgtatttagccagtatgttctctagtgtggttcgttgtttttgcgtgagccatgaga acgaaccattgagatcatacttactttgcatgtcactcaaaaattttgcctcaaaactgg tgagctgaatttttgcagttaaagcatcgtgtagtgtttttcttagtccgttatgtaggt aggaatctgatgtaatggttgttggtattttgtcaccattcatttttatctggttgttct caagttcggttacgagatccatttgtctatctagttcaacttggaaaatcaacgtatcag tcgggcggcctcgcttatcaaccaccaatttcatattgctgtaagtgtttaaatctttac ttattggtttcaaaacccattggttaagccttttaaactcatggtagttattttcaagca ttaacatgaacttaaattcatcaaggctaatctctatatttgccttgtgagttttctttt gtgttagttcttttaataaccactcataaatcctcatagagtatttgttttcaaaagact taacatgttccagattatattttatgaatttttttaactggaaaagataaggcaatatct cttcactaaaaactaattctaatttttcgcttgagaacttggcatagtttgtccactgga aaatctcaaagcctttaaccaaaggattcctgatttccacagttctcgtcatcagctctc tggttgctttagctaatacaccataagcattttccctactgatgttcatcatctgagcgt attggttataagtgaacgataccgtccgttctttccttgtagggttttcaatcgtggggt tgagtagtgccacacagcataaaattagcttggtttcatgctccgttaagtcatagcgac taatcgctagttcatttgctttgaaaacaactaattcagacatacatctcaattggtcta ggtgattttaatcactataccaattgagatgggctagtcaatgataattactagtccttt tcccgggtgatctgggtatctgtaaattctgctagacctttgctggaaaacttgtaaatt ctgctagaccctctgtaaattccgctagacctttgtgtgttttttttgtttatattcaag tggttataatttatagaataaagaaagaataaaaaaagataaaaagaatagatcccagcc ctgtgtataactcactactttagtcagttccgcagtattacaaaaggatgtcgcaaacgc tgtttgctcctctacaaaacagaccttaaaaccctaaaggcttaagtagcaccctcgcaa gctcgggcaaatcgctgaatattccttttgtctccgaccatcaggcacctgagtcgctgt ctttttcgtgacattcagttcgctgcgctcacggctctggcagtgaatgggggtaaatgg cactacaggcgccttttatggattcatgcaaggaaactacccataatacaagaaaagccc gtcacgggcttctcagggcgttttatggcgggtctgctatgtggtgctatctgacttttt gctgttcagcagttcctgccctctgattttccagtctgaccacttcggattatcccgtga caggtcattcagactggctaatgcacccagtaaggcagcggtatcatcaacaggcttacc cgtcttactgtccctagtgcttggattctcaccaataaaaaacgcccggcggcaaccgag cgttctgaacaaatccagatggagttctgaggtcattactggatctatcaacaggagtcc aagcgagctcgatatcaaattacgccccgccctgccactcatcgcagtactgttgtaatt cattaagcattctgccgacatggaagccatcacaaacggcatgatgaacctgaatcgcca gcggcatcagcaccttgtcgccttgcgtataatatttgcccatggtgaaaacgggggcga agaagttgtccatattggccacgtttaaatcaaaactggtgaaactcacccagggattgg ctgagacgaaaaacatattctcaataaaccctttagggaaataggccaggttttcaccgt aacacgccacatcttgcgaatatatgtgtagaaactgccggaaatcgtcgtggtattcac tccagagcgatgaaaacgtttcagtttgctcatggaaaacggtgtaacaagggtgaacac tatcccatatcaccagctcaccgtctttcattgccatacgaaattccggatgagcattca tcaggcgggcaagaatgtgaataaaggccggataaaacttgtgcttatttttctttacgg tctttaaaaaggccgtaatatccagctgaacggtctggttataggtacattgagcaactg actgaaatgcctcaaaatgttctttacgatgccattgggatatatcaacggtggtatatc cagtgatttttttctccattttagcttccttagctcctgaaaatctcgataactcaaaaa atacgcccggtagtgatcttatttcattatggtgaaagttggaacctcttacgtgccgat caacgtctcattttcgccagatatc");
        completeSequence.replace(/\s+/g, '');
        console.log("able to deal with completeSequence");
        this.tempDNA = Teselagen.bio.sequence.DNATools.createDNASequence("testSeq", completeSequence);
        },

    /**
     * Populates the itemselector field with enzyme names.
     * Called when the user selects a new group in the combobox.
     */
    onEnzymeGroupSelected: function(combobox) {
        var newGroup = this.GroupManager.groupByName(combobox.getValue());
        var newStoreData = [];

        var enzymeArray = [];

        Ext.each(newGroup.getEnzymes(), function(enzyme) {
            enzymeArray.push({name: enzyme.getName()});
        });

        this.enzymeListSelector.fromField.store.loadData(enzymeArray, false);
        this.enzymeListSelector.fromField.bindStore(this.enzymeListSelector.fromField.store);
    },
    
    onDigestButtonClick: function(){
        console.log(this.enzymeListSelector.toField.store); 
        console.log("Digesting!");
        this.updateSampleLane(this.enzymeListSelector.toField.store);
    },

    initializeDigestDrawingPanel: function(){
        this.digestPanel = this.managerWindow.query("#drawingSurface")[0];
        this.digestSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
            surface: this.digestPanel.surface
        });
       this.sampleSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
            surface: this.digestPanel.surface
        });
       this.sampleLane = Ext.create("Teselagen.models.digest.SampleLane", {
            ladder: "1kb",
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
            ladder: "1kb",
        });
        var ladderSelector = this.managerWindow.query("#ladderSelector")[0];
        this.updateLadderLane(ladderSelector);

       
 },

    updateLadderLane: function(combobox){
        this.ladderSpriteGroup.destroy();
        this.ladderSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
            surface: this.digestPanel.surface
        });
       this.sampleLane.setLadder("1kb");

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
                surface: this.digestPanel.surface,
                x: 40,
                y: yPosition
            });

            this.ladderSpriteGroup.add(bandText); 
            this.ladderSpriteGroup.add(gelBand); 
        
        }, this);
       // this.ladderSpriteGroup.show(true);
        this.showSprites(this.ladderSpriteGroup);
console.log("changing ladder");
    },

    updateSampleLane: function(selectedEnzymes){
        console.log("Updating sample...");
        console.log(selectedEnzymes);
        //This array contains the actual RestrictionEnzyme datastructures.
        var currentSequence = "";
        var enzymes = [];
        selectedEnzymes.each(function(enzyme){
            console.log(enzyme.data.name);
            enzymes.push(Teselagen.manager.RestrictionEnzymeGroupManager.getEnzymeByName(enzyme.data.name));
        });
        var newFragments = this.DigestionCalculator.digestSequence(this.tempDNA, enzymes);
        this.sampleSpriteGroup.destroy();
        this.sampleSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
            surface: this.digestPanel.surface
        });
this.sampleLane.setFragments(newFragments);
        console.log(this.sampleLane.getBandYPositions());
        this.sampleLane.redrawBands(); 
        Ext.each(this.sampleLane.getBandYPositions(), function(yPosition, index){
             var gelBand = Ext.create('Ext.draw.Sprite', {
                    type: 'rect',
                    fill: '#fff',
                    height: 2,
                    width: 100,
              //      surface: this.digestPanel.surface,
                    x: 300,
                    y: yPosition
                });
                
                this.sampleSpriteGroup.add(gelBand); 
            
            }, this);
           // this.ladderSpriteGroup.show(true);
                this.showSprites(this.sampleSpriteGroup);
        console.log("changing sample");

    },

    showSprites: function(pSpriteGroup){
       var tempSurface = this.digestPanel.surface;
       pSpriteGroup.each(function(band){
           tempSurface.add(band);
       });
       pSpriteGroup.show(true);

    },


});
