module.exports = function(app){

    app.constants = {};
    app.constants.emptyGenbank = '"LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//"';
    app.constants.activationResponseEmailText = '<p>\
Dear <firstName>,<br>\
<br>\
Welcome to TeselaGen! Your username is:  ' + '<username>' + '. To complete the registration process we request that you confirm your account by clicking the link below:<br>\
<br>\
Activate Account:' + '<activation>' + '<br>\
<br>\
<p>\
Thank you,<br>\
<br>\
The TeselaGen Team<br>\
<br>\
<p>\
This e-mail was sent to you at your request. If you have received this e-mail in error, we apologize for any inconvenience. If you believe this message is inappropriate or an abuse of the TeselaGen system, please let us know.<br>\
</p>\
<p>\
Twitter: @TeselaGen<br>\
email: support@teselagen.com<br>\
phone: 650-387-5932<br>\
</p>\
';    

	app.constants.forgotPassword = '<p>\
Dear <firstName>,<br>\
<br>\
<a href="<password reset link>">Click here to reset your password</a>\
';

    app.constants.userActivationEmailText = '<p>\
	Dear <username>,<br>\
	<br>\
	Welcome to TeselaGen! Your username is: ' + '<username>' + '. To complete the registration process we request that you confirm your account by clicking the link below:<br>\
	<br>\
	Activate Account: ' + '<activation>' + '<br>\
	<br>\
	<p>\
	Thank you,<br>\
	<br>\
	The TeselaGen Team<br>\
	<br>\
	<p>\
	This e-mail was sent to you at your request. If you have received this e-mail in error, we apologize for any inconvenience. If you believe this message is inappropriate or an abuse of the TeselaGen system, please let us know.<br>\
	</p>\
	<p>\
	Twitter: @TeselaGen<br>\
	email: support@teselagen.com<br>\
	phone: 650-387-5932<br>\
	</p>\
	'; 

}
