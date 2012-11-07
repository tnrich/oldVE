/**
 * @class Teselagen.models.UserRestrictionEnzymeGroup
 * User-defined group of restriction enzymes.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
 Ext.define("Teselagen.models.UserRestrictionEnzymeGroup", {
     extend: "Ext.data.Model",
     
     requires: ["Teselagen.models.UserRestrictionEnzyme"],

     /**
      * Input parameters.
      * @param {String} name The name assigned to the group of enzymes.
      */
     fields: [
         { name: "id", type: "long"},
         { name: "user_id", type: "long"},
         {name: "name", type: "string", defaultValue: ""}
     ],

     associations: [{
         type: "hasMany",
         model: "Teselagen.models.UserRestrictionEnzyme",
         name: "userRestrictionEnzymes",
         associationKey: "userRestrictionEnzymes",
         foreignKey: "uregroup_id"
     }]
 });
