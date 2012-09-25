    /*

    DE INTEGRATION

    var exSeq = "LOCUS%20%20%20%20%20%20%20pj5_00002%20%20%20%20%20%20%20%20%20%20%20%20%20%20%205365%20bp%20%20%20%20dna%20%20%20%20%20circular%20UNK%2026-OCT-2009%0ADEFINITION%20%20promoter%20seq%20from%20pBAD33.%0AACCESSION%20%20%20unknown%0AKEYWORDS%20%20%20%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20%3B%20.%0AFEATURES%20%20%20%20%20%20%20%20%20%20%20%20%20Location%2FQualifiers%0A%20%20%20%20%20CDS%20%20%20%20%20%20%20%20%20%20%20%20%20complement(7..885)%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3DaraC%0A%20%20%20%20%20protein_bind%20%20%20%20914..931%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3Doperator%5CO2%0A%20%20%20%20%20promoter%20%20%20%20%20%20%20%20complement(1036..1064)%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3DaraC%5Cpromoter%0A%20%20%20%20%20protein_bind%20%20%20%201072..1093%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3Doperator%5CO1%0A%20%20%20%20%20misc_binding%20%20%20%201115..1128%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3DCAP%5Csite%0A%20%20%20%20%20protein_bind%20%20%20%201124..1162%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3DOperator%5CI2%5Cand%5CI1%0A%20%20%20%20%20promoter%20%20%20%20%20%20%20%201161..1188%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3DpBAD%5Cpromoter%0A%20%20%20%20%20RBS%20%20%20%20%20%20%20%20%20%20%20%20%201216..1235%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3DRBS%0A%20%20%20%20%20CDS%20%20%20%20%20%20%20%20%20%20%20%20%201236..2084%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Fvntifkey%3D%224%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3DGFPuv%0A%20%20%20%20%20misc_feature%20%20%20%201239..1289%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3DClostridium_BMC_sig_pep%0A%20%20%20%20%20misc_feature%20%20%20%201290..1337%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3Dgly_ser_linker%0A%20%20%20%20%20misc_feature%20%20%20%201757..1757%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3DXhoI_silent_mutation%0A%20%20%20%20%20misc_feature%20%20%20%201856..1856%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3DBamHI_silent_mutation%0A%20%20%20%20%20misc_feature%20%20%20%202049..2081%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Fvntifkey%3D%2221%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3DssrA%5Ctag%0A%20%20%20%20%20terminator%20%20%20%20%20%202100..2228%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3Ddbl%5Cterm%0A%20%20%20%20%20rep_origin%20%20%20%20%20%20complement(2230..4458)%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3DpSC101**%0A%20%20%20%20%20terminator%20%20%20%20%20%204459..4564%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3DT0%0A%20%20%20%20%20misc_marker%20%20%20%20%20complement(4580..5239)%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2Flabel%3DCmR%0AORIGIN%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%201%20gacgtcttat%20gacaacttga%20cggctacatc%20attcactttt%20tcttcacaac%20cggcacggaa%0A%20%20%20%20%20%20%2061%20ctcgctcggg%20ctggccccgg%20tgcatttttt%20aaatacccgc%20gagaaataga%20gttgatcgtc%0A%20%20%20%20%20%20121%20aaaaccaaca%20ttgcgaccga%20cggtggcgat%20aggcatccgg%20gtggtgctca%20aaagcagctt%0A%20%20%20%20%20%20181%20cgcctggctg%20atacgttggt%20cctcgcgcca%20gcttaagacg%20ctaatcccta%20actgctggcg%0A%20%20%20%20%20%20241%20gaaaagatgt%20gacagacgcg%20acggcgacaa%20gcaaacatgc%20tgtgcgacgc%20tggcgatatc%0A%20%20%20%20%20%20301%20aaaattgctg%20tctgccaggt%20gatcgctgat%20gtactgacaa%20gcctcgcgta%20cccgattatc%0A%20%20%20%20%20%20361%20catcggtgga%20tggagcgact%20cgttaatcgc%20ttccatgcgc%20cgcagtaaca%20attgctcaag%0A%20%20%20%20%20%20421%20cagatttatc%20gccagcagct%20ccgaatagcg%20cccttcccct%20tgcccggcgt%20taatgatttg%0A%20%20%20%20%20%20481%20cccaaacagg%20tcgctgaaat%20gcggctggtg%20cgcttcatcc%20gggcgaaaga%20accccgtatt%0A%20%20%20%20%20%20541%20ggcaaatatt%20gacggccagt%20taagccattc%20atgccagtag%20gcgcgcggac%20gaaagtaaac%0A%20%20%20%20%20%20601%20ccactggtga%20taccattcgc%20gagcctccgg%20atgacgaccg%20tagtgatgaa%20tctctcctgg%0A%20%20%20%20%20%20661%20cgggaacagc%20aaaatatcac%20ccggtcggca%20aacaaattct%20cgtccctgat%20ttttcaccac%0A%20%20%20%20%20%20721%20cccctgaccg%20cgaatggtga%20gattgagaat%20ataacctttc%20attcccagcg%20gtcggtcgat%0A%20%20%20%20%20%20781%20aaaaaaatcg%20agataaccgt%20tggcctcaat%20cggcgttaaa%20cccgccacca%20gatgggcatt%0A%20%20%20%20%20%20841%20aaacgagtat%20cccggcagca%20ggggatcatt%20ttgcgcttca%20gccatacttt%20tcatactccc%0A%20%20%20%20%20%20901%20gccattcaga%20gaagaaacca%20attgtccata%20ttgcatcaga%20cattgccgtc%20actgcgtctt%0A%20%20%20%20%20%20961%20ttactggctc%20ttctcgctaa%20ccaaaccggt%20aaccccgctt%20attaaaagca%20ttctgtaaca%0A%20%20%20%20%201021%20aagcgggacc%20aaagccatga%20caaaaacgcg%20taacaaaagt%20gtctataatc%20acggcagaaa%0A%20%20%20%20%201081%20agtccacatt%20gattatttgc%20acggcgtcac%20actttgctat%20gccatagcat%20ttttatccat%0A%20%20%20%20%201141%20aagattagcg%20gattctacct%20gacgcttttt%20atcgcaactc%20tctactgttt%20ctccataccc%0A%20%20%20%20%201201%20gtttttttgg%20gaatttttaa%20gaaggagata%20tacatatgga%20aaataacgct%20ttattagaac%0A%20%20%20%20%201261%20aaataatcaa%20tgaagtttta%20aaaaatatgg%20gtggcagtgg%20tagcgggagc%20tcgggtggct%0A%20%20%20%20%201321%20caggctctgg%20ttccagtaaa%20ggagaagaac%20ttttcactgg%20agttgtccca%20attcttgttg%0A%20%20%20%20%201381%20aattagatgg%20tgatgttaat%20gggcacaaat%20tttctgtcag%20tggagagggt%20gaaggtgatg%0A%20%20%20%20%201441%20caacatacgg%20aaaacttacc%20cttaaattta%20tttgcactac%20tggaaaacta%20cctgttccat%0A%20%20%20%20%201501%20ggccaacact%20tgtcactact%20ttctcttatg%20gtgttcaatg%20cttttcccgt%20tatccggatc%0A%20%20%20%20%201561%20atatgaaacg%20gcatgacttt%20ttcaagagtg%20ccatgcccga%20aggttatgta%20caggaacgca%0A%20%20%20%20%201621%20ctatatcttt%20caaagatgac%20gggaactaca%20agacgcgtgc%20tgaagtcaag%20tttgaaggtg%0A%20%20%20%20%201681%20atacccttgt%20taatcgtatc%20gagttaaaag%20gtattgattt%20taaagaagat%20ggaaacattc%0A%20%20%20%20%201741%20tcggacacaa%20actcgaatac%20aactataact%20cacacaatgt%20atacatcacg%20gcagacaaac%0A%20%20%20%20%201801%20aaaagaatgg%20aatcaaagct%20aacttcaaaa%20ttcgccacaa%20cattgaagat%20ggatctgttc%0A%20%20%20%20%201861%20aactagcaga%20ccattatcaa%20caaaatactc%20caattggcga%20tggccctgtc%20cttttaccag%0A%20%20%20%20%201921%20acaaccatta%20cctgtcgaca%20caatctgccc%20tttcgaaaga%20tcccaacgaa%20aagcgtgacc%0A%20%20%20%20%201981%20acatggtcct%20tcttgagttt%20gtaactgctg%20ctgggattac%20acatggcatg%20gatgagctcg%0A%20%20%20%20%202041%20gcggcggcgc%20ggcgaacgat%20gaaaactatg%20cgctggcggc%20gtaaatcgag%20taaggatctc%0A%20%20%20%20%202101%20caggcatcaa%20ataaaacgaa%20aggctcagtc%20gaaagactgg%20gcctttcgtt%20ttatctgttg%0A%20%20%20%20%202161%20tttgtcggtg%20aacgctctct%20actagagtca%20cactggctca%20ccttcgggtg%20ggcctttctg%0A%20%20%20%20%202221%20cgtttatacc%20tagggtacgg%20gttttgctgc%20ccgcaaacgg%20gctgttctgg%20tgttgctagt%0A%20%20%20%20%202281%20ttgttatcag%20aatcgcagat%20ccggcttcag%20ccggtttgcc%20ggctgaaagc%20gctatttctt%0A%20%20%20%20%202341%20ccagaattgc%20catgattttt%20tccccacggg%20aggcgtcact%20ggctcccgtg%20ttgtcggcag%0A%20%20%20%20%202401%20ctttgattcg%20ataagcagca%20tcgcctgttt%20caggctgtct%20atgtgtgact%20gttgagctgt%0A%20%20%20%20%202461%20aacaagttgt%20ctcaggtgtt%20caatttcatg%20ttctagttgc%20tttgttttac%20tggtttcacc%0A%20%20%20%20%202521%20tgttctatta%20ggtgttacat%20gctgttcatc%20tgttacattg%20tcgatctgtt%20catggtgaac%0A%20%20%20%20%202581%20agctttgaat%20gcaccaaaaa%20ctcgtaaaag%20ctctgatgta%20tctatctttt%20ttacaccgtt%0A%20%20%20%20%202641%20ttcatctgtg%20catatggaca%20gttttccctt%20tgatatgtaa%20cggtgaacag%20ttgttctact%0A%20%20%20%20%202701%20tttgtttgtt%20agtcttgatg%20cttcactgat%20agatacaaga%20gccataagaa%20cctcagatcc%0A%20%20%20%20%202761%20ttccgtattt%20agccagtatg%20ttctctagtg%20tggttcgttg%20tttttgcgtg%20agccatgaga%0A%20%20%20%20%202821%20acgaaccatt%20gagatcatac%20ttactttgca%20tgtcactcaa%20aaattttgcc%20tcaaaactgg%0A%20%20%20%20%202881%20tgagctgaat%20ttttgcagtt%20aaagcatcgt%20gtagtgtttt%20tcttagtccg%20ttatgtaggt%0A%20%20%20%20%202941%20aggaatctga%20tgtaatggtt%20gttggtattt%20tgtcaccatt%20catttttatc%20tggttgttct%0A%20%20%20%20%203001%20caagttcggt%20tacgagatcc%20atttgtctat%20ctagttcaac%20ttggaaaatc%20aacgtatcag%0A%20%20%20%20%203061%20tcgggcggcc%20tcgcttatca%20accaccaatt%20tcatattgct%20gtaagtgttt%20aaatctttac%0A%20%20%20%20%203121%20ttattggttt%20caaaacccat%20tggttaagcc%20ttttaaactc%20atggtagtta%20ttttcaagca%0A%20%20%20%20%203181%20ttaacatgaa%20cttaaattca%20tcaaggctaa%20tctctatatt%20tgccttgtga%20gttttctttt%0A%20%20%20%20%203241%20gtgttagttc%20ttttaataac%20cactcataaa%20tcctcataga%20gtatttgttt%20tcaaaagact%0A%20%20%20%20%203301%20taacatgttc%20cagattatat%20tttatgaatt%20tttttaactg%20gaaaagataa%20ggcaatatct%0A%20%20%20%20%203361%20cttcactaaa%20aactaattct%20aatttttcgc%20ttgagaactt%20ggcatagttt%20gtccactgga%0A%20%20%20%20%203421%20aaatctcaaa%20gcctttaacc%20aaaggattcc%20tgatttccac%20agttctcgtc%20atcagctctc%0A%20%20%20%20%203481%20tggttgcttt%20agctaataca%20ccataagcat%20tttccctact%20gatgttcatc%20atctgagcgt%0A%20%20%20%20%203541%20attggttata%20agtgaacgat%20accgtccgtt%20ctttccttgt%20agggttttca%20atcgtggggt%0A%20%20%20%20%203601%20tgagtagtgc%20cacacagcat%20aaaattagct%20tggtttcatg%20ctccgttaag%20tcatagcgac%0A%20%20%20%20%203661%20taatcgctag%20ttcatttgct%20ttgaaaacaa%20ctaattcaga%20catacatctc%20aattggtcta%0A%20%20%20%20%203721%20ggtgatttta%20atcactatac%20caattgagat%20gggctagtca%20atgataatta%20ctagtccttt%0A%20%20%20%20%203781%20tcccgggtga%20tctgggtatc%20tgtaaattct%20gctagacctt%20tgctggaaaa%20cttgtaaatt%0A%20%20%20%20%203841%20ctgctagacc%20ctctgtaaat%20tccgctagac%20ctttgtgtgt%20tttttttgtt%20tatattcaag%0A%20%20%20%20%203901%20tggttataat%20ttatagaata%20aagaaagaat%20aaaaaaagat%20aaaaagaata%20gatcccagcc%0A%20%20%20%20%203961%20ctgtgtataa%20ctcactactt%20tagtcagttc%20cgcagtatta%20caaaaggatg%20tcgcaaacgc%0A%20%20%20%20%204021%20tgtttgctcc%20tctacaaaac%20agaccttaaa%20accctaaagg%20cttaagtagc%20accctcgcaa%0A%20%20%20%20%204081%20gctcgggcaa%20atcgctgaat%20attccttttg%20tctccgacca%20tcaggcacct%20gagtcgctgt%0A%20%20%20%20%204141%20ctttttcgtg%20acattcagtt%20cgctgcgctc%20acggctctgg%20cagtgaatgg%20gggtaaatgg%0A%20%20%20%20%204201%20cactacaggc%20gccttttatg%20gattcatgca%20aggaaactac%20ccataataca%20agaaaagccc%0A%20%20%20%20%204261%20gtcacgggct%20tctcagggcg%20ttttatggcg%20ggtctgctat%20gtggtgctat%20ctgacttttt%0A%20%20%20%20%204321%20gctgttcagc%20agttcctgcc%20ctctgatttt%20ccagtctgac%20cacttcggat%20tatcccgtga%0A%20%20%20%20%204381%20caggtcattc%20agactggcta%20atgcacccag%20taaggcagcg%20gtatcatcaa%20caggcttacc%0A%20%20%20%20%204441%20cgtcttactg%20tccctagtgc%20ttggattctc%20accaataaaa%20aacgcccggc%20ggcaaccgag%0A%20%20%20%20%204501%20cgttctgaac%20aaatccagat%20ggagttctga%20ggtcattact%20ggatctatca%20acaggagtcc%0A%20%20%20%20%204561%20aagcgagctc%20gatatcaaat%20tacgccccgc%20cctgccactc%20atcgcagtac%20tgttgtaatt%0A%20%20%20%20%204621%20cattaagcat%20tctgccgaca%20tggaagccat%20cacaaacggc%20atgatgaacc%20tgaatcgcca%0A%20%20%20%20%204681%20gcggcatcag%20caccttgtcg%20ccttgcgtat%20aatatttgcc%20catggtgaaa%20acgggggcga%0A%20%20%20%20%204741%20agaagttgtc%20catattggcc%20acgtttaaat%20caaaactggt%20gaaactcacc%20cagggattgg%0A%20%20%20%20%204801%20ctgagacgaa%20aaacatattc%20tcaataaacc%20ctttagggaa%20ataggccagg%20ttttcaccgt%0A%20%20%20%20%204861%20aacacgccac%20atcttgcgaa%20tatatgtgta%20gaaactgccg%20gaaatcgtcg%20tggtattcac%0A%20%20%20%20%204921%20tccagagcga%20tgaaaacgtt%20tcagtttgct%20catggaaaac%20ggtgtaacaa%20gggtgaacac%0A%20%20%20%20%204981%20tatcccatat%20caccagctca%20ccgtctttca%20ttgccatacg%20aaattccgga%20tgagcattca%0A%20%20%20%20%205041%20tcaggcgggc%20aagaatgtga%20ataaaggccg%20gataaaactt%20gtgcttattt%20ttctttacgg%0A%20%20%20%20%205101%20tctttaaaaa%20ggccgtaata%20tccagctgaa%20cggtctggtt%20ataggtacat%20tgagcaactg%0A%20%20%20%20%205161%20actgaaatgc%20ctcaaaatgt%20tctttacgat%20gccattggga%20tatatcaacg%20gtggtatatc%0A%20%20%20%20%205221%20cagtgatttt%20tttctccatt%20ttagcttcct%20tagctcctga%20aaatctcgat%20aactcaaaaa%0A%20%20%20%20%205281%20atacgcccgg%20tagtgatctt%20atttcattat%20ggtgaaagtt%20ggaacctctt%20acgtgccgat%0A%20%20%20%20%205341%20caacgtctca%20ttttcgccag%20atatc%0A%2F%2F%0A";
    exSeq = unescape(exSeq);
    
    $('<form />')
      .hide()
      .attr({ method : "POST" })
      
      .attr({ action : "http://eaa.teselagen.com/bin/vectoreditor_sequence.pl"})
      .attr({ target : "_blank" })
      .append($('<input />')
        .attr("type","hidden")
        .attr({ "name" : "fileLenght" }).val("8893")
      )
      .append($('<input />')
        .attr("type","hidden")
        .attr({ "name" : "fileData" }).val(escape(exSeq)))
      .append('<input type="submit" />')
      .appendTo($("body"))
      .submit();

    */

    // Changes XML to JSON
    function xmlToJson(xml) {
      
      // Create the return object
      var obj = {};

      return xml;
    };


    function getSequenceSourceName(sequence)
    {
        

        if(sequence["de:format"]=="Genbank")
        {
            return sequence["de:content"].match(/LOCUS +([\w|-]+) +/)[1];
        }
        if(sequence["de:format"]=="FASTA")
        {
            return sequence["de:content"].match(/>(.+)/)[1];
        }

        return "unknown";
    }

    function sanitizeInput(input)
    {
        // Remove empty lines
        return input.replace(/\n\n/g, '');
    }

    function detectFormat(sequence)
    {
        if(sequence["de:content"].match(/<?xml/)) return "jbei-seq";
        if(sequence["de:content"].match(/LOCUS/)) return "Genbank";
        if(sequence["de:content"].match(/>.+\n/)) return "FASTA";
    }

    function validateSequence(sequence)
    {
        if(sequence["de:format"]=="FASTA")
        {
            console.log("Validating FASTA");

            var data = sanitizeInput(sequence["de:content"]).match(/^>.+(\n[\w|\W]+)+$/);

            if(data)
            {   
                var sqs = sanitizeInput(sequence["de:content"]).match(/([\w|\W]+)/g);
                console.log(sqs);
                return true;
            }
            else
            {
                flashCallback("Not valid FAS sequence");
            }
        }

        if(sequence["de:format"]=="Genbank")
        {
            console.log("Validating Genbank");
            return true;
        }

        if(sequence["de:format"]=="jbei-seq")
        {
            console.log("Validating jbei-seq");
            return true;
        }
    }

    function sequenceLength(sequence)
    {
        if(sequence["de:format"]=="jbei-seq")
        {
            var doc = $.parseXML( sequence["de:content"] );
            var xml = $( doc );
            return xml.find("sequence").first().text().length;
        }
        if(sequence["de:format"]=="Genbank")
        {
            return sequence["de:content"].match(/\s(\d+)\sbp/)[1];
        }
        if(sequence["de:format"]=="FASTA")
        {
            return sequence["de:content"].match(/\w+\n(\w+)/)[1].length;
        }
    }

    function parseTimeStamp(date)
    {
        if(date)
        {
            var t = new Date(date);
            return t.toString();
        }
        else
        {
            return "";
        }
    }

    function createUUID() {
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = "0123456789";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

    function flashCallback(data,success)
    {
        $('#flash .inner.alert').removeClass('alert-error');
        if(!success) $('#flash .inner.alert').addClass('alert-error');

        $('#flash h4').html(data);
        $('#flash').slideDown('fast');
        $('#flash').delay(3000).fadeOut('fast');
    }

String.prototype.splitCSV = function(sep) {
  for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
    if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
      if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
        foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
      } else if (x) {
        foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
      } else foo = foo.shift().split(sep).concat(foo);
    } else foo[x].replace(/""/g, '"');
  } return foo;
};
