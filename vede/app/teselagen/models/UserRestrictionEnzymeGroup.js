/**
 * @class Teselagen.models.UserRestrictionEnzymeGroup
 * User-defined group of restriction enzymes.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
 Ext.define("Teselagen.models.UserRestrictionEnzymeGroup", {
     extend: "Ext.data.Model",

     /**
      * Input parameters.
      * @param {String} groupName The name assigned to the group of enzymes.
      * @param {Array<String>} enzymeNames The names of enzymes in the group.
      */
     fields: [
         {name: "groupName", type: "string", defaultValue: ""},
         {name: "enzymeNames", type: "auto", defaultValue: []}
     ],

     associations: [{
         type: 'hasMany',
         model: 'Teselagen.models.UserRestrictionEnzymes',
         name: 'restrictionEnzymes',
         foreignKey: 'userGroups'
     }]
 });
