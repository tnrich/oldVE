package wraps.js;

public class J5RunWrap {
	
	/*
	fields: [
        {name: "id",            type: "long"},
        {name: "file_id",            type: "long"},
        {name: "comment",          type: "String", defaultValue: ""},

        // meta info
        {name: "date",          type: "Date",     defaultValue: "",
            convert: function(v, record) {
                    var date = new Date(v);
                    return date;
                }
        },
        {name: "endDate",          type: "Date",     defaultValue: "",
            convert: function(v, record) {
                var date = new Date(v);
                return date;
            }
        },
        {name: "assemblyType",  type: "String",     defaultValue: ""}, // Combinatorial or Not
        {name: "assemblyMethod",  type: "String",     defaultValue: ""}, // Combinatorial or Not
        {name: "status",        type: "String",     defaultValue: ""}, // Thread execution Status flag (Pending, Finished)
        {name: "warnings",        type: "String",     defaultValue: ""},

        // IDs
        {name: "devicedesign_id",  type: "long"}
    ],
    associations: [
        {
            // j5Parameters and Assembly files sent
            type: "hasOne",
            model: "Teselagen.models.J5Input",
            getterName: "getJ5Input",
            setterName: "setJ5Input",
            associationKey: "j5Input"
        },
        {
            // Processed j5 Output
            type: "hasOne",
            model: "Teselagen.models.J5Results",
            getterName: "getJ5Results",
            setterName: "setJ5Results",
            associationKey: "j5Results"
        }
    ]
	 */
	
	public String id;
	public String file_id;
	public String comment;
	public String date;
	public String endDate;
	public String assemblyType;
	public String assemblyMethod;
	public String status;
	public String warnings;
	public String devicedesign_id;
	public J5InputWrap j5Input;
	public J5ResultsWrap j5Results;
	
	public J5RunWrap() {
		
	}
	
	
	
}





