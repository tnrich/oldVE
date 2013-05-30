db.mycollection.findOne()
db.getCollectionNames().forEach(function(collection) {
	db.getCollection(collection).remove();
	print(collection+" cleared");
});
