module.exports = function(app){

var development = this;

app.testing = {};
app.testing.enabled = false;
app.testing.sessionId = "a99be7833401c5b70de90060f3c4c82e";

app.development = {};



app.development.reloadExamples = function(){

	console.log('Dev: Checking examples collection');
	var ExamplesModel = app.db.model("Examples");
	ExamplesModel.find({},function(err,results){
		if(results.length<5)
		{
			console.log('Dev: Re Loading Examples');	
			ExamplesModel.collection.drop(function(err){
				console.log("Dev: Examples collection dropped");

				app.fs.readdir(__dirname + "/resources/models/",function(err,examples){

				examples = examples.filter(function(x){
					if(x.indexOf(".json") != -1) return x;
				});
				examples.forEach(function(val){
				var rawmodel = app.fs.readFileSync(__dirname + "/resources/models/"+val, "utf8");
				var payload = JSON.parse(rawmodel);
				var name = val.replace(/\/"/g, '');
				name = name.replace(/\_/g, ' ');
				name = name.replace(/.json/g, '');
				var example = new ExamplesModel({'name':name,'payload':payload});
				example.save(function(){
					console.log('Dev: Example '+example.name+' loaded');
				});

				});

			});

			});
		}
		else
		{
			console.log("Dev: Examples already loaded");
		}
	});
}

app.development.reloadUsers = function(){
	var User = app.db.model("Users");
	User.findOne({'name':'Guest'},function(err,results){
		if(results==null)
		{
		    var newuser = new User({name:'Guest'});
		    User.create(newuser, function (err, user) {
		     console.log("Dev: Guest user created!");
		  });
		}
		else
		{
			console.log("Dev: "+"Guest user already exist");
		}
	});
}

return development;
};