<html>
<head>
<title>TESTS</title>

<style>
.example {
  padding: 10px;
  border: 1px solid #ccc;
}
#drop_zone {
border: 2px dashed #bbb;
-moz-border-radius: 5px;
-webkit-border-radius: 5px;
border-radius: 5px;
padding: 25px;
text-align: center;
font: 20pt bold 'Vollkorn';
color: #bbb;
}
.thumb {
  height: 75px;
  border: 1px solid #000;
  margin: 10px 5px 0 0;
}
</style>

<style>
dl { width:300px;}
dl,dd { margin:0;}
dt { background: #99C; font-size 18px; padding: 5px; }
dt a { color: #000; }
dd a { color: #000; }
</style>


<script>
$(document).ready(function(){
 $("dd::first").hide();
 $("dd:not(:first)").hide();
 $("dt a").click(function(){
  $("dd:visible").slideUp("slow");
  $(this).parent().next().slideDown("slow");
  return false;
 });
});

</script>

</head>


<p>Mikes Code Snippet Testing Page</p>

<dt><a href="/"> Concatenation Test </a></dt>
<dd><?php include('html/concatenate.html');?></dd>

<dt><a href="/"> Vector Drawing Test </a></dt>
<dd><?php include('html/drawvector.html');?></dd>

<dt><a href="/"> Another Vector Drawing Test </a></dt>
<dd><?php include('html/anotherdrawvector.html');?></dd>

<dt><a href="/"> Genbank Feature Extraction Test </a></dt>
<dd><?php include('html/genbankFeat.html');?></dd>

<dt><a href="/"> DW's Genbank Extraction Test </a></dt>
<dd><?php include('html/genbankExtract.html');?></dd>

<dt><a href="/"> Using Form Input for Selecting Multiple Files Test </a></dt>
<dd>
<input type="file" id="files" name="files[]" multiple />
<output id="filelist"></output><hr>
</dd>

<dt><a href="/"> Using Form Input for Dragging Files into Drop Test </a></dt>
<dd>
<div id="drop_zone">Drop files here</div>
<output id="droplist"></output><hr>
</dd>

<dt><a href="/"> Reading Image Files Test - only image files will be imported </a></dt>
<dd>
<input type="file" value="Choose Files"  id="readfiles" name="readfiles[]" multiple />
<output id="readfilelist"></output><hr>
</dd>



<p>
<p>
<p>
<p>
<p>
<p>

<script type="text/javascript"><?php include('javascript/sms_common.js');?></script>

<script type="text/javascript"><?php include('javascript/concatenate.js');?></script>
<script type="text/javascript"><?php include('javascript/drawvector.js');?></script>
<script type="text/javascript"><?php include('javascript/anotherdrawvector.js');?></script>
<script type="text/javascript"><?php include('javascript/genbankFeat.js');?></script>
<script type="text/javascript"><?php
include('javascript/handleFileSelect.js');?></script>
<script type="text/javascript"><?php include('javascript/handleFileToDragSelect.js');?></script>
<script type="text/javascript"><?php include('javascript/handleDragOver.js');?></script>
<script type="text/javascript"><?php include('javascript/handleReadFileObject.js');?></script>



<script type="text/javascript"><?php
include('javascript/genbankExtract.js');?></script>
<script type="text/javascript"><?php
include('javascript/genbankExtractObj.js');?></script>
<script type="text/javascript" src="../extjs/ext-debug.js"></script>
<link rel="stylesheet" type="text/css" href="../extjs/resources/css/ext-all.css">

