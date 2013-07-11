package org.jbei.registry.proxies
{
    import org.jbei.registry.ApplicationFacade;
    import org.jbei.registry.Notifications;
    import org.jbei.registry.models.EugeneRule;
    import org.jbei.registry.models.Part;
    import org.jbei.registry.models.PartVO;
    import org.puremvc.as3.patterns.observer.Notification;
    import org.puremvc.as3.patterns.proxy.Proxy;

    public class PartProxy extends Proxy
    {
        public static const NAME:String = "PartProxy";
        
        private var sequenceFileProxy:SequenceFileProxy = ApplicationFacade.getInstance().retrieveProxy(SequenceFileProxy.NAME) as SequenceFileProxy;
        private var eugeneRuleProxy:EugeneRuleProxy = ApplicationFacade.getInstance().retrieveProxy(EugeneRuleProxy.NAME) as EugeneRuleProxy;
        
        public function PartProxy()
        {
            super(NAME, new Vector.<Part>);
        }
        
        public function get parts():Vector.<Part>
        {
            return data as Vector.<Part>;
        }
        
        public function get partVOs():Vector.<PartVO>
        {
            var _partVOs:Vector.<PartVO> = new Vector.<PartVO>();
            var uniquePartVO:Boolean;
            for (var i:int = 0; i < parts.length; i++) { //for each part
                uniquePartVO = true;
                for (var j:int = 0; j < _partVOs.length; j++) { //check if the PartVO is already in the _partVOs vector
                    if (parts[i].partVO == _partVOs[j]) {
                        uniquePartVO = false;
                        break;
                    }
                }
                if (uniquePartVO) { //if not already in _partVOs vector, add it
                    _partVOs.push(parts[i].partVO);
                }
            }
            return _partVOs;
        }
        
        public function getPartById(id:String):Part
        {
            for (var i:int = 0; i < parts.length; i++) {
                if (parts[i].id == id) {
                    return parts[i];
                }
            }
            return null;
        }
        
        public function getPartVOByName(name:String):PartVO
        {
            for (var i:int = 0; i < parts.length; i++) {
                if (parts[i].name == name) {
                    return parts[i].partVO;
                }
            }
            return null;
        }
        
        public function getPartVOById(id:String):PartVO
        {
            for (var i:int = 0; i < parts.length; i++) {
                if (parts[i].partVO.id == id) {
                    return parts[i].partVO;
                }
            }
            return null;
        }

        public function deleteItem(part:Part):void
        {
            var linkedPartsExist:Boolean;
            var isSequenceFileUsedElsewhere:Boolean;
            
            for (var i:int = 0; i<parts.length; i++) {
                if (parts[i] == part) {  //found the part to be deleted
                    //figure out if there are parts linked to this one (same partVO)
                    for (var j:int = 0; j < parts.length; j++) {
                        linkedPartsExist = false;
                        if (i != j && parts[i].partVO == parts[j].partVO) {
                            linkedPartsExist = true;
                            break;
                        }
                    }
                    
                    if (!linkedPartsExist) {  //if no linked parts
                        //figure out if the part's sequenceFile can be removed too
                        isSequenceFileUsedElsewhere = false;
                        for (var k:int = 0; k < parts.length; k++) {
                            if (i != k && parts[i].sequenceFile == parts[k].sequenceFile) {
                                isSequenceFileUsedElsewhere = true;
                                break;
                            }
                        }
                        if (!isSequenceFileUsedElsewhere) {
                            sequenceFileProxy.deleteItem(part.sequenceFile);
                        }
                        
                        //figure out if there are Eugene rules that will become obsolete and need to be removed
                        var eugeneRules:Vector.<EugeneRule> = eugeneRuleProxy.getRulesInvolvingPartVO(part.partVO);
                        for (k = 0; k < eugeneRules.length; k++) {
                            eugeneRuleProxy.deleteItem(eugeneRules[k]);
                        }
                    }
                    
                    //delete the part, its partVO should go away on its own if no other part is using it
                    parts.splice(i, 1);
                    break;
                }
            }
            
            //refresh all parts (to change colors, etc)
            sendNotification(Notifications.NEW_REFRESH_ALL_RECT_SHAPES); //FIXME: does this belong here?
        }
        
        public function deleteAllItems():void
        {
            sequenceFileProxy.deleteAllItems();
            eugeneRuleProxy.deleteAllItems();
            
            data = new Vector.<Part>;
        }
        
        public function createPart(partVO:PartVO = null):Part
        {
            //if no PartVO passed in, its a new part, create a new PartVO
            if (partVO == null) {
                partVO = new PartVO();
            }
            
            //create new Part containing the PartVO
            var part:Part = new Part();
            part.partVO = partVO;
            
            parts.push(part);
            return part;
        }
        
        public function isUniquePartName(newName:String):Boolean
        {
            var allPartVOs:Vector.<PartVO> = partVOs;
            for (var i:int = 0; i<allPartVOs.length; i++) {
                if (allPartVOs[i].name == newName) {
                    return false;
                }
            }
            return true;
        }
    }
}