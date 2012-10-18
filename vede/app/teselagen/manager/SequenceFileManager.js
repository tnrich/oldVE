/** THIS CLASS WILL BE ELIMINATED AND FUNCTIONS WILL BE PUT IN Part.js AND VectorEditorProject.js ???
 * @class Teselagen.manager.SequenceFileManager
 * Class describing a SequenceFileManager.
 * SequenceFileManager holds an array of SequenceFiles, for a given design project.
 *
 * Originally SequenceFileProxy.as, FunctionMediator.as, SaveDesignXMLCommand.as
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.manager.SequenceFileManager", {

    //singleton: true,

    requires: [
        "Teselagen.bio.util.Sha256",
        "Teselagen.constants.Constants",
        "Teselagen.models.SequenceFile"
    ],

    statics: {
        NAME: "SequenceFileProxy"
    },

    Sha256: null,
    Constants: null,

    config: {
        sequenceFiles: []
    },

    constructor: function(inData) {
        this.Sha256          = Teselagen.bio.util.Sha256;
        this.Constants       = Teselagen.constants.Constants;
        this.sequenceFiles   = inData.sequenceFiles || [];
        //console.log(inData.sequenceFiles);
    },

    /**
     * Create a SequenceFile model.
     * @param {Object} inData Object with parameters defined in: {@link Teselagen.models.SequenceFile}
     * @returns {Teselagen.models.SequenceFile} result
     *
    createSequenceFile: function(inData) {
        var result = Ext.create("Teselagen.models.SequenceFile", inData);
        return result;
    },*/

    /**
     * Add SequenceFile to SequenceFileManager array or locates a previously stored SequenceFile.
     * @param {String} pFileFormat Format of the SequenceFile (e.g. Genbank, jbei-seq, FASTA)
     * @param {String} pDirtyFileContent File contnet that has not been screened for prior existence
     * @param {String} pFileName
     * @returns {Teselagen.models.SequenceFile} seqFile SequenceFile
     */
    addSequenceFile: function(pFileFormat, pDirtyFileContent, pFileName ){

        // Replace \r with \n and make sure there is a \n at end of file
        var fileContent = pDirtyFileContent.replace(/[\r]/g, "\n");
        if ( !fileContent.match(/\n$/)) {
            fileContent += "\n";
        }

        var hash = Teselagen.bio.util.Sha256.hex_sha256(fileContent);

        // If it exists already, return SequenceFile
        for (var i=0; i < this.sequenceFiles.length; i++) {
            if (hash === this.sequenceFiles[i].get("hash") && pFileName === this.sequenceFiles[i].get("sequenceFileName")) {
                return this.sequenceFiles[i];
            }
        }

        // Determine display ID and check for uniqueness
        var displayID;
        var cnt;
        if (pFileFormat === this.Constants.self.GENBANK) {
            cnt = pDirtyFileContent.match(/LOCUS *(\S*)/);
            if (cnt.length > 1) {
                displayID = cnt[1].toString();
            }
        } else if (pFileFormat === this.Constants.self.FASTA) {
            cnt = pDirtyFileContent.match(/>\s*(\S*)/);
            if (cnt.length > 1) {
                displayID = cnt[1].toString();
            }
        } else if (pFileFormat === this.Constants.self.JBEI_SEQ) {
            cnt = pDirtyFileContent.match(/<seq:name>(.*)<\/seq:name>/);
            if (cnt.length > 1) {
                displayID = cnt[1].toString();
            }
        }

        for (var i=0; i < this.sequenceFiles.length; i++) {
            if (displayID === this.sequenceFiles[i].get("partSource")) {
                throw Ext.create("Teselagen.bio.BioException", {
                    message: "Another file with the Display ID " + displayID + " already exists.  Please ensure the Display ID is unique and try again.\n\n" +
                        "The Display ID is the Part Source for sequences that did not come from a file.  " +
                        "Otherwise, it is the first field on the LOCUS line in Genbank files, the first word following the '>' character in FASTA files, " +
                        "or the text between <seq:name> and </seq:name> in jbei-seq files."
                });
            }
        }

        // create new SequenceFile if t doesn't already exist
        var seqFile = Ext.create("Teselagen.models.SequenceFile", {
            sequenceFileFormat: pFileFormat,
            sequenceFileContent: fileContent,
            sequenceFileName: pFileName,
            partSource: displayID,
            hash: hash
        });

        if (pFileName === "" || pFileName === undefined ) {
            if (pFileFormat === this.Constants.self.GENBANK) {
                seqFile.set("sequenceFileName", displayID + ".gb");
            } else if (pFileFormat === this.Constants.self.FASTA) {
                seqFile.set("sequenceFileName", displayID + ".fas");
            } else if (pFileFormat === this.Constants.self.JBEI_SEQ) {
                seqFile.set("sequenceFileName", displayID + ".xml"); // IS THIS THE CORRECT FILE SUFFIX?
            } else {
                seqFile.set("sequencesFileName", displayID);
                console.warn("File format for this sequence is not recognized.  Beware of nonsensical file names or missing sequence files.");
            }
        }

        // check file names
        if (seqFile.get("sequenceFileName").search(/\s/) > 0) {
            // Reject filename if it has whitespace
            throw Ext.create("Teselagen.bio.BioException", {
                message: "The file name " + seqFile.get("sequenceFileName") + " has whitespace characters, which are not allowed.  " +
                "Please remove the whitespace characters and try again."
            });
        }

        for (i = 0; i < this.sequenceFiles.length; i++) {
            if (seqFile.get("sequenceFileName") === this.sequenceFiles[i].get("sequenceFileName")) {
                // case sensitive match
                throw Ext.create("Teselagen.bio.BioException", {
                    message: "Another file with the file name " + seqFile.get("sequenceFileName") + " already exists.  " +
                        "Please ensure the file name is unique and try again.  \n\n" +
                        "If the sequence did not come from a file, the file name is generated from the Part Source."
                });
            }

            if (seqFile.get("sequenceFileName").toLowerCase() === this.sequenceFiles[i].get("sequenceFileName").toLowerCase() ) {
                // case insensitive match
                throw Ext.create("Teselagen.bio.BioException", {
                    message: "Another file was found with the file name " + this.sequenceFiles[i].get("sequenceFileName") + ", which is a case insensitive match.  " +
                        "If these should be the same file, please use the correct capitalization.  " +
                        "Otherwise, please ensure the file name is unique and try again.  \n\n" +
                        "If the sequence did not come from a file, the file name is generated from the Part Source."
                });
            }
        }

        this.sequenceFiles.push(seqFile);
        return seqFile;
    },

    deleteItem: function(pSequenceFile) {
        for (var i=0; i < this.sequenceFiles.length; i++) {
            if (this.sequenceFiles[i] === pSequenceFile) {
                this.sequenceFiles.splice(i,1);
            }
        }
    },

    deleteAllItems: function() {
        this.sequenceFiles = [];
    },

    getItemByPartSource: function(pSource) {
        for (var i = 0; i < this.sequenceFiles.length; i++) {
            if (pSource === this.sequenceFiles[i].get("partSource")) {
                return this.sequenceFiles[i];
            }
        }
    },

    getItemByHash: function(pHash) {
        for (var i = 0; i < this.sequenceFiles.length; i++) {
            if (pHash === this.sequenceFiles[i].get("hash")) {
                return this.sequenceFiles[i];
            }
        }
    }

});