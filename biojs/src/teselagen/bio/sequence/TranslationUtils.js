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
			return  Teselagen.bio.sequence.alphabets.RNAAlphabet.getGap();
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
			return  Teselagen.bio.sequence.alphabets.DNAAlphabet.superclass.getGap();
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
			return Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGap();
		};

		var triplet = pNucleotide1.getValue() + pNucleotide2.getValue() + pNucleotide3.getValue();

		var symbol = this.aminoAcidsTranslationTable[triplet];

		if (symbol == null) {
			return Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGap();
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
			return Teselagen.bio.sequence.alphabets.ProteinAlphabet.superclass.getGap();
		};

		var triplet = pNucleotide1.getValue() + pNucleotide2.getValue() + pNucleotide3.getValue();

		var symbol = this.aminoAcidsTranslationTable[triplet];

		if(symbol == null) {
			return Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGap();
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

			this.aminoAcidsTranslationTable['gct'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAlanine();
			this.aminoAcidsTranslationTable['gcc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAlanine();
			this.aminoAcidsTranslationTable['gca'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAlanine();
			this.aminoAcidsTranslationTable['gcg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAlanine();
			this.aminoAcidsTranslationTable['gcu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAlanine();
			this.aminoAcidsTranslationTable['cgt'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getArginine();
			this.aminoAcidsTranslationTable['cgc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getArginine();
			this.aminoAcidsTranslationTable['cga'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getArginine();
			this.aminoAcidsTranslationTable['cgg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getArginine();
			this.aminoAcidsTranslationTable['aga'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getArginine();
			this.aminoAcidsTranslationTable['agg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getArginine();
			this.aminoAcidsTranslationTable['cgu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getArginine();
			this.aminoAcidsTranslationTable['aat'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAsparagine();
			this.aminoAcidsTranslationTable['aac'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAsparagine();
			this.aminoAcidsTranslationTable['aau'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAsparagine();
			this.aminoAcidsTranslationTable['gat'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAspartic();
			this.aminoAcidsTranslationTable['gac'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAspartic();
			this.aminoAcidsTranslationTable['gau'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAspartic();
			this.aminoAcidsTranslationTable['tgt'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getCysteine();
			this.aminoAcidsTranslationTable['tgc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getCysteine();
			this.aminoAcidsTranslationTable['ugu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getCysteine();
			this.aminoAcidsTranslationTable['ugc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getCysteine();
			this.aminoAcidsTranslationTable['gaa'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlutamic();
			this.aminoAcidsTranslationTable['gag'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlutamic();
			this.aminoAcidsTranslationTable['caa'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlutamine();
			this.aminoAcidsTranslationTable['cag'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlutamine();
			this.aminoAcidsTranslationTable['ggt'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlycine();
			this.aminoAcidsTranslationTable['ggc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlycine();
			this.aminoAcidsTranslationTable['gga'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlycine();
			this.aminoAcidsTranslationTable['ggg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlycine();
			this.aminoAcidsTranslationTable['ggu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlycine();
			this.aminoAcidsTranslationTable['cat'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getHistidine();
			this.aminoAcidsTranslationTable['cac'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getHistidine();
			this.aminoAcidsTranslationTable['cau'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getHistidine();
			this.aminoAcidsTranslationTable['att'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getIsoleucine();
			this.aminoAcidsTranslationTable['atc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getIsoleucine();
			this.aminoAcidsTranslationTable['ata'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getIsoleucine();
			this.aminoAcidsTranslationTable['auu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getIsoleucine();
			this.aminoAcidsTranslationTable['auc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getIsoleucine();
			this.aminoAcidsTranslationTable['aua'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getIsoleucine();
			this.aminoAcidsTranslationTable['ctt'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['ctc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['cta'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['ctg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['tta'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['ttg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['cuu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['cuc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['cua'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['cug'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['uua'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['uug'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			this.aminoAcidsTranslationTable['aaa'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLysine();
			this.aminoAcidsTranslationTable['aag'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLysine();
			this.aminoAcidsTranslationTable['atg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getMethionine();
			this.aminoAcidsTranslationTable['aug'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getMethionine();
			this.aminoAcidsTranslationTable['ttt'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getPhenylalanine();
			this.aminoAcidsTranslationTable['ttc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getPhenylalanine();
			this.aminoAcidsTranslationTable['uuu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getPhenylalanine();
			this.aminoAcidsTranslationTable['uuc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getPhenylalanine();
			this.aminoAcidsTranslationTable['cct'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getProline();
			this.aminoAcidsTranslationTable['ccc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getProline();
			this.aminoAcidsTranslationTable['cca'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getProline();
			this.aminoAcidsTranslationTable['ccg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getProline();
			this.aminoAcidsTranslationTable['ccu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getProline();
			this.aminoAcidsTranslationTable['tct'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['tcc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['tca'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['tcg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['agt'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['agc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['ucu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['ucc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['uca'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['ucg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['agu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			this.aminoAcidsTranslationTable['act'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getThreonine();
			this.aminoAcidsTranslationTable['acc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getThreonine();
			this.aminoAcidsTranslationTable['aca'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getThreonine();
			this.aminoAcidsTranslationTable['acg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getThreonine();
			this.aminoAcidsTranslationTable['acu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getThreonine();
			this.aminoAcidsTranslationTable['tgg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getTryptophan();
			this.aminoAcidsTranslationTable['ugg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getTryptophan();
			this.aminoAcidsTranslationTable['tat'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getTyrosine();
			this.aminoAcidsTranslationTable['tac'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getTyrosine();
			this.aminoAcidsTranslationTable['uau'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getTyrosine();
			this.aminoAcidsTranslationTable['uac'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getTyrosine();
			this.aminoAcidsTranslationTable['gtt'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getValine();
			this.aminoAcidsTranslationTable['gtc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getValine();
			this.aminoAcidsTranslationTable['gta'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getValine();
			this.aminoAcidsTranslationTable['gtg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getValine();
			this.aminoAcidsTranslationTable['guu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getValine();
			this.aminoAcidsTranslationTable['guc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getValine();
			this.aminoAcidsTranslationTable['gua'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getValine();
			this.aminoAcidsTranslationTable['gug'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getValine();
	},

	initializeDNAToRNATranslationTable: function(){
			if (this.dnaToRNATranslationTable != null) {
				return;
			};
            this.dnaToRNATranslationTable= [];
			this.dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getA().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getA();
			this.dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getT().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getU();
			this.dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getG().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getG();
			this.dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getC().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getC();
			this.dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getY().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getY();
			this.dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getR().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getR();
			this.dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getS().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getS();
			this.dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getW().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getW();
			this.dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getK().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getK();
			this.dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getM().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getM();
			this.dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getB().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getB();
			this.dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getV().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getV();
			this.dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getD().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getD();
			this.dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getH().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getH();
			this.dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getN().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getN();
			//this.dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getGap().getValue()] = Teselagen.bio.sequence.alphabets.RNAAlphabet.getGap();
	},

	initializeRNAToDNATranslationTable: function() {
			if (this.rnaToDNATranslationTable != null) {
				return;
			}

			this.rnaToDNATranslationTable = [];


			this.rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getA().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getA();
			this.rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getU().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getT();
			this.rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getG().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getG();
			this.rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getC().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getC();
			this.rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getY().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getY();
			this.rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getR().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getR();
			this.rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getS().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getS();
			this.rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getW().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getW();
			this.rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getK().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getK();
			this.rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getM().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getM();
			this.rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getB().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getB();
			this.rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getV().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getV();
			this.rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getD().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getD();
			this.rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getH().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getH();
			this.rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getN().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getN();
			//this.rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getGap().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getGap();

	},
});
