/*globals Ext, Teselagen, XmlToJson, DNATools*/
/**
 *
 * @class Teselagen.bio.parsers.ParsersManager
 *
 * DW: NOTE NOT ALL HAVE BEEN TESTED THOROUGHLY
 *
 * This class has file conversions between FASTA, GenBank, JbeiSeqXML/JbeiSeqJSON, and SBOL XML/JSON.
 *
 * Contains some helper functions such as todayDate() and isALabel().
 *
 * The JbeiSeqJSON structure is the central structure to conver between GenBank, JbeiSeqXml, and SBOLXML.
 *
 * FASTA/GenBank:
 *      FASTA <--> Genbank
 *
 * JbeiSeq/Genbank: (Calls methods from {@link Teselagen.bio.parsers.JbeiseqParser})
 *      jbeiseqXMLs (more than one) --> ArrayList<jbeiseqXml>
 *      jbeiseqXML <--> jbeiseqJSON <--> Genbank
 *
 * SBOL/JbeiSeq: (Calls methods from {@link Teselagen.bio.parsers.SbolParser})
 *      sbolXML <--> sbolJSON <--> jbeiJSON
 *
 * @author Diana Wong
 */

Ext.define("Teselagen.bio.parsers.ParsersManager", {
    requires: [

        "Teselagen.bio.util.XmlToJson",
        "Teselagen.bio.util.StringUtil",
        "Teselagen.bio.util.Sha256",

        "Teselagen.bio.parsers.Genbank",
            "Teselagen.bio.parsers.GenbankLocusKeyword",
            "Teselagen.bio.parsers.GenbankOriginKeyword",
            "Teselagen.bio.parsers.SbolParser",
            "Teselagen.bio.parsers.JbeiseqParser",
            "Teselagen.bio.sequence.DNATools",

        "Teselagen.utils.NameUtils",

        "Ext.Ajax",
            "Ext.data.Store",
            "Ext.data.XmlStore",
            "Ext.data.reader.Xml",

        "Ext.ux.CheckColumn"
    ],

    singleton: true,


    batchImportQueue: [],
    batchImportMessages: null,
    processingBusy: false,
    startCount: 0,
    progressIncrement: 0,

    processQueue: function(callback){
        var processArray = function (process, context, callback){
            setTimeout(function(){

                context.args = arguments.callee;
                context.cb = callback;

                process(Teselagen.bio.parsers.ParsersManager.batchImportQueue.shift(),context,function(err,self){
                    if (Teselagen.bio.parsers.ParsersManager.batchImportQueue.length > 0){
                        setTimeout(self.args, 200);

                    } else {

                        context.cb();
                    }
                });

            }, 200);

        };

        //Setup batch import summary messages
        this.batchImportMessages = Ext.create("Ext.data.Store", {
            fields: [
                {name: 'fileName', type: 'string'},
                {name: 'partSource', type: 'string'},
                {name: 'messages', type: 'auto'}
            ]
        });

        var self = this;
        if(!self.processingBusy)
        {
            self.processingBusy = true;
            processArray(this.parseAndImportFile, self, function(){
                var progressBar = $("#headerProgress");
                $("#headerProgressText").html("Done!");
                $("#headerProgressBox").hide();
                progressBar.css("width","0%");
                var msg = toastr.success("Successfully Imported Sequences.");

                self.processingBusy = false;

                callback(self.batchImportMessages);
            });
        }
    },


    /*
        INPUT: File -> From File API
        CONTEXT: this from anywhere
        CB: CB Returns (err,context)
    */
    parseAndImportFile: function(file,context,cb) {
        if(!file) return cb(true);

        var self = Teselagen.bio.parsers.ParsersManager;

        var match = file.name.match(/^.*\.(genbank|gb|fas|fasta|xml|json|rdf)$/i);
        if(match&&match[1]) { var ext = match[1]; }
        else return cb(true,context);

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {

                var data = e.target.result;
                var name = theFile.name.match(/(.*)\.[^.]+$/)[1];

                var progressBar = $("#headerProgress");
                $("#headerProgressText").html("Importing "+ name);

                context.startCount = context.startCount+context.progressIncrement;
                progressBar.css("width", context.startCount+'%');

                self.parseSequence(data, ext, function(gb) {
                    if(!gb) return cb(true,context); // If no gb then parsing failed.
                    if(!(gb instanceof Array)) gb = [gb];  // gb can be or not an array, we will enforce being an array

                    // Processing for each gb received.
                    var counter = gb.length;
                    if(counter === 0) cb(false,context)

                    gb.forEach(function(currentGB){
                        self.createAndProcessSequenceFromGenbank(currentGB,name,function(err,sequence,seqMgr,gb){

                            if(err) { console.warn("Sequence: "+sequence.get('name')+' failed to import'); cb(true);}

                            self.saveSequence(sequence,name,ext,seqMgr,gb,function(err){
                                counter--;
                                if(counter===0) return cb(err,context);
                            });
                        });
                    });


                });


            };
        })(file);

        reader.readAsText(file);

    },

    createAndProcessSequenceFromGenbank: function(currentGB,name,cb){
        var NameUtils = Teselagen.utils.NameUtils;
        var legalName = true;

        if(!NameUtils.isLegalName(name)) {
            legalName = false;
            name = NameUtils.reformatName(name);
        }

        var self = this;
        var sequenceLibrary = Ext.getCmp("sequenceLibrary");

        if(sequenceLibrary.el) {
            sequenceLibrary.el.unmask();
        }

        var sequence = Ext.create("Teselagen.models.SequenceFile", {
            sequenceFileContent: currentGB,
            sequenceFileFormat: "GENBANK",
            name: currentGB.getLocus().locusName,
            sequenceFileName: name,
            firstTimeImported: true
        });

        try {
            sequence.processSequence(function(err,seqMgr,gb){
                if(!legalName) {
                    seqMgr.addParseMessage('Invalid file name. Illegal characters replaced with \'_\'.');
                }

                return cb(false,sequence,seqMgr,gb);
            },null);
        }
        catch(err)
        {
            console.warn(err.toString());
            return cb(true,sequence,null,null);
        }
    },

    saveSequence: function (sequence,name,ext,seqMgr,genbankObject,cb) {
        var self = Teselagen.bio.parsers.ParsersManager;
        var partSource = genbankObject.getLocus().locusName;

        // Aggregate parse messages/warnings from the genbank
        // and sequence manager objects to display in the
        // import warnings window.
        if(genbankObject && seqMgr) {
            var messages = genbankObject.getMessages().concat(seqMgr.getParseMessages());

            self.batchImportMessages.add({
                fileName: name + '.' + ext,
                partSource: partSource,
                messages: messages
            });
        }

        sequence.save({
            success: function(){
                seqMgr = null;
                sequence.sequenceManager = null;

                var duplicated = JSON.parse(arguments[1].response.responseText).duplicated;
                if(!duplicated)
                {
                    Ext.getCmp("sequenceLibrary").down('pagingtoolbar').doRefresh();
                    return cb(false);
                }
                else
                {
                    var msg = toastr.warning("Error: Duplicated Sequence");

                    var duplicateFileName = JSON.parse(arguments[1].response.responseText).sequences.sequenceFileName;
                    var duplicateSequenceName = JSON.parse(arguments[1].response.responseText).sequences.serialize.inData.name;

                    var duplicateMessage = 'Exact sequence already exists in library with' +
                                           ' filename ' + duplicateFileName;

                    var messageIndex = self.batchImportMessages.findBy(function(record) {
                        var messages = record.get('messages');

                        for(var i = 0; i < messages.length; i++) {
                            if(messages[i] === duplicateMessage) {
                                return false;
                            }
                        }

                        return record.get('fileName') === (name + '.' + ext) &&
                               record.get('partSource') === partSource;
                    });

                    if(messageIndex < 0) {
                        self.batchImportMessages.add({
                            fileName: name + '.' + ext,
                            partSource: partSource,
                            messages: [duplicateMessage]
                        });
                    } else {
                        var record = self.batchImportMessages.getAt(messageIndex);
                        record.set('partSource', partSource);
                        record.set('messages',
                            record.get('messages').concat([duplicateMessage]));
                    }

                    return cb(false);
               }
            },
            failure: function(){
                self.batchImportMessages.add({
                    fileName: name + '.' + ext,
                    partSource: partSource,
                    messages: "Failed to upload due to network error. Please try again."
                });

                return cb(true);
            }
        });
    },

    /**
     * @member Teselagen.bio.parsers.ParsersManager
     */
    constructor: function() {
        XmlToJson = Teselagen.bio.util.XmlToJson;
        DNATools = Teselagen.bio.sequence.DNATools;
        SbolParser = Teselagen.bio.parsers.SbolParser;
        Sha256 = Teselagen.bio.util.Sha256;
    },

    detectXMLFormat: function(data, cb) {

        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(data, "text/xml");
        var diff = xmlDoc.getElementsByTagNameNS("*", "seq");
        if (diff.length > 0) {
            // JBEI-SEQ
            return cb(data, false);
        } else {
            // SBOL
            Teselagen.bio.parsers.SbolParser.parse(data, cb);
        }
    },

    parseSequence: function(result, pExt, cb) {

        var self = this;
        var asyncParseFlag = false;

        switch (pExt) {
            case "fasta":
                asyncParseFlag = true;
                fileContent = Teselagen.bio.parsers.ParsersManager.fastaToGenbank(result,function(gbs){
                    // FAS may return an array of genbanks !
                    return cb(gbs);
                });
                break;
            case "fas":
                asyncParseFlag = true;
                fileContent = Teselagen.bio.parsers.ParsersManager.fastaToGenbank(result,function(gbs){
                    // FAS may return an array of genbanks !
                    return cb(gbs);
                });
                break;
            case "json":
                fileContent = Teselagen.bio.parsers.ParsersManager.jbeiseqJsonToGenbank(result).toString();
                break;
            case "gb":
                fileContent = result;
                break;
            case "xml":
                asyncParseFlag = true;
                fileContent = self.detectXMLFormat(result, function(pGB, isSBOL) {
                    var gb;
                    if (isSBOL) gb = Teselagen.utils.FormatUtils.fileToGenbank(pGB, "gb");
                    else gb = Teselagen.utils.FormatUtils.fileToGenbank(pGB, "xml");
                    return cb(gb);
                });
                break;
            case "rdf":
                asyncParseFlag = true;
                fileContent = self.detectXMLFormat(result, function(pGB, isSBOL) {
                    var gb;
                    if (isSBOL) gb = Teselagen.utils.FormatUtils.fileToGenbank(pGB, "gb");
                    else gb = Teselagen.utils.FormatUtils.fileToGenbank(pGB, "xml");
                    return cb(gb);
                });
                break;
        }

        if (!asyncParseFlag) {
            var gb = Teselagen.utils.FormatUtils.fileToGenbank(result, pExt);
            return cb(gb);;
        }
    },

    // ===========================================================================
    //  Fasta & Genbank Conversions
    // ===========================================================================

    /**
     * Converts a FASTA file into a Genbank form of the data.
     * @param {String} pFasta FASTA formated string
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     */
    fastaToGenbank: function(pFasta,cb) {
        var result; // original wants this to be a FeaturedDNASequence NOT SeqMgr!

        var headers = pFasta.match(/>(.+)/g);
        var sequences = [];

        headers.forEach(function(header){
            var escapedHeader = header.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            var match = pFasta.match(escapedHeader + '\n([\s\w]+)>?');
            var sequenceContent = "";

            if(match) {
                sequenceContent = match[1];
            }

            sequences.push({
                name : header.replace(">",""),
                sequence: sequenceContent
            });
        })

        // Single Entry case - No Callback (Sync) - No popup
        if(sequences.length === 1 && typeof(cb)!=="function")
        {
            var sequence = sequences[0];
            var isLegalName = true;

            if(!Teselagen.utils.NameUtils.isLegalName(sequence.name)) {
                isLegalName = false;
                sequence.name = Teselagen.utils.NameUtils.reformatName(sequence.name);
            }

            var locus = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
                locusName: sequence.name,
                sequenceLength: sequence.sequence.length,
                date: Teselagen.bio.parsers.ParsersManager.todayDate()
            });

            var origin = Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword", {
                sequence: sequence.sequence
            });

            result = Ext.create("Teselagen.bio.parsers.Genbank", {});

            result.addKeyword(locus);
            result.addKeyword(origin);

            if(!isLegalName) {
                result.addMessage('Invalid locus name. Illegal characters replaced with \'_\'.');
            }

            return result;
        }

        var performImportSequence = function(sequence){
            var locus = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
                locusName: sequence.name,
                sequenceLength: sequence.sequence.length,
                date: Teselagen.bio.parsers.ParsersManager.todayDate()
            });

            var origin = Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword", {
                sequence: sequence.sequence
            });

            result = Ext.create("Teselagen.bio.parsers.Genbank", {});

            result.addKeyword(locus);
            result.addKeyword(origin);

            return cb(result);
        };

            var generate = function(selectedSequences){
                var returnSequences = [];

                selectedSequences.forEach(function(seq){
                    var locus = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
                        locusName: seq.get('name'),
                        sequenceLength: seq.get('sequence').length,
                        date: Teselagen.bio.parsers.ParsersManager.todayDate()
                    });

                    var origin = Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword", {
                        sequence: seq.get('sequence')
                    });

                    result = Ext.create("Teselagen.bio.parsers.Genbank", {});

                    result.addKeyword(locus);
                    result.addKeyword(origin);

                    returnSequences.push(result);
                });

                if(typeof(cb==="function")) return cb(returnSequences);
                else if(returnSequences.length === 1) return returnSequences[0];
                else return returnSequences;
            };

            var tempStore = new Ext.data.JsonStore({
                  fields: [
                      {name:'name',type:'string'},
                      {name: 'sequence', type:'string'}
                ],
                  data: sequences
              });

        if(sequences.length>1)
        {


            var win = Ext.create("Ext.window.Window", {
                title: "Select sequence to import",
                shrinkWrap: true,
                closable: false,
                width: 600,
                height: 300,
                items:[{
                    xtype: 'grid',
                    store: tempStore,
                    forceFit: true,
                    columns: [
                        {header: 'name', dataIndex: 'name'},
                        {header: 'sequence', dataIndex: 'sequence'}
                    ],
                    selModel: {
                        selType: 'checkboxmodel',
                        injectCheckbox: 'first',
                        showHeaderCheckbox: true,
                        checkOnly: true,
                        mode: 'MULTI',
                        headerWidth: 33
                    },
                    columnLines: true,
                    columnWidth: 50,
                    listeners: {
                        afterrender: function(){
                            this.getSelectionModel().selectAll();
                            var grid = arguments[0].up("[xtype='window']").down('grid');
                            grid.reconfigure(tempStore);
                            win.setHeight(grid.getHeight()+80);
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: 'Import',
                    handler: function(){
                        var grid = arguments[0].up("[xtype='window']").down('grid');
                        var selected = grid.getSelectionModel().getSelection();
                        win.close();
                        generate(selected);
                    }
                }
                ]
            });
            win.show();

        }
        else if(sequences.length === 1)
        {
            var selectionArr = [];
            selectionArr.push( tempStore.getAt(0) );
            generate(selectionArr);
        }
        else
        {
            console.warn("no sequences found in fas file.");
            return cb(null);
        }


    },

    /**
     * Converts a Genbank model into a FASTA string.
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     * @param {String} pFasta FASTA formated string
     */
    genbankToFasta: function(pGenbank) {

        var name = pGenbank.getLocus().getLocusName();
        var sequence = pGenbank.getOrigin().getSequence();

        var result = ">" + name + "\n" + sequence;
        return result;
    },

    // ===========================================================================
    //   Jbeiseq & Genbank Conversions
    //      jbeiseqXMLs (more than one) --> ArrayList<jbeiseqXml>
    //
    //      jbeiseqXML <--> jbeiseqJSON <--> Genbank
    // ===========================================================================

    /**
     * Converts an JbeiSeqXML in string format with multiple records to array of Genbank models
     * Currently eliminates the "seq:" namespace by replaceing it with "seq".
     * @param {String} xml XML file with one or more records in String format
     * @returns {Teselagen.bio.parsers.Genbank[]} Array of Genbank models
     */
    jbeiseqXmlsToXmlArray: function(xml) {

        return Teselagen.bio.parsers.JbeiseqParser.jbeiseqXmlsToXmlArray(xml);
    },

    /**  DOES NOT HAVE TEST CODE YET
     * Scans through a JbeiSeq JSON object to see if it has the minimum structure
     * requirements.
     * @param {Object} json JbeiSeq JSON object
     * @returns {Boolean} isJbeiSeq True if structure is good, false if missing key elements.
     */
    validateJbeiseqJson: function(json) {

        return Teselagen.bio.parsers.JbeiseqParser.validateJbeiseqJson(json);
    },

    /**
     * Converts an JbeiSeqXML in string format to JSON format.
     * This checks for valid entries in the XML file.
     * If a required entry is not recognized, an error is thrown.
     * If a non-required entry is not recognized, a default value is used.
     * Use this for a cleaned version of JSON (from {@link Teselagen.bio.util.XmlToJson})
     *
     * @param {String} xml XML file in String format
     * @returns {Object} json Cleaned JSON object of the JbeiSeqXml
     */
    jbeiseqXmlToJson: function(xmlStr) {

        return Teselagen.bio.parsers.JbeiseqParser.jbeiseqXmlToJson(xmlStr);
    },

    /**
     * Converts an JbeiSeqXML in string format to JSON format.
     * Use this for a cleaned version of JSON (from {@link Teselagen.bio.util.XmlToJson})
     * @param {Object} json Cleaned JSON object of the JbeiSeqXml
     * @returns {String} xml XML file in String format
     */
    jbeiseqJsonToXml: function(json) {

        return Teselagen.bio.parsers.JbeiseqParser.jbeiseqJsonToXml(json);
    },

    /**
     * Converts a JbeiSeq JSON object into a Genbank model of the data.
     * Only one record per json.
     * @param {Object} json JbeiSeq JSON object with ONE record
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     */
    jbeiseqJsonToGenbank: function(json) {

        return Teselagen.bio.parsers.JbeiseqParser.jbeiseqJsonToGenbank(json);
    },

    /**
     * Converts a JbeiSeq XML file into a Genbank model of the data.
     * Only one record per xmlStr. Parse approriately with <seq:seq> RECORD </seq:seq> tags.
     * @param {String} xml JbeiSeq XML file  with ONE record in String format
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     */
    jbeiseqXmlToGenbank: function(xmlStr) {

        return Teselagen.bio.parsers.JbeiseqParser.jbeiseqXmlToGenbank(xmlStr);
    },

    /**
     * Converts a Genbank model into a JbeiSeq JSON formatted file.
     * Only one Genbank model at a time.
     * This is code adapted from IceXmlUtils.as
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     * @param {String} xml JbeiSeq JSON string with ONE record in String format
     */
    genbankToJbeiseqJson: function(pGenbank) {

        return Teselagen.bio.parsers.JbeiseqParser.genbankToJbeiseqJson(pGenbank);
    },

    /**
     * Converts a Genbank model into a JbeiSeq XML formatted file.
     * Only one Genbank model at a time.
     * This is code adapted from IceXmlUtils.as
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     * @param {String} xml JbeiSeq XML string with ONE record in String format
     */
    genbankToJbeiseqXml: function(pGenbank) {

        return Teselagen.bio.parsers.JbeiseqParser.genbankToJbeiseqXml(pGenbank);
    },

    //    /**
    //     * Creates a Sequence Hash, from a sequence. Uses Sha256.js to create this id.
    //     * @param {Teselagen.} pSequence Sequence string
    //     * @returns {String} seqHash Hash of the sequence using sha256
    //     *
    //    makeSeqHash: function(pSequence) {
    //        Teselagen.bio.util.Sha256
    //    },*/

    // ===========================================================================
    //   SBOL & JbeiSeq Conversions
    //
    //      sbolXML <--> sbolJSON <--> jbeiJSON
    // ===========================================================================

    /** THIS DOES NOT WORK YET
     * Converts an SbolXML in string format to JSON format.
     * This checks for valid entries in the XML file.
     * If a required entry is not recognized, an error is thrown.
     * If a non-required entry is not recognized, a default value is used.
     * Use this for a cleaned version of JSON (from {@link Teselagen.bio.util.XmlToJson})
     * @param {String} xml Sbol XML file in String format
     * @returns {Object} json Cleaned JSON object of the Sbol XML
     */
    sbolXmlToJson: function(xmlStr) {
        return Teselagen.bio.parsers.SbolParser.sbolXmlToJson(xmlStr);


    },

    /** NOT WRITTEN ON SbolParser Side
     */
    sbolJsonToJbeiJson: function(sbol) {
        return Teselagen.bio.parsers.SbolParser.sbolJsonToJbeiJson(sbol);
    },

    /** NOT WRITTEN ON SbolParser Side
     */
    jbeiJsonToSbolJson: function(jbei) {
        return Teselagen.bio.parsers.SbolParser.jbeiJsonToSbolJson(jbei);
    },

    // ===========================================================================
    //      UTILITY FUNCTIONS
    // ===========================================================================

    /** TO BE MOVED TO Teselagen.util.FileUtils.js.
     * @param {String} url The url to retrieve data from.
     * @returns {String} xml XML string
     */
    loadFile: function(url) {
        // Doing XMLHttpRequest leads to loading from cache

        var str;

        Ext.Ajax.request({
            url: url,
            async: false,
            disableCaching: true,
            success: function(response) {
                str = response.responseText;
                //console.dir(xmlStr);
            },
            failure: function(response, opts) {
                console.warn('Could not load: ' + url + '\nServer-side failure with status code ' + response.status);
                throw Ext.create("Teselagen.bio.BioException", {
                    message: 'Could not load: ' + url + '\nServer-side failure with status code ' + response.status
                });
            }
        });
        return str;
    },


    /**
     * Today's date
     * @returns {String} date Today's date in string format
     */
    todayDate: function() {
        var date = (new Date()).toDateString().split(" ");
        var dateStr = date[2] + "-" + date[1].toUpperCase() + "-" + date[3];
        return dateStr;
    },

    /**
     * isALabel
     * @param {String} name Name of a attribute or qualifier
     * @return {Boolean} isALabel
     */
    isALabel: function(name) {
        return Teselagen.bio.parsers.JbeiseqParser.isALabel(name);
    }

});
