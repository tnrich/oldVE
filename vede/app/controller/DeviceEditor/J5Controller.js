/**
 * j5 controller
 * @class Vede.controller.DeviceEditor.J5Controller
 */
Ext.define('Vede.controller.DeviceEditor.J5Controller', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.constants.Constants", "Teselagen.manager.DeviceDesignManager", "Teselagen.utils.J5ControlsUtils", "Teselagen.manager.J5CommunicationManager", "Teselagen.manager.ProjectManager", "Teselagen.bio.parsers.GenbankManager", "Ext.MessageBox"],

    DeviceDesignManager: null,
    J5ControlsUtils: null,

    j5Window: null,
    j5ParamsWindow: null,
    automationParamsWindow: null,

    SEQDATA: "\nLOCUS       pmas00026               5365 bp    dna     circular UNK 26-OCT-2009" +
"\nDEFINITION  promoter seq from pBAD33." +
"\nACCESSION   unknown" +
"\nKEYWORDS    ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ." +
"\nFEATURES             Location/Qualifiers" +
"\n     CDS             complement(7..885)" +
"\n                     /label=araC" +
"\n     protein_bind    914..931" +
"\n                     /label=operator\O2" +
"\n     promoter        complement(1036..1064)" +
"\n                     /label=araC\promoter" +
"\n     protein_bind    1072..1093" +
"\n                     /label=operator\O1" +
"\n     misc_binding    1115..1128" +
"\n                     /label=CAP\site" +
"\n     protein_bind    1124..1162" +
"\n                     /label=Operator\I2\and\I1" +
"\n     promoter        1161..1188" +
"\n                     /label=pBAD\promoter" +
"\n     RBS             1216..1235" +
"\n                     /label=RBS" +
"\n     CDS             1236..2084" +
"\n                     /vntifkey='4'" +
"\n                     /label=GFPuv" +
"\n     misc_feature    1239..1289" +
"\n                     /label=Clostridium_BMC_sig_pep" +
"\n     misc_feature    1290..1337" +
"\n                     /label=gly_ser_linker" +
"\n     misc_feature    1757..1757" +
"\n                     /label=XhoI_silent_mutation" +
"\n     misc_feature    1856..1856" +
"\n                     /label=BamHI_silent_mutation" +
"\n     misc_feature    2049..2081" +
"\n                     /vntifkey='21'" +
"\n                     /label=ssrA\\tag" +
"\n     terminator      2100..2228" +
"\n                     /label=dbl\\term" +
"\n     rep_origin      complement(2230..4458)" +
"\n                     /label=pSC101**" +
"\n     terminator      4459..4564" +
"\n                     /label=T0" +
"\n     misc_marker     complement(4580..5239)" +
"\n                     /label=CmR" +
"\nORIGIN      " +
"\n        1 gacgtcttat gacaacttga cggctacatc attcactttt tcttcacaac cggcacggaa" +
"\n       61 ctcgctcggg ctggccccgg tgcatttttt aaatacccgc gagaaataga gttgatcgtc" +
"\n      121 aaaaccaaca ttgcgaccga cggtggcgat aggcatccgg gtggtgctca aaagcagctt" +
"\n      181 cgcctggctg atacgttggt cctcgcgcca gcttaagacg ctaatcccta actgctggcg" +
"\n      241 gaaaagatgt gacagacgcg acggcgacaa gcaaacatgc tgtgcgacgc tggcgatatc" +
"\n      301 aaaattgctg tctgccaggt gatcgctgat gtactgacaa gcctcgcgta cccgattatc" +
"\n      361 catcggtgga tggagcgact cgttaatcgc ttccatgcgc cgcagtaaca attgctcaag" +
"\n      421 cagatttatc gccagcagct ccgaatagcg cccttcccct tgcccggcgt taatgatttg" +
"\n      481 cccaaacagg tcgctgaaat gcggctggtg cgcttcatcc gggcgaaaga accccgtatt" +
"\n      541 ggcaaatatt gacggccagt taagccattc atgccagtag gcgcgcggac gaaagtaaac" +
"\n      601 ccactggtga taccattcgc gagcctccgg atgacgaccg tagtgatgaa tctctcctgg" +
"\n      661 cgggaacagc aaaatatcac ccggtcggca aacaaattct cgtccctgat ttttcaccac" +
"\n      721 cccctgaccg cgaatggtga gattgagaat ataacctttc attcccagcg gtcggtcgat" +
"\n      781 aaaaaaatcg agataaccgt tggcctcaat cggcgttaaa cccgccacca gatgggcatt" +
"\n      841 aaacgagtat cccggcagca ggggatcatt ttgcgcttca gccatacttt tcatactccc" +
"\n      901 gccattcaga gaagaaacca attgtccata ttgcatcaga cattgccgtc actgcgtctt" +
"\n      961 ttactggctc ttctcgctaa ccaaaccggt aaccccgctt attaaaagca ttctgtaaca" +
"\n     1021 aagcgggacc aaagccatga caaaaacgcg taacaaaagt gtctataatc acggcagaaa" +
"\n     1081 agtccacatt gattatttgc acggcgtcac actttgctat gccatagcat ttttatccat" +
"\n     1141 aagattagcg gattctacct gacgcttttt atcgcaactc tctactgttt ctccataccc" +
"\n     1201 gtttttttgg gaatttttaa gaaggagata tacatatgga aaataacgct ttattagaac" +
"\n     1261 aaataatcaa tgaagtttta aaaaatatgg gtggcagtgg tagcgggagc tcgggtggct" +
"\n     1321 caggctctgg ttccagtaaa ggagaagaac ttttcactgg agttgtccca attcttgttg" +
"\n     1381 aattagatgg tgatgttaat gggcacaaat tttctgtcag tggagagggt gaaggtgatg" +
"\n     1441 caacatacgg aaaacttacc cttaaattta tttgcactac tggaaaacta cctgttccat" +
"\n     1501 ggccaacact tgtcactact ttctcttatg gtgttcaatg cttttcccgt tatccggatc" +
"\n     1561 atatgaaacg gcatgacttt ttcaagagtg ccatgcccga aggttatgta caggaacgca" +
"\n     1621 ctatatcttt caaagatgac gggaactaca agacgcgtgc tgaagtcaag tttgaaggtg" +
"\n     1681 atacccttgt taatcgtatc gagttaaaag gtattgattt taaagaagat ggaaacattc" +
"\n     1741 tcggacacaa actcgaatac aactataact cacacaatgt atacatcacg gcagacaaac" +
"\n     1801 aaaagaatgg aatcaaagct aacttcaaaa ttcgccacaa cattgaagat ggatctgttc" +
"\n     1861 aactagcaga ccattatcaa caaaatactc caattggcga tggccctgtc cttttaccag" +
"\n     1921 acaaccatta cctgtcgaca caatctgccc tttcgaaaga tcccaacgaa aagcgtgacc" +
"\n     1981 acatggtcct tcttgagttt gtaactgctg ctgggattac acatggcatg gatgagctcg" +
"\n     2041 gcggcggcgc ggcgaacgat gaaaactatg cgctggcggc gtaaatcgag taaggatctc" +
"\n     2101 caggcatcaa ataaaacgaa aggctcagtc gaaagactgg gcctttcgtt ttatctgttg" +
"\n     2161 tttgtcggtg aacgctctct actagagtca cactggctca ccttcgggtg ggcctttctg" +
"\n     2221 cgtttatacc tagggtacgg gttttgctgc ccgcaaacgg gctgttctgg tgttgctagt" +
"\n     2281 ttgttatcag aatcgcagat ccggcttcag ccggtttgcc ggctgaaagc gctatttctt" +
"\n     2341 ccagaattgc catgattttt tccccacggg aggcgtcact ggctcccgtg ttgtcggcag" +
"\n     2401 ctttgattcg ataagcagca tcgcctgttt caggctgtct atgtgtgact gttgagctgt" +
"\n     2461 aacaagttgt ctcaggtgtt caatttcatg ttctagttgc tttgttttac tggtttcacc" +
"\n     2521 tgttctatta ggtgttacat gctgttcatc tgttacattg tcgatctgtt catggtgaac" +
"\n     2581 agctttgaat gcaccaaaaa ctcgtaaaag ctctgatgta tctatctttt ttacaccgtt" +
"\n     2641 ttcatctgtg catatggaca gttttccctt tgatatgtaa cggtgaacag ttgttctact" +
"\n     2701 tttgtttgtt agtcttgatg cttcactgat agatacaaga gccataagaa cctcagatcc" +
"\n     2761 ttccgtattt agccagtatg ttctctagtg tggttcgttg tttttgcgtg agccatgaga" +
"\n     2821 acgaaccatt gagatcatac ttactttgca tgtcactcaa aaattttgcc tcaaaactgg" +
"\n     2881 tgagctgaat ttttgcagtt aaagcatcgt gtagtgtttt tcttagtccg ttatgtaggt" +
"\n     2941 aggaatctga tgtaatggtt gttggtattt tgtcaccatt catttttatc tggttgttct" +
"\n     3001 caagttcggt tacgagatcc atttgtctat ctagttcaac ttggaaaatc aacgtatcag" +
"\n     3061 tcgggcggcc tcgcttatca accaccaatt tcatattgct gtaagtgttt aaatctttac" +
"\n     3121 ttattggttt caaaacccat tggttaagcc ttttaaactc atggtagtta ttttcaagca" +
"\n     3181 ttaacatgaa cttaaattca tcaaggctaa tctctatatt tgccttgtga gttttctttt" +
"\n     3241 gtgttagttc ttttaataac cactcataaa tcctcataga gtatttgttt tcaaaagact" +
"\n     3301 taacatgttc cagattatat tttatgaatt tttttaactg gaaaagataa ggcaatatct" +
"\n     3361 cttcactaaa aactaattct aatttttcgc ttgagaactt ggcatagttt gtccactgga" +
"\n     3421 aaatctcaaa gcctttaacc aaaggattcc tgatttccac agttctcgtc atcagctctc" +
"\n     3481 tggttgcttt agctaataca ccataagcat tttccctact gatgttcatc atctgagcgt" +
"\n     3541 attggttata agtgaacgat accgtccgtt ctttccttgt agggttttca atcgtggggt" +
"\n     3601 tgagtagtgc cacacagcat aaaattagct tggtttcatg ctccgttaag tcatagcgac" +
"\n     3661 taatcgctag ttcatttgct ttgaaaacaa ctaattcaga catacatctc aattggtcta" +
"\n     3721 ggtgatttta atcactatac caattgagat gggctagtca atgataatta ctagtccttt" +
"\n     3781 tcccgggtga tctgggtatc tgtaaattct gctagacctt tgctggaaaa cttgtaaatt" +
"\n     3841 ctgctagacc ctctgtaaat tccgctagac ctttgtgtgt tttttttgtt tatattcaag" +
"\n     3901 tggttataat ttatagaata aagaaagaat aaaaaaagat aaaaagaata gatcccagcc" +
"\n     3961 ctgtgtataa ctcactactt tagtcagttc cgcagtatta caaaaggatg tcgcaaacgc" +
"\n     4021 tgtttgctcc tctacaaaac agaccttaaa accctaaagg cttaagtagc accctcgcaa" +
"\n     4081 gctcgggcaa atcgctgaat attccttttg tctccgacca tcaggcacct gagtcgctgt" +
"\n     4141 ctttttcgtg acattcagtt cgctgcgctc acggctctgg cagtgaatgg gggtaaatgg" +
"\n     4201 cactacaggc gccttttatg gattcatgca aggaaactac ccataataca agaaaagccc" +
"\n     4261 gtcacgggct tctcagggcg ttttatggcg ggtctgctat gtggtgctat ctgacttttt" +
"\n     4321 gctgttcagc agttcctgcc ctctgatttt ccagtctgac cacttcggat tatcccgtga" +
"\n     4381 caggtcattc agactggcta atgcacccag taaggcagcg gtatcatcaa caggcttacc" +
"\n     4441 cgtcttactg tccctagtgc ttggattctc accaataaaa aacgcccggc ggcaaccgag" +
"\n     4501 cgttctgaac aaatccagat ggagttctga ggtcattact ggatctatca acaggagtcc" +
"\n     4561 aagcgagctc gatatcaaat tacgccccgc cctgccactc atcgcagtac tgttgtaatt" +
"\n     4621 cattaagcat tctgccgaca tggaagccat cacaaacggc atgatgaacc tgaatcgcca" +
"\n     4681 gcggcatcag caccttgtcg ccttgcgtat aatatttgcc catggtgaaa acgggggcga" +
"\n     4741 agaagttgtc catattggcc acgtttaaat caaaactggt gaaactcacc cagggattgg" +
"\n     4801 ctgagacgaa aaacatattc tcaataaacc ctttagggaa ataggccagg ttttcaccgt" +
"\n     4861 aacacgccac atcttgcgaa tatatgtgta gaaactgccg gaaatcgtcg tggtattcac" +
"\n     4921 tccagagcga tgaaaacgtt tcagtttgct catggaaaac ggtgtaacaa gggtgaacac" +
"\n     4981 tatcccatat caccagctca ccgtctttca ttgccatacg aaattccgga tgagcattca" +
"\n     5041 tcaggcgggc aagaatgtga ataaaggccg gataaaactt gtgcttattt ttctttacgg" +
"\n     5101 tctttaaaaa ggccgtaata tccagctgaa cggtctggtt ataggtacat tgagcaactg" +
"\n     5161 actgaaatgc ctcaaaatgt tctttacgat gccattggga tatatcaacg gtggtatatc" +
"\n     5221 cagtgatttt tttctccatt ttagcttcct tagctcctga aaatctcgat aactcaaaaa" +
"\n     5281 atacgcccgg tagtgatctt atttcattat ggtgaaagtt ggaacctctt acgtgccgat" +
"\n     5341 caacgtctca ttttcgccag atatc" +
"\n\/\/",

    j5Parameters: null,
    j5ParameterFields: [],

    automationParameters: null,
    automationParameterFields: [],

    plasmidsListText: null,
    oligosListText: null,
    directSynthesesListText: null,

    onOpenJ5: function () {
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var currentTabEl = (currentTab.getEl());

        if(!currentTab.j5Window) currentTab.j5Window = Ext.create("Vede.view.de.j5Controls", {renderTo: currentTabEl}).show();
        else currentTab.j5Window.show();
        this.j5Window = currentTab.j5Window;

        var self = this;


        Vede.application.fireEvent("checkj5Ready",function(combinatorial,j5ready){
            if(!j5ready)
            {
                if (currentTab.j5Window) {currentTab.j5Window.close();}

                var messagebox = Ext.MessageBox.show({
                    title: "Alert",
                    msg: "Not ready to run j5",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });

                Ext.Function.defer(function () {
                    messagebox.zIndexManager.bringToFront(messagebox);
                }, 100);
            }

            var store;
            if(combinatorial)
            {
                store = new Ext.data.ArrayStore({
                    fields: ['assemblyMethod'],
                    data : [['Combinatorial Mock Assembly'], ['Combinatorial SLIC/Gibson/CPEC'], ['Combinatorial Golden Gate']]
                });
            }
            else
            {
                store = new Ext.data.ArrayStore({
                    fields: ['assemblyMethod'],
                    data : [['Mock Assembly'], ['SLIC/Gibson/CPEC'], ['Golden Gate']]
                });            }

            var combobox = self.j5Window.down('component[cls="assemblyMethodSelector"]');
            combobox.bindStore(store);
            combobox.setValue(store.first());
        });

    },

    onEditJ5ParamsBtnClick: function () {
        this.j5ParamsWindow = Ext.create("Vede.view.de.j5Parameters").show();

        this.populateJ5ParametersDialog();
    },

    resetDefaultj5Params: function () {
        this.j5Parameters.setDefaultValues();
        this.populateJ5ParametersDialog();
    },

    loadServerj5Params: function(){
        
    },

    resetServerj5Params: function () {

        var loadingMessage = this.createLoadingMessage();

        loadingMessage.update(60, "Executing request");

        var self = this;
        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("GetLastUpdatedUserFiles", ''),
            success: function (response) {
                loadingMessage.update(100, "Completed");
                loadingMessage.close();
                response = JSON.parse(response.responseText);
                self.j5Parameters.loadValues(response.j5parameters);
                self.populateJ5ParametersDialog();
                isCircular = response.j5parameters.ASSEMBLY_PRODUCT_TYPE == 'circular' ? true : false;
                Ext.getCmp('mainAppPanel').getActiveTab().model.getDesign().getJ5Collection().set('isCircular',isCircular);

            },
            failure: function(responseData, opts) {
                loadingMessage.close();
                if(responseData)
                {
                    if(responseData.responseText)
                    {
                        var messagebox = Ext.MessageBox.show({
                            title: "Execution Error",
                            msg: responseData.responseText,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });

                        Ext.Function.defer(function () {
                            messagebox.zIndexManager.bringToFront(messagebox);
                        }, 100);       
                    }
                }
            }
        });
    },

    onj5ParamsCancelBtnClick: function () {
        this.j5ParamsWindow.close();
    },

    onj5ParamsOKBtnClick: function () {
        this.saveJ5Parameters();
        this.j5ParamsWindow.close();
    },

    onCondenseAssemblyFilesSelectorChange: function (me, value) {
        var condenseAssemblyFiles = me.button.fileInputEl.dom;
        var fr = new FileReader();
        me.inputEl.dom.value = this.getFileNameFromField(me);
        var that = this;

        function processCondenseAssemblyFiles() {
            that.condenseAssemblyFilesText = Base64.encode(fr.result);
        }

        fr.onload = processCondenseAssemblyFiles;
        fr.readAsText(condenseAssemblyFiles.files[0]);
    },

    onZippedAssemblyFilesSelectorChange: function (me, value) {
        var zippedAssemblyFiles = me.button.fileInputEl.dom;
        var fr = new FileReader();
        me.inputEl.dom.value = this.getFileNameFromField(me);
        var that = this;

        function processZippedAssemblyFiles() {
            that.zippedPlateFilesSelector = fr.result.replace("data:application/zip;base64,", "");
        }

        fr.onload = processZippedAssemblyFiles;
        fr.readAsDataURL(zippedAssemblyFiles.files[0]);
    },

    onSourcePlateListFileSelectorChange: function (me, value) {
        var sourcePlateFile = me.button.fileInputEl.dom;
        var fr = new FileReader();
        me.inputEl.dom.value = this.getFileNameFromField(me);
        var that = this;

        function processSourcePlateFile() {
            that.sourcePlateFileText = Base64.encode(fr.result);
        }

        fr.onload = processSourcePlateFile;
        fr.readAsText(sourcePlateFile.files[0]);
    },

    onZippedPlateFilesSelectorChange: function (me, value) {
        var zippedPlateFile = me.button.fileInputEl.dom;
        var fr = new FileReader();
        me.inputEl.dom.value = this.getFileNameFromField(me);
        var that = this;

        function processZippedPlateFile() {
            that.zippedPlateFilesSelector = fr.result.replace("data:application/zip;base64,", "");
        }

        fr.onload = processZippedPlateFile;
        fr.readAsDataURL(zippedPlateFile.files[0]);
    },

    onAssemblyFileSelectorChange: function (me, value) {
        var assemblyFileSelector = me.button.fileInputEl.dom;
        var fr = new FileReader();
        me.inputEl.dom.value = this.getFileNameFromField(me);
        var that = this;

        function processAssemblyFileSelector() {
            that.assemblyFileText = Base64.encode(fr.result);
        }

        fr.onload = processAssemblyFileSelector;
        fr.readAsText(assemblyFileSelector.files[0]);
    },

    onUseServerPlasmidsRadioBtnChange: function (e) {
        // We only want to reset the file field if we are checking the radio button.
        if(e.getValue()) {
            currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
            currentTab.j5Window.down("component[cls='plasmidsListFileSelector']").reset();
        }
    },

    onUseEmptyPlasmidsRadioBtnChange: function (e) {
        if(e.getValue()) {
            currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
            currentTab.j5Window.down("component[cls='plasmidsListFileSelector']").reset();
        }
    },

    onPlasmidsListFileSelectorChange: function (me, value) {
        currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var plasmidsFile = me.button.fileInputEl.dom;
        var fr = new FileReader();

        currentTab.j5Window.down("radio[cls='useServerPlasmidsRadioBtn']").setValue(false);
        currentTab.j5Window.down("radio[cls='useEmptyPlasmidsRadioBtn']").setValue(false);

        me.inputEl.dom.value = this.getFileNameFromField(me);

        var that = this;

        function processPlasmidsFile() {
            var result = fr.result;
            var linesArray = result.split(/\n/);
            var headerFields = linesArray[0].split(/,\s*/);

            if(headerFields.length != 5 || headerFields[0] != "Plasmid Name" || headerFields[1] != "Alias" || headerFields[2] != "Contents" || headerFields[3] != "Length" || headerFields[4] != "Sequence") {

                alert("Invalid headers in master plasmids list file.\n" + "Please check the formatting of the file.");

                that.plasmidsListText = null;
            } else {
                that.plasmidsListText = result;
            }
        }

        fr.onload = processPlasmidsFile;
        fr.readAsText(plasmidsFile.files[0]);

    },

    onUseServerOligosRadioBtnChange: function (e) {
        if(e.getValue()) {
            currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
            currentTab.j5Window.down("component[cls='oligosListFileSelector']").reset();
        }
    },

    onUseEmptyOligosRadioBtnChange: function (e) {
        if(e.getValue()) {
            currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
            currentTab.j5Window.down("component[cls='oligosListFileSelector']").reset();
        }
    },

    onOligosListFileSelectorChange: function (me) {
        currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var oligosFile = me.button.fileInputEl.dom;
        var fr = new FileReader();

        currentTab.j5Window.down("radio[cls='useServerOligosRadioBtn']").setValue(false);
        currentTab.j5Window.down("radio[cls='useEmptyOligosRadioBtn']").setValue(false);

        me.inputEl.dom.value = this.getFileNameFromField(me);

        function processOligosFile() {
            var result = fr.result;
            var linesArray = result.split(/\n/);
            var headerFields = linesArray[0].split(/,\s*/);

            if(headerFields.length != 5 || (headerFields[0] != "Oligo Name" && headerFields[0] != "Oigo Name") || //accounting for typo in example file
            headerFields[1] != "Length" || headerFields[2] != "Tm" || headerFields[3] != "Tm (3' only)" || headerFields[4] != "Sequence") {

                alert("Invalid headers in master oligos list file.\n" + "Please check the formatting of the file.");

                this.oligosListText = null;
            } else {
                this.oligosListText = result;
            }
        }

        fr.onload = processOligosFile;
        fr.readAsText(oligosFile.files[0]);
    },

    onUseServerSynthesesRadioBtnChange: function (e) {
        if(e.getValue()) {
            currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
            currentTab.j5Window.down("component[cls='directSynthesesFileSelector']").reset();
        }
    },

    onUseEmptySynthesesRadioBtnChange: function (e) {
        if(e.getValue()) {
            currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
            currentTab.j5Window.down("component[cls='directSynthesesFileSelector']").reset();
        }
    },

    onDirectSynthesesFileSelectorChange: function (me) {
        currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var synthesesFile = me.button.fileInputEl.dom;
        var fr = new FileReader();

        currentTab.j5Window.down("radio[cls='useServerSynthesesRadioBtn']").setValue(false);
        currentTab.j5Window.down("radio[cls='useEmptySynthesesRadioBtn']").setValue(false);

        me.inputEl.dom.value = this.getFileNameFromField(me);

        function processSynthesesFile() {
            var result = fr.result;
            var linesArray = result.split(/\n/);
            var headerFields = linesArray[0].split(/,\s*/);

            if(headerFields.length != 5 || headerFields[0] != "Direct Synthesis Name" || headerFields[1] != "Alias" || headerFields[2] != "Contents" || headerFields[3] != "Length" || headerFields[4] != "Sequence") {

                alert("Invalid headers in master syntheses list file.\n" + "Please check the formatting of the file.");

                this.directSynthesesListText = null;
            } else {
                this.directSynthesesListText = result;
            }
        }

        fr.onload = processSynthesesFile;
        fr.readAsText(synthesesFile.files[0]);
    },

    onCustomizeAutomationParamsBtnClick: function () {
        this.automationParamsWindow = Ext.create("Vede.view.de.j5AutomationParameters").show();
        this.populateAutomationParametersDialog();
    },

    onResetAutomationParamsBtnClick: function () {
        this.automationParameters.setDefaultValues();
        this.populateAutomationParametersDialog();
    },
    populateAutomationParametersDialog: function () {
        currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        this.automationParameters.fields.eachKey(function (key) {
            console.log(key);
            if(key !== "id" && key !== "j5run_id") {
                currentTab.j5Window.down("component[cls='" + key + "']").setValue(
                this.automationParameters.get(key));
            }
        }, this);
    },

    saveAutomationParams: function () {
        currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        this.automationParameters.fields.eachKey(function (key) {
            if(key !== "id" && key !== "j5run_id") {
                this.automationParameters.set(key, currentTab.j5Window.down("component[cls='" + key + "']").getValue());
            }
        }, this);
    },

    abortJ5Run: function () {
        Ext.Function.defer(function () {
            Ext.Ajax.abort();
        }, 100);

    },

    createLoadingMessage: function () {
        var msgBox = Ext.MessageBox.show({
            title: 'Please wait',
            msg: 'Preparing input parameters',
            progressText: 'Initializing...',
            width: 300,
            progress: true,
            closable: false
        });

        return {
            close: function () {
                msgBox.close();
            },
            update: function (progress, msg) {
                msgBox.updateProgress(progress / 100, progress + '% completed', msg);
            }
        };
    },



    onRunJ5BtnClick: function (btn) {
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var loadingMessage = currentTab.j5Window.down('container[cls="j5progressContainer"]').show();
        var responseMessage = currentTab.j5Window.down('displayfield[cls="j5ResponseTextField"]').show();

        var self = this;
        var masterPlasmidsList;
        var masterPlasmidsListFileName;

        var masterOligosList;
        var masterOligosListFileName;

        var masterDirectSynthesesList;
        var masterDirectSynthesesListFileName;

        if(currentTab.j5Window.down("radio[cls='useServerPlasmidsRadioBtn']").getValue()) {
            masterPlasmidsList = "";
            masterPlasmidsListFileName = "";
        } else if(currentTab.j5Window.down("radio[cls='useEmptyPlasmidsRadioBtn']").getValue()) {
            masterPlasmidsList = this.J5ControlsUtils.generateEmptyPlasmidsList();
            masterPlasmidsListFileName = "j5_plasmids.csv";
        } else {
            masterPlasmidsList = this.plasmidsListText;
            masterPlasmidsListFileName = this.getFileNameFromField(
            currentTab.j5Window.down("component[cls='plasmidsListFileSelector']"));
        }

        if(currentTab.j5Window.down("radio[cls='useServerOligosRadioBtn']").getValue()) {
            masterOligosList = "";
            masterOligosListFileName = "";
        } else if(currentTab.j5Window.down("radio[cls='useEmptyOligosRadioBtn']").getValue()) {
            masterOligosList = this.J5ControlsUtils.generateEmptyOligosList();
            masterOligosListFileName = "j5_oligos.csv";
        } else {
            masterOligosList = this.plasmidsListText;
            masterOligosListFileName = this.getFileNameFromField(
            currentTab.j5Window.down("component[cls='oligosListFileSelector']"));
        }

        if(currentTab.j5Window.down("radio[cls='useServerSynthesesRadioBtn']").getValue()) {
            masterDirectSynthesesList = "";
            masterDirectSynthesesListFileName = "";
        } else if(currentTab.j5Window.down("radio[cls='useEmptySynthesesRadioBtn']").getValue()) {
            masterDirectSynthesesList = this.J5ControlsUtils.generateEmptyDirectSynthesesList();
            masterDirectSynthesesListFileName = "j5_directsyntheses.csv";
        } else {
            masterDirectSynthesesList = this.plasmidsListText;
            masterDirectSynthesesListFileName = this.getFileNameFromField(
            currentTab.j5Window.down("component[cls='directSynthesesFileSelector']"));
        }

        var masterFiles = {};
        masterFiles["masterPlasmidsList"] = Base64.encode(masterPlasmidsList);
        masterFiles["masterPlasmidsListFileName"] = masterPlasmidsListFileName;
        masterFiles["masterOligosList"] = Base64.encode(masterOligosList);
        masterFiles["masterOligosListFileName"] = masterOligosListFileName;
        masterFiles["masterDirectSynthesesList"] = Base64.encode(masterDirectSynthesesList);
        masterFiles["masterDirectSynthesesListFileName"] = masterDirectSynthesesListFileName;

        var assemblyMethod = currentTab.j5Window.down("component[cls='assemblyMethodSelector']").getValue()

        if(assemblyMethod == "Mock Assembly") assemblyMethod = "Mock";
        if(assemblyMethod == "SLIC/Gibson/CPEC") assemblyMethod = "SLIC/Gibson/CPEC";
        if(assemblyMethod == "Golden Gate") assemblyMethod = "GoldenGate";

        if(assemblyMethod == "Combinatorial Mock Assembly") assemblyMethod = "CombinatorialMock";
        if(assemblyMethod == "Combinatorial SLIC/Gibson/CPEC") assemblyMethod = "CombinatorialSLICGibsonCPEC";
        if(assemblyMethod == "Combinatorial Golden Gate") assemblyMethod = "CombinatorialGoldenGate";

        currentTab.j5Window.j5comm = Teselagen.manager.J5CommunicationManager;
        currentTab.j5Window.j5comm.setParameters(this.j5Parameters, masterFiles, assemblyMethod);

        responseMessage.setValue("Saving design");

        Vede.application.fireEvent("saveDesignEvent", function () {
            responseMessage.setValue("Executing j5 Run...Please wait...");
            currentTab.j5Window.j5comm.generateAjaxRequest(function (success, responseData, warnings) {
                if(success) {
                    responseMessage.setValue("Completed");
                    loadingMessage.hide();
                    responseMessage.hide();
                    if(warnings.length > 0)
                    {
                        msgWarnings = "";
                        for(var index in warnings)
                        {
                            msgWarnings += "<div class='warning-wrap'><div class='warning-note'></div>"+ "<div class='warning-text'>" + warnings[index].message +"</div></div>";
                        }
                        alertbox = Ext.MessageBox.alert('Warnings', msgWarnings);
                        Ext.Function.defer(function () {
                            alertbox.zIndexManager.bringToFront(alertbox);
                        }, 100);
                    }
                } else {

                    loadingMessage.hide();
                    responseMessage.hide();
                    var messagebox = Ext.MessageBox.show({
                        title: "Execution Error",
                        msg: responseData.responseText,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });

                    Ext.Function.defer(function () {
                        messagebox.zIndexManager.bringToFront(messagebox);
                    }, 100);
                }
            });
        });
    },

    onDistributePCRBtn: function () {

        console.log("Distribute PCR Reactions");
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        currentTab.j5Window.j5comm = Teselagen.manager.J5CommunicationManager;

        data = {};
        data.sourcePlateFileText = this.sourcePlateFileText;
        data.zippedPlateFilesSelector = this.zippedPlateFilesSelector;
        data.assemblyFileText = this.assemblyFileText;
        data.params = this.automationParameters.data;
        data.reuse = currentTab.j5Window.down("component[name='automationParamsFileSource']").getValue();

        var loadingMessage = this.createLoadingMessage();

        loadingMessage.update(60, "Executing request");
        currentTab.j5Window.j5comm.distributePCRRequest(data, function (success, responseData) {
            if(success) {
                loadingMessage.update(100, "Completed");
                loadingMessage.close();
            } else {
                console.log(responseData.responseText);
                loadingMessage.close();
                var messagebox = Ext.MessageBox.show({
                    title: "Execution Error",
                    msg: responseData.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });

                Ext.Function.defer(function () {
                    messagebox.zIndexManager.bringToFront(messagebox);
                }, 100);
            }
        });

    },

    /**
     * Given a field Component, returns the name of the file selected,
     * filtering out the directory information.
     *
     * TODO: maybe move to a utils file so we can set the display value to this
     * whenever the onchange event of a file input field is fired? This would
     * prevent the 'fakepath' directory from showing up on some browsers.
     */
    getFileNameFromField: function (field) {
        var rawValue = field.getValue();
        var fileName;

        if(rawValue.indexOf("\\") != -1) {
            fileName = rawValue.substr(rawValue.lastIndexOf("\\") + 1);
        } else if(rawValue.indexOf("/") != -1) {
            fileName = rawValue.substr(rawValue.lastIndexOf("/") + 1);
        } else {
            fileName = rawValue;
        }

        return fileName;
    },

    onLoadAssemblyBtnClick: function () {},

    onAutomationParamsCancelClick: function () {
        this.automationParamsWindow.close();
    },

    onAutomationParamsOKClick: function () {
        this.saveAutomationParams();
        this.automationParamsWindow.close();
    },

    populateJ5ParametersDialog: function () {
        this.j5Parameters.fields.eachKey(function (key) {
            if(key !== "id" && key !== "j5run_id") {
                Ext.ComponentQuery.query("component[cls='" + key + "']")[0].setValue(
                this.j5Parameters.get(key));
            }
        }, this);
    },

    saveJ5Parameters: function () {
        this.j5Parameters.fields.eachKey(function (key) {
            if(key !== "id" && key !== "j5run_id") {
                this.j5Parameters.set(key, Ext.ComponentQuery.query("component[cls='" + key + "']")[0].getValue());
            }
        }, this);
    },
    onDownloadj5Btn: function (button, e, options) {
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        currentTab.j5Window.j5comm.downloadResults(button);
    },

    onDownloadDownstreamAutomationBtn: function (button, e, options) {
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        currentTab.j5Window.j5comm.downloadDownstreamAutomationResults(button);
    },

    onPlasmidsItemClick: function (grid, record) {
        var DETab = Ext.getCmp("mainAppPanel").getActiveTab();
        var j5Window = DETab.j5Window;
        var mask = new Ext.LoadMask(j5Window);

        mask.setVisible(true, false);

        // Javascript waits to render the loading mask until after the call to
        // openSequence, so we force it to wait a millisecond before calling
        // to give it time to render the loading mask.
        Ext.defer(function() {
            var newSequence = Teselagen.manager.DeviceDesignManager.createSequenceFileStandAlone("GENBANK", this.SEQDATA, "tester", "");
            Teselagen.manager.ProjectManager.openSequence(newSequence);

            mask.setVisible(false);

            // This gets rid of the weird bug where the loading mask remains on
            // the mainAppPanel.
            Ext.getCmp("mainAppPanel").setLoading();
            Ext.getCmp("mainAppPanel").setLoading(false);

            // Showing and hiding the loading mask on the mainAppPanel removes
            // the modal mask which prevented the user from interacting with the
            // Device Editor panel behind the modal j5Window, so re-display the
            // j5Window.
            j5Window.hide();
            j5Window.show();
        }, 10, this);

        // Re-displaying the j5Window messes up its layout for some reason, and
        // calling doLayout fixes it, but only when we are on its parent tab. So
        // add an event handler to call doLayout on the j5Window when we have
        // switched to its parent tab.
        var refreshJ5Window = function(mainAppPanel, newTab, oldTab) {
            if(newTab === DETab) {
                j5Window.doLayout();
                mainAppPanel.un("tabchange", refreshJ5Window);
            }
        };

        Ext.getCmp("mainAppPanel").on("tabchange", refreshJ5Window, this);
    },

    onCondenseAssembliesBtnClick: function (btn) {

        console.log("Condense Assembly Files");
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        currentTab.j5Window.j5comm = Teselagen.manager.J5CommunicationManager;

        condenseParams = {};
        condenseParams["assemblyFiles"] = {};
        condenseParams["assemblyFiles"]["name"] = this.getFileNameFromField(
        currentTab.j5Window.down("component[cls='condenseAssemblyFilesSelector']"));
        condenseParams["assemblyFiles"]["content"] = this.condenseAssemblyFilesText;

        condenseParams["zippedFiles"] = {};
        condenseParams["zippedFiles"]["name"] = this.getFileNameFromField(
        currentTab.j5Window.down("component[cls='zippedAssemblyFilesSelector']"));
        condenseParams["zippedFiles"]["content"] = this.zippedPlateFilesSelector;

        var loadingMessage = this.createLoadingMessage();

        loadingMessage.update(60, "Executing request");
        currentTab.j5Window.j5comm.condenseAssemblyFiles(condenseParams, function (success, responseData) {
            if(success) {
                loadingMessage.update(100, "Completed");
                loadingMessage.close();
            } else {
                console.log(responseData.responseText);
                loadingMessage.close();
                var messagebox = Ext.MessageBox.show({
                    title: "Execution Error",
                    msg: responseData.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });

                Ext.Function.defer(function () {
                    messagebox.zIndexManager.bringToFront(messagebox);
                }, 100);
            }
        });

    },

    onDownloadCondenseAssemblyResultsBtnClick: function(button){
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        currentTab.j5Window.j5comm.downloadCondenseAssemblyResults(button);
 
    },

    init: function () {
        this.control({
            "button[cls='editj5ParamsBtn']": {
                click: this.onEditJ5ParamsBtnClick
            },
            "button[cls='resetj5DefaultParamsBtn']": {
                click: this.resetDefaultj5Params
            },
            "button[cls='resetj5ServerParamsBtn']": {
                click: this.resetServerj5Params
            },
            "button[cls='j5ParamsCancelBtn']": {
                click: this.onj5ParamsCancelBtnClick
            },
            "button[cls='j5ParamsOKBtn']": {
                click: this.onj5ParamsOKBtnClick
            },
            "radio[cls='useServerPlasmidsRadioBtn']": {
                change: this.onUseServerPlasmidsRadioBtnChange
            },
            "radio[cls='useEmptyPlasmidsRadioBtn']": {
                change: this.onUseEmptyPlasmidsRadioBtnChange
            },
            "component[cls='plasmidsListFileSelector']": {
                change: this.onPlasmidsListFileSelectorChange
            },
            "radio[cls='useServerOligosRadioBtn']": {
                change: this.onUseServerOligosRadioBtnChange
            },
            "radio[cls='useEmptyOligosRadioBtn']": {
                change: this.onUseEmptyOligosRadioBtnChange
            },
            "component[cls='oligosListFileSelector']": {
                change: this.onOligosListFileSelectorChange
            },
            "radio[cls='useServerSynthesesRadioBtn']": {
                change: this.onUseServerSynthesesRadioBtnChange
            },
            "radio[cls='useEmptySynthesesRadioBtn']": {
                change: this.onUseEmptySynthesesRadioBtnChange
            },
            "component[cls='directSynthesesFileSelector']": {
                change: this.onDirectSynthesesFileSelectorChange
            },
            "button[cls='customizeAutomationParamsBtn']": {
                click: this.onCustomizeAutomationParamsBtnClick
            },
            "button[cls='runj5Btn']": {
                click: this.onRunJ5BtnClick
            },
            "button[cls='loadAssemblyBtn']": {
                click: this.onLoadAssemblyBtnClick
            },
            "button[cls='automationParamsCancelBtn']": {
                click: this.onAutomationParamsCancelClick
            },
            "button[cls='automationParamsOKBtn']": {
                click: this.onAutomationParamsOKClick
            },
            "button[cls='automationParamsResetBtn']": {
                click: this.onResetAutomationParamsBtnClick
            },
            "button[cls='downloadj5Btn']": {
                click: this.onDownloadj5Btn
            },
            "button[cls='downloadDownstreamAutomationBtn']": {
                click: this.onDownloadDownstreamAutomationBtn
            },
            "component[cls='sourcePlateListSelector']": {
                change: this.onSourcePlateListFileSelectorChange
            },
            "component[cls='zippedPlateFilesSelector']": {
                change: this.onZippedPlateFilesSelectorChange
            },
            "component[cls='assemblyFileSelector']": {
                change: this.onAssemblyFileSelectorChange
            },
            "button[cls='distributePCRBtn']": {
                click: this.onDistributePCRBtn
            },
            "gridpanel[title=Plasmids]": {
                itemclick: this.onPlasmidsItemClick
            },
            "button[cls='condenseAssembliesBtn']": {
                click: this.onCondenseAssembliesBtnClick
            },
            "component[cls='condenseAssemblyFilesSelector']": {
                change: this.onCondenseAssemblyFilesSelectorChange
            },
            "component[cls='zippedAssemblyFilesSelector']": {
                change: this.onZippedAssemblyFilesSelectorChange
            },
            "button[cls='downloadCondenseAssemblyResultsBtn']": {
                click: this.onDownloadCondenseAssemblyResultsBtnClick
            },
            "button[cls='stopj5runBtn']": {
                click: this.abortJ5Run
            }
        });
        
        this.application.on("openj5", this.onOpenJ5, this);

        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;
        this.J5ControlsUtils = Teselagen.utils.J5ControlsUtils;

        this.j5Parameters = Ext.create("Teselagen.models.J5Parameters");
        this.j5Parameters.setDefaultValues();

        this.automationParameters = Ext.create("Teselagen.models.DownstreamAutomationParameters");
        this.automationParameters.setDefaultValues();
    }
});
