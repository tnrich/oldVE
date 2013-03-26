/**
 * Parses the DeviceDesign JSON or XML.
 * @class Teselagen.manager.DeviceDesignParsersManager
 * @author Rodrigo Pavez
 **/

Ext.define("Teselagen.manager.DeviceDesignParsersManager", {
  alias: "DeviceDesignParsersManager",
  singleton: true,
  requires: ["Teselagen.manager.DeviceDesignManager"],
  mixins: {
    observable: "Ext.util.Observable"
  },

  generateDesign: function(binsArray,eugeneRules){

    Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();

    function loadDesign(btn){
      if(btn==="ok")
      {
        var design = Teselagen.manager.DeviceDesignManager.createDeviceDesignFromBins(binsArray);
        var deproject = Ext.getCmp('mainAppPanel').getActiveTab().model;
        var deprojectId = Ext.getCmp('mainAppPanel').getActiveTab().modelId;
        deproject.setDesign(design);
        design.set( 'deproject_id', deprojectId);
        deproject.set( 'id' , deprojectId );

        Vede.application.fireEvent("ReRenderDECanvas");
        Vede.application.fireEvent("checkj5Ready");

        // Load the Eugene Rules in the Design
        for(var ruleIndex in eugeneRules)
        {
          design.addToRules(eugeneRules[ruleIndex]);
        }

      }
    }

      Ext.Msg.show({
        title:'Are you sure you want to load example?',
        msg: 'WARNING: This will clear the current design. Any unsaved changes will be lost.',
        buttons: Ext.Msg.OKCANCEL,
        cls: 'messageBox',
        fn: loadDesign,
        icon: Ext.Msg.QUESTION
      });

  },

  parseJSON: function(input,fileName){
    console.log("Parsing JSON file");
    jsonDoc = JSON.parse(input);
    bins = jsonDoc["de:design"]["de:j5Collection"]["de:j5Bins"]["de:j5Bin"];
    sequences = jsonDoc["de:design"]["de:sequenceFiles"]["de:sequenceFile"];
    var binsArray = [];
    var fullPartsAssocArray = {};
    var binsCounter = bins.length;

    var self = this;

    function getSequenceByHash(targetHash,cb){
      // Find sequence by hash
      sequences.forEach(function(sequence){
        if(String(sequence["hash"]) == String(targetHash)) cb(sequence);
      });
    };

    function getPartByID(targetId,cb){
      // Return part associated to bin finding by id (internal)
      var parts = jsonDoc["de:design"]["de:partVOs"]["de:partVO"];
      parts.forEach(function(part){
        if(String(part["de:parts"]["de:part"]["id"]) == String(targetId))
        {
          getSequenceByHash(part["de:sequenceFileHash"],function(sequence){
            part.sequence = sequence;
            cb(part);
          });
        }
        else if( part["de:parts"]["de:part"] instanceof Array)
        {
          // Cover the special cases in which some structures parts are inside subnodes that are array
          if(String(part["de:parts"]["de:part"][0]["id"]) == String(targetId))
          {
            getSequenceByHash(part["de:sequenceFileHash"],function(sequence){
              part.sequence = sequence;
              cb(part);
            });
          }
        }
      });
    };


    // Bins Processing
    for(var indexBin in bins){
      bin = bins[indexBin];

      newBin = Ext.create("Teselagen.models.J5Bin", {
          binName: bin["de:binName"],
          iconID: bin["de:iconID"],
          directionForward: (bin["de:direction"] == "forward"),
          dsf: Boolean(bin["de:dsf"])
      });

      parts = bin["de:binItems"]["de:partID"];

      if(typeof(parts) === "number")
      {
        // Cover special cases in which parts are inside sub array
        parts = [];
        itemsObj = bin["de:binItems"];
        for(var prop in itemsObj) {
          parts.push(itemsObj[prop]);
        }
      }

      partsCounter = parts.length;

      tempPartsArray = [];
      for(var indexPart in parts){
        getPartByID(parts[indexPart],function(part){

          // Part processing
          newPart = Ext.create("Teselagen.models.Part", {
              name: part["de:name"],
              partSource: part["de:partSource"],
              genbankStartBP: part["de:startBP"],
              endBP: part["de:stopBP"],
              revComp: part["de:revComp"],
              fas: (part["de:parts"]["de:part"]["de:fas"]==='') ? 'None' : part["de:parts"]["de:part"]["de:fas"]
          });

          // Sequence processing
          newSequence = Ext.create("Teselagen.models.SequenceFile", {
            sequenceFileContent : part.sequence["de:content"],
            sequenceFileFormat : part.sequence["de:format"],
            sequenceFileName : part.sequence["pj5_00001.gb"]
          });

          newPart.setSequenceFileModel(newSequence);

          tempPartsArray.push(newPart);
          fullPartsAssocArray[part["id"]] = newPart;

          partsCounter--;
          if(partsCounter === 0)
          {
            newBin.addToParts(tempPartsArray);
            binsArray.push(newBin);

            binsCounter--;

            if(binsCounter === 0)
            {

              //Process Eugene Rules
              eugeneRules = jsonDoc["de:design"]["de:eugeneRules"];
              rulesArray = [];

              if(eugeneRules["eugeneRule"] instanceof Array)
              {
                // Fix special cases where empty object is create to designate no eugeneRules
                if(eugeneRules["eugeneRule"].length === 0) eugeneRules = [];
              }

              for(var ruleIndex in eugeneRules)
              {
                rule = eugeneRules[ruleIndex];
                operand1 = rule["de:operand1ID"];
                operand2 = rule["de:operand2ID"];

                newEugeneRule = Ext.create("Teselagen.models.EugeneRule", {
                    name: rule["de:name"],
                    compositionalOperator: rule["de:compositionalOperator"],
                    negationOperator: rule["de:negationOperator"]
                });

                newEugeneRule.setOperand1(fullPartsAssocArray[operand1]);
                newEugeneRule.setOperand2(fullPartsAssocArray[operand2]);
                rulesArray.push(newEugeneRule);
              }
              Teselagen.manager.DeviceDesignParsersManager.generateDesign(binsArray,rulesArray);
            }
          }
        });
      }
    }
  },


  parseXML : function(input,fileName){

    console.log("Parsing XML file");
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(input,"text/xml");

    function getPartByID(targetId){
      var parts = xmlDoc.getElementsByTagNameNS('*','partVO');
      for(var indexPart in parts){
        if(!parts[indexPart].nodeName) continue;
        var part = parts[indexPart];
        var id = part.getElementsByTagNameNS('*','part')[0].attributes[0].value;
        if(id == targetId) return part;
      }
    }


    deproject = Ext.create("Teselagen.models.DeviceEditorProject", {
        name: fileName.replace(/.xml/g,''),
        dateCreated: new Date(),
        dateModified: new Date()
    });

    var binsArray = [];
    var fullPartsAssocArray = {};

    var circular = Boolean(xmlDoc.getElementsByTagNameNS('*','isCircular')[0].textContent);

    var bins = xmlDoc.getElementsByTagNameNS('*','j5Bins')[0].getElementsByTagNameNS('*','j5Bin');

    for(var indexBin in bins){
      if(!bins[indexBin].nodeName) continue;
      var bin = bins[indexBin];
      //console.log(bin);
      var binName = bin.getElementsByTagNameNS('*','binName')[0].textContent;
      var iconID = bin.getElementsByTagNameNS('*','iconID')[0].textContent;
      var direction = bin.getElementsByTagNameNS('*','direction')[0].textContent;
      var dsf = bin.getElementsByTagNameNS('*','dsf')[0].textContent;

      var newBin = Ext.create("Teselagen.models.J5Bin", {
          binName: binName
      });

      var parts = bin.getElementsByTagNameNS('*','partID');

      var tempPartsArray = [];
      for(var indexPart in parts){
        if(!parts[indexPart].nodeName) continue;
        var part = getPartByID(parts[indexPart].textContent);
        fas = part.getElementsByTagNameNS('*','parts')[0].getElementsByTagNameNS('*','part')[0].getElementsByTagNameNS('*','fas')[0].textContent;
        var newPart = Ext.create("Teselagen.models.Part", {
            name: part.getElementsByTagNameNS('*','name')[0].textContent,
            genbankStartBP: part.getElementsByTagNameNS('*','startBP')[0].textContent,
            endBP: part.getElementsByTagNameNS('*','stopBP')[0].textContent,
            revComp: part.getElementsByTagNameNS('*','revComp')[0].textContent,
            fas: (fas==='') ? 'None' : fas
        });

        tempPartsArray.push(newPart);
        fullPartsAssocArray[part.getAttribute("id")] = newPart;
      }
      newBin.addToParts(tempPartsArray);
      binsArray.push(newBin);
    }

    eugeneRules = xmlDoc.getElementsByTagNameNS('*','eugeneRules')[0].getElementsByTagNameNS('*','eugeneRule');
    rulesArray = [];

    for(var indexRule in eugeneRules){
      rule = eugeneRules[indexRule];
      if (typeof(rule)!="object") continue;
      operand1 = rule.getElementsByTagNameNS('*','operand1ID')[0].textContent;
      operand2 = rule.getElementsByTagNameNS('*','operand2ID')[0].textContent;

      newEugeneRule = Ext.create("Teselagen.models.EugeneRule", {
          name: rule.getElementsByTagNameNS('*','name')[0].textContent,
          compositionalOperator: rule.getElementsByTagNameNS('*','compositionalOperator')[0].textContent,
          negationOperator: rule.getElementsByTagNameNS('*','negationOperator')[0].textContent
      });

      newEugeneRule.setOperand1(fullPartsAssocArray[operand1]);
      newEugeneRule.setOperand2(fullPartsAssocArray[operand2]);
      rulesArray.push(newEugeneRule);

    }

    Teselagen.manager.DeviceDesignParsersManager.generateDesign(binsArray,rulesArray);
  }

});