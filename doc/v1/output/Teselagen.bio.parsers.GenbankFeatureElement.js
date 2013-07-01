Ext.data.JsonP.Teselagen_bio_parsers_GenbankFeatureElement({"subclasses":[],"mixins":[],"code_type":"ext_define","inheritable":false,"meta":{"author":["Diana Wong","Timothy Ham (original author)"]},"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Base<div class='subclass '><strong>Teselagen.bio.parsers.GenbankFeatureElement</strong></div></div><h4>Requires</h4><div class='dependency'><a href='#!/api/Teselagen.bio.parsers.GenbankFeatureQualifier' rel='Teselagen.bio.parsers.GenbankFeatureQualifier' class='docClass'>Teselagen.bio.parsers.GenbankFeatureQualifier</a></div><div class='dependency'><a href='#!/api/Teselagen.bio.util.StringUtil' rel='Teselagen.bio.util.StringUtil' class='docClass'>Teselagen.bio.util.StringUtil</a></div><h4>Files</h4><div class='dependency'><a href='source/GenbankFeatureElement.html#Teselagen-bio-parsers-GenbankFeatureElement' target='_blank'>GenbankFeatureElement.js</a></div></pre><div class='doc-contents'><p>Stores an array of Feature Elements in <a href=\"#!/api/Teselagen.bio.parsers.GenbankFeaturesKeyword\" rel=\"Teselagen.bio.parsers.GenbankFeaturesKeyword\" class=\"docClass\">Teselagen.bio.parsers.GenbankFeaturesKeyword</a>.\nAn Element (e.g. CDS, mRNA, promoter, etc) spans some part of the sequence.\nIts indices are defined by GenbankFeatureLocation and it's annotations by\n<a href=\"#!/api/Teselagen.bio.parsers.GenbankFeatureQualifier\" rel=\"Teselagen.bio.parsers.GenbankFeatureQualifier\" class=\"docClass\">Teselagen.bio.parsers.GenbankFeatureQualifier</a>.</p>\n\n<p>See the <a href=\"http://www.insdc.org/documents/feature_table.html#3.4\">Genbank file specifications</a>.\nThis class does not assume all locations of one feature are complement or not complement, join or not join.\nThis means:</p>\n\n<pre><code> complement(join(2691..4571,4918..5163))\n</code></pre>\n\n<p>is acceptable, and:</p>\n\n<pre><code> join(complement(4918..5163),complement(2691..4571))\n</code></pre>\n\n<p>is also acceptable, but assumes every location (i.e. the feature) is a complement. However:</p>\n\n<pre><code> join(complement(4918..5163),2691..4571)\n</code></pre>\n\n<p>would not be acceptable and all location pairs would be stored as complement.  (Is this biologically possible?)</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-config' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeatureElement'>Teselagen.bio.parsers.GenbankFeatureElement</span><br/><a href='source/GenbankFeatureElement.html#Teselagen-bio-parsers-GenbankFeatureElement-cfg-config' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeatureElement-cfg-config' class='name expandable'>config</a><span> : Object</span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{keyword: null, strand: 1, complement: false, join: false, featureQualifier: [], featureLocation: []}</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeatureElement'>Teselagen.bio.parsers.GenbankFeatureElement</span><br/><a href='source/GenbankFeatureElement.html#Teselagen-bio-parsers-GenbankFeatureElement-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Teselagen.bio.parsers.GenbankFeatureElement-method-constructor' class='name expandable'>Teselagen.bio.parsers.GenbankFeatureElement</a>( <span class='pre'>String keyword, String strand, Boolean complement, Boolean join, [<a href=\"#!/api/Teselagen.bio.parsers.GenbankFeatureQualifier\" rel=\"Teselagen.bio.parsers.GenbankFeatureQualifier\" class=\"docClass\">Teselagen.bio.parsers.GenbankFeatureQualifier</a> featureQualifer], [<a href=\"#!/api/Teselagen.bio.parsers.GenbankFeatureLocation\" rel=\"Teselagen.bio.parsers.GenbankFeatureLocation\" class=\"docClass\">Teselagen.bio.parsers.GenbankFeatureLocation</a> featureLocation]</span> ) : GenbankFeatureElement</div><div class='description'><div class='short'>Creates a new GenbankFeatureElement from inData. ...</div><div class='long'><p>Creates a new GenbankFeatureElement from inData.\nThere can be multiple featureQualifier and featureLocations for each FeatureElement.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>keyword</span> : String<div class='sub-desc'><p>e.g. source, CDS. Equivalent to a \"Type\"</p>\n</div></li><li><span class='pre'>strand</span> : String<div class='sub-desc'><p>1 for normal read, -1 for complement</p>\n</div></li><li><span class='pre'>complement</span> : Boolean<div class='sub-desc'><p>On complementary strand</p>\n</div></li><li><span class='pre'>join</span> : Boolean<div class='sub-desc'><p>Location is not continuous</p>\n</div></li><li><span class='pre'>featureQualifer</span> : <a href=\"#!/api/Teselagen.bio.parsers.GenbankFeatureQualifier\" rel=\"Teselagen.bio.parsers.GenbankFeatureQualifier\" class=\"docClass\">Teselagen.bio.parsers.GenbankFeatureQualifier</a> (optional)<div class='sub-desc'><p>Array of GenbankFeatureQualifiers</p>\n</div></li><li><span class='pre'>featureLocation</span> : <a href=\"#!/api/Teselagen.bio.parsers.GenbankFeatureLocation\" rel=\"Teselagen.bio.parsers.GenbankFeatureLocation\" class=\"docClass\">Teselagen.bio.parsers.GenbankFeatureLocation</a> (optional)<div class='sub-desc'><p>Array of GenbankFeatureLocations</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>GenbankFeatureElement</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-addFeatureLocation' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeatureElement'>Teselagen.bio.parsers.GenbankFeatureElement</span><br/><a href='source/GenbankFeatureElement.html#Teselagen-bio-parsers-GenbankFeatureElement-method-addFeatureLocation' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeatureElement-method-addFeatureLocation' class='name expandable'>addFeatureLocation</a>( <span class='pre'><a href=\"#!/api/Teselagen.bio.parsers.GenbankFeatureLocation\" rel=\"Teselagen.bio.parsers.GenbankFeatureLocation\" class=\"docClass\">Teselagen.bio.parsers.GenbankFeatureLocation</a> location</span> )</div><div class='description'><div class='short'>Add a single GenbankFeatureLocation to the featureLocation array ...</div><div class='long'><p>Add a single GenbankFeatureLocation to the featureLocation array</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>location</span> : <a href=\"#!/api/Teselagen.bio.parsers.GenbankFeatureLocation\" rel=\"Teselagen.bio.parsers.GenbankFeatureLocation\" class=\"docClass\">Teselagen.bio.parsers.GenbankFeatureLocation</a><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-addFeatureQualifier' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeatureElement'>Teselagen.bio.parsers.GenbankFeatureElement</span><br/><a href='source/GenbankFeatureElement.html#Teselagen-bio-parsers-GenbankFeatureElement-method-addFeatureQualifier' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeatureElement-method-addFeatureQualifier' class='name expandable'>addFeatureQualifier</a>( <span class='pre'><a href=\"#!/api/Teselagen.bio.parsers.GenbankFeatureQualifier\" rel=\"Teselagen.bio.parsers.GenbankFeatureQualifier\" class=\"docClass\">Teselagen.bio.parsers.GenbankFeatureQualifier</a> qualifier</span> )</div><div class='description'><div class='short'>Add a single GenbankFeatureQualifier to the featureQualifier array ...</div><div class='long'><p>Add a single GenbankFeatureQualifier to the featureQualifier array</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>qualifier</span> : <a href=\"#!/api/Teselagen.bio.parsers.GenbankFeatureQualifier\" rel=\"Teselagen.bio.parsers.GenbankFeatureQualifier\" class=\"docClass\">Teselagen.bio.parsers.GenbankFeatureQualifier</a><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-findLabel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeatureElement'>Teselagen.bio.parsers.GenbankFeatureElement</span><br/><a href='source/GenbankFeatureElement.html#Teselagen-bio-parsers-GenbankFeatureElement-method-findLabel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeatureElement-method-findLabel' class='name expandable'>findLabel</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Within a Feature, locates the \"label\" in JbeiSeqXml model and \"name\" in\nSequenceManager and FeaturedDNA data models. ...</div><div class='long'><p>Within a Feature, locates the \"label\" in JbeiSeqXml model and \"name\" in\nSequenceManager and FeaturedDNA data models.\nThis searches for the first Qualifier with the name (in this order):</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>name Name of Qualifier as used in Sequence Manager, FeaturedDNA, and JbeiSeq</p>\n</div></li></ul></div></div></div><div id='method-fromJSON' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeatureElement'>Teselagen.bio.parsers.GenbankFeatureElement</span><br/><a href='source/GenbankFeatureElement.html#Teselagen-bio-parsers-GenbankFeatureElement-method-fromJSON' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeatureElement-method-fromJSON' class='name expandable'>fromJSON</a>( <span class='pre'>Object json</span> ) : <a href=\"#!/api/Teselagen.bio.parsers.GenbankFeatureElement\" rel=\"Teselagen.bio.parsers.GenbankFeatureElement\" class=\"docClass\">Teselagen.bio.parsers.GenbankFeatureElement</a></div><div class='description'><div class='short'>Converts GenBank JSON back to GenBank model ...</div><div class='long'><p>Converts GenBank JSON back to GenBank model</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>json</span> : Object<div class='sub-desc'><p>GenbankFeatureElement in JSON form</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Teselagen.bio.parsers.GenbankFeatureElement\" rel=\"Teselagen.bio.parsers.GenbankFeatureElement\" class=\"docClass\">Teselagen.bio.parsers.GenbankFeatureElement</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getLastFeatureQualifier' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeatureElement'>Teselagen.bio.parsers.GenbankFeatureElement</span><br/><a href='source/GenbankFeatureElement.html#Teselagen-bio-parsers-GenbankFeatureElement-method-getLastFeatureQualifier' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeatureElement-method-getLastFeatureQualifier' class='name expandable'>getLastFeatureQualifier</a>( <span class='pre'></span> ) : <a href=\"#!/api/Teselagen.bio.parsers.GenbankFeatureElement\" rel=\"Teselagen.bio.parsers.GenbankFeatureElement\" class=\"docClass\">Teselagen.bio.parsers.GenbankFeatureElement</a></div><div class='description'><div class='short'>Get Last GenbankFeatureElement in features array ...</div><div class='long'><p>Get Last GenbankFeatureElement in features array</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Teselagen.bio.parsers.GenbankFeatureElement\" rel=\"Teselagen.bio.parsers.GenbankFeatureElement\" class=\"docClass\">Teselagen.bio.parsers.GenbankFeatureElement</a></span><div class='sub-desc'><p>element</p>\n</div></li></ul></div></div></div><div id='method-toJSON' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeatureElement'>Teselagen.bio.parsers.GenbankFeatureElement</span><br/><a href='source/GenbankFeatureElement.html#Teselagen-bio-parsers-GenbankFeatureElement-method-toJSON' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeatureElement-method-toJSON' class='name expandable'>toJSON</a>( <span class='pre'></span> ) : Object</div><div class='description'><div class='short'>Converts to JSON format. ...</div><div class='long'><p>Converts to JSON format.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>json</p>\n</div></li></ul></div></div></div><div id='method-toString' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeatureElement'>Teselagen.bio.parsers.GenbankFeatureElement</span><br/><a href='source/GenbankFeatureElement.html#Teselagen-bio-parsers-GenbankFeatureElement-method-toString' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeatureElement-method-toString' class='name expandable'>toString</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Converts this GenbankLocusKeyword to Genbank file format string ...</div><div class='long'><p>Converts this GenbankLocusKeyword to Genbank file format string</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>genbankString</p>\n</div></li></ul></div></div></div></div></div></div></div>","html_meta":{"author":null},"aliases":{},"files":[{"href":"GenbankFeatureElement.html#Teselagen-bio-parsers-GenbankFeatureElement","filename":"GenbankFeatureElement.js"}],"superclasses":["Ext.Base"],"component":false,"tagname":"class","requires":["Teselagen.bio.util.StringUtil","Teselagen.bio.parsers.GenbankFeatureQualifier"],"members":{"event":[],"property":[],"css_var":[],"method":[{"owner":"Teselagen.bio.parsers.GenbankFeatureElement","meta":{},"tagname":"method","name":"constructor","id":"method-constructor"},{"owner":"Teselagen.bio.parsers.GenbankFeatureElement","meta":{},"tagname":"method","name":"addFeatureLocation","id":"method-addFeatureLocation"},{"owner":"Teselagen.bio.parsers.GenbankFeatureElement","meta":{},"tagname":"method","name":"addFeatureQualifier","id":"method-addFeatureQualifier"},{"owner":"Teselagen.bio.parsers.GenbankFeatureElement","meta":{},"tagname":"method","name":"findLabel","id":"method-findLabel"},{"owner":"Teselagen.bio.parsers.GenbankFeatureElement","meta":{},"tagname":"method","name":"fromJSON","id":"method-fromJSON"},{"owner":"Teselagen.bio.parsers.GenbankFeatureElement","meta":{},"tagname":"method","name":"getLastFeatureQualifier","id":"method-getLastFeatureQualifier"},{"owner":"Teselagen.bio.parsers.GenbankFeatureElement","meta":{},"tagname":"method","name":"toJSON","id":"method-toJSON"},{"owner":"Teselagen.bio.parsers.GenbankFeatureElement","meta":{},"tagname":"method","name":"toString","id":"method-toString"}],"css_mixin":[],"cfg":[{"owner":"Teselagen.bio.parsers.GenbankFeatureElement","meta":{},"tagname":"cfg","name":"config","id":"cfg-config"}]},"alternateClassNames":[],"inheritdoc":null,"mixedInto":[],"name":"Teselagen.bio.parsers.GenbankFeatureElement","extends":"Ext.Base","id":"class-Teselagen.bio.parsers.GenbankFeatureElement","parentMixins":[],"singleton":false,"uses":[],"statics":{"property":[],"event":[],"method":[],"css_var":[],"css_mixin":[],"cfg":[]}});