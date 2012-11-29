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
     * @param {String} name The name of the enzyme.
     * @param {Boolean} active Denotes that enzyme is active.
     */
    fields: [
        { name: "id", type: "long"},
        { name: "uregroup_id", type: "long"},
        {name: "name", type: "string", defaultValue: ""},
        {name: "active", type: "boolean", defaultValue: false}
    ],
    associations: [
         {
             type: "belongsTo",
             model: "Teselagen.models.UserRestrictionEnzymeGroup",
             getterName: "getUserRestrictionEnzymeGroup",
             setterName: "setUserRestrictionEnzymeGroup",
             associationKey: "userRestrictionEnzymeGroup",
             foreignKey: "uregroup_id"
         }
     ]

});
