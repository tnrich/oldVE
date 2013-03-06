require(['domready!','core','plugins','utils','de-utils'], function () {

var iconsList = '{ \
    "assembly_junction": "small-assembly_junction", \
    "cds": "small-cds", \
    "insulator": "small-insulator", \
    "origin_of_replication": "small-origin_of_replication", \
    "promoter": "small-promoter", \
    "five_prime_overhang": "small-five_prime_overhang", \
    "operator_site": "small-operator_site", \
    "primer_binding_site": "small-primer_binding_site", \
    "protein_stability_element": "small-protein_stability_element", \
    "restriction_enzyme_recognition_site": "small-restriction_enzyme_recognition_site", \
    "restriction_site_no_overhang": "small-restriction_site_no_overhang", \
    "ribonuclease_site": "small-ribonuclease_site", \
    "rna_stability_element": "small-rna_stability_element", \
    "signature": "small-signature", \
    "terminator": "small-terminator", \
    "three_prime_overhang": "small-three_prime_overhang" \
}';

$( document ).bind( 'loadDE', function() {

  var J5 = Class.extend({
    init: function(){
      this.execParams = {}; 
      this.j5Params = {};
      this.defaults = {};
      this.condenseParams = {};
      this.downstreamParams = {};
      this.bindUI();
    },
    bindUI: function(){

      var self = this;

      this.loadLatest = function(self,dom,cb){
          var tempValue = dom.html();
          dom.html('Loading latest version');
          dom.attr("disabled",'disabled');
          self.latest = {};
          $.ajax({
              type: "POST",
              url: '/api/GetLastUpdatedUserFiles',
              data: {sessionID:sessionID},
                  success: function(data) {
                      flashCallback("Getting latest Success!",true);
                      self.latest = data;
                      dom.html(tempValue);
                      dom.removeAttr("disabled");
                      if(cb) return cb();

                  },
                  statusCode: {
                  500: function(data) {
                      $("#condense-info").html(data.responseText);
                      $("#condense-progress").hide();
                  }}
          });
      };

      $('.latest').bind('change',function(){
        if(!self.latest) {self.loadLatest(self,$('btn#j5-run'))}
      })


      self.defaults.j5Params = {}; self.defaults.downstreamParams = {};
      $('#j5-params form input,select').each(function(key,val){
          self.defaults.j5Params[$(val).attr('name')] = $(val).val();
      });   
      $('#downstream-params form input,select').each(function(key,val){
          self.defaults.downstreamParams[$(val).attr('name')] = $(val).val();
      });  

      $("#j5-params form button.defaults").click(function(){
        $('#j5-params form input,select').each(function(key,val){
            $(val).val(self.defaults.j5Params[$(val).attr('name')]);
        });
        return false;        
      });

      $("#j5-params form button.returnTolatest").click(function(){

        if(!self.latest) {
          self.loadLatest(self,$(this),function(){
            $('#j5-params form input,select').each(function(key,val){
                $(val).val(self.latest.j5parameters[$(val).attr('name')]);
            });
          });
        }
        else
        {
            $('#j5-params form input,select').each(function(key,val){
                $(val).val(self.latest.j5parameters[$(val).attr('name')]);
            });
        }

        return false;        
      });

      $("#downstream-params form button.defaults").click(function(){
        $('#downstream-params form input,select').each(function(key,val){
            $(val).val(self.defaults.downstreamParams[$(val).attr('name')]);
        });
        return false;        
      });

      $("#j5-params form button.ok").click(function(e){
          e.preventDefault();
          $('#j5-tabs a[href="#j5-run"]').tab('show');
      });

      $("#downstream-params form button.ok").click(function(e){
          e.preventDefault();
          $('#j5-tabs a[href="#j5-downstream"]').tab('show');
      });

      var fileHandler = function(evt) {
          var dom = $(evt.currentTarget);
          var filenameVar = $(evt.currentTarget).attr('var-filename');
          var contentVar = $(evt.currentTarget).attr('var-content');
          var files = evt.target.files;
          if(files.length>0)
          {
              var selectedFile = files[0];
              var reader = new FileReader();
              reader.onload = (function(file){
                  return function(e)
                      {
                          dom.parent().parent().parent().find('input[type="radio"]').last().attr("checked",'checked');
                          self.execParams[filenameVar] = file.name;
                          self.execParams[contentVar] = Base64.encode(e.target.result);
                          dom.parent().parent().parent().find('.btn').html(file.name);
                      };
                  })(selectedFile);
              
              reader.readAsText(selectedFile);
              
          }
      };

      $('#j5-plasm-file').bind('change',fileHandler);
      $('#j5-oligos-file').bind('change',fileHandler);
      $('#j5-direct-file').bind('change',fileHandler);

      $('#assembly-files-to-condense-list').bind('change',
        function(evt){

            var files = evt.target.files;
            if(files.length>0)
            {
              var selectedFile = files[0];
              var reader = new FileReader();
              reader.onload = (function(file){
                  return function(e)
                      {
                          self.condenseParams["assemblyFiles"] = {};
                          self.condenseParams["assemblyFiles"]["name"] = file.name;
                          self.condenseParams["assemblyFiles"]["content"] = Base64.encode(e.target.result);
                          $(evt.currentTarget).parent().parent().find('.btn').html(file.name);
                      };
                  })(selectedFile);
              
              reader.readAsText(selectedFile);
              
            }
        });

      $('#zipped-assembly-files').bind('change',
        function(evt){

            var files = evt.target.files;
            if(files.length>0)
            {
              var selectedFile = files[0];
              var reader = new FileReader();
              reader.onload = (function(file){
                  return function(e)
                      {   
                          console.log(self);
                          self.condenseParams["zippedFiles"] = {};
                          self.condenseParams["zippedFiles"]["name"] = file.name;
                          self.condenseParams["zippedFiles"]["content"] = e.target.result.replace("data:application/zip;base64,","");
                          $(evt.currentTarget).parent().parent().find('.btn').html(file.name);
                      };
                  })(selectedFile);
              
              reader.readAsDataURL(selectedFile);
              
            }
        });

      $("#condense-run").click(function(){

        if(!self.condenseParams["zippedFiles"] || !self.condenseParams["assemblyFiles"])
        {
          $("#condense-info").html('Files not selected!');
          return false;
        }

        $("#condense-progress").show();
        $("#condense-info").html('');

        $.ajax({
            type: "POST",
            url: '/condenseAssemblyFiles',
            data: {params:JSON.stringify(self.condenseParams),sessionID:sessionID},
                success: function(data) {
                    flashCallback("Condense Success!",true);
                    $("#condense-progress").hide();
                    location.href="data:application/zip;base64,"+data["encoded_output_file"];
                },
                statusCode: {
                500: function(data) {
                    $("#condense-info").html(data.responseText);
                    $("#condense-progress").hide();
                }}
        });
      });

      $('#downstream-source-plate-list').bind('change',
        function(evt){

            var files = evt.target.files;
            if(files.length>0)
            {
              var selectedFile = files[0];
              var reader = new FileReader();
              reader.onload = (function(file){
                  return function(e)
                      {
                          self.downstreamParams["encoded_plate_list_file"] = Base64.encode(e.target.result);
                          $(evt.currentTarget).parent().parent().find('.btn').html(file.name);
                      };
                  })(selectedFile);
              
              reader.readAsText(selectedFile);
              
            }
        });

      $('#downstream-zipped-plate-files').bind('change',
        function(evt){

            var files = evt.target.files;
            if(files.length>0)
            {
              var selectedFile = files[0];
              var reader = new FileReader();
              reader.onload = (function(file){
                  return function(e)
                      {
                          self.downstreamParams["encoded_zipped_plate_files_file"] = e.target.result.replace("data:application/zip;base64,","");
                          $(evt.currentTarget).parent().parent().find('.btn').html(file.name);
                      };
                  })(selectedFile);
              
              reader.readAsDataURL(selectedFile);
              
            }
        });

      $('#downstream-j5-assembly-files').bind('change',
        function(evt){

            var files = evt.target.files;
            if(files.length>0)
            {
              var selectedFile = files[0];
              var reader = new FileReader();
              reader.onload = (function(file){
                  return function(e)
                      {
                          self.downstreamParams["encoded_assembly_to_automate_file"] = Base64.encode(e.target.result);
                          $(evt.currentTarget).parent().parent().find('.btn').html(file.name);
                      };
                  })(selectedFile);
              
              reader.readAsText(selectedFile);
              
            }
        });

      $("#distribute-run").click(function(){

        if(!self.downstreamParams["encoded_assembly_to_automate_file"] || !self.downstreamParams["encoded_zipped_plate_files_file"] || !self.downstreamParams["encoded_plate_list_file"] )
        {
          $("#downstream-info").html('Files not selected!');
          return false;
        }

        $("#downstream-progress").show();
        $("#downstream-info").html('');

        self.downstreamParams["encoded_downstream_automation_parameters_file"] = "UGFyYW1ldGVyIE5hbWUsVmFsdWUsRGVmYXVsdCBWYWx1ZSxEZXNjcmlwdGlvbg1NQVhERUxUQVRF TVBFUkFUVVJFQURKQUNFTlRaT05FUyw1LDUsVGhlIG1heGltdW0gZGlmZmVyZW5jZSBpbiB0ZW1w ZXJhdHVyZSAoaW4gQykgYmV0d2VlbiBhZGphY2VudCB6b25lcyBvbiB0aGUgdGhlcm1vY3ljbGVy IGJsb2NrDU1BWERFTFRBVEVNUEVSQVRVUkVSRUFDVElPTk9QVElNVU1aT05FQUNDRVBUQ";
        self.downstreamParams["automation_task"] = "DistributePcrReactions";
        self.downstreamParams["j5_session_id"] = sessionID;
        
        var configParams = {};

        $('#downstream-params form input').each(function(key,val){
            configParams[$(val).attr('name')] = $(val).attr('value');
        });

        $.ajax({
            type: "POST",
            url: '/DesignDownstreamAutomation',
            data: {params:JSON.stringify(self.downstreamParams)},
                success: function(data) {
                    flashCallback("Condense Success!",true);
                    $("#downstream-progress").hide();
                    location.href="data:application/zip;base64,"+data["encoded_output_file"];
                },
                statusCode: {
                500: function(data) {
                    $("#downstream-info").html(data.responseText);
                    $("#downstream-progress").hide();
                }}
        });
      
      });

    }, 
    j5Run: function()
    {

        if(deviceeditor._id==0)
        {
          $("#j5-info").html('Please first save your mode!');
          return false;
        }

        $("#j5-progress").show();
        $("#j5-info").html('');

        var execParams = this.execParams;
        var j5Params = this.j5Params;
        
        execParams["reuse_master_plasmids_file"] = $('#master-plasmids-list input[name="options1"]:checked').val();
        execParams["reuse_master_oligos_file"] = $('#master-oligos-list input[name="options2"]:checked').val();
        execParams["reuse_master_direct_syntheses_file"] = $('#master-direct-list input[name="options3"]:checked').val();

        execParams["assembly_method"] = $('#strong-ssembly-method option:selected').val()

        execParams["reuse_zipped_sequences_file"] = "FALSE";
        execParams["reuse_parts_list_file"] = "FALSE";
        execParams["reuse_target_part_order_list_file"] = "FALSE";
        execParams["reuse_eugene_rules_list_file"] = "FALSE";
        execParams["reuse_j5_parameters_file"] = "FALSE";
        execParams["reuse_sequences_list_file"] = "FALSE";
        execParams["j5_session_id"] = sessionID;

        execParams["master_plasmids_list_filename"] = "j5_plasmids.csv";
        execParams["master_oligos_list_filename"] = "j5_oligos.csv";
        execParams["master_direct_syntheses_list_filename"] = "j5_directsyntheses.csv";
      
        if(!execParams["encoded_master_oligos_file"]) execParams["encoded_master_oligos_file"] = "T2xpZ28gTmFtZSxMZW5ndGgsVG0sVG0gKDMnIG9ubHkpLFNlcXVlbmNlCg==";
        if(!execParams["encoded_master_direct_syntheses_file"]) execParams["encoded_master_direct_syntheses_file"] = "RGlyZWN0IFN5bnRoZXNpcyBOYW1lLEFsaWFzLENvbnRlbnRzLExlbmd0aCxTZXF1ZW5jZQo="; 
        if(!execParams["encoded_master_plasmids_file"]) execParams["encoded_master_plasmids_file"] = "UGxhc21pZCBOYW1lLEFsaWFzLENvbnRlbnRzLExlbmd0aCxTZXF1ZW5jZQo=";

        if(execParams["reuse_master_plasmids_file"]=="TRUE") execParams["encoded_master_plasmids_file"] = this.latest["encoded_master_plasmids_file"];
        if(execParams["reuse_master_oligos_file"]=="TRUE") execParams["encoded_master_oligos_file"] = this.latest["encoded_master_oligos_file"];
        if(execParams["reuse_master_direct_syntheses_file"]=="TRUE") execParams["encoded_master_direct_syntheses_file"] = this.latest["encoded_master_direct_syntheses_file"];

        $('#j5-params form input').each(function(key,val){
            j5Params[$(val).attr('name')] = $(val).attr('value');
            j5Params["OUTPUT_SEQUENCE_FORMAT"] = $('#j5-params form select[name="OUTPUT_SEQUENCE_FORMAT"]').val();
            j5Params["ASSEMBLY_PRODUCT_TYPE"] = "circular";
        });

        console.log("Executing j5");

        $.ajax({
            type: "POST",
            url: "/api/fullRPC",
            data: {
              '_id':j5._id,
              'j5Params':JSON.stringify(j5Params),
              'execParams':JSON.stringify(execParams)
            },
                success: function(data) {
                    Ext.getCmp('ProjectPanel').getStore().load();
                    
                    $("#download-zip").html('<button class="button" id="download-zip">Download ZIP</button>');
                    
                    $("#j5-output").html('');
                    $("#j5ResultsModal #j5-output").html('');

                    $(data["files"]).each(function(key,val){
                      var fileName = val["name"].replace('.gb','');
                      var newRow = $('<tr><td>'+fileName+'</td></tr>');
                      newRow.data('data',val["data"]);
                      newRow.data('size',val["size"]);
                      $("#j5-output").append(newRow);
                      $("#j5ResultsModal #j5-output").append(newRow);
                    });

                    $("#j5-results").show();

                    var zipFile = data["data"];
                    
                    $("#download-zip").one("click",function(){
                        location.href="data:application/zip;base64,"+zipFile;
                        return false;
                    });

                    $("#j5-output tr").bind("click",function(){
                        console.log("Opening plasmid");
                        var currentSequenceData = $(this).data('data');
                        var currentSequenceLength = $(this).data('size');

                        $('<form />')
                        .hide()
                        .attr({ method : "POST" })

                        .attr({ action : "http://eaa.teselagen.com/vectoreditor/outputDE"})
                        .attr({ target : "viewer" })
                        .append($('<input />')
                        .attr("type","hidden")
                        .attr({ "name" : "fileLength" }).val(currentSequenceLength)
                        )
                        .append($('<input />')
                        .attr("type","hidden")
                        .attr({ "name" : "fileData" }).val(escape(escape(currentSequenceData))))
                        .append('<input type="submit" />')
                        .appendTo($("body"))
                        .submit();

                        //Extra code for iFrame!
                        console.log($('iframe[name="viewer"]')[0].contentWindow);
                        //margin-top: -140px;
                        //margin-left: -30px;

                        
                    });

                    $("#j5-progress").hide();
                    $("#j5ResultsModal").modal();
                },
                statusCode: {
                500: function(data) {
                    $("#j5-info").html(data.responseText);
                    $("#j5-progress").hide();
                }}
        });
    }});

    function decodeModel(data)
    {
            var bins = data["de:design"]["de:j5Collection"]["de:j5Bins"]["de:j5Bin"];

            var partDepth = 0;
            deviceeditor.reset();
            deviceeditor.EnableCheckAvailability = false;

            deviceeditor.isCircular = String(data["de:design"]["de:j5Collection"]["de:isCircular"]).toLowerCase() == "true";

            $.each(bins,function(key,value){
                var newIcon = new Icon(key, deviceeditor);
                newIcon.data.name = value["de:binName"];
                newIcon.data.iconID = value["de:iconID"];
                newIcon.data.direction = value["de:direction"];
                newIcon.data.dsf = value["de:dsf"];
                newIcon.data.fro = value["de:fro"];
                newIcon.reRender();
                deviceeditor.iconsVector.push(newIcon);
                deviceeditor.iconsCounter++;

                var parts = value['de:binItems']["de:partID"];
                
                if(!$.isArray(parts))
                {
                    var temp = parts;
                    parts = [];
                    parts.push(temp);
                }

                var currentDepth = 0;
                $.each(parts,function(key,value){
                    var newPart = newIcon.addPart();
                    newPart.data.partID = value;
                    newPart.reRender();
                    currentDepth++;
                });
                if(currentDepth>partDepth) partDepth = currentDepth;
            });

            var partsVOs = data["de:design"]["de:partVOs"]["de:partVO"];

            var sequences = data["de:design"]["de:sequenceFiles"]["de:sequenceFile"];

            function findPartById(id,fn){
                $.each(deviceeditor.iconsVector,function(key,iconValue){
                    $.each(iconValue.partsVector,function(key,value){
                            if (value.data.partID.toString()==id.toString()) 
                            {
                                return fn(value);
                            }
                    });
                });
            }

            function findMapInSequencesByHash(hash)
            {
                var obj = {};
                $.each(sequences,function(key,value){
                    if (value.hash==hash) 
                    {
                        obj = value;
                    }
                });
                return obj;
            }

            // Load Eugene Rules
            var eugeneRules = data["de:design"]["de:eugeneRules"]["de:eugeneRule"];
            $(eugeneRules).each(function(key,val){
                deviceeditor.eugeneRules.push(val);
            });

            // Load Parts

            $.each(partsVOs,function(key,value){
                findPartById(value["de:parts"]["de:part"]["id"],function(part){
                    part.data.ID = value["id"];
                    part.data.map = findMapInSequencesByHash(value["de:sequenceFileHash"]);
                    part.data.name = value["de:name"];
                    part.data.fas = value["de:parts"]["de:part"]["de:fas"];
                    part.data.startBP = value["de:startBP"];
                    part.data.stopBP = value["de:stopBP"];  
                    part.data.revComp = value["de:revComp"];  
                    part.active = true;                  
                    part.reRender();
                });
            });

            //Complete blank parts in each bin
            $.each(deviceeditor.iconsVector,function(key,iconValue){
                var depth = iconValue.partsVector.length;
                for(var i=depth+1;i<=partDepth;i++)
                {
                    var part = iconValue.addPart();
                    part.reRender();
                }
            });

            deviceeditor.EnableCheckAvailability = true;
            deviceeditor.checkAvailability();
    }

    
        function loadModel(_id)
        {
          $.ajax({
          type: "POST",
          url: '/api/getUserModel',
          data: {'_id':_id},
          success: function(model) {
              deviceeditor._id = model["_id"];
              j5._id = model["_id"];
              console.log("Model ID: "+deviceeditor._id);
              decodeModel(model["payload"]);
              $('#design-name').val(model['name']);

              $('#created').html(parseTimeStamp(model['created']));
              $('#modified').html(parseTimeStamp(model['last_modified']));
               
              flashCallback("Design loaded!",true);
              $('#loadModel').modal('hide');
              }
          });
        }

    $(document).bind("openSelectedDesign", function(evt,_id) {
      loadModel(_id);
    });
       
    $(document).bind("openExampleDesign", function(evt,_id) {
          console.log("Trying to open example");
          $.ajax({
          type: "POST",
          url: '/api/getExampleModel',
          data: {'_id':_id},
          success: function(model) {
              deviceeditor._id = model["_id"];
              j5._id = model["_id"];
              decodeModel(model["payload"]);
              $('#design-name').val(model['name']);
              }
          });   
    });

    // Provides method to hide on clickOut oof selector
    function hideCallback(el,fn)
    {
        event.stopPropagation();
        $('body').one('click',function() {
        return fn(el);
        });
    }

    var Resources = Class.extend({
        init: function(){
          this.icons = $.parseJSON(iconsList);
          this.renderIcons();
        },
        renderIcons : function()
        {
            $.each(this.icons, function(key, val) {
            $('#icon-toolbar .js-elements').append('<a href="#" class="btn element" data="'+key+'"><i class="part '+val+'"/></a>');
            });
        }
    });

    var DeviceEditor = Class.extend({
        iconsVector: [],
        iconsCounter: 0,
        clipboard : {},
        EnableCheckAvailability : true,
        getIconPlaceholder : function(){ 
          return '<div class="direction"></div><div class="icon"></div><p class="name"></p>';
        },
        getPartPlaceholder : function(){
          return '<div class="lights_container"><div class="fas_light hide"></div><div class="eugene_light hide"></div></div><div class="name_container"><p class="name break-word"></p></div>';
        },
        init: function() {
            this._id = 0;
            this.isCircular = false;
            this.eugeneRules = [];
            $('#created').html('Just now');
            $('#modified').html('Never');
            $('table.icons').append('<tr></tr>');
            $('table.parts').append('<tr></tr>');
            this.bindUI();
            this.addCol();
        },
        reset: function(){
            this.isCircular = false;
            this.eugeneRules = [];
            $('#created').html('Just now');
            $('#modified').html('Never');
            $('#design-name').val('');
            this.iconsCounter = 0;
            this.iconsVector = [];
            $('table.icons').html('');
            $('table.parts').html('');
            $('table.icons').append('<tr></tr>');
            $('table.parts').append('<tr></tr>');
        },
        rmCol: function() {
            if($('table.icons.grid td.active').length>0)
            {
                var deletingIconCol = $('table.icons.grid td.active');
                var deletingColIndex = $('table.icons.grid td').index($('table.icons.grid td.active'));
            }
            else
            {
                var deletingIconCol = $('table.icons.grid td:last');
                var deletingColIndex = $('table.icons.grid td').index($('table.icons.grid td:last'));   
            }

            for(var i=deletingColIndex;i<this.iconsVector.length;i++)
            {
                this.iconsVector[i].index--;
            }

            deletingIconCol.data('key').remove();
            var deletingIcon = this.iconsVector.splice(deletingColIndex,1)[0];
            deletingIcon.remove();
            this.unrenderIcon(deletingColIndex);
            this.iconsCounter--;
            inspector.renderCollection();
        },
        addCol: function() {

            if($('table.icons.grid td.active').length>0)
            {
                var currentIconCol = $('table.icons.grid td.active');
                var currentColIndex = $('table.icons.grid td').index($('table.icons.grid td.active'))+1;
                console.log("Trying to add column");
            }
            else
            {
              var currentColIndex = $('table.icons.grid td').length;
            }

            if($('table.icons.grid td').length==0) currentColIndex = 0;

            var newIcon = new Icon(currentColIndex, this);
            this.iconsVector.splice(currentColIndex,0,newIcon);
            this.iconsCounter++;
            $('table.parts tr').each(function(key,value) {
                newIcon.addPart();
            });
            inspector.renderCollection();
        },
        renderIcon: function(index) {
              var self = this;
              var currentPosition = $('table.icons').find('td').eq(index-1);
              if(currentPosition.length>0)
              {
                $('<td>'+self.getIconPlaceholder()+'</td>').insertAfter(currentPosition);
              }
              else
              {
                $('table.icons tr').eq(0).append('<td>'+self.getIconPlaceholder()+'</td>');
              }

              $('table.parts tr').each(function(key, row) {
                if(index!=0)
                {
                  var currentPart = $(row).find('td').eq(index-1);
                  $('<td>'+self.getPartPlaceholder()+'</td>').insertAfter(currentPart);
                }
                else
                {
                  $(row).append('<td>'+self.getPartPlaceholder()+'</td>')
                }
              });
              return $('table.icons td').eq(index);
        },

        renderPart: function(icon, part) {
            var self = this;
            if ($('table.parts tr').length < part + 1) {
                $('table.parts').append('<tr></tr>');
                $(this.iconsVector).each(function(key, value) {
                    $('table.parts tr').last().append('<td>'+self.getPartPlaceholder()+'</td>');
                });
            }
            return $('table.parts tr').eq(part).find('td').eq(icon);
        },
        unrenderIcon: function(index) {
            $('table.icons td').eq(index).remove();
            $('table.parts tr').each(function(key, value) {
                $(value).find('td').eq(index).remove();
            });
        },
        addRow: function() {
            $(this.iconsVector).each(function(key, value) {
                value.addPart();
            });
        },
        checkAvailability: function(){
          if(this.iconsVector.length>0 && this.EnableCheckAvailability)
          {
            if($(this.iconsVector).last()[0]) if($(this.iconsVector).last()[0].active) this.addCol();
            var generateRow = false;
            $(this.iconsVector).each(function(key,icon){
              if($(icon.partsVector).last()[0]) if($(icon.partsVector).last()[0].active) generateRow = true;
            });
            if(generateRow) this.addRow();
          }
        },
        bindUI: function() {
            var _self = this;
            this.resources = new Resources();

            var currentScrollOffset = 50;

            $('.elements-scroll').bind('click',function(evt){
              var previousScrollOffset = 50;
              if($(evt.currentTarget).attr('data')=="left"&&currentScrollOffset>=50) currentScrollOffset-=50;
              else if(currentScrollOffset<=150){currentScrollOffset+=50;}
              if(currentScrollOffset!=previousScrollOffset)
              {
                previousScrollOffset = currentScrollOffset;
                $('.js-elements-container').animate({
                scrollLeft: currentScrollOffset
                }, 100);
              }
            });

            $("#genbankFile a").click(function(){
              $("#genbankFile").click()
            });

            $("btn#j5-run").click(function(){
                  j5.j5Run();    
            });

            $("#export-json-btn").click(function(){
                deviceeditor.encodeDesign(function(model){
                    var bb = new BlobBuilder;
                    var rawJSON = JSON.stringify(model);
                    bb.append(rawJSON);
                    saveAs(bb.getBlob("text/json;charset=utf-8"), "model.json");
                });
            });

            $("#export-xml-btn").click(function(){
                deviceeditor.encodeDesign(function(model){
                    var rawJSON = JSON.stringify(model);
                    console.log(rawJSON);
                    var bb = new BlobBuilder;
                    //bb.append(x2js.json2xml_str(rawJSON));
                    //saveAs(bb.getBlob("text/xml;charset=utf-8"), "model.xml");
                });
            });

            $("#importFileXML").bind("change",function(evt){
                _self.reset();
                var files = evt.target.files;
                if(files.length>0)
                {
                    var selectedFile = files[0];
                    var reader = new FileReader();
                    reader.onload = (function(file){
                        return function(e)
                            {
                                //a = xmlToJson(e.target.result);
                                //a = JSON.stringify(xmlToJson($.parseXML(e.target.result)));
                                a = $(xmlToJson($.parseXML(e.target.result)));
                            };
                    })(selectedFile);
                    
                    reader.readAsText(selectedFile);
                    
                }
            });

            $("#importFile").bind("change",function(evt){
                _self.reset();
                var files = evt.target.files;
                if(files.length>0)
                {
                    var selectedFile = files[0];
                    var reader = new FileReader();
                    reader.onload = (function(file){
                        return function(e)
                            {
                                decodeModel(jQuery.parseJSON(e.target.result));
                                deviceeditor._id = 0;
                                $('#design-name').val("Imported Model");
                                $('#created').html("");
                                $('#modified').html("");
                                 
                                inspector.hide();
                                flashCallback("Design loaded!",true);
                            };
                    })(selectedFile);
                    
                    reader.readAsText(selectedFile);
                    
                }
            });
            
            $("#edit-j5-params").click(function(e){
                e.preventDefault();
                $('#j5-tabs a[href="#j5-params"]').tab('show');
            });

            $("#edit-downstream-params").click(function(e){
                e.preventDefault();
                $('#j5-tabs a[href="#downstream-params"]').tab('show');
            });

            $('#j5-tabs a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
            })

            $('#j5-config').click(function(){
                $('#j5Modal').modal();
            });

            $(document).bind("openj5", function() {  
                $('#j5Modal').modal();
            }); 

            $('#newDesign').click(function(){
                _self.reset();
                deviceeditor._id = 0;
                deviceeditor.addCol();
            });
           
            $(document).bind("newDesign", function() {  
                _self.reset();
                deviceeditor._id = 0;
                deviceeditor.addCol();
            });  

            $('.option-item.save').click(function(){
                _self.saveDesign();
            });

            $(document).bind("saveDesign", function() {  
              console.log("Received save design");
                _self.saveDesign();
            }); 

            $("#map-from-clipboard-save").click(function(){
                var data = $("#map-from-clipboard-data").val();

                if (data=="") {$('#map-from-clipboard-error').html("Please paste data"); return false;}

                $("#map-from-clipboard").data('key').saveData(data);
                $("#map-from-clipboard-modal").modal('hide');
                return false;
            });

            $('#part-toolbar .cut').click(function(){
                deviceeditor.cutboard = $('#part-toolbar.arrow_box').data('key');
            });

            $('#part-toolbar .copy').click(function(){
                deviceeditor.clipboard = $('#part-toolbar.arrow_box').data('key');
            });

            $('#part-toolbar .delete').click(function(){
                $('#part-toolbar.arrow_box').data('key').remove();
            });

            $('#part-toolbar .paste').click(function(){
                if(deviceeditor.cutboard)
                {
                  $('#part-toolbar.arrow_box').data('key').paste(deviceeditor.cutboard);
                  deviceeditor.cutboard.remove();
                }
                else
                {
                  $('#part-toolbar.arrow_box').data('key').paste(deviceeditor.clipboard);
                }
            });

            $('#genbankFile').change(function(evt) {
                var files = evt.target.files;
                if(files.length>0)
                {
                    var selectedFile = files[0];
                    var reader = new FileReader();
                    reader.onload = (function(file){
                        return function(e)
                            {
                                $('#part-toolbar.arrow_box').data('key').saveData(e.target.result,file.name,file.type);
                            };
                        })(selectedFile);
                    
                    reader.readAsText(selectedFile);
                    
                }
            }); 

            $('#js-add-column').click(function() {
                _self.addCol();
            });
            $('#js-add-row').click(function() {
                _self.addRow();
            });

            $(".js-delete-part").click(function(){

            calledBy.html("");
            _self.hideToolBars();
            return false;

            });
        },
        hideToolBars : function()
        {
            var toolbar = $("#icon-toolbar");
            var elementsBar = $(".js-elements");
            toolbar.hide();
            elementsBar.hide();
        },
        encodeDesign : function(fn)
        {
            if ($('#design-name').val()=='') {flashCallback("Design must have a name",false);return false;}
            var rawJSON = {};
            rawJSON["de:design"] = {};
            rawJSON["de:design"]["de:j5Collection"] = {}
            rawJSON["de:design"]["de:j5Collection"]["de:isCircular"] = deviceeditor.isCircular;
            rawJSON["de:design"]["de:j5Collection"]["de:j5Bins"] = {};
            rawJSON["de:design"]["de:j5Collection"]["de:j5Bins"]["de:j5Bin"] = [];

            rawJSON["de:design"]["de:sequenceFiles"] = {};
            rawJSON["de:design"]["de:sequenceFiles"]["de:sequenceFile"] = [];

            var sequences = rawJSON["de:design"]["de:sequenceFiles"]["de:sequenceFile"];

            // For each bin (icon) in iconsVector (binsVector)
            for(var iconIndex in this.iconsVector)
            {
                if(this.iconsVector[iconIndex].active)
                {
                  var bin = {};
                  bin["de:binName"] = this.iconsVector[iconIndex].data.name;
                  bin["de:iconID"] = this.iconsVector[iconIndex].data.iconID;
                  bin["de:direction"] = this.iconsVector[iconIndex].data.direction;
                  bin["de:dsf"] = this.iconsVector[iconIndex].data.dsf;
                  bin["de:fro"] = this.iconsVector[iconIndex].data.fro;
                  bin["de:binItems"] = {};
                  bin["de:binItems"]["de:partID"] = [];
                  
                  for(var partIndex in this.iconsVector[iconIndex].partsVector)
                  {
                      var currentPart = this.iconsVector[iconIndex].partsVector[partIndex];
                      if(currentPart.active)
                      {
                          // Save the partID reference
                          bin["de:binItems"]["de:partID"].push(currentPart.data.partID);
                      }
                  }

                  rawJSON["de:design"]["de:j5Collection"]["de:j5Bins"]["de:j5Bin"].push(bin);
                }
            }

            rawJSON["de:design"]["de:partVOs"] = {};
            rawJSON["de:design"]["de:partVOs"]["de:partVO"] = [];
            
            var parts = rawJSON["de:design"]["de:partVOs"]["de:partVO"];

            // For each part (active)
            $.each(deviceeditor.iconsVector,function(key,iconValue){
                $.each(iconValue.partsVector,function(key,value){
                    if(value.active)
                    {
                        var newPart = {};
                        newPart["id"] = value.data.ID;
                        newPart["de:name"] = value.data.name;
                        newPart["de:revComp"] = value.data.revComp;
                        newPart["de:startBP"] = value.data.startBP;
                        newPart["de:stopBP"] = value.data.stopBP;
                        newPart["de:parts"] = {}; 
                        newPart["de:parts"]["de:part"] = {};
                        newPart["de:parts"]["de:part"]["id"]= value.data.partID;
                        newPart["de:parts"]["de:part"]["de:fas"]= value.data.fas;
                        newPart["de:sequenceFileHash"]= value.data.map.hash;
                        parts.push(newPart);

                        //Check if sequence exist, otherwise save it
                        var found = false;
                        $.each(sequences,function(key,sequence){
                          if(sequence["hash"]==value.data.map["hash"]) found = true;
                        });
                        if(found) console.log("Repeated sequence found");
                        if(!found) sequences.push(value.data.map);
                    }
                });
            });

            rawJSON["de:design"]["de:eugeneRules"] = {};
            rawJSON["de:design"]["de:eugeneRules"]["de:eugeneRule"] = [];
            var eugeneRules = rawJSON["de:design"]["de:eugeneRules"]["de:eugeneRule"];

            $.each(deviceeditor.eugeneRules,function(key,val){
                var newEugeneRule = {};
                newEugeneRule["de:name"] = val["de:name"];
                newEugeneRule["de:negationOperator"] = val["de:negationOperator"];
                newEugeneRule["de:operand1ID"] = val["de:operand1ID"];
                newEugeneRule["de:compositionalOperator"] = val["de:compositionalOperator"];
                newEugeneRule["de:operand2ID"] = val["de:operand2ID"];
                eugeneRules.push(newEugeneRule);
            });

            return fn(rawJSON);
        },
        saveDesign : function(cb)
        {

            var modelName = $('#design-name').val();
            console.log(modelName);
            if(modelName=="") alert("No design name defined");
            
            this.encodeDesign(function(model){
                $.ajax({
                    type: "POST",
                    url: '/api/saveUserModel',
                    data: {'_id':deviceeditor._id,'name':modelName,'payload':JSON.stringify(model)},
                        success: function(data) {
                            deviceeditor._id = data["_id"];
                            if(data["created"]) $('#created').html(parseTimeStamp(data['created']));
                            if(data["last_modified"]) $('#modified').html(parseTimeStamp(data['last_modified']));
                            Ext.getCmp('ProjectPanel').getStore().load();
                            if(cb) return cb();
                        },
                        statusCode: {
                        401: function(data) {
                            flashCallback(data.responseText,false);
                        }} 
                });

            });

        },
        findById : function(id,fn){
            $.each(deviceeditor.iconsVector,function(key,iconValue){
                $.each(iconValue.getActiveParts(),function(key,value){
                        if (value.data.ID.toString()==id.toString()) 
                        {
                            return fn(value);
                        }
                });
            });
        }
    });

    var Icon = Class.extend({
        partsCounter: 0,
        data : {},
        init: function(index, de) {
            this.index = index;
            this.partsVector = [];
            this.de = de;
            this.active = false;
            this.data = {'name':'','direction':'forward','fas':'false'};
            this.data.dsf ="false";
            this.data.fro = "";
            this.data.fiveex = "";
            this.data.threeex = "";

            this.dom = de.renderIcon(index);
            this.dom.data('key',this);

            $(this.dom).click(function(event){

                // Bind object with dom
                var obj = $(this).data('key');

                // Force render collection
                inspector.renderCollection();

                $('#icon-toolbar').show();
                $('#part-toolbar').hide();

                // Hide callback (Click outside)
                hideCallback(obj,function(el){
                    $(el.dom).removeClass('active');
                    //if(!$(".js-elements").is(':visible')) $("#icon-toolbar").hide();
                });

                $(".js-elements a.element").one("click", function(){
                $('#icon-toolbar.arrow_box').data('key').setIcon(this);
                //obj.de.hideToolBars();
                return false;
                });

                //hideCallback(this,function(el){$("#icon-toolbar").hide();});
                
                $(".js-elements i.part:first").closest('a').focus();
          
                $(".js-rotate").one("click",function(){
                  if (obj.data.direction=="forward") obj.data.direction = "reverse";
                  else obj.data.direction = "forward";
                  obj.reRender();
                });

                $(de.iconsVector).each(function(key,value){
                    value.dom.removeClass('active');
                    $(value.partsVector).each(function(key,value){
                        value.dom.removeClass('active');
                    });
                });

                $('#icon-toolbar.arrow_box').data('key',obj);
                //$('#icon-toolbar.arrow_box').css('position','absolute');
                //$('#icon-toolbar.arrow_box').css('margin-left',73+$(this).data('key').index*103+'px');
                //$('#icon-toolbar.arrow_box').css('margin-top','50px');
                $(this).addClass('active');
                $('#icon-toolbar.arrow_box').show();
            });           
        },
        getActiveParts : function(){
            var activeParts = [];
            $(this.partsVector).each(function(key,val){
                if(val.active) activeParts.push(val);
            });
            return activeParts;
        },
        setIcon : function(icon){
            this.data.iconID = $(icon).attr('data');
            this.dom.find('.icon-retweet').removeClass('hide');
            this.reRender();
        },
        reRender: function(){
            this.data.ico = this.de.resources.icons[this.data.iconID];
            if(this.data.iconID!=-1) this.active = true;
            this.dom.find('.icon').html('<i class="part '+this.data.ico+'"/>');
            this.dom.find('.name').html(this.data.name);
            if(this.data.iconID) this.dom.find('.icon-retweet').removeClass('hide');
            if(this.data.direction=="reverse") 
              {
                this.dom.find('i.part').css('-webkit-transform','rotate(180deg)');
                this.dom.find('.direction').html('<i class="icon-arrow-left"/>');
              }
            else 
              {
                this.dom.find('i.part').css('-webkit-transform','rotate(0deg)');
                this.dom.find('.direction').html('<i class="icon-arrow-right"/>');
              }
            this.de.checkAvailability();
        },
        addPart: function() {
            var newPart = new Part(this.index, this.partsCounter, this.de);
            this.partsVector.push(newPart);
            this.partsCounter++;
            return newPart;
        },
        getTag: function() {
            return 'Collection <'+this.index+'>';
        },
        remove: function() {
            this.dom.html('');
            $(this.partsVector).each(function(k,item){item.remove();});
        }
    });

    var Part = Class.extend({
        init: function(iconIndex, index, de) {
            this.iconIndex = iconIndex;
            this.index = index;
            this.de = de;
            this.data = {};
            this.active = false;
            this.eugeneRules = false;
            this.data.name = "";
            this.data.fas ="";
            this.data.partID = createUUID();
            this.data.ID = createUUID();
            this.dom = de.renderPart(this.iconIndex, this.index);
            this.dom.css('background','#ddd');
            this.dom.data('key',this);
            $(this.dom).click(function(){

                // Bind obj to dom
                var obj = $(this).data('key');

                // Force reRender
                obj.reRender();

                $('#icon-toolbar').hide();
                $('#part-toolbar').show();

                inspector.context(obj);
                
                hideCallback(obj,function(el){
                    $(el.dom).removeClass('active');
                    //$('#part-toolbar.arrow_box').hide();
                });
                
                $("#map-from-clipboard").one("click", function(event){
                    $("#map-from-clipboard").data('key',obj);
                    $("#map-from-clipboard-modal textarea").val('');
                    $("#map-from-clipboard-modal").modal();
                });

                $(de.iconsVector).each(function(key,value){
                    value.dom.removeClass('active');
                    $(value.partsVector).each(function(key,value){
                        value.dom.removeClass('active');
                    });
                });

                $('#part-toolbar.arrow_box').data('key',obj);
                //$('#part-toolbar.arrow_box').css('position','absolute');
                //$('#part-toolbar.arrow_box').css('margin-left',73+$(this).data('key').iconIndex*103+'px');
                //$('#part-toolbar.arrow_box').css('margin-top',(52+$(this).data('key').index*52)+'px');
                $('#part-toolbar.arrow_box').show();
                $(this).addClass('active');
            });
        },
        reRender : function()
        {
            var _self = this;
            var eugeneRuleFound = false;
            $(deviceeditor.eugeneRules).each(function(key,val){
                if(val["de:operand1ID"]==_self.data.ID.toString() || val["de:operand2ID"]==_self.data.ID.toString())
                {
                    eugeneRuleFound = true;
                }
            });
            if(eugeneRuleFound) this.dom.find('.eugene_light').show();
            
            if(this.data.fas!="") this.dom.find('.fas_light').show();
            else this.dom.find('.fas_light').hide();
            
            if(this.data.name!="") this.active = true;
            
            if(this.active)
            {
                this.dom.css('background','#fff');
                // Render part in a cell
                this.dom.find('.name').html('<small>'+this.data.name+'</small>');

                // Not mapped alert
                if(!this.data.map) this.dom.addClass('notMapped')
                else this.dom.removeClass('notMapped')
            }
            else
            {
              this.dom.css('background','#ddd');
            }
            this.de.checkAvailability();
        },
        saveData : function(data,filename,format) {

            var sequence = {};
            sequence["de:content"] = data;
            sequence["de:fileFormat"] = format || ""; 
            sequence["de:format"] = detectFormat(sequence);
            sequence["hash"] = MD5(data);
            sequence["de:fileName"] = filename || "undefined";
            sequence["de:length"] = sequenceLength(sequence);

            if (validateSequence(sequence))
            {                
                this.data.stopBP = sequence["de:length"];
                this.data.startBP = 1;
                this.data.revComp = false;
                this.data.sourceName = getSequenceSourceName(sequence);

                this.data.map = sequence;
                if(this.data.name=="") this.data.name = "Unnamed Part";
                this.reRender();
                flashCallback("Sequence successfully loaded",true);
                inspector.context(this);
            }
            else
            {
                flashCallback("Not a valid sequence",false);
            }

        },
        getTag : function()
        {
            return 'Part <'+this.index+'> of Collection <'+this.iconIndex+'>';
        },
        paste : function(originObj)
        {
            if(originObj.data.name) this.data.name = originObj.data.name+" (copy)";
            else this.data.name = "(copy)";
            this.data.map = originObj.data.map;
            this.reRender();
        },
        remove : function()
        {
            this.dom.html('');
            this.init(this.iconIndex,this.index,this.de);
        }
    });
    
    var Inspector = Class.extend({
        dom: $('#inspector'),
        body: $('#inspector .inspector-body'),
        init: function(){
            //this.dom.draggable();
            this.bindUI();
            $('#inspector .inspector-head').bind('click',function(){
                if(inspector.currentContext == undefined) $('#inspector-tabs li a[href*="#inspector-collection"]').tab("show");
            });
            var _self = this;
            $('#partName').bind('keyup',function(){
                _self.currentContext.data.name = $('#partName').val();
                _self.currentContext.reRender();
                return false;
            });
        },
        checkDisabled: function(){
              if(!inspector.currentContext)
              {
                $([$('#partName'),$('#change-part-def-button'),$('#part-fas'),$('.add-rule'),$('.edit-rules')]).each(function(k,v){v.attr('disabled','true');});
                $("#eugene").hide();
              }
              else
              {
                $([$('#partName'),$('#change-part-def-button'),$('#part-fas'),$('.add-rule'),$('.edit-rules')]).each(function(k,v){v.removeAttr('disabled');});
              }
        },
        context: function(contextObj){
            this.currentContext = contextObj;
            this.checkDisabled();
            $('#inspector-tabs li a[href*="#inspector-part"]').tab("show");

            $('#inspector .context').html(this.currentContext.getTag());
            $('#inspector input#partName').val(this.currentContext.data.name);
            var revComp = (this.currentContext.data.revComp ? "True" : "False");
            $('#inspector span#part-source').html(this.currentContext.data.sourceName);
            $('#inspector span#part-revComp').html(revComp);
            $('#inspector span#part-startBP').html(this.currentContext.data.startBP);
            $('#inspector span#part-stopBP').html(this.currentContext.data.stopBP);
            $('#part-fas').val(this.currentContext.data.fas);

            $('tbody#eugeneRules-table').html('');$('#eugene-rules-detail').html('');

            var eugeneRuleFound = false;
            $(deviceeditor.eugeneRules).each(function(key,val){
                if( val["de:operand1ID"]==inspector.currentContext.data.ID.toString() || val["de:operand2ID"]==inspector.currentContext.data.ID.toString() )
                {
                    eugeneRuleFound = true;
                    var name = val["de:name"];
                    var operand1 = inspector.currentContext.data.name;
                    var operator = val["de:compositionalOperator"];
                    
                    if( operator == "MORETHAN" || operator == "NOT MORETHAN" )
                    {
                      var operand2 = val["de:operand2ID"];
                      $('tbody#eugeneRules-table').append('<tr data-id="'+name+'"><td>'+name+'</td><td>'+operand1+'</td><td>'+operator+'</td><td>'+operand2+'</td></tr>');
                      $('#eugene-rules-detail').append('<tr data-id="'+name+'"><td>'+name+'</td><td>'+operand1+'</td><td>'+operator+'</td><td>'+operand2+'</td><td><i class="icon-trash"></i></td></tr>');
                    }
                    else
                    {
                      deviceeditor.findById(val["de:operand2ID"],function(operand2obj){
                          var operand2 = operand2obj.data.name;
                          $('tbody#eugeneRules-table').append('<tr data-id="'+name+'"><td>'+name+'</td><td>'+operand1+'</td><td>'+operator+'</td><td>'+operand2+'</td></tr>');
                          $('#eugene-rules-detail').append('<tr data-id="'+name+'"><td>'+name+'</td><td>'+operand1+'</td><td>'+operator+'</td><td>'+operand2+'</td><td><i class="icon-trash"></i></td></tr>');
                      });
                    }

                    var _self = this;
                    $('#eugene-rules-detail i.icon-trash').click(function(){
                        console.log("Trying to remove rule #");
                        var id = $(this).parent().parent().attr('data-id');
                        $(this).parent().parent().remove();

                        $(deviceeditor.eugeneRules).each(function(key,val){
                            if(val["de:name"]==id.toString())
                            {
                                deviceeditor.eugeneRules.splice(key,1);
                            }
                        });
                        inspector.context(inspector.currentContext);
                    });

                }
            });
            if(eugeneRuleFound)
                {
                    $("#eugene").show();
                    $("#eugene-info").html("Eugene rules for selected parts");
                    this.currentContext.reRender();
                }
            else
                {
                    $("#eugene").hide();
                    $("#eugene-info").html("No Eugene rules found for selected parts");                    
                }
            
        },
        renderCollection : function(){

            $('#inspector-tabs li a[href*="#inspector-collection"]').tab("show");
            if(deviceeditor)
                {
                if(deviceeditor.isCircular) $('input[name="isCircular"][value="true"]').attr('checked', true);
                else $('input[name="isCircular"][value="false"]').attr('checked', true);

                $("#collection-table").html("");
                $(deviceeditor.iconsVector).each(function(key,val){
                    var col_name = val.data.name;
                    var col_dir = val.data.direction;
                    var col_items = val.getActiveParts().length;
                    var col_fas = val.data.fas;
                    var col_dsf = val.data.dsf;
                    var col_fro = val.data.fro;
                    var col_fiveex = val.data.fiveex;
                    var col_threeex = val.data.threeex;

                    $("#collection-table").append('\
                      <tr data-id="'+key+'">\
                      <td><input class="input-small col_name" value="'+col_name+'""></input></td>\
                      <td>'+col_dir+'</td>\
                      <td>'+col_items+'</td>\
                      <td>'+col_fas+'</td>\
                      <td><input class="input-small col_dsf" value="'+col_dsf+'""></input></td>\
                      <td><input class="input-small col_fro" value="'+col_fro+'""></input></td>\
                      <td><input class="input-small col_fiveex" value="'+col_fiveex+'""></input></td>\
                      <td><input class="input-small col_threeex" value="'+col_threeex+'""></input></td>\
                      </tr>');
                });
                $("#collection-table input.col_name").bind("keyup",function(){
                    var id = $(this).parent().parent().attr('data-id');
                    var icon = deviceeditor.iconsVector[id];
                    icon.data.name = $(this).val();
                    icon.reRender();
                });

                $("#collection-table input.col_dsf").bind("keyup",function(){
                    var id = $(this).parent().parent().attr('data-id');
                    var icon = deviceeditor.iconsVector[id];
                    icon.data.dsf = $(this).val();
                });

                $("#collection-table input.col_fro").bind("keyup",function(){
                    var id = $(this).parent().parent().attr('data-id');
                    var icon = deviceeditor.iconsVector[id];
                    icon.data.fro = $(this).val();
                });

                $("#collection-table input.col_fiveex").bind("keyup",function(){
                    var id = $(this).parent().parent().attr('data-id');
                    var icon = deviceeditor.iconsVector[id];
                    icon.data.fiveex = $(this).val();
                });

                $("#collection-table input.col_threeex").bind("keyup",function(){
                    var id = $(this).parent().parent().attr('data-id');
                    var icon = deviceeditor.iconsVector[id];
                    icon.data.threeex = $(this).val();
                    console.log(icon);
                });

                $("#collection-table tr").bind("click",function(){
                    var id = $(this).attr('data-id');
                    var icon = deviceeditor.iconsVector[id];
                    var out = "";
                    for(var partIndex in icon.partsVector)
                    {
                        var part = icon.partsVector[partIndex];
                        if(part.active) out += part.data.name+" "+part.data.fas+"\n";
                    }
                    $("#inspector-collection textarea").val(out);
                });
            }
        },
        uncontext: function(){inspector.hide();},
        bindUI: function(){

            var _self = this;

            $('#part-definition-form .specified-sequence').bind('change',function(){
              if ( $('#part-definition-form .specified-sequence').val() == "Whole Sequence" )
              {
                var startBP = 1;
                var stopBP = _self.currentContext.data.map["de:length"];
                $('#part-definition-form .startBP.BPinputs').val(startBP);
                $('#part-definition-form .stopBP.BPinputs').val(stopBP);
                $('#part-definition-form .startBP.BPinputs').attr('disabled','disabled');
                $('#part-definition-form .stopBP.BPinputs').attr('disabled','disabled');
              }
            });

            $('#add-eugene-rule-form .operator').bind('change',function(){
              var operator =$(this).val();
              if( operator == "MORETHAN" || operator == "NOT MORETHAN" )
              {
                $('#add-eugene-rule-form select.operand2').hide();
                $('#add-eugene-rule-form input.operand2').show();
              }
              else
              {
                $('#add-eugene-rule-form select.operand2').show();
                $('#add-eugene-rule-form input.operand2').hide(); 
              }
            });

            $("#inspector-collection div.btn.rm-col").bind('click',function(){
                deviceeditor.rmCol();
            });
            
            $("#inspector-collection div.btn.add-col").bind('click',function(){
                deviceeditor.addCol();
            });

            $('input[name="isCircular"]').bind('change',function(evt){
              deviceeditor.isCircular = $(evt.currentTarget).val();
            });

            $('#inspector .btn.edit-rules').click(function(){
                $('#editEugeneRules').modal();
            });

            $('#inspector .btn.add-rule').click(function(){
                if(inspector.currentContext)
                {


                    // Clear name field
                    $('#eugeneRulesModal #add-eugene-rule-form .name').val('');

                    // Load current part as operand1
                    $('#eugeneRulesModal #add-eugene-rule-form .operand1').html(inspector.currentContext.data.name);

                    // Load parts as operand2
                    $('#eugeneRulesModal #add-eugene-rule-form .operand2').html("");

                    // Load parts for operand2
                    $(deviceeditor.iconsVector).each(function(key,icons){
                        $(icons.getActiveParts()).each(function(key,value){
                            $('#eugeneRulesModal #add-eugene-rule-form .operand2').append('<option value="'+value.data.ID+'">'+value.data.name+'</option>');
                        });
                    });

                    $('#eugeneRulesModal').modal();
                }
                return false;
            });

            $('#add-eugene-rule-form').submit(function(){
                var eugeneRule = {};
                eugeneRule["de:name"] = $('#eugeneRulesModal #add-eugene-rule-form .name').val();
                eugeneRule["de:operand1ID"] = inspector.currentContext.data.ID.toString();
                eugeneRule["de:compositionalOperator"] = $('#eugeneRulesModal #add-eugene-rule-form .operator').val();
                eugeneRule["de:operand2ID"] = $('#eugeneRulesModal #add-eugene-rule-form .operand2:visible').val();
                deviceeditor.eugeneRules.push(eugeneRule);
                $('#eugeneRulesModal').modal('hide');
                inspector.context(inspector.currentContext);
                $(deviceeditor.iconsVector).each(function(key,icon){
                  $(icon.getActiveParts()).each(function(key,part){
                    if( eugeneRule["de:operand1ID"]==part.data.ID.toString() || eugeneRule["de:operand2ID"]==part.data.ID.toString() )
                    { part.reRender(); }
                  });
                });
                return false;
            });

            $('#inspector-tabs li a[href*="#inspector-collection"]').on('shown', function (e) {
              inspector.renderCollection();
            })

            $('#inspector-tabs li a[href*="#inspector-part"]').on('shown', function (e) {
                inspector.checkDisabled();
            })

            $("#part-fas").bind("change",function(){
                if(inspector.currentContext)
                {
                    inspector.currentContext.data.fas = $(this).find("option:selected").val();
                    inspector.currentContext.reRender();
                }
            })

            $('#inspector-tabs').tabs();

            // Inspector Part definition Panel
            $('#change-part-def-button').click(function(){
                $('#part-toolbar').hide();
                var obj = inspector.currentContext;
                if(obj.data.map)
                {
                    $('#specifyPartDefinition-Modal .part-name').val(obj.data.name);
                    $('#specifyPartDefinition-Modal .part-data').val(obj.data.map["de:content"]);
                    $('#specifyPartDefinition-Modal .part-source').val(obj.data.sourceName);
                    $('#specifyPartDefinition-Modal .startBP').val(obj.data.startBP);
                    $('#specifyPartDefinition-Modal .stopBP').val(obj.data.stopBP);

                    $('#specifyPartDefinition-Modal .BPinputs').attr("max",parseInt(obj.data.map["de:length"]));
                    $('#specifyPartDefinition-Modal .BPinputs').attr("min",1);

                    var revComp = (obj.data.revComp) ? true : false;
                    {$('#specifyPartDefinition-Modal .reverse').attr("checked",revComp);}

                    if(parseInt(obj.data.stopBP)-parseInt(obj.data.startBP)+1<parseInt(obj.data.map["de:length"]))
                    {
                        $('#specifyPartDefinition-Modal .BPinputs').attr("disabled",false);
                        $('#specifyPartDefinition-Modal .specified-sequence').val("Specified Sequence");
                    }
                    else
                    {
                        $('#specifyPartDefinition-Modal .BPinputs').attr("disabled",'disabled');  
                        $('#specifyPartDefinition-Modal .specified-sequence').val("Whole Sequence");
                    }      
                    
                    $('#specifyPartDefinition-Modal').modal();
                }
                else
                {
                    flashCallback("Part not mapped",false);
                }
                return false;
            });

            $('#specifyPartDefinition-Modal select.specified-sequence').bind("change",function(){
                if($(this).find("option:selected").val()=="Specified Sequence")
                {
                    $(this).find("option:selected").val()
                    $('#specifyPartDefinition-Modal .startBP').attr("disabled",false);
                    $('#specifyPartDefinition-Modal .stopBP').attr("disabled",false);
                }
            });

            // Part Definition form Handler
            $('#part-definition-form').submit(function(){
                var obj = inspector.currentContext;
                obj.data.name = $('#specifyPartDefinition-Modal .part-name').val();
                obj.data.map["de:content"] = $('#specifyPartDefinition-Modal .part-data').val();
                obj.data.sourceName = $('#specifyPartDefinition-Modal .part-source').val();
                obj.data.startBP = $('#specifyPartDefinition-Modal .startBP').val();
                obj.data.stopBP = $('#specifyPartDefinition-Modal .stopBP').val();
                obj.data.revComp = $('#specifyPartDefinition-Modal .reverse').attr("checked");

                $("#specifyPartDefinition-Modal").modal("hide");
                inspector.context(obj);
                inspector.renderCollection();
                return false;
            });
            
        }
    });

    var inspector = new Inspector();
    var deviceeditor = new DeviceEditor();
    var j5 = new J5();
  });

});