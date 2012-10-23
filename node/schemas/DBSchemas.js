/**
 * Schemas for the DB
 * -------------
 */

module.exports = function (app) {

	var Schema = app.mongoose.Schema;
	var oIDRef = app.mongoose.Schema.Types.ObjectId;

	app.db.model('Examples', new Schema({
		name: String,
		payload: Schema.Types.Mixed
	}));


	var VEProject = app.db.model('VEProject', new Schema({
		name: String
	}));

	var DEProjectSchema = new Schema({
		project_id : { type: oIDRef, ref: 'Project' },
		name: String
	});
	app.db.model('DEProject', DEProjectSchema);

	var ProjectSchema = new Schema({
		user_id : { type: oIDRef, ref: 'User' },
		name: String,
		DEProjects : [{ type: oIDRef, ref: 'DEProject' }],
	});
	app.db.model('Project', ProjectSchema);

	var UserSchema = new Schema({
		username: String,
		name: String,
		projects : [{ type: oIDRef, ref: 'Project' }],
		preferences: Schema.Types.Mixed
	});
	app.db.model('User', UserSchema);

	UserSchema.virtual('id').get(function () {return this._id;});
	UserSchema.set('toJSON', { virtuals: true });

	ProjectSchema.virtual('id').get(function () {return this._id;});
	ProjectSchema.set('toJSON', { virtuals: true });	

	DEProjectSchema.virtual('id').get(function () {return this._id;});
	DEProjectSchema.set('toJSON', { virtuals: true });		

};