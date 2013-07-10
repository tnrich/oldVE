/**
 * Translation Utilities to convert between RNA, DNA, and Protein.
 * See Teselagen.bio.sequence.symbols.NucleotideSymbol.
 * @class Teselagen.bio.sequence.TranslationUtils
 * @author Micah Lerner
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.bio.sequence.TranslationUtils", {

	requires: ["Teselagen.bio.sequence.alphabets.DNAAlphabet",
			 "Teselagen.bio.sequence.alphabets.ProteinAlphabet", 
			 "Teselagen.bio.sequence.alphabets.RNAAlphabet",
			 "Teselagen.bio.sequence.common.SymbolList",
			 "Teselagen.bio.sequence.symbols.GapSymbol", 
			 "Teselagen.bio.sequence.symbols.IllegalSymbolException"],

	alternateClassName: "Teselagen.TranslationUtils",
	singleton: true,

	dnaToRNATranslationTable: null,
	rnaToDNATranslationTable: null,
	aminoAcidsTranslationTable: null,

    constructor: function() {
        this.ProteinAlphabet = Teselagen.bio.sequence.alphabets.ProteinAlphabet;
        this.DNAAlphabet = Teselagen.bio.sequence.alphabets.DNAAlphabet;
        this.RNAAlphabet = Teselagen.bio.sequence.alphabets.RNAAlphabet;
    },
	/**
	 * Converts a DNA symbol to an RNA symbol
	 * @param  {NucleotideSymbol} pSymbol an input NucleotideSymbol
	 * @return {NucleotideSymbol}         Returns the corresponding RNA symbol
	 */
	dnaToRNASymbol: function(pSymbol){
		this.initializeDNAToRNATranslationTable();

		//Typechecks for GapSymbol
		if (pSymbol instanceof Teselagen.bio.sequence.symbols.GapSymbol) {
			return  Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
										name: "Gap",
										value: "-"
								});
		};

		var newSymbol = this.dnaToRNATranslationTable[pSymbol.getValue()] || null;

		if (newSymbol == null) {
			Teselagen.bio.sequence.symbols.IllegalSymbolException.raise("Failed to find complement for symbol '" + symbol.value + ".'");
		};

		return newSymbol;
	},

		/**
	 * Converts a list of DNA symbols to RNA
	 * @param  {SymbolList} pSymbolList A list of input symbols
	 * @return {SymbolList}             A list of RNA symbols
	 */
	dnaToRNA: function(pSymbolList){
		var symbols = pSymbolList.getSymbols();
		var rnaSymbols = [];

		//If there are symbols, dive into this loop.
		if (symbols.length > 0) {
			for (var i = 0; i < symbols.length; i++) {
				rnaSymbols[i] = this.dnaToRNASymbol(symbols[i]);
			};
		};

		return Ext.create("Teselagen.bio.sequence.common.SymbolList", {
			symbols: rnaSymbols,
			alphabet:  "Teselagen.bio.sequence.alphabets.RNAAlphabet"
		});
	},



	/**
	 * Converts an RNA symbol to a DNA symbol
	 * @return {NucleotideSymbol}
	 */
	rnaToDNASymbol: function(pSymbol){
		this.initializeRNAToDNATranslationTable();

		//Typechecks if this is a Gap Symbol
		if (Ext.getClassName(pSymbol).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1) {
			return Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
										name: "Gap",
										value: "-"
								});
		};

		var newSymbol = this.rnaToDNATranslationTable[pSymbol.getValue()] || null;

		if (newSymbol == null) {
			Teselagen.bio.sequence.symbols.IllegalSymbolException.raise("Failed to find complement for symbol '" + symbol.value + ".'");
		};

		return newSymbol;
	},


	/**
	 * Translates RNA to DNA
	 * @param  {SymbolList} pSymbolList an input symbol list containing RNA NucleotideSymbols
	 * @return {SymbolList}             an output symbol list containing DNA NucleotideSymbols
	 */
	rnaToDNA: function(pSymbolList){
		var symbols = pSymbolList.getSymbols();
		var rnaSymbols = [];

		if (symbols.length > 0) {
			for (var i = 0; i < symbols.length; i++) {
				rnaSymbols[i] = this.rnaToDNASymbol(symbols[i]);
			};
		};

		return Ext.create("Teselagen.bio.sequence.common.SymbolList", {
			symbols: rnaSymbols,
			alphabet:  "Teselagen.bio.sequence.alphabets.DNAAlphabet"
		});
	},

	/**
	 * Converts RNA to Protein Symbol
	 * @param  {NucleotideSymbol} pNucleotide1 a NucleotideSymbol
	 * @param  {NucleotideSymbol} pNucleotide2 a NucleotideSymbol
	 * @param  {NucleotideSymbol} pNucleotide3 a NucleotideSymbol
	 * @return {AminoAcidSymbol}              An amino acid that corresponds to the RNA codon
	 */
	rnaToProteinSymbol: function(pNucleotide1, pNucleotide2, pNucleotide3){
		this.initializeAminoAcidsTranslationTable();

		if (Ext.getClassName(pNucleotide1).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1 || Ext.getClassName(pNucleotide2).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1 || Ext.getClassName(pNucleotide3).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1) {
			return Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
										name: "Gap",
										value: "-"
								});
		};

		var triplet = pNucleotide1.getValue() + pNucleotide2.getValue() + pNucleotide3.getValue();

		var symbol = this.aminoAcidsTranslationTable[triplet];

		if (symbol == null) {
			return this.ProteinAlphabet.gap;
		};

		return symbol;
	},

	/**
	 * Converts DNA to Protein Symbol
	 * @param  {NucleotideSymbol} pNucleotide1 a NucleotideSymbol
	 * @param  {NucleotideSymbol} pNucleotide2 a NucleotideSymbol
	 * @param  {NucleotideSymbol} pNucleotide3 a NucleotideSymbol
	 * @return {AminoAcidSymbol}              An amino acid that corresponds to the DNA codon
	 */
	dnaToProteinSymbol: function(pNucleotide1, pNucleotide2, pNucleotide3) {
		this.initializeAminoAcidsTranslationTable();

        /*if(pNucleotide1 instanceof Teselagen.bio.sequence.symbols.GapSymbol ||
           pNucleotide2 instanceof Teselagen.bio.sequence.symbols.GapSymbol ||
           pNucleotide3 instanceof Teselagen.bio.sequence.symbols.GapSymbol) {
			return Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
										name: "Gap",
										value: "-"
								});
		};*/

		var triplet = pNucleotide1.getValue() + pNucleotide2.getValue() + pNucleotide3.getValue();

		var symbol = this.aminoAcidsTranslationTable[triplet];

		if(!symbol) {
			return this.ProteinAlphabet.gap;
		}

		return symbol;
	},

	/**
	 * Translates RNA Sequence to Protein Sequence
	 * @param  {SymbolList} pSymbolList an input symbol list containing RNA NucleotideSymbols
	 * @return {SymbolList}             an output symbol list containing AminoAcidSymbols
	 */
	rnaToProtein: function(pSymbolList){
		var length = pSymbolList.length - (pSymbolList.length % 3);

		if (length == 0) {
			return [];
		}

		var proteinSymbols = [];
		var symbols = pSymbolList.getSymbols();

		for (var i = 0; i < length; i++) {
			var codon = i / 3;
			proteinSymbols[codon] = this.rnaToProteinSymbol(pSymbolList[i], pSymbolList[i+1], pSymbolList[i+2]);
		};


		return Ext.create("Teselagen.bio.sequence.common.SymbolList", {
			symbols: proteinSymbols,
			alphabet:  "Teselagen.bio.sequence.alphabets.ProteinAlphabet"
		});

	},

	/**
	 * Calculates whether three nucleotides make up a start codon
	 * @param  {NucleotideSymbol} pNucleotide1 a NucleotideSymbol
	 * @param  {NucleotideSymbol} pNucleotide2 a NucleotideSymbol
	 * @param  {NucleotideSymbol} pNucleotide3 a NucleotideSymbol
	 * @return {Boolean}             shows whether the nucleotides make up a start codon
	 */
	isStartCodon: function (pNucleotide1, pNucleotide2, pNucleotide3) {
		var result = false;

		var triplet = (pNucleotide1.getValue() + pNucleotide2.getValue() + pNucleotide3.getValue());

		return (triplet === 'atg' || triplet === 'aug' && triplet.indexOf("-") === -1);
	},

    /**
	 * Calculates whether a three character string is a start codon.
	 * @param  {String} codon a three character string.
	 * @return {Boolean} shows whether the nucleotides make up a start codon
	 */
	isStartCodonString: function (codon) {
		return (codon === 'atg' || codon === 'aug' && codon.indexOf("-") === -1);
	},
	
	/**
	 * Calculates whether three nucleotides make up a stop codon
	 * @param  {NucleotideSymbol} pNucleotide1 a NucleotideSymbol
	 * @param  {NucleotideSymbol} pNucleotide2 a NucleotideSymbol
	 * @param  {NucleotideSymbol} pNucleotide3 a NucleotideSymbol
	 * @return {Boolean}             shows whether the nucleotides make up a stop codon
	 */
	isStopCodon: function(pNucleotide1, pNucleotide2, pNucleotide3){
		var result = false;

		var triplet = (pNucleotide1.getValue() + pNucleotide2.getValue() + pNucleotide3.getValue());

		return (triplet == 'taa'
			|| triplet == 'tag'
			|| triplet == 'tga'
			|| triplet == 'uaa'
			|| triplet == 'uag'
			|| triplet == 'uga');
	},

    /**
	 * Calculates whether a three character string is a stop codon.
	 * @param  {String} codon a three character string.
	 * @return {Boolean} shows whether the nucleotides make up a stop codon
	 */
	isStopCodonString: function (codon) {
		return (codon == 'taa'
			|| codon == 'tag'
			|| codon == 'tga'
			|| codon == 'uaa'
			|| codon == 'uag'
			|| codon == 'uga');
	},

	initializeAminoAcidsTranslationTable: function(){
			if (this.aminoAcidsTranslationTable != null) {
				return;
			};

            this.aminoAcidsTranslationTable = {
                gct: this.ProteinAlphabet.getAlanine(),
                gcc: this.ProteinAlphabet.getAlanine(),
                gca: this.ProteinAlphabet.getAlanine(),
                gcg: this.ProteinAlphabet.getAlanine(),
                gcu: this.ProteinAlphabet.getAlanine(),
                cgt: this.ProteinAlphabet.getArginine(),
                cgc: this.ProteinAlphabet.getArginine(),
                cga: this.ProteinAlphabet.getArginine(),
                cgg: this.ProteinAlphabet.getArginine(),
                aga: this.ProteinAlphabet.getArginine(),
                agg: this.ProteinAlphabet.getArginine(),
                cgu: this.ProteinAlphabet.getArginine(),
                aat: this.ProteinAlphabet.getAsparagine(),
                aac: this.ProteinAlphabet.getAsparagine(),
                aau: this.ProteinAlphabet.getAsparagine(),
                gat: this.ProteinAlphabet.getAspartic(),
                gac: this.ProteinAlphabet.getAspartic(),
                gau: this.ProteinAlphabet.getAspartic(),
                tgt: this.ProteinAlphabet.getCysteine(),
                tgc: this.ProteinAlphabet.getCysteine(),
                ugu: this.ProteinAlphabet.getCysteine(),
                ugc: this.ProteinAlphabet.getCysteine(),
                gaa: this.ProteinAlphabet.getGlutamic(),
                gag: this.ProteinAlphabet.getGlutamic(),
                caa: this.ProteinAlphabet.getGlutamine(),
                cag: this.ProteinAlphabet.getGlutamine(),
                ggt: this.ProteinAlphabet.getGlycine(),
                ggc: this.ProteinAlphabet.getGlycine(),
                gga: this.ProteinAlphabet.getGlycine(),
                ggg: this.ProteinAlphabet.getGlycine(),
                ggu: this.ProteinAlphabet.getGlycine(),
                cat: this.ProteinAlphabet.getHistidine(),
                cac: this.ProteinAlphabet.getHistidine(),
                cau: this.ProteinAlphabet.getHistidine(),
                att: this.ProteinAlphabet.getIsoleucine(),
                atc: this.ProteinAlphabet.getIsoleucine(),
                ata: this.ProteinAlphabet.getIsoleucine(),
                auu: this.ProteinAlphabet.getIsoleucine(),
                auc: this.ProteinAlphabet.getIsoleucine(),
                aua: this.ProteinAlphabet.getIsoleucine(),
                ctt: this.ProteinAlphabet.getLeucine(),
                ctc: this.ProteinAlphabet.getLeucine(),
                cta: this.ProteinAlphabet.getLeucine(),
                ctg: this.ProteinAlphabet.getLeucine(),
                tta: this.ProteinAlphabet.getLeucine(),
                ttg: this.ProteinAlphabet.getLeucine(),
                cuu: this.ProteinAlphabet.getLeucine(),
                cuc: this.ProteinAlphabet.getLeucine(),
                cua: this.ProteinAlphabet.getLeucine(),
                cug: this.ProteinAlphabet.getLeucine(),
                uua: this.ProteinAlphabet.getLeucine(),
                uug: this.ProteinAlphabet.getLeucine(),
                aaa: this.ProteinAlphabet.getLysine(),
                aag: this.ProteinAlphabet.getLysine(),
                atg: this.ProteinAlphabet.getMethionine(),
                aug: this.ProteinAlphabet.getMethionine(),
                ttt: this.ProteinAlphabet.getPhenylalanine(),
                ttc: this.ProteinAlphabet.getPhenylalanine(),
                uuu: this.ProteinAlphabet.getPhenylalanine(),
                uuc: this.ProteinAlphabet.getPhenylalanine(),
                cct: this.ProteinAlphabet.getProline(),
                ccc: this.ProteinAlphabet.getProline(),
                cca: this.ProteinAlphabet.getProline(),
                ccg: this.ProteinAlphabet.getProline(),
                ccu: this.ProteinAlphabet.getProline(),
                tct: this.ProteinAlphabet.getSerine(),
                tcc: this.ProteinAlphabet.getSerine(),
                tca: this.ProteinAlphabet.getSerine(),
                tcg: this.ProteinAlphabet.getSerine(),
                agt: this.ProteinAlphabet.getSerine(),
                agc: this.ProteinAlphabet.getSerine(),
                ucu: this.ProteinAlphabet.getSerine(),
                ucc: this.ProteinAlphabet.getSerine(),
                uca: this.ProteinAlphabet.getSerine(),
                ucg: this.ProteinAlphabet.getSerine(),
                agu: this.ProteinAlphabet.getSerine(),
                act: this.ProteinAlphabet.getThreonine(),
                acc: this.ProteinAlphabet.getThreonine(),
                aca: this.ProteinAlphabet.getThreonine(),
                acg: this.ProteinAlphabet.getThreonine(),
                acu: this.ProteinAlphabet.getThreonine(),
                tgg: this.ProteinAlphabet.getTryptophan(),
                ugg: this.ProteinAlphabet.getTryptophan(),
                tat: this.ProteinAlphabet.getTyrosine(),
                tac: this.ProteinAlphabet.getTyrosine(),
                uau: this.ProteinAlphabet.getTyrosine(),
                uac: this.ProteinAlphabet.getTyrosine(),
                gtt: this.ProteinAlphabet.getValine(),
                gtc: this.ProteinAlphabet.getValine(),
                gta: this.ProteinAlphabet.getValine(),
                gtg: this.ProteinAlphabet.getValine(),
                guu: this.ProteinAlphabet.getValine(),
                guc: this.ProteinAlphabet.getValine(),
                gua: this.ProteinAlphabet.getValine(),
                gug: this.ProteinAlphabet.getValine()
        };
	},

	initializeDNAToRNATranslationTable: function(){
			if (this.dnaToRNATranslationTable != null) {
				return;
			};
            this.dnaToRNATranslationTable= [];
			this.dnaToRNATranslationTable[this.DNAAlphabet.getA().getValue()]   = this.RNAAlphabet.getA();
			this.dnaToRNATranslationTable[this.DNAAlphabet.getT().getValue()]   = this.RNAAlphabet.getU();
			this.dnaToRNATranslationTable[this.DNAAlphabet.getG().getValue()]   = this.RNAAlphabet.getG();
			this.dnaToRNATranslationTable[this.DNAAlphabet.getC().getValue()]   = this.RNAAlphabet.getC();
			this.dnaToRNATranslationTable[this.DNAAlphabet.getY().getValue()]   = this.RNAAlphabet.getY();
			this.dnaToRNATranslationTable[this.DNAAlphabet.getR().getValue()]   = this.RNAAlphabet.getR();
			this.dnaToRNATranslationTable[this.DNAAlphabet.getS().getValue()]   = this.RNAAlphabet.getS();
			this.dnaToRNATranslationTable[this.DNAAlphabet.getW().getValue()]   = this.RNAAlphabet.getW();
			this.dnaToRNATranslationTable[this.DNAAlphabet.getK().getValue()]   = this.RNAAlphabet.getK();
			this.dnaToRNATranslationTable[this.DNAAlphabet.getM().getValue()]   = this.RNAAlphabet.getM();
			this.dnaToRNATranslationTable[this.DNAAlphabet.getB().getValue()]   = this.RNAAlphabet.getB();
			this.dnaToRNATranslationTable[this.DNAAlphabet.getV().getValue()]   = this.RNAAlphabet.getV();
			this.dnaToRNATranslationTable[this.DNAAlphabet.getD().getValue()]   = this.RNAAlphabet.getD();
			this.dnaToRNATranslationTable[this.DNAAlphabet.getH().getValue()]   = this.RNAAlphabet.getH();
			this.dnaToRNATranslationTable[this.DNAAlphabet.getN().getValue()]   = this.RNAAlphabet.getN();
			this.dnaToRNATranslationTable["-"] = Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
										name: "Gap",
										value: "-"
								});
	},

	initializeRNAToDNATranslationTable: function() {
			if (this.rnaToDNATranslationTable != null) {
				return;
			}

			this.rnaToDNATranslationTable = [];


			this.rnaToDNATranslationTable[this.RNAAlphabet.getA().getValue()] = this.DNAAlphabet.getA();
			this.rnaToDNATranslationTable[this.RNAAlphabet.getU().getValue()] = this.DNAAlphabet.getT();
			this.rnaToDNATranslationTable[this.RNAAlphabet.getG().getValue()] = this.DNAAlphabet.getG();
			this.rnaToDNATranslationTable[this.RNAAlphabet.getC().getValue()] = this.DNAAlphabet.getC();
			this.rnaToDNATranslationTable[this.RNAAlphabet.getY().getValue()] = this.DNAAlphabet.getY();
			this.rnaToDNATranslationTable[this.RNAAlphabet.getR().getValue()] = this.DNAAlphabet.getR();
			this.rnaToDNATranslationTable[this.RNAAlphabet.getS().getValue()] = this.DNAAlphabet.getS();
			this.rnaToDNATranslationTable[this.RNAAlphabet.getW().getValue()] = this.DNAAlphabet.getW();
			this.rnaToDNATranslationTable[this.RNAAlphabet.getK().getValue()] = this.DNAAlphabet.getK();
			this.rnaToDNATranslationTable[this.RNAAlphabet.getM().getValue()] = this.DNAAlphabet.getM();
			this.rnaToDNATranslationTable[this.RNAAlphabet.getB().getValue()] = this.DNAAlphabet.getB();
			this.rnaToDNATranslationTable[this.RNAAlphabet.getV().getValue()] = this.DNAAlphabet.getV();
			this.rnaToDNATranslationTable[this.RNAAlphabet.getD().getValue()] = this.DNAAlphabet.getD();
			this.rnaToDNATranslationTable[this.RNAAlphabet.getH().getValue()] = this.DNAAlphabet.getH();
			this.rnaToDNATranslationTable[this.RNAAlphabet.getN().getValue()] = this.DNAAlphabet.getN();
			this.rnaToDNATranslationTable["-"] = Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
										name: "Gap",
										value: "-"
								});

	}
});
