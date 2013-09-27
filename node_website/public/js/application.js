
function registerUser(registrationInfo) {
	$.ajax({
        method: 'POST',
		url: '/registerUser',
		data: {
                username: 	registrationInfo.registerUsernameField,
                password: 	registrationInfo.registerPasswordField,
                orgType: 	registrationInfo.registerOrganizationTypeComboBox,
                firstName: 	registrationInfo.registerFirstNameField,
                lastName: 	registrationInfo.registerLastNameField,
                email: 		registrationInfo.registerEmailField,
                affiliationName: registrationInfo.registerAffiliationName,
                affiliationType: registrationInfo.registerAffiliationType
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
					registerOrganizationTypeComboBox: 	$("#organization").val(),
					registerAffiliationName: 			$("#affiliationName").val(),
					registerAffiliationType: 			$("#affiliationType").val()
				}
				registerUser(registrationInfo);
		}
	});

	$("a#login_submit").on("click", function() {
    	$( '#login_form' ).parsley('validate');
	});

});

