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

  if(window.location.hash!="")
  {
    $('#loginModal').modal();
    $('#login-form .control-group.success').hide();
    $('#login-form .control-group.error').show();
    $('#login-form .control-group.error span.help-inline').html("You must login to continue.");
    $('#login-form input#username').focus();
  }

  $('#login-cancel').bind('click',function(){
    $('#loginModal').modal('hide');
  });

  if($('#login-form')[0]) {
    $('#login-form').live("submit", function() {
        var login = $('#login-form input#username').val();
        var password = $('#login-form input#password').val();
        var remember = $('#login-form input#remember').is(':checked');

        $.ajax({
          type: "POST",
          url: '/login',
          data: { login: login, password: password, remember: remember},
          statusCode: {
              401: function(res) {
                $('#login-form .control-group.error span.help-inline').html('Bad credentials');
                $('#login-form .control-group.success').hide();
                $('#login-form .control-group.error').show();
                $('#loginModal').effect("shake", { times:2 }, 60);
              },
              404: function() {
                $('#login-form .control-group.error span.help-inline').html('Service not found');
                $('#login-form .control-group.success').hide();
                $('#login-form .control-group.error').show();
              },
              500: function() {
                $('#login-form .control-group.error span.help-inline').html('Service unavailable');
                $('#login-form .control-group.success').hide();
                $('#login-form .control-group.error').show();
              }
          },
          success: function(data) {
            $('#login-form .control-group.success span.help-inline').html("Success! Redirecting.");
            $('#login-form .control-group.error').hide();
            $('#login-form .control-group.success').show();
            if($.urlParam('callback')!=null) {$(window).attr("location",$.urlParam('callback'));}
            else {$(window).attr("location","/dashboard");}
          } 
        });
      
        return false;
      });
    }

  $('#login-btn').bind('click', function() {
    
    $('#loginModal').modal();
    $('#login-form span.help-inline').html('');
    $('#login-form input#username').val('');
    $('#login-form input#password').val('');
    $('#login-form input#username').focus();

  $('#username').val('rpavez@gmail.com');
  $('#password').val('123');
  });
  $('#username').val('rpavez@gmail.com');
  $('#password').val('123');
})
