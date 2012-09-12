package org.jbei.registry
{
    public class EmbeddedFiles
    {
        [Embed("assets/exampleFiles/SLIC_Gibson_CPEC_example.xml", mimeType="application/octet-stream")]
        private static const SLIC_EXAMPLE_FILE:Class;
        
        [Embed("assets/exampleFiles/Combinatorial_SLIC_Gibson_CPEC_example.xml", mimeType="application/octet-stream")]
        private static const COMBINATORIAL_SLIC_EXAMPLE_FILE:Class;
        
        [Embed("assets/exampleFiles/Golden_Gate_example.xml", mimeType="application/octet-stream")]
        private static const GOLDEN_GATE_EXAMPLE_FILE:Class;
        
        [Embed("assets/exampleFiles/Combinatorial_Golden_Gate_example.xml", mimeType="application/octet-stream")]
        private static const COMBINATORIAL_GOLDEN_GATE_EXAMPLE_FILE:Class;
        
        public static function get slicExampleFile():String
        {
            return (new SLIC_EXAMPLE_FILE()).toString();
        }
        
        public static function get combinatorialSlicExampleFile():String
        {
            return (new COMBINATORIAL_SLIC_EXAMPLE_FILE()).toString();
        }
        
        public static function get goldenGateExampleFile():String
        {
            return (new GOLDEN_GATE_EXAMPLE_FILE()).toString();
        }
        
        public static function get combinatorialGoldenGateExampleFile():String
        {
            return (new COMBINATORIAL_GOLDEN_GATE_EXAMPLE_FILE()).toString();
        }
    }
}