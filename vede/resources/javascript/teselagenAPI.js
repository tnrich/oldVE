function updateRegisteredApps(){
    // Clear registered Apps
    registeredApps = [];

    // Capture all iframes on parent
    var activeFrames = window.parent.frames;

    // Select frames that are either DE or VE
    for(var i=0;i<activeFrames.length;i++)
    {
        var val = activeFrames[i];
        var appType = $(val.document).find('meta[name="apptype"]').attr('content');
        var appURL = val.document.URL;
        registeredApps.push({appType:appType,reference:val,URL:appURL});
    }

    return registeredApps;
}

function findAppsByType(type){
    var registeredApps = updateRegisteredApps();
    var selectedApps = [];
    $(registeredApps).each(function(key,val){
        if(val.appType == type) selectedApps.push(val);
    });
    return selectedApps;
}

function bindToLocalStorage(){
    $(window).bind('storage', function (e) {
      var value = e.originalEvent.newValue;

      if(value)
      {
          var data = $.parseJSON(value);
          if(data.destination == teselagen.appType)
          {
                for(var action in teselagen.bindActions)
                {
                    var action = teselagen.bindActions[action];
                    if(action.action == data.action) action.cb(data.data);
                }

              localStorage.removeItem('actionsBinding');
          }
      }

    });
}

function bindMessagesListener(){
    window.addEventListener('message', receiver, false);
    function receiver(e) {
        var value = e.data;
        for(var action in teselagen.bindActions)
        {
            var action = teselagen.bindActions[action];
            if(action.action == value.action) action.cb(value.data);
        }

    }
}

var teselagen = 
{
    bindActions: [],
    bindUpdates: [],
    instances: {},
    appType: "",
    debug: false,
    triggerMethod: "postMessage",
    connect: function(params,callback)
    {
        this.appType = params.appType;
        var debug = teselagen.debug;

        if(debug) console.log("Connecting");

        var socket = io.connect(params.host);

        bindToLocalStorage();
        bindMessagesListener();

        socket.on('connect', function () {

            socket.emit('initSession', params);
           
            socket.on('ready', function (data) {
                if(debug) console.log(data.msg);
                callback();
            });

            socket.on('actionTriggered', function(data){
                for(var action in teselagen.bindActions)
                {
                    var action = teselagen.bindActions[action];
                    if(action.action == data.action) action.cb(data.data);
                }
            });

            socket.on('updatesBind',function(data){
                for(var update in teselagen.bindUpdates)
                {
                    var update = teselagen.bindUpdates[update];
                    update(data);
                }
            });

            socket.on('error', function (data) {
                console.log(data.msg);
            });
        });

        this.socket = socket;
    },
    getInstances: function()
    {
        this.socket.emit('getInstances',function(data){
            this.instances = data;
            console.log(data);
        });
    },
    triggerAction: function(destination,action,data)
    {

        if (teselagen.triggerMethod == "localStorage") {
            if(teselagen.debug) console.log("using localStorage");
            var data = JSON.stringify({destination:destination,action:action,data:data});
            localStorage.setItem("actionsBinding", data);
        }
        else if (teselagen.triggerMethod == "Sockets")
        {
            if(teselagen.debug) console.log("using Sockets");
            if(!destination || !action)
            {
                console.log("Destination or action not specified");
                return;
            }
            teselagen.socket.emit('triggerAction',{'destination':destination,'action':action,'data':data});
        }
        else if (teselagen.triggerMethod == "postMessage")
        {
            if(teselagen.debug) console.log('Using postMessage');
            var apps = findAppsByType(destination);
            $(apps).each(function(k,val){
                var payload = {action:action,data:data};
                val.reference.postMessage(payload, val.URL); 
            });
        }
    },
    bindAction: function(action,cb){
        this.bindActions.push({'action':action,'cb':cb});
        if(teselagen.debug) console.log("Method binded");
    },
    bindToUpdates: function(cb){
        this.bindUpdates.push(cb);
        if(teselagen.debug) console.log("Updates binded");
    },
    checkSessionId: function(sessionId)
    {
        this.socket.emit('checkSessionId',sessionId,function(data){
            console.log(data);
        });
    },
    getSequence: function(params,callback){
        this.socket.emit('getSequence',params,function(data){
            callback(data);
        });
    },
    getModel: function(params,callback){
        this.socket.emit('getModel',params,function(data){
            callback(data);
        });
    }
}