package wraps.js;

import java.util.List;

public class UserWrap {
	
	/*
	 fields: [{
        name: "id",
        type: "long"
    }, {
        name: "preferences_id",
        type: "long"
    }, {
        name: "username",
        type: "String"
    }],
    associations: [{
        type: "hasMany",
        model: "Teselagen.models.Project",
        name: "projects",
        associationKey: "projects",
        autoLoad: true,
        foreignKey: "user_id"
    }, {
        type: "hasOne",
        model: "Teselagen.models.Preferences",
        associationKey: "preferences",
        getterName: "getPreferences",
        setterName: "setPreferences",
        foreignKey: "preferences_id"
    }, {
        type: "hasMany",
        model: "Teselagen.models.UserRestrictionEnzymeGroup",
        name: "userRestrictionEnzymeGroups",
        associationKey: "userRestrictionEnzymeGroups",
        autoLoad: true,
        foreignKey: "user_id"
    }],
	 */
	
	public String id;
	public String preferences_id;
	public String username;
	public List<ProjectWrap> projects;
	public List<UserRestrictionEnzymeGroupWrap> userRestrictionEnzymeGroups;
	
	public UserWrap() {
		
	}
	
	
	
}







