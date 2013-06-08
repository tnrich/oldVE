/**
 * @class Teselagen.models.UserRestrictionEnzyme
 * Keeps track of RestrictionEnzymes in use by a user.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.models.UserRestrictionEnzyme", {
    extend: "Ext.data.Model",

    /**
     * @param {String} name The name of the enzyme.
     */
    fields: [
        {name: "name", type: "string", defaultValue: ""}
    ]
});
