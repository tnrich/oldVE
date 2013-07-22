Ext.define("Teselagen.manager.PrintManager", {
    alias: "PrintManager",
	singleton: true,
    
	printStyleSheet: null,
	SequenceAnnotationManager: null,
	pxPerInch: 96, //Assumption; subject to change.
	
	getPrintStyleSheet: function() {
		var styleSheets = document.styleSheets;
		var printStyleSheets = new Array();
		for(var i=0;i<styleSheets.length;i++) {
			if(styleSheets[i].media.mediaText=="print") printStyleSheets.push(styleSheets[i]);
		}
		if(printStyleSheets.length<1) console.error("ERROR: No print style sheets.");
		else if(printStyleSheets.length>1) console.error("ERROR: Too many print style sheets.");
		else this.printStyleSheet = printStyleSheets[0];
	},
	
	/**
	 * Removes all CSS rules in this.printStyleSheet that match
	 * the selector texts.
	 * 
	 * @param {String(s)} arguments The selector text to use.
	 */
	removeRules: function() {
		this.getPrintStyleSheet();
		for(var i=0;i<arguments.length;i++) {
			var selector = arguments[i];
			var indicesToRemove = new Array();
			for(var j=0;j<this.printStyleSheet.cssRules.length;j++) {
				if(selector==this.printStyleSheet.cssRules[j].selectorText) indicesToRemove.push(j);
			}
			for(var j=indicesToRemove.length-1;j>=0;j--) {
				this.printStyleSheet.deleteRule(indicesToRemove[j]);
			}
		}
	},
	
	printCircularView: function() {
		this.getPrintStyleSheet();
		
		var startShown = true;
        var pieContainer = Ext.getCmp("mainAppPanel").getActiveTab().down("component[cls='PieContainer']");
        var railContainer = Ext.getCmp("mainAppPanel").getActiveTab().down("component[cls='RailContainer']");
        if(pieContainer.el.getStyle("display") === "none") {
            pieContainer.show();
            railContainer.hide();
			startShown = false;
		}

        var pieManager = Vede.application.getController("VectorEditor.PieController").pieManager;
        pieManager.removeZoom();

		var bBox = d3.select('.pieParent').node().getBBox();
		var svg = d3.select(".pieParent");
        var transformValues = svg.attr("transform").match(/[-.\d]+/g);
        
        var pieWidth = bBox.width * transformValues[0];
        var pieHeight = bBox.height * transformValues[3];
		
//      var pieWidth = document.getElementById('Pie').width.animVal.value;
//      var pieHeight = document.getElementById('Pie').height.animVal.value;
        
        var pxPerInch = this.getPxPerInch();
        var pageWidthInches = 8.5;
        var pageHeightInches = 11;
        var marginInches = 0.5;
        
        var innerPageWidthPx = (pageWidthInches-2*marginInches)*pxPerInch;
        var innerPageHeightPx = (pageHeightInches-2*marginInches)*pxPerInch;
        
        var widthRatio = innerPageWidthPx/pieWidth;
        var heightRatio = innerPageHeightPx/pieHeight;
        var scaleFactor = 1;
        if(widthRatio>heightRatio) scaleFactor = heightRatio;
        else scaleFactor = widthRatio;        
        scaleFactor = 'transform: scale('+scaleFactor+','+scaleFactor+')';
        
        this.printStyleSheet.addRule('@page', 'size: '+pageWidthInches+'in '+pageHeightInches+'in');
        this.printStyleSheet.addRule('@page', 'margin: '+marginInches+'in');
        
        this.printStyleSheet.addRule('.x-viewport','height: '+(pageHeightInches-2*marginInches)+'in');
        this.printStyleSheet.addRule('.x-viewport','width: '+(pageWidthInches-2*marginInches)+'in');
        
        this.printStyleSheet.addRule('body', 'visibility: hidden');
        this.printStyleSheet.addRule('body', 'overflow: visible');
        this.printStyleSheet.addRule('body','height: '+(pageHeightInches-2*marginInches)+'in');
        this.printStyleSheet.addRule('body','width: '+(pageWidthInches-2*marginInches)+'in');
        
        // I don't know if 'addRule' works for all browsers.
        this.printStyleSheet.addRule('.Pie', 'visibility: visible');
        this.printStyleSheet.addRule('.Pie', 'overflow: visible');
        this.printStyleSheet.addRule('.Pie', 'position: fixed');
        this.printStyleSheet.addRule('.Pie', 'left: 0in');
        this.printStyleSheet.addRule('.Pie', 'top: 0in');
        
        this.printStyleSheet.addRule('.Pie', scaleFactor);
        this.printStyleSheet.addRule('.Pie', '-ms-'+scaleFactor);
        this.printStyleSheet.addRule('.Pie', '-webkit-'+scaleFactor);
        this.printStyleSheet.addRule('.Pie', '-o-'+scaleFactor);
        this.printStyleSheet.addRule('.Pie', '-moz-'+scaleFactor);
        
        this.printStyleSheet.addRule('.Pie', 'left: '+((pageWidthInches-2*marginInches)/2-pieWidth/pxPerInch/2)+'in');
        
        this.printStyleSheet.addRule('.pieSelection', 'display: none');
        this.printStyleSheet.addRule('.pieWireframeElement', 'display: none');
        this.printStyleSheet.addRule('.pieCaret', 'display: none');
        

        window.print();
        if(!startShown) {
            pieContainer.hide();
            railContainer.show();
    	}

        pieManager.restoreZoom();
        this.removeRules('.Pie','@page','.x-viewport','body','.pieSelection','.pieWireframeElement','.pieCaret');
	},	
	
	printLinearView: function() {
		this.getPrintStyleSheet();

		var startShown = true;
        var pieContainer = Ext.getCmp("mainAppPanel").getActiveTab().down("component[cls='PieContainer']");
        var railContainer = Ext.getCmp("mainAppPanel").getActiveTab().down("component[cls='RailContainer']");
        if(railContainer.el.getStyle("display") === "none") {
		//if(document.getElementById('PieContainer').style.display=='none') {
            railContainer.show();
            pieContainer.hide();
			startShown = false;
		}

		var railManager = Vede.application.getController("VectorEditor.RailController").railManager;
        railManager.removeZoom();
		
		var bBox = d3.select('.railParent').node().getBBox();
		var svg = d3.select(".railParent");
        var transformValues = svg.attr("transform").match(/[-.\d]+/g);
        
        var railWidth = bBox.width * transformValues[0];
        var railHeight = bBox.height * transformValues[3];
        
        var pxPerInch = this.getPxPerInch();
        var pageWidthInches = 8.5;
        var pageHeightInches = 11;
        var marginInches = 0.5;
        
        var innerPageWidthPx = (pageWidthInches-2*marginInches)*pxPerInch;
        var innerPageHeightPx = (pageHeightInches-2*marginInches)*pxPerInch;
        
        var widthRatio = innerPageWidthPx/railWidth;
        var heightRatio = innerPageHeightPx/railHeight;
        var scaleFactor = 1;
        if(widthRatio>heightRatio) scaleFactor = heightRatio;
        else scaleFactor = widthRatio;        
        scaleFactor = 'transform: scale('+scaleFactor+','+scaleFactor+')';
        
        // I don't know if 'addRule' works for all browsers.
        this.printStyleSheet.addRule('@page', 'size: '+pageWidthInches+'in '+pageHeightInches+'in');
        this.printStyleSheet.addRule('@page', 'margin: '+marginInches+'in');
        
        this.printStyleSheet.addRule('.x-viewport','height: '+(pageHeightInches-2*marginInches)+'in');
        this.printStyleSheet.addRule('.x-viewport','width: '+(pageWidthInches-2*marginInches)+'in');
        
        this.printStyleSheet.addRule('body', 'visibility: hidden');
        this.printStyleSheet.addRule('body', 'overflow: visible');
        this.printStyleSheet.addRule('body','height: '+(pageHeightInches-2*marginInches)+'in');
        this.printStyleSheet.addRule('body','width: '+(pageWidthInches-2*marginInches)+'in');
        
        this.printStyleSheet.addRule('.Rail', 'visibility: visible');
        this.printStyleSheet.addRule('.Rail', 'overflow: visible');
        this.printStyleSheet.addRule('.Rail', 'position: fixed');
        this.printStyleSheet.addRule('.Rail', 'left: 0in');
        this.printStyleSheet.addRule('.Rail', 'top: 0in');
        
        this.printStyleSheet.addRule('.Rail', scaleFactor);
        this.printStyleSheet.addRule('.Rail', '-ms-'+scaleFactor);
        this.printStyleSheet.addRule('.Rail', '-webkit-'+scaleFactor);
        this.printStyleSheet.addRule('.Rail', '-o-'+scaleFactor);
        this.printStyleSheet.addRule('.Rail', '-moz-'+scaleFactor);
        
        this.printStyleSheet.addRule('.Rail', 'left: '+((pageWidthInches-2*marginInches)/2-railWidth/pxPerInch/2)+'in');

        this.printStyleSheet.addRule('.railSelection', 'display: none');
        this.printStyleSheet.addRule('.railWireframeElement', 'display: none');
        this.printStyleSheet.addRule('.railCaret', 'display: none');
        
        window.print();
        if(!startShown) {
            railContainer.hide();
            pieContainer.show();
    	}

        railManager.restoreZoom();
        this.removeRules('.Rail','@page','.x-viewport','body','.railSelection','.railWireframeElement','.railCaret');
	},
	
	printSequenceView: function() {
		this.getPrintStyleSheet();				
		
        var pxPerInch = this.getPxPerInch();
        var pageWidthInches = 8.5;
        var pageHeightInches = 11;
        var marginInches = 0.5;
        var innerPageWidthPx = (pageWidthInches-2*marginInches)*pxPerInch;
        var innerPageHeightPx = (pageHeightInches-2*marginInches)*pxPerInch;
                
        var oldBpPerRow = this.SequenceAnnotationManager.bpPerRow;
        // Calculate the BP's per row, rounded to the nearest 10.
        // This calculation of BP per row uses the screen default and assumes
        // that the desired BP per row is the maximum that can fit on the page.
        var bpPerRow = Math.floor((innerPageWidthPx) / 10 / 10 ) * 10;               
        
		this.SequenceAnnotationManager.setBpPerRow(bpPerRow);
		this.SequenceAnnotationManager.render();
        
		var seqWidth = d3.select('.annotateSVG').node().width.animVal.value;
		var seqHeight = d3.select('.annotateSVG').node().height.animVal.value;	
				
		// I don't know if 'addRule' works for all browsers.
        this.printStyleSheet.addRule('@page', 'size: '+pageWidthInches+'in '+pageHeightInches+'in');
        this.printStyleSheet.addRule('@page', 'margin: '+marginInches+'in');
        
        this.printStyleSheet.addRule('.x-viewport','height: '+(seqHeight / pxPerInch)+'in');
        this.printStyleSheet.addRule('.x-viewport','width: '+(seqWidth / pxPerInch)+'in');
        
        this.printStyleSheet.addRule('body', 'visibility: hidden');
        this.printStyleSheet.addRule('body', 'overflow: visible');
        this.printStyleSheet.addRule('body','height: '+(seqHeight / pxPerInch)+'in');
        this.printStyleSheet.addRule('body','width: '+(seqWidth / pxPerInch)+'in');
        
        this.printStyleSheet.addRule('.annotateSVG', 'visibility: visible');
        this.printStyleSheet.addRule('.annotateSVG', 'overflow: visible');
        this.printStyleSheet.addRule('.annotateSVG', 'position: fixed');
        this.printStyleSheet.addRule('.annotateSVG', 'left: 0in');
        this.printStyleSheet.addRule('.annotateSVG', 'top: 0in');
		
        this.printStyleSheet.addRule('.annotateSVG', 'left: '+((pageWidthInches-2*marginInches)/2-seqWidth/pxPerInch/2)+'in');
        
		this.printStyleSheet.addRule('.selectionSVG','display: none');
		this.printStyleSheet.addRule('.caretSVG','display: none');
		
        window.print();
		
		this.removeRules('.annotateSVG','@page','.x-viewport','body','.selectionSVG','.caretSVG');
		this.SequenceAnnotationManager.setBpPerRow(oldBpPerRow);
		this.SequenceAnnotationManager.render();
	},
	
	sequenceViewConfig: function(SequenceAnnotationManager) {
		this.SequenceAnnotationManager = SequenceAnnotationManager;
	},
	
	getPxPerInch: function() {
		var div = document.createElement('div');
		div.style.width = '1in';
		document.body.appendChild(div);		
		var px = div.offsetWidth;
		document.body.removeChild(div);
		return px;
	}
});







