package org.jbei.registry.models
{
    public class DownstreamAutomationParameters
    {
        public static const MDTAZ:String = "MAXDELTATEMPERATUREADJACENTZONES";
        public static const MDTROZA:String = "MAXDELTATEMPERATUREREACTIONOPTIMUMZONEACCEPTABLE";
        public static const MMCSPZ:String = "MAXMCSTEPSPERZONE";
        public static const MWVMP:String = "MAXWELLVOLUMEMULTIWELLPLATE";
        public static const MCTF:String = "MCTEMPERATUREFINAL";
        public static const MCTI:String = "MCTEMPERATUREINITIAL";
        public static const MPV:String = "MINPIPETTINGVOLUME";
        public static const NCMP:String = "NCOLUMNSMULTIWELLPLATE";
        public static const NRMP:String = "NROWSMULTIWELLPLATE";
        public static const TDT:String = "TRIALDELTATEMPERATURE";
        public static const WPTZ:String = "WELLSPERTHERMOCYCLERZONE";
        public static const ZPTB:String = "ZONESPERTHERMOCYCLERBLOCK";
        
        public static const MDTAZ_DESC:String = "The maximum difference in temperature (in C) between adjacent zones on the thermocycler block";
        public static const MDTROZA_DESC:String = "\"The maximum acceptable difference in temperature (in C) between the optimal annealing temperature of a PCR reaction, and the annealing temperature of the thermocycler block zone it is sitting in\"";
        public static const MMCSPZ_DESC:String = "The maximum number of Monte-Carlo steps attempted per thermocycler block zone";
        public static const MWVMP_DESC:String = "The maximum liquid volume (in uL) that a well in the multi-well plate can hold";
        public static const MCTF_DESC:String = "The final temperature at the end of the Monte-Carlo simulated annealing run (in arbitrary reduced units)";
        public static const MCTI_DESC:String = "The initial temperature in the beginning of the Monte-Carlo simulated annealing run (in arbitrary reduced units)";
        public static const MPV_DESC:String = "The minimum pipetting volume (e.g. for a robotics platform) (in uL)";
        public static const NCMP_DESC:String = "The number of columns in the multi-well plate";
        public static const NRMP_DESC:String = "The number of rows in the multi-well plate";
        public static const TDT_DESC:String = "The Monte-Carlo step trial change in temperature for a thermocycler block zone";
        public static const WPTZ_DESC:String = "The number of wells per thermocycler block zone";
        public static const ZPTB_DESC:String = "The number of zones per thermocycler block";
        
        public static const MDTAZ_DEFAULT:Number = 5;
        public static const MDTROZA_DEFAULT:Number = 5;
        public static const MMCSPZ_DEFAULT:int = 1000;
        public static const MWVMP_DEFAULT:int = 100;
        public static const MCTF_DEFAULT:Number = 0.0001;
        public static const MCTI_DEFAULT:Number = 0.1;
        public static const MPV_DEFAULT:Number = 5;
        public static const NCMP_DEFAULT:int = 12;
        public static const NRMP_DEFAULT:int = 8;
        public static const TDT_DEFAULT:Number = 0.1;
        public static const WPTZ_DEFAULT:int = 16;
        public static const ZPTB_DEFAULT:int = 6;
        
        private var _maxDeltaTemperatureAdjacentZonesValue:Number;
        private var _maxDeltaTemperatureReactionOptimumZoneAcceptableValue:Number;
        private var _maxMcStepsPerZoneValue:int;
        private var _maxWellVolumeMultiwellPlateValue:int;
        private var _mcTemperatureFinalValue:Number;
        private var _mcTemperatureInitialValue:Number;
        private var _minPipettingVolumeValue:Number;
        private var _nColumnsMultiwellPlateValue:int;
        private var _nRowsMultiwellPlateValue:int;
        private var _trialDeltaTemperatureValue:Number;
        private var _wellsPerThermocyclerZoneValue:int;
        private var _zonesPerThermocyclerBlockValue:int;
        
        // Constructor
        public function DownstreamAutomationParameters()
        {
            setDefaultValues()
        }
        
        // Properties
        public function get maxDeltaTemperatureAdjacentZonesValue():Number
        {
            return _maxDeltaTemperatureAdjacentZonesValue;
        }
        
        public function set maxDeltaTemperatureAdjacentZonesValue(n:Number):void
        {
            _maxDeltaTemperatureAdjacentZonesValue = n;
        }
        
        public function get maxDeltaTemperatureReactionOptimumZoneAcceptableValue():Number
        {
            return _maxDeltaTemperatureReactionOptimumZoneAcceptableValue;
        }
        
        public function set maxDeltaTemperatureReactionOptimumZoneAcceptableValue(n:Number):void
        {
            _maxDeltaTemperatureReactionOptimumZoneAcceptableValue = n;
        }
        
        public function get maxMcStepsPerZoneValue():int
        {
            return _maxMcStepsPerZoneValue;
        }
        
        public function set maxMcStepsPerZoneValue(i:int):void
        {
            _maxMcStepsPerZoneValue = i;
        }
        
        public function get maxWellVolumeMultiwellPlateValue():int
        {
            return _maxWellVolumeMultiwellPlateValue;
        }
        
        public function set maxWellVolumeMultiwellPlateValue(i:int):void
        {
            _maxWellVolumeMultiwellPlateValue = i;
        }
        
        public function get mcTemperatureFinalValue():Number
        {
            return _mcTemperatureFinalValue;
        }
        
        public function set mcTemperatureFinalValue(n:Number):void
        {
            _mcTemperatureFinalValue = n;
        }
        
        public function get mcTemperatureInitialValue():Number
        {
            return _mcTemperatureInitialValue;
        }
        
        public function set mcTemperatureInitialValue(n:Number):void
        {
            _mcTemperatureInitialValue = n;
        }
        
        public function get minPipettingVolumeValue():Number
        {
            return _minPipettingVolumeValue;
        }
        
        public function set minPipettingVolumeValue(n:Number):void
        {
            _minPipettingVolumeValue = n;
        }
        
        public function get nColumnsMultiwellPlateValue():int
        {
            return _nColumnsMultiwellPlateValue;
        }
        
        public function set nColumnsMultiwellPlateValue(i:int):void
        {
            _nColumnsMultiwellPlateValue = i;
        }
        
        public function get nRowsMultiwellPlateValue():int
        {
            return _nRowsMultiwellPlateValue;
        }
        
        public function set nRowsMultiwellPlateValue(i:int):void
        {
            _nRowsMultiwellPlateValue = i;
        }
        
        public function get trialDeltaTemperatureValue():Number
        {
            return _trialDeltaTemperatureValue;
        }
        
        public function set trialDeltaTemperatureValue(n:Number):void
        {
            _trialDeltaTemperatureValue = n;
        }
        
        public function get wellsPerThermocyclerZoneValue():int
        {
            return _wellsPerThermocyclerZoneValue;
        }
        
        public function set wellsPerThermocyclerZoneValue(i:int):void
        {
            _wellsPerThermocyclerZoneValue = i;
        }
        
        public function get zonesPerThermocyclerBlockValue():int
        {
            return _zonesPerThermocyclerBlockValue;
        }
        
        public function set zonesPerThermocyclerBlockValue(i:int):void
        {
            _zonesPerThermocyclerBlockValue = i;
        }
        
        // Public Methods
        public function createParameterString():String
        {
            var returnString:String = "Parameter Name,Value,Default Value,Description\n"
                + MDTAZ + "," + _maxDeltaTemperatureAdjacentZonesValue.toString() + "," + MDTAZ_DEFAULT + "," + MDTAZ_DESC + "\n"
                + MDTROZA + "," + _maxDeltaTemperatureReactionOptimumZoneAcceptableValue.toString() + "," + MDTROZA_DEFAULT + "," + MDTROZA_DESC + "\n"
                + MMCSPZ + "," + _maxMcStepsPerZoneValue.toString() + "," + MMCSPZ_DEFAULT + "," + MMCSPZ_DESC + "\n"
                + MWVMP + "," + _maxWellVolumeMultiwellPlateValue.toString() + "," + MWVMP_DEFAULT + "," + MWVMP_DESC + "\n"
                + MCTF + "," + _mcTemperatureFinalValue.toString() + "," + MCTF_DEFAULT + "," + MCTF_DESC + "\n"
                + MCTI + "," + _mcTemperatureInitialValue.toString() + "," + MCTI_DEFAULT + "," + MCTI_DESC + "\n"
                + MPV + "," + _minPipettingVolumeValue.toString() + "," + MPV_DEFAULT + "," + MPV_DESC + "\n"
                + NCMP + "," + _nColumnsMultiwellPlateValue.toString() + "," + NCMP_DEFAULT + "," + NCMP_DESC + "\n"
                + NRMP + "," + _nRowsMultiwellPlateValue.toString() + "," + NRMP_DEFAULT + "," + NRMP_DESC + "\n"
                + TDT + "," + _trialDeltaTemperatureValue.toString() + "," + TDT_DEFAULT + "," + TDT_DESC + "\n"
                + WPTZ + "," + _wellsPerThermocyclerZoneValue.toString() + "," + WPTZ_DEFAULT + "," + WPTZ_DESC + "\n"
                + ZPTB + "," + _zonesPerThermocyclerBlockValue.toString() + "," + ZPTB_DEFAULT + "," + ZPTB_DESC + "\n";

            return returnString;
        }
        
        // Private Methods
        private function setDefaultValues():void
        {
            _maxDeltaTemperatureAdjacentZonesValue = MDTAZ_DEFAULT;
            _maxDeltaTemperatureReactionOptimumZoneAcceptableValue = MDTROZA_DEFAULT;
            _maxMcStepsPerZoneValue = MMCSPZ_DEFAULT;
            _maxWellVolumeMultiwellPlateValue = MWVMP_DEFAULT;
            _mcTemperatureFinalValue = MCTF_DEFAULT;
            _mcTemperatureInitialValue = MCTI_DEFAULT;
            _minPipettingVolumeValue = MPV_DEFAULT;
            _nColumnsMultiwellPlateValue = NCMP_DEFAULT;
            _nRowsMultiwellPlateValue = NRMP_DEFAULT;
            _trialDeltaTemperatureValue = TDT_DEFAULT;
            _wellsPerThermocyclerZoneValue = WPTZ_DEFAULT;
            _zonesPerThermocyclerBlockValue = ZPTB_DEFAULT;
        }
    }
}