
    /**
    * Data class
    * @description This static class contains strings used for unit testing.
    * @author Diana Wong
    */

Ext.define('Data', {
	
	constructor: function () {
		
		var line;
		
		this.getLocusStr = function () {
			line = 'LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012';
			return line;
		}
		
		/*this.getLocusStr = function () {
			line = 
			return line;
		}
		
		this.getLocusStr = function () {
			line = 
			return line;
		}
		
		this.getLocusStr = function () {
			line = 
			return line;
		}*/
		
		this.getTopStr = function () {
			line = '' + 
'LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\n' +
'ACCESSION   pj5_00028 Accession\n' +
'VERSION     pj5_00028 version.1\n' +
'DEFINITION  pj5_00028 Definition\n'+
'KEYWORDS    .\n' +
'SOURCE      Saccharomyces cerevisiae (baker\'s yeast)\n' +
'  ORGANISM  Saccharomyces cerevisiae\n' +
'            Eukaryota; Fungi; Ascomycota; Saccharomycotina; Saccharomycetes;\n' +
'            Saccharomycetales; Saccharomycetaceae; Saccharomyces.\n' +
'REFERENCE   1  (bases 1 to 5028)\n' +
'  AUTHORS   Torpey,L.E., Gibbs,P.E., Nelson,J. and Lawrence,C.W.\n' +
'  TITLE     Cloning and sequence of REV7, a gene whose function is required for\n' +
'            DNA damage-induced mutagenesis in Saccharomyces cerevisiae\n' +
'  JOURNAL   Yeast 10 (11), 1503-1509 (1994)\n' +
'  PUBMED    7871890\n' +
'FEATURES             Location/Qualifiers\n' +
'     CDS             complement(7..885)\n' +
'                     /label="araC"\n' +
'     promoter        complement(1036..1064)\n' +
'                     /label="araC promoter"\n' +
'     CDS             >1236..<2090\n' +
'                     /vntifkey="4"\n' +
'                     /vntifkey2=4\n' +
'     fakemRNA        join(<265..402,673..781,911..1007,1088..1215,\n' +
'                     1377..1573,1866..2146,2306..2634,2683..>2855)\n' +
'     fakeCDS         complement(3300..4037)\n' +
'                     /translation="MNRWVEKWLRVYLKCYINLILFYRNVYPPQSFDYTTYQSFNLPQ\n' +
'                     FVPINRHPALIDYIEELILDVLSKLTHVYRFSICIINKKNDLCIEKYVLDFSELQHVD\n' +
'                     LISGDDKILNGVYSQYEEGESIFGSLF"\n' +
'ORIGIN      \n' +
'        1 gacgtcttat gacaacttga cggctacatc attcactttt tcttcacaac cggcacggaa\n' +
'       61 ctcgctcggg ctggccccgg tgcatttttt aaatacccgc gagaaataga gttgatcgtc\n' +
'\n'+
'\n'+
'//'

			return line;
		}
		
		this.getPj5File = function() {
			var fileStr = Ext.Ajax.request({
		        url:'../data/sigpep.gb',
		        success: function(response) {
		          var text = response.responseText;
		          console.log(text);
		        }
		    });
			return fileStr;
		}
		
		
		/*
		this.getPj5Str = function () {
			line = 'LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012
ACCESSION   pj5_00028 Accession
VERSION     pj5_00028 version.1
DEFINITION  pj5_00028 Definition
KEYWORDS    .
FEATURES             Location/Qualifiers
     CDS             complement(7..885)
                     /label="araC"
     protein_bind    914..931
                     /label="operator O2"
     promoter        complement(1036..1064)
                     /label="araC promoter"
     protein_bind    1072..1093
                     /label="operator O1"
     misc_binding    1115..1128
                     /label="CAP site"
     protein_bind    1124..1162
                     /label="Operator I2 and I1"
     promoter        1161..1188
                     /label="pBAD promoter"
     RBS             1216..1235
                     /label="RBS"
     CDS             1236..2090
                     /label="GFPuv"
                     /vntifkey="4"
     misc_feature    1239..1289
                     /label="Clostridium_BMC_sig_pep"
     misc_feature    1290..1337
                     /label="gly_ser_linker"
     misc_feature    1757
                     /label="XhoI_silent_mutation"
     misc_feature    1856
                     /label="BamHI_silent_mutation"
     misc_feature    2049..2069
                     /label="ssrA tag enhanced"
                     /vntifkey="21"
     misc_feature    2070..2087
                     /label="ssrA tag"
                     /vntifkey="21"
     terminator      2106..2234
                     /label="dbl term"
     rep_origin      complement(2236..4464)
                     /label="pSC101**"
     terminator      4465..4570
                     /label="T0"
     misc_marker     complement(4586..5245)
                     /label="CmR"
ORIGIN      
        1 gacgtcttat gacaacttga cggctacatc attcactttt tcttcacaac cggcacggaa
       61 ctcgctcggg ctggccccgg tgcatttttt aaatacccgc gagaaataga gttgatcgtc
      121 aaaaccaaca ttgcgaccga cggtggcgat aggcatccgg gtggtgctca aaagcagctt
      181 cgcctggctg atacgttggt cctcgcgcca gcttaagacg ctaatcccta actgctggcg
      241 gaaaagatgt gacagacgcg acggcgacaa gcaaacatgc tgtgcgacgc tggcgatatc
      301 aaaattgctg tctgccaggt gatcgctgat gtactgacaa gcctcgcgta cccgattatc
      361 catcggtgga tggagcgact cgttaatcgc ttccatgcgc cgcagtaaca attgctcaag
      421 cagatttatc gccagcagct ccgaatagcg cccttcccct tgcccggcgt taatgatttg
      481 cccaaacagg tcgctgaaat gcggctggtg cgcttcatcc gggcgaaaga accccgtatt
      541 ggcaaatatt gacggccagt taagccattc atgccagtag gcgcgcggac gaaagtaaac
      601 ccactggtga taccattcgc gagcctccgg atgacgaccg tagtgatgaa tctctcctgg
      661 cgggaacagc aaaatatcac ccggtcggca aacaaattct cgtccctgat ttttcaccac
      721 cccctgaccg cgaatggtga gattgagaat ataacctttc attcccagcg gtcggtcgat
      781 aaaaaaatcg agataaccgt tggcctcaat cggcgttaaa cccgccacca gatgggcatt
      841 aaacgagtat cccggcagca ggggatcatt ttgcgcttca gccatacttt tcatactccc
      901 gccattcaga gaagaaacca attgtccata ttgcatcaga cattgccgtc actgcgtctt
      961 ttactggctc ttctcgctaa ccaaaccggt aaccccgctt attaaaagca ttctgtaaca
     1021 aagcgggacc aaagccatga caaaaacgcg taacaaaagt gtctataatc acggcagaaa
     1081 agtccacatt gattatttgc acggcgtcac actttgctat gccatagcat ttttatccat
     1141 aagattagcg gattctacct gacgcttttt atcgcaactc tctactgttt ctccataccc
     1201 gtttttttgg gaatttttaa gaaggagata tacatatgga aaataacgct ttattagaac
     1261 aaataatcaa tgaagtttta aaaaatatgg gtggcagtgg tagcgggagc tcgggtggct
     1321 caggctctgg ttccagtaaa ggagaagaac ttttcactgg agttgtccca attcttgttg
     1381 aattagatgg tgatgttaat gggcacaaat tttctgtcag tggagagggt gaaggtgatg
     1441 caacatacgg aaaacttacc cttaaattta tttgcactac tggaaaacta cctgttccat
     1501 ggccaacact tgtcactact ttctcttatg gtgttcaatg cttttcccgt tatccggatc
     1561 atatgaaacg gcatgacttt ttcaagagtg ccatgcccga aggttatgta caggaacgca
     1621 ctatatcttt caaagatgac gggaactaca agacgcgtgc tgaagtcaag tttgaaggtg
     1681 atacccttgt taatcgtatc gagttaaaag gtattgattt taaagaagat ggaaacattc
     1741 tcggacacaa actcgaatac aactataact cacacaatgt atacatcacg gcagacaaac
     1801 aaaagaatgg aatcaaagct aacttcaaaa ttcgccacaa cattgaagat ggatctgttc
     1861 aactagcaga ccattatcaa caaaatactc caattggcga tggccctgtc cttttaccag
     1921 acaaccatta cctgtcgaca caatctgccc tttcgaaaga tcccaacgaa aagcgtgacc
     1981 acatggtcct tcttgagttt gtaactgctg ctgggattac acatggcatg gatgagctcg
     2041 gcggcggcgc ggcgaacgat gaaaactata actatgcgct ggcggcgtaa atcgagtaag
     2101 gatctccagg catcaaataa aacgaaaggc tcagtcgaaa gactgggcct ttcgttttat
     2161 ctgttgtttg tcggtgaacg ctctctacta gagtcacact ggctcacctt cgggtgggcc
     2221 tttctgcgtt tatacctagg gtacgggttt tgctgcccgc aaacgggctg ttctggtgtt
     2281 gctagtttgt tatcagaatc gcagatccgg cttcagccgg tttgccggct gaaagcgcta
     2341 tttcttccag aattgccatg attttttccc cacgggaggc gtcactggct cccgtgttgt
     2401 cggcagcttt gattcgataa gcagcatcgc ctgtttcagg ctgtctatgt gtgactgttg
     2461 agctgtaaca agttgtctca ggtgttcaat ttcatgttct agttgctttg ttttactggt
     2521 ttcacctgtt ctattaggtg ttacatgctg ttcatctgtt acattgtcga tctgttcatg
     2581 gtgaacagct ttgaatgcac caaaaactcg taaaagctct gatgtatcta tcttttttac
     2641 accgttttca tctgtgcata tggacagttt tccctttgat atgtaacggt gaacagttgt
     2701 tctacttttg tttgttagtc ttgatgcttc actgatagat acaagagcca taagaacctc
     2761 agatccttcc gtatttagcc agtatgttct ctagtgtggt tcgttgtttt tgcgtgagcc
     2821 atgagaacga accattgaga tcatacttac tttgcatgtc actcaaaaat tttgcctcaa
     2881 aactggtgag ctgaattttt gcagttaaag catcgtgtag tgtttttctt agtccgttat
     2941 gtaggtagga atctgatgta atggttgttg gtattttgtc accattcatt tttatctggt
     3001 tgttctcaag ttcggttacg agatccattt gtctatctag ttcaacttgg aaaatcaacg
     3061 tatcagtcgg gcggcctcgc ttatcaacca ccaatttcat attgctgtaa gtgtttaaat
     3121 ctttacttat tggtttcaaa acccattggt taagcctttt aaactcatgg tagttatttt
     3181 caagcattaa catgaactta aattcatcaa ggctaatctc tatatttgcc ttgtgagttt
     3241 tcttttgtgt tagttctttt aataaccact cataaatcct catagagtat ttgttttcaa
     3301 aagacttaac atgttccaga ttatatttta tgaatttttt taactggaaa agataaggca
     3361 atatctcttc actaaaaact aattctaatt tttcgcttga gaacttggca tagtttgtcc
     3421 actggaaaat ctcaaagcct ttaaccaaag gattcctgat ttccacagtt ctcgtcatca
     3481 gctctctggt tgctttagct aatacaccat aagcattttc cctactgatg ttcatcatct
     3541 gagcgtattg gttataagtg aacgataccg tccgttcttt ccttgtaggg ttttcaatcg
     3601 tggggttgag tagtgccaca cagcataaaa ttagcttggt ttcatgctcc gttaagtcat
     3661 agcgactaat cgctagttca tttgctttga aaacaactaa ttcagacata catctcaatt
     3721 ggtctaggtg attttaatca ctataccaat tgagatgggc tagtcaatga taattactag
     3781 tccttttccc gggtgatctg ggtatctgta aattctgcta gacctttgct ggaaaacttg
     3841 taaattctgc tagaccctct gtaaattccg ctagaccttt gtgtgttttt tttgtttata
     3901 ttcaagtggt tataatttat agaataaaga aagaataaaa aaagataaaa agaatagatc
     3961 ccagccctgt gtataactca ctactttagt cagttccgca gtattacaaa aggatgtcgc
     4021 aaacgctgtt tgctcctcta caaaacagac cttaaaaccc taaaggctta agtagcaccc
     4081 tcgcaagctc gggcaaatcg ctgaatattc cttttgtctc cgaccatcag gcacctgagt
     4141 cgctgtcttt ttcgtgacat tcagttcgct gcgctcacgg ctctggcagt gaatgggggt
     4201 aaatggcact acaggcgcct tttatggatt catgcaagga aactacccat aatacaagaa
     4261 aagcccgtca cgggcttctc agggcgtttt atggcgggtc tgctatgtgg tgctatctga
     4321 ctttttgctg ttcagcagtt cctgccctct gattttccag tctgaccact tcggattatc
     4381 ccgtgacagg tcattcagac tggctaatgc acccagtaag gcagcggtat catcaacagg
     4441 cttacccgtc ttactgtccc tagtgcttgg attctcacca ataaaaaacg cccggcggca
     4501 accgagcgtt ctgaacaaat ccagatggag ttctgaggtc attactggat ctatcaacag
     4561 gagtccaagc gagctcgata tcaaattacg ccccgccctg ccactcatcg cagtactgtt
     4621 gtaattcatt aagcattctg ccgacatgga agccatcaca aacggcatga tgaacctgaa
     4681 tcgccagcgg catcagcacc ttgtcgcctt gcgtataata tttgcccatg gtgaaaacgg
     4741 gggcgaagaa gttgtccata ttggccacgt ttaaatcaaa actggtgaaa ctcacccagg
     4801 gattggctga gacgaaaaac atattctcaa taaacccttt agggaaatag gccaggtttt
     4861 caccgtaaca cgccacatct tgcgaatata tgtgtagaaa ctgccggaaa tcgtcgtggt
     4921 attcactcca gagcgatgaa aacgtttcag tttgctcatg gaaaacggtg taacaagggt
     4981 gaacactatc ccatatcacc agctcaccgt ctttcattgc catacgaaat tccggatgag
     5041 cattcatcag gcgggcaaga atgtgaataa aggccggata aaacttgtgc ttatttttct
     5101 ttacggtctt taaaaaggcc gtaatatcca gctgaacggt ctggttatag gtacattgag
     5161 caactgactg aaatgcctca aaatgttctt tacgatgcca ttgggatata tcaacggtgg
     5221 tatatccagt gatttttttc tccattttag cttccttagc tcctgaaaat ctcgataact
     5281 caaaaaatac gcccggtagt gatcttattt cattatggtg aaagttggaa cctcttacgt
     5341 gccgatcaac gtctcatttt cgccagatat c  
//'
			return line;
		}
		
		*/
		
		return this;
	}
	
});