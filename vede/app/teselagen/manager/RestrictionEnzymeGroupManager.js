/**
 * @singleton
 * @class Teselagen.manager.RestrictionEnzymeGroupManager
 * This class manages the different user-defined and pre-installed groups of restriction enzymes.
 * It calls on @link Teselagen.bio.enzymes.RestrictionEnzymeManager to load them from an xml file.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.manager.RestrictionEnzymeGroupManager", {
    requires: ["Teselagen.bio.enzymes.RestrictionEnzymeManager"],

    singleton: true,

    config: {
        systemGroups: [],
        userGroups: [],
        activeGroup: [],
        rebaseEnzymesDatabase: Ext.create("Ext.util.HashMap"),
        isInitialized: false
    },

    RestrictionEnzymeManager: Teselagen.bio.enzymes.RestrictionEnzymeManager,

    /**
     * @param {Array<Teselagen.data.RestrictionEnzymeGroup>} systemGroups Groups of enzymes which are pre-defined by the program.
     * @param {Array<Teselagen.data.RestrictionEnzymeGroup>} userGroups Groups defined by the user.
     * @param {Array<Teselagen.bio.enzymes.RestrictionEnzyme>} activeGroup A list of enzymes which is currently in use.
     * @param {Ext.util.HashMap} rebaseEnzymesDatabase A hashmap mapping enzyme names to the RestrictionEnzyme objects.
     * @param {Boolean} isInitialized Whether the database has already been read from the xml file.
     */
    constructor: function(inData) {
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

        this.isInitialized = true;

        this.registerSystemGroups();
        this.initializeDefaultActiveGroup();
    },

    /**
     * Given a @link Teselagen.models.UserRestrictionEnzymes object, creates
     * @link Teselagen.data.RestrictionEnzymeGroup objects for its groups and loads them in userGroups.
     * @param {Teselagen.models.UserRestrictionEnzymes} userEnzymes The UserRestrictionEnzymes object to load from.
     */
    loadUserRestrictionEnzymes: function(userEnzymes) {
        this.setUserGroups([]);
        var newUserGroups = [];
        
        Ext.each(userEnzymes.get("groups"), function(group) {
            if(!group || !group.get("groupName") || group.get("enzymeNames").length == 0) {
                return true; // This simply tells Ext.each to continue to the next iteration.
            }

            newUserGroup = this.createGroupByEnzymes(group.get("groupName"),
                                                     group.get("enzymeNames"));

            newUserGroups.push(newUserGroup);
        }, this);

        // Load the UserRestrictionEnzymeGroup's active enzymes.
        if(userEnzymes.get("activeEnzymeNames").length > 0) {
            this.setActiveGroup([]);
            var newActiveGroup = [];

            var activeEnzymeNames = this.createGroupByEnzymes("active",
                                            userEnzymes.get("activeEnzymeNames"));
            
            // Get each active enzyme out of the database and put it in newActiveGroup.
            Ext.each(activeEnzymeNames, function(enzymeName) {
                newActiveGroup.push(this.getRebaseEnzymesDatabase().get(enzymeName));
            }, this);
        }

        this.setUserGroups(newUserGroups);
        this.setActiveGroup(newActiveGroup);
    },

    /**
     * Removes a given RestrictionEnzymeGroup from userGroups.
     * @param {Teselagen.data.RestrictionEnzymeGroup} enzymeGroup The group to remove from userGroups.
     */
    removeGroup: function(enzymeGroup) {
        var newUserGroups = this.getUserGroups();
        var index = newUserGroups.indexOf(enzymeGroup);

        if(index != -1) {
            newUserGroups.splice(index, 1);
        }

        this.setUserGroups(newUserGroups);
    },

    /**
     * Returns a group from userGroups by its name.
     * @param {String} name The name of the group to return.
     * @return {Teselagen.data.RestrictionEnzymeGroup} The desired group, or null if it is not found.
     */
    groupByName: function(name) {
        var resultGroup = null;


        Ext.each(this.getSystemGroups(), function(systemGroup) {
            if(systemGroup.getName() == name) {
                resultGroup = systemGroup;
                return false;
            }
        });

        Ext.each(this.getUserGroups(), function(userGroup) {
            if(userGroup.getName() == name) {
                resultGroup = userGroup;
                return false;
            }
        });

        return resultGroup;
    },

    /**
     * Creates a RestrictionEnzymeGroup, given a name and a list of enzyme names.
     * @param {String} name The name of the group.
     * @param {Array<String>} enzymeNames A list of enzyme names. Will be used to search the database
     * to get each enzyme object.
     * @return {Teselagen.data.RestrictionEnzymeGroup} The newly created group.
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

        return Ext.create("Teselagen.data.RestrictionEnzymeGroup", {
            name: name,
            enzymes: enzymes
        });
    },

    /**
     * @private
     * Initializes activeGroup by loading the first system group, the "common" group enzymes, into it.
     */
    initializeDefaultActiveGroup: function() {
        var defaultGroupEnzymes = this.getSystemGroups()[0].getEnzymes();
        this.setActiveGroup(defaultGroupEnzymes);
    },

    /**
     * @private
     * Initializes the pre-determined system groups.
     */
    registerSystemGroups: function() {
        var newSystemGroups = this.getSystemGroups();
        
        // 1. Common
        var commonGroup = this.createGroupByEnzymes("Common", ["AatII", "AvrII", "BamHI", "BglII", "BsgI", "EagI", "EcoRI", "EcoRV", "HindIII", "KpnI", "NcoI", "NdeI", "NheI", "NotI", "PstI", "PvuI", "SacI", "SacII", "SalI", "SmaI", "SpeI", "SphI", "XbaI", "XhoI", "XmaI"]);
        newSystemGroups.push(commonGroup);
        
        // 2. REBASE
        var rebaseGroup = Ext.create("Teselagen.data.RestrictionEnzymeGroup", {
            name: "REBASE",
            enzymes: this.getRebaseEnzymesDatabase().getValues()
        });

        newSystemGroups.push(rebaseGroup);
        
        // 3. Berkeley Biobrick
        var berkeleyBBGroup = this.createGroupByEnzymes("Berkeley BioBricks", ["EcoRI", "BglII", "BamHI", "XhoI"]);
        newSystemGroups.push(berkeleyBBGroup);
        
        // 4. MIT Biobrick
        var mitBBGroup = this.createGroupByEnzymes("MIT BioBricks", ["EcoRI", "XbaI", "SpeI", "PstI"]);
        newSystemGroups.push(mitBBGroup);
        
        // 5. Fermentas Fast Digest
        var fermentasFastDigestBBGroup = this.createGroupByEnzymes("Fermentas Fast Digest", ["AatII", "Acc65I", "AccI", "AciI", "AclI", "AcuI", "AfeI", "AflII", "AgeI", "AjuI", "AleI", "AluI", "Alw21I", "Alw26I", "AlwNI", "ApaI", "ApaLI", "AscI", "AseI", "AsiSI", "AvaI", "AvaII", "AvrII", "BamHI", "BanI", "BbsI", "BbvI", "BclI", "BfaI", "BglI", "BglII", "BlpI", "Bme1580I", "BmtI", "BplI", "BpmI", "Bpu10I", "BsaAI", "BsaBI", "BsaHI", "BsaJI", "BseGI", "BseNI", "BseXI", "Bsh1236I", "BsiEI", "BsiWI", "BslI", "BsmBI", "BsmFI", "Bsp119I", "Bsp120I", "Bsp1286I", "Bsp1407I", "BspCNI", "BspHI", "BspMI", "BsrBI", "BsrDI", "BsrFI", "BssHII", "BstXI", "BstZ17I", "Bsu36I", "ClaI", "Csp6I", "DdeI", "DpnI", "DraI", "DraIII", "DrdI", "EagI", "Eam1105I", "EarI", "Ecl136II", "Eco31I", "Eco91I", "EcoNI", "EcoO109I", "EcoRI", "EcoRV", "EheI", "Fnu4HI", "FokI", "FspAI", "FspI", "HaeII", "HaeIII", "HgaI", "HhaI", "HincII", "HindIII", "HinfI", "HinP1I", "HpaI", "HpaII", "Hpy8I", "HpyF10VI", "Kpn2I", "KpnI", "MauBI", "MboI", "MboII", "MfeI", "MluI", "MlyI", "MnlI", "MreI", "MscI", "MseI", "MslI", "MspI", "MssI", "Mva1269I", "MvaI", "NaeI", "NciI", "NcoI", "NdeI", "NheI", "NlaIII", "NlaIV", "NmuCI", "NotI", "NruI", "NsiI", "NspI", "PacI", "PdmI", "PflMI", "PfoI", "PmlI", "PpuMI", "PshAI", "PsiI", "PspFI", "PstI", "PsuI", "PsyI", "PvuI", "PvuII", "RsaI", "RsrII", "SacI", "SalI", "SanDI", "SapI", "Sau3AI", "Sau96I", "SbfI", "ScaI", "ScrFI", "SexAI", "SfaNI", "SfcI", "SfiI", "SmaI", "SnaBI", "SpeI", "SphI", "SspI", "StuI", "StyI", "SwaI", "TaaI", "TaiI", "TaqI", "TatI", "TauI", "TfiI", "Tru1I", "Tsp509I", "TspRI", "XapI", "XbaI", "XhoI"]);
        newSystemGroups.push(fermentasFastDigestBBGroup);

        this.setSystemGroups(newSystemGroups);
    },
});
