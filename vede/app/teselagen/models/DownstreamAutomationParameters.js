/**
 * @class Teselagen.models.DownstreamAutomationParameters
 * Class describing DownstreamAutomationParameters.
 * Use:
 *          downstream = Ext.create("Teselagen.models.DownstreamAutomationParameters", {
 *                  FIELDNAME: newParameter
 *          });
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */

Ext.define("Teselagen.models.DownstreamAutomationParameters", {
    extend: "Ext.data.Model",

    requires: [
    ],

    proxy: {
        type: "memory",
        reader: {type: "json"}
    },

    statics: {
        MDTAZ:            "MAXDELTATEMPERATUREADJACENTZONES",
        MDTROZA:          "MAXDELTATEMPERATUREREACTIONOPTIMUMZONEACCEPTABLE",
        MMCSPZ:           "MAXMCSTEPSPERZONE",
        MWVMP:            "MAXWELLVOLUMEMULTIWELLPLATE",
        MCTF:             "MCTEMPERATUREFINAL",
        MCTI:             "MCTEMPERATUREINITIAL",
        MPV:              "MINPIPETTINGVOLUME",
        NCMP:             "NCOLUMNSMULTIWELLPLATE",
        NRMP:             "NROWSMULTIWELLPLATE",
        TDT:              "TRIALDELTATEMPERATURE",
        WPTZ:             "WELLSPERTHERMOCYCLERZONE",
        ZPTB:             "ZONESPERTHERMOCYCLERBLOCK",
        
        MDTAZ_DESC:       "The maximum difference in temperature (in C) between adjacent zones on the thermocycler block",
        MDTROZA_DESC:     "\"The maximum acceptable difference in temperature (in C) between the optimal annealing temperature of a PCR reaction, and the annealing temperature of the thermocycler block zone it is sitting in\"",
        MMCSPZ_DESC:      "The maximum number of Monte-Carlo steps attempted per thermocycler block zone",
        MWVMP_DESC:       "The maximum liquid volume (in uL) that a well in the multi-well plate can hold",
        MCTF_DESC:        "The final temperature at the end of the Monte-Carlo simulated annealing run (in arbitrary reduced units)",
        MCTI_DESC:        "The initial temperature in the beginning of the Monte-Carlo simulated annealing run (in arbitrary reduced units)",
        MPV_DESC:         "The minimum pipetting volume (e.g. for a robotics platform) (in uL)",
        NCMP_DESC:        "The number of columns in the multi-well plate",
        NRMP_DESC:        "The number of rows in the multi-well plate",
        TDT_DESC:         "The Monte-Carlo step trial change in temperature for a thermocycler block zone",
        WPTZ_DESC:        "The number of wells per thermocycler block zone",
        ZPTB_DESC:        "The number of zones per thermocycler block",
        
        MDTAZ_DEFAULT:    5,
        MDTROZA_DEFAULT:  5,
        MMCSPZ_DEFAULT:   1000,
        MWVMP_DEFAULT:    100,
        MCTF_DEFAULT:     0.0001,

        MCTI_DEFAULT:     0.1,
        MPV_DEFAULT:      5,
        NCMP_DEFAULT:     12,
        NRMP_DEFAULT:     8,
        TDT_DEFAULT:      0.1,

        WPTZ_DEFAULT:     16,
        ZPTB_DEFAULT:     6
    },

    // The Defaults will not kick in. Init will set them if fields are not supplied.
    fields: [
        {name: "id", type: "long"},
        {name: "j5run_id", type: "long"},
        {
            name: "maxDeltaTemperatureAdjacentZonesValue",
            convert: function(v, record) {
                return parseFloat(v) || record.self.MDTAZ_DEFAULT;
            }
        },
        //{name: "maxDeltaTemperatureAdjacentZonesValue",   type: "number",         defaultValue: this.self.MDTAZ_DEFAULT},
        {
            name: "maxDeltaTemperatureReactionOptimumZoneAcceptableValue",
            convert: function(v, record) {
                return parseFloat(v) || record.self.MDTROZA_DEFAULT;
            }
        },
        //  {name: "maxDeltaTemperatureReactionOptimumZoneAcceptableValue",   type: "number",         defaultValue: this.self.MDTROZA_DEFAULT},
        {
            name: "maxMcStepsPerZoneValue",
            convert: function(v, record) {
                return parseFloat(v) || record.self.MMCSPZ_DEFAULT;
            }
        },
        //{name: "maxMcStepsPerZoneValue",                                  type: "int",            defaultValue: this.self.MMCSPZ_DEFAULT},
        {
            name: "maxWellVolumeMultiwellPlateValue",
            convert: function(v, record) {
                return parseFloat(v) || record.self.MWVMP_DEFAULT;
            }
        },
        //{name: "maxWellVolumeMultiwellPlateValue",                        type: "int",            defaultValue: this.self.MWVMP_DEFAULT},
        {
            name: "mcTemperatureFinalValue",
            convert: function(v, record) {
                return parseFloat(v) || record.self.MCTF_DEFAULT;
            }
        },
        //{name: "mcTemperatureFinalValue",                                 type: "number",         defaultValue: this.self.MCTF_DEFAULT},
        {
            name: "mcTemperatureInitialValue",
            convert: function(v, record) {
                return parseFloat(v) || record.self.MCTI_DEFAULT;
            }
        },
        //{name: "mcTemperatureInitialValue",                               type: "number",         defaultValue: this.self.MCTI_DEFAULT},
        {
            name: "minPipettingVolumeValue",
            convert: function(v, record) {
                return parseFloat(v) || record.self.MPV_DEFAULT;
            }
        },
        //{name: "minPipettingVolumeValue",                                 type: "number",         defaultValue: this.self.MPV_DEFAULT},
        {
            name: "nColumnsMultiwellPlateValue",
            convert: function(v, record) {
                return parseFloat(v) || record.self.NCMP_DEFAULT;
            }
        },
        //{name: "nColumnsMultiwellPlateValue",                             type: "int",            defaultValue: this.self.NCMP_DEFAULT},
        {
            name: "nRowsMultiwellPlateValue",
            convert: function(v, record) {
                return parseFloat(v) || record.self.NRMP_DEFAULT;
            }
        },
        //{name: "nRowsMultiwellPlateValue",                                type: "int",            defaultValue: this.self.NRMP_DEFAULT},
        {
            name: "trialDeltaTemperatureValue",
            convert: function(v, record) {
                return parseFloat(v) || record.self.TDT_DEFAULT;
            }
        },
        //{name: "trialDeltaTemperatureValue",                              type: "number",         defaultValue: this.self.TDT_DEFAULT},
        {
            name: "wellsPerThermocyclerZoneValue",
            convert: function(v, record) {
                return parseFloat(v) || record.self.WPTZ_DEFAULT;
            }
        },
        //{name: "wellsPerThermocyclerZoneValue",                           type: "int",            defaultValue: this.self.WPTZ_DEFAULT},
        {
            name: "zonesPerThermocyclerBlockValue",
            convert: function(v, record) {
                return parseFloat(v) || record.self.ZPTB_DEFAULT;
            }
        }
        //{name: "zonesPerThermocyclerBlockValue",                          type: "int",            defaultValue: this.self.ZPTB_DEFAULT}
    ],

    validations: [
    ],

    associations: [
        {
            type: "belongsTo",
            model: "Teselagen.models.J5Run",
            getterName: "getJ5Run",
            setterName: "setJ5Run",
            associationKey: "j5run",
            foreignKey: "j5run_id"
        }
    ],

    // Need this because fields:[] does not actually set the defaults!
    // Keep the inputted values if they are not undefined
    init: function() {
        //console.log("init");
        //console.log(this.data);

        /*if (this.get("maxDeltaTemperatureAdjacentZonesValue") === undefined) {
            this.set("maxDeltaTemperatureAdjacentZonesValue", this.self.MDTAZ_DEFAULT);
        }
        if (this.get("maxDeltaTemperatureReactionOptimumZoneAcceptableValue") === undefined) {
            this.set("maxDeltaTemperatureReactionOptimumZoneAcceptableValue", this.self.MDTROZA_DEFAULT);
        }
        if (this.get("maxMcStepsPerZoneValue") === undefined) {
            this.set("maxMcStepsPerZoneValue", this.self.MMCSPZ_DEFAULT);
        }
        if (this.get("maxWellVolumeMultiwellPlateValue") === undefined) {
            this.set("maxWellVolumeMultiwellPlateValue", this.self.MWVMP_DEFAULT);
        }
        if (this.get("mcTemperatureFinalValue") === undefined) {
            this.set("mcTemperatureFinalValue", this.self.MCTF_DEFAULT);
        }
        if (this.get("mcTemperatureInitialValue") === undefined) {
            this.set("mcTemperatureInitialValue", this.self.MCTI_DEFAULT);
        }
        if (this.get("minPipettingVolumeValue") === undefined) {
            this.set("minPipettingVolumeValue", this.self.MPV_DEFAULT);
        }
        if (this.get("nColumnsMultiwellPlateValue") === undefined) {
            this.set("nColumnsMultiwellPlateValue", this.self.NCMP_DEFAULT);
        }
        if (this.get("nRowsMultiwellPlateValue") === undefined) {
            this.set("nRowsMultiwellPlateValue", this.self.NRMP_DEFAULT);
        }
        if (this.get("trialDeltaTemperatureValue") === undefined) {
            this.set("trialDeltaTemperatureValue", this.self.TDT_DEFAULT);
        }
        if (this.get("wellsPerThermocyclerZoneValue") === undefined) {
            this.set("wellsPerThermocyclerZoneValue", this.self.WPTZ_DEFAULT);
        }
        if (this.get("zonesPerThermocyclerBlockValue") === undefined) {
            this.set("zonesPerThermocyclerBlockValue", this.self.ZPTB_DEFAULT);
        }*/
        //console.log("init");
        //console.log(this.data);
    },

    /**
     * Stringifies the Parameters
     * @return {String} paramString String form of parameters to pass to J5
     */
    createParameterString: function() {
        var returnString = "Parameter Name,Value,Default Value,Description\n" +
            this.self.MDTAZ + "," + this.get("maxDeltaTemperatureAdjacentZonesValue").toString() + "," + this.self.MDTAZ_DEFAULT + "," + this.self.MDTAZ_DESC + "\n" +
            this.self.MDTROZA + "," + this.get("maxDeltaTemperatureReactionOptimumZoneAcceptableValue").toString() + "," + this.self.MDTROZA_DEFAULT + "," + this.self.MDTROZA_DESC + "\n" +
            this.self.MMCSPZ + "," + this.get("maxMcStepsPerZoneValue").toString() + "," + this.self.MMCSPZ_DEFAULT + "," + this.self.MMCSPZ_DESC + "\n" +
            this.self.MWVMP + "," + this.get("maxWellVolumeMultiwellPlateValue").toString() + "," + this.self.MWVMP_DEFAULT + "," + this.self.MWVMP_DESC + "\n" +
            this.self.MCTF + "," + this.get("mcTemperatureFinalValue").toString() + "," + this.self.MCTF_DEFAULT + "," + this.self.MCTF_DESC + "\n" +
            this.self.MCTI + "," + this.get("mcTemperatureInitialValue").toString() + "," + this.self.MCTI_DEFAULT + "," + this.self.MCTI_DESC + "\n" +
            this.self.MPV + "," + this.get("minPipettingVolumeValue").toString() + "," + this.self.MPV_DEFAULT + "," + this.self.MPV_DESC + "\n" +
            this.self.NCMP + "," + this.get("nColumnsMultiwellPlateValue").toString() + "," + this.self.NCMP_DEFAULT + "," + this.self.NCMP_DESC + "\n" +
            this.self.NRMP + "," + this.get("nRowsMultiwellPlateValue").toString() + "," + this.self.NRMP_DEFAULT + "," + this.self.NRMP_DESC + "\n" +
            this.self.TDT + "," + this.get("trialDeltaTemperatureValue").toString() + "," + this.self.TDT_DEFAULT + "," + this.self.TDT_DESC + "\n" +
            this.self.WPTZ + "," + this.get("wellsPerThermocyclerZoneValue").toString() + "," + this.self.WPTZ_DEFAULT + "," + this.self.WPTZ_DESC + "\n" +
            this.self.ZPTB + "," + this.get("zonesPerThermocyclerBlockValue").toString() + "," + this.self.ZPTB_DEFAULT + "," + this.self.ZPTB_DESC + "\n";
        return returnString;
    },

    setDefaultValues: function() {

        this.set("maxDeltaTemperatureAdjacentZonesValue", this.self.MDTAZ_DEFAULT);
        this.set("maxDeltaTemperatureReactionOptimumZoneAcceptableValue", this.self.MDTROZA_DEFAULT);
        this.set("maxMcStepsPerZoneValue", this.self.MMCSPZ_DEFAULT);
        this.set("maxWellVolumeMultiwellPlateValue", this.self.MWVMP_DEFAULT);
        this.set("mcTemperatureFinalValue", this.self.MCTF_DEFAULT);
        this.set("mcTemperatureInitialValue", this.self.MCTI_DEFAULT);
        this.set("minPipettingVolumeValue", this.self.MPV_DEFAULT);
        this.set("nColumnsMultiwellPlateValue", this.self.NCMP_DEFAULT);
        this.set("nRowsMultiwellPlateValue", this.self.NRMP_DEFAULT);
        this.set("trialDeltaTemperatureValue", this.self.TDT_DEFAULT);
        this.set("wellsPerThermocyclerZoneValue", this.self.WPTZ_DEFAULT);
        this.set("zonesPerThermocyclerBlockValue", this.self.ZPTB_DEFAULT);

    }


 });