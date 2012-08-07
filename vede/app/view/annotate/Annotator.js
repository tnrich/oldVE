Ext.define("Vede.view.annotate.Annotator", {
    extend: "Ext.draw.Component",
    alias: "widget.annotator",

    autoScroll: true,
    config: {
        sequenceAnnotator: null,
        sequenceSVG: null,
    },
    id: null,
    annotateSVG: null,
    panel: null,
    dirty: false,
    featureRows: 3,
    constructor: function(inData){
        this.initConfig(inData);
        this.callParent([inData]);
        this.id = "AnnotationSurface";
        console.log("Created Annotator");
        this.sequenceAnnotator = inData.sequenceAnnotator;

        this.panel = Ext.getCmp('AnnotatePanel-body');
        //this.lineRenderer = Ext.create("Teselagen.renderer.annotation.LineRender", {});
        this.annotateSVG = d3.select("#AnnotatePanel-body")
            .append("svg:svg");
        
        this.lines = this.annotateSVG.append("svg:g")
            .attr("id", "annotationViz");

        this.sequenceSVG = this.annotateSVG.append("svg:g")
            .attr("id", "sequenceSVG");

    },
    
    sequenceChanged: function(){
    },

    render: function(){
//        this.clean();
        this.panel = Ext.getCmp('AnnotatePanel');
        var xMax = this.panel.getBox().width;
        var yMax = this.panel.getBox().height;


        console.log(this.lines); 
        var x1 = 10;
        console.log(yMax);
        var y = 20;
        for ( var i = 0; i < this.sequenceAnnotator.getRowManager().getRows().length; ++i){
            this.renderSequence(i, 10, y + 25);
            this.renderLine(x1, y, xMax, y);
            y += (20 * 3 * 1.5);
        };

        this.annotateSVG.attr("height", y);
        console.log(this.lines.length);
        
        console.log("rendered annotator");
            //line renderer
                //text render
            //amino acid renderer
    },

    renderSequence: function(index, x, y){
        var row = this.sequenceAnnotator.getRowManager().getRows()[index]; 
        console.log(row);
        this.sequenceSVG.append("svg:text")
            .attr("x", x)
            .attr("y", y)
            .text(row.getRowData().getSequence())
            .attr("font-face", "Monaco")
            .attr("kerning", "auto")
            .attr("font-size", 25);
        this.sequenceSVG.append("svg:text")
            .attr("x", x)
            .attr("y", y + 25)
            .text(row.getRowData().getOppositeSequence())
            .attr("font-face", "Monaco")
            .attr("font-size", 25);
    },


    renderFeatures: function(){
    },

    renderLine: function(x1, y1, x2, y2){
        this.lines.append("svg:line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke", "lightgray");
    },
    clean: function(){
        console.log(d3.select("#annotationViz"));
        d3.select("#annotationViz").remove(); 
        this.lines = this.annotateSVG.append("svg:g")
            .attr("id", "annotationViz");

        this.sequenceSVG = this.annotateSVG.append("svg:g")
            .attr("id", "sequenceSVG");
    },
});
