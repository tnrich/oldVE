module.exports = function(app){

    app.constants = {};
    app.constants.emptyGenbank = '"LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//"';
    app.constants.activationResponseEmailText = '<p>\
Dear <username>,<br>\
<br>\
Welcome to the TeselaGen Beta site, your account at www.teselagen.com is now active.<br>\
<br>\
You should be able to login via the login button at upper right at www.teselagen.com, or at http://www.teselagen.com/user/login. Use the username and password you requested at registration.<br>\
<br>\
We are really excited about our slick new interface that runs natively in your browser (you will need to use a HTML5 browser like the most recent version of Chrome), as well as the new parts library database feature. Let us know how it is working for you. Also, we really value your input about how our cloud-based service is performing for the construction of your DNA assembly protocols. If you can help us out by giving us some examples of how TeselaGen was able to help (or not) that would be great.<br>\
<br>\
We firmly believe that this is a service that solves real world DNA assembly problems better than any other. All of us here at TeselaGen are experienced bench scientists with a unique mix of software, automation, and wet-lab experience. We hope to build you a dynamic and evolving service that you will enjoy and find useful in the pursuit of your research.<br>\
<p>\
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
