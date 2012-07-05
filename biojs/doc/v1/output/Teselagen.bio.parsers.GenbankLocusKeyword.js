Ext.data.JsonP.Teselagen_bio_parsers_GenbankLocusKeyword({"subclasses":[],"mixins":[],"code_type":"ext_define","inheritable":false,"meta":{"author":["Diana Wong","Timothy Ham (original author)"]},"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Base<div class='subclass '><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='docClass'>Teselagen.bio.parsers.Keyword</a><div class='subclass '><strong>Teselagen.bio.parsers.GenbankLocusKeyword</strong></div></div></div><h4>Requires</h4><div class='dependency'>Teselagen.bio.util.StringUtil</div><h4>Files</h4><div class='dependency'><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword' target='_blank'>GenbankLocusKeyword.js</a></div></pre><div class='doc-contents'><p>GenbankLocusKeyword class.\nClass for GenbankLocusKeyword. Same level as GenbankKeyword, GebankFeaturesKeyword, and GenbankOriginKeyword.\nSpecificfor parsing the Locus line.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-config' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='defined-in docClass'>Teselagen.bio.parsers.Keyword</a><br/><a href='source/Keyword.html#Teselagen-bio-parsers-Keyword-cfg-config' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.Keyword-cfg-config' class='name expandable'>config</a><span> : Object</span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{keyword: null, value: null}</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-keyword' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='defined-in docClass'>Teselagen.bio.parsers.Keyword</a><br/><a href='source/Keyword.html#Teselagen-bio-parsers-Keyword-property-keyword' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.Keyword-property-keyword' class='name not-expandable'>keyword</a><span> : String</span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankLocusKeyword'>Teselagen.bio.parsers.GenbankLocusKeyword</span><br/><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Teselagen.bio.parsers.GenbankLocusKeyword-method-constructor' class='name expandable'>Teselagen.bio.parsers.GenbankLocusKeyword</a>( <span class='pre'>String locusName, String sequenceLength, String strandType, String naType, String linear, String divisionCode, String date</span> ) : Object</div><div class='description'><div class='short'>Creates a new GenbankLocusKeyword from inData. ...</div><div class='long'><p>Creates a new GenbankLocusKeyword from inData.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>locusName</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>sequenceLength</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>strandType</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>naType</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>linear</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>divisionCode</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>date</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul><p>Overrides: <a href='#!/api/Teselagen.bio.parsers.Keyword-method-constructor' rel='Teselagen.bio.parsers.Keyword-method-constructor' class='docClass'>Teselagen.bio.parsers.Keyword.constructor</a></p></div></div></div><div id='method-appendValue' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.parsers.Keyword' rel='Teselagen.bio.parsers.Keyword' class='defined-in docClass'>Teselagen.bio.parsers.Keyword</a><br/><a href='source/Keyword.html#Teselagen-bio-parsers-Keyword-method-appendValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.Keyword-method-appendValue' class='name expandable'>appendValue</a>( <span class='pre'>String pVal</span> )</div><div class='description'><div class='short'>Appends to existing parameter, value. ...</div><div class='long'><p>Appends to existing parameter, value.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pVal</span> : String<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getDate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankLocusKeyword'>Teselagen.bio.parsers.GenbankLocusKeyword</span><br/><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword-method-getDate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankLocusKeyword-method-getDate' class='name expandable'>getDate</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Get date ...</div><div class='long'><p>Get date</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>date</p>\n</div></li></ul></div></div></div><div id='method-getDivisionCode' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankLocusKeyword'>Teselagen.bio.parsers.GenbankLocusKeyword</span><br/><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword-method-getDivisionCode' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankLocusKeyword-method-getDivisionCode' class='name expandable'>getDivisionCode</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Get divisionCode ...</div><div class='long'><p>Get divisionCode</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>divisionCode</p>\n</div></li></ul></div></div></div><div id='method-getLinear' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankLocusKeyword'>Teselagen.bio.parsers.GenbankLocusKeyword</span><br/><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword-method-getLinear' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankLocusKeyword-method-getLinear' class='name expandable'>getLinear</a>( <span class='pre'></span> ) : Boolean</div><div class='description'><div class='short'>Get linear ...</div><div class='long'><p>Get linear</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>linear</p>\n</div></li></ul></div></div></div><div id='method-getLocusName' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankLocusKeyword'>Teselagen.bio.parsers.GenbankLocusKeyword</span><br/><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword-method-getLocusName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankLocusKeyword-method-getLocusName' class='name expandable'>getLocusName</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Get locusName ...</div><div class='long'><p>Get locusName</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>locusName</p>\n</div></li></ul></div></div></div><div id='method-getNaType' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankLocusKeyword'>Teselagen.bio.parsers.GenbankLocusKeyword</span><br/><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword-method-getNaType' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankLocusKeyword-method-getNaType' class='name expandable'>getNaType</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Get naType ...</div><div class='long'><p>Get naType</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>naType</p>\n</div></li></ul></div></div></div><div id='method-getSequenceLength' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankLocusKeyword'>Teselagen.bio.parsers.GenbankLocusKeyword</span><br/><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword-method-getSequenceLength' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankLocusKeyword-method-getSequenceLength' class='name expandable'>getSequenceLength</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Get sequenceLength ...</div><div class='long'><p>Get sequenceLength</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>sequenceLength</p>\n</div></li></ul></div></div></div><div id='method-getStrandType' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankLocusKeyword'>Teselagen.bio.parsers.GenbankLocusKeyword</span><br/><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword-method-getStrandType' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankLocusKeyword-method-getStrandType' class='name expandable'>getStrandType</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Get strandType ...</div><div class='long'><p>Get strandType</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>strandType</p>\n</div></li></ul></div></div></div><div id='method-setDate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankLocusKeyword'>Teselagen.bio.parsers.GenbankLocusKeyword</span><br/><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword-method-setDate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankLocusKeyword-method-setDate' class='name expandable'>setDate</a>( <span class='pre'>Object pDate</span> )</div><div class='description'><div class='short'>Set Date\n@params {String} ...</div><div class='long'><p>Set Date\n@params {String}</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pDate</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setDivisionCode' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankLocusKeyword'>Teselagen.bio.parsers.GenbankLocusKeyword</span><br/><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword-method-setDivisionCode' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankLocusKeyword-method-setDivisionCode' class='name expandable'>setDivisionCode</a>( <span class='pre'>Object pDivisionCode</span> )</div><div class='description'><div class='short'>Set DivisionCode\n@params {String} ...</div><div class='long'><p>Set DivisionCode\n@params {String}</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pDivisionCode</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setLinear' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankLocusKeyword'>Teselagen.bio.parsers.GenbankLocusKeyword</span><br/><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword-method-setLinear' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankLocusKeyword-method-setLinear' class='name expandable'>setLinear</a>( <span class='pre'>Object pLinear</span> )</div><div class='description'><div class='short'>Set linear\n@params {String} ...</div><div class='long'><p>Set linear\n@params {String}</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pLinear</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setLocusName' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankLocusKeyword'>Teselagen.bio.parsers.GenbankLocusKeyword</span><br/><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword-method-setLocusName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankLocusKeyword-method-setLocusName' class='name expandable'>setLocusName</a>( <span class='pre'>Object pLocusName</span> )</div><div class='description'><div class='short'>Set locusName\n@params {String} locusName ...</div><div class='long'><p>Set locusName\n@params {String} locusName</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pLocusName</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setNaType' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankLocusKeyword'>Teselagen.bio.parsers.GenbankLocusKeyword</span><br/><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword-method-setNaType' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankLocusKeyword-method-setNaType' class='name expandable'>setNaType</a>( <span class='pre'>Object pNaType</span> )</div><div class='description'><div class='short'>Set naType\n@params {String} naType ...</div><div class='long'><p>Set naType\n@params {String} naType</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pNaType</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setSequenceLength' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankLocusKeyword'>Teselagen.bio.parsers.GenbankLocusKeyword</span><br/><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword-method-setSequenceLength' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankLocusKeyword-method-setSequenceLength' class='name expandable'>setSequenceLength</a>( <span class='pre'>Object pSequenceLength</span> )</div><div class='description'><div class='short'>Set SequenceLength\n@params {String} ...</div><div class='long'><p>Set SequenceLength\n@params {String}</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pSequenceLength</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setStrandType' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankLocusKeyword'>Teselagen.bio.parsers.GenbankLocusKeyword</span><br/><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword-method-setStrandType' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankLocusKeyword-method-setStrandType' class='name expandable'>setStrandType</a>( <span class='pre'>Object pStrandType</span> )</div><div class='description'><div class='short'>Set strandType\n@params {String} pStrandType ...</div><div class='long'><p>Set strandType\n@params {String} pStrandType</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pStrandType</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-toJSON' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankLocusKeyword'>Teselagen.bio.parsers.GenbankLocusKeyword</span><br/><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword-method-toJSON' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankLocusKeyword-method-toJSON' class='name expandable'>toJSON</a>( <span class='pre'></span> ) : Object</div><div class='description'><div class='short'>Converts to JSON format. ...</div><div class='long'><p>Converts to JSON format.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>json</p>\n</div></li></ul></div></div></div><div id='method-toString' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.parsers.GenbankLocusKeyword'>Teselagen.bio.parsers.GenbankLocusKeyword</span><br/><a href='source/GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword-method-toString' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.parsers.GenbankLocusKeyword-method-toString' class='name expandable'>toString</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Converts this GenbankLocusKeyword to Genbank file format string ...</div><div class='long'><p>Converts this GenbankLocusKeyword to Genbank file format string</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","html_meta":{"author":null},"aliases":{},"files":[{"href":"GenbankLocusKeyword.html#Teselagen-bio-parsers-GenbankLocusKeyword","filename":"GenbankLocusKeyword.js"}],"superclasses":["Ext.Base","Teselagen.bio.parsers.Keyword"],"component":false,"tagname":"class","requires":["Teselagen.bio.util.StringUtil"],"members":{"event":[],"property":[{"owner":"Teselagen.bio.parsers.Keyword","meta":{},"tagname":"property","name":"keyword","id":"property-keyword"}],"css_var":[],"method":[{"owner":"Teselagen.bio.parsers.GenbankLocusKeyword","meta":{},"tagname":"method","name":"constructor","id":"method-constructor"},{"owner":"Teselagen.bio.parsers.Keyword","meta":{},"tagname":"method","name":"appendValue","id":"method-appendValue"},{"owner":"Teselagen.bio.parsers.GenbankLocusKeyword","meta":{},"tagname":"method","name":"getDate","id":"method-getDate"},{"owner":"Teselagen.bio.parsers.GenbankLocusKeyword","meta":{},"tagname":"method","name":"getDivisionCode","id":"method-getDivisionCode"},{"owner":"Teselagen.bio.parsers.GenbankLocusKeyword","meta":{},"tagname":"method","name":"getLinear","id":"method-getLinear"},{"owner":"Teselagen.bio.parsers.GenbankLocusKeyword","meta":{},"tagname":"method","name":"getLocusName","id":"method-getLocusName"},{"owner":"Teselagen.bio.parsers.GenbankLocusKeyword","meta":{},"tagname":"method","name":"getNaType","id":"method-getNaType"},{"owner":"Teselagen.bio.parsers.GenbankLocusKeyword","meta":{},"tagname":"method","name":"getSequenceLength","id":"method-getSequenceLength"},{"owner":"Teselagen.bio.parsers.GenbankLocusKeyword","meta":{},"tagname":"method","name":"getStrandType","id":"method-getStrandType"},{"owner":"Teselagen.bio.parsers.GenbankLocusKeyword","meta":{},"tagname":"method","name":"setDate","id":"method-setDate"},{"owner":"Teselagen.bio.parsers.GenbankLocusKeyword","meta":{},"tagname":"method","name":"setDivisionCode","id":"method-setDivisionCode"},{"owner":"Teselagen.bio.parsers.GenbankLocusKeyword","meta":{},"tagname":"method","name":"setLinear","id":"method-setLinear"},{"owner":"Teselagen.bio.parsers.GenbankLocusKeyword","meta":{},"tagname":"method","name":"setLocusName","id":"method-setLocusName"},{"owner":"Teselagen.bio.parsers.GenbankLocusKeyword","meta":{},"tagname":"method","name":"setNaType","id":"method-setNaType"},{"owner":"Teselagen.bio.parsers.GenbankLocusKeyword","meta":{},"tagname":"method","name":"setSequenceLength","id":"method-setSequenceLength"},{"owner":"Teselagen.bio.parsers.GenbankLocusKeyword","meta":{},"tagname":"method","name":"setStrandType","id":"method-setStrandType"},{"owner":"Teselagen.bio.parsers.GenbankLocusKeyword","meta":{},"tagname":"method","name":"toJSON","id":"method-toJSON"},{"owner":"Teselagen.bio.parsers.GenbankLocusKeyword","meta":{},"tagname":"method","name":"toString","id":"method-toString"}],"css_mixin":[],"cfg":[{"owner":"Teselagen.bio.parsers.Keyword","meta":{},"tagname":"cfg","name":"config","id":"cfg-config"}]},"alternateClassNames":[],"inheritdoc":null,"mixedInto":[],"name":"Teselagen.bio.parsers.GenbankLocusKeyword","extends":"Teselagen.bio.parsers.Keyword","id":"class-Teselagen.bio.parsers.GenbankLocusKeyword","parentMixins":[],"singleton":false,"uses":[],"statics":{"property":[],"event":[],"method":[],"css_var":[],"css_mixin":[],"cfg":[]}});