/**
 * Collection of Users.
 * @class Teselagen.store.UserStore
 */
Ext.define("Teselagen.store.UserStore", {
    requires: ["Teselagen.models.User"],
    extend: "Ext.data.Store",
    model: "Teselagen.models.User"
});