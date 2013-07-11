package org.jbei.registry.proxies
{
    import org.jbei.registry.ApplicationFacade;
    import org.jbei.registry.Notifications;
    import org.jbei.registry.commands.FunctionMediator;
    import org.jbei.registry.models.EugeneRule;
    import org.jbei.registry.models.Part;
    import org.jbei.registry.models.PartVO;
    import org.puremvc.as3.patterns.proxy.Proxy;
    
    public class EugeneRuleProxy extends Proxy
    {
        public static const NAME:String = "EugeneRulesProxy";
        
        private var _defaultNamePrefix:String = "rule";
        private var _highestDefaultNameIndex:int = 0;
        
        public function EugeneRuleProxy()
        {
            super(NAME, new Vector.<EugeneRule>);
        }
        
        public function get eugeneRules():Vector.<EugeneRule>
        {
            return data as Vector.<EugeneRule>;
        }
        
        public function get defaultNamePattern():RegExp
        {
            return new RegExp("^" + _defaultNamePrefix + "(\\d+)$");
        }
        
        public function get defaultNamePrefix():String
        {
            return _defaultNamePrefix;
        }
        
        public function get highestDefaultNameIndex():int
        {
            return _highestDefaultNameIndex;
        }
        
        public function addRule(name:String, negationOperator:Boolean, operand1:PartVO, compositionalOperator:String, operand2:*):EugeneRule
        {
            if (name == "") {
                throw new Error("Please enter a name for the rule.");
            } else if (!functionMediator.isLegalName(name)) {
                throw new Error("Illegal name " + name + ". Name can only contain alphanumeric characters, underscore (_), and hyphen (-).");
            }
            
            for (var i:int = 0; i<eugeneRules.length; i++) {
                if (eugeneRules[i].name == name) {
                    throw new Error("Rule name " + name + " already exists.\nPlease choose a unique name for the rule.");
                }
            }
            
            if (operand1 == null) {
                throw new Error("Missing operand 1.");
            }
            
            if (compositionalOperator == EugeneRule.MORETHAN) {
                if (!(operand2 is Number)) {
                    throw new Error("Invalid operand 2. Must be a number if using operator NOTMORETHAN.");
                }
            } else if (compositionalOperator == EugeneRule.AFTER || compositionalOperator == EugeneRule.BEFORE || compositionalOperator == EugeneRule.WITH
                || compositionalOperator == EugeneRule.THEN || compositionalOperator == EugeneRule.NEXTTO) {
                if (!(operand2 is PartVO)) {
                    throw new Error("Invalid or missing operand 2.");
                }
            } else {
                throw new Error("Operator " + compositionalOperator + " is not supported.");
            }
            
            var newEugeneRule:EugeneRule = new EugeneRule();
            newEugeneRule.name = name;
            newEugeneRule.negationOperator = negationOperator;
            newEugeneRule.operand1 = operand1;
            newEugeneRule.compositionalOperator = compositionalOperator;
            newEugeneRule.operand2 = operand2;
            
            eugeneRules.push(newEugeneRule);
            
            // if name follows the default name pattern, update highest default name index
            var namePatternResult:Object = defaultNamePattern.exec(name);
            if (namePatternResult != null && int(namePatternResult[1]) > _highestDefaultNameIndex) {
                _highestDefaultNameIndex = int(namePatternResult[1]);
            }
            
            sendNotification(Notifications.NEW_EUGENE_RULE_ADDED_DELETED, newEugeneRule);
            
            return newEugeneRule;
        }
        
        public function deleteItem(rule:EugeneRule):void
        {
            for (var i:int = 0; i<eugeneRules.length; i++) {
                if (eugeneRules[i] == rule) {
                    eugeneRules.splice(i, 1);
                    break;
                }
            }
            
            sendNotification(Notifications.NEW_EUGENE_RULE_ADDED_DELETED, rule);
        }
        
        public function deleteAllItems():void
        {
            data = new Vector.<EugeneRule>;
            _highestDefaultNameIndex = 0;
            
            sendNotification(Notifications.NEW_EUGENE_RULE_ADDED_DELETED);
        }
        
        public function generateRuleText(rule:EugeneRule):String
        {
            var ruleText:String = "Rule " + rule.name + "(";
            if (rule.negationOperator) {
                ruleText += "NOT ";
            }
            ruleText += rule.operand1.name + " " + rule.compositionalOperator + " ";
            if (rule.operand2 is Number) {
                ruleText = ruleText + (rule.operand2 as Number).toString();
            } else if (rule.operand2 is PartVO) {
                ruleText = ruleText + (rule.operand2 as PartVO).name;
            } else {
                throw new Error("Uh oh, something went wrong somewhere. \nOperand 2 should not have been set to anything other than a Number or a PartVO.");
            }
            ruleText = ruleText + ");";
            
            return ruleText;
        }
        
        public function getRuleByName(name:String):EugeneRule
        {
            for (var i:int = 0; i < eugeneRules.length; i++) {
                if (eugeneRules[i].name == name) {
                    return eugeneRules[i];
                }
            }
            return null;
        }
        
        /** 
         * Returns the eugeneRules that apply to the partVO. This includes all 
         * rules where the partVO is the first operand, as well as all AFTER, 
         * NOT AFTER, BEFORE, NOT BEFORE, WITH, NOT WITH, NOT THEN, and 
         * NOT NEXTTO rules where the partVO is the second operand (since the 
         * listed rules are symmetric). 
         * 
         * @param partVO  the partVO whose eugeneRules will be returned
         * 
         * @return        a vector of eugeneRules that apply to the partVO
         */
        public function getRulesByPartVO(partVO:PartVO):Vector.<EugeneRule>
        {
            var partRules:Vector.<EugeneRule> = new Vector.<EugeneRule>;
            
            for each (var rule:EugeneRule in eugeneRules) {
                if (rule.operand1 == partVO) {
                    partRules.push(rule);
                } else if (rule.operand2 == partVO) {
                    if (rule.compositionalOperator == EugeneRule.AFTER 
                        || rule.compositionalOperator == EugeneRule.BEFORE 
                        || rule.compositionalOperator == EugeneRule.WITH) {
                        partRules.push(rule);
                    } else if ((rule.compositionalOperator == EugeneRule.THEN
                        || rule.compositionalOperator == EugeneRule.NEXTTO)
                        && rule.negationOperator == true) {
                        partRules.push(rule);
                    }
                }
            }
            
            return partRules;
        }
        
        /**
         * Returns the eugeneRules that involve the partVO in either operand. 
         * 
         * @param partVO  the partVO to find eugeneRules for
         * 
         * @return        a vector of eugeneRules that have the partVO in 
         *                either operand
         */
        public function getRulesInvolvingPartVO(partVO:PartVO):Vector.<EugeneRule>
        {
            var rulesInvolvingPartVO:Vector.<EugeneRule> = new Vector.<EugeneRule>;
            
            for each (var rule:EugeneRule in eugeneRules) {
                if (rule.operand1 == partVO || rule.operand2 == partVO) {
                    rulesInvolvingPartVO.push(rule);
                }
            }
            
            return rulesInvolvingPartVO;
        }
        
        public function isUniqueRuleName(newName:String):Boolean
        {
            for (var i:int = 0; i < eugeneRules.length; i++) {
                if (eugeneRules[i].name == newName) {
                    return false;
                }
            }
            return true;
        }

        private function get functionMediator():FunctionMediator
        {
            return ApplicationFacade.getInstance().retrieveMediator(FunctionMediator.NAME) as FunctionMediator;
        }
    }
}