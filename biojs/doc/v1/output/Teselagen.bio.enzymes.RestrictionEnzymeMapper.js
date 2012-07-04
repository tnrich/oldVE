Ext.data.JsonP.Teselagen_bio_enzymes_RestrictionEnzymeMapper({"subclasses":[],"mixins":[],"code_type":"ext_define","inheritable":false,"meta":{"author":["Nick Elsbree","Zinovii Dmytriv (original author)"]},"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Base<div class='subclass '><strong>Teselagen.bio.enzymes.RestrictionEnzymeMapper</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/RestrictionEnzymeMapper.html#Teselagen-bio-enzymes-RestrictionEnzymeMapper' target='_blank'>RestrictionEnzymeMapper.js</a></div></pre><div class='doc-contents'><p>Restriction enzyme mapper- finds restriction enzyme cut sites in DNA sequence.</p>\n\n<p>@see <a href=\"#!/api/Teselagen.bio.enzymes.RestrictionEnzyme\" rel=\"Teselagen.bio.enzymes.RestrictionEnzyme\" class=\"docClass\">Teselagen.bio.enzymes.RestrictionEnzyme</a>\n@see <a href=\"#!/api/Teselagen.bio.enzymes.RestrictionCutSite\" rel=\"Teselagen.bio.enzymes.RestrictionCutSite\" class=\"docClass\">Teselagen.bio.enzymes.RestrictionCutSite</a></p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-cutSequence' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.enzymes.RestrictionEnzymeMapper'>Teselagen.bio.enzymes.RestrictionEnzymeMapper</span><br/><a href='source/RestrictionEnzymeMapper.html#Teselagen-bio-enzymes-RestrictionEnzymeMapper-method-cutSequence' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.enzymes.RestrictionEnzymeMapper-method-cutSequence' class='name expandable'>cutSequence</a>( <span class='pre'>Array restrictionEnzymes,  symbolList</span> )</div><div class='description'><div class='short'>Cut sequence by list of restriction enzymes. ...</div><div class='long'><p>Cut sequence by list of restriction enzymes.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>restrictionEnzymes</span> : Array<div class='sub-desc'><p>List of restriction enzymes to cut sequence with.</p>\n</div></li><li><span class='pre'>symbolList</span> : <div class='sub-desc'><p>The DNA sequence to be cut.</p>\n</div></li></ul></div></div></div><div id='method-cutSequenceByRestrictionEnzyme' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.enzymes.RestrictionEnzymeMapper'>Teselagen.bio.enzymes.RestrictionEnzymeMapper</span><br/><a href='source/RestrictionEnzymeMapper.html#Teselagen-bio-enzymes-RestrictionEnzymeMapper-method-cutSequenceByRestrictionEnzyme' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.enzymes.RestrictionEnzymeMapper-method-cutSequenceByRestrictionEnzyme' class='name expandable'>cutSequenceByRestrictionEnzyme</a>( <span class='pre'>RestrictionEnzyme Restriction, SymbolList symbolList</span> ) : Array</div><div class='description'><div class='short'>Cut sequence with one restriction enzyme. ...</div><div class='long'><p>Cut sequence with one restriction enzyme.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>Restriction</span> : RestrictionEnzyme<div class='sub-desc'><p>enzyme to cut the sequence with.</p>\n</div></li><li><span class='pre'>symbolList</span> : SymbolList<div class='sub-desc'><p>DNA sequence.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'><p>List of RestrictionCutSite's.</p>\n\n<p>@see Teselegen.bio.enzymes.RestrictionCutSite</p>\n</div></li></ul></div></div></div></div></div></div></div>","html_meta":{"author":null},"aliases":{},"files":[{"href":"RestrictionEnzymeMapper.html#Teselagen-bio-enzymes-RestrictionEnzymeMapper","filename":"RestrictionEnzymeMapper.js"}],"superclasses":["Ext.Base"],"component":false,"tagname":"class","requires":[],"members":{"event":[],"property":[],"css_var":[],"method":[{"owner":"Teselagen.bio.enzymes.RestrictionEnzymeMapper","meta":{},"tagname":"method","name":"cutSequence","id":"method-cutSequence"},{"owner":"Teselagen.bio.enzymes.RestrictionEnzymeMapper","meta":{},"tagname":"method","name":"cutSequenceByRestrictionEnzyme","id":"method-cutSequenceByRestrictionEnzyme"}],"css_mixin":[],"cfg":[]},"alternateClassNames":[],"inheritdoc":null,"mixedInto":[],"name":"Teselagen.bio.enzymes.RestrictionEnzymeMapper","extends":"Ext.Base","id":"class-Teselagen.bio.enzymes.RestrictionEnzymeMapper","parentMixins":[],"singleton":true,"uses":[],"statics":{"property":[],"event":[],"method":[],"css_var":[],"css_mixin":[],"cfg":[]}});