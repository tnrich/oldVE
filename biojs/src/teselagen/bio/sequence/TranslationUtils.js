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

	constructor: function(inData){
		var dnaToRNATranslationTable = null;
		var rnaToDNATranslationTable = null;
		var aminoAcidsTranslationTable = null;

		/**
		 * Converts a DNA symbol to an RNA symbol
		 * @param  {NucleotideSymbol} pSymbol an input NucleotideSymbol
		 * @return {NucleotideSymbol}         Returns the corresponding RNA symbol
		 */
		this.dnaToRNASymbol = function(pSymbol){
			initializeDNAToRNATranslationTable();

			//Typechecks for GapSymbol
			if (Ext.getClassName(pSymbol).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1) {
				return  Teselagen.bio.sequence.alphabets.RNAAlphabet.superclass.getGap();
			};

			var newSymbol = dnaToRNATranslationTable[pSymbol.getValue()] || null;

			if (newSymbol == null) {
				throw Ext.create("Teselagen.bio.sequence.symbols.IllegalSymbolException", {
					message: "Illegal symbol"
				});
			};

			return newSymbol;
		}

		/**
		 * Converts an RNA symbol to a DNA symbol
		 * @return {[type]} [description]
		 */
		this.rnaToDNASymbol = function(){
			initializeRNAToDNATranslationTable();

			//Typechecks if this is a Gap Symbol
			if (Ext.getClassName(pSymbol).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1) {
				return  Teselagen.bio.sequence.alphabets.DNAAlphabet.superclass.getGap();
			};

			var newSymbol = dnaToRNATranslationTable[pSymbol.getValue()] || null;

			if (newSymbol == null) {
				throw Ext.create("Teselagen.bio.sequence.symbols.IllegalSymbolException", {
					message: "Illegal symbol"
				});
			};

			return newSymbol;
		}

		/**
		 * Converts a list of DNA symbols to RNA
		 * @param  {SymbolList} pSymbolList A list of input symbols
		 * @return {SymbolList}             A list of RNA symbols
		 */
		this.dnaToRNA = function(pSymbolList){
			var symbols = pSymbolList.getSymbols();
			var rnaSymbols = [];

			//If there are symbols, dive into this loop.
			if (symbols.length > 0) {
				for (var i = 0; i < symbols.length; i++) {
					rnaSymbols[i] = dnaToRNASymbol(symbols[i]);
				};
			};

			return Ext.create("Teselagen.bio.sequence.common.SymbolList", {
				symbols: rnaSymbols,
				alphabet:  "Teselagen.bio.sequence.alphabets.RNAAlphabet"
			});
		}

		/**
		 * Translates RNA to DNA
		 * @param  {SymbolList} pSymbolList an input symbol list containing RNA NucleotideSymbols
		 * @return {SymbolList}             an output symbol list containing DNA NucleotideSymbols
		 */
		this.rnaToDNA = function(pSymbolList){
			var symbols = pSymbolList.getSymbols();
			var rnaSymbols = [];

			if (symbols.length > 0) {
				for (var i = 0; i < symbols.length; i++) {
					dnaSymbols[i] = rnaToDNASymbol(symbols[i]);
				};
			};

			return Ext.create("Teselagen.bio.sequence.common.SymbolList", {
				symbols: dnaSymbols,
				alphabet:  "Teselagen.bio.sequence.alphabets.DNAAlphabet"
			});
		}

		/**
		 * Converts RNA to Protein Symbol
		 * @param  {NucleotideSymbol} pNucleotide1 a NucleotideSymbol
		 * @param  {NucleotideSymbol} pNucleotide2 a NucleotideSymbol
		 * @param  {NucleotideSymbol} pNucleotide3 a NucleotideSymbol
		 * @return {AminoAcidSymbol}              An amino acid that corresponds to the RNA codon
		 */
		this.rnaToProteinSymbol = function(pNucleotide1, pNucleotide2, pNucleotide3){
			initializeAminoAcidsTranslationTable();

			if (Ext.getClassName(pNucleotide1).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1 || Ext.getClassName(pNucleotide2).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1 || Ext.getClassName(pNucleotide3).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1) {
				return Teselagen.bio.sequence.alphabets.ProteinAlphabet.superclass.getGap();
			};

			var triplet = pNucleotide1.getValue() + pNucleotide2.getValue() + pNucleotide3.getGap();

			var symbol = aminoAcidsTranslationTable[triplet];

			if (symbol == null) {
				return Teselagen.bio.sequence.alphabets.ProteinAlphabet.superclass.getGap();
			};

			return symbol;
		}


		/**
		 * Converts DNA to Protein Symbol
		 * @param  {NucleotideSymbol} pNucleotide1 a NucleotideSymbol
		 * @param  {NucleotideSymbol} pNucleotide2 a NucleotideSymbol
		 * @param  {NucleotideSymbol} pNucleotide3 a NucleotideSymbol
		 * @return {AminoAcidSymbol}              An amino acid that corresponds to the DNA codon
		 */
		this.dnaToProteinSymbol = function(pNucleotide1, pNucleotide2, pNucleotide3) {
			initializeAminoAcidsTranslationTable();

			if (Ext.getClassName(pNucleotide1).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1 || Ext.getClassName(pNucleotide2).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1 || Ext.getClassName(pNucleotide3).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1) {
				return Teselagen.bio.sequence.alphabets.ProteinAlphabet.superclass.getGap();
			};

			var triplet = pNucleotide1.getValue() + pNucleotide2.getValue() + pNucleotide3.getValue();

			var symbol = aminoAcidsTranslationTable[triplet];

			if(symbol == null) {
				return Teselagen.bio.sequence.alphabets.ProteinAlphabet.superclass.getGap();
			}

			return symbol;
		}

		/**
		 * Translates RNA Sequence to Protein Sequence
		 * @param  {SymbolList} pSymbolList an input symbol list containing RNA NucleotideSymbols
		 * @return {SymbolList}             an output symbol list containing AminoAcidSymbols
		 */
		this.rnaToProtein = function(pSymbolList){
			var length = pSymbolList.length - (pSymbolList.length % 3);

			if (length == 0) {
				return [];
			}

			var proteinSymbols = [];
			var symbols = pSymbolList.getSymbols();

			for (var i = 0; i < length; i++) {
				var codon = i / 3;
				proteinSymbols[codon] = rnaToProteinSymbol(pSymbolList[i], pSymbolList[i+1], pSymbolList[i+2]);
			};


			return Ext.create("Teselagen.bio.sequence.common.SymbolList", {
				symbols: proteinSymbols,
				alphabet:  "Teselagen.bio.sequence.alphabets.ProteinAlphabet"
			});

		}

		/**
		 * Calculates whether three nucleotides make up a start codon
		 * @param  {NucleotideSymbol} pNucleotide1 a NucleotideSymbol
		 * @param  {NucleotideSymbol} pNucleotide2 a NucleotideSymbol
		 * @param  {NucleotideSymbol} pNucleotide3 a NucleotideSymbol
		 * @return {Boolean}             shows whether the nucleotides make up a start codon
		 */
		this.isStartCodon = function (pNucleotide1, pNucleotide2, pNucleotide3) {
			var result = false;

			if (Ext.getClassName(pNucleotide1).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1 || Ext.getClassName(pNucleotide2).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1 || Ext.getClassName(pNucleotide3).indexOf("Teselagen.bio.sequence.symbols.GapSymbol") !== -1) {
				return result;
			};

			var triplet = (pNucleotide1.getValue() + pNucleotide2.getValue() + pNucleotide3.getValue());

			return (triplet === 'atg' || triplet === 'aug');
		}
		
		/**
		 * Calculates whether three nucleotides make up a stop codon
		 * @param  {NucleotideSymbol} pNucleotide1 a NucleotideSymbol
		 * @param  {NucleotideSymbol} pNucleotide2 a NucleotideSymbol
		 * @param  {NucleotideSymbol} pNucleotide3 a NucleotideSymbol
		 * @return {Boolean}             shows whether the nucleotides make up a stop codon
		 */
		this.isStopCodon = function(pNucleotide1, pNucleotide2, pNucleotide3){
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
		}

		function initializeAminoAcidsTranslationTable(){
			if (aminoAcidsTranslationTable != null) {
				return;
			};
			aminoAcidsTranslationTable = [];

			aminoAcidsTranslationTable['gct'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAlanine();
			aminoAcidsTranslationTable['gcc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAlanine();
			aminoAcidsTranslationTable['gca'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAlanine();
			aminoAcidsTranslationTable['gcg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAlanine();
			aminoAcidsTranslationTable['gcu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAlanine();
			aminoAcidsTranslationTable['cgt'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getArginine();
			aminoAcidsTranslationTable['cgc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getArginine();
			aminoAcidsTranslationTable['cga'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getArginine();
			aminoAcidsTranslationTable['cgg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getArginine();
			aminoAcidsTranslationTable['aga'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getArginine();
			aminoAcidsTranslationTable['agg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getArginine();
			aminoAcidsTranslationTable['cgu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getArginine();
			aminoAcidsTranslationTable['aat'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAsparagine();
			aminoAcidsTranslationTable['aac'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAsparagine();
			aminoAcidsTranslationTable['aau'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAsparagine();
			aminoAcidsTranslationTable['gat'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAspartic();
			aminoAcidsTranslationTable['gac'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAspartic();
			aminoAcidsTranslationTable['gau'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getAspartic();
			aminoAcidsTranslationTable['tgt'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getCysteine();
			aminoAcidsTranslationTable['tgc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getCysteine();
			aminoAcidsTranslationTable['ugu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getCysteine();
			aminoAcidsTranslationTable['ugc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getCysteine();
			aminoAcidsTranslationTable['gaa'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlutamic();
			aminoAcidsTranslationTable['gag'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlutamic();
			aminoAcidsTranslationTable['caa'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlutamine();
			aminoAcidsTranslationTable['cag'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlutamine();
			aminoAcidsTranslationTable['ggt'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlycine();
			aminoAcidsTranslationTable['ggc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlycine();
			aminoAcidsTranslationTable['gga'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlycine();
			aminoAcidsTranslationTable['ggg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlycine();
			aminoAcidsTranslationTable['ggu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getGlycine();
			aminoAcidsTranslationTable['cat'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getHistidine();
			aminoAcidsTranslationTable['cac'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getHistidine();
			aminoAcidsTranslationTable['cau'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getHistidine();
			aminoAcidsTranslationTable['att'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getIsoleucine();
			aminoAcidsTranslationTable['atc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getIsoleucine();
			aminoAcidsTranslationTable['ata'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getIsoleucine();
			aminoAcidsTranslationTable['auu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getIsoleucine();
			aminoAcidsTranslationTable['auc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getIsoleucine();
			aminoAcidsTranslationTable['aua'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getIsoleucine();
			aminoAcidsTranslationTable['ctt'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			aminoAcidsTranslationTable['ctc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			aminoAcidsTranslationTable['cta'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			aminoAcidsTranslationTable['ctg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			aminoAcidsTranslationTable['tta'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			aminoAcidsTranslationTable['ttg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			aminoAcidsTranslationTable['cuu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			aminoAcidsTranslationTable['cuc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			aminoAcidsTranslationTable['cua'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			aminoAcidsTranslationTable['cug'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			aminoAcidsTranslationTable['uua'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			aminoAcidsTranslationTable['uug'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLeucine();
			aminoAcidsTranslationTable['aaa'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLysine();
			aminoAcidsTranslationTable['aag'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getLysine();
			aminoAcidsTranslationTable['atg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getMethionine();
			aminoAcidsTranslationTable['aug'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getMethionine();
			aminoAcidsTranslationTable['ttt'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getPhenylalanine();
			aminoAcidsTranslationTable['ttc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getPhenylalanine();
			aminoAcidsTranslationTable['uuu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getPhenylalanine();
			aminoAcidsTranslationTable['uuc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getPhenylalanine();
			aminoAcidsTranslationTable['cct'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getProline();
			aminoAcidsTranslationTable['ccc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getProline();
			aminoAcidsTranslationTable['cca'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getProline();
			aminoAcidsTranslationTable['ccg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getProline();
			aminoAcidsTranslationTable['ccu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getProline();
			aminoAcidsTranslationTable['tct'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			aminoAcidsTranslationTable['tcc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			aminoAcidsTranslationTable['tca'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			aminoAcidsTranslationTable['tcg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			aminoAcidsTranslationTable['agt'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			aminoAcidsTranslationTable['agc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			aminoAcidsTranslationTable['ucu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			aminoAcidsTranslationTable['ucc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			aminoAcidsTranslationTable['uca'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			aminoAcidsTranslationTable['ucg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			aminoAcidsTranslationTable['agu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getSerine();
			aminoAcidsTranslationTable['act'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getThreonine();
			aminoAcidsTranslationTable['acc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getThreonine();
			aminoAcidsTranslationTable['aca'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getThreonine();
			aminoAcidsTranslationTable['acg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getThreonine();
			aminoAcidsTranslationTable['acu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getThreonine();
			aminoAcidsTranslationTable['tgg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getTryptophan();
			aminoAcidsTranslationTable['ugg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getTryptophan();
			aminoAcidsTranslationTable['tat'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getTyrosine();
			aminoAcidsTranslationTable['tac'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getTyrosine();
			aminoAcidsTranslationTable['uau'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getTyrosine();
			aminoAcidsTranslationTable['uac'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getTyrosine();
			aminoAcidsTranslationTable['gtt'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getValine();
			aminoAcidsTranslationTable['gtc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getValine();
			aminoAcidsTranslationTable['gta'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getValine();
			aminoAcidsTranslationTable['gtg'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getValine();
			aminoAcidsTranslationTable['guu'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getValine();
			aminoAcidsTranslationTable['guc'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getValine();
			aminoAcidsTranslationTable['gua'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getValine();
			aminoAcidsTranslationTable['gug'] = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getValine();
		}

		function initializeDNAtoRNATranslationTable(){
			if (dnaToRNATranslationTable != null) {
				return;
			};

			dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getA().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getA();
			dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getT().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getU();
			dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getG().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getG();
			dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getC().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getC();
			dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getY().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getY();
			dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getR().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getR();
			dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getS().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getS();
			dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getW().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getW();
			dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getK().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getK();
			dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getM().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getM();
			dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getB]().getValue()   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getB();
			dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getV().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getV();
			dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getD().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getD();
			dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getH().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getH();
			dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getN().getValue()]   = Teselagen.bio.sequence.alphabets.RNAAlphabet.getN();
			dnaToRNATranslationTable[Teselagen.bio.sequence.alphabets.DNAAlphabet.getGap().getValue()] = Teselagen.bio.sequence.alphabets.RNAAlphabet.getGap();
		}

		function initializeRNAToDNATranslationTable () {
			if (rnaToDNATranslationTable != null) {
				return;
			}

			rnaToDNATranslationTable = [];


			rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getA().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getA();
			rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getU().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getT();
			rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getG().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getG();
			rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getC().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getC();
			rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getY().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getY();
			rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getR().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getR();
			rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getS().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getS();
			rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getW().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getW();
			rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getK().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getK();
			rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getM().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getM();
			rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getB().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getB();
			rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getV().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getV();
			rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getD().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getD();
			rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getH().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getH();
			rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getN().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getN();
			rnaToDNATranslationTable[Teselagen.bio.sequence.alphabets.RNAAlphabet.getGap().getValue()] = Teselagen.bio.sequence.alphabets.DNAAlphabet.getGap();

		}


		

	}
});