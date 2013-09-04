module.exports = function(app) {

var mongoose  = app.mongoose;
	GridStore = mongoose.mongo.GridStore,
    Grid      = mongoose.mongo.Grid,
	ObjectID  = mongoose.mongo.ObjectID;


function parse(options) {
	var opts = {};
	if (options.length > 0) {
		opts = options[0];
	}
	else
		opts = options;
 
	if (!opts.metadata)
		opts.metadata = {};
 
	return opts;
};

return {
	saveFile: function(fileData,cb){

		var options = {};

		var newObjectID = new ObjectID();
		var db = app.db.db,
			options = parse(options);

		options.metadata.filename = newObjectID.toString();
		
		new GridStore(db, newObjectID, "w", options).open(function(err, file){
			if(err) return cb(err,null);
			file.write(fileData, function(err, file){
				if(err) return cb(err,null);
				file.close(function(err,result){
					if(err) return cb(err,null);
					console.log("Saved file ",options.metadata.filename);
					return cb(false,newObjectID);
				});
			});
		});

	},
	readFile: function(objectId,cb) {

		var db = app.db.db,
			id = new ObjectID(objectId),
			store = new GridStore(db, id, "r", {root: 'fs'} );
	 
		console.log("Looking for file ",objectId);

		store.open(function(err, file) {
			if(err) { console.log(err); return(true,null);}

		    // Peform a find to get a cursor
		    var stream = file.stream(true);

		    // Pause the stream initially
		    stream.pause();

		    // Save read content here
		    var fileBuffer = '';

		    // For each data item
		    stream.on("data", function(item) {
		      // Pause stream
		      stream.pause();

		      fileBuffer += item.toString('utf8');

		      // Restart the stream after 1 miliscecond
		      setTimeout(function() {
		        stream.resume();
		        // Check if cursor is paused
		      }, 100);
		    });

		    // For each data item
		    stream.on("end", function(item) {
		    });
		    // When the stream is done
		    stream.on("close", function() {
		      cb(fileBuffer);
		    });

		    // Resume the stream
		    stream.resume();
		});

	/*
	  var gridStore = new GridStore(app.GridStoreDB, objectId, 'r');
	  
	  gridStore.open(function(err, file) {
	    // Peform a find to get a cursor
	    var stream = file.stream(true);

	    // Pause the stream initially
	    stream.pause();

	    // Save read content here
	    var fileBuffer = '';

	    // For each data item
	    stream.on("data", function(item) {
	      // Pause stream
	      stream.pause();

	      fileBuffer += item.toString('utf8');

	      // Restart the stream after 1 miliscecond
	      setTimeout(function() {
	        stream.resume();
	        // Check if cursor is paused
	      }, 100);
	    });

	    // For each data item
	    stream.on("end", function(item) {
	    });
	    // When the stream is done
	    stream.on("close", function() {
	      cb(fileBuffer);
	      app.GridStoreDB.close();
	    });

	    // Resume the stream
	    stream.resume();
	  });
	*/

	}
};

};


  // Open the file
  /*
  gridStore.open(function(err, gridStore) {
    cb(gridStore.stream());
    gridStore.read(gridStore.length,function(err,data){
      cb(data);
    });
  });
  */