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
        enzymeListSelector: null,
        gel: null, 
        Ladder: null,
        enzymes: null,
        dnaSequence: null
    },
    constructor: function(inData){
        this.initConfig(inData);
    	this.Ladder = Ext.create("Teselagen.models.digest.Ladder");
        //this.initializeDigestDrawingPanel();
    },
    /*
     * Updates the DNA sequence to be digested
     * 
     */
    setDnaSequence: function(dnaSequence){
    	this.dnaSequence = dnaSequence;
    	//For right now, vector editor does not set the sequence as circular when reading from GenBank but 
    	// the digestion assumes that it is circular
    	dnaSequence.setCircular(true);
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
        this.selectedLadder = this.Ladder.ladderTypes.get(ladder);
        //Trigger redrawing everything after the ladder has changed
        this.drawGel();
    },
    /*
     * Updates sample lane contents, including rescaling based on ladder
     * selection
     */
    updateSampleLane: function(selectedEnzymes){
        console.log("Updating sample...");
        console.log(selectedEnzymes);
        //Clear the enzymes array
        //Have to use local scope because calls to this in the each loop refere to the selectedEnzymes object, not this
        var tempEnzymes = [];
        selectedEnzymes.each(function(enzyme){
            console.log(enzyme.data.name);
            tempEnzymes.push(Teselagen.manager.RestrictionEnzymeGroupManager.getEnzymeByName(enzyme.data.name));
        });
        this.enzymes = tempEnzymes;
        this.drawGel();
    },
    drawGel: function(pSpriteGroup){
    	if (this.digestPanel === null) {
    		//We got here before the manager is initialized so bail
    		return;
    	}
    	//just for testing
//    	var digestedSequence = null;
//    	var puc = "agcgcccaatacgcaaaccgcctctccccgcgcgttggccgattcattaatgcagctggcacgacaggtttcccgactggaaagcgggcagtgagcgcaacgcaattaatgtgagttagctcactcattaggcaccccaggctttacactttatgcttccggctcgtatgttgtgtggaattgtgagcggataacaatttcacacaggaaacagctatgaccatgattacgccaagcttgcatgcctgcaggtcgactctagaggatccccgggtaccgagctcgaattcactggccgtcgttttacaacgtcgtgactgggaaaaccctggcgttacccaacttaatcgccttgcagcacatccccctttcgccagctggcgtaatagcgaagaggcccgcaccgatcgcccttcccaacagttgcgcagcctgaatggcgaatggcgcctgatgcggtattttctccttacgcatctgtgcggtatttcacaccgcatacgtcaaagcaaccatagtacgcgccctgtagcggcgcattaagcgcggcgggtgtggtggttacgcgcagcgtgaccgctacacttgccagcgccctagcgcccgctcctttcgctttcttcccttcctttctcgccacgttcgccggctttccccgtcaagctctaaatcgggggctccctttagggttccgatttagtgctttacggcacctcgaccccaaaaaacttgatttgggtgatggttcacgtagtgggccatcgccctgatagacggtttttcgccctttgacgttggagtccacgttctttaatagtggactcttgttccaaactggaacaacactcaaccctatctcgggctattcttttgatttataagggattttgccgatttcggcctattggttaaaaaatgagctgatttaacaaaaatttaacgcgaattttaacaaaatattaacgtttacaattttatggtgcactctcagtacaatctgctctgatgccgcatagttaagccagccccgacacccgccaacacccgctgacgcgccctgacgggcttgtctgctcccggcatccgcttacagacaagctgtgaccgtctccgggagctgcatgtgtcagaggttttcaccgtcatcaccgaaacgcgcgagacgaaagggcctcgtgatacgcctatttttataggttaatgtcatgataataatggtttcttagacgtcaggtggcacttttcggggaaatgtgcgcggaacccctatttgtttatttttctaaatacattcaaatatgtatccgctcatgagacaataaccctgataaatgcttcaataatattgaaaaaggaagagtatgagtattcaacatttccgtgtcgcccttattcccttttttgcggcattttgccttcctgtttttgctcacccagaaacgctggtgaaagtaaaagatgctgaagatcagttgggtgcacgagtgggttacatcgaactggatctcaacagcggtaagatccttgagagttttcgccccgaagaacgttttccaatgatgagcacttttaaagttctgctatgtggcgcggtattatcccgtattgacgccgggcaagagcaactcggtcgccgcatacactattctcagaatgacttggttgagtactcaccagtcacagaaaagcatcttacggatggcatgacagtaagagaattatgcagtgctgccataaccatgagtgataacactgcggccaacttacttctgacaacgatcggaggaccgaaggagctaaccgcttttttgcacaacatgggggatcatgtaactcgccttgatcgttgggaaccggagctgaatgaagccataccaaacgacgagcgtgacaccacgatgcctgtagcaatggcaacaacgttgcgcaaactattaactggcgaactacttactctagcttcccggcaacaattaatagactggatggaggcggataaagttgcaggaccacttctgcgctcggcccttccggctggctggtttattgctgataaatctggagccggtgagcgtgggtctcgcggtatcattgcagcactggggccagatggtaagccctcccgtatcgtagttatctacacgacggggagtcaggcaactatggatgaacgaaatagacagatcgctgagataggtgcctcactgattaagcattggtaactgtcagaccaagtttactcatatatactttagattgatttaaaacttcatttttaatttaaaaggatctaggtgaagatcctttttgataatctcatgaccaaaatcccttaacgtgagttttcgttccactgagcgtcagaccccgtagaaaagatcaaaggatcttcttgagatcctttttttctgcgcgtaatctgctgcttgcaaacaaaaaaaccaccgctaccagcggtggtttgtttgccggatcaagagctaccaactctttttccgaaggtaactggcttcagcagagcgcagataccaaatactgtccttctagtgtagccgtagttaggccaccacttcaagaactctgtagcaccgcctacatacctcgctctgctaatcctgttaccagtggctgctgccagtggcgataagtcgtgtcttaccgggttggactcaagacgatagttaccggataaggcgcagcggtcgggctgaacggggggttcgtgcacacagcccagcttggagcgaacgacctacaccgaactgagatacctacagcgtgagctatgagaaagcgccacgcttcccgaagggagaaaggcggacaggtatccggtaagcggcagggtcggaacaggagagcgcacgagggagcttccagggggaaacgcctggtatctttatagtcctgtcgggtttcgccacctctgacttgagcgtcgatttttgtgatgctcgtcaggggggcggagcctatggaaaaacgccagcaacgcggcctttttacggttcctggccttttgctggccttttgctcacatgttctttcctgcgttatcccctgattctgtggataaccgtattaccgcctttgagtgagctgataccgctcgccgcagccgaacgaccgagcgcagcgagtcagtgagcgaggaagcggaag";
//    	var enzymes = [];
//
//    	var Ladder = Teselagen.models.digest.Ladder;
//    	digestedSequence = Teselagen.bio.sequence.DNATools.createDNASequence("pUC119", puc);
//    	digestedSequence.setCircular(true);
//    	var testEnzymes = ["EcoRI", "BamHI"];
//    	//This array contains the actual RestrictionEnzyme datastructures.
//    	for (var enzyme in testEnzymes){
//    		var temp = testEnzymes[enzyme];
//    		enzymes.push(Teselagen.bio.enzymes.RestrictionEnzymeManager.getRestrictionEnzyme(testEnzymes[enzyme]));
//    	};
    	//just for testing
    	var tempSurface = this.digestPanel.surface;
    	var height = this.digestPanel.surface.height;
    	var width = this.digestPanel.surface.width;
    	var gel = Ext.create("Teselagen.models.digest.Gel", {name: "Gel", actualHeight: height, actualWidth: width});
    	var ladderLane = Ext.create("Teselagen.models.digest.GelLane", {name: "TestLadder", ladder: this.selectedLadder});
    	gel.insertLane(ladderLane);
    	var sampleLane = Ext.create("Teselagen.models.digest.GelLane", {name: "TestA", sequence: this.dnaSequence, enzymes: this.enzymes});
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

    	for (var i in sprites){
    		//only show tooltips for the products of digestion. I tried to make these tooltips while making the sprites but
    		// it doesn't work. It seems you have to wait until the sprites have rendered to make the tooltips.
    		// http://garysieling.com/blog/extjs-tooltip-example
    		if (sprites[i].bandType === "digest") {
	            var tip = Ext.create('Ext.tip.ToolTip', {
	                target: sprites[i].id,
	                showDelay: 0, //Show this tip immediately after the mouseover
	                dismissDelay: 0, //Never hide this tooltip if the mouse is still over the sprite
	                html: sprites[i].size + " bp, " + sprites[i].start + "(" + sprites[i].startRE + ").." + sprites[i].end + "(" + sprites[i].endRE + ")"
	            });
    		}
    	}
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