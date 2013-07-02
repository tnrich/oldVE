package org.jbei.registry.commands
{
    import org.puremvc.as3.patterns.command.MacroCommand;
    
    public class CheckBinFasCommand extends MacroCommand
    {
        protected override function initializeMacroCommand():void
        {
            addSubCommand(CheckDigestRuleCommand);
            addSubCommand(UpdateBinFasCommand);
        }
    }
}