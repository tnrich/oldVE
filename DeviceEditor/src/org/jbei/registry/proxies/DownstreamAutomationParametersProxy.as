package org.jbei.registry.proxies
{
    import org.jbei.registry.models.DownstreamAutomationParameters;
    import org.puremvc.as3.patterns.proxy.Proxy;
    
    public class DownstreamAutomationParametersProxy extends Proxy
    {
        public static const NAME:String = "DownstreamAutomationProxy";
        
        public function DownstreamAutomationParametersProxy()
        {
            super(NAME, new DownstreamAutomationParameters());
        }
        
        public function get downstreamAutomationParameters():DownstreamAutomationParameters
        {
            return data as DownstreamAutomationParameters;
        }
        
        public function getDownstreamAutomationParametersString():String
        {
            return downstreamAutomationParameters.createParameterString();
        }
    }
}