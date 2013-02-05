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

  parseJSON: function(input,fileName){
    console.log("Parsing JSON file");
    jsonDoc = JSON.parse(input);

    function getSequenceByHash(targetHash,cb){
      var sequences = jsonDoc["de:design"]["de:sequenceFiles"]["de:sequenceFile"];
      sequences.forEach(function(sequence){
        if(String(sequence["hash"]) == String(targetHash)) cb(sequence);
      });
    };

    function getPartByID(targetId,cb){
      var parts = jsonDoc["de:design"]["de:partVOs"]["de:partVO"];
      parts.forEach(function(part){
        if(String(part["de:parts"]["de:part"]["id"]) == String(targetId))
        {
          getSequenceByHash(part["de:sequenceFileHash"],function(sequence){
            part.sequence = sequence;
            cb(part);
          });
        }
      });
    };

    function finishedResolving(){
      var design = Teselagen.manager.DeviceDesignManager.createDeviceDesignFromBins(binsArray);
      var deproject = Ext.getCmp('mainAppPanel').getActiveTab().model;
      var deprojectId = Ext.getCmp('mainAppPanel').getActiveTab().modelId;
      deproject.setDesign(design);
      design.set( 'deproject_id', deprojectId);
      deproject.set( 'id' , deprojectId );
      
      //Ext.getCmp('mainAppPanel').getActiveTab().setTitle(fileName.replace(/.json/g));
      Vede.application.fireEvent("ReRenderDECanvas");
      Vede.application.fireEvent("checkj5Ready");
    };

    /*
    deproject = Ext.create("Teselagen.models.DeviceEditorProject", {
        name: fileName.replace(/.json/g,''),
        dateCreated: new Date(),
        dateModified: new Date()
    });
    */

    var sequences = [];

    // Bins Processing
    bins = jsonDoc["de:design"]["de:j5Collection"]["de:j5Bins"]["de:j5Bin"];
    var binsArray = [];

    var binsCounter = bins.length;

    for(var indexBin in bins){
      var bin = bins[indexBin];

      var newBin = Ext.create("Teselagen.models.J5Bin", {
          binName: bin["de:binName"],
          iconID: bin["de:iconID"],
          directionForward: (bin["de:direction"] == "forward"),
          dsf: Boolean(bin["de:dsf"])
      });
      var parts = bin["de:binItems"]["de:partID"];
      //console.log(parts);
      var partsCounter = parts.length;
      //console.log("PartsCounter: "+partsCounter);

      var tempPartsArray = [];
      for(var indexPart in parts){
        //console.log(parts[indexPart]);
        getPartByID(parts[indexPart],function(part){
          var newPart = Ext.create("Teselagen.models.Part", {
              name: part["de:name"],
              genbankStartBP: part["de:startBP"],
              endBP: part["de:stopBP"],
              revComp: part["de:revComp"],
              fas: (part["de:parts"]["de:part"]["de:fas"]=='') ? 'None' : part["de:parts"]["de:part"]["de:fas"]
          });

          var newSequence = Ext.create("Teselagen.models.SequenceFile", {
            sequenceFileContent : part.sequence["de:content"],
            sequenceFileFormat : part.sequence["de:format"],
            sequenceFileName : part.sequence["pj5_00001.gb"]
          });

          newPart.setSequenceFileModel(newSequence);

          tempPartsArray.push(newPart);

          //console.log(newPart);

          //console.log("Parts: "+partsCounter);
          //console.log("Bins: "+binsCounter);
          partsCounter--;
          if(partsCounter == 0)
          {
            newBin.addToParts(tempPartsArray);
            binsArray.push(newBin);
            
            binsCounter--;

            if(binsCounter == 0)
            {
              finishedResolving();
            }            
          } 
        });
      }
    }

    // Sequences processing

  },

  parseXML : function(input,fileName){

    console.log("Parsing XML file");

    parser=new DOMParser();
    xmlDoc=parser.parseFromString(input,"text/xml");

    function getPartByID(targetId){
      var parts = xmlDoc.getElementsByTagNameNS('*','partVO');
      for(var indexPart in parts){
        if(!parts[indexPart].nodeName) continue;
        var part = parts[indexPart];
        var id = part.getElementsByTagNameNS('*','part')[0].attributes[0].value;
        if(id == targetId) return part;
      }
    };


    deproject = Ext.create("Teselagen.models.DeviceEditorProject", {
        name: fileName.replace(/.xml/g,''),
        dateCreated: new Date(),
        dateModified: new Date()
    });

    var binsArray = [];

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
        var newPart = Ext.create("Teselagen.models.Part", {
            name: part.getElementsByTagNameNS('*','name')[0].textContent,
            genbankStartBP: 1,
            endBP: 7
        });
        tempPartsArray.push(newPart)
      }
      newBin.addToParts(tempPartsArray);
      binsArray.push(newBin);
    }

    var design = Teselagen.manager.DeviceDesignManager.createDeviceDesignFromBins(binsArray);
    deproject.setDesign(design);
    Teselagen.manager.ProjectManager.workingProject.deprojects().add(deproject);
    Teselagen.manager.ProjectManager.loadDesignAndChildResources();
    Teselagen.manager.ProjectManager.openDEProject(deproject);

  }

});