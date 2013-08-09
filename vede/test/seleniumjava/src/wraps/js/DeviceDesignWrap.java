package wraps.js;

import java.util.List;

public class DeviceDesignWrap {
	/*
	fields: [{
        name: "id",
        type: "long"
    }, {
        name: "project_id",
        type: "long"
    }, {
        name: "name",
        type: "String",
        defaultValue: ""
    }],

    validations: [],

    associations: [{
        type: "hasOne",
        model: "Teselagen.models.J5Collection",
        getterName: "getJ5Collection",
        setterName: "setJ5Collection",
        associationKey: "j5collection",
        name: "j5collection" // Note: not a documented config, but specified for getRecordData
    }, {
        type: "hasOne",
        model: "Teselagen.models.SBOLvIconInfo",
        getterName: "getSBOLvIconInfo",
        setterName: "setSBOLvIconInfo",
        associationKey: "sbolvIconInfo"
    }, {
        type: "hasMany",
        model: "Teselagen.models.EugeneRule",
        name: "rules",
        associationKey: "rules"
    }, {
        type: "hasMany",
        model: "Teselagen.models.J5Run",
        name: "j5runs",
        associationKey: "j5runs",
        autoload: true,
        foreignKey: "devicedesign_id"
    }, {
        type: "belongsTo",
        model: "Teselagen.models.Project",
        getterName: "getProject",
        setterName: "setProject",
        associationKey: "project",
        foreignKey: "id"
    }],
	 */
	
	public String id;
	public String project_id;
	public String name;
	public J5CollectionWrap j5collection;
	public SBOLvIconInfoWrap sbolvIconInfo;
	public List<EugeneRuleWrap> rules;
	public List<J5RunWrap> j5runs;
	
	public DeviceDesignWrap() {
		
	}
	
	
}






