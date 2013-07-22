// ActionScript file
// Author: Doug Densmore

package org.jbei.registry.commands
{
        import org.jbei.registry.proxies.DownstreamAutomationParametersProxy;
        import org.jbei.registry.proxies.EntryServiceProxy;
        import org.jbei.registry.proxies.EugeneRuleProxy;
        import org.jbei.registry.proxies.J5CollectionProxy;
        import org.jbei.registry.proxies.J5ParametersProxy;
        import org.jbei.registry.proxies.PartProxy;
        import org.jbei.registry.proxies.SequenceFileProxy;
        import org.puremvc.as3.interfaces.INotification;
        import org.puremvc.as3.patterns.command.SimpleCommand;

        public class PrepareModelCommand extends SimpleCommand
        {
                // Public Methods
                public override function execute(notification:INotification):void
                {
                        facade.registerProxy(new EntryServiceProxy());
                        facade.registerProxy(new SequenceFileProxy());
                        facade.registerProxy(new EugeneRuleProxy());
                        facade.registerProxy(new PartProxy()); //must come after SequenceFileProxy and EugeneRuleProxy
                        facade.registerProxy(new J5CollectionProxy());
                        facade.registerProxy(new J5ParametersProxy());
                        facade.registerProxy(new DownstreamAutomationParametersProxy());
                }
        }
}
