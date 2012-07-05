/**
 * @class Teselagen.bio.enzymes.RestrictionEnzyme
 *  
 * Restriction Enzyme holder.
 * 
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.bio.enzymes.RestrictionEnzyme", {

	/**
	 * Creates a RestrictionEnzyme object.
	 * @param {Object} inData Input parameters.
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
		
		this.toString = function() {
			return "RestrictionEnzyme: " + name;
		}
		
		/* -----------------------------------------------------
		 * GETTERS AND SETTERS
		 * -----------------------------------------------------*/
		/**
		 * Get name.
		 */
		this.getName = function() {
			return name;
		}
		/**
		 * Set name.
		 */
		this.setName = function(pName) {
			name = pName;
		}
		/**
		 * Get site.
		 */
		this.getSite = function() {
			return site;
		}
		/**
		 * Set site.
		 */
		this.setSite = function(pSite) {
			site = pSite;
		}
		/**
		 * Get cutType.
		 */
		this.getCutType = function() {
			return cutType;
		}
		/**
		 * Set name.
		 */
		this.setCutType = function(pCutType) {
			cutType = pCutType;
		}
		/**
		 * Get forwardRegex.
		 */
		this.getForwardRegex = function() {
			return forwardRegex;
		}
		/**
		 * Set forwardRegex.
		 */
		this.setForwardRegex = function(pForwardRegex) {
			forwardRegex = pForwardRegex;
		}
		/**
		 * Get reverseRegex.
		 */
		this.getReverseRegex = function() {
			return reverseRegex;
		}
		/**
		 * Set reverseRegex.
		 */
		this.setReverseRegex = function(pReverseRegex) {
			reverseRegex = pReverseRegex;
		}
		/**
		 * Get dsForward.
		 */
		this.getDsForward = function() {
			return dsForward;
		}
		/**
		 * Set dsForward.
		 */
		this.setDsForward = function(pDsForward) {
			dsForward = pDsForward;
		}
		/**
		 * Get dsReverse.
		 */
		this.getDsReverse = function() {
			return dsReverse;
		}
		/**
		 * Set dsReverse.
		 */
		this.setDsReverse = function(pDsReverse) {
			dsReverse = pDsReverse;
		}
		/**
		 * Get usForward.
		 */
		this.getUsForward = function() {
			return usForward;
		}
		/**
		 * Set name.
		 */
		this.setUsForward = function(pUsForward) {
			usForward = pUsForward;
		}
		/**
		 * Get usReverse.
		 */
		this.getUsReverse = function() {
			return usReverse;
		}
		/**
		 * Set usReverse.
		 */
		this.setUsReverse = function(pUsReverse) {
			usReverse = pUsReverse;
		}
	}
});