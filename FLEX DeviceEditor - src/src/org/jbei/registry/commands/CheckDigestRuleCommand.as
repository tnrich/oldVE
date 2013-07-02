package org.jbei.registry.commands
{
    import mx.controls.Alert;
    
    import org.jbei.registry.ApplicationFacade;
    import org.jbei.registry.mediators.GridViewCanvasMediator;
    import org.jbei.registry.models.Part;
    import org.jbei.registry.models.j5.J5Bin;
    import org.jbei.registry.models.j5.J5Collection;
    import org.jbei.registry.proxies.J5CollectionProxy;
    import org.jbei.registry.proxies.PartProxy;
    import org.jbei.registry.view.ui.panels.J5Panel;
    import org.jbei.registry.view.ui.shapes.CollectionShape;
    import org.jbei.registry.view.ui.shapes.RectShape;
    import org.puremvc.as3.interfaces.INotification;
    import org.puremvc.as3.patterns.command.SimpleCommand;
    
    public class CheckDigestRuleCommand extends SimpleCommand
    {
        public override function execute(notification:INotification):void
        {
            if (ApplicationFacade.getInstance().isDigestRuleEnabled) {
                var j5CollectionProxy:J5CollectionProxy = (facade as ApplicationFacade).retrieveProxy(J5CollectionProxy.NAME) as J5CollectionProxy;
                var collection:J5Collection = j5CollectionProxy.j5Collection;
                var bin:J5Bin = notification.getBody() as J5Bin;
                
                if (bin != collection.binsVector[0]) { //if not first bin in collection, rule needs to be checked
                    for (var i:int = 0; i < bin.binItemsVector.length; i++) {
                        var part:Part = bin.binItemsVector[i]
                        if (part.fas == J5Panel.DIGEST_FAS) {
                            bin.removeFromBin(part);
                            
                            var partProxy:PartProxy = (facade as ApplicationFacade).retrieveProxy(PartProxy.NAME) as PartProxy;
                            var gridViewCanvasMediator:GridViewCanvasMediator = (facade as ApplicationFacade).retrieveMediator(GridViewCanvasMediator.NAME) as GridViewCanvasMediator;
                            
                            var isLinked:Boolean = false;
                            var allParts:Vector.<Part> = partProxy.parts;
                            for (var j:int = 0; j < allParts.length; j++) {
                                if (allParts[j].partVO == part.partVO && allParts[j] != part) {
                                    isLinked = true;
                                    break;
                                }
                            }
                            
                            if (isLinked) {
                                //remove the part, since another copy exists elsewhere
                                gridViewCanvasMediator.removePart(part);
                                partProxy.deleteItem(part);
                                Alert.show("Digest parts cannot be in any bin except the first.\n" + 
                                    "Removed part " + part.name + " from bin " + bin.binName + " since a copy exists elsewhere!", "Digest Rule");
                            } else {
                                //move to part holding area if this is the only copy of the part
                                gridViewCanvasMediator.movePartToHoldingArea(part);
                                Alert.show("Digest parts cannot be in any bin except the first.\n" + 
                                    "Moved part " + part.name + " out of collection!", "Digest Rule");
                            }
                            
                            var functionMediator:FunctionMediator = (facade as ApplicationFacade).retrieveMediator(FunctionMediator.NAME) as FunctionMediator;
                            functionMediator.setUpCollection();                           			
                        }
                    }
                }
            }
        }
    }
}