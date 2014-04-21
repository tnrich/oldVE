#!/usr/bin/perl -X
# j5Interface.pl
# Nathan Hillson and Rodrigo Pavez 11-JAN-14

use XML::RPC;
use Bio::Tools::j5::XML_RPC;

# local variables
my $xmlrpc = XML::RPC->new();

my $userinput =  <STDIN>;
chomp ($userinput);

print $xmlrpc->receive( $userinput, \&handler );

sub handler {
  my ( $methodname, @params ) = @_;

  if (!defined $params[0]->{"username"}) {
    $params[0]->{"username"} = "teselagen";
  }

  # return an error message for testing purposes
  if ($methodname=~/^ReturnErrorMessage$/) {
    die "j5_XML_RPC: This is a test of the XML-RPC error message system. This is only a test...";
  }

  elsif ($methodname=~/^ConvertSBOLXML$/) {
    return Bio::Tools::j5::XML_RPC::ConvertSBOLXML($params[0]);
  }

  elsif ($methodname=~/^DesignAssembly$/) {
    return Bio::Tools::j5::XML_RPC::Design_Assembly($params[0]);
  }
  
  elsif ($methodname=~/^CondenseMultipleAssemblyFiles$/) {
    return Bio::Tools::j5::XML_RPC::Condense_Multiple_Assembly_Files($params[0]);
  }
  
  elsif ($methodname=~/^DesignDownstreamAutomation$/) {
    return Bio::Tools::j5::XML_RPC::Design_Downstream_Automation($params[0]);
  }
  else {
    die "j5Interface_alt: method $methodname not recognized...";
  }
}


