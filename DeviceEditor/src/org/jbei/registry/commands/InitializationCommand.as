// ActionScript file
// Author: Doug Densmore

package org.jbei.registry.commands
{
        import org.puremvc.as3.patterns.command.MacroCommand;

        public class InitializationCommand extends MacroCommand
        {
                // Protected Methods
                protected override function initializeMacroCommand():void
                {
                        addSubCommand(PrepareModelCommand);
                        addSubCommand(PrepareViewCommand);
                        
                        //addSubCommand(FetchEntryCommand);
                }
        }
}
