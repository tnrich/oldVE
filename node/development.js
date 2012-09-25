module.exports = function(app){

var development = this;

app.testing = {};
app.testing.enabled = true;
app.testing.sessionId = "a99be7833401c5b70de90060f3c4c82e";

app.development = {};

var examples = [
'Combinatorial_Golden_Gate_example_parsed.json',
'Combinatorial_SLIC_Gibson_CPEC_example_parsed.json',
'DeviceEditor_example.json',
'Golden_Gate_example.json',
'Golden_Gate_example_idented_simplified.json',
'Golden_Gate_example_parsed.json',
'SLIC_Gibson_CPEC_example_parsed.json',
'dexml_parsed.json',
'dexml_raw.json'
];

app.development.reloadExamples = function(){

	var ExamplesModel = app.db.model("Examples");
	ExamplesModel.find({},function(err,results){
		if(results.length<5)
		{
			console.log('Re Loading Examples');	
			ExamplesModel.collection.drop(function(err){
				console.log("Examples dropped");

				examples.forEach(function(val){
				//Golden Gate example
				var rawmodel = app.fs.readFileSync(__dirname + "/resources/models/"+val, "utf8");
				var payload = JSON.parse(rawmodel);
				var name = val.replace(/\/"/g, '');
				name = name.replace(/\_/g, ' ');
				name = name.replace(/.json/g, '');
				var example = new ExamplesModel({'name':name,'payload':payload});
				example.save(function(){
					console.log('Example: '+example.name+' loaded');
				});

				});

			});
		}
		else
		{
			console.log("Examples already loaded");
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
		     console.log('Guest user created!');
		  });
		}
		else
		{
			console.log("Guest user already exist");
		}
	});
}

return development;
};