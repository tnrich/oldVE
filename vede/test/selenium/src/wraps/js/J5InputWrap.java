package wraps.js;

public class J5InputWrap {
	
	/*
		{name: "j5parameters_id",           type: "long"},
        {name: "automationparameters_id",   type: "long"}
    ],

    validations: [

    ],

    associations: [
        {
            type: "hasOne",
            model: "Teselagen.models.J5Parameters",
            getterName: "getJ5Parameters",
            setterName: "setJ5Parameters",
            associationKey: "j5Parameters",
            foreignKey: "j5parameters_id"
        },
        {
            type: "hasOne",
            model: "Teselagen.models.DownstreamAutomationParameters",
            getterName: "getDownstreamAutomationParameters",
            setterName: "setDownstreamAutomationParameters",
            associationKey: "downstreamAutomationParameters",
            foreignKey: "automationparameters_id"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.J5Run",
            getterName: "getJ5Run",
            setterName: "setJ5Run",
            associationKey: "j5run",
            foreignKey: "j5run_id"
        }
    ]
	 */
	
	public String j5parameters_id;
	public String automationparameters_id;
	public J5ParametersWrap j5Parameters;
	public DownstreamAutomationParametersWrap downstreamAutomationParameters;
	public J5RunWrap j5run;
	
	public J5InputWrap() {
		
	}
	
	
}







