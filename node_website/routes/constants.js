module.exports = function(app, express){

    app.constants = {};
    app.constants.emptyGenbank = '"LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//"';
        app.constants.activationEmailText = '<p>\
Hey Mike,<br>\
<br>\
The following user has requested a new Beta Account on TeselaGen:<br>\
</p>\
<p>\
<b>Credentials:</b><br>\
<br>\
<b>Name</b>: <firstName>, <lastName><br>\
<br>\
<b>Email:</b> <email><br>\
<br>\
<b>Organization Name</b>: <organizationName><br>\
<br>\
<b>Organization Type</b>: <organizationType><br>\
<br>\
<b>Username:</b> <username><br>\
</p>\
<p>\
<activation>Click here to activate their account</a><br>\
';
	app.constants.registrationEmailText = '<p>\
Dear <username>, <br>\
<p>\
Thanks for signing up for a TeselaGen account! Your info is being reviewed and we will be sending you an activation email very soon.<br>\
</p>\
Best Wishes,<br>\
<br>\
Mike<br>\
<br>\
<p>\
Mike Fero, PhD<br>\
CEO, TeselaGen Biotechnology Inc.<br>\
</p>\
<p>\
Twitter: @TeselaGen<br>\
email: mike.fero@teselagen.com<br>\
phone: 650-387-5932<br>\
</p>\
	';

}
