Ext.define("Teselagen.manager.RowManager", {
    requires: ["Teselagen.models.sequence.Row",
               "Teselagen.models.sequence.RowData"],

    config: {
        sequenceAnnotator: null,

        rows: [],
        featureToRowMap: null,
        cutSiteToRowMap: null,
        orfToRowMap: null,
        showORFs: false,
        numRows: 10
    },

    constructor: function(inData){
        this.initConfig(inData);
        this.sequenceAnnotator = inData.sequenceAnnotator;
        //console.log(this.sequenceAnnotator.getSequenceManager().getSequence().seqString());
    },

    update: function(){
        this.rows = [];

        if(this.sequenceAnnotator.getSequenceManager()) {
            var seqString = this.sequenceAnnotator.getSequenceManager().getSequence().seqString().toUpperCase();
            this.numRows = Number(Math.ceil(((seqString.length + 1) / this.sequenceAnnotator.getBpPerRow())));

            var complementSeqString = this.sequenceAnnotator.getSequenceManager().getComplementSequence().seqString().toUpperCase();

            for(var i = 0; i < this.numRows; i++) {
                var start = i * this.sequenceAnnotator.getBpPerRow();
                var end = (i + 1) * this.sequenceAnnotator.getBpPerRow() - 1;

                var sequence = seqString.substring(start, end + 1);
                var oppositeSequence = complementSeqString.substring(start, end + 1);

                var rowData = Ext.create("Teselagen.models.sequence.RowData", {
                        start: start,
                        end: end,
                        sequence: sequence,
                        oppositeSequence: oppositeSequence
                });

                //console.log("Row Data: \n Start: " + (start + 1) + " End: " + (end + 1)+ "\n Sequence Length: " + sequence.length);
                var row = Ext.create("Teselagen.models.sequence.Row", {
                    index: i,
                    rowData: rowData
                });
                //console.log(row.getRowData().getSequence());
                this.rows.push(row);
            }

               this.reloadFeatures();
               this.reloadORFs();
               this.reloadCutSites();
        }
    },

    reloadFeatures: function(){
        if (!this.sequenceAnnotator.getSequenceManager().getFeatures()) {
            return;
        }

        var features = this.sequenceAnnotator.getSequenceManager().getFeatures();
        var rowsFeatures = this.rowAnnotations(features);
        this.featureToRowMap = Ext.create("Ext.util.HashMap");
        var start;
        var end;
        var row;
        var feature;
        var featuresAlignment;

        for(var i = 0; i < rowsFeatures.length; i++) {
            row = rowsFeatures[i];
            start = i * this.sequenceAnnotator.getBpPerRow();
            end = (i+1) * this.sequenceAnnotator.getBpPerRow();
            featuresAlignment  = Teselagen.renderer.common.Alignment.buildAlignmentMap(row, this.sequenceAnnotator.getSequenceManager());

            this.rows[i].getRowData().setFeaturesAlignment(featuresAlignment.clone());

            if(!row){
                return true;
            }

            for(var j = 0; j < row.length; j++) {
                feature = row[j];
                if(!this.featureToRowMap.get(feature.getIndex())){
                    this.featureToRowMap.add(feature.getIndex(), []);
                }

                this.featureToRowMap.get(feature.getIndex()).push(i);
            }
        }
        /*//console.log("Feature to row Map: " + this.featureToRowMap.getKeys());

        for (var k = 0; k < this.sequenceAnnotator.getSequenceManager().getFeatures().length; k++){
            var feature = this.sequenceAnnotator.getSequenceManager().getFeatures()[k];
            //console.log("Retrieved feature name: " + feature.getName());
            this.featureToRowMap[feature.getName()] = null;
        }

        for (var i = 0; i < this.numRows; i++){
            var start = i * this.sequenceAnnotator.getBpPerRow();
            var end = (i + 1) * this.sequenceAnnotator.getBpPerRow() - 1;

            //console.log(rowsFeatures[i])
            var featuresAlignment = Teselagen.renderer.common.Alignment.buildAlignmentMap(rowsFeatures[i], this.sequenceAnnotator.getSequenceManager());
            //console.log(this.rows[i].getRowData().getFeaturesAlignment());
            this.rows[i].getRowData().setFeaturesAlignment(featuresAlignment.clone());
            //console.log(this.rows[i].getRowData().getFeaturesAlignment());
            /*console.log("# Rows in featuresAlignment: " + featuresAlignment.getValues());
            console.log("# Rows in this.rows[i]: " + this.rows[i].getRowData().getFeaturesAlignment().getValues());
            console.log("Row start #: " + start);
            console.log("Row end #: " + end);
            var rowOwnedFeatures = rowsFeatures[i];

            if (rowOwnedFeatures == null){ continue; }

            for (var j = 0; j < rowOwnedFeatures.length; j++){
                var rowFeature = rowOwnedFeatures[j];

               // console.log("Row feature name: " + rowFeature.getName());
                if(!this.featureToRowMap[rowFeature.getName()]){
                    this.featureToRowMap[rowFeature.getName()] = [];
                }

                this.featureToRowMap[rowFeature.getName()].push(i);
            }
        }*/
    },

    reloadCutSites: function(){
        if(!this.sequenceAnnotator.showCutSites ||
           !this.sequenceAnnotator.restrictionEnzymeManager ||
           !this.sequenceAnnotator.restrictionEnzymeManager.getCutSites()) {
            return;
        }

        var cutSites = this.sequenceAnnotator.restrictionEnzymeManager.getCutSites();
        var rowsCutSites = this.rowAnnotations(cutSites);
        this.cutSiteToRowMap = Ext.create("Ext.util.HashMap");
        var start;
        var end;
        var cutSitesAlignment;

        Ext.each(rowsCutSites, function(row, i) {
            start = i * this.sequenceAnnotator.getBpPerRow();
            end = (i + 1) * this.sequenceAnnotator.getBpPerRow();

            cutSitesAlignment = Teselagen.renderer.common.Alignment.buildAlignmentMap(
                                    row,
                                    this.sequenceAnnotator.getSequenceManager());
            this.rows[i].getRowData().setCutSitesAlignment(cutSitesAlignment.clone());

            if(!row) {
                return true;
            }

            Ext.each(row, function(site) {
                if(!this.cutSiteToRowMap.get(site)) {
                    this.cutSiteToRowMap.add(site,[]);
                }

                this.cutSiteToRowMap.get(site).push(i);
            }, this);
        }, this);
    },

    reloadORFs: function() {
        if(!this.sequenceAnnotator.showOrfs ||
           !this.sequenceAnnotator.orfManager ||
           !this.sequenceAnnotator.orfManager.getOrfs()) {
            return;
        }

        this.orfToRowMap = Ext.create("Ext.util.HashMap");

        var orfs = this.sequenceAnnotator.orfManager.getOrfs();
        var rowsOrfs = this.rowAnnotations(orfs);
        var start;
        var end;
        var orfAlignment;

        Ext.each(rowsOrfs, function(row, i) {
            start = i * this.sequenceAnnotator.getBpPerRow();
            end = (i + 1) * this.sequenceAnnotator.getBpPerRow();

            orfAlignment = Teselagen.renderer.common.Alignment.buildAlignmentMap(
                                    row,
                                    this.sequenceAnnotator.getSequenceManager());
            this.rows[i].getRowData().setOrfAlignment(orfAlignment.clone());

            if(!row) {
                return true;
            }

            Ext.each(row, function(orf) {
                if(!this.orfToRowMap.get(orf.toString())) {
                    this.orfToRowMap.add(orf,[]);
                }

                this.orfToRowMap.get(orf.toString()).push(i);
            }, this);
        }, this);
    },

    rowAnnotations: function(pAnnotations){
        var rows = [];
        //console.log(this.sequenceAnnotator.getSequenceManager().getSequence().seqString().length);

        var numRows = Math.ceil((this.sequenceAnnotator.getSequenceManager().getSequence().seqString().length / this.sequenceAnnotator.getBpPerRow()));
        //console.log("rowAnnotations, numRows: " + numRows);

        if (pAnnotations != null){
            for (var j = 0; j < numRows; j++){
                rows.push([]);
            }

            var numberOfItems = pAnnotations.length;
            for (var i = 0; i < numberOfItems; ++i){
                var annotation = pAnnotations[i];

                var itemStart = annotation.getStart();
                var itemEnd = annotation.getEnd();

                if(annotation instanceof Teselagen.bio.enzymes.RestrictionCutSite) {
                    itemEnd -= 1;
                }

                this.pushInRow(itemStart, itemEnd, annotation, rows);
            }
        }
        //console.log("Row annotations: " + rows);
        return rows;
    },

    pushInRow: function(pItemStart, pItemEnd, pAnnotation, pRows){
        var bpPerRow = this.sequenceAnnotator.getBpPerRow();
        var seqLength = this.sequenceAnnotator.sequenceManager.getSequence().toString().length;

        pItemEnd = Math.min(pItemEnd, seqLength - 1);

        if (pItemStart > pItemEnd){
            var rowStartIndex = Math.floor(pItemStart/bpPerRow);
            var rowEndIndex = Math.floor((seqLength - 1)/bpPerRow);

            var rowStartIndex2 = 0;
            var rowEndIndex2 = Math.floor(pItemEnd/bpPerRow);

            for (var z1 = rowStartIndex; z1 < rowEndIndex + 1; z1++){
                pRows[z1].push(pAnnotation);
            }
            for (var z2 = rowStartIndex2; z2 < rowEndIndex2 + 1; z2++){
                pRows[z2].push(pAnnotation);
            }
        } else {
            var rowStartIndex = Math.floor(pItemStart/bpPerRow);
            var rowEndIndex = Math.floor((pItemEnd - 1)/bpPerRow);

            for (var z = rowStartIndex; z < rowEndIndex + 1; z++){
                pRows[z].push(pAnnotation);
            }
        }

        return pRows;
    }



});

