package wraps.js;

import java.util.List;

public class UserRestrictionEnzymeGroupWrap {
	
	/*
	fields: [
         {name: "name", type: "string", defaultValue: ""}
     ],

     associations: [
         {
             type: "hasMany",
             model: "Teselagen.models.UserRestrictionEnzyme",
             name: "userRestrictionEnzymes",
             associationKey: "userRestrictionEnzymes"
         }
     ]
	 */
	
	public String name;
	public List<UserRestrictionEnzymeWrap> userRestrictionEnzymes;	
	
	public UserRestrictionEnzymeGroupWrap() {
		
	}
	
	
}








