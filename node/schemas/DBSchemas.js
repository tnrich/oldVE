/**
 * Mongoose schema definitions:
 *
 * + user : Describes a user.
 * + j5run : Describes a result of a j5 execution.
 * + devicedesign : Describes a design assembly. (linked to parts)
 * + sequence : Describes a sequences.
 * + part : Describe a part (linked to a sequence).
 * + project : Describes a project that groups sequence, parts and devicedesign.
 *
 * @module ./schemas/DBSchemas
 */

var async = require('async');
var bcrypt = require('bcrypt');

module.exports = function(db) {

    var mongoose = require("mongoose");
    var crypto = require("crypto");

    var registerSchema = function(name, schema) {
        db.model(name, schema);
        schema.virtual('id').get(function() {
            return this._id.toString();
        });
        schema.set('toJSON', {
            virtuals: true
        });
    };

    var Schema = mongoose.Schema;
    var oIDRef = mongoose.Schema.Types.ObjectId;
    var Mixed = mongoose.Schema.Types.Mixed;

    var j5RunSchema = new Schema({
        devicedesign_id: {
            type: oIDRef,
            ref: 'devicedesign'
        },
        name: String,
        file_id: oIDRef,
        date: Date,
        j5Results: {
            assemblies: [],
            combinatorialAssembly: { type: Mixed, default: {"Info":"No data"} },
            j5parameters: { type: Mixed, default: {"Info":"No data"} },
            processedData: Mixed
        },
        j5Input: {
            j5Parameters: { type: Mixed, default: {"Info":"No data"} },
        },
        assemblyType: String,
        assemblyMethod: String,
        endDate: Date,
        status: String,
        process: {
            server: String,
            pid: Number
        },
        warnings: [],
        error_list: [],
        user_id: { type: oIDRef, ref: 'user' },
        project_id: { type: oIDRef, ref: 'project' },
        devicedesign_name: String,
        data: Mixed
    });
    registerSchema('j5run', j5RunSchema);

    var SequenceSchema = new Schema({
        FQDN: String,
        user_id: {
            type: oIDRef,
            ref: 'user'
        },
        name: String,
        description: String,
        dateCreated: Date,
        dateModified: Date,
        ve_metadata: Mixed,
        sequenceFileContent: String,
        sequenceFileFormat: String,
        hash: String,
        size: Number,
        partSource: String,
        sequenceFileName: String,
        firstTimeImported: Boolean,
        serialize: Mixed
    });

    //SequenceSchema.virtual('user_id').get(function() {
    //  return req.user._id;
    //});

    SequenceSchema.index({ "FQDN": 1, "hash" : 1 }, { unique: true, dropDups: true });

    SequenceSchema.pre('remove', function(next) {
        var sequence = this;

        db.model('part').find({
            sequencefile_id: this.id
        }, function(err, parts) {
            if(err) {
                console.log('Error removing parts.');
                console.log(err);
                next();
            } else {
                async.forEach(parts, function(part, done) {
                    part.remove();
                    done();
                }, function(err) {
                    db.model('User').update({
                        _id: sequence.user_id
                    }, {
                        $pull: {
                            sequences: sequence._id
                        }
                    }, function(err) {
                        if(err) {
                            console.log('Error removing sequence from user.');
                            console.log(err);
                        }

                        next();
                    });
                });
            }
        });
    });

    registerSchema('sequence', SequenceSchema);

    var PartSchema = new Schema({
        FQDN: {type : String},
        definitionHash: {type: String},
        user_id : { type: oIDRef, ref: 'user' },
        name: String,
        dateCreated: Date,
        dateModified: Date,
        ve_metadata       :  Mixed,
        id                :  String,
        veproject_id      :  String,
        j5bin_id          :  String,
        eugenerule_id     :  String,
        sequencefile_id   : { type: oIDRef, ref: 'sequence' },
        directionForward  :  String,
        revComp           :  String,
        genbankStartBP    :  String,
        endBP             :  String,
        features          :  String,
        iconID            :  String,
        partSource        :  String,
        size              :  Number
    });

    PartSchema.index({"FQDN": 1, "definitionHash": 1}, {unique: true, dropDups: true});

    PartSchema.pre('save', function(next) {
        this.id = this._id;
        next();
    });

    // Remove part id from designs.
    PartSchema.pre('remove', function(next) {
        db.model('devicedesign').update({
            parts: mongoose.Types.ObjectId(this.id)
        }, {
            $pull: {
                parts: mongoose.Types.ObjectId(this.id)
            }
        }).exec(function(err, designs) {
            next();
        });
    });

    PartSchema.statics.generateDefinitionHash = function(user, part, cb) {
        db.model('sequence').findById(part.sequencefile_id, function(err, file) {
            var hashArray = [part.genbankStartBP,
                             part.endBP,
                             part.revComp];

            if(file) {
                hashArray = hashArray.concat([file.FQDN, file.hash]);
            }

            return cb(crypto.createHash('md5').update(hashArray.join("")).digest("hex"));
        });
    };

    db.model('part', PartSchema);

    var DeviceDesignSchema = new Schema({
        project_id: {
            type: oIDRef,
            ref: 'project'
        },
        user_id: {
            type: oIDRef,
            ref: 'user'
        },
        name: String,
        dateCreated: String,
        dateModified: String,
        de_metadata: Mixed,
        directionForward: String,
        combinatorial: String,
        isCircular: String,
        bins: [{
            directionForward: String,
            dsf: String,
            fro: String,
            extra5PrimeBps: String,
            extra3PrimeBps: String,
            devicedesign_id: String,
            binName: String,
            iconID: String,
            cells: [
                {
                    index: String,
                    fas: String,
                    part_id :
                        {
                            type: oIDRef,
                            ref: 'part'
                        }
                }
            ]
        }],
        parts: [{
            type: oIDRef,
            ref: 'part'
        }],
        rules: [
            {
                compositionalOperator: String,
                name: String,
                negationOperator: Boolean,
                operand1_id: String,
                operand2Number: String,
                operand2_id: String,
                operand2isNumber: Boolean,
                originalRuleLine: String,
            }
        ],
        j5runs: [{
            type: oIDRef,
            ref: 'j5run'
        }],
        sequences: Mixed
    });

    DeviceDesignSchema.pre('remove',function (next) {
      // Remove from Projects
      console.log("Trying to remove "+this._id);
      db.model('project').update({}, {$pull : {designs : this._id}}).exec(function(err, numberAffected){
          console.log(numberAffected+" projects updated");
      });

      // Remove from Users
      // Currently user.designs is not being used
      //db.model('project').update({}, {$pull : {designs : this._id}}).exec(function(err, numberAffected){
      //    console.log(numberAffected+" users updated");
      //});


      // Remove from j5reports and associated j5reports
      db.model('j5run').remove({devicedesign_id: this}).exec(function(err, numberAffected){
          console.log(numberAffected+" j5runs removed");
      });

      next();
    });

    registerSchema('devicedesign', DeviceDesignSchema);

    var ProjectSchema = new Schema({
        user_id: {
            type: oIDRef,
            ref: 'User'
        },
        dateCreated: String,
        dateModified: String,
        name: String,
        designs: [{
            type: oIDRef,
            ref: 'devicedesign'
        }]
    });
    registerSchema('project', ProjectSchema);

    var PresetSchema = new Schema({
        presetName: String,
        j5parameters: Mixed
    });
    registerSchema('preset', PresetSchema);

    var UserSchema = new Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        activated: {type: Boolean, default: false},
        activationCode: String,
        preferences: Mixed,
        groupName: String,
        groupType: String,
        userType: {type: String, default: "Standard"},
        projects: [{
            type: oIDRef,
            ref: 'project'
        }],
        sequences: [{
            type: oIDRef,
            ref: 'sequence'
        }],
        parts: [{
            type: oIDRef,
            ref: 'part'
        }],
        designs: [{
            type: oIDRef,
            ref: 'devicedesign'
        }],
        userRestrictionEnzymeGroups: [{
            name: String,
            userRestrictionEnzymes: [{
                name: String
            }]
        }],
        masterSources: 
        {
            masterplasmidlist: 
            { 
                name: {type: String, default: "masterplasmidlist.csv"},
                fileContent: {type: String, default: "UGxhc21pZCBOYW1lLEFsaWFzLENvbnRlbnRzLExlbmd0aCxTZXF1ZW5jZQ0KcGo1XzAwMDAwLCwsLA==" , select: false}
            },
            masteroligolist: 
            {
                name: {type: String, default: "masteroligolist.csv"},
                fileContent: {type: String, default: "T2xpZ28gTmFtZSxMZW5ndGgsVG0sVG0gKDMnIG9ubHkpLFNlcXVlbmNlDQpqNV8wMDAwMCwsLCw=" , select: false}
            },
            masterdirectsyntheseslist: {
                name: {type: String, default: "masterdirectsyntheseslist.csv"},
                fileContent: {type: String, default: "RGlyZWN0IFN5bnRoZXNpcyBOYW1lLEFsaWFzLENvbnRlbnRzLExlbmd0aCxTZXF1ZW5jZQ0KZHNqNV8wMDAwMCwsLCw=" , select: false}
            }
        },
        dateCreated: Date,
        lastAccess: Date,
        debugAccess: {type: Boolean, default: false},
        presets: [{
            type: oIDRef,
            ref: 'preset'
        }]
    });

    UserSchema.pre('save', function(next) {
        var user = this;

        if(!user.isModified('password')) {
            return next();
        } else {
            bcrypt.genSalt(10, function(err, salt) {
                if(err) {
                    return next(err);
                } else {
                    bcrypt.hash(user.password, salt, function(err, hash) {
                        if(err) {
                            return next(err);
                        } else {
                            user.password = hash;
                            next();
                        }
                    });
                }
            });
        }
    });

    UserSchema.methods.comparePassword = function(candidatePassword, next) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if(err) {
                return next(err);
            } else {
                return next(null, isMatch);
            }
        });
    };

    UserSchema.methods.J5MethodAllowed = function(method,cb) {
        //console.log("Trying to execute method "+method);
        //console.log("User type "+this.userType);
        /*
        
        *   NOT ALLOWED for guests

            Mock
            CombinatorialMock

        *    SLIC/Gibson/CPEC
        *    CombinatorialSLICGibsonCPEC

        *    GoldenGate
        *    CombinatorialGoldenGate
        
        */

        var protectedMethods = [
            "SLIC/Gibson/CPEC",
            "CombinatorialSLICGibsonCPEC",
            "GoldenGate",
            "CombinatorialGoldenGate",
            "condenseAssemblyFiles",
            "DesignDownstreamAutomation"
        ];
        if(this.userType && this.userType == "Guest")
        {
            if(protectedMethods.indexOf(method) !=- 1) return cb(false);
            else return cb(true);
        }
        return cb(true);
    };

    UserSchema.virtual('FQDN').get(function () {
      return this.username;
    });

    registerSchema('User', UserSchema);

    UserSchema.index({"username": 1}, {unique: true, dropDups: true});
};
