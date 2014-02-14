var client = new ZeroClipboard( document.getElementById("copy-button"), {
  moviePath: "/libs/zerotoclipboard/ZeroClipboard.swf"
} );

client.on( "load", function(client) {
  client.on( "complete", function(client, args) {
    alert("Emails copied to clipboard" );
  });
});

$(function(){
  console.log("Ready for mailing");
});
