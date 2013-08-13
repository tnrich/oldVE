/*
/models/token.js  
--------------
*/

module.exports = function(mongoose) {
  var collection = 'Tokens';
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;

  var schema = new Schema({
    description: String,
    used: Boolean
  });

  this.model = mongoose.model(collection, schema);

  return this;
};  