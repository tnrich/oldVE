/**
 * Mongoose schema definitions:
 * 
 * + User
 * + j5run
 * + sequence
 * + part
 * + veproject
 * + deproject
 * + project
 * 
 * @module ./schemas/DBSchemas
 */

module.exports = function (app) {

	var registerSchema = function(name,schema){
		app.db.model(name, schema);
		schema.virtual('id').get(function () {return this._id.toString();});
		schema.set('toJSON', { virtuals: true });
		schema.set('toJSON', { virtuals: true });
	};

	var Schema = app.mongoose.Schema;
	var oIDRef = app.mongoose.Schema.Types.ObjectId;
	var Mixed = app.mongoose.Schema.Types.Mixed;

	var j5RunSchema = new Schema({
		deproject_id: String,
		name: String,
		file_id: oIDRef,
		date: Date,
		j5Results: Mixed
	});
	registerSchema('j5run', j5RunSchema);

	var SequenceSchema = new Schema({
		veproject_id: String,
		sequenceFileContent: String,
		sequenceFileFormat: String,
		hash: String,
		partSource: String,
		sequenceFileName: String
	});
	registerSchema('sequence', SequenceSchema);

	var PartSchema = new Schema({
		id                :  String,
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

	PartSchema.pre('save', function (next) {
	  this.id = this._id;
	  next();
	})

	app.db.model('part', PartSchema);

	var VEProjectSchema = new Schema({
		name: String,
		project_id : { type: oIDRef, ref: 'project' },
		sequencefile_id: { type: oIDRef, ref: 'sequence' },
		parts: [ { type: oIDRef, ref: 'part' } ]
	});
	registerSchema('veproject', VEProjectSchema);

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
			rules: Mixed
		},
		j5runs : [{ type: oIDRef, ref: 'j5run' }]
	});
	registerSchema('deproject', DEProjectSchema);

	var ProjectSchema = new Schema({
		user_id : { type: oIDRef, ref: 'User' },
		dateCreated: String,
		dateModified: String,
		name: String,
		deprojects : [{ type: oIDRef, ref: 'deproject' }],
		veprojects : [{ type: oIDRef, ref: 'veproject' }],
		projecttree: {
			deprojects: [Mixed],
			veproject: [Mixed],
			parts: [Mixed]
		}
	});
	registerSchema('project', ProjectSchema);

	var UserSchema = new Schema({
		username: String,
		name: String,
		projects : [{ type: oIDRef, ref: 'project' }],
		preferences: Mixed
	});
	registerSchema('User', UserSchema);

	DEProjectSchema.post('save', function() {
		var Project = app.db.model("project");
		var self = this;
	    Project.findById(this.project_id,function(err,proj){	
	     	proj.projecttree.deprojects.push({'name':self.name,'id':self.id});
	     	proj.save();
	    });	  
	});
		
};