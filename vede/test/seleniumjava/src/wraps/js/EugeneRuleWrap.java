package wraps.js;

public class EugeneRuleWrap {
	
	/*
	 {name: "operand1_id",   type: "long"},
     {name: "operand2_id",   type: "long"},
     {name: "name", type: "String"},
     {name: "originalRuleLine",      type: "String",    defaultValue: ""},
	 {name: "negationOperator",      type: "boolean",    defaultValue: false},
     {name: "compositionalOperator", type: "String"},
 	 {name: "operand2isNumber",      type: "boolean",    defaultValue: false},
     {name: "operand2Number",        type: "number",     defaultValue: 0},
     associations: [
        // Operand1 is always a Part
        {
            type: "hasOne",
            model: "Teselagen.models.Part",
            getterName: "getOperand1",
            setterName: "setOperand1",
//            associationKey: "operand1",
            instanceName: "operand1",
            foreignKey: "operand1_id" 
        },
        // Operand2 can be a Part or a Number; If Part, then store here.
        {
            type: "hasOne",
            model: "Teselagen.models.Part",
            getterName: "getOperand2Part",
            setterName: "setOperand2Part",
//            associationKey: "operand2Part",
            instanceName: "operand2",
            foreignKey: "operand2_id" 

        }
    ],
	 */
	
	public String operand1_id;
	public String operand2_id;
	public String name;
	public String originalRuleLine;
	public boolean negationOperator;
	public String compositionalOperator;
	public boolean operand2isNumber;
	public String operand2Number; //MAYBE CHANGE TO SOME SORT OF NUMBER
	
	public EugeneRuleWrap() {
		
	}
	
	
}







