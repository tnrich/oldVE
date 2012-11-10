/**
 * Controls the inspector panel, on the right side of the device editor.
 */
Ext.define("Vede.controller.DeviceEditor.InspectorController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.DeviceEvent"],

    DeviceEvent: null,

    onPartSelected: function(j5Part) {
        var inspector = Ext.getCmp("mainAppPanel").getActiveTab().down("component[cls='InspectorPanel']");
        inspector.setActiveTab(0);

        this.populatePartInformation(j5Part);
    },

    populatePartInformation: function(j5Part) {
        var inspector = Ext.getCmp("mainAppPanel").getActiveTab().down("component[cls='InspectorPanel']");

        var sourceField = inspector.down("component[cls='partSourceField']");
        var revCompField = inspector.down("component[cls='reverseComplementField']");
        var nameField = inspector.down("textfield[cls='partNameField']");
        var startField = inspector.down("displayfield[cls='startBPField']");
        var stopField = inspector.down("displayfield[cls='stopBPField']");
        var strategyField = inspector.down("combobox[cls='forcedAssemblyComboBox']");

        if(j5Part) {
            nameField.setValue(j5Part.get("name"));

            var sourceFile = j5Part.getSequenceFile();
            if(j5Part.getSequenceFile()) {
                sourceField.setValue(sourceFile.get("partSource"));
                revCompField.setValue(j5Part.get("revComp"));
            } else {
                sourceField.setValue("");
                revCompField.setValue("");
            }

            var startBP = j5Part.get("genbankStartBP");
            if(startBP < 1) {
                startField.setValue("");
            } else {
                startField.setValue(startBP);
            }

            var endBP = j5Part.get("endBP");
            if(endBP < 1) {
                stopField.setValue("");
            } else {
                stopField.setValue(endBP);
            }

            var strategy = j5Part.get("fas");
            if(strategy) {
                strategyField.setValue(strategy);
            } else {
                strategyField.setValue("None");
            }
        } else {
            nameField.setValue("");
            sourceField.setValue("");
            revCompField.setValue("");
            startField.setValue("");
            stopField.setValue("");
            strategyField.setValue("None");
        }
    },

    init: function() {
        this.callParent();

        this.DeviceEvent = Teselagen.event.DeviceEvent;

        this.application.on(this.DeviceEvent.SELECT_PART,
                            this.onPartSelected,
                            this);
    },
});
