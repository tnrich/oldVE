/**
 * @class Teselagen.bio.enzymes.RestrictionEnzyme
 * Restriction Enzyme holder.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.bio.enzymes.RestrictionEnzyme", {

    /**
     * Creates a RestrictionEnzyme object.
     * @param {String} name Enzyme name.
     * @param {String} site Enzyme site.
     * @param {Int} cutType Downstream or Upstream cut type. Values: 0 = downstream, 1 = upstream
     * @param {String} forwardRegex Forward regular expression.
     * @param {String} reverseRegex Reverse regular expression.
     * @param {Int} dsForward Downstream 3" strand cut position.
     * @param {Int} dsReverse Downstream 5" strand cut position.
     * @param {Int} usForward Upstream 3" strand cut position.
     * @param {Int} usReverse Upstream 5" strand cut position.
     * @returns {RestrictionEnzyme} Restriction Enzyme object.
     */
    constructor: function(inData) {
        var name = inData.name;
        var site = inData.site;
        var cutType = inData.cutType;
        var forwardRegex = inData.forwardRegex;
        var reverseRegex = inData.reverseRegex;
        var dsForward = inData.dsForward;
        var dsReverse = inData.dsReverse;
        var usForward = inData.usForward;
        var usReverse = inData.usReverse;
        
        /**
         * Checks if enzyme is palindromic.
         * @returns {Boolean} True if enzyme has palindromic regex.
         */
        this.isPalindromic = function() {
            return forwardRegex === reverseRegex;
        }
        
        /**
         * Converts the object to a string of the form "Restriction Enzyme [name]"
         * @return {String}
         */
        this.toString = function() {
            return "RestrictionEnzyme: " + name;
        }
        
        /**
         * Get name.
         * @return {String}
         */
        this.getName = function() {
            return name;
        }

        /**
         * Set name.
         * @param {String} pName 
         */
        this.setName = function(pName) {
            name = pName;
        }

        /**
         * Get site.
         * @return {String}
         */
        this.getSite = function() {
            return site;
        }

        /**
         * Set site.
         * @param {String} pSite
         */
        this.setSite = function(pSite) {
            site = pSite;
        }

        /**
         * Get cutType.
         * @return {Int}
         */
        this.getCutType = function() {
            return cutType;
        }

        /**
         * Set name.
         * @param {Int} pCutType
         */
        this.setCutType = function(pCutType) {
            cutType = pCutType;
        }

        /**
         * Get forwardRegex.
         * @return {String}
         */
        this.getForwardRegex = function() {
            return forwardRegex;
        }

        /**
         * Set forwardRegex.
         * @param {String} pForwardRegex
         */
        this.setForwardRegex = function(pForwardRegex) {
            forwardRegex = pForwardRegex;
        }

        /**
         * Get reverseRegex.
         * @return {String}
         */
        this.getReverseRegex = function() {
            return reverseRegex;
        }

        /**
         * Set reverseRegex.
         * @param {String}
         */
        this.setReverseRegex = function(pReverseRegex) {
            reverseRegex = pReverseRegex;
        }

        /**
         * Get dsForward.
         * @return {Int}
         */
        this.getDsForward = function() {
            return dsForward;
        }

        /**
         * Set dsForward.
         * @param {Int} pDsForward
         */
        this.setDsForward = function(pDsForward) {
            dsForward = pDsForward;
        }

        /**
         * Get dsReverse.
         * @return {String}
         */
        this.getDsReverse = function() {
            return dsReverse;
        }

        /**
         * Set dsReverse.
         * @param {Int} pDsReverse
         */
        this.setDsReverse = function(pDsReverse) {
            dsReverse = pDsReverse;
        }

        /**
         * Get usForward.
         * @return {Int}
         */
        this.getUsForward = function() {
            return usForward;
        }

        /**
         * Set usForward.
         * @param {Int} pUsForward
         */
        this.setUsForward = function(pUsForward) {
            usForward = pUsForward;
        }

        /**
         * Get usReverse.
         * @return {Int}
         */
        this.getUsReverse = function() {
            return usReverse;
        }

        /**
         * Set usReverse.
         * @param {Int} pUsReverse
         */
        this.setUsReverse = function(pUsReverse) {
            usReverse = pUsReverse;
        }
    }
});
