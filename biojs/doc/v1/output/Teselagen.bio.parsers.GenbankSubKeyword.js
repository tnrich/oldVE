Ext.data.JsonP.Teselagen_bio_parsers_GenbankSubKeyword({"subclasses":[],"mixins":[],"code_type":"ext_define","inheritable":false,"meta":{"author":["Diana Wong","Timothy Ham (original author)"]},"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Base<div class='subclass '><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='docClass'>Teselagen.bio.parsers.Keyword</a><div class='subclass '><strong>Teselagen.bio.parsers.GenbankSubKeyword</strong></div></div></div><h4>Requires</h4><div class='dependency'><a href='#!/api/Teselagen.bio.util.StringUtil' rel='Teselagen.bio.util.StringUtil' class='docClass'>Teselagen.bio.util.StringUtil</a></div><h4>Files</h4><div class='dependency'><a href='source/GenbankSubKeyword.html#Teselagen-bio-parsers-GenbankSubKeyword' target='_blank'>GenbankSubKeyword.js</a></div></pre><div class='doc-contents'><p>GenbankSubKeyword class.\nClass for SubKeywords not defined by GenbankFeatureElements (Qualifier and Location).</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-config' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='defined-in docClass'>Teselagen.bio.parsers.Keyword</a><br/><a href='source/Keyword.html#Teselagen-bio-parsers-Keyword-cfg-config' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.Keyword-cfg-config' class='name expandable'>config</a><span> : Object</span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{keyword: null, value: null}</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-keyword' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='defined-in docClass'>Teselagen.bio.parsers.Keyword</a><br/><a href='source/Keyword.html#Teselagen-bio-parsers-Keyword-property-keyword' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.Keyword-property-keyword' class='name not-expandable'>keyword</a><span> : String</span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankSubKeyword'>Teselagen.bio.parsers.GenbankSubKeyword</span><br/><a href='source/GenbankSubKeyword.html#Teselagen-bio-parsers-GenbankSubKeyword-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Teselagen.bio.parsers.GenbankSubKeyword-method-constructor' class='name expandable'>Teselagen.bio.parsers.GenbankSubKeyword</a>( <span class='pre'>String keyword, String value</span> ) : Object</div><div class='description'><div class='short'>Creates a new GenbankSubKeywords from inData. ...</div><div class='long'><p>Creates a new GenbankSubKeywords from inData.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>keyword</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>value</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul><p>Overrides: <a href='#!/api/Teselagen.bio.parsers.Keyword-method-constructor' rel='Teselagen.bio.parsers.Keyword-method-constructor' class='docClass'>Teselagen.bio.parsers.Keyword.constructor</a></p></div></div></div><div id='method-appendValue' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='defined-in docClass'>Teselagen.bio.parsers.Keyword</a><br/><a href='source/Keyword.html#Teselagen-bio-parsers-Keyword-method-appendValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.Keyword-method-appendValue' class='name expandable'>appendValue</a>( <span class='pre'>String pVal</span> )</div><div class='description'><div class='short'>Appends to existing parameter, value. ...</div><div class='long'><p>Appends to existing parameter, value. THIS MAY NOT WORK RIGHT NOW.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pVal</span> : String<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-toJSON' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankSubKeyword'>Teselagen.bio.parsers.GenbankSubKeyword</span><br/><a href='source/GenbankSubKeyword.html#Teselagen-bio-parsers-GenbankSubKeyword-method-toJSON' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankSubKeyword-method-toJSON' class='name expandable'>toJSON</a>( <span class='pre'></span> ) : Object</div><div class='description'><div class='short'>Converts to JSON format. ...</div><div class='long'><p>Converts to JSON format. Overloads for JSON.stringify()</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>json</p>\n</div></li></ul></div></div></div><div id='method-toString' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankSubKeyword'>Teselagen.bio.parsers.GenbankSubKeyword</span><br/><a href='source/GenbankSubKeyword.html#Teselagen-bio-parsers-GenbankSubKeyword-method-toString' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankSubKeyword-method-toString' class='name expandable'>toString</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Converts this GenbankSubKeywords to Genbank file format string ...</div><div class='long'><p>Converts this GenbankSubKeywords to Genbank file format string</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","html_meta":{"author":null},"aliases":{},"files":[{"href":"GenbankSubKeyword.html#Teselagen-bio-parsers-GenbankSubKeyword","filename":"GenbankSubKeyword.js"}],"superclasses":["Ext.Base","Teselagen.bio.parsers.Keyword"],"component":false,"tagname":"class","requires":["Teselagen.bio.util.StringUtil"],"members":{"event":[],"property":[{"owner":"Teselagen.bio.parsers.Keyword","meta":{},"tagname":"property","name":"keyword","id":"property-keyword"}],"css_var":[],"method":[{"owner":"Teselagen.bio.parsers.GenbankSubKeyword","meta":{},"tagname":"method","name":"constructor","id":"method-constructor"},{"owner":"Teselagen.bio.parsers.Keyword","meta":{},"tagname":"method","name":"appendValue","id":"method-appendValue"},{"owner":"Teselagen.bio.parsers.GenbankSubKeyword","meta":{},"tagname":"method","name":"toJSON","id":"method-toJSON"},{"owner":"Teselagen.bio.parsers.GenbankSubKeyword","meta":{},"tagname":"method","name":"toString","id":"method-toString"}],"css_mixin":[],"cfg":[{"owner":"Teselagen.bio.parsers.Keyword","meta":{},"tagname":"cfg","name":"config","id":"cfg-config"}]},"alternateClassNames":[],"inheritdoc":null,"mixedInto":[],"name":"Teselagen.bio.parsers.GenbankSubKeyword","extends":"Teselagen.bio.parsers.Keyword","id":"class-Teselagen.bio.parsers.GenbankSubKeyword","parentMixins":[],"singleton":false,"uses":[],"statics":{"property":[],"event":[],"method":[],"css_var":[],"css_mixin":[],"cfg":[]}});