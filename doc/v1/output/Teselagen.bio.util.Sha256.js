Ext.data.JsonP.Teselagen_bio_util_Sha256({"subclasses":[],"mixins":[],"code_type":"ext_define","inheritable":false,"meta":{"author":["Adapted for ExtJs by Diana Wong"]},"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Base<div class='subclass '><strong>Teselagen.bio.util.Sha256</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/Sha256.html#Teselagen-bio-util-Sha256' target='_blank'>Sha256.js</a></div></pre><div class='doc-contents'><p>A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined\nin FIPS 180-2\nVersion 2.2 Copyright Angel Marin, Paul Johnston 2000 - 2009.\nOther contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet\nDistributed under the BSD License\nSee http://pajhome.org.uk/crypt/md5 for details.\nAlso http://anmar.eu.org/projects/jssha2/</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-hexcase' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.util.Sha256'>Teselagen.bio.util.Sha256</span><br/><a href='source/Sha256.html#Teselagen-bio-util-Sha256-property-hexcase' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.util.Sha256-property-hexcase' class='name expandable'>hexcase</a><span> : Number</span></div><div class='description'><div class='short'>Configurable variables. ...</div><div class='long'><p>Configurable variables. You may need to tweak these to be compatible with\nthe server-side, but the defaults work in most cases.</p>\n<p>Defaults to: <code>0</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-binb2rstr' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.util.Sha256'>Teselagen.bio.util.Sha256</span><br/><a href='source/Sha256.html#Teselagen-bio-util-Sha256-method-binb2rstr' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.util.Sha256-method-binb2rstr' class='name expandable'>binb2rstr</a>( <span class='pre'>Object input</span> )</div><div class='description'><div class='short'>Convert an array of big-endian words to a string ...</div><div class='long'><p>Convert an array of big-endian words to a string</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>input</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-hex_sha256' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.util.Sha256'>Teselagen.bio.util.Sha256</span><br/><a href='source/Sha256.html#Teselagen-bio-util-Sha256-method-hex_sha256' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.util.Sha256-method-hex_sha256' class='name expandable'>hex_sha256</a>( <span class='pre'>Object s</span> )</div><div class='description'><div class='short'>These are the functions you'll usually want to call\nThey take string arguments and return either hex or base-64 encod...</div><div class='long'><p>These are the functions you'll usually want to call\nThey take string arguments and return either hex or base-64 encoded strings</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>s</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-rstr2any' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.util.Sha256'>Teselagen.bio.util.Sha256</span><br/><a href='source/Sha256.html#Teselagen-bio-util-Sha256-method-rstr2any' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.util.Sha256-method-rstr2any' class='name expandable'>rstr2any</a>( <span class='pre'>Object input, Object encoding</span> )</div><div class='description'><div class='short'>Convert a raw string to an arbitrary string encoding ...</div><div class='long'><p>Convert a raw string to an arbitrary string encoding</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>input</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>encoding</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-rstr2b64' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.util.Sha256'>Teselagen.bio.util.Sha256</span><br/><a href='source/Sha256.html#Teselagen-bio-util-Sha256-method-rstr2b64' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.util.Sha256-method-rstr2b64' class='name expandable'>rstr2b64</a>( <span class='pre'>Object input</span> )</div><div class='description'><div class='short'>Convert a raw string to a base-64 string ...</div><div class='long'><p>Convert a raw string to a base-64 string</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>input</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-rstr2binb' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.util.Sha256'>Teselagen.bio.util.Sha256</span><br/><a href='source/Sha256.html#Teselagen-bio-util-Sha256-method-rstr2binb' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.util.Sha256-method-rstr2binb' class='name expandable'>rstr2binb</a>( <span class='pre'>Object input</span> )</div><div class='description'><div class='short'>Convert a raw string to an array of big-endian words\nCharacters >255 have their high-byte silently ignored. ...</div><div class='long'><p>Convert a raw string to an array of big-endian words\nCharacters >255 have their high-byte silently ignored.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>input</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-rstr2hex' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.util.Sha256'>Teselagen.bio.util.Sha256</span><br/><a href='source/Sha256.html#Teselagen-bio-util-Sha256-method-rstr2hex' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.util.Sha256-method-rstr2hex' class='name expandable'>rstr2hex</a>( <span class='pre'>Object input</span> )</div><div class='description'><div class='short'>Convert a raw string to a hex string ...</div><div class='long'><p>Convert a raw string to a hex string</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>input</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-rstr_hmac_sha256' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.util.Sha256'>Teselagen.bio.util.Sha256</span><br/><a href='source/Sha256.html#Teselagen-bio-util-Sha256-method-rstr_hmac_sha256' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.util.Sha256-method-rstr_hmac_sha256' class='name expandable'>rstr_hmac_sha256</a>( <span class='pre'>Object key, Object data</span> )</div><div class='description'><div class='short'>Calculate the HMAC-sha256 of a key and some data (raw strings) ...</div><div class='long'><p>Calculate the HMAC-sha256 of a key and some data (raw strings)</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>data</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-rstr_sha256' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.util.Sha256'>Teselagen.bio.util.Sha256</span><br/><a href='source/Sha256.html#Teselagen-bio-util-Sha256-method-rstr_sha256' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.util.Sha256-method-rstr_sha256' class='name expandable'>rstr_sha256</a>( <span class='pre'>Object s</span> )</div><div class='description'><div class='short'>Calculate the sha256 of a raw string ...</div><div class='long'><p>Calculate the sha256 of a raw string</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>s</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-sha256_S' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.util.Sha256'>Teselagen.bio.util.Sha256</span><br/><a href='source/Sha256.html#Teselagen-bio-util-Sha256-method-sha256_S' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.util.Sha256-method-sha256_S' class='name expandable'>sha256_S</a>( <span class='pre'>Object X, Object n</span> )</div><div class='description'><div class='short'>Main sha256 function, with its support functions ...</div><div class='long'><p>Main sha256 function, with its support functions</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>X</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>n</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-sha256_vm_test' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.util.Sha256'>Teselagen.bio.util.Sha256</span><br/><a href='source/Sha256.html#Teselagen-bio-util-Sha256-method-sha256_vm_test' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.util.Sha256-method-sha256_vm_test' class='name expandable'>sha256_vm_test</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Perform a simple self-test to see if the VM is working ...</div><div class='long'><p>Perform a simple self-test to see if the VM is working</p>\n</div></div></div><div id='method-str2rstr_utf16le' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.util.Sha256'>Teselagen.bio.util.Sha256</span><br/><a href='source/Sha256.html#Teselagen-bio-util-Sha256-method-str2rstr_utf16le' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.util.Sha256-method-str2rstr_utf16le' class='name expandable'>str2rstr_utf16le</a>( <span class='pre'>Object input</span> )</div><div class='description'><div class='short'>Encode a string as utf-16 ...</div><div class='long'><p>Encode a string as utf-16</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>input</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-str2rstr_utf8' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.util.Sha256'>Teselagen.bio.util.Sha256</span><br/><a href='source/Sha256.html#Teselagen-bio-util-Sha256-method-str2rstr_utf8' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.util.Sha256-method-str2rstr_utf8' class='name expandable'>str2rstr_utf8</a>( <span class='pre'>Object input</span> )</div><div class='description'><div class='short'>Encode a string as utf-8. ...</div><div class='long'><p>Encode a string as utf-8.\nFor efficiency, this assumes the input is valid utf-16.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>input</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","html_meta":{"author":null},"aliases":{},"files":[{"href":"Sha256.html#Teselagen-bio-util-Sha256","filename":"Sha256.js"}],"superclasses":["Ext.Base"],"component":false,"tagname":"class","requires":[],"members":{"event":[],"property":[{"owner":"Teselagen.bio.util.Sha256","meta":{},"tagname":"property","name":"hexcase","id":"property-hexcase"}],"css_var":[],"method":[{"owner":"Teselagen.bio.util.Sha256","meta":{},"tagname":"method","name":"binb2rstr","id":"method-binb2rstr"},{"owner":"Teselagen.bio.util.Sha256","meta":{},"tagname":"method","name":"hex_sha256","id":"method-hex_sha256"},{"owner":"Teselagen.bio.util.Sha256","meta":{},"tagname":"method","name":"rstr2any","id":"method-rstr2any"},{"owner":"Teselagen.bio.util.Sha256","meta":{},"tagname":"method","name":"rstr2b64","id":"method-rstr2b64"},{"owner":"Teselagen.bio.util.Sha256","meta":{},"tagname":"method","name":"rstr2binb","id":"method-rstr2binb"},{"owner":"Teselagen.bio.util.Sha256","meta":{},"tagname":"method","name":"rstr2hex","id":"method-rstr2hex"},{"owner":"Teselagen.bio.util.Sha256","meta":{},"tagname":"method","name":"rstr_hmac_sha256","id":"method-rstr_hmac_sha256"},{"owner":"Teselagen.bio.util.Sha256","meta":{},"tagname":"method","name":"rstr_sha256","id":"method-rstr_sha256"},{"owner":"Teselagen.bio.util.Sha256","meta":{},"tagname":"method","name":"sha256_S","id":"method-sha256_S"},{"owner":"Teselagen.bio.util.Sha256","meta":{},"tagname":"method","name":"sha256_vm_test","id":"method-sha256_vm_test"},{"owner":"Teselagen.bio.util.Sha256","meta":{},"tagname":"method","name":"str2rstr_utf16le","id":"method-str2rstr_utf16le"},{"owner":"Teselagen.bio.util.Sha256","meta":{},"tagname":"method","name":"str2rstr_utf8","id":"method-str2rstr_utf8"}],"css_mixin":[],"cfg":[]},"alternateClassNames":[],"inheritdoc":null,"mixedInto":[],"name":"Teselagen.bio.util.Sha256","extends":"Ext.Base","id":"class-Teselagen.bio.util.Sha256","parentMixins":[],"singleton":true,"uses":[],"statics":{"property":[],"event":[],"method":[],"css_var":[],"css_mixin":[],"cfg":[]}});