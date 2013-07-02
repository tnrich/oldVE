Ext.data.JsonP.Teselagen_bio_sequence_common_Sequence({"subclasses":["Teselagen.bio.sequence.dna.DNASequence"],"mixins":[],"code_type":"ext_define","inheritable":false,"meta":{"author":["Micah Lerner","Zinovii Dmytriv (original author)"]},"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Base<div class='subclass '><a href='#!/api/Teselagen.bio.sequence.common.SymbolList' rel='Teselagen.bio.sequence.common.SymbolList' class='docClass'>Teselagen.bio.sequence.common.SymbolList</a><div class='subclass '><strong>Teselagen.bio.sequence.common.Sequence</strong></div></div></div><h4>Subclasses</h4><div class='dependency'><a href='#!/api/Teselagen.bio.sequence.dna.DNASequence' rel='Teselagen.bio.sequence.dna.DNASequence' class='docClass'>Teselagen.bio.sequence.dna.DNASequence</a></div><h4>Files</h4><div class='dependency'><a href='source/Sequence.html#Teselagen-bio-sequence-common-Sequence' target='_blank'>Sequence.js</a></div></pre><div class='doc-contents'><p>Sequence with name</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Sequence'>Teselagen.bio.sequence.common.Sequence</span><br/><a href='source/Sequence.html#Teselagen-bio-sequence-common-Sequence-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Teselagen.bio.sequence.common.Sequence-method-constructor' class='name expandable'>Teselagen.bio.sequence.common.Sequence</a>( <span class='pre'>String name, [SymbolList symbolList]</span> ) : Object</div><div class='description'><div class='short'>Constructor ...</div><div class='long'><p>Constructor</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>name of sequence</p>\n</div></li><li><span class='pre'>symbolList</span> : SymbolList (optional)<div class='sub-desc'><p>a list of symbols that contains symbols and an alphabet</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-addSymbolList' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.sequence.common.SymbolList' rel='Teselagen.bio.sequence.common.SymbolList' class='defined-in docClass'>Teselagen.bio.sequence.common.SymbolList</a><br/><a href='source/SymbolList.html#Teselagen-bio-sequence-common-SymbolList-method-addSymbolList' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.SymbolList-method-addSymbolList' class='name expandable'>addSymbolList</a>( <span class='pre'><a href=\"#!/api/Teselagen.bio.sequence.common.SymbolList\" rel=\"Teselagen.bio.sequence.common.SymbolList\" class=\"docClass\">Teselagen.bio.sequence.common.SymbolList</a> pSymbols</span> )</div><div class='description'><div class='short'>Adds a SymbolList to existing SymbolList. ...</div><div class='long'><p>Adds a SymbolList to existing SymbolList.\n(DW: Added 7/26/2012 because addSymbols is specific to an array of symbols)</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pSymbols</span> : <a href=\"#!/api/Teselagen.bio.sequence.common.SymbolList\" rel=\"Teselagen.bio.sequence.common.SymbolList\" class=\"docClass\">Teselagen.bio.sequence.common.SymbolList</a><div class='sub-desc'><p>Symbols you want to add</p>\n</div></li></ul></div></div></div><div id='method-addSymbols' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.sequence.common.SymbolList' rel='Teselagen.bio.sequence.common.SymbolList' class='defined-in docClass'>Teselagen.bio.sequence.common.SymbolList</a><br/><a href='source/SymbolList.html#Teselagen-bio-sequence-common-SymbolList-method-addSymbols' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.SymbolList-method-addSymbols' class='name expandable'>addSymbols</a>( <span class='pre'>Symbols[] pSymbols</span> )</div><div class='description'><div class='short'>Adds a specified symbol ...</div><div class='long'><p>Adds a specified symbol</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pSymbols</span> : Symbols[]<div class='sub-desc'><p>Array of symbols you want to add</p>\n</div></li></ul></div></div></div><div id='method-clear' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.sequence.common.SymbolList' rel='Teselagen.bio.sequence.common.SymbolList' class='defined-in docClass'>Teselagen.bio.sequence.common.SymbolList</a><br/><a href='source/SymbolList.html#Teselagen-bio-sequence-common-SymbolList-method-clear' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.SymbolList-method-clear' class='name expandable'>clear</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Deletes symbols ...</div><div class='long'><p>Deletes symbols</p>\n</div></div></div><div id='method-deleteSymbols' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.sequence.common.SymbolList' rel='Teselagen.bio.sequence.common.SymbolList' class='defined-in docClass'>Teselagen.bio.sequence.common.SymbolList</a><br/><a href='source/SymbolList.html#Teselagen-bio-sequence-common-SymbolList-method-deleteSymbols' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.SymbolList-method-deleteSymbols' class='name expandable'>deleteSymbols</a>( <span class='pre'>Integer pStart, Integer pLength</span> )</div><div class='description'><div class='short'>Deletes a subset of symbols ...</div><div class='long'><p>Deletes a subset of symbols</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pStart</span> : Integer<div class='sub-desc'><p>A start to the slice</p>\n</div></li><li><span class='pre'>pLength</span> : Integer<div class='sub-desc'><p>The length of the delete (how many symbols to delete)</p>\n</div></li></ul></div></div></div><div id='method-getAlphabet' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.sequence.common.SymbolList' rel='Teselagen.bio.sequence.common.SymbolList' class='defined-in docClass'>Teselagen.bio.sequence.common.SymbolList</a><br/><a href='source/SymbolList.html#Teselagen-bio-sequence-common-SymbolList-method-getAlphabet' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.SymbolList-method-getAlphabet' class='name expandable'>getAlphabet</a>( <span class='pre'></span> ) : alphabet</div><div class='description'><div class='short'>Returns alphabet ...</div><div class='long'><p>Returns alphabet</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>alphabet</span><div class='sub-desc'><p>the symbol list's alphabet</p>\n</div></li></ul></div></div></div><div id='method-getName' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Sequence'>Teselagen.bio.sequence.common.Sequence</span><br/><a href='source/Sequence.html#Teselagen-bio-sequence-common-Sequence-method-getName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Sequence-method-getName' class='name expandable'>getName</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Get Name of the sequence ...</div><div class='long'><p>Get Name of the sequence</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Name</p>\n</div></li></ul></div></div></div><div id='method-getSymbols' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.sequence.common.SymbolList' rel='Teselagen.bio.sequence.common.SymbolList' class='defined-in docClass'>Teselagen.bio.sequence.common.SymbolList</a><br/><a href='source/SymbolList.html#Teselagen-bio-sequence-common-SymbolList-method-getSymbols' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.SymbolList-method-getSymbols' class='name expandable'>getSymbols</a>( <span class='pre'></span> ) : Symbols[]</div><div class='description'><div class='short'>Returns the object's symbols ...</div><div class='long'><p>Returns the object's symbols</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Symbols[]</span><div class='sub-desc'><p>the objects symbols</p>\n</div></li></ul></div></div></div><div id='method-getSymbolsLength' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.sequence.common.SymbolList' rel='Teselagen.bio.sequence.common.SymbolList' class='defined-in docClass'>Teselagen.bio.sequence.common.SymbolList</a><br/><a href='source/SymbolList.html#Teselagen-bio-sequence-common-SymbolList-method-getSymbolsLength' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.SymbolList-method-getSymbolsLength' class='name expandable'>getSymbolsLength</a>( <span class='pre'></span> ) : Integer</div><div class='description'><div class='short'>Returns the number of symbols in the list ...</div><div class='long'><p>Returns the number of symbols in the list</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Integer</span><div class='sub-desc'><p>the number of symbols in the list</p>\n</div></li></ul></div></div></div><div id='method-hasGap' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.sequence.common.SymbolList' rel='Teselagen.bio.sequence.common.SymbolList' class='defined-in docClass'>Teselagen.bio.sequence.common.SymbolList</a><br/><a href='source/SymbolList.html#Teselagen-bio-sequence-common-SymbolList-method-hasGap' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.SymbolList-method-hasGap' class='name expandable'>hasGap</a>( <span class='pre'></span> ) : Boolean</div><div class='description'><div class='short'>Returns whether the symbollist has a gap ...</div><div class='long'><p>Returns whether the symbollist has a gap</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>returns whether the alphabet has a gap</p>\n</div></li></ul></div></div></div><div id='method-insertSymbols' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.sequence.common.SymbolList' rel='Teselagen.bio.sequence.common.SymbolList' class='defined-in docClass'>Teselagen.bio.sequence.common.SymbolList</a><br/><a href='source/SymbolList.html#Teselagen-bio-sequence-common-SymbolList-method-insertSymbols' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.SymbolList-method-insertSymbols' class='name expandable'>insertSymbols</a>( <span class='pre'>Integer pPosition, Symbols[] pNewSymbols</span> )</div><div class='description'><div class='short'>Inserts a symbol list at a position (using non-zero-based  cardinal index) ...</div><div class='long'><p>Inserts a symbol list at a position (using non-zero-based  cardinal index)</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pPosition</span> : Integer<div class='sub-desc'><p>The position the symbols should be inserted at</p>\n</div></li><li><span class='pre'>pNewSymbols</span> : Symbols[]<div class='sub-desc'><p>The symbols to be added</p>\n</div></li></ul></div></div></div><div id='method-requires' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.sequence.common.SymbolList' rel='Teselagen.bio.sequence.common.SymbolList' class='defined-in docClass'>Teselagen.bio.sequence.common.SymbolList</a><br/><a href='source/SymbolList.html#Teselagen-bio-sequence-common-SymbolList-method-requires' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.SymbolList-method-requires' class='name expandable'>requires</a>( <span class='pre'>Symbols[] symbols, String alphabet</span> )</div><div class='description'><div class='short'>Constructor ...</div><div class='long'><p>Constructor</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>symbols</span> : Symbols[]<div class='sub-desc'><p>The array of symbols in the SymbolList</p>\n</div></li><li><span class='pre'>alphabet</span> : String<div class='sub-desc'><p>Alphabet used in the SymbolList</p>\n</div></li></ul></div></div></div><div id='method-seqString' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.sequence.common.SymbolList' rel='Teselagen.bio.sequence.common.SymbolList' class='defined-in docClass'>Teselagen.bio.sequence.common.SymbolList</a><br/><a href='source/SymbolList.html#Teselagen-bio-sequence-common-SymbolList-method-seqString' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.SymbolList-method-seqString' class='name expandable'>seqString</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Turns the symbol list into a string ...</div><div class='long'><p>Turns the symbol list into a string</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>the sequence's string</p>\n</div></li></ul></div></div></div><div id='method-setAlphabet' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.sequence.common.SymbolList' rel='Teselagen.bio.sequence.common.SymbolList' class='defined-in docClass'>Teselagen.bio.sequence.common.SymbolList</a><br/><a href='source/SymbolList.html#Teselagen-bio-sequence-common-SymbolList-method-setAlphabet' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.SymbolList-method-setAlphabet' class='name expandable'>setAlphabet</a>( <span class='pre'>Alphabet pAlphabet</span> )</div><div class='description'><div class='short'>Sets Alphabet ...</div><div class='long'><p>Sets Alphabet</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pAlphabet</span> : Alphabet<div class='sub-desc'><p>an input alphabet</p>\n</div></li></ul></div></div></div><div id='method-setName' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Sequence'>Teselagen.bio.sequence.common.Sequence</span><br/><a href='source/Sequence.html#Teselagen-bio-sequence-common-Sequence-method-setName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Sequence-method-setName' class='name expandable'>setName</a>( <span class='pre'>String pName</span> )</div><div class='description'><div class='short'>Set name ...</div><div class='long'><p>Set name</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pName</span> : String<div class='sub-desc'><p>Sets sequence name</p>\n</div></li></ul></div></div></div><div id='method-setSymbols' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.sequence.common.SymbolList' rel='Teselagen.bio.sequence.common.SymbolList' class='defined-in docClass'>Teselagen.bio.sequence.common.SymbolList</a><br/><a href='source/SymbolList.html#Teselagen-bio-sequence-common-SymbolList-method-setSymbols' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.SymbolList-method-setSymbols' class='name expandable'>setSymbols</a>( <span class='pre'>Symbols[] pSymbols</span> )</div><div class='description'><div class='short'>Sets the objects' symbols. ...</div><div class='long'><p>Sets the objects' symbols.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pSymbols</span> : Symbols[]<div class='sub-desc'><p>the objects symbols</p>\n</div></li></ul></div></div></div><div id='method-subList' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.sequence.common.SymbolList' rel='Teselagen.bio.sequence.common.SymbolList' class='defined-in docClass'>Teselagen.bio.sequence.common.SymbolList</a><br/><a href='source/SymbolList.html#Teselagen-bio-sequence-common-SymbolList-method-subList' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.SymbolList-method-subList' class='name expandable'>subList</a>( <span class='pre'>Integer pStart, Integer pEnd</span> ) : SymbolList</div><div class='description'><div class='short'>Returns a sublist of symbols ...</div><div class='long'><p>Returns a sublist of symbols</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pStart</span> : Integer<div class='sub-desc'><p>start of slice</p>\n</div></li><li><span class='pre'>pEnd</span> : Integer<div class='sub-desc'><p>End of slice</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>SymbolList</span><div class='sub-desc'><p>a spliced array of symbols</p>\n</div></li></ul></div></div></div><div id='method-symbolAt' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.sequence.common.SymbolList' rel='Teselagen.bio.sequence.common.SymbolList' class='defined-in docClass'>Teselagen.bio.sequence.common.SymbolList</a><br/><a href='source/SymbolList.html#Teselagen-bio-sequence-common-SymbolList-method-symbolAt' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.SymbolList-method-symbolAt' class='name expandable'>symbolAt</a>( <span class='pre'>Integer pPosition</span> ) : Symbols</div><div class='description'><div class='short'>Gets the symbol at a specific position ...</div><div class='long'><p>Gets the symbol at a specific position</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pPosition</span> : Integer<div class='sub-desc'><p>a specified position within the symbols</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Symbols</span><div class='sub-desc'><p>the symbol at the specified position</p>\n</div></li></ul></div></div></div><div id='method-toString' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Teselagen.bio.sequence.common.SymbolList' rel='Teselagen.bio.sequence.common.SymbolList' class='defined-in docClass'>Teselagen.bio.sequence.common.SymbolList</a><br/><a href='source/SymbolList.html#Teselagen-bio-sequence-common-SymbolList-method-toString' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.SymbolList-method-toString' class='name expandable'>toString</a>( <span class='pre'></span> ) : String</div><div class='description'><div class='short'>Returns the string sequence ...</div><div class='long'><p>Returns the string sequence</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>The Object's sequence</p>\n</div></li></ul></div></div></div></div></div></div></div>","html_meta":{"author":null},"aliases":{},"files":[{"href":"Sequence.html#Teselagen-bio-sequence-common-Sequence","filename":"Sequence.js"}],"superclasses":["Ext.Base","Teselagen.bio.sequence.common.SymbolList"],"component":false,"tagname":"class","requires":[],"members":{"event":[],"property":[],"css_var":[],"method":[{"owner":"Teselagen.bio.sequence.common.Sequence","meta":{},"tagname":"method","name":"constructor","id":"method-constructor"},{"owner":"Teselagen.bio.sequence.common.SymbolList","meta":{},"tagname":"method","name":"addSymbolList","id":"method-addSymbolList"},{"owner":"Teselagen.bio.sequence.common.SymbolList","meta":{},"tagname":"method","name":"addSymbols","id":"method-addSymbols"},{"owner":"Teselagen.bio.sequence.common.SymbolList","meta":{},"tagname":"method","name":"clear","id":"method-clear"},{"owner":"Teselagen.bio.sequence.common.SymbolList","meta":{},"tagname":"method","name":"deleteSymbols","id":"method-deleteSymbols"},{"owner":"Teselagen.bio.sequence.common.SymbolList","meta":{},"tagname":"method","name":"getAlphabet","id":"method-getAlphabet"},{"owner":"Teselagen.bio.sequence.common.Sequence","meta":{},"tagname":"method","name":"getName","id":"method-getName"},{"owner":"Teselagen.bio.sequence.common.SymbolList","meta":{},"tagname":"method","name":"getSymbols","id":"method-getSymbols"},{"owner":"Teselagen.bio.sequence.common.SymbolList","meta":{},"tagname":"method","name":"getSymbolsLength","id":"method-getSymbolsLength"},{"owner":"Teselagen.bio.sequence.common.SymbolList","meta":{},"tagname":"method","name":"hasGap","id":"method-hasGap"},{"owner":"Teselagen.bio.sequence.common.SymbolList","meta":{},"tagname":"method","name":"insertSymbols","id":"method-insertSymbols"},{"owner":"Teselagen.bio.sequence.common.SymbolList","meta":{},"tagname":"method","name":"requires","id":"method-requires"},{"owner":"Teselagen.bio.sequence.common.SymbolList","meta":{},"tagname":"method","name":"seqString","id":"method-seqString"},{"owner":"Teselagen.bio.sequence.common.SymbolList","meta":{},"tagname":"method","name":"setAlphabet","id":"method-setAlphabet"},{"owner":"Teselagen.bio.sequence.common.Sequence","meta":{},"tagname":"method","name":"setName","id":"method-setName"},{"owner":"Teselagen.bio.sequence.common.SymbolList","meta":{},"tagname":"method","name":"setSymbols","id":"method-setSymbols"},{"owner":"Teselagen.bio.sequence.common.SymbolList","meta":{},"tagname":"method","name":"subList","id":"method-subList"},{"owner":"Teselagen.bio.sequence.common.SymbolList","meta":{},"tagname":"method","name":"symbolAt","id":"method-symbolAt"},{"owner":"Teselagen.bio.sequence.common.SymbolList","meta":{},"tagname":"method","name":"toString","id":"method-toString"}],"css_mixin":[],"cfg":[]},"alternateClassNames":[],"inheritdoc":null,"mixedInto":[],"name":"Teselagen.bio.sequence.common.Sequence","extends":"Teselagen.bio.sequence.common.SymbolList","id":"class-Teselagen.bio.sequence.common.Sequence","parentMixins":[],"singleton":false,"uses":[],"statics":{"property":[],"event":[],"method":[],"css_var":[],"css_mixin":[],"cfg":[]}});