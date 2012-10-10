/** HAS NOT BEEN FULLY TESTED YET
 * THIS CLASS WILL BE ELIMINATED AND FUNCTIONS WILL BE PUT IN J5BIN.JS
 * @class Teselagen.manager.PartManager
 * Class describing a PartManager.
 * PartManager holds an array of Parts, for a given design project.
 *
 * Originally PartFileProxy.as, FunctionMediator.as, SaveDesignXMLCommand.as
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.manager.PartManager", {

    //singleton: true,

    requires: [
        "Teselagen.bio.util.Sha256",
        "Teselagen.constants.Constants",
        "Teselagen.models.SequenceFile"
    ],

    statics: {
        NAME: "PartProxy"
    },

    Sha256: null,
    Constants: null,

    config: {
        parts: []
    },

    constructor: function(inData) {
        this.Sha256         = Teselagen.bio.util.Sha256;
        this.Constants      = Teselagen.constants.Constants;
        this.parts          = inData.parts || [];
        //console.log(inData.sequenceFiles);
    },


    // Not sure what this function is supposed to accomplish. DW.
    getPartVOs: function() {


        /*var uniquePartVO;
        for (var i=0; i < this.parts.length; i++) {
            uniquePartVO = true;

            for (var j=0; j < blah.length; j++) {

            }
        }*/
    },

    getPartById: function(pId) {
        for (var i = 0; i < this.parts.length; i++) {
            if (this.parts[i].get("id") !== pId ) {
                return this.parts[i];
            }
        }
        return null;
    },


    // Original PartProxy.as searches parts[i].get("name"), an attribute Part does not have
    getParVOByName: function(pName) {
        for (var i = 0; i < this.parts.length; i++) {
            if (this.parts[i].get("partVO").get("name") !== pName ) {
                return this.parts[i].get("partVO");
            }
        }
        return null;
    },

    getParVOById: function(pId) {
        for (var i = 0; i < this.parts.length; i++) {
            if (this.parts[i].get("partVO").get("id") !== pId ) {
                return this.parts[i].get("partVO");
            }
        }
        return null;
    },

    /**
     * Deletes a Part after checking PartVO, SequenceFile, and EugeneRule can also be deleted.
     * @param {Teselagen.models.Part} pPart Part to be deleted.
     * @param {Teselagen.manager.SequenceFileManager} pSequenceFileManager List of SequenceFiles in this design.
     * @param {Teselagen.manager.EugeneRuleManager} pEugeneRuleManager List of EugeneRules in this design.
     */
    deleteItem: function(pPart, pSequenceFileManager, pEugeneRuleManager) {
        var linkedPartsExist;
        var isSequenceFileUsedElsewhere;

        for (var i = 0; i < this.parts.length; i++) {
            if (this.parts[i] == pPart ) {
                // want to delete this Part
                
                // determine if there are Parts linked to this part (with same PartVO)
                for (var j = 0; j < this.parts.length; j++) {
                    linkedPartsExist = false;
                    if (i !==j && this.parts[i].get("partVO") == this.parts[j].get("partVO")) {
                        linkedPartsExist = true;
                        break;
                    }
                }

                // If no linked Parks,
                // Determine if there are parts with the same SequenceFile. If yes, cannot remove.
                // Determine if there are EugeneRules that will become obsolete. If yes, remove them.
                if (!linkedPartsExist) {
                    isSequenceFileUsedElsewhere = false;

                    // SequenceFile
                    for (var k = 0; k < this.parts.length; k++) {
                        if (i!==k && this.parts[i].get("sequenceFile") === this.parts[k].get("sequenceFile")) {
                            isSequenceFileUsedElsewhere = true;
                            break;
                        }
                    }
                    if(!isSequenceFileUsedElsewhere) {
                        pSequenceFileManager.deleteItem(pPart.get("partVO").get("sequenceFile"));
                    }

                    // Eugene Rules
                    var eugeneRules = pEugeneRuleManager.getRulesInvolvingPartVO(pPart.get("partVO"));
                    for (k = 0; k < eugeneRules.length; k++) {
                        pEugeneRuleManager.deleteItem(eugeneRules[k]);
                    }
                }

                // Delete the Part (and PartVO will also be deleted if no other part is using it).
                this.parts.splice(i, 1);
                break;
            }
        }

        // Refresh all parts (to change colors, etc)

        // DW: NEED TO FIRE EVENT TO REFRESH THE VIEW.
    },

    deleteAllItems: function(pSequenceFileManager, pEugeneRuleManager) {
        pSequenceFileManager.deleteAllItems();
        pEugeneRuleManager.deleteAllItems();

        this.parts = [];
    },

    createPart: function(pPartVO) {
        // If none passed in, create new part, create a new PartVO
        if (pPartVO === null) {
            pParVO = Ext.create("Teselagen.models.PartVO");
        }

        // Create new Part containing PartVO
        var newPart = Ext.create("Teselagen.models.Part", {
            partVO: pPartVO
        });

        this.parts.push(newPart);

        return newPart;
    },

    // This differs from flex implementation
    isUniquePartName: function(pName) {

        for (var i = 0; i < this.parts.length; i++) {
            if (this.parts[i].get("partVO").get("name") === pName) {
                return false;
            }
        }
        return true;
    }


});