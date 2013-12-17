/**
 * @singleton
 * @class Teselagen.manager.RestrictionEnzymeGroupManager
 * This class manages the different user-defined and pre-installed groups of restriction enzymes.
 * It calls on Teselagen.bio.enzymes.RestrictionEnzymeManager to load them from an xml file.
 * Note that Teselagen.bio.enzymes.RestrictionEnzyme contains all the enzyme fields
 * and is used only on the client. Teselagen.models.UserRestrictionEnzyme only contains the enzyme name
 * and is saved to the server.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.manager.RestrictionEnzymeGroupManager", {
    requires: ["Teselagen.bio.enzymes.RestrictionEnzymeManager",
               "Teselagen.manager.UserManager",
               "Teselagen.models.RestrictionEnzymeGroup",
               "Teselagen.utils.Logger"],

    singleton: true,

    config: {
        systemGroups: [],
        userGroups: [],
        activeGroup: null,
        rebaseEnzymesDatabase: Ext.create("Ext.util.HashMap"),
        isInitialized: false,
        activeEnzymesChanged: false
    },

    Logger: null,
    RestrictionEnzymeManager: null,
    UserManager: null,

    COMMON_ENZYMES: ["AatII", "AvrII", "BamHI", "BglII", "BsgI", "EagI", "EcoRI", "EcoRV",
                     "HindIII", "KpnI", "NcoI", "NdeI", "NheI", "NotI", "PstI", "PvuI", "SacI",
                     "SacII", "SalI", "SmaI", "SpeI", "SphI", "XbaI", "XhoI", "XmaI"],
    ACTIVE: "Active",

    /**
     * @member Teselagen.manager.RestrictionEnzymeGroupManager
     * @param {Teselagen.models.RestrictionEnzymeGroup[]} systemGroups Groups of enzymes which are pre-defined by the program.
     * @param {Teselagen.models.RestrictionEnzymeGroup[]} userGroups Groups defined by the user.
     * @param {Teselagen.models.RestrictionEnzymeGroup} activeGroup A list of enzymes which is currently in use.
     * @param {Ext.util.HashMap} rebaseEnzymesDatabase A hashmap mapping enzyme names to the RestrictionEnzyme objects.
     * @param {Boolean} isInitialized Whether the database has already been read from the xml file.
     */
    constructor: function(inData) {
        this.Logger = Teselagen.utils.Logger;
        this.RestrictionEnzymeManager = Teselagen.bio.enzymes.RestrictionEnzymeManager;
        this.UserManager = Teselagen.manager.UserManager;
        this.initConfig(inData);
    },

    /**
     * Calls the RestrictionEnzymeManager to get enzyme data from rebase.xml and loads it
     * into a hashmap, then calls functions to load pre-stored enzyme groups.
     */
    initialize: function() {
        if(this.isInitialized) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "REBASE database already initialized!"
            });
        }

        var rebaseList = this.RestrictionEnzymeManager.getRebaseRestrictionEnzymes();
        var newDatabase = this.getRebaseEnzymesDatabase();

        // Add each REBASE enzyme to the dictionary with keys being enzyme names in lower case.
        Ext.each(rebaseList, function(enzyme) {
            newDatabase.add(enzyme.getName().toLowerCase(), enzyme);
        });

        this.setRebaseEnzymesDatabase(newDatabase);

        this.setIsInitialized(true);

        this.registerSystemGroups();
        this.initializeDefaultActiveGroup();
    },

    /**
     * Initialize the active user group if it doesn't exist.  Set the active group to its value.
     */
    initActiveUserGroup: function() {
        var userActiveGroup = this.getActiveUserGroup();
        if (!userActiveGroup) {
            this.createUserGroup(this.ACTIVE, this.COMMON_ENZYMES);
            this.UserManager.update(function(pSuccess) {
                if (!pSuccess) {
                    console.warn("Unable to save active restriction enzymes");
                }
            });
        }
        this.changeActiveGroup();
    },

    /**
     * Returns a group from userGroups by its name.
     * @param {String} name The name of the group to return.
     * @return {Teselagen.models.RestrictionEnzymeGroup} The desired group, or null if it is not found.
     */
    groupByName: function(name) {
        var resultGroup = null;


        Ext.each(this.getSystemGroups(), function(systemGroup) {
            if(systemGroup.getName() === name) {
                resultGroup = systemGroup;
            }
        });

        Ext.each(this.getUserGroups(), function(userGroup) {
            if(userGroup.getName() === name) {
                resultGroup = userGroup;
            }
        });

        return resultGroup;
    },

    /**
     * Returns an enzyme object given the enzyme's name.
     * @param {String} name The enzyme's name.
     * @return {Teselagen.bio.enzymes.RestrictionEnzyme} The enzyme object.
     */
    getEnzymeByName: function(name) {
        //In the future, all enzymes might not be in the REBASE database, but
        //for now this works.
        return this.getRebaseEnzymesDatabase().get(name.toLowerCase());
    },

    /**
     * Creates a RestrictionEnzymeGroup, given a name and a list of enzyme names.
     * @param {String} name The name of the group.
     * @param {String[]} enzymeNames A list of enzyme names. Will be used to search the database
     * to get each enzyme object.
     * @return {Teselagen.models.RestrictionEnzymeGroup} The newly created group.
     */
    createGroupByEnzymes: function(name, enzymeNames) {
        if(!this.isInitialized) {
            throw Ext.create("Teselagen.bio.BioException", {
                message: "REBASE database already initialized!"
            });
        }

        var enzymes = [];

        Ext.each(enzymeNames, function(name) {
            if(name) {
                var enzyme = this.getRebaseEnzymesDatabase().get(name.toLowerCase());

                if(enzyme) {
                    enzymes.push(enzyme);
                }
            }
        }, this);

        return Ext.create("Teselagen.models.RestrictionEnzymeGroup", {
            name: name,
            enzymes: enzymes
        });
    },

   /**
     * Creates a user restriction enzyme group, given a name and a list of enzyme names.
     * @param {String} name The name of the group.
     * @param {String[]} enzymeNames A list of enzyme names. Will be used to search the database
     * to get each enzyme object.
     * @return {Teselagen.models.RestrictionEnzymeGroup} The newly created group.
     */
    createUserGroup: function(pName, enzymeNames) {
        var group = Ext.create("Teselagen.models.UserRestrictionEnzymeGroup", {name: pName});
        this.loadUserEnzymes(group.userRestrictionEnzymes(), enzymeNames);
        this.getUserEnzymeGroups().add(group);
        return group;
    },

   /**
     * Copy an existing user restriction enzyme group.
     * @param {String} name The name of the group to copy.
     * @param {String} newName The name of the new group.
     * @return {Teselagen.models.RestrictionEnzymeGroup} The newly created group.
     */
    copyUserGroup: function(pName, pNewName) {
        var retVal = null;
        var group = this.getUserEnzymeGroupByName(pName);
        if (group) {
            var names = group.userRestrictionEnzymes().collect("name");
            retVal = this.createUserGroup(pNewName, names);
        }
        else {
            console.warn("User Restriction Enzyme group not found: ", pName);
        }
        return retVal;
    },

    /**
     * Removes a user restriction enzyme group.
     * @param {String} name The name of the group.
     */
    removeUserGroup: function(pName) {
        var groups = this.getUserEnzymeGroups();
        var group = this.getUserEnzymeGroupByName(pName);
        if (group) {
            groups.remove(group);
        }
        else {
            console.warn("User group not found: ", pName);
        }
    },

    /**
     * Returns a list of all group names.
     */
    getGroupNames: function() {
        var names = [];
        Ext.each(this.systemGroups.concat(this.userGroups), function(group) {
            names.push(group.getName());
        });
        return names;
    },

    /**
     * Returns all user groups.
     */
    getUserEnzymeGroups: function() {
        return this.UserManager.getUser().userRestrictionEnzymeGroups();
    },

    /**
     * Returns a user group given the name.
     */
    getUserEnzymeGroupByName: function(pName) {
        var groups = this.getUserEnzymeGroups();
        return groups.findRecord("name", pName);
    },

    /**
     * Returns the active user group.
     */
    getActiveUserGroup: function() {
        return this.getUserEnzymeGroupByName(this.ACTIVE);
    },

    /**
     * Make the given user group's enzymes active.
     */
    makeActive: function(pName) {
        var group = this.getUserEnzymeGroupByName(pName);
        var names = group.userRestrictionEnzymes().collect("name");
        var activeGroup = this.getActiveUserGroup();
        this.loadUserEnzymes(activeGroup.userRestrictionEnzymes(), names);
        this.setActiveEnzymesChanged(true);
    },

    /**
     * Change the activeGroup config by setting it to the user active group.
     */
    changeActiveGroup: function() {
        var userActiveGroup = this.getActiveUserGroup();
        var activeGroup = this.createGroupByEnzymes(this.ACTIVE,
                userActiveGroup.userRestrictionEnzymes().collect("name"));
        this.setActiveGroup(activeGroup);
    },

    /**
     * Load user groups
     */
    loadUserGroups: function() {
        this.UserManager.loadUser(function(pSuccess) {
            if (!pSuccess) {
                console.error("Error loading user restriction enzyme groups");
            }
        });
        this.setActiveEnzymesChanged(false);
    },

    /**
     * Save user groups
     */
    saveUserGroups: function(pNext) {
        var me = this;
        this.UserManager.update(function(pSuccess) {
            if (!pSuccess) {
                console.error("Unable to save user restriction enzyme groups");
            }
            else {
                if (me.getActiveEnzymesChanged()) {
                    me.changeActiveGroup();
                    Vede.application.fireEvent("ActiveEnzymesChanged");
                    me.setActiveEnzymesChanged(false);
                }
            }
            pNext(pSuccess);
        });
    },

    /**
     * @private
     * Loads user enzymes into a store, clearing it first.  Checks that enzymes
     * exist in enzyme database.
     * @param {Ext.data.Store} store User restriction enzyme store
     * @param {Array} names Enzyme names
     */
    loadUserEnzymes: function(pStore, pNames) {
        var rebase = this.getRebaseEnzymesDatabase();
        pStore.removeAll();
        for (var i = 0; i < pNames.length; i++) {
            var enzymeName = pNames[i];
            var enzyme = rebase.get(enzymeName.toLowerCase());
            if(enzyme) {
                pStore.add(Ext.create("Teselagen.models.UserRestrictionEnzyme", {name: enzymeName}));
            }
            else {
                console.warn("Enzyme not found in database: ", enzymeName);
            }
        }
    },

    /**
     * @private
     * Initializes activeGroup by setting it to the common enzyme group.
     */
    initializeDefaultActiveGroup: function() {
        var defaultGroupEnzymes = this.getSystemGroups()[0];
        this.setActiveGroup(defaultGroupEnzymes);
    },

    /**
     * @private
     * Initializes the pre-determined system groups.
     */
    registerSystemGroups: function() {
        var newSystemGroups = this.getSystemGroups();

        // 1. Common
        var commonGroup = this.createGroupByEnzymes("Common Enzymes", this.COMMON_ENZYMES);
        newSystemGroups.push(commonGroup);

        // 2. REBASE
        var rebaseGroup = Ext.create("Teselagen.models.RestrictionEnzymeGroup", {
            name: "All Enzymes",
            enzymes: this.getRebaseEnzymesDatabase().getValues()
        });

        newSystemGroups.push(rebaseGroup);
        // 3. Berkeley Biobrick
        var berkeleyBBGroup = this.createGroupByEnzymes("Berkeley BglBrick", ["EcoRI", "BglII", "BamHI", "XhoI"]);
        newSystemGroups.push(berkeleyBBGroup);

        // 4. MIT Biobrick
        var mitBBGroup = this.createGroupByEnzymes("MIT BioBrick", ["EcoRI", "XbaI", "SpeI", "PstI"]);
        newSystemGroups.push(mitBBGroup);

        // 5. Fermentas Fast Digest
        var fermentasFastDigestBBGroup = this.createGroupByEnzymes("Fermentas Fast Digest",
            ["AatII", "Acc65I", "AccI", "AciI", "AclI", "AcuI", "AfeI", "AflII", "AgeI",
             "AjuI", "AleI", "AluI", "Alw21I", "Alw26I", "AlwNI", "ApaI", "ApaLI", "AscI",
             "AseI", "AsiSI", "AvaI", "AvaII", "AvrII", "BamHI", "BanI", "BbsI", "BbvI", "BclI",
             "BfaI", "BglI", "BglII", "BlpI", "Bme1580I", "BmtI", "BplI", "BpmI", "Bpu10I", "BsaAI",
             "BsaBI", "BsaHI", "BsaJI", "BseGI", "BseNI", "BseXI", "Bsh1236I", "BsiEI", "BsiWI", "BslI",
             "BsmBI", "BsmFI", "Bsp119I", "Bsp120I", "Bsp1286I", "Bsp1407I", "BspCNI", "BspHI", "BspMI",
             "BsrBI", "BsrDI", "BsrFI", "BssHII", "BstXI", "BstZ17I", "Bsu36I", "ClaI", "Csp6I",
             "DdeI", "DpnI", "DraI", "DraIII", "DrdI", "EagI", "Eam1105I", "EarI", "Ecl136II", "Eco31I",
             "Eco91I", "EcoNI", "EcoO109I", "EcoRI", "EcoRV", "EheI", "Fnu4HI", "FokI", "FspAI", "FspI",
             "HaeII", "HaeIII", "HgaI", "HhaI", "HincII", "HindIII", "HinfI", "HinP1I", "HpaI", "HpaII",
             "Hpy8I", "HpyF10VI", "Kpn2I", "KpnI", "MauBI", "MboI", "MboII", "MfeI", "MluI", "MlyI",
             "MnlI", "MreI", "MscI", "MseI", "MslI", "MspI", "MssI", "Mva1269I", "MvaI", "NaeI", "NciI",
             "NcoI", "NdeI", "NheI", "NlaIII", "NlaIV", "NmuCI", "NotI", "NruI", "NsiI", "NspI", "PacI",
             "PdmI", "PflMI", "PfoI", "PmlI", "PpuMI", "PshAI", "PsiI", "PspFI", "PstI", "PsuI", "PsyI",
             "PvuI", "PvuII", "RsaI", "RsrII", "SacI", "SalI", "SanDI", "SapI", "Sau3AI", "Sau96I",
             "SbfI", "ScaI", "ScrFI", "SexAI", "SfaNI", "SfcI", "SfiI", "SmaI", "SnaBI", "SpeI", "SphI",
             "SspI", "StuI", "StyI", "SwaI", "TaaI", "TaiI", "TaqI", "TatI", "TauI", "TfiI", "Tru1I",
             "Tsp509I", "TspRI", "XapI", "XbaI", "XhoI"]);
        newSystemGroups.push(fermentasFastDigestBBGroup);

        this.setSystemGroups(newSystemGroups);
    }
});
