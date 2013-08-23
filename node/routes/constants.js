module.exports = function(app){

    app.constants = {};
    app.constants.emptyGenbank = '"LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//"';
    app.constants.activationEmailText = '<p>\
Dear <username>,<br>\
<br>\
Welcome to the TeselaGen Beta site. We are actively building a new site based on feedback from users like you! Until then, this site provides a nice interface for our flagship product, the DNA assembly protocol generation service "j5". We really value your input about the current site and importantly, how the j5 service is performing for the construction of your DNA.<br>\
<br>\
In exchange for the use of the service, we ask that you help us out by giving us some examples of what DNA assembly tasks you are trying to accomplish, how j5 was able to help (or not) and how we could make the service even better. If you have data on success rates for assemblies, that would be particularly useful.<br>\
<br>\
TeselaGen runs on a secure server and we do not look at your constructs or assemblies without your permission. This is very important to us since in addition to our many academic users, we have several large companies who use the service, and the security of that data is very important. If you would like more information about how we keep your data secure let me know and I would be glad to send you more information. I can also send you a copy of the draft EULA that will be in force for version 1.0 of our software, due later this year.<br>\
<br>\
We firmly believe that we can build a service that solves your real world DNA assembly problems better than any other. All of us here at TeselaGen are experienced bench scientists with a unique mix of software, automation, and wet-lab experience. We hope to build you a dynamic and evolving service that you will enjoy and find useful.<br>\
</p><br>\
<activation>Click here to activate your account and start using our application.</a><br>\
<p><br>\
Best Wishes,<br>\
<br>\
Mike<br>\
<br>\
CEO, TeselaGen Bio<br>\
<br>\
PS: Don\'t hesitate to give me a call or shoot me an email if you have any questions that can\'t be answered through the website feedback form.\
</p>\
';

}
