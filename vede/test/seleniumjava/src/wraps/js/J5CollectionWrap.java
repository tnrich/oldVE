package wraps.js;

import java.util.List;

public class J5CollectionWrap {
	
	/*
	 fields: [
        {name: "j5Ready",           type: "boolean",    defaultValue: false},
        {name: "combinatorial",     type: "boolean",    defaultValue: false},
        {name: "isCircular",        type: "boolean",    defaultValue: true}
    ],

    associations: [
        {
            type: "hasMany",
            model: "Teselagen.models.J5Bin",
            name: "bins"
//            foreignKey: "j5collection_id"
        }
	 */
	
	public boolean j5Ready;
	public boolean combinatorial;
	public boolean isCircular;
	public List<J5BinWrap> bins;
	
	public J5CollectionWrap() {
		
	}
	
	
	
	
}
