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

	var VEProjectSchema = new Schema({
		name: String,
		project_id : { type: oIDRef, ref: 'project' },
		sequencefile: app.mongoose.Schema.Types.Mixed
	});
	app.db.model('veproject', VEProjectSchema);

	var DEProjectSchema = new Schema({
		project_id : { type: oIDRef, ref: 'project' },
		design: app.mongoose.Schema.Types.Mixed,
		name: String
	}, { strict: false });
	app.db.model('deproject', DEProjectSchema);

	var ProjectSchema = new Schema({
		user_id : { type: oIDRef, ref: 'User' },
		dateCreated: Date,
		dateModified: Date,
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

	UserSchema.virtual('id').get(function () {return this._id;});
	UserSchema.set('toJSON', { virtuals: true });

	ProjectSchema.virtual('id').get(function () {return this._id;});
	ProjectSchema.set('toJSON', { virtuals: true });	

	DEProjectSchema.virtual('id').get(function () {return this._id;});
	DEProjectSchema.set('toJSON', { virtuals: true });		

	VEProjectSchema.virtual('id').get(function () {return this._id;});
	VEProjectSchema.set('toJSON', { virtuals: true });		

};