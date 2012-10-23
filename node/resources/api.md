<link href="http://kevinburke.bitbucket.org/markdowncss/markdown.css" rel="stylesheet"></link>

#Api Documentation
##Installation
    <script src="http://teselagen.com:443/assets/js/teselagenAPI.js">

##Configuration
    teselagen.triggerMethod = String ["localStorage" or "Sockets" or "postMessage"] (Default postMessage)
    teselagen.debug = Boolean [true or false] (Log debug info on console)

##Methods
###teselagen.connect( params,callback() )
######Connects to the server using given parameters
    params : { sessionId: [sessionID] , appType: [de or ve] }
    callback: method to be called after connected.
###teselagen.getInstances( callback )
######Get object that represent active instances of current session
    callback(data): method to be called after action is received (it receives data as a param.)
###teselagen.bindToUpdates( callback )
######Trigger after session state changes like a new instance connected with current sessionId
    callback(data): method to be called after action is received (it receives data as a param.)
###teselagen.triggerAction( destination , action , data )
######Trigges an action on a remote Instance
    destination: platform to call (currently de or ve)
    action: action to trigger (currently openSequence or openModel)
    data: additional data to send (object or raw data)
###teselagen.bindAction( action, callback )
######Binds a function to be called after specific action is trigger from remote server
    action: name of the action to suscribe
    callback(data): method to be called after action is received (it receives data as a param.)
###teselagen.getModel( params, callback )
######Get a model from mongoDB
    params: {modelId:'501ad23663086d76c4000001'}
    callback(data): method to be called after action is received (it receives data as a param.)
###teselagen.getSequence( params, callback )
######Get a sequence from mongoDB
    params: {modelId:'501ad23663086d76c4000001',sequenceId:'23d714d34632e24f53c2095f05e79f17aded7ec22651c20e4b320f82bc2bf731'}
    callback(data): method to be called after action is received (it receives data as a param.)
###teselagen.checkSessionId( sessionId, callback )
######Check if a given sessionId is valid
    sessionId: String
    callback(data): method to be called after action is received (it receives data as a param.)
