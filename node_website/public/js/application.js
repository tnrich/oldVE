
function registerUser(registrationInfo) {
	$.ajax({
        method: 'POST',
		url: '/registerUser',
		data: {
                username: 	registrationInfo.registerUsernameField,
                password: 	registrationInfo.registerPasswordField,
                firstName: 	registrationInfo.registerFirstNameField,
                lastName: 	registrationInfo.registerLastNameField,
                email: 		registrationInfo.registerEmailField,
                organizationName: registrationInfo.registerOrganizationName,
                organizationType: registrationInfo.registerOrganizationType
        }
	})
		.done(
			function(data) {
				window.location.replace(data.redirect);
			}
			)
		.fail(
			function() { 
				window.location.replace("/loginUser");
			}
			)
		.always();	
}


$(document).ready(function() {
	
	$("a#signup_submit").on("click", function() {
    	$( '#signup_form' ).parsley('validate');

		if($('#signup_form').parsley('isValid')) {
				var registrationInfo = {
					registerFirstNameField: 			$("#first_name").val(),
					registerLastNameField: 				$("#last_name").val(),
					registerUsernameField: 				$("#username").val(),
					registerPasswordField: 				$("#password").val(),
					registerEmailField:     			$("#email").val(),
					registerOrganizationName: 			$("#organizationName").val(),
					registerOrganizationType: 			$("#organizationType").val()
				}
				registerUser(registrationInfo);
		}
	});

	$("a#login_submit").on("click", function() {
    	$( '#login_form' ).parsley('validate');
	});

	$("a#login_admin").on("click", function() {
		$.ajax({
	        method: 'POST',
			url: '/login',
			data: {
	                username: 	$("#username").val(),
	                password: 	$("#password").val(),
	        }
		})
			.done(
				function(data) {
					window.location.replace("/admin/dashboard");
				}
				)
			.fail(
				function() { 
					console.log("Error");
				}
				)
			.always();	
	});

});

