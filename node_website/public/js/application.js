
function registerUser(registrationInfo) {
	$.ajax({
        method: 'POST',
		url: '/registerUser',
		data: {
                username: 	registrationInfo.registerUsernameField,
                password: 	registrationInfo.registerPasswordField,
                groupType: 	registrationInfo.registerOrganizationTypeComboBox,
                firstName: 	registrationInfo.registerFirstNameField,
                lastName: 	registrationInfo.registerLastNameField,
                email: 		registrationInfo.registerEmailField,
        }
	})
		.done(
			function(user) {
				console.log("User Registered");
			}
			)
		.fail(
			function() { 
				console.log("Error registering User");
			}
			)
		.always();	
}


$(document).ready(function() {
	$('#signup_form')
		.on('valid', function() {
			var registrationInfo = {
				registerFirstNameField: 			$("#first_name").val(),
				registerLastNameField: 				$("#last_name").val(),
				registerUsernameField: 				$("#username").val(),
				registerPasswordField: 				$("#password").val(),
				registerEmailField:     			$("#email").val(),
				registerOrganizationTypeComboBox: 	$("#organization").val(),
			}
			registerUser(registrationInfo);
		});
	
});

