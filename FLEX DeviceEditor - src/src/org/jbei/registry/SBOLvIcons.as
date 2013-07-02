package org.jbei.registry
{
    import mx.collections.ArrayCollection;
    import mx.controls.Alert;
    import mx.controls.Image;
    
    import org.jbei.registry.models.SBOLvIconInfo;
    
    public class SBOLvIcons
    {
        public static const ASSEMBLY_JUNCTION:String = "assembly_junction";
        public static const CDS:String = "cds";
        public static const FIVE_PRIME_OVERHANG:String = "five_prime_overhang";
        public static const FIVE_PRIME_UTR:String = "five_prime_utr";
        public static const GENERIC:String = "generic";
        public static const INSULATOR:String = "insulator";
        public static const OPERATOR_SITE:String = "operator_site";
        public static const ORIGIN_OF_REPLICATION:String = "origin_of_replication";
        public static const PRIMER_BINDING_SITE:String = "primer_binding_site";
        public static const PROMOTER:String = "promoter";
        public static const PROTEASE_SITE:String = "protease_site";
        public static const PROTEIN_STABILITY_ELEMENT:String = "protein_stability_element";
        public static const RESTRICTION_ENZYME_RECOGNITION_SITE:String = "restriction_enzyme_recognition_site";
        public static const RESTRICTION_SITE_NO_OVERHANG:String = "restriction_site_no_overhang";
        public static const RIBONUCLEASE_SITE:String = "ribonuclease_site";
        public static const RNA_STABILITY_ELEMENT:String = "rna_stability_element";
        public static const SIGNATURE:String = "signature";
        public static const TERMINATOR:String = "terminator";
        public static const THREE_PRIME_OVERHANG:String = "three_prime_overhang";
        
        private static var _iconInfoMap:Object;
        private static var _sbolvIconsDataProvider:ArrayCollection;
        
        private static var sbolv09To10Map:Object = {
            "": GENERIC, 
            "sbol/png/CentralDogma/Forward_Constitutive_Promoter.png": PROMOTER, 
            "sbol/png/CentralDogma/Forward_Inducible_Promoter.png": PROMOTER, 
            "sbol/png/CentralDogma/Forward_Inducible_Promoter_with_Downstream_Operator.png": PROMOTER, 
            "sbol/png/CentralDogma/Forward_Promoter_with_Downstream_Operator.png": PROMOTER, 
            "sbol/png/CentralDogma/Forward_Promoter_with_Upstream_and_Downstream_Operators.png": PROMOTER, 
            "sbol/png/CentralDogma/Forward_Promoter_with_Upstream_Operator.png": PROMOTER, 
            "sbol/png/CentralDogma/Forward_Repressible_Promoter.png": PROMOTER, 
            "sbol/png/CentralDogma/Forward_Repressible_Promoter_with_Downstream_Operator.png": PROMOTER, 
            "sbol/png/CentralDogma/Forward_Open_Reading_Frame.png": CDS, 
            "sbol/png/CentralDogma/Forward_Primer_Site.png": PRIMER_BINDING_SITE, 
            "sbol/png/CentralDogma/Bidirectional_Terminator.png": TERMINATOR, 
            "sbol/png/CentralDogma/Forward_Terminator.png": TERMINATOR, 
            "sbol/png/CentralDogma/Forward_Translation_Start_Site.png": FIVE_PRIME_UTR, 
            "sbol/png/CentralDogma/Origin_of_Replication.png": ORIGIN_OF_REPLICATION, 
            "sbol/png/CentralDogma/Shorthand_Origin_of_Replication.png": ORIGIN_OF_REPLICATION, 
            "sbol/png/CentralDogma/Protease_Site.png": PROTEASE_SITE, 
            "sbol/png/CentralDogma/Ribonuclease_Site.png": RIBONUCLEASE_SITE, 
            "sbol/png/CentralDogma/Protein_Degradation_Element,_Intermediate.png": PROTEIN_STABILITY_ELEMENT, 
            "sbol/png/CentralDogma/RNA_Stability_Element,_Intermediate.png": RNA_STABILITY_ELEMENT, 
            "sbol/png/CentralDogma/Protein_Degradation_Element,_Stable.png": PROTEIN_STABILITY_ELEMENT, 
            "sbol/png/CentralDogma/RNA_Stability_Element,_Stable.png": RNA_STABILITY_ELEMENT, 
            "sbol/png/CentralDogma/Protein_Degradation_Element,_Unstable.png": PROTEIN_STABILITY_ELEMENT, 
            "sbol/png/CentralDogma/RNA_Stability_Element,_Unstable.png": RNA_STABILITY_ELEMENT, 
            "sbol/png/GeneticEngineering/3_Overhang_Restriction_Site.png": THREE_PRIME_OVERHANG, 
            "sbol/png/GeneticEngineering/5_Overhang_Restriction_Site.png": FIVE_PRIME_OVERHANG, 
            "sbol/png/GeneticEngineering/Blunt_Restriction_Site.png": RESTRICTION_SITE_NO_OVERHANG, 
            "sbol/png/GeneticEngineering/Forward_Barcode.png": SIGNATURE, 
            "sbol/png/GeneticEngineering/Prefix.png": GENERIC, 
            "sbol/png/GeneticEngineering/Shorthand_Prefix.png": GENERIC, 
            "sbol/png/GeneticEngineering/Suffix.png": GENERIC, 
            "sbol/png/GeneticEngineering/Shorthand_Suffix.png": GENERIC, 
            "sbol/png/GeneticEngineering/Scar.png": ASSEMBLY_JUNCTION, 
            "sbol/png/GeneticEngineering/Shorthand_Scar.png": ASSEMBLY_JUNCTION
        };
        
        private static function get iconInfoMap():Object
        {
            if (_iconInfoMap == null) {
                initializeIconInfoMap();
            }
            
            return _iconInfoMap;
        }
        
        public static function getIconInfo(id:String):SBOLvIconInfo
        {
            return iconInfoMap[id];
        }
        
        public static function getIconPath(id:String, forward:Boolean):String
        {
            var iconInfo:SBOLvIconInfo = iconInfoMap[id];
            
            if (iconInfo == null) {
                throw new Error("Icon ID " + id + " not recognized.");
            }
            
            if (forward) {
                return iconInfo.forwardPath;
            } else {
                return iconInfo.reversePath;
            }
        }
        
        public static function get sbolvIconsDataProvider():ArrayCollection
        {
            if (_sbolvIconsDataProvider == null) {
                _sbolvIconsDataProvider = new ArrayCollection();
                
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.PROMOTER));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.OPERATOR_SITE));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.CDS));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.FIVE_PRIME_UTR));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.TERMINATOR));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.INSULATOR));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.RIBONUCLEASE_SITE));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.RNA_STABILITY_ELEMENT));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.PROTEASE_SITE));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.PROTEIN_STABILITY_ELEMENT));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.ORIGIN_OF_REPLICATION));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.PRIMER_BINDING_SITE));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.RESTRICTION_ENZYME_RECOGNITION_SITE));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.FIVE_PRIME_OVERHANG));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.THREE_PRIME_OVERHANG));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.RESTRICTION_SITE_NO_OVERHANG));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.ASSEMBLY_JUNCTION));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.SIGNATURE));
                _sbolvIconsDataProvider.addItem(SBOLvIcons.getIconInfo(SBOLvIcons.GENERIC));
            }
            
            return _sbolvIconsDataProvider;
        }
        
        /** 
         * Converts the imagePath obtained from the design XML into an icon ID. 
         * This maps paths corresponding to SBOLv 0.9 images to IDs of SBOLv 1.0 
         * images. 
         * 
         * @param imagePath  a string containing an image path (relative to 
         *                   the parent of the sbol directory) as obtained 
         *                   from the design XML to be loaded
         * 
         * @return           a string storing the icon ID of the SBOLv 1.0 icon 
         *                   to be used. If the imagePath is not recognized, 
         *                   returns null. 
         */
        public static function sbolv09PathToSbolv10ID(imagePath:String):String
        {
            return sbolv09To10Map[imagePath];
        }
        
        private static function initializeIconInfoMap():void
        {
            _iconInfoMap = new Object();
            _iconInfoMap[ASSEMBLY_JUNCTION] = new SBOLvIconInfo(ASSEMBLY_JUNCTION, "Assembly Junction", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/assembly_junction.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/assembly_junction_reverse.png");
            _iconInfoMap[CDS] = new SBOLvIconInfo(CDS, "CDS", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/cds.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/cds_reverse.png");
            _iconInfoMap[FIVE_PRIME_OVERHANG] = new SBOLvIconInfo(FIVE_PRIME_OVERHANG, "5' Overhang", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/five_prime_overhang.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/five_prime_overhang_reverse.png");
            _iconInfoMap[FIVE_PRIME_UTR] = new SBOLvIconInfo(FIVE_PRIME_UTR, "5' UTR", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/five_prime_utr.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/five_prime_utr_reverse.png");
            _iconInfoMap[GENERIC] = new SBOLvIconInfo(GENERIC, "Generic", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/generic.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/generic_reverse.png");
            _iconInfoMap[INSULATOR] = new SBOLvIconInfo(INSULATOR, "Insulator", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/insulator.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/insulator_reverse.png");
            _iconInfoMap[OPERATOR_SITE] = new SBOLvIconInfo(OPERATOR_SITE, "Operator Site", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/operator_site.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/operator_site_reverse.png");
            _iconInfoMap[ORIGIN_OF_REPLICATION] = new SBOLvIconInfo(ORIGIN_OF_REPLICATION, "Origin of Replication", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/origin_of_replication.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/origin_of_replication_reverse.png");
            _iconInfoMap[PRIMER_BINDING_SITE] = new SBOLvIconInfo(PRIMER_BINDING_SITE, "Primer Binding Site", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/primer_binding_site.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/primer_binding_site_reverse.png");
            _iconInfoMap[PROMOTER] = new SBOLvIconInfo(PROMOTER, "Promoter", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/promoter.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/promoter_reverse.png");
            _iconInfoMap[PROTEASE_SITE] = new SBOLvIconInfo(PROTEASE_SITE, "Protease Site", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/protease_site.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/protease_site_reverse.png");
            _iconInfoMap[PROTEIN_STABILITY_ELEMENT] = new SBOLvIconInfo(PROTEIN_STABILITY_ELEMENT, "Protein Stability Element", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/protein_stability_element.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/protein_stability_element_reverse.png");
            _iconInfoMap[RESTRICTION_ENZYME_RECOGNITION_SITE] = new SBOLvIconInfo(RESTRICTION_ENZYME_RECOGNITION_SITE, 
                "Restriction Enzyme Recognition Site", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/restriction_enzyme_recognition_site.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/restriction_enzyme_recognition_site_reverse.png");
            _iconInfoMap[RESTRICTION_SITE_NO_OVERHANG] = new SBOLvIconInfo(RESTRICTION_SITE_NO_OVERHANG, 
                "Restriction Site Resulting in No Overhang", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/restriction_site_no_overhang.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/restriction_site_no_overhang_reverse.png");
            _iconInfoMap[RIBONUCLEASE_SITE] = new SBOLvIconInfo(RIBONUCLEASE_SITE, "Ribonuclease Site", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/ribonuclease_site.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/ribonuclease_site_reverse.png");
            _iconInfoMap[RNA_STABILITY_ELEMENT] = new SBOLvIconInfo(RNA_STABILITY_ELEMENT, "RNA Stability Element", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/rna_stability_element.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/rna_stability_element_reverse.png");
            _iconInfoMap[SIGNATURE] = new SBOLvIconInfo(SIGNATURE, "Signature", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/signature.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/signature_reverse.png");
            _iconInfoMap[TERMINATOR] = new SBOLvIconInfo(TERMINATOR, "Terminator", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/terminator.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/terminator_reverse.png");
            _iconInfoMap[THREE_PRIME_OVERHANG] = new SBOLvIconInfo(THREE_PRIME_OVERHANG, "3' Overhang", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/three_prime_overhang.png", 
                "org/jbei/registry/view/assets/icons/sbolv1-0/three_prime_overhang_reverse.png");
        }
    }
}