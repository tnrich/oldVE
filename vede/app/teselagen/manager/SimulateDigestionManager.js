/**
 * Simulate digestion manager
 * @class Teselagen.manager.SimulateDigestionManager
 */
Ext.require("Teselagen.models.digest.Ladder");
Ext.define("Teselagen.manager.SimulateDigestionManager", {
    config: {
        digestPanel: null,
        background: null,
        sampleLane: null,
        ladderLane: null,
        backgroundSpriteGroup: null,
        sampleSpriteGroup: null,
        laddderSpriteGroup: null,
        groupManager: null,
        enzymeListSelector: null
    },
    constructor: function(inData){
        this.initConfig(inData);
        //this.initializeDigestDrawingPanel();
    },
    filterEnzymes: function(searchCombo, groupSelector){
        //First we populate the store with the right enzymes 
        var currentList = this.groupManager.groupByName(groupSelector.getValue());
        var enzymeArray = [];
        Ext.each(currentList.getEnzymes(), function(enzyme) {
            enzymeArray.push({name: enzyme.getName()});
        });
        var tempSelectedEnzymes = this.enzymeListSelector.toField.store.data.items;
        this.enzymeListSelector.store.loadData(enzymeArray, false);
        this.enzymeListSelector.bindStore(this.enzymeListSelector.store);
        this.enzymeListSelector.toField.store.loadData(tempSelectedEnzymes, false);
        this.enzymeListSelector.toField.bindStore(this.enzymeListSelector.toField.store);
        //remove any items on the left that are on the right
        var list = this.enzymeListSelector.fromField.boundList;
        var store = list.getStore();
        store.suspendEvents();
        tempSelectedEnzymes = this.enzymeListSelector.toField.store.getRange();
        tempSelectedEnzymes.forEach(function(enzyme) {
           var deleted = store.query("name",enzyme.get("name"));
           store.remove(deleted.items[0], false);;
        });
        store.resumeEvents();
        list.refresh();
        //Now we filter based on the search input
        //the default searchphrase will match anything
        var searchPhrase = ".";
        if (searchCombo.getValue() !== null){
            searchPhrase = searchCombo.getValue();
        }
        try {
            var regEx = new RegExp(searchPhrase, "i");
        } catch(err) {
            //We can safely ignore errors in the regex. they'll just result in not getting what you are looking for
            regEx = null;
        }
        this.enzymeListSelector.fromField.store.filterBy(function(enzyme){
            return enzyme.get("name").search(regEx) !== -1;
        }, this);
    },
    /*
     * Updates the Ladder based on the selection in the ladder drop down.
     */
    updateLadderLane: function(ladder){
        //Destroy all previous ladder bands
        this.ladderSpriteGroup.destroy();
        this.ladderSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
            surface: this.digestPanel.surface
        });
        //Set the sample lane ladder so that sample ladder bands scale
        //correctly
        this.sampleLane.setLadder(ladder);
        this.ladderLane.updateLadderLane(ladder);

        //Draw all ladder bands and text labels
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

        //Draw all ladder sprites using helper method
        this.showSprites(this.ladderSpriteGroup);
        console.log("changing ladder");

        //Update sample lane everytime the ladder changes (to rescale band
        //placement). The first time you do this, there won't be any enzymes
        //selected, so an error would be thrown. A slightly hacky way to deal
        //with this issue.
        this.updateSampleLane(this.enzymeListSelector.toField.store);
        this.sampleLaneInitialized = true;
    },
    /*
     * Updates sample lane contents, including rescaling based on ladder
     * selection
     */
    updateSampleLane: function(selectedEnzymes){
        console.log("Updating sample...");
        console.log(selectedEnzymes);
        if (!this.sampleLaneInitialized) return;

        var currentSequence = "";

        //This array contains the actual RestrictionEnzyme datastructures.
        var enzymes = [];
        selectedEnzymes.each(function(enzyme){
            console.log(enzyme.data.name);
            enzymes.push(Teselagen.manager.RestrictionEnzymeGroupManager.getEnzymeByName(enzyme.data.name));
        });

        //Digest the sequence with all of the restriction enzymes you've
        //selected
        var newFragments = this.DigestionCalculator.digestSequence(this.dnaSequence, enzymes);
        this.sampleSpriteGroup.destroy();
        this.sampleSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
            surface: this.digestPanel.surface
        });
        this.sampleLane.setFragments(newFragments);
        // console.log(this.sampleLane.getBandYPositions());
        this.sampleLane.redrawBands(); 

        //Draw all bands in the sample lane
        Ext.each(this.sampleLane.getBandYPositions(), function(yPosition, index){
            var gelBand = Ext.create('Ext.draw.Sprite', {
                type: 'rect',
                fill: '#fff',
                height: 2,
                width: 100,
                x: 300,
                y: yPosition
            });

            this.sampleSpriteGroup.add(gelBand); 

        }, this);
        // this.ladderSpriteGroup.show(true);
        this.showSprites(this.sampleSpriteGroup);
        console.log("changing sample");

    },

    /*
     * A helper method to show a sprite group - the builtin wasn't working.
     */
    showSprites: function(pSpriteGroup){
        var tempSurface = this.digestPanel.surface;
        pSpriteGroup.each(function(band){
            tempSurface.add(band);
        });
        pSpriteGroup.show(true);

    },
    drawGel: function(pSpriteGroup){
    	//just for testing
    	var digestedSequence = null;
    	var puc = "agcgcccaatacgcaaaccgcctctccccgcgcgttggccgattcattaatgcagctggcacgacaggtttcccgactggaaagcgggcagtgagcgcaacgcaattaatgtgagttagctcactcattaggcaccccaggctttacactttatgcttccggctcgtatgttgtgtggaattgtgagcggataacaatttcacacaggaaacagctatgaccatgattacgccaagcttgcatgcctgcaggtcgactctagaggatccccgggtaccgagctcgaattcactggccgtcgttttacaacgtcgtgactgggaaaaccctggcgttacccaacttaatcgccttgcagcacatccccctttcgccagctggcgtaatagcgaagaggcccgcaccgatcgcccttcccaacagttgcgcagcctgaatggcgaatggcgcctgatgcggtattttctccttacgcatctgtgcggtatttcacaccgcatacgtcaaagcaaccatagtacgcgccctgtagcggcgcattaagcgcggcgggtgtggtggttacgcgcagcgtgaccgctacacttgccagcgccctagcgcccgctcctttcgctttcttcccttcctttctcgccacgttcgccggctttccccgtcaagctctaaatcgggggctccctttagggttccgatttagtgctttacggcacctcgaccccaaaaaacttgatttgggtgatggttcacgtagtgggccatcgccctgatagacggtttttcgccctttgacgttggagtccacgttctttaatagtggactcttgttccaaactggaacaacactcaaccctatctcgggctattcttttgatttataagggattttgccgatttcggcctattggttaaaaaatgagctgatttaacaaaaatttaacgcgaattttaacaaaatattaacgtttacaattttatggtgcactctcagtacaatctgctctgatgccgcatagttaagccagccccgacacccgccaacacccgctgacgcgccctgacgggcttgtctgctcccggcatccgcttacagacaagctgtgaccgtctccgggagctgcatgtgtcagaggttttcaccgtcatcaccgaaacgcgcgagacgaaagggcctcgtgatacgcctatttttataggttaatgtcatgataataatggtttcttagacgtcaggtggcacttttcggggaaatgtgcgcggaacccctatttgtttatttttctaaatacattcaaatatgtatccgctcatgagacaataaccctgataaatgcttcaataatattgaaaaaggaagagtatgagtattcaacatttccgtgtcgcccttattcccttttttgcggcattttgccttcctgtttttgctcacccagaaacgctggtgaaagtaaaagatgctgaagatcagttgggtgcacgagtgggttacatcgaactggatctcaacagcggtaagatccttgagagttttcgccccgaagaacgttttccaatgatgagcacttttaaagttctgctatgtggcgcggtattatcccgtattgacgccgggcaagagcaactcggtcgccgcatacactattctcagaatgacttggttgagtactcaccagtcacagaaaagcatcttacggatggcatgacagtaagagaattatgcagtgctgccataaccatgagtgataacactgcggccaacttacttctgacaacgatcggaggaccgaaggagctaaccgcttttttgcacaacatgggggatcatgtaactcgccttgatcgttgggaaccggagctgaatgaagccataccaaacgacgagcgtgacaccacgatgcctgtagcaatggcaacaacgttgcgcaaactattaactggcgaactacttactctagcttcccggcaacaattaatagactggatggaggcggataaagttgcaggaccacttctgcgctcggcccttccggctggctggtttattgctgataaatctggagccggtgagcgtgggtctcgcggtatcattgcagcactggggccagatggtaagccctcccgtatcgtagttatctacacgacggggagtcaggcaactatggatgaacgaaatagacagatcgctgagataggtgcctcactgattaagcattggtaactgtcagaccaagtttactcatatatactttagattgatttaaaacttcatttttaatttaaaaggatctaggtgaagatcctttttgataatctcatgaccaaaatcccttaacgtgagttttcgttccactgagcgtcagaccccgtagaaaagatcaaaggatcttcttgagatcctttttttctgcgcgtaatctgctgcttgcaaacaaaaaaaccaccgctaccagcggtggtttgtttgccggatcaagagctaccaactctttttccgaaggtaactggcttcagcagagcgcagataccaaatactgtccttctagtgtagccgtagttaggccaccacttcaagaactctgtagcaccgcctacatacctcgctctgctaatcctgttaccagtggctgctgccagtggcgataagtcgtgtcttaccgggttggactcaagacgatagttaccggataaggcgcagcggtcgggctgaacggggggttcgtgcacacagcccagcttggagcgaacgacctacaccgaactgagatacctacagcgtgagctatgagaaagcgccacgcttcccgaagggagaaaggcggacaggtatccggtaagcggcagggtcggaacaggagagcgcacgagggagcttccagggggaaacgcctggtatctttatagtcctgtcgggtttcgccacctctgacttgagcgtcgatttttgtgatgctcgtcaggggggcggagcctatggaaaaacgccagcaacgcggcctttttacggttcctggccttttgctggccttttgctcacatgttctttcctgcgttatcccctgattctgtggataaccgtattaccgcctttgagtgagctgataccgctcgccgcagccgaacgaccgagcgcagcgagtcagtgagcgaggaagcggaag";
    	var enzymes = [];

    	var Ladder = Teselagen.models.digest.Ladder;
    	digestedSequence = Teselagen.bio.sequence.DNATools.createDNASequence("pUC119", puc);
    	digestedSequence.setCircular(true);
    	var testEnzymes = ["EcoRI", "BamHI"];
    	//This array contains the actual RestrictionEnzyme datastructures.
    	for (var enzyme in testEnzymes){
    		var temp = testEnzymes[enzyme];
    		enzymes.push(Teselagen.bio.enzymes.RestrictionEnzymeManager.getRestrictionEnzyme(testEnzymes[enzyme]));
    	};
    	//just for testing
    	var tempSurface = this.digestPanel.surface;
    	var height = this.digestPanel.surface.height;
    	var width = this.digestPanel.surface.width;
    	var gel = Ext.create("Teselagen.models.digest.Gel", {name: "Gel", actualHeight: height, actualWidth: width});
    	var ladderLane = Ext.create("Teselagen.models.digest.GelLane", {name: "TestLadder", ladder: Ladder.BP_LADDER_BANDS});
    	gel.insertLane(ladderLane);
    	var sampleLane = Ext.create("Teselagen.models.digest.GelLane", {name: "TestA", sequence: digestedSequence, enzymes: enzymes});
    	gel.insertLane(sampleLane);
    	var sprites = gel.draw();
    	if (this.ladderSpriteGroup !== undefined && this.ladderSpriteGroup !== null) {
    		this.ladderSpriteGroup.destroy();
    	}
    	this.ladderSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
    		surface: this.digestPanel.surface
    	});
    	for (var i in sprites){
    		this.ladderSpriteGroup.add(sprites[i]);
    	}
    	this.ladderSpriteGroup.each(function(band){
    		tempSurface.add(band);
    	});
    	this.ladderSpriteGroup.show(true);

    },


    /*
     * Initializes components of the drawing panel
     */
    initializeDigestDrawingPanel: function(){
    	this.digestSpriteGroup = Ext.create('Ext.draw.CompositeSprite', {
    		surface: this.digestPanel.surface
    	});
    	var height = this.digestPanel.surface.height;
    	var width = this.digestPanel.surface.width;
    	//console.log(this.ladderLane.getLadder());
    	var digestBG = Ext.create('Ext.draw.Sprite', {
    		type: 'rect',
    		height: height,
    		width: width,
    		fill: '#000',
    		x: 0,
    		y: 0
    	});
    	this.digestSpriteGroup.add(digestBG);
    	var tempSurface = this.digestPanel.surface;
    	tempSurface.add(digestBG );
    	this.digestSpriteGroup.show(true);
    },
});