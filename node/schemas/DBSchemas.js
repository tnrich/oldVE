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

module.exports = function(db) {

	var mongoose = require("mongoose");

	var registerSchema = function(name, schema) {
		db.model(name, schema);
		schema.virtual('id').get(function() {
			return this._id.toString();
		});
		schema.set('toJSON', {
			virtuals: true
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
		j5Results: Mixed,
		j5Input: Mixed,
		assemblyType: String,
		assemblyMethod: String
	});
	registerSchema('j5run', j5RunSchema);

	var SequenceSchema = new Schema({
		FQDN: { type : String, index: { unique: true, dropDups: true }}, 
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
		ve_metadata: Mixed,
		sequenceFileContent: String,
		sequenceFileFormat: String,
		hash: String,
		partSource: String,
		sequenceFileName: String,
		firstTimeImported: Boolean
	});
	registerSchema('sequence', SequenceSchema);

	var PartSchema = new Schema({
		FQDN: { type : String, index: { unique: true, dropDups: true }}, 
		project_id : { type: oIDRef, ref: 'project' },
		user_id : { type: oIDRef, ref: 'user' },
		name: String,
		dateCreated: String,
		dateModified: String,
		ve_metadata       :  Mixed,
		id                :  String,
		veproject_id      :  String,
		j5bin_id          :  String,
		eugenerule_id     :  String,
		sequencefile_id   :  String,
		directionForward  :  String,
		fas               :  String,
		revComp           :  String,
		genbankStartBP    :  String,
		endBP             :  String,
		iconID            :  String
	});

	PartSchema.pre('save', function(next) {
		this.id = this._id;
		next();
	});

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
		j5collection: {
			directionForward: String,
			combinatorial: String,
			isCircular: String,
			bins: [{
				directionForward: String,
				dsf: String,
				fro: String,
				fas: String,
				extra5PrimeBps: String,
				extra3PrimeBps: String,
				binName: String,
				iconID: String,
				parts: [{
					type: oIDRef,
					ref: 'part'
				}]
			}]
		},
		rules: [Mixed],
		j5runs: [{
			type: oIDRef,
			ref: 'j5run'
		}]
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
		}]
	});
	registerSchema('project', ProjectSchema);

	var UserSchema = new Schema({
		username: String,
		firstName: String,
		lastName: String,
		email: String,
		preferences: Mixed,
		groupName: String,
		groupType: String,
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
		}]
	});

	UserSchema.virtual('FQDN').get(function () {
	  return this.groupType + '.' + this.groupName + '.' + this.username;
	});

	registerSchema('User', UserSchema);
};