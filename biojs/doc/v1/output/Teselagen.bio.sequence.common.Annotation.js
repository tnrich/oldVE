Ext.data.JsonP.Teselagen_bio_sequence_common_Annotation({"subclasses":["Teselagen.bio.sequence.common.StrandedAnnotation"],"mixins":[],"code_type":"ext_define","inheritable":false,"meta":{"author":["Micah Lerner","Zinovii Dmytriv (original author)","Timothy Ham (original author)"]},"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Base<div class='subclass '><strong>Teselagen.bio.sequence.common.Annotation</strong></div></div><h4>Requires</h4><div class='dependency'>Teselagen.bio.BioException</div><div class='dependency'><a href='#!/api/Teselagen.bio.sequence.common.Location' rel='Teselagen.bio.sequence.common.Location' class='docClass'>Teselagen.bio.sequence.common.Location</a></div><h4>Subclasses</h4><div class='dependency'><a href='#!/api/Teselagen.bio.sequence.common.StrandedAnnotation' rel='Teselagen.bio.sequence.common.StrandedAnnotation' class='docClass'>Teselagen.bio.sequence.common.StrandedAnnotation</a></div><h4>Files</h4><div class='dependency'><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation' target='_blank'>Annotation.js</a></div></pre><div class='doc-contents'><p>The Annotation class contains functions that processes data about locations</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-property-' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-property-' class='name not-expandable'></a><span> : Object</span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-contains' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-method-contains' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-method-contains' class='name expandable'>contains</a>( <span class='pre'>Annotation pAnnotation</span> ) : Boolean</div><div class='description'><div class='short'>Calculates whether one annotation is contained within another. ...</div><div class='long'><p>Calculates whether one annotation is contained within another.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pAnnotation</span> : Annotation<div class='sub-desc'><p>is an input annotation.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>returns a boolean representing whether one annotation is contained within another.</p>\n</div></li></ul></div></div></div><div id='method-deNormalizeLocations' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-method-deNormalizeLocations' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-method-deNormalizeLocations' class='name expandable'>deNormalizeLocations</a>( <span class='pre'>Array<Location> pTempLocations, Integer pOffset, Integer pMaxLength, Boolean pCircular, Integer pCircularAdjustment</span> ) : Array<Location></div><div class='description'><div class='short'>Denormalize the location form zero-based to offset. ...</div><div class='long'><p>Denormalize the location form zero-based to offset. Calculates circularity (if needed)</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pTempLocations</span> : Array<Location><div class='sub-desc'><p>is the array of locations you want to denormalize</p>\n</div></li><li><span class='pre'>pOffset</span> : Integer<div class='sub-desc'><p>the offset of the locations</p>\n</div></li><li><span class='pre'>pMaxLength</span> : Integer<div class='sub-desc'><p>is the max length of the locations</p>\n</div></li><li><span class='pre'>pCircular</span> : Boolean<div class='sub-desc'><p>if the annotation is circular</p>\n</div></li><li><span class='pre'>pCircularAdjustment</span> : Integer<div class='sub-desc'><p>is adjustment that needs to be made because of circularity</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array<Location></span><div class='sub-desc'><p>returns denormalized locations</p>\n</div></li></ul></div></div></div><div id='method-deleteAt' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-method-deleteAt' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-method-deleteAt' class='name expandable'>deleteAt</a>( <span class='pre'>Integer pCutStart, Integer pCutLength, Integer pMaxLength, Boolean pCircular</span> )</div><div class='description'><div class='short'>Delete basepairs and change locations. ...</div><div class='long'><p>Delete basepairs and change locations. Alter only the affected location</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pCutStart</span> : Integer<div class='sub-desc'><p>the start of the cut</p>\n</div></li><li><span class='pre'>pCutLength</span> : Integer<div class='sub-desc'><p>the length of the cut</p>\n</div></li><li><span class='pre'>pMaxLength</span> : Integer<div class='sub-desc'><p>the max length of the locations</p>\n</div></li><li><span class='pre'>pCircular</span> : Boolean<div class='sub-desc'><p>whether the annotation is circular</p>\n</div></li></ul></div></div></div><div id='method-getEnd' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-method-getEnd' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-method-getEnd' class='name expandable'>getEnd</a>( <span class='pre'></span> ) : Number</div><div class='description'><div class='short'>Returns the end of the annotation. ...</div><div class='long'><p>Returns the end of the annotation.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Number</span><div class='sub-desc'><p>returns the end of the annotation.</p>\n</div></li></ul></div></div></div><div id='method-getLocations' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-method-getLocations' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-method-getLocations' class='name expandable'>getLocations</a>( <span class='pre'></span> ) : Locations</div><div class='description'><div class='short'>Returns the locations within the annotation. ...</div><div class='long'><p>Returns the locations within the annotation.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Locations</span><div class='sub-desc'><p>returns a list of the annotation's locations.</p>\n</div></li></ul></div></div></div><div id='method-getOverlappingIndex' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-method-getOverlappingIndex' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-method-getOverlappingIndex' class='name expandable'>getOverlappingIndex</a>( <span class='pre'>Integer index</span> ) : Integer</div><div class='description'><div class='short'>Gets the index of the location ...</div><div class='long'><p>Gets the index of the location</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>index</span> : Integer<div class='sub-desc'><p>the index</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Integer</span><div class='sub-desc'><p>The index of Location. -1 if not within a Location.</p>\n</div></li></ul></div></div></div><div id='method-getStart' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-method-getStart' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-method-getStart' class='name expandable'>getStart</a>( <span class='pre'></span> ) : Number</div><div class='description'><div class='short'>Returns the start of the annotation ...</div><div class='long'><p>Returns the start of the annotation</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Number</span><div class='sub-desc'><p>the start of the annotation</p>\n</div></li></ul></div></div></div><div id='method-insertAt' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-method-insertAt' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-method-insertAt' class='name expandable'>insertAt</a>( <span class='pre'>Integer pPosition, Integer pInsertLength, Integer pMaxLength, Integer pCircular</span> )</div><div class='description'><div class='short'>Inserts basepairs and updates locations. ...</div><div class='long'><p>Inserts basepairs and updates locations. Alters only the affected locations.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pPosition</span> : Integer<div class='sub-desc'><p>is the position of the insert</p>\n</div></li><li><span class='pre'>pInsertLength</span> : Integer<div class='sub-desc'><p>is the length of the insert</p>\n</div></li><li><span class='pre'>pMaxLength</span> : Integer<div class='sub-desc'><p>the max length of the locations</p>\n</div></li><li><span class='pre'>pCircular</span> : Integer<div class='sub-desc'><p>whether the annotation is circular or not</p>\n</div></li></ul></div></div></div><div id='method-isMultiLocation' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-method-isMultiLocation' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-method-isMultiLocation' class='name expandable'>isMultiLocation</a>( <span class='pre'></span> ) : Boolean</div><div class='description'><div class='short'>Calculates whether an annotation has more than one location. ...</div><div class='long'><p>Calculates whether an annotation has more than one location.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>returns a boolean representing whether the annotation contains more than one annotation.</p>\n</div></li></ul></div></div></div><div id='method-reverseLocations' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-method-reverseLocations' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-method-reverseLocations' class='name expandable'>reverseLocations</a>( <span class='pre'>Integer pNewStartIndex, Integer pNewMaxLength, Boolean pCircular</span> )</div><div class='description'><div class='short'>Reverses the locations ...</div><div class='long'><p>Reverses the locations</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pNewStartIndex</span> : Integer<div class='sub-desc'><p>the new start index of teh locationz</p>\n</div></li><li><span class='pre'>pNewMaxLength</span> : Integer<div class='sub-desc'><p>the max length of the locations</p>\n</div></li><li><span class='pre'>pCircular</span> : Boolean<div class='sub-desc'><p>whether the annotations are circular</p>\n</div></li></ul></div></div></div><div id='method-reverseNormalizedLocations' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-method-reverseNormalizedLocations' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-method-reverseNormalizedLocations' class='name expandable'>reverseNormalizedLocations</a>( <span class='pre'>Object tempLocations</span> )</div><div class='description'><div class='short'>Reverses locations. ...</div><div class='long'><p>Reverses locations. This function assumes normalized locations, meaning it will not\nhandle locations that go over zero properly, although it will calculate non-zero\noffset.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>tempLocations</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setEnd' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-method-setEnd' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-method-setEnd' class='name expandable'>setEnd</a>( <span class='pre'>Number pEnd</span> )</div><div class='description'><div class='short'>Allows one to set the end of the annotation. ...</div><div class='long'><p>Allows one to set the end of the annotation.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pEnd</span> : Number<div class='sub-desc'><p>sets the end of the annotation.</p>\n</div></li></ul></div></div></div><div id='method-setLocations' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-method-setLocations' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-method-setLocations' class='name expandable'>setLocations</a>( <span class='pre'>Array of Locations pLocations</span> )</div><div class='description'><div class='short'>Allows one to set the locations of the annotation. ...</div><div class='long'><p>Allows one to set the locations of the annotation.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pLocations</span> : Array of Locations<div class='sub-desc'><p>sets the new list of locations.</p>\n</div></li></ul></div></div></div><div id='method-setOneEnd' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-method-setOneEnd' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-method-setOneEnd' class='name expandable'>setOneEnd</a>( <span class='pre'>Number pEnd</span> )</div><div class='description'><div class='short'>Allows one to set the end of the annotation. ...</div><div class='long'><p>Allows one to set the end of the annotation.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pEnd</span> : Number<div class='sub-desc'><p>sets the end of the annotation only if there is one location.</p>\n</div></li></ul></div></div></div><div id='method-setOneStart' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-method-setOneStart' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-method-setOneStart' class='name expandable'>setOneStart</a>( <span class='pre'>Number pStart</span> )</div><div class='description'><div class='short'>Allows one to set the first start in an annotation, unless there is more than one start. ...</div><div class='long'><p>Allows one to set the first start in an annotation, unless there is more than one start.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pStart</span> : Number<div class='sub-desc'><p>sets the new start of the annotation only if there is one location.</p>\n</div></li></ul></div></div></div><div id='method-setStart' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-method-setStart' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-method-setStart' class='name expandable'>setStart</a>( <span class='pre'>Number pStart</span> )</div><div class='description'><div class='short'>Allows one to set the start of the annotation ...</div><div class='long'><p>Allows one to set the start of the annotation</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pStart</span> : Number<div class='sub-desc'><p>is the new start.</p>\n</div></li></ul></div></div></div><div id='method-shift' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Teselagen.bio.sequence.common.Annotation'>Teselagen.bio.sequence.common.Annotation</span><br/><a href='source/Annotation.html#Teselagen-bio-sequence-common-Annotation-method-shift' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Teselagen.bio.sequence.common.Annotation-method-shift' class='name expandable'>shift</a>( <span class='pre'>Integer pShiftBy, Integer pMaxLength, Boolean pCircular</span> ) : void</div><div class='description'><div class='short'>Shifts the locations. ...</div><div class='long'><p>Shifts the locations.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pShiftBy</span> : Integer<div class='sub-desc'><p>represents amount by which you want to shift the locations</p>\n</div></li><li><span class='pre'>pMaxLength</span> : Integer<div class='sub-desc'><p>is the maximum length of the sequence</p>\n</div></li><li><span class='pre'>pCircular</span> : Boolean<div class='sub-desc'><p>is whether the sequence is circular or not</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>void</span><div class='sub-desc'><p>Sets the new position of the locations</p>\n</div></li></ul></div></div></div></div></div></div></div>","html_meta":{"author":null},"aliases":{},"files":[{"href":"Annotation.html#Teselagen-bio-sequence-common-Annotation","filename":"Annotation.js"}],"superclasses":["Ext.Base"],"component":false,"tagname":"class","requires":["Teselagen.bio.sequence.common.Location","Teselagen.bio.BioException"],"members":{"event":[],"property":[{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"property","name":"","id":"property-"}],"css_var":[],"method":[{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"method","name":"contains","id":"method-contains"},{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"method","name":"deNormalizeLocations","id":"method-deNormalizeLocations"},{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"method","name":"deleteAt","id":"method-deleteAt"},{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"method","name":"getEnd","id":"method-getEnd"},{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"method","name":"getLocations","id":"method-getLocations"},{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"method","name":"getOverlappingIndex","id":"method-getOverlappingIndex"},{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"method","name":"getStart","id":"method-getStart"},{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"method","name":"insertAt","id":"method-insertAt"},{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"method","name":"isMultiLocation","id":"method-isMultiLocation"},{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"method","name":"reverseLocations","id":"method-reverseLocations"},{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"method","name":"reverseNormalizedLocations","id":"method-reverseNormalizedLocations"},{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"method","name":"setEnd","id":"method-setEnd"},{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"method","name":"setLocations","id":"method-setLocations"},{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"method","name":"setOneEnd","id":"method-setOneEnd"},{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"method","name":"setOneStart","id":"method-setOneStart"},{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"method","name":"setStart","id":"method-setStart"},{"owner":"Teselagen.bio.sequence.common.Annotation","meta":{},"tagname":"method","name":"shift","id":"method-shift"}],"css_mixin":[],"cfg":[]},"alternateClassNames":[],"inheritdoc":null,"mixedInto":[],"name":"Teselagen.bio.sequence.common.Annotation","extends":"Ext.Base","id":"class-Teselagen.bio.sequence.common.Annotation","parentMixins":[],"singleton":false,"uses":[],"statics":{"property":[],"event":[],"method":[],"css_var":[],"css_mixin":[],"cfg":[]}});