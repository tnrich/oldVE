var deviceEditor;

$(function() {

// Device editor instances functions

function deviceEditorInstance(counter)
{
  var counter = counter;
  $('#deviceEditorInstances').append('<div style="height:500px;" class="tab-pane"><iframe src="http://eaa.teselagen.com/deviceeditor"></iframe></div>');
  $('#deviceEditorInstances div').last().data('key',this);
  var instance = $('#deviceEditorInstances div').last();
  $('#denav.nav').append('<li><a class="din">Device Editor '+(counter+1)+'</a><a class="close btn btn-large debut2">x</a></li>');
  var tab = $('#denav.nav li').last();
  $('#denav.nav li a.din').last().click(function(){deviceEditor.changeToInstance(counter)});
  $('#denav.nav li a.close').last().click(function(){
    console.log("deleting instance!");
    tab.remove();
    deviceEditor.instances.splice(counter,1);
    delete this;
  });
  this.hide = function(){
    console.log("hiding instance "+counter)
    $(instance).hide();
    $(tab).removeClass('active');
    console.log($(tab));
  };
  this.show = function(){
    $(instance).show();
    $(tab).addClass('active');
  };
  this.getCounter = function(){return counter;};
  return this;
}

deviceEditor = {
  domObject : $('#deviceEditor'),
  instances : [],
  counter : -1,
  activeInstance : null,
  createNewInstance : function(){
    this.counter++;
    this.instances.push(new deviceEditorInstance(this.counter));
    this.changeToInstance(this.counter);
  },
  getNumberOfInstances : function(){
    return this.instances.length;
  },
  changeToInstance : function(index){
    console.log(deviceEditor.activeInstance);
    if(deviceEditor.activeInstance) deviceEditor.activeInstance.hide();
    deviceEditor.activeInstance = this.instances[index];
    console.log("Active instance is: "+deviceEditor.activeInstance.getCounter());
    deviceEditor.activeInstance.show();
  }
};
  
  $('#add_de_in').click(function(){
    deviceEditor.createNewInstance();
  });

  $('#go_deviceEditor').click(function(){
    deviceEditor.createNewInstance();
    switchTab('#deviceEditor');
    $('#de.debar').fadeIn();
    //deviceEditor.getInstances();
  });


// Dashboard functions
  function switchTab(tabSelector){
    if($(tabSelector).length>0)
    {
      var activePane = $('.tab-pane.active');
      $(activePane).removeClass('active');
      $(activePane).hide();
      $(tabSelector).addClass('active');
      $(tabSelector).fadeIn('fast');
      $(tabSelector).run();
    }
    else
    {
      console.log('resource not found!');
    }
  }

  // Delete slashes on urls
  function stripSlash(str) {
  if(str.substr(0,1) == '/') {
  return str.substr(1, str.length);
  }
  return str;
  }

  // Catch all a[href] to be processed as tabs and prevent accidental change of url
  $('a').click(function(){
    if($(this).attr('href')!=undefined)
    {
      var ref = stripSlash($(this).attr('href'));
      console.log("trying to open link "+ref);
      switchTab('#'+ref);
      return false;
    }
    else {return true;}
  });


  // Show starting Tab -> Dashboard
  $('#dashboard').addClass('active');
  $('#dashboard').fadeIn('fast');

  // Warns user if tries to close the DOM (Deactivated on DEV)
  /*
  window.onbeforeunload = function() {
      return 'You have running working instances, closing this windows can result in information lost';
  };
  */

  $.fn.run = function() { 
    var id = $(this).attr('id');
    //console.log(id);
    switch(id) {
      case 'manage-users': getUsers();
      case 'manage-tokens': getTokens();
      case 'edit-account': getUserAccount();
    }
  };

  $.fn.cleanForm = function() { 
    $.each($(this).find('input'),function(index,value){$(value).val('');});
  };

  function flashCallback(data,success)
  {
    $('#flash .inner.alert').removeClass('alert-error');
    if(!success) $('#flash .inner.alert').addClass('alert-error');
    
    $('#flash h4').html(data);
    $('#flash').slideDown('fast');
    $('#flash').delay(3000).fadeOut('fast');
  }

  $('#flash a.close').click(function(){$('#flash').hide();});

  function getTokens(){
    $.ajax({
    type: "GET",
    url: '/getTokens',
    data: {offset:0},
    success: function(data) {
        $('#manage-tokens tbody#table-content').html('');
        $.each(data['tokens'], function(key, value) { 
            $('#manage-tokens tbody#table-content').append('<tr><td>'+value['_id']+'</td><td>'+value['description']+'</td><td>'+value['used']+'</td><td><a class="delete-token" href="'+value['_id']+'"><i class="icon-pencil"></i> Delete</a></td></tr>');
        });
        $('.delete-token').click(function(){
          deleteToken($(this).attr('href'));
          return false;
        });
    }});
  };

  function getUsers(){
    $.ajax({
    type: "GET",
    url: '/manage/getData',
    data: {offset:0},
    success: function(data) {
        $('#table-content').html('');
        $.each(data['users'], function(key, value) { 
            $('#table-content').append('<tr data-id="'+value['_id']+'"><td>'+value['email']+'</td><td>'+value['firstName']+' '+value['lastName']+'</td><td><a class="edituser" href="'+value['_id']+'"><i class="icon-pencil"></i> Edit</a></td></tr>');
        });
        $('.edituser').click(function(){
          getUserData($(this).attr('href'));
          $('#usereditModal').modal();
          return false;
        });
    }});
  };

  function deleteToken(_id)
  {
    $.ajax({
        type: "POST",
        url: '/delete-token',
        data: {'_id':_id},
        success: function(data) {
          $('.tab-pane.active').run();
          flashCallback(data,true);
        },
        statusCode: {
        401: function(data) {
          flashCallback(data.responseText,false);
        }} 
      });
  }

  function getUserAccount(){
    $.ajax({
    type: "POST",
    url: '/getAccountData',
    success: function(data) {
          console.log(data);
          $.each( data, function(name, value) {
            $('form#edit-account input[name*="'+name+'"]').val(value);
          });
    }});
  };

  function getUserData(_id){
    $.ajax({
    type: "POST",
    url: '/getUserData',
    data: {_id:_id},
    success: function(data) {
          console.log(data);
          $.each( data, function(name, value) {
            $('form#edit-user input[name*="'+name+'"]').val(value);
          });
    }});
  };

  $('form#create-user').live("submit", function(form) {
    $.ajax({
        type: "POST",
        url: '/create-user',
        data: $(form.currentTarget).serialize(),
        success: function(data) {
          $('#usereditModal').modal('hide');
          $('.tab-pane.active').run();
          flashCallback(data,true);
          $(form.currentTarget).cleanForm();
        } 
    });
  return false;
  });

  $('form#edit-user,form#edit-account').live("submit", function(form) {
    $.ajax({
        type: "POST",
        url: '/editUser',
        data: $(form.currentTarget).serialize(),
        success: function(data) {
          $('#usereditModal').modal('hide');
          $('.tab-pane.active').run();
          flashCallback(data,true);
          $(form.currentTarget).cleanForm();
        } 
    });
  return false;
  });

  $('form#change-password').live("submit", function(form) { 
    $.ajax({
        type: "POST",
        url: '/change-password',
        data: $(form.currentTarget).serialize(),
        success: function(data) {
          flashCallback(data,true);
          $(form.currentTarget).cleanForm();
        },
        statusCode: {
        401: function(data) {
          flashCallback(data.responseText,false);
          $(form.currentTarget).cleanForm();
        }} 
      });
    return false;
  });

  $('form#edit-user .btn-danger').click(function(){
    $('#usereditModal').modal('hide');
    $.ajax({
        type: "POST",
        url: '/delete-account',
        data: {'_id':$(this).parent().parent().find('input[name="user[_id]"]').val()},
        success: function(data) {
          $('.tab-pane.active').run();
          $('form#edit-user').cleanForm();
          flashCallback(data,true);
        },
        statusCode: {
        401: function(data) {
          flashCallback(data.responseText,false);
          $('form#edit-user').cleanForm();
        }} 
      });
    return false;
  });

});