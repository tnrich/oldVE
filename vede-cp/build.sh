rm build/Vede/production/all-classes.js
sencha compile -classpath=ext/src,app \
		include -recursive and \
		-option debug:true \
		concat -out build/Vede/production/all-classes.js