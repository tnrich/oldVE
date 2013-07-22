// ActionScript file
// Author: Doug Densmore

package org.jbei.registry.commands
{
    import org.jbei.registry.Notifications;
    import org.jbei.registry.mediators.GridViewCanvasMediator;
    import org.jbei.registry.mediators.J5ControlsMediator;
    import org.jbei.registry.mediators.MainCanvasMediator;
    import org.jbei.registry.mediators.MainControlBarMediator;
    import org.jbei.registry.mediators.MappingBarMediator;
    import org.jbei.registry.mediators.RightCanvasMediator;
    import org.jbei.registry.mediators.StatusBarMediator;
    import org.jbei.registry.mediators.TopMenuBarMediator;
    import org.jbei.registry.view.ui.dialogs.J5Controls;
    import org.puremvc.as3.interfaces.INotification;
    import org.puremvc.as3.patterns.command.SimpleCommand;

    public class PrepareViewCommand extends SimpleCommand
    {
        // Public Methods
        public override function execute(notification:INotification):void
        {
            var application:DeviceEditor = notification.getBody() as DeviceEditor;
            
            facade.registerMediator(new MainControlBarMediator(application.mainControlBar));
            facade.registerMediator(new MainCanvasMediator(application.mainCanvas));
            facade.registerMediator(new StatusBarMediator(application.statusBar));
            facade.registerMediator(new MappingBarMediator(application.mappingBar));
            facade.registerMediator(new TopMenuBarMediator(application.menuBar));
            facade.registerMediator(new RightCanvasMediator(application.mainCanvas.rightCanvas));
            facade.registerMediator(new GridViewCanvasMediator(application.mainCanvas.gridViewCanvas));
            facade.registerMediator(new FunctionMediator(null));
            facade.registerMediator(new J5ControlsMediator());
            
            sendNotification(Notifications.NEW_MEDIATORS_REGISTERED);
        }
    }
}
