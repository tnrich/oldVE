
/**
 * /schemas.js  
 * -------------
 */

module.exports = function(app){

  var Schema = app.mongoose.Schema;

  var ExampleSchema = new Schema({
      name: String,
      payload: Schema.Types.Mixed
  })
  var Example = app.db.model('Examples', ExampleSchema);

  var ProtocolSchema = new Schema({
      model: String,
      created: Date,
      fileId: String
  })
  var Protocol = app.db.model('Protocol', ProtocolSchema);

  var ModelSchema = new Schema({
      name: String,
      payload: Schema.Types.Mixed
  })
  var Model = app.db.model('Models', ModelSchema);
    
  var UserSchema = new Schema({
      name: String,
      models: [ModelSchema],
      protocols: [ProtocolSchema]
  })
  var User = app.db.model('Users', UserSchema);

};