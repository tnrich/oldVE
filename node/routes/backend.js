
/**
 * /config.js  
 * -------------
 */

module.exports = function(app){

var examples;

app.get('/DE', function(req, res){
  res.render('index', { title: 'Teselagen - Device Editor' });
});

app.get('/', function(req, res){
  var str = app.fs.readFileSync(__dirname + "/../api.md", "utf8");
  var result = app.markdown.makeHtml(str);
  res.render('teselagenAPI',{md:result});
})

app.use(function(req, res, next){
  var err = req.session.error
    , msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

function authenticate(name, pass, fn) {
  var User = app.db.model("Users");
  User.findOne({'name':name}, function(err,user){
    if(err) return fn(new Error('cannot find user'));
    return fn(null, user);
  });
};

function restrict(req, res, next) {
  if (req.session.user) {
    var User = app.db.model("Users");
    User.findOne({'name':req.session.user.name}, function(err,user){
      req.user = user;
      next();
    });
  } else {
    if(!app.testing.enabled)
    {
      console.log("Checking: "+sessionId);
      if(req.body.sessionId == undefined) return res.json({'fault':'wrong credentials'});
      // Check sessionId and find or create an account
      var sessionId = req.body.sessionId;
      // Check session id
      
      var query = 'select * from j5sessions where session_id="'+sessionId+'";';
      
      app.mysql.query(query, function(err, rows, fields) {
        if (err) throw err;
        console.log(rows);
        res.json(rows);
      });


    }
    else
    {
      console.log("Logged as Guest user");
      authenticate("Guest","",function(err, user){
      req.session.regenerate(function(){
        req.session.user = user;
        req.user = user;
        next();
        //res.send('Authenticated!');
        
      });
    
    })
    }
  }
};

app.all('/login', function(req, res){
  authenticate(req.query.name, '', function(err, user){
    if (user) {
      req.session.regenerate(function(){
        req.session.user = user;
        res.send('Authenticated!');
      });
    } else {
      req.session.error = 'Authentication failed';
      res.send(req.session.error);
    }
  });
});

app.all('/addUser',function(req,res){
  var User = app.db.model("Users");
    var newuser = new User({name:req.query.name});
    User.create(newuser, function (err, user) {
     if(err) res.send('error');
     res.send('New user created!');
  });
});

app.all('/getUser',restrict,function(req,res){
  console.log(req.user);
  res.send('ok');
});

app.all('/addModel',restrict,function(req,res){
  var payload = { "de:design" : { "de:j5Collection" : { "de:isCircular" : true, "de:j5Bins" : { "de:j5Bin" : [{ "de:binName" : "vector_backbone", "de:iconID" : "origin_of_replication", "de:direction" : "forward", "de:dsf" : false, "de:fro" : 2, "de:binItems" : { "de:partID" : [1318886361742634 ] } }, { "de:binName" : "nterm_sig_pep", "de:iconID" : "cds", "de:direction" : "forward", "de:dsf" : true, "de:binItems" : { "de:partID" : [1318886361747000, 1318886361752939 ] } }, { "de:binName" : "gly_ser_linker", "de:iconID" : "cds", "de:direction" : "forward", "de:dsf" : false, "de:binItems" : { "de:partID" : [1318886361759096, 1318886361765102 ] } }, { "de:binName" : "GFPuv", "de:iconID" : "cds", "de:direction" : "forward", "de:dsf" : false, "de:binItems" : { "de:partID" : [1318886361772744 ] } }, { "de:binName" : "ssrA_tag_5prime", "de:iconID" : "protein_stability_element", "de:direction" : "forward", "de:dsf" : true, "de:binItems" : { "de:partID" : [1320793316351783, 1320793317318572 ] } }, { "de:binName" : "ssrA_tag_3prime", "de:iconID" : "protein_stability_element", "de:direction" : "forward", "de:dsf" : false, "de:binItems" : { "de:partID" : [1320793489598961 ] } } ] } }, "de:sequenceFiles" : { "de:sequenceFile" : [{ "hash" : "23d714d34632e24f53c2095f05e79f17aded7ec22651c20e4b320f82bc2bf731", "de:format" : "Genbank", "de:content" : "LOCUS       pj5_00001               5299 bp    dna     circular UNK 26-OCT-2009\nDEFINITION  promoter seq from pBAD33.\nACCESSION   unknown\nKEYWORDS    ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; .\nFEATURES             Location/Qualifiers\n     CDS             complement(7..885)\n                     /label=araC\n     protein_bind    914..931\n                     /label=operator\\O2\n     promoter        complement(1036..1064)\n                     /label=araC\\promoter\n     protein_bind    1072..1093\n                     /label=operator\\O1\n     misc_binding    1115..1128\n                     /label=CAP\\site\n     protein_bind    1124..1162\n                     /label=Operator\\I2\\and\\I1\n     promoter        1161..1188\n                     /label=pBAD\\promoter\n     RBS             1216..1235\n                     /label=RBS\n     CDS             1236..2018\n                     /vntifkey=\"4\"\n                     /label=GFPuv\n     misc_feature    1661..1661\n                     /label=XhoI_silent_mutation\n     misc_feature    1760..1760\n                     /label=BamHI_silent_mutation\n     CDS             1953..2015\n                     /vntifkey=\"4\"\n                     /label=signal_peptide\n     terminator      2034..2162\n                     /label=dbl\\term\n     rep_origin      complement(2164..4392)\n                     /label=pSC101**\n     terminator      4393..4498\n                     /label=T0\n     misc_marker     complement(4514..5173)\n                     /label=CmR\nORIGIN      \n        1 gacgtcttat gacaacttga cggctacatc attcactttt tcttcacaac cggcacggaa\n       61 ctcgctcggg ctggccccgg tgcatttttt aaatacccgc gagaaataga gttgatcgtc\n      121 aaaaccaaca ttgcgaccga cggtggcgat aggcatccgg gtggtgctca aaagcagctt\n      181 cgcctggctg atacgttggt cctcgcgcca gcttaagacg ctaatcccta actgctggcg\n      241 gaaaagatgt gacagacgcg acggcgacaa gcaaacatgc tgtgcgacgc tggcgatatc\n      301 aaaattgctg tctgccaggt gatcgctgat gtactgacaa gcctcgcgta cccgattatc\n      361 catcggtgga tggagcgact cgttaatcgc ttccatgcgc cgcagtaaca attgctcaag\n      421 cagatttatc gccagcagct ccgaatagcg cccttcccct tgcccggcgt taatgatttg\n      481 cccaaacagg tcgctgaaat gcggctggtg cgcttcatcc gggcgaaaga accccgtatt\n      541 ggcaaatatt gacggccagt taagccattc atgccagtag gcgcgcggac gaaagtaaac\n      601 ccactggtga taccattcgc gagcctccgg atgacgaccg tagtgatgaa tctctcctgg\n      661 cgggaacagc aaaatatcac ccggtcggca aacaaattct cgtccctgat ttttcaccac\n      721 cccctgaccg cgaatggtga gattgagaat ataacctttc attcccagcg gtcggtcgat\n      781 aaaaaaatcg agataaccgt tggcctcaat cggcgttaaa cccgccacca gatgggcatt\n      841 aaacgagtat cccggcagca ggggatcatt ttgcgcttca gccatacttt tcatactccc\n      901 gccattcaga gaagaaacca attgtccata ttgcatcaga cattgccgtc actgcgtctt\n      961 ttactggctc ttctcgctaa ccaaaccggt aaccccgctt attaaaagca ttctgtaaca\n     1021 aagcgggacc aaagccatga caaaaacgcg taacaaaagt gtctataatc acggcagaaa\n     1081 agtccacatt gattatttgc acggcgtcac actttgctat gccatagcat ttttatccat\n     1141 aagattagcg gattctacct gacgcttttt atcgcaactc tctactgttt ctccataccc\n     1201 gtttttttgg gaatttttaa gaaggagata tacatatgag taaaggagaa gaacttttca\n     1261 ctggagttgt cccaattctt gttgaattag atggtgatgt taatgggcac aaattttctg\n     1321 tcagtggaga gggtgaaggt gatgcaacat acggaaaact tacccttaaa tttatttgca\n     1381 ctactggaaa actacctgtt ccatggccaa cacttgtcac tactttctct tatggtgttc\n     1441 aatgcttttc ccgttatccg gatcatatga aacggcatga ctttttcaag agtgccatgc\n     1501 ccgaaggtta tgtacaggaa cgcactatat ctttcaaaga tgacgggaac tacaagacgc\n     1561 gtgctgaagt caagtttgaa ggtgataccc ttgttaatcg tatcgagtta aaaggtattg\n     1621 attttaaaga agatggaaac attctcggac acaaactcga atacaactat aactcacaca\n     1681 atgtatacat cacggcagac aaacaaaaga atggaatcaa agctaacttc aaaattcgcc\n     1741 acaacattga agatggatct gttcaactag cagaccatta tcaacaaaat actccaattg\n     1801 gcgatggccc tgtcctttta ccagacaacc attacctgtc gacacaatct gccctttcga\n     1861 aagatcccaa cgaaaagcgt gaccacatgg tccttcttga gtttgtaact gctgctggga\n     1921 ttacacatgg catggatgag ctcggcggcg gcggcagcaa ggtctacggc aaggaacagt\n     1981 ttttgcggat gcgccagagc atgttccccg atcgctaaat cgagtaagga tctccaggca\n     2041 tcaaataaaa cgaaaggctc agtcgaaaga ctgggccttt cgttttatct gttgtttgtc\n     2101 ggtgaacgct ctctactaga gtcacactgg ctcaccttcg ggtgggcctt tctgcgttta\n     2161 tacctagggt acgggttttg ctgcccgcaa acgggctgtt ctggtgttgc tagtttgtta\n     2221 tcagaatcgc agatccggct tcagccggtt tgccggctga aagcgctatt tcttccagaa\n     2281 ttgccatgat tttttcccca cgggaggcgt cactggctcc cgtgttgtcg gcagctttga\n     2341 ttcgataagc agcatcgcct gtttcaggct gtctatgtgt gactgttgag ctgtaacaag\n     2401 ttgtctcagg tgttcaattt catgttctag ttgctttgtt ttactggttt cacctgttct\n     2461 attaggtgtt acatgctgtt catctgttac attgtcgatc tgttcatggt gaacagcttt\n     2521 gaatgcacca aaaactcgta aaagctctga tgtatctatc ttttttacac cgttttcatc\n     2581 tgtgcatatg gacagttttc cctttgatat gtaacggtga acagttgttc tacttttgtt\n     2641 tgttagtctt gatgcttcac tgatagatac aagagccata agaacctcag atccttccgt\n     2701 atttagccag tatgttctct agtgtggttc gttgtttttg cgtgagccat gagaacgaac\n     2761 cattgagatc atacttactt tgcatgtcac tcaaaaattt tgcctcaaaa ctggtgagct\n     2821 gaatttttgc agttaaagca tcgtgtagtg tttttcttag tccgttatgt aggtaggaat\n     2881 ctgatgtaat ggttgttggt attttgtcac cattcatttt tatctggttg ttctcaagtt\n     2941 cggttacgag atccatttgt ctatctagtt caacttggaa aatcaacgta tcagtcgggc\n     3001 ggcctcgctt atcaaccacc aatttcatat tgctgtaagt gtttaaatct ttacttattg\n     3061 gtttcaaaac ccattggtta agccttttaa actcatggta gttattttca agcattaaca\n     3121 tgaacttaaa ttcatcaagg ctaatctcta tatttgcctt gtgagttttc ttttgtgtta\n     3181 gttcttttaa taaccactca taaatcctca tagagtattt gttttcaaaa gacttaacat\n     3241 gttccagatt atattttatg aattttttta actggaaaag ataaggcaat atctcttcac\n     3301 taaaaactaa ttctaatttt tcgcttgaga acttggcata gtttgtccac tggaaaatct\n     3361 caaagccttt aaccaaagga ttcctgattt ccacagttct cgtcatcagc tctctggttg\n     3421 ctttagctaa tacaccataa gcattttccc tactgatgtt catcatctga gcgtattggt\n     3481 tataagtgaa cgataccgtc cgttctttcc ttgtagggtt ttcaatcgtg gggttgagta\n     3541 gtgccacaca gcataaaatt agcttggttt catgctccgt taagtcatag cgactaatcg\n     3601 ctagttcatt tgctttgaaa acaactaatt cagacataca tctcaattgg tctaggtgat\n     3661 tttaatcact ataccaattg agatgggcta gtcaatgata attactagtc cttttcccgg\n     3721 gtgatctggg tatctgtaaa ttctgctaga cctttgctgg aaaacttgta aattctgcta\n     3781 gaccctctgt aaattccgct agacctttgt gtgttttttt tgtttatatt caagtggtta\n     3841 taatttatag aataaagaaa gaataaaaaa agataaaaag aatagatccc agccctgtgt\n     3901 ataactcact actttagtca gttccgcagt attacaaaag gatgtcgcaa acgctgtttg\n     3961 ctcctctaca aaacagacct taaaacccta aaggcttaag tagcaccctc gcaagctcgg\n     4021 gcaaatcgct gaatattcct tttgtctccg accatcaggc acctgagtcg ctgtcttttt\n     4081 cgtgacattc agttcgctgc gctcacggct ctggcagtga atgggggtaa atggcactac\n     4141 aggcgccttt tatggattca tgcaaggaaa ctacccataa tacaagaaaa gcccgtcacg\n     4201 ggcttctcag ggcgttttat ggcgggtctg ctatgtggtg ctatctgact ttttgctgtt\n     4261 cagcagttcc tgccctctga ttttccagtc tgaccacttc ggattatccc gtgacaggtc\n     4321 attcagactg gctaatgcac ccagtaaggc agcggtatca tcaacaggct tacccgtctt\n     4381 actgtcccta gtgcttggat tctcaccaat aaaaaacgcc cggcggcaac cgagcgttct\n     4441 gaacaaatcc agatggagtt ctgaggtcat tactggatct atcaacagga gtccaagcga\n     4501 gctcgatatc aaattacgcc ccgccctgcc actcatcgca gtactgttgt aattcattaa\n     4561 gcattctgcc gacatggaag ccatcacaaa cggcatgatg aacctgaatc gccagcggca\n     4621 tcagcacctt gtcgccttgc gtataatatt tgcccatggt gaaaacgggg gcgaagaagt\n     4681 tgtccatatt ggccacgttt aaatcaaaac tggtgaaact cacccaggga ttggctgaga\n     4741 cgaaaaacat attctcaata aaccctttag ggaaataggc caggttttca ccgtaacacg\n     4801 ccacatcttg cgaatatatg tgtagaaact gccggaaatc gtcgtggtat tcactccaga\n     4861 gcgatgaaaa cgtttcagtt tgctcatgga aaacggtgta acaagggtga acactatccc\n     4921 atatcaccag ctcaccgtct ttcattgcca tacgaaattc cggatgagca ttcatcaggc\n     4981 gggcaagaat gtgaataaag gccggataaa acttgtgctt atttttcttt acggtcttta\n     5041 aaaaggccgt aatatccagc tgaacggtct ggttataggt acattgagca actgactgaa\n     5101 atgcctcaaa atgttcttta cgatgccatt gggatatatc aacggtggta tatccagtga\n     5161 tttttttctc cattttagct tccttagctc ctgaaaatct cgataactca aaaaatacgc\n     5221 ccggtagtga tcttatttca ttatggtgaa agttggaacc tcttacgtgc cgatcaacgt\n     5281 ctcattttcg ccagatatc\n//\n", "de:fileName" : "pj5_00001.gb" }, { "hash" : "46d943915b196da710b25db3127c75a1ba01da913d0b5bb2b17055f9b5a079a1", "de:format" : "Genbank", "de:content" : "LOCUS       BMC_nterm_sig_pe         102 bp    DNA     linear       26-FEB-2010\nDEFINITION  promoter seq from pBAD33.\nACCESSION   unknown\nSOURCE      \n  ORGANISM  \nFEATURES             Location/Qualifiers\n     misc_feature    55..102\n                     /label=gly_ser_linker\n     CDS             1..102\n                     /label=GFPuv\n     misc_feature    4..54\n                     /label=Clostridium_BMC_sig_pep\nBASE COUNT       33 a        14 c        29 g        26 t \nORIGIN\n        1 atggaaaata acgctttatt agaacaaata atcaatgaag ttttaaaaaa tatgggtggc \n       61 agtggtagcg ggagctcggg tggctcaggc tctggttcca gt \n//\n", "de:fileName" : "BMC_nterm_sig_pep_GFPuv.gb" }, { "hash" : "fbdc0cd5591545b773bce0741569577663dd940ca88bfd3b3dca98a3fc20fc39", "de:format" : "Genbank", "de:content" : "LOCUS       ccmN_nterm_sig_p         108 bp    DNA     linear       26-FEB-2010\nDEFINITION  promoter seq from pBAD33.\nACCESSION   unknown\nSOURCE      \n  ORGANISM  \nFEATURES             Location/Qualifiers\n     misc_feature    4..60\n                     /label=ccmN_sig_pep\n     misc_feature    61..108\n                     /label=gly_ser_linker\n     CDS             1..108\n                     /label=GFPuv\nBASE COUNT       20 a        25 c        40 g        23 t \nORIGIN\n        1 atgaaggtct acggcaagga acagtttttg cggatgcgcc agagcatgtt ccccgatcgc \n       61 ggtggcagtg gtagcgggag ctcgggtggc tcaggctctg gttccagt \n//\n", "de:fileName" : "ccmN_nterm_sig_pep_GFPuv.gb" }, { "hash" : "fbb4e8715b6352478db1561d7229d0ef46ff83412c188fd71352a1418ddb43ab", "de:format" : "jbei-seq", "de:content" : "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<seq:seq\n  xmlns:seq=\"http://jbei.org/sequence\"\n  xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n  xsi:schemaLocation=\"http://jbei.org/sequence seq.xsd\"\n>\n<seq:name>ssrA_tag_GFPuv</seq:name>\n<seq:circular>false</seq:circular>\n<seq:sequence>gcggcgaacgatgaaaactatgcgctggcggcg</seq:sequence>\n<seq:features>\n    <seq:feature>\n        <seq:label>ssrA tag</seq:label>\n        <seq:complement>false</seq:complement>\n        <seq:type>misc_feature</seq:type>\n        <seq:location>\n            <seq:genbankStart>1</seq:genbankStart>\n            <seq:end>33</seq:end>\n        </seq:location>\n        <seq:attribute name=\"vntifkey\" quoted=\"true\" >21</seq:attribute>\n        <seq:seqHash>0d5535e13cc9708d0ff0289af2fae27e564b6bcbcd9242f5140d96957744a517</seq:seqHash>\n    </seq:feature>\n    <seq:feature>\n        <seq:label>GFPuv</seq:label>\n        <seq:complement>false</seq:complement>\n        <seq:type>CDS</seq:type>\n        <seq:location>\n            <seq:genbankStart>1</seq:genbankStart>\n            <seq:end>33</seq:end>\n        </seq:location>\n        <seq:attribute name=\"vntifkey\" quoted=\"true\" >4</seq:attribute>\n        <seq:seqHash>0d5535e13cc9708d0ff0289af2fae27e564b6bcbcd9242f5140d96957744a517</seq:seqHash>\n    </seq:feature>\n</seq:features>\n</seq:seq>\n", "de:fileName" : "ssrA_tag_GFPuv.xml" }, { "hash" : "7ded0adb8463aa8b7bfe30d093bc4f6d8718bd1182906f283b04d303860dd0f3", "de:format" : "FASTA", "de:content" : ">ssrA_tag_enhance\nGCGGCGAACGATGAAAACTATAACTATGCGCTGGCGGCG\n", "de:fileName" : "ssrA_tag_enhance.fas" } ] }, "de:partVOs" : { "de:partVO" : [{ "id" : 1318886361742366, "de:name" : "pS8c-vector_backbone", "de:revComp" : false, "de:startBP" : 2016, "de:stopBP" : 1238, "de:parts" : { "de:part" : { "id" : 1318886361742634, "de:fas" : "" } }, "de:sequenceFileHash" : "23d714d34632e24f53c2095f05e79f17aded7ec22651c20e4b320f82bc2bf731" }, { "id" : 1318886361747742, "de:name" : "BMC_nterm_sig_pep", "de:revComp" : false, "de:startBP" : 4, "de:stopBP" : 54, "de:parts" : { "de:part" : { "id" : 1318886361747000, "de:fas" : "" } }, "de:sequenceFileHash" : "46d943915b196da710b25db3127c75a1ba01da913d0b5bb2b17055f9b5a079a1" }, { "id" : 1318886361752995, "de:name" : "ccmN_nterm_sig_pep", "de:revComp" : false, "de:startBP" : 4, "de:stopBP" : 60, "de:parts" : { "de:part" : { "id" : 1318886361752939, "de:fas" : "" } }, "de:sequenceFileHash" : "fbdc0cd5591545b773bce0741569577663dd940ca88bfd3b3dca98a3fc20fc39" }, { "id" : 1318886361759464, "de:name" : "long_gly_ser_linker", "de:revComp" : false, "de:startBP" : 55, "de:stopBP" : 102, "de:parts" : { "de:part" : { "id" : 1318886361759096, "de:fas" : "" } }, "de:sequenceFileHash" : "46d943915b196da710b25db3127c75a1ba01da913d0b5bb2b17055f9b5a079a1" }, { "id" : 1318886361765194, "de:name" : "short_gly_ser_linker", "de:revComp" : false, "de:startBP" : 55, "de:stopBP" : 78, "de:parts" : { "de:part" : { "id" : 1318886361765102, "de:fas" : "" } }, "de:sequenceFileHash" : "46d943915b196da710b25db3127c75a1ba01da913d0b5bb2b17055f9b5a079a1" }, { "id" : 1318886361772274, "de:name" : "GFPuv", "de:revComp" : false, "de:startBP" : 1242, "de:stopBP" : 1952, "de:parts" : { "de:part" : { "id" : 1318886361772744, "de:fas" : "" } }, "de:sequenceFileHash" : "23d714d34632e24f53c2095f05e79f17aded7ec22651c20e4b320f82bc2bf731" }, { "id" : 1320793316351870, "de:name" : "ssrA_tag_5prime", "de:revComp" : false, "de:startBP" : 1, "de:stopBP" : 15, "de:parts" : { "de:part" : { "id" : 1320793316351783, "de:fas" : "" } }, "de:sequenceFileHash" : "fbb4e8715b6352478db1561d7229d0ef46ff83412c188fd71352a1418ddb43ab" }, { "id" : 1320793317318921, "de:name" : "ssrA_tag_enhanced_5prime", "de:revComp" : false, "de:startBP" : 1, "de:stopBP" : 21, "de:parts" : { "de:part" : { "id" : 1320793317318572, "de:fas" : "Embed_in_primer_reverse" } }, "de:sequenceFileHash" : "7ded0adb8463aa8b7bfe30d093bc4f6d8718bd1182906f283b04d303860dd0f3" }, { "id" : 1320793489598076, "de:name" : "ssrA_tag_3prime", "de:revComp" : false, "de:startBP" : 16, "de:stopBP" : 33, "de:parts" : { "de:part" : { "id" : 1320793489598961, "de:fas" : "Embed_in_primer_forward" } }, "de:sequenceFileHash" : "fbb4e8715b6352478db1561d7229d0ef46ff83412c188fd71352a1418ddb43ab" } ] }, "de:eugeneRules" : { "de:eugeneRule" : [{ "de:name" : "Rule_1", "de:negationOperator" : false, "de:operand1ID" : 1318886361765194, "de:compositionalOperator" : "THEN", "de:operand2ID" : 1318886361747742 } ] } } };
  var Model = app.db.model("Models");
  req.user.models.push(new Model({'name':'Untitled model','payload':payload}));
  req.user.save(function(){
    res.send('done');
  })
});

app.all('/saveUserModel',restrict,function(req,res){
  var Model = app.db.model("Models");

  if(req.body._id=='0')
  {
    // A new design
    req.user.models.push(new Model({'name':req.body.name,'payload':JSON.parse(req.body.payload)}));
    console.log('Saving a new model');
    req.user.save(function(){
      res.send('done');
    });
  }
  else
  {
    // An existing design
    var model = req.user.models.id(req.body._id);
    if(model)
    {
      var last_modified = new Date();
      model.last_modified = last_modified;
      model.name = req.body.name;
      model.payload = JSON.parse(req.body.payload);
      console.log('Modifing an existing model');
      req.user.save(function(){
        res.send('done');
      });
    }
    else
    {
      res.send('not saved');
    }
  }
});

app.all('/deviceeditor',function(req,res){
  res.json({'sessionId':'432424124'});
});

app.all('/getUserModels',restrict,function(req,res){
  var models = [];
  req.user.models.forEach(function(item){
    models.push({'_id':item._id,'name':item.name});
  });
  res.json(models);
});

app.post('/getTree',restrict,function(req,res){

  var examplesTree = [];

  var ExamplesModel = app.db.model("Examples");
  ExamplesModel.find({}, function(err,examplesResults){
    examplesResults.forEach(function(ex){
      examplesTree.push({'_id':ex._id,'text':ex.name, 'leaf': true, 'type':'example'});
  });

  var models = [];
  req.user.models.forEach(function(item){
    models.push({'_id':item._id,'text':item.name, 'leaf': true, 'type':'design'});
  });

  var protocols = [];
  req.user.protocols.forEach(function(item){
    protocols.push({'_id':item._id,'text':item.created, 'leaf': true, 'type':'protocol'});
  });

  var tree = {
        children : [
            { text: "Models", expanded: true , children: [
                { text: "My Models", expanded: true, children: models },
                { text: "Examples", expanded: true, children: examplesTree }
            ]},
            { text: "Protocols", expanded: true, children: protocols }
        ]
  };

  res.json(tree);
  });

});

app.post('/getUserModel',restrict,function(req,res){
  var modelFound;
  req.user.models.forEach(function(item){
    if(item._id == req.body._id) modelFound = item;
  });
  if(modelFound) res.json(modelFound);
  else res.json({error:"Model not found"});
});

app.all('/getExampleModel',restrict,function(req,res){
  var ExamplesModel = app.db.model("Examples");
  ExamplesModel.findById(req.body._id, function(err,example){
    res.json(example);
  });
});

// Save a model to mongodb
/*
  Input : JSON DE Model
  Output : ID
*/
app.all('/saveData',function(req,res){

  app.mongodb.collection('models', function(err, collection) {
    if(req.body._id!='0')
{        
        var o_id = new app.mongo.ObjectID(req.body._id);
        var last_modified = new Date();
        collection.update({'_id':o_id}, {
          $set:{
          'last_modified': last_modified,
          'name':req.body.name,
          'payload': JSON.parse(req.body.payload) }
        }, function(err, result) {
          res.send({'_id':req.body._id,'last_modified':last_modified});
        });

    }
    else
    {
      var last_modified = new Date();
      collection.insert({
         'created':last_modified
        ,'name':req.body.name
        ,'payload': JSON.parse(req.body.payload)
      },function(err,data){
        res.send({'_id':data[0]._id,'created':last_modified,'last_modified':last_modified});
      });
    }
  });
});


app.all('/ice/search',function(req,res){
  app.soap.client.search({sessionId:app.soap.sessionId, query:req.query.query},function(arg1,arg2,arg3,arg4){

    app.xmlparser.parseString(arg3, function (err, result) {
        if (result["soap:Envelope"]["soap:Body"][0]["ns2:searchResponse"][0]["return"])
        {
          var results = result["soap:Envelope"]["soap:Body"][0]["ns2:searchResponse"][0]["return"];
          results.forEach(function(res){
            //console.log(res["entry"][0]);
          });
          res.json(result);
        }
        else
        {
          res.json({"msg":"No results found"});
        }
    });
  });
});

app.all('/ice/getRecord',function(req,res){
  res.set('Content-Type', 'application/xml');
  console.log(req.query.entryId);
   app.soap.client.getByRecordId({sessionId:app.soap.sessionId,entryId:req.query.entryId},function(arg1,arg2,arg3,arg4){
    app.xmlparser.parseString(arg3, function (err, result) {
        //res.json(result);
    });
    res.send(arg3);
  });
});

app.all('/ice/getSequence',function(req,res){
  console.log(req.query.entryId);
   app.soap.client.getSequence({sessionId:app.soap.sessionId,entryId:req.query.entryId},function(arg1,arg2,arg3,arg4){
    app.xmlparser.parseString(arg3, function (err, result) {
        res.json(result);
    });
  });
});


function createPlasmidEntry(args,cb)
{
  var plasmid = {};
  
  plasmid.bioSafetyLevel = args["Bio safety level"];
  plasmid.creator = args["Creator"];
  plasmid.entryFundingSources = {};
  plasmid.entryFundingSources.fundingSource = {};
  plasmid.entryFundingSources.fundingSource.fundingSource = args["Funding source"];               
  plasmid.entryFundingSources.fundingSource.principalInvestigator = args["Principal investigator"];
  plasmid.names = {};
  plasmid.names.name = args["Name"];
  plasmid.owner = args["Owner"];                    
  plasmid.ownerEmail = args["Owner email"];             
  plasmid.shortDescription = args["Short description"];
  plasmid.status = args["Status"].toLowerCase();
  plasmid.circular = args["type"] == "Circular" ? "true" : "false";
  
  var obj = {};
  obj.sessionId = app.soap.sessionId;
  obj.plasmid = plasmid;

  //console.log(obj);
  //console.log(plasmid.entryFundingSources.fundingSource);
    

  app.soap.client.createPlasmid(obj,function(arg1,arg2,arg3,arg4){
      app.xmlparser.parseString(arg3, function (err, result) {
          
          var body = result["soap:Envelope"]["soap:Body"][0];
              if(body["ns2:createPlasmidResponse"])
                {
                  var recordId = body["ns2:createPlasmidResponse"][0]["return"][0]["recordId"][0];
                  console.log("New entry created at "+recordId);
                  return uploadSequence(args,recordId,result,cb);
                }
                else
                {
                  console.log("Couldnt create entry");
                  return cb({'fault':'Service not available'});
                }
      });
  });
}

function uploadSequence(args,recordId,result,cb){
  console.log('Uploading sequence to '+recordId);

  //var seq = app.fs.readFileSync(__dirname + "/../resources/sequences/pj5_00002.gb", "utf8");
  var seq = args.genBankData;
  //console.log(seq);

  app.soap.client.uploadSequence({sessionId:app.soap.sessionId,entryId:recordId,sequence:seq},function(arg1,arg2,arg3,arg4){
    app.xmlparser.parseString(arg3, function (err, result) {
        return cb(recordId);
    });
  });
}

app.all('/saveToRegistry',function(req,res){

  createPlasmidEntry(req.body,function(result){
    res.json(result);
  });
});


app.all('/ice/uploadSequence',function(req,res){

  console.log(req.query.entryId);


});

};


/*
function loadExamples(){

  examples = [];

  var ExamplesModel = app.db.model("Examples");
  ExamplesModel.find({}, function(err,examplesResults){
    examplesResults.forEach(function(ex){
      examples.push({'name':ex.name,'_id':ex._id});
      console.log(ex);
    });
    console.log("Loaded "+examples.length+" examples.");
  });
};
*/