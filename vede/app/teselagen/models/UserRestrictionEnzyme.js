/**
 * @class Teselagen.models.UserRestrictionEnzyme
 * Keeps track of RestrictionEnzymes in use by a user,
 * and the names of active restriction enzymes.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.models.UserRestrictionEnzyme", {
    extend: "Ext.data.Model",

    /**
     * Input parameters.
     * @param {Array<Teselagen.models.UserRestrictionEnzymeGroup>} groups The groups of restriction enzymes defined by the user.
     * @param {Array<String>} activeEnzymeNames Names of enzymes currently active.
     */
    fields: [
        {name: "groups", type: "auto", defaultValue: []},
        {name: "activeEnzymeNames", type: "auto", defaultValue: []},
        {name: "active", type: "boolean", defaultValue: false}
    ]
});
