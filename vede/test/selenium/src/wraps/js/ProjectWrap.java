package wraps.js;

import java.util.List;

public class ProjectWrap {
	/* fields: [{
        name: "id",
        type: "long"
    }, {
        name: "user_id",
        type: "long"
    }, {
        name: "name",
        type: "String",
        defaultValue: ""
    }, {
        name: "dateCreated",
        type: "date"
    }, {
        name: "dateModified",
        type: "date"
    }],
    
    associations: [{
        type: "hasMany",
        model: "Teselagen.models.DeviceDesign",
        name: "designs",
        associationKey: "designs",
        foreignKey: "project_id"
    }, {
        type: "hasMany",
        model: "Teselagen.models.SequenceFile",
        name: "sequences",
        associationKey: "sequences",
        foreignKey: "project_id"
    }, {
        type: "hasMany",
        model: "Teselagen.models.Part",
        name: "parts",
        associationKey: "parts",
        foreignKey: "project_id"
    }, {
        type: "belongsTo",
        model: "Teselagen.models.User",
        getterName: "getUser",
        setterName: "setUser",
        associationKey: "user",
        foreignKey: "user_id"
    }],*/
	
	public String id;
	public String user_id;
	public String name;
	public String dateCreated;
	public String dateModified;
	public List<DeviceDesignWrap> designs;
	public List<SequenceFileWrap> sequences;
	public List<PartWrap> parts;
	
	public ProjectWrap() {
		
	}
	
	
}




