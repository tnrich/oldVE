module.exports = function(app) {

var ObjectID = app.mongoose.mongo.ObjectID;
var GridStore = app.mongo.GridStore;
var db = app.GridStoreDB;

return {
	saveFile: function(fileData,cb){

	  var newObjectID = new ObjectID();

	  var gridStore = new GridStore(db, newObjectID, 'w');

	  // Open the file
	  //console.log("Opening gridstore");
	  gridStore.open(function(err, gridStore) {
	    if(err) return cb(err,null);
	    // Write some data to the file
	    //console.log("Writing file");
	    gridStore.write(fileData, function(err, gridStore) {
	      if(err) return cb(err,null);
	      // Close (Flushes the data to MongoDB)
	      //console.log("Closing gridstoer");
	      gridStore.close(function(err, result) {
	        if(err) return cb(err,null);
	        // Verify that the file exists
	        //console.log("Checking file");
	        GridStore.exist(db, newObjectID, function(err, result) {
	          if(err) return cb(err,null);
	          	//console.log("Returning id");
	          	return cb(false,newObjectID);
	        });
	      });
	    });
	  });

	},
	readFile: function(objectId,cb) {
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

	  // Open the file
	  /*
	  gridStore.open(function(err, gridStore) {
	    cb(gridStore.stream());
	    gridStore.read(gridStore.length,function(err,data){
	      cb(data);
	    });
	  });
	  */
	}
};

};