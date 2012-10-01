var inspectorHTML = '\
 <html> \
    <head> \
        <title></title> \
    </head> \
    <body> \
        <div id="inspector"> \
            <div class="inspector-head x-toolbar-default"> \
                <span class="context">Inspector</span> \
            </div> \
            <div class="inspector-body hide" style="display: block;"> \
                <ul id="inspector-tabs" class="nav nav-tabs ui-tabs ui-widget ui-widget-content ui-corner-all"> \
                    <li> \
                        <a href="#inspector-part" data-toggle="tab">Part info</a> \
                    </li> \
                    <li class="active"> \
                        <a href="#inspector-collection" data-toggle="tab">Collection info</a> \
                    </li> \
                </ul> \
                <div class="inspector-data"> \
                    <div class="tab-content"> \
                        <div id="inspector-part" class="tab-pane"> \
                            <form class="form-inline"> \
                                <fieldset> \
                                    <div class="control-group"> \
                                        <label for="partName" class="control-label">Part name:</label><input id="partName" type="text" style="margin-left:30px;" class="input-small"> \
                                    </div> \
                                    <div class="control-group"> \
                                        <label for="input01" class="control-label disabled">Path source:</label><span id="part-source" style="margin-left:22px;"></span> \
                                    </div> \
                                    <div class="control-group"> \
                                        <label for="input01" class="control-label disabled">Reverse complement (on source):</label><span id="part-revComp" style="margin-left:22px;"></span> \
                                    </div> \
                                    <div class="control-group"> \
                                        <label for="input01" class="control-label disabled">Start BP:</label><span id="part-startBP" style="margin-left:22px;"></span> \
                                    </div> \
                                    <div class="control-group"> \
                                        <label for="input01" class="control-label disabled">Stop BP:</label><span id="part-stopBP" style="margin-left:22px;"></span> \
                                    </div><button id="change-part-def-button" type="submit" class="btn">Change part definition</button> \
                                </fieldset> \
                            </form> \
                            <p style="margin-top:5px;"> \
                                Forced assembly strategy \
                            </p><select id="part-fas"> \
                                <option value=""> \
                                    None \
                                </option> \
                                <option value="DIGEST"> \
                                    DIGEST \
                                </option> \
                                <option value="direct-synth"> \
                                    Direct Synthesis \
                                </option> \
                                <option value="pcr"> \
                                    PCR \
                                </option> \
                                <option value="ember_in_primer_reverse"> \
                                    Ember_in_primer_reverse \
                                </option> \
                                <option value="ember_in_primer_forward"> \
                                    Ember_in_primer_forward \
                                </option> \
                                <option value="annealed oligos"> \
                                    Annealed Oligos \
                                </option> \
                            </select> \
                            <p id="eugene-info"></p> \
                            <div id="eugene" style="width:300px;overflow:hidden;"> \
                                <table> \
                                    <thead> \
                                        <tr> \
                                            <th> \
                                                Name \
                                            </th> \
                                            <th> \
                                                Operand 1 \
                                            </th> \
                                            <th> \
                                                Operator \
                                            </th> \
                                            <th> \
                                                Operand 2 \
                                            </th> \
                                        </tr> \
                                    </thead> \
                                    <tbody id="eugeneRules-table"></tbody> \
                                </table> \
                            </div><br> \
                            <button class="btn add-rule">Add Rule</button><button class="btn edit-rules">Edit Rules</button> \
                        </div> \
                        <div id="inspector-collection" class="tab-pane active"> \
                            <form class="form-inline"> \
                                <fieldset> \
                                    <div class="control-group"> \
                                        <label for="Collection-Name" class="control-label">Design Name:</label><input id="design-name" class="input" style="margin-left:5px;"></input> \
                                    </div> \
                                    <div class="control-group"> \
                                        <label for="combinatorial" class="control-label">Combinatorial:</label><span id="combinatorial" style="margin-left:5px; width:180px;">False</span> \
                                    </div> \
                                    <div class="control-group"> \
                                        <div class="controls"> \
                                            <div class="row"> \
                                                <div class="span1"> \
                                                    <label class="radio"><input type="radio" name="isCircular" value="true">Circular</label> \
                                                </div> \
                                                <div class="span1"> \
                                                    <label class="radio"><input type="radio" name="isCircular" value="false">Linear</label> \
                                                </div> \
                                            </div> \
                                        </div> \
                                    </div> \
                                    <div style="width:288px;overflow:scroll;"> \
                                        <table style="background:white;" class="table"> \
                                            <thead> \
                                                <tr> \
                                                    <th> \
                                                        Name \
                                                    </th> \
                                                    <th> \
                                                        Direction \
                                                    </th> \
                                                    <th> \
                                                        Items \
                                                    </th> \
                                                    <th> \
                                                        FAS \
                                                    </th> \
                                                    <th> \
                                                        DSF \
                                                    </th> \
                                                    <th> \
                                                        FRO \
                                                    </th> \
                                                    <th> \
                                                        5Ex \
                                                    </th> \
                                                    <th> \
                                                        3Ex \
                                                    </th> \
                                                </tr> \
                                            </thead> \
                                            <tbody id="collection-table"></tbody> \
                                        </table> \
                                    </div> \
                                    <div class="control-group"> \
                                        <div class="btn add-col"> \
                                            Add Column \
                                        </div> \
                                        <div class="btn rm-col"> \
                                            Remove Column \
                                        </div> \
                                    </div> \
                                    <p> \
                                        Abbreviations \
                                    </p> \
                                    <p> \
                                        <strong>FAS:</strong> Forced Assembly strategy \
                                    </p> \
                                    <p> \
                                        Column content \
                                    </p> \
                                    <textarea> \
                                    </textarea> \
                                </fieldset> \
                            </form> \
                        </div> \
                    </div> \
                </div> \
            </div> \
        </div> \
    </body> \
</html>';

Ext.define('Vede.view.de_legacy.Inspector', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.DeviceEditorLegacyInspectorPanel',
    title: 'Device Editor',
    header: false,
    html: inspectorHTML,
    afterRender: function(){
        //window.setTimeout(function(){$( document ).trigger( 'loadDE' );},1000);
    },
    style: {'background':'whiteSmoke !important','overflow':'scroll !important'}
});
