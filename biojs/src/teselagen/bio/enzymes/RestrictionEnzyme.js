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
         * @method toString
         * @return {String}
         */
        this.toString = function() {
            return "RestrictionEnzyme: " + name;
        }

        /**
         * Get name.
         * @method getName
         * @return {String}
         */
        this.getName = function() {
            return name;
        }

        /**
         * Set name.
         * @method setName
         * @param {String} pName
         */
        this.setName = function(pName) {
            name = pName;
        }

        /**
         * Get site.
         * @method getSite
         * @return {String}
         */
        this.getSite = function() {
            return site;
        }

        /**
         * Set site.
         * @method setSite
         * @param {String} pSite
         */
        this.setSite = function(pSite) {
            site = pSite;
        }

        /**
         * Get cutType.
         * @method getCutType
         * @return {Int}
         */
        this.getCutType = function() {
            return cutType;
        }

        /**
         * Set name.
         * @method setCutType
         * @param {Int} pCutType
         */
        this.setCutType = function(pCutType) {
            cutType = pCutType;
        }

        /**
         * Get forwardRegex.
         * @method getForwardRegex
         * @return {String}
         */
        this.getForwardRegex = function() {
            return forwardRegex;
        }

        /**
         * Set forwardRegex.
         * @method setForwardRegex
         * @param {String} pForwardRegex
         */
        this.setForwardRegex = function(pForwardRegex) {
            forwardRegex = pForwardRegex;
        }

        /**
         * Get reverseRegex.
         * @method getReverseRegex
         * @return {String}
         */
        this.getReverseRegex = function() {
            return reverseRegex;
        }

        /**
         * Set reverseRegex.
         * @method setReverseRegex
         * @param {String} pReverseRegex
         */
        this.setReverseRegex = function(pReverseRegex) {
            reverseRegex = pReverseRegex;
        }

        /**
         * Get dsForward.
         * @method getDsForward
         * @return {Int}
         */
        this.getDsForward = function() {
            return dsForward;
        }

        /**
         * Set dsForward.
         * @method setDsForward
         * @param {Int} pDsForward
         */
        this.setDsForward = function(pDsForward) {
            dsForward = pDsForward;
        }

        /**
         * Get dsReverse.
         * @method getDsReverse
         * @return {String}
         */
        this.getDsReverse = function() {
            return dsReverse;
        }

        /**
         * Set dsReverse.
         * @method setDsReverse
         * @param {Int} pDsReverse
         */
        this.setDsReverse = function(pDsReverse) {
            dsReverse = pDsReverse;
        }

        /**
         * Get usForward.
         * @method getUsForward
         * @return {Int}
         */
        this.getUsForward = function() {
            return usForward;
        }

        /**
         * Set usForward.
         * @method setUsForward
         * @param {Int} pUsForward
         */
        this.setUsForward = function(pUsForward) {
            usForward = pUsForward;
        }

        /**
         * Get usReverse.
         * @method getUsReverse
         * @return {Int}
         */
        this.getUsReverse = function() {
            return usReverse;
        }

        /**
         * Set usReverse.
         * @method setUsReverse
         * @param {Int} pUsReverse
         */
        this.setUsReverse = function(pUsReverse) {
            usReverse = pUsReverse;
        }
    }
});
