/*
/models/user.js  
--------------
*/

module.exports = function(mongoose) {
  var collection = 'User';
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;

  var schema = new Schema({
  	firstName: String,
  	lastName: String,
  	email: String,
    hash: String
  });

  schema
  .virtual('fullname')
  .get(function () {
    return this.firstName + ' ' + this.lastName;
  });

  this.model = mongoose.model(collection, schema);

  return this;
};