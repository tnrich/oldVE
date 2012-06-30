Ext.data.JsonP.Teselagen_bio_parsers_GenbankFeaturesKeyword({"extends":"Teselagen.bio.parsers.Keyword","requires":[],"alternateClassNames":[],"html_meta":{"author":null},"tagname":"class","singleton":false,"statics":{"cfg":[],"property":[],"method":[],"event":[],"css_var":[],"css_mixin":[]},"component":false,"mixins":[],"uses":[],"code_type":"ext_define","inheritable":false,"members":{"cfg":[{"owner":"Teselagen.bio.parsers.Keyword","tagname":"cfg","meta":{},"name":"config","id":"cfg-config"}],"method":[{"owner":"Teselagen.bio.parsers.GenbankFeaturesKeyword","tagname":"method","meta":{},"name":"constructor","id":"method-constructor"},{"owner":"Teselagen.bio.parsers.GenbankFeaturesKeyword","tagname":"method","meta":{},"name":"addElement","id":"method-addElement"},{"owner":"Teselagen.bio.parsers.GenbankFeaturesKeyword","tagname":"method","meta":{},"name":"getFeatures","id":"method-getFeatures"},{"owner":"Teselagen.bio.parsers.Keyword","tagname":"method","meta":{},"name":"getKeyword","id":"method-getKeyword"},{"owner":"Teselagen.bio.parsers.GenbankFeaturesKeyword","tagname":"method","meta":{},"name":"getLastElement","id":"method-getLastElement"},{"owner":"Teselagen.bio.parsers.Keyword","tagname":"method","meta":{},"name":"getValue","id":"method-getValue"},{"owner":"Teselagen.bio.parsers.GenbankFeaturesKeyword","tagname":"method","meta":{},"name":"setFeatures","id":"method-setFeatures"},{"owner":"Teselagen.bio.parsers.Keyword","tagname":"method","meta":{},"name":"setKeyword","id":"method-setKeyword"},{"owner":"Teselagen.bio.parsers.Keyword","tagname":"method","meta":{},"name":"setValue","id":"method-setValue"},{"owner":"Teselagen.bio.parsers.GenbankFeaturesKeyword","tagname":"method","meta":{},"name":"toJSON","id":"method-toJSON"},{"owner":"Teselagen.bio.parsers.GenbankFeaturesKeyword","tagname":"method","meta":{},"name":"toString","id":"method-toString"}],"property":[{"owner":"Teselagen.bio.parsers.GenbankFeaturesKeyword","tagname":"property","meta":{},"name":"GenbankFeatureElements","id":"property-GenbankFeatureElements"},{"owner":"Teselagen.bio.parsers.Keyword","tagname":"property","meta":{},"name":"keyword","id":"property-keyword"}],"css_var":[],"event":[],"css_mixin":[]},"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Base<div class='subclass '><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='docClass'>Teselagen.bio.parsers.Keyword</a><div class='subclass '><strong>Teselagen.bio.parsers.GenbankFeaturesKeyword</strong></div></div></div><h4>Files</h4><div class='dependency'><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword' target='_blank'>GenbankFeaturesKeyword.js</a></div></pre><div class='doc-contents'><p>GenbankFeaturesKeyword class.\nClass for GenbankFeaturesKeyword. Same level as  GenbankKeyword, GebankLocusKeyword, and GenbankOriginKeyword.\nSimply holds GenbankFeatureElements in an array.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-config' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='defined-in docClass'>Teselagen.bio.parsers.Keyword</a><br/><a href='source/Keyword.html#Teselagen-bio-parsers-Keyword-cfg-config' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.Keyword-cfg-config' class='name expandable'>config</a><span> : Object</span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{keyword: null, value: null}</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-GenbankFeatureElements' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeaturesKeyword'>Teselagen.bio.parsers.GenbankFeaturesKeyword</span><br/><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword-property-GenbankFeatureElements' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeaturesKeyword-property-GenbankFeatureElements' class='name not-expandable'>GenbankFeatureElements</a><span> : Object</span></div><div class='description'><div class='short'><p>features</p>\n</div><div class='long'><p>features</p>\n</div></div></div><div id='property-keyword' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='defined-in docClass'>Teselagen.bio.parsers.Keyword</a><br/><a href='source/Keyword.html#Teselagen-bio-parsers-Keyword-property-keyword' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.Keyword-property-keyword' class='name not-expandable'>keyword</a><span> : String</span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeaturesKeyword'>Teselagen.bio.parsers.GenbankFeaturesKeyword</span><br/><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Teselagen.bio.parsers.GenbankFeaturesKeyword-method-constructor' class='name expandable'>Teselagen.bio.parsers.GenbankFeaturesKeyword</a>( <span class='pre'></span> ) : Object</div><div class='description'><div class='short'>Creates a new GenbankFeaturesKeyword from inData. ...</div><div class='long'><p>Creates a new GenbankFeaturesKeyword from inData.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul><p>Overrides: <a href='#!/api/Teselagen.bio.parsers.Keyword-method-constructor' rel='Teselagen.bio.parsers.Keyword-method-constructor' class='docClass'>Teselagen.bio.parsers.Keyword.constructor</a></p></div></div></div><div id='method-addElement' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeaturesKeyword'>Teselagen.bio.parsers.GenbankFeaturesKeyword</span><br/><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword-method-addElement' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeaturesKeyword-method-addElement' class='name expandable'>addElement</a>( <span class='pre'>GenbankFeatureElement pElement</span> )</div><div class='description'><div class='short'>Add GenbankFeatureElement ...</div><div class='long'><p>Add GenbankFeatureElement</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pElement</span> : GenbankFeatureElement<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getFeatures' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeaturesKeyword'>Teselagen.bio.parsers.GenbankFeaturesKeyword</span><br/><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword-method-getFeatures' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeaturesKeyword-method-getFeatures' class='name expandable'>getFeatures</a>( <span class='pre'></span> ) : GenbankFeaturesKeyword\n\t\t</div><div class='description'><div class='short'>Get Features ...</div><div class='long'><p>Get Features</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>GenbankFeaturesKeyword\n\t\t</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getKeyword' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='defined-in docClass'>Teselagen.bio.parsers.Keyword</a><br/><a href='source/Keyword.html#Teselagen-bio-parsers-Keyword-method-getKeyword' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.Keyword-method-getKeyword' class='name expandable'>getKeyword</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Get keyword ...</div><div class='long'><p>Get keyword</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>keyword</p>\n</div></li></ul></div></div></div><div id='method-getLastElement' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeaturesKeyword'>Teselagen.bio.parsers.GenbankFeaturesKeyword</span><br/><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword-method-getLastElement' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeaturesKeyword-method-getLastElement' class='name expandable'>getLastElement</a>( <span class='pre'></span> ) : GenbankFeatureElement</div><div class='description'><div class='short'>Get Last GenbankFeatureElement in features array ...</div><div class='long'><p>Get Last GenbankFeatureElement in features array</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>GenbankFeatureElement</span><div class='sub-desc'><p>element</p>\n</div></li></ul></div></div></div><div id='method-getValue' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='defined-in docClass'>Teselagen.bio.parsers.Keyword</a><br/><a href='source/Keyword.html#Teselagen-bio-parsers-Keyword-method-getValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.Keyword-method-getValue' class='name expandable'>getValue</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Get value ...</div><div class='long'><p>Get value</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>value</p>\n</div></li></ul></div></div></div><div id='method-setFeatures' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeaturesKeyword'>Teselagen.bio.parsers.GenbankFeaturesKeyword</span><br/><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword-method-setFeatures' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeaturesKeyword-method-setFeatures' class='name expandable'>setFeatures</a>( <span class='pre'>GenbankFeaturesKeyword pFeatures</span> )</div><div class='description'><div class='short'>Set Features ...</div><div class='long'><p>Set Features</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pFeatures</span> : GenbankFeaturesKeyword<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setKeyword' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='defined-in docClass'>Teselagen.bio.parsers.Keyword</a><br/><a href='source/Keyword.html#Teselagen-bio-parsers-Keyword-method-setKeyword' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.Keyword-method-setKeyword' class='name expandable'>setKeyword</a>( <span class='pre'>String pKeyword</span> )</div><div class='description'><div class='short'>Set keyword ...</div><div class='long'><p>Set keyword</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pKeyword</span> : String<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setValue' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='defined-in docClass'>Teselagen.bio.parsers.Keyword</a><br/><a href='source/Keyword.html#Teselagen-bio-parsers-Keyword-method-setValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.Keyword-method-setValue' class='name expandable'>setValue</a>( <span class='pre'>String pValue</span> )</div><div class='description'><div class='short'>Set value ...</div><div class='long'><p>Set value</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pValue</span> : String<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-toJSON' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeaturesKeyword'>Teselagen.bio.parsers.GenbankFeaturesKeyword</span><br/><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword-method-toJSON' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeaturesKeyword-method-toJSON' class='name expandable'>toJSON</a>( <span class='pre'></span> ) : Object</div><div class='description'><div class='short'>Converts to JSON format. ...</div><div class='long'><p>Converts to JSON format.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>json</p>\n</div></li></ul></div></div></div><div id='method-toString' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankFeaturesKeyword'>Teselagen.bio.parsers.GenbankFeaturesKeyword</span><br/><a href='source/GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword-method-toString' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankFeaturesKeyword-method-toString' class='name expandable'>toString</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Converts this GenbankFeaturesKeyword to Genbank file format string ...</div><div class='long'><p>Converts this GenbankFeaturesKeyword to Genbank file format string</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>line</p>\n</div></li></ul></div></div></div></div></div></div></div>","mixedInto":[],"meta":{"author":["Diana Wong","Timothy Ham (original author)"]},"files":[{"href":"GenbankFeaturesKeyword.html#Teselagen-bio-parsers-GenbankFeaturesKeyword","filename":"GenbankFeaturesKeyword.js"}],"name":"Teselagen.bio.parsers.GenbankFeaturesKeyword","parentMixins":[],"subclasses":[],"aliases":{},"inheritdoc":null,"id":"class-Teselagen.bio.parsers.GenbankFeaturesKeyword","superclasses":["Ext.Base","Teselagen.bio.parsers.Keyword"]});