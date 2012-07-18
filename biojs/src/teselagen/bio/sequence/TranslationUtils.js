/**
 * @class Teselagen.bio.sequence.TranslationUtils
 * 
 * Translation Utilities to convert between RNA, DNA, and  Protein
 * @see Teselagen.bio.sequence.symbols.NucleotideSymbol
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
	ProteinAlphabet: Teselagen.bio.sequence.alphabets.ProteinAlphabet,
	DNAAlphabet: Teselagen.bio.sequence.alphabets.DNAAlphabet,
	RNAAlphabet: Teselagen.bio.sequence.alphabets.RNAAlphabet,
	singleton: true,

	dnaToRNATranslationTable: null,
	rnaToDNATranslationTable: null,
	aminoAcidsTranslationTable: null,

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
			throw Ext.create("Teselagen.bio.sequence.symbols.IllegalSymbolException", {
				message: "Illegal symbol"
			});
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
	 * @return {[type]} [description]
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
			throw Ext.create("Teselagen.bio.sequence.symbols.IllegalSymbolException", {
				message: "Illegal symbol"
			});
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
			return this.ProteinAlphabet.getGap();
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

		if (Ext.getClassName(pNucleotide1).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1 || Ext.getClassName(pNucleotide2).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1 || Ext.getClassName(pNucleotide3).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1) {
			return Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
										name: "Gap",
										value: "-"
								});
		};

		var triplet = pNucleotide1.getValue() + pNucleotide2.getValue() + pNucleotide3.getValue();

		var symbol = this.aminoAcidsTranslationTable[triplet];

		if(symbol == null) {
			return this.ProteinAlphabet.getGap();
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

		if (Ext.getClassName(pNucleotide1).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1 || Ext.getClassName(pNucleotide2).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1 || Ext.getClassName(pNucleotide3).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1) {
			return result;
		};

		var triplet = (pNucleotide1.getValue() + pNucleotide2.getValue() + pNucleotide3.getValue());

		return (triplet === 'atg' || triplet === 'aug');
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

		if (Ext.getClassName(pNucleotide1).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1 || Ext.getClassName(pNucleotide2).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1 || Ext.getClassName(pNucleotide3).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1) {
			return result;
		};

		var triplet = (pNucleotide1.getValue() + pNucleotide2.getValue() + pNucleotide3.getValue());

		return (triplet == 'taa'
			|| triplet == 'tag'
			|| triplet == 'tga'
			|| triplet == 'uaa'
			|| triplet == 'uag'
			|| triplet == 'uga');
	},

	initializeAminoAcidsTranslationTable: function(){
			if (this.aminoAcidsTranslationTable != null) {
				return;
			};
			this.aminoAcidsTranslationTable = [];

			this.aminoAcidsTranslationTable['gct'] = this.ProteinAlphabet.getAlanine();
			this.aminoAcidsTranslationTable['gcc'] = this.ProteinAlphabet.getAlanine();
			this.aminoAcidsTranslationTable['gca'] = this.ProteinAlphabet.getAlanine();
			this.aminoAcidsTranslationTable['gcg'] = this.ProteinAlphabet.getAlanine();
			this.aminoAcidsTranslationTable['gcu'] = this.ProteinAlphabet.getAlanine();
			this.aminoAcidsTranslationTable['cgt'] = this.ProteinAlphabet.getArginine();
			this.aminoAcidsTranslationTable['cgc'] = this.ProteinAlphabet.getArginine();
			this.aminoAcidsTranslationTable['cga'] = this.ProteinAlphabet.getArginine();
			this.aminoAcidsTranslationTable['cgg'] = this.ProteinAlphabet.getArginine();
			this.aminoAcidsTranslationTable['aga'] = this.ProteinAlphabet.getArginine();
			this.aminoAcidsTranslationTable['agg'] = this.ProteinAlphabet.getArginine();
			this.aminoAcidsTranslationTable['cgu'] = this.ProteinAlphabet.getArginine();
			this.aminoAcidsTranslationTable['aat'] = this.ProteinAlphabet.getAsparagine();
			this.aminoAcidsTranslationTable['aac'] = this.ProteinAlphabet.getAsparagine();
			this.aminoAcidsTranslationTable['aau'] = this.ProteinAlphabet.getAsparagine();
			this.aminoAcidsTranslationTable['gat'] = this.ProteinAlphabet.getAspartic();
			this.aminoAcidsTranslationTable['gac'] = this.ProteinAlphabet.getAspartic();
			this.aminoAcidsTranslationTable['gau'] = this.ProteinAlphabet.getAspartic();
			this.aminoAcidsTranslationTable['tgt'] = this.ProteinAlphabet.getCysteine();
			this.aminoAcidsTranslationTable['tgc'] = this.ProteinAlphabet.getCysteine();
			this.aminoAcidsTranslationTable['ugu'] = this.ProteinAlphabet.getCysteine();
			this.aminoAcidsTranslationTable['ugc'] = this.ProteinAlphabet.getCysteine();
			this.aminoAcidsTranslationTable['gaa'] = this.ProteinAlphabet.getGlutamic();
			this.aminoAcidsTranslationTable['gag'] = this.ProteinAlphabet.getGlutamic();
			this.aminoAcidsTranslationTable['caa'] = this.ProteinAlphabet.getGlutamine();
			this.aminoAcidsTranslationTable['cag'] = this.ProteinAlphabet.getGlutamine();
			this.aminoAcidsTranslationTable['ggt'] = this.ProteinAlphabet.getGlycine();
			this.aminoAcidsTranslationTable['ggc'] = this.ProteinAlphabet.getGlycine();
			this.aminoAcidsTranslationTable['gga'] = this.ProteinAlphabet.getGlycine();
			this.aminoAcidsTranslationTable['ggg'] = this.ProteinAlphabet.getGlycine();
			this.aminoAcidsTranslationTable['ggu'] = this.ProteinAlphabet.getGlycine();
			this.aminoAcidsTranslationTable['cat'] = this.ProteinAlphabet.getHistidine();
			this.aminoAcidsTranslationTable['cac'] = this.ProteinAlphabet.getHistidine();
			this.aminoAcidsTranslationTable['cau'] = this.ProteinAlphabet.getHistidine();
			this.aminoAcidsTranslationTable['att'] = this.ProteinAlphabet.getIsoleucine();
			this.aminoAcidsTranslationTable['atc'] = this.ProteinAlphabet.getIsoleucine();
			this.aminoAcidsTranslationTable['ata'] = this.ProteinAlphabet.getIsoleucine();
			this.aminoAcidsTranslationTable['auu'] = this.ProteinAlphabet.getIsoleucine();
			this.aminoAcidsTranslationTable['auc'] = this.ProteinAlphabet.getIsoleucine();
			this.aminoAcidsTranslationTable['aua'] = this.ProteinAlphabet.getIsoleucine();
			this.aminoAcidsTranslationTable['ctt'] = this.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['ctc'] = this.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['cta'] = this.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['ctg'] = this.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['tta'] = this.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['ttg'] = this.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['cuu'] = this.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['cuc'] = this.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['cua'] = this.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['cug'] = this.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['uua'] = this.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['uug'] = this.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['aaa'] = this.ProteinAlphabet.getLysine();
			this.aminoAcidsTranslationTable['aag'] = this.ProteinAlphabet.getLysine();
			this.aminoAcidsTranslationTable['atg'] = this.ProteinAlphabet.getMethionine();
			this.aminoAcidsTranslationTable['aug'] = this.ProteinAlphabet.getMethionine();
			this.aminoAcidsTranslationTable['ttt'] = this.ProteinAlphabet.getPhenylalanine();
			this.aminoAcidsTranslationTable['ttc'] = this.ProteinAlphabet.getPhenylalanine();
			this.aminoAcidsTranslationTable['uuu'] = this.ProteinAlphabet.getPhenylalanine();
			this.aminoAcidsTranslationTable['uuc'] = this.ProteinAlphabet.getPhenylalanine();
			this.aminoAcidsTranslationTable['cct'] = this.ProteinAlphabet.getProline();
			this.aminoAcidsTranslationTable['ccc'] = this.ProteinAlphabet.getProline();
			this.aminoAcidsTranslationTable['cca'] = this.ProteinAlphabet.getProline();
			this.aminoAcidsTranslationTable['ccg'] = this.ProteinAlphabet.getProline();
			this.aminoAcidsTranslationTable['ccu'] = this.ProteinAlphabet.getProline();
			this.aminoAcidsTranslationTable['tct'] = this.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['tcc'] = this.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['tca'] = this.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['tcg'] = this.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['agt'] = this.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['agc'] = this.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['ucu'] = this.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['ucc'] = this.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['uca'] = this.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['ucg'] = this.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['agu'] = this.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['act'] = this.ProteinAlphabet.getThreonine();
			this.aminoAcidsTranslationTable['acc'] = this.ProteinAlphabet.getThreonine();
			this.aminoAcidsTranslationTable['aca'] = this.ProteinAlphabet.getThreonine();
			this.aminoAcidsTranslationTable['acg'] = this.ProteinAlphabet.getThreonine();
			this.aminoAcidsTranslationTable['acu'] = this.ProteinAlphabet.getThreonine();
			this.aminoAcidsTranslationTable['tgg'] = this.ProteinAlphabet.getTryptophan();
			this.aminoAcidsTranslationTable['ugg'] = this.ProteinAlphabet.getTryptophan();
			this.aminoAcidsTranslationTable['tat'] = this.ProteinAlphabet.getTyrosine();
			this.aminoAcidsTranslationTable['tac'] = this.ProteinAlphabet.getTyrosine();
			this.aminoAcidsTranslationTable['uau'] = this.ProteinAlphabet.getTyrosine();
			this.aminoAcidsTranslationTable['uac'] = this.ProteinAlphabet.getTyrosine();
			this.aminoAcidsTranslationTable['gtt'] = this.ProteinAlphabet.getValine();
			this.aminoAcidsTranslationTable['gtc'] = this.ProteinAlphabet.getValine();
			this.aminoAcidsTranslationTable['gta'] = this.ProteinAlphabet.getValine();
			this.aminoAcidsTranslationTable['gtg'] = this.ProteinAlphabet.getValine();
			this.aminoAcidsTranslationTable['guu'] = this.ProteinAlphabet.getValine();
			this.aminoAcidsTranslationTable['guc'] = this.ProteinAlphabet.getValine();
			this.aminoAcidsTranslationTable['gua'] = this.ProteinAlphabet.getValine();
			this.aminoAcidsTranslationTable['gug'] = this.ProteinAlphabet.getValine();
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

	},
});
