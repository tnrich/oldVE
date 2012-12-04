/**
 * Schemas for the DB
 * -------------
 */

module.exports = function (app) {

	var Schema = app.mongoose.Schema;
	var oIDRef = app.mongoose.Schema.Types.ObjectId;
	var oMixed = app.mongoose.Schema.Types.Mixed;

	app.db.model('Examples', new Schema({
		name: String,
		payload: oMixed
	}));

	var j5RunSchema = new Schema({
		name: String,
		file_id: oIDRef,
		date: Date,
		j5Results: oMixed
	});
	app.db.model('j5run', j5RunSchema);

	var SequenceSchema = new Schema({
		veproject_id: String,
		sequenceFileContent: String,
		sequenceFileFormat: String,
		hash: String,
		partSource: String,
		sequenceFileName: String
	});
	app.db.model('sequence', SequenceSchema);

	var PartSchema = new Schema({
		id : String,
		veproject_id      :  String,
		j5bin_id          :  String,
		eugenerule_id     :  String,
		sequencefile_id   :  String,
		directionForward  :  String,
		fas               :  String,
		name              :  String,
		revComp           :  String,
		genbankStartBP    :  String,
		endBP             :  String,
		iconID            :  String,
		veproject_id      :  String,
		j5bin_id          :  String,
		eugenerule_id     :  String,
		sequencefile_id   :  String,
		directionForward  :  String,
		fas               :  String,
		name              :  String,
		revComp           :  String,
		genbankStartBP    :  String,
		endBP             :  String,
		iconID            :  String
	});
	app.db.model('part', PartSchema);

	var VEProjectSchema = new Schema({
		name: String,
		project_id : { type: oIDRef, ref: 'project' },
		sequences: [{ type: oIDRef, ref: 'sequence' }]
	});
	app.db.model('veproject', VEProjectSchema);

	var DEProjectSchema = new Schema({
		name: String,
		dateCreated: String,
		dateModified: String,
		project_id : { type: oIDRef, ref: 'project' },
		design: {
			name: String,
			deproject_id: String,
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
					parts: [ { type: oIDRef, ref: 'part' } ]
				}]
			},
			rules: oMixed
		},
		j5runs : [{ type: oIDRef, ref: 'j5run' }]
	});
	app.db.model('deproject', DEProjectSchema);

	var ProjectSchema = new Schema({
		user_id : { type: oIDRef, ref: 'User' },
		dateCreated: String,
		dateModified: String,
		name: String,
		deprojects : [{ type: oIDRef, ref: 'deproject' }],
		veprojects : [{ type: oIDRef, ref: 'veproject' }]
	});
	app.db.model('project', ProjectSchema);

	var UserSchema = new Schema({
		username: String,
		name: String,
		projects : [{ type: oIDRef, ref: 'project' }],
		preferences: Schema.Types.Mixed
	});
	app.db.model('User', UserSchema);

	//PartSchema.virtual('id').get(function () {return this._id;});
	//PartSchema.set('toJSON', { virtuals: true });

	PartSchema.pre('save', function (next) {
	  this.id = this._id;
	  next();
	});

	j5RunSchema.virtual('id').get(function () {return this._id;});
	j5RunSchema.set('toJSON', { virtuals: true });

	SequenceSchema.virtual('id').get(function () {return this._id;});
	SequenceSchema.set('toJSON', { virtuals: true });

	UserSchema.virtual('id').get(function () {return this._id;});
	UserSchema.set('toJSON', { virtuals: true });

	ProjectSchema.virtual('id').get(function () {return this._id;});
	ProjectSchema.set('toJSON', { virtuals: true });	

	DEProjectSchema.virtual('id').get(function () {return this._id;});
	DEProjectSchema.set('toJSON', { virtuals: true });		

	VEProjectSchema.virtual('id').get(function () {return this._id;});
	VEProjectSchema.set('toJSON', { virtuals: true });		

};