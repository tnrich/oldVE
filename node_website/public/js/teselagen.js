$(function(){
  
  $.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if(results!=null) return results[1] || 0;
    else return null;
  }

  var setNotification = function(data)
  {
    var n
    //webkitNotifications
    if (window.webkitNotifications.checkPermission() == 0)
    {
      n = window.webkitNotifications.createNotification('','Teselagen Debug',data);
      n.show();
    }
    else
    {
      window.webkitNotifications.requestPermission(setNotification(data));
    }
  };

  if($('ul.nav.btn-group.pull-right span').html()=="Logout")
  $.ajax({
        type: "GET",
        url: '/status',
        success: function(data){
          console.log(data);
          //setNotification("Session Expires on: "+data['expires']);
        }
  });

})
