Ext.define("Teselagen.store.DeviceEditorProjectStore", {
    requires: ["Teselagen.models.DeviceEditorProject"],
    extend: "Ext.data.Store",
    model: "Teselagen.models.DeviceEditorProject",
    proxy: {
        type: "rest",
        url: "/api/deprojects",
        reader: {
            root: "projects"
        }
    }
});