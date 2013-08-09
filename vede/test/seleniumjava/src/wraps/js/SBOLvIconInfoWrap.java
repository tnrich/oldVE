package wraps.js;

public class SBOLvIconInfoWrap {
	
	/*
	  fields: [
        {name: "id",                    type: "long"},
        {name: "devicedesign_id",       type: "long"},
        {name: "name",                  type: "string",     defaultValue: ""},
        {name: "forwardPath",           type: "string",     defaultValue: ""},
        {name: "reversePath",           type: "string",     defaultValue: ""}
    ],

    validations: [
        {field: "id", type: "presence"}
    ],

    associations: [
        {
            type: "belongsTo",
            model: "Teselagen.models.DeviceDesign",
            foreignKey: "devicedesign_id",
            getterName: "getDeviceDesign",
            setterName: "setDeviceDesign"
        }
    ],
	 */
	
	public String id;
	public String devicedesign_id;
	public String name;
	public String forwardPath;
	public String reversePath;
	
	public SBOLvIconInfoWrap() {
		
	}
	
	
	
	
	
}




