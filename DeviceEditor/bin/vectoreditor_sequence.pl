#!/usr/bin/perl

use strict;
use warnings;

use CGI qw(:standard);

# send fatal error messages to the browser window
use CGI::Carp qw/fatalsToBrowser set_message/;
set_message('For help, please see the <a href="http://j5.jbei.org/manual/pages/5
0.html">j5 error messages</a> documentation and/or send an email to Nathan Hills
on (<a href="mailto:njhillson@lbl.gov">njhillson@lbl.gov</a>).');

my $postData = "";
read (STDIN, $postData, $ENV{'CONTENT_LENGTH'});

my $title = "VectorEditor";

my $html = qq{Content-type: text/html

<html lang="en">
<head>
<title>$title</title>
<style>
body { margin: 0px; overflow: hidden }
</style>
<body>
    <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        id="VectorEditor" width="100%" height="100%"
        codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab"> 
        <param name="movie" value="../VectorEditor/VectorEditor.swf" /> 
        <param name="quality" value="high" /> 
        <param name="bgcolor" value="#869ca7" /> 
        <param name="allowScriptAccess" value="sameDomain" /> 
        <param name="flashvars" value="$postData" />
        <embed src="../VectorEditor/VectorEditor.swf"
            quality="high" bgcolor="#869ca7"
            width="100%" height="100%" name="VectorEditor" align="middle"
            play="true"
            loop="false"
            quality="high"
            allowScriptAccess="sameDomain"
            type="application/x-shockwave-flash"
            pluginspage="http://www.adobe.com/go/getflashplayer"
            flashvars="$postData"> 
        </embed> 
    </object> 
</body>
</html>
};

print $html;
