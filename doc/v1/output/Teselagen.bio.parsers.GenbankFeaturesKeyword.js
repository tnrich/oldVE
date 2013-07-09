Ext.data.JsonP.Teselagen_bio_parsers_GenbankFeaturesKeyword({"subclasses":[],"mixins":[],"code_type":"ext_define","inheritable":false,"meta":{"author":["Diana Wong","Timothy Ham (original author)"]},"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Base<div class='subclass '><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='docClass'>Teselagen.bio.parsers.Keyword</a><div class='subclass '><strong>Teselagen.bio.parsers.GenbankFeaturesKeyword</strong></div></div></div><h4>Requires</h4><div class='dependency'><a href='#!/api/Teselagen.bio.parsers.GenbankFeatureElement' rel='Teselagen.bio.parsers.GenbankFeatureElement' class='docClass'>Teselagen.bio.parsers.GenbankFeatureElement</a></div><div class='dependency'><a href='#!/api/Teselagen.bio.util.StringUtil' rel='Teselagen.bio.util.StringUtil' class='docClass'>Teselagen.bio.util.StringUtil</a></div><h4>Files</h4><div class='dependency'><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword' target='_blank'>GenbankFeaturesKeyword.js</a></div></pre><div class='doc-contents'><p>Stores an array of GenbankFeatureElements. Is created when parsing the line \"FEATURES\" from a Genbank file.\nSame level as <a href=\"#!/api/Teselagen.bio.parsers.GenbankKeyword\" rel=\"Teselagen.bio.parsers.GenbankKeyword\" class=\"docClass\">Teselagen.bio.parsers.GenbankKeyword</a>,\n<a href=\"#!/api/Teselagen.bio.parsers.GenbankLocusKeyword\" rel=\"Teselagen.bio.parsers.GenbankLocusKeyword\" class=\"docClass\">Teselagen.bio.parsers.GenbankLocusKeyword</a>,\nand <a href=\"#!/api/Teselagen.bio.parsers.GenbankOriginKeyword\" rel=\"Teselagen.bio.parsers.GenbankOriginKeyword\" class=\"docClass\">Teselagen.bio.parsers.GenbankOriginKeyword</a>.\nSimply holds GenbankFeatureElements in an array.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-config' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeaturesKeyword'>Teselagen.bio.parsers.GenbankFeaturesKeyword</span><br/><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword-cfg-config' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeaturesKeyword-cfg-config' class='name expandable'>config</a><span> : Object</span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{featuresElements: []}</code></p><p>Overrides: <a href='#!/api/Teselagen.bio.parsers.Keyword-cfg-config' rel='Teselagen.bio.parsers.Keyword-cfg-config' class='docClass'>Teselagen.bio.parsers.Keyword.config</a></p></div></div></div><div id='cfg-keyword' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='defined-in docClass'>Teselagen.bio.parsers.Keyword</a><br/><a href='source/Keyword.html#Teselagen-bio-parsers-Keyword-cfg-keyword' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.Keyword-cfg-keyword' class='name expandable'>keyword</a><span> : String</span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>null</code></p></div></div></div><div id='cfg-value' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='defined-in docClass'>Teselagen.bio.parsers.Keyword</a><br/><a href='source/Keyword.html#Teselagen-bio-parsers-Keyword-cfg-value' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.Keyword-cfg-value' class='name expandable'>value</a><span> : String</span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>null</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-keyword' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeaturesKeyword'>Teselagen.bio.parsers.GenbankFeaturesKeyword</span><br/><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword-property-keyword' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeaturesKeyword-property-keyword' class='name expandable'>keyword</a><span> : String</span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&quot;FEATURES&quot;</code></p><p>Overrides: <a href='#!/api/Teselagen.bio.parsers.Keyword-property-keyword' rel='Teselagen.bio.parsers.Keyword-property-keyword' class='docClass'>Teselagen.bio.parsers.Keyword.keyword</a></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeaturesKeyword'>Teselagen.bio.parsers.GenbankFeaturesKeyword</span><br/><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Teselagen.bio.parsers.GenbankFeaturesKeyword-method-constructor' class='name expandable'>Teselagen.bio.parsers.GenbankFeaturesKeyword</a>( <span class='pre'></span> ) : GenbankFeaturesKeyword</div><div class='description'><div class='short'>Creates a new GenbankFeaturesKeyword from inData. ...</div><div class='long'><p>Creates a new GenbankFeaturesKeyword from inData.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>GenbankFeaturesKeyword</span><div class='sub-desc'>\n</div></li></ul><p>Overrides: <a href='#!/api/Teselagen.bio.parsers.Keyword-method-constructor' rel='Teselagen.bio.parsers.Keyword-method-constructor' class='docClass'>Teselagen.bio.parsers.Keyword.constructor</a></p></div></div></div><div id='method-addElement' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeaturesKeyword'>Teselagen.bio.parsers.GenbankFeaturesKeyword</span><br/><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword-method-addElement' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeaturesKeyword-method-addElement' class='name expandable'>addElement</a>( <span class='pre'>GenbankFeatureElement element</span> )</div><div class='description'><div class='short'>Add GenbankFeatureElement ...</div><div class='long'><p>Add GenbankFeatureElement</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>element</span> : GenbankFeatureElement<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-fromJSON' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeaturesKeyword'>Teselagen.bio.parsers.GenbankFeaturesKeyword</span><br/><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword-method-fromJSON' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeaturesKeyword-method-fromJSON' class='name expandable'>fromJSON</a>( <span class='pre'>Object json</span> ) : <a href=\"#!/api/Teselagen.bio.parsers.GenbankFeatureQualifier\" rel=\"Teselagen.bio.parsers.GenbankFeatureQualifier\" class=\"docClass\">Teselagen.bio.parsers.GenbankFeatureQualifier</a></div><div class='description'><div class='short'>Converts GenBank JSON back to GenBank model ...</div><div class='long'><p>Converts GenBank JSON back to GenBank model</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>json</span> : Object<div class='sub-desc'><p>GenbankFeatureQualifier in JSON form</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Teselagen.bio.parsers.GenbankFeatureQualifier\" rel=\"Teselagen.bio.parsers.GenbankFeatureQualifier\" class=\"docClass\">Teselagen.bio.parsers.GenbankFeatureQualifier</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getLastElement' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeaturesKeyword'>Teselagen.bio.parsers.GenbankFeaturesKeyword</span><br/><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword-method-getLastElement' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeaturesKeyword-method-getLastElement' class='name expandable'>getLastElement</a>( <span class='pre'></span> ) : GenbankFeatureElement</div><div class='description'><div class='short'>Get Last GenbankFeatureElement in featuresElements array ...</div><div class='long'><p>Get Last GenbankFeatureElement in featuresElements array</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>GenbankFeatureElement</span><div class='sub-desc'><p>element</p>\n</div></li></ul></div></div></div><div id='method-toJSON' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeaturesKeyword'>Teselagen.bio.parsers.GenbankFeaturesKeyword</span><br/><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword-method-toJSON' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeaturesKeyword-method-toJSON' class='name expandable'>toJSON</a>( <span class='pre'></span> ) : Object</div><div class='description'><div class='short'>Converts to JSON format. ...</div><div class='long'><p>Converts to JSON format.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>json</p>\n</div></li></ul></div></div></div><div id='method-toString' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeaturesKeyword'>Teselagen.bio.parsers.GenbankFeaturesKeyword</span><br/><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword-method-toString' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeaturesKeyword-method-toString' class='name expandable'>toString</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Converts this GenbankFeaturesKeyword to Genbank file format string ...</div><div class='long'><p>Converts this GenbankFeaturesKeyword to Genbank file format string</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>genbankString</p>\n</div></li></ul></div></div></div></div></div></div></div>","html_meta":{"author":null},"aliases":{},"files":[{"href":"GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword","filename":"GenbankFeaturesKeyword.js"}],"superclasses":["Ext.Base","Teselagen.bio.parsers.Keyword"],"component":false,"tagname":"class","requires":["Teselagen.bio.util.StringUtil","Teselagen.bio.parsers.GenbankFeatureElement"],"members":{"event":[],"property":[{"owner":"Teselagen.bio.parsers.GenbankFeaturesKeyword","meta":{},"tagname":"property","name":"keyword","id":"property-keyword"}],"css_var":[],"method":[{"owner":"Teselagen.bio.parsers.GenbankFeaturesKeyword","meta":{},"tagname":"method","name":"constructor","id":"method-constructor"},{"owner":"Teselagen.bio.parsers.GenbankFeaturesKeyword","meta":{},"tagname":"method","name":"addElement","id":"method-addElement"},{"owner":"Teselagen.bio.parsers.GenbankFeaturesKeyword","meta":{},"tagname":"method","name":"fromJSON","id":"method-fromJSON"},{"owner":"Teselagen.bio.parsers.GenbankFeaturesKeyword","meta":{},"tagname":"method","name":"getLastElement","id":"method-getLastElement"},{"owner":"Teselagen.bio.parsers.GenbankFeaturesKeyword","meta":{},"tagname":"method","name":"toJSON","id":"method-toJSON"},{"owner":"Teselagen.bio.parsers.GenbankFeaturesKeyword","meta":{},"tagname":"method","name":"toString","id":"method-toString"}],"css_mixin":[],"cfg":[{"owner":"Teselagen.bio.parsers.GenbankFeaturesKeyword","meta":{},"tagname":"cfg","name":"config","id":"cfg-config"},{"owner":"Teselagen.bio.parsers.Keyword","meta":{},"tagname":"cfg","name":"keyword","id":"cfg-keyword"},{"owner":"Teselagen.bio.parsers.Keyword","meta":{},"tagname":"cfg","name":"value","id":"cfg-value"}]},"alternateClassNames":[],"inheritdoc":null,"mixedInto":[],"name":"Teselagen.bio.parsers.GenbankFeaturesKeyword","extends":"Teselagen.bio.parsers.Keyword","id":"class-Teselagen.bio.parsers.GenbankFeaturesKeyword","parentMixins":[],"singleton":false,"uses":[],"statics":{"property":[],"event":[],"method":[],"css_var":[],"css_mixin":[],"cfg":[]}});