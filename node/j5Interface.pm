#!/usr/bin/perl -t -w
# j5_xml_rpc.pl
# Nathan Hillson 22-JUN-11
# Modified by Rodrigo Pavez for Teselagen.com

local $^W = 0;
use XML::RPC;

use CGI qw(:standard);
$CGI::POST_MAX=1024 * 10000; # max 10Mb posts
use lib '/home/teselagen/j5service/';
use UserManager;
use Utils;

use lib ($CONFIG->{BIOPERL_LIB_DIRECTORY});
use Bio::Tools::j5::XML_RPC;

# local variables
my $q      = new CGI;
my $xmlrpc = XML::RPC->new();
my $xml    = $q->param('POSTDATA');

$userinput =  <STDIN>;
chomp ($userinput);

print $xmlrpc->receive( $userinput, \&handler );

sub handler {
  my ( $methodname, @params ) = @_;

  # local variables
  my $j5_session_id;
  my $user_id;
  my $user_manager = new UserManager();
  my $username;
  $j5_session_id = $params[0]->{"j5_session_id"};

  # return an error message for testing purposes
  if ($methodname=~/^ReturnErrorMessage$/) {
    die "j5_XML_RPC: This is a test of the XML-RPC error message system. This is only a test...";
  }

  elsif ($methodname=~/^ConvertSBOLXML$/) {
    return Bio::Tools::j5::XML_RPC::ConvertSBOLXML($params[0]);
  }

  elsif ($methodname=~/^CreateNewSessionId$/) {

      return {
	  j5_session_id => $j5_session_id,
      };
  }

    if ($methodname=~/^GetLastUpdatedUserFiles$/) {
      return Bio::Tools::j5::XML_RPC::Get_Last_Updated_User_Files($username);
    }

    if ($methodname=~/^DesignAssembly$/) {
      return Bio::Tools::j5::XML_RPC::Design_Assembly($params[0]);
    }

    if ($methodname=~/^CondenseMultipleAssemblyFiles$/) {
      return Bio::Tools::j5::XML_RPC::Condense_Multiple_Assembly_Files($params[0]);
    }

    if ($methodname=~/^DesignDownstreamAutomation$/) {
      return Bio::Tools::j5::XML_RPC::Design_Downstream_Automation($params[0]);
    }
    else {
      die "j5_XML_RPC: method $methodname not recognized...";
    }
  }