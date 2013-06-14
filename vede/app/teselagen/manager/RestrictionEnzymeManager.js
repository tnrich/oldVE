/**
 * @class Teselagen.manager.RestrictionEnzymeManager
 * Maps restriction enzyme cut sites to a DNA sequence.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv
 */
Ext.define("Teselagen.manager.RestrictionEnzymeManager", {
    extend: "Teselagen.mappers.Mapper",

    singleton: true,

    requires: ["Teselagen.bio.enzymes.RestrictionEnzymeMapper",
               "Teselagen.bio.sequence.DNATools"],

    config: {
        restrictionEnzymeGroup: null,
        allCutSites: [],
        allCutSitesMap: Ext.create("Ext.util.HashMap"), 
        cutSites: [],
        cutSitesMap: [],
        maxCuts: -1
    },

    mixins: {
        observable: "Ext.util.Observable"
    },

    DNATools: null,

    /**
     * @param {Teselagen.models.RestrictionEnzymeGroup} restrictionEnzymeGroup The group of enzymes to map to the sequence.
     * @param {Teselagen.bio.enzymes.RestrictionCutSite[]} allCutSites All cut sites produced by the enzymes in the group.
     * @param {Ext.util.HashMap} allCutSitesMap A map of all cut sites with RestrictionEnzymes as keys and arrays of cut sites as values.
     * @param {Teselagen.bio.enzymes.RestrictionCutSite[]} cutSites Cut sites which belong to enzymes that cut the sequence less than maxCuts times.
     * @param {Ext.util.HashMap} cutSitesMap A map of the cut sites filtered by maximum cuts.
     * @param {Int} maxCuts The maximum number of cuts an enzyme can make before its cut sites are not returned. Defaults to -1, meaning no limit.
     */
    initialize: function() {
        this.DNATools = Teselagen.bio.sequence.DNATools;
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
     * @return {Teselagen.bio.enzymes.RestrictionCutSite[]} List of all cut sites produced by enzymes in the group.
     */
    getAllCutSites: function() {
        this.recalcIfNeeded();
        return this.allCutSites;
    },

    /**
     * Recalculates (if needed) and returns cutSites.
     * @return {Teselagen.bio.enzymes.RestrictionCutSite[]} List of cut sites filtered by maxCuts.
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

    /**
     * Returns the list of all cut sites sorted according to the supplied criteria.
     * @param {String} "byStart" || "byEnd"
     * @return {Teselagen.bio.enzymes.RestrictionCutSite[]} List of cut sites sorted by the start site or end site.
     */
    getAllCutsSorted: function(sortCriteria) {
        //default to sorting byStart
        sortCriteria = typeof sortCriteria !== 'undefined' ? sortCriteria : "byStart";
        //Make a shallow copy of the array
        var sortedCutSites = this.allCutSites.slice();
        if (sortCriteria === "byStart") {
            sortedCutSites.sort(this.sortByStart);
        } else {
            sortedCutSites.sort(this.sortByEnd);
        }
        return sortedCutSites;
    },

    /**
     * Returns the first cut site sorted according to the supplied criteria.
     * @param {String} "byStart" || "byEnd"
     * @return {Teselagen.bio.enzymes.RestrictionCutSite} the first cut site sorted by the start site or end site.
     */
    getFirstCut: function(sortCriteria) {
        //default to sorting byStart
        sortCriteria = typeof sortCriteria !== 'undefined' ? sortCriteria : "byStart";
        //Get the sorted array
        var sortedCutSites = this.getAllCutsSorted(sortCriteria);
        return sortedCutSites[0];
    },

    /**
     * Returns the last cut site sorted according to the supplied criteria.
     * @param {String} "byStart" || "byEnd"
     * @return {Teselagen.bio.enzymes.RestrictionCutSite} the last cut site sorted by the start site or end site.
     */
    getLastCut: function(sortCriteria) {
        //default to sorting byEnd
        sortCriteria = typeof sortCriteria !== 'undefined' ? sortCriteria : "byEnd";
        //Get the sorted array
        var sortedCutSites = this.getAllCutsSorted(sortCriteria);
        return sortedCutSites.pop();
    },
    
    /**
     * @private
     * Helper function for sorting two restriction cut sites.
     * @param {Teselagen.bio.enzymes.RestrictionCutSite} x
     * @param {Teselagen.bio.enzymes.RestrictionCutSite} y
     * @return {Int} The sort order.
     */
    sortByStart: function(x, y) {
        if(x.start < y.start) {
            return -1;
        } else if(x.start > y.start) {
            return 1;
        } else {
            return 0;
        }
    },
    
    /**
     * @private
     * Helper function for sorting two restriction cut sites.
     * @param {Teselagen.bio.enzymes.RestrictionCutSite} x
     * @param {Teselagen.bio.enzymes.RestrictionCutSite} y
     * @return {Int} The sort order.
     */
    sortByEnd: function(x, y) {
        if(x.end < y.end) {
            return -1;
        } else if(x.end > y.end) {
            return 1;
        } else {
            return 0;
        }
    }
});
