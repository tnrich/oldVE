/**
 * @class Teselagen.manager.RestrictionEnzymeManager
 * Maps restriction enzyme cut sites to a DNA sequence.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv
 */
Ext.define("Teselagen.manager.RestrictionEnzymeManager", {
    extend: "Teselagen.mappers.Mapper",

    requires: ["Teselagen.bio.enzymes.RestrictionEnzymeMapper",
               "Teselagen.bio.sequence.DNATools",
               "Teselagen.event.MapperEvent"],

    config: {
        restrictionEnzymeGroup: null,
        allCutSites: [],
        allCutSitesMap: Ext.create("Ext.util.HashMap"), 
        cutSites: [],
        cutSitesMap: [],
        maxCuts: -1,
    },

    mixins: {
        observable: "Ext.util.Observable"
    },

    updateEventString: null,

    DNATools: null,

    /**
     * @param {Teselagen.models.RestrictionEnzymeGroup} restrictionEnzymeGroup The group of enzymes to map to the sequence.
     * @param {Array<Teselagen.bio.enzymes.RestrictionCutSite>} allCutSites All cut sites produced by the enzymes in the group.
     * @param {Ext.util.HashMap} allCutSitesMap A map of all cut sites with RestrictionEnzymes as keys and arrays of cut sites as values.
     * @param {Array<Teselagen.bio.enzymes.RestrictionCutSite>} cutSites Cut sites which belong to enzymes that cut the sequence less than maxCuts times.
     * @param {Ext.util.HashMap} cutSitesMap A map of the cut sites filtered by maximum cuts.
     * @param {Int} maxCuts The maximum number of cuts an enzyme can make before its cut sites are not returned. Defaults to -1, meaning no limit.
     */
    constructor: function(inData) {
        this.updateEventString = Teselagen.event.MapperEvent.RESTRICTION_ENZYME_MAPPER_UPDATED;
        this.DNATools = Teselagen.bio.sequence.DNATools;

        this.mixins.observable.constructor.call(this, inData);
        
        this.callParent([inData]);
        this.initConfig(inData);
    },

    /**
     * Sets the restrictionEnzymeGroup, marking the mapper as dirty.
     * @param pRestrictionEnzymeGroup {Teselagen.models.RestrictionEnzymeGroup} The restrictionEnzymeGroup to be set.
     */
    setRestrictionEnzymeGroup: function(pRestrictionEnzymeGroup) {
        this.restrictionEnzymeGroup = pRestrictionEnzymeGroup;
        this.recalculate();
        dirty = false;
    },

    /**
     * Recalculates (if needed) and returns allCutSites.
     * @return {Array<Teselagen.bio.enzymes.RestrictionCutSite>} List of all cut sites produced by enzymes in the group.
     */
    getAllCutSites: function() {
        this.recalcIfNeeded();
        return this.allCutSites;
    },

    /**
     * Recalculates (if needed) and returns cutSites.
     * @return {Array<Teselagen.bio.enzymes.RestrictionCutSite>} List of cut sites filtered by maxCuts.
     */
    getCutSites: function() {
        this.recalcIfNeeded();
        return this.cutSites;
    },

    /**
     * Recalculates (if needed) and returns allCutSitesMap.
     * @return {Ext.util.HashMap} A map of enzymes to arrays of cut sites they produce.
     */
    getAllCutSitesMap: function() {
        this.recalcIfNeeded();
        return this.allCutSitesMap;
    },

    /**
     * Recalculates (if needed) and returns cutSitesMap.
     * @return {Ext.util.HashMap} A map of enzymes to arrays of cut sites filtered by maxCuts.
     */
    getCutSitesMap: function() {
        this.recalcIfNeeded();
        return this.cutSitesMap;
    },

    /**
     * @private
     * Recalculates cut sites if the mapper is dirty.
     */
    recalcIfNeeded: function() {
        if(this.dirty) {
            this.recalculate();
            this.dirty = false;
        }
    },

    /**
     * Sets maxCuts and flags mapper as dirty if provided value is different from current value.
     */
    setMaxCuts: function(pMaxCuts) {
        if(pMaxCuts!= this.maxCuts) {
            this.maxCuts = pMaxCuts;
            this.dirty = true;
        }
    },

    /**
     * @private
     * Calls appropriate cut site recalculation function, depending on whether the sequence is linear or circular.
     */ 
    recalculate: function() {
        if(this.sequenceManager &&
           this.restrictionEnzymeGroup &&
           this.restrictionEnzymeGroup.getEnzymes().length > 0) {
            if(this.sequenceManager.getCircular()) {
                this.recalculateCircular();
            } else {
                this.recalculateNonCircular();
            }
        } else {
            this.cutSites = null;
            this.cutSitesMap = null;
        }

        Vesa.application.fireEvent(this.updateEventString);
    },

    /**
     * @private
     * Recalculates cut sites for a linear sequence.
     */
    recalculateNonCircular: function() {
        var newCutSites = Teselagen.bio.enzymes.RestrictionEnzymeMapper.cutSequence(
                                                this.restrictionEnzymeGroup.getEnzymes(),
                                                this.sequenceManager.getSequence());

        this.filterByMaxCuts(newCutSites);
    },

    /**
     * @private
     * Recalculates cut sites for a circular sequence.
     */
    recalculateCircular: function() {
        var seqLen = this.sequenceManager.getSequence().seqString().length;

        var doubleSequence = this.DNATools.createDNA(this.sequenceManager.getSequence().seqString() +
                                                     this.sequenceManager.getSequence().seqString());

        var newCutSites = Teselagen.bio.enzymes.RestrictionEnzymeMapper.cutSequence(
                                                this.restrictionEnzymeGroup.getEnzymes(),
                                                doubleSequence);

        var editedCutSites = new Ext.util.HashMap();

        Ext.each(newCutSites.getKeys(), function(key) {
            var sitesList = newCutSites.get(key);

            // Eliminate cut sites that are over sequence length.
            var sitesForOneEnzyme = [];
            Ext.each(sitesList, function(site) {
                if(site.getStart() >= seqLen) {
                } else if(site.getEnd() <= seqLen) {
                    sitesForOneEnzyme.push(site);
                } else {
                    site.setOneEnd(site.getEnd() - seqLen);
                    sitesForOneEnzyme.push(site);
                }
            });

            editedCutSites.add(key, sitesForOneEnzyme);
        });

        this.filterByMaxCuts(editedCutSites);
    },

    /**
     * @private
     * Filters recalculated cut sites by maxCuts and sets the appropriate variables.
     * @param {Ext.util.HashMap} pCutSites The recalculated cut sites.
     */
    filterByMaxCuts: function(pCutSites) {
        var newCutSites = [];
        var newCutSitesMap = new Ext.util.HashMap();
        var newAllCutSites = [];
        var newAllCutSitesMap = pCutSites;
        
        Ext.each(pCutSites.getKeys(), function(enzyme) {
            var sitesForOneEnzyme = pCutSites.get(enzyme);    
            var numCuts = sitesForOneEnzyme.length;

            // Set numCuts for each site.
            Ext.each(sitesForOneEnzyme, function(site) {
                site.setNumCuts(numCuts);
            });
        
            newAllCutSites = newAllCutSites.concat(sitesForOneEnzyme);
            newAllCutSitesMap[enzyme] = sitesForOneEnzyme;

            // Add only the cut sites of enzymes which have made fewer than maxCuts,
            // or add them all if maxCuts is -1 (default).
            if(this.maxCuts < 0 || numCuts <= this.maxCuts) {
                newCutSitesMap[enzyme] = sitesForOneEnzyme;
                newCutSites = newCutSites.concat(sitesForOneEnzyme);
            }
        }, this);

        this.cutSites = newCutSites;
        this.cutSitesMap = newCutSitesMap;
        this.allCutSites = newAllCutSites;
        this.allCutSitesMap = newAllCutSitesMap;
    },
});
