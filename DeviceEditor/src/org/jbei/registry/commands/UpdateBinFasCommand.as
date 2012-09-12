package org.jbei.registry.commands
{
    import org.jbei.registry.ApplicationFacade;
    import org.jbei.registry.mediators.GridViewCanvasMediator;
    import org.jbei.registry.models.Part;
    import org.jbei.registry.models.j5.J5Bin;
    import org.puremvc.as3.interfaces.INotification;
    import org.puremvc.as3.patterns.command.SimpleCommand;
    
    public class UpdateBinFasCommand extends SimpleCommand
    {
        public override function execute(notification:INotification):void
        {
            var bin:J5Bin = notification.getBody() as J5Bin;
            
            bin.fas = "";
            
            //set bin FAS to the FAS of the top-most part in the bin with a specified FAS
            for (var i:int = 0; i < bin.binItemsVector.length; i++) {
                var part:Part = bin.binItemsVector[i];
                
                if (part.fas != "") {
                    bin.fas = part.fas;
                    break;
                }
            }
            
            var gridViewCanvasMediator:GridViewCanvasMediator = ApplicationFacade.getInstance().retrieveMediator(GridViewCanvasMediator.NAME) as GridViewCanvasMediator;
            gridViewCanvasMediator.updateFasIndicatorColor(bin);
        }
    }
}