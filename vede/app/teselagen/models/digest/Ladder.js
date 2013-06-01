 /**
 * @class Teselagen.models.digest.Ladder
 * Class describing a DNA Ladder
 * @author Micah Lerner
 * @author Zinovii Dmytriv (original author)
 */

Ext.define("Teselagen.models.digest.Ladder", {

    config: {
        ladderTypes: null,
        bandSizes: null
    },
    statics: {
        BP_LADDER_BANDS: [20000, 10000, 7000, 5000, 4000, 3000, 2000, 1500, 1000, 700, 500, 400, 300, 200, 75],
        // GeneRuler High Range DNA Ladder (10,171-48,502 bp) http://www.thermoscientificbio.com/nucleic-acid-electrophoresis/generuler-high-range-dna-ladder-10171-to-48502-bp/esis/lambda-dna-ecori-plus-hindiii-marker
        GR_HIGH_RANGE_LADDER_BANDS: [48502, 24508, 20555, 17000, 15258, 13825, 12119, 10171],
        //Generuler 1KB DNA Ladder 250 - 10000 http://www.thermoscientificbio.com/nucleic-acid-electrophoresis/generuler-1-kb-dna-ladder-250-to-10000-bp/
        GR_1KB_LADDER_BANDS: [10000, 8000, 6000, 5000, 4000, 3500, 3000, 2500, 2000, 1500, 1000, 750, 500, 250],
        //GeneRuler 1 kb Plus DNA Ladder 75 to 20,000 bp http://www.thermoscientificbio.com/nucleic-acid-electrophoresis/generuler-1-kb-plus-dna-ladder-75-to-20000-bp/
        GR_1KB_PLUS_LADDER_BANDS: [20000, 10000, 7000, 5000, 4000, 3000, 2000, 1500, 1000, 700, 500, 400, 300, 200, 75],
        //GeneRuler 100 bp DNA Ladder http://www.thermoscientificbio.com/nucleic-acid-electrophoresis/generuler-100-bp-dna-ladder-100-to-1000-bp/
        GR_100BP_LADDER_BANDS: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
        //GeneRuler 100 bp Plus DNA Ladder 100 to 3000 bp http://www.thermoscientificbio.com/nucleic-acid-electrophoresis/generuler-100-bp-plus-dna-ladder-100-to-3000-bp/
        GR_100BP_PLUS_LADDER_BANDS: [3000, 2000, 1500, 1200, 1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
        //GeneRuler 50 bp DNA Ladder, 50-1000 bp http://www.thermoscientificbio.com/nucleic-acid-electrophoresis/generuler-50-bp-dna-ladder/
        GR_50BP_LADDER_BANDS: [1000, 900, 800, 700, 600, 500, 400, 300, 250,  200, 150, 100, 50],
        //GeneRuler Low Range DNA Ladder 25 to 700 bp http://www.thermoscientificbio.com/nucleic-acid-electrophoresis/generuler-low-range-dna-ladder-25-to-700-bp/
        GR_LOW_RANGE_LADDER_BANDS: [700, 500, 400, 300, 200, 150, 100, 75, 50, 25],
        //GeneRuler Ultra Low Range DNA Ladder 10 to 300 bp http://www.thermoscientificbio.com/nucleic-acid-electrophoresis/generuler-ultra-low-range-dna-ladder-10-to-300-bp/
        GR_ULTRA_LOW_RANGE_LADDER_BANDS: [300, 200, 150, 100, 75, 50, 35, 25, 20, 15, 10],
        //pBR322 DNA/BsuRI (HaeIII) Marker http://www.thermoscientificbio.com/nucleic-acid-electrophoresis/pbr322-dna-bsuri-haeiii-marker
        PBR322_LADDER_BANDS: [587, 540, 502, 458, 434, 267, 234, 213, 192, 184, 124, 123, 104, 89, 90],
        //Lambda DNA/EcoRI+HindIII Marker http://www.thermoscientificbio.com/nucleic-acid-electrophor
        LAMBDA_LADDER_BANDS: [21226, 5148, 4973, 4268, 3530, 2027, 1904, 1584, 1375, 947, 831, 564],
        KB_LADDER_BANDS: [3000, 2000, 1500, 1200, 1000, 900, 800, 700, 600, 500, 400, 300, 200, 100]
    },

	/**
	 * Input parameters.
	 * @param {String} name The name of the ladder..
	 * @param {Number[]} bandSizes A list of integers that specify ladder
     * band sizes
	 */
	fields: [
		{name: "bandSizes", type: "auto", defaultValue: null}
		//{name: "name", type: "string", defaultValue: ""},
	],

    constructor: function(inData){
        this.initConfig(inData);
        this.statics();
        this.ladderTypes = new Ext.util.HashMap();
        this.ladderTypes.add("GeneRuler High Range DNA Ladder 10,171-48,502 bp", this.self.GR_HIGH_RANGE_LADDER_BANDS);
        this.ladderTypes.add("Generuler 1 kb DNA Ladder 250-10000 bp", this.self.GR_1KB_LADDER_BANDS);
        this.ladderTypes.add("GeneRuler 1 kb Plus DNA Ladder 75-20,000 bp", this.self.GR_1KB_PLUS_LADDER_BANDS);
        this.ladderTypes.add("GeneRuler 100 bp DNA Ladder 100-1000 bp", this.self.GR_100BP_LADDER_BANDS);
        this.ladderTypes.add("GeneRuler 100 bp Plus DNA Ladder 100-3000 bp", this.self.GR_100BP_PLUS_LADDER_BANDS);
        this.ladderTypes.add("GeneRuler 50 bp DNA Ladder, 50-1000 bp", this.self.GR_50BP_LADDER_BANDS);
        this.ladderTypes.add("GeneRuler Low Range DNA Ladder 25-700 bp", this.self.GR_LOW_RANGE_LADDER_BANDS);

//        this.setLadder(inData.ladderName);
//                return this;

    },

    setLadder: function(pLadder){
        if (pLadder.indexOf("1kb") > -1 ){
            this.bandSizes = this.self.BP_LADDER_BANDS;
        }else {
            this.bandSizes = this.self.KB_LADDER_BANDS;
        }

    }
});
