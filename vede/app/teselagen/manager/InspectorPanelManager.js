Ext.define("Teselagen.manager.InspectorPanelManager", {
	
	requires: [
		/*"Teselagen.manager.DeviceDesignManager",
		"Teselagen.constants.SBOLIcons",
		"Teselagen.manager.ProjectManager",
		"Teselagen.renderer.de.BinHeaderRenderer",
		"Teselagen.renderer.de.PartRenderer",
		"Teselagen.constants.Constants",*/
		//"Teselagen.manager.GridManager"
	],
    
	singleton: true,
	
	CHECKBOX_PATH: "m 12.422921920903956,21.69326672316384 3.7247776271186446,2.6650521468926556 " +
			"5.487490225988701,-7.533494858757063 2.129943502824859,1.2905570056497175 " +
			"-7.19774011299435,9.652945819209041 -5.445520790960452,-3.777239604519774 z",
	
	inspectorGridData: [],
	
	inspectorGridColgroup: null,
	inspectorGridCol: null,
	
	inspectorGrid: null,
	inspectorGridTbody: null,
	inspectorGridTr: null,
	inspectorGridTd: null,
	inspectorGridCellDiv: null,
	inspectorGridCellDsfCheckBox: null,
	
	inspectorGridInputDisplayed: false,
	selectedInspectorGridRow: null,
	
	//>> Make the selected bin be selected on the inspector panel.
	refreshInspectorGrid: function() {
		var me = Teselagen.manager.InspectorPanelManager;
		var gridManager = Teselagen.manager.GridManager;
		
		me.createInspectorGridData();
		
		gridManager.checkj5Ready();
		
		me.inspectorGrid = d3.select(gridManager.currentTab.el.dom).select(".inspectorGrid");
		
		//d3.select(".inspectorGrid table").selectAll("*").remove();
		
		me.inspectorGrid.select("div.x-grid-view").selectAll("*").remove();
			
		me.inspectorGridTable = me.inspectorGrid.select("div.x-grid-view")
			.append("table")
			.attr("class", "x-grid-table x-grid-with-col-lines x-grid-with-row-lines")
			.attr("border", 0)
			.attr("cellspacing", 0)
			.attr("cellpadding", 0)
			.style("width", "800px");
		
		//me.inspectorGridColgroup = d3.select(".inspectorGrid table").selectAll("colgroup")
		me.inspectorGridColgroup = me.inspectorGridTable.selectAll("colgroup")
			.data(d3.range(8))
			.enter()
			.append("colgroup");
		
		me.inspectorGridCol = me.inspectorGridColgroup
			.append("col")
			.style("width", "100px");
		
		//me.inspectorGridTbody = d3.select(".inspectorGrid table").append("tbody");
		me.inspectorGridTbody = me.inspectorGridTable.append("tbody");
		
		me.inspectorGridTr = me.inspectorGridTbody.selectAll("tr")
	        .data(me.inspectorGridData)
	        .enter()
	        .append("tr")
	        .attr("inspectorGridTrIndex", function(d, i) {return i;})
	        .attr("class", "inspectorGridTr")
	        .style("height", "31px")
	        .style("background-color", function(d, i) {
	        	return i % 2 ? "rgb(250, 250, 250)" : null;
	        })
	        .on("mouseover", function(d, i) {//background-color: #F8F8F8 on mouseover
	        	
	        })
	        .on("mouseout", function(d, i) {
	        	
	        })
			.on("click", function(d, i) {
				var selection = d3.select(this);
				me.selectedInspectorGridRow = selection;
				
				me.inspectorGrid.selectAll(".inspectorGridTr")
					.style("background-color", function(dr, ir) {
						return ir % 2 ? "rgb(250, 250, 250)" : null;
					})
					.selectAll("div")
					.style("font-weight", 500);
					
				selection.style("background-color", "#E0E3E6")
					.selectAll("div")
					.style("font-weight", 600);
				
				gridManager.selectBinHeader(gridManager.grid.selectAll(".gridBinHeaderSVG").filter(function(dr, ir) {return ir==i;}).node());
				
				//>> Get the scrolling figured out.
				d3.select(gridManager.currentTab.el.dom)
					.select(".designGrid")
					.property("scrollLeft", function() {
						var scrollLeft = parseInt(d3.select(this).property("scrollLeft"));
						var colPos = i*gridManager.COLUMN_WIDTH;
						var frameWidth = parseInt(d3.select(this).property("offsetWidth"));
						if(colPos<scrollLeft+10) {
							return colPos;
						} else if (colPos>scrollLeft+frameWidth-10) {
							return colPos+20+gridManager.COLUMN_WIDTH-frameWidth;
						} else {
							return scrollLeft;
						}
					})
					.property("scrollTop", 0);
					//.style("font-weight", 600);
				/*
				d3.selectAll(".inspectorGridTr")
					.selectAll("td")
					.style("border-right", null);
				
				selection.selectAll("td")
					.style("border-right", "#1px solid rgb(202, 206, 209)");
				*/
			});
		
		me.inspectorGridTd = me.inspectorGridTr.selectAll("td")
	        .data(function(d) {return d;})
	        .enter()
	        .append("td")
	        .attr("inspectorGridTdIndex", function(d, i) {return i;})
	        .attr("class", "inspectorGridTd")
			.style("padding", "5px")
	        .style("overflow", "hidden")
	        .on("dblclick", function(d, i) {
	        	//>> Add something here to do something if 'i' is some value.
	        	if(i>1 && i<5) return;
	        	var selection = d3.select(this);
	        	me.inspectorGridInputDisplayed = true;
	        	if(i===0 || i===5) {
		        	selection.select("div").style("display", "none"); 	
		        	selection.select("input").style("display", "inline");	        	
		        	d3.select("body").on("click", function() {
		        		selection.select("input").style("display", "none");
		        		selection.select("div").style("display", "inline");
		        		if(me.inspectorGridInputDisplayed==false) return;
		        		var inputValue = selection.select("input").property("value");
		        		var rowIndex = parseInt(d3.select(selection.node().parentNode).attr("inspectorGridTrIndex"));
		        		var newValue = me.validateInspectorGridDataInput(inputValue, i, rowIndex);
		        		if(newValue===false) {
		        			selection.select("input").property("value", d);
		        			me.inspectorGridInputDisplayed = false;
		        		} else {
		        			selection.select("div").text(inputValue);
		        			if(i==0) {
		        				if(d!==newValue) {
			        				Teselagen.manager.GridCommandPatternManager.addCommand({
			        		        	type: "BIN",
			        		        	data: {
			        		        		type: "RENAME",
			        		        		x: rowIndex,
			        		        		oldName: d,
			        		        		newName: newValue
			        		        	}
			        				});
		        				}
			        			gridManager.collectionData[rowIndex].binName = newValue;
			        		} else if(i===5) {
			        			gridManager.collectionData[rowIndex].fro = newValue;
			        		}
			        		//>> Replace with more efficient way.
			        		gridManager.removeGrid();
			        		gridManager.renderGrid();
			        		me.inspectorGridInputDisplayed = false;
		        		}
		        		
		        	});
	        	} else if(i===1) {
		        	selection.style("padding", "0px");
		        	selection.select("div").style("display", "none"); 	
		        	
	        		var directionStore = Ext.create('Ext.data.Store', {
	                    fields: ['name'],
	                    data : [{name: "Forward"}, {name: "Reverse"}]
	                });
	                var directionEditingComboBox = Ext.create("Ext.form.ComboBox", {
		    			store: directionStore,
		    			displayField: "name",
		    			valueField: "name",
		    			renderTo: selection.node(),
		    			editable: false,
		    			forceSelection: true,
		    			width: 100,
		    			value: d,
		    		});
	                directionEditingComboBox.show();
	                directionEditingComboBox.el.on("click", function(e) {
		        		e.stopPropagation();
		        	});
	                directionEditingComboBox.el.on("dblclick", function(e) {
		        		e.stopPropagation();
		        	});
	                var rowIndex = parseInt(d3.select(selection.node().parentNode).attr("inspectorGridTrIndex"));
	                d3.select("body").on("click", function() {
			        	selection.style("padding", "5px");
		        		selection.select("div").style("display", "inline");
		        		if(me.inspectorGridInputDisplayed==false) return;
		        		var value = directionEditingComboBox.getValue();
		        		
		        		if(gridManager.collectionData[rowIndex].directionForward !== (value==="Forward")) {
			        		Teselagen.manager.GridCommandPatternManager.addCommand({
					        	type: "BIN",
					        	data: {
					        		type: "DIR",
					        		x: rowIndex,
					        		data: value!=="Forward"
					        	}
							});
		        		}
		        		
		        		directionEditingComboBox.destroy();
		        		gridManager.collectionData[rowIndex].directionForward = value==="Forward";
		        		selection.select("div").text(value);
		        		
		        		//>> Replace with more efficient way.
		        		gridManager.removeGrid();
		        		gridManager.renderGrid();
	                	me.inspectorGridInputDisplayed = false;
	                	
	                });
	        	}
	        	
	        	
	        	/*
	        	 else if(i==1) {
			        			if(newValue=="Forward") gridManager.collectionData[rowIndex].directionForward = true;
			        			else if(newValue=="Reverse") gridManager.collectionData[rowIndex].directionForward = false;
			        		}
	        	 */
	        });
		
		me.inspectorGridCellDiv = me.inspectorGridTd
			.append("div")
			.text(function(d) {return d;})
			.style("font-family", "Maven Pro")
			.style("font-size", "12px")
			.style("font-weight", 500)
	        .style("overflow", "hidden")
	        .style("padding", "3px 6px 4px 6px")
	        .style("white-space", "nowrap")
			.style("text-overflow", "ellipsis");
		
		me.inspectorGridCellTextInputs = me.inspectorGridTd
			.append("input")
			.attr("type", "text")
			.style("width", "100%")
			.style("display", "none")
			.property("value", function(d) {return d;})
			.attr("autocomplete", "off")
			.attr("hidefocus", "true")
			.attr("aria-invalid", "false")
			.attr("class","x-form-field x-form-text x-form-focus x-field-form-focus x-field-default-form-focus")
			.on("click", function() {d3.event.stopPropagation();});
			//.on("dblclick", function() {d3.event.stopPropagation();});
		
		me.inspectorGridTd.filter(function(d, i) {return i==4;})
			.style("text-align", "center")
			.style("vertical-align", "middle")
			.select("div")
			.remove();
		
		//>> Replace later with something that looks better.
		me.inspectorGridCellDsfCheckBox = me.inspectorGridTd
			.filter(function(d, i) {return i==4;})
			.append("input")
			.attr("type", "checkbox")
			.attr("autocomplete", "off")
			.attr("hidefocus", "true")
			.attr("aria-invalid", "false")
			.property("checked", function(d) {return d;})
			.on("change", function(d, i) {
				var rowIndex = parseInt(d3.select(this.parentNode.parentNode).attr("inspectorGridTrIndex"));
				Teselagen.manager.GridCommandPatternManager.addCommand({
		        	type: "BIN",
		        	data: {
		        		type: "DSF",
		        		x: rowIndex,
		        		data: gridManager.collectionData[rowIndex].dsf
		        	}
				});
				gridManager.collectionData[rowIndex].dsf = d3.select(this).property("checked");
				
				//>> Replace with more efficient way.
        		gridManager.grid.remove();
        		gridManager.renderGrid();
			});
		
	},
	
	createInspectorGridData: function() {
		var me = Teselagen.manager.InspectorPanelManager;
		var gridManager = Teselagen.manager.GridManager;
		me.inspectorGridData = [];
		for(var i=0;i<gridManager.collectionData.length;i++) {
			me.inspectorGridData[i] = new Array();
			me.inspectorGridData[i][0] = gridManager.collectionData[i].binName;
			if(gridManager.collectionData[i].directionForward==false) me.inspectorGridData[i][1] = "Reverse";
			else me.inspectorGridData[i][1] = "Forward";
			var numOfItems = 0;
			for(var j=0;j<gridManager.collectionData[i].parts.length;j++) {
				if(gridManager.collectionData[i].parts[j].phantom!=true) numOfItems++;
			}
			me.inspectorGridData[i][2] = numOfItems;
			
			//>> Not 100% sure about next two lines.
			if(gridManager.collectionData[i].fases) me.inspectorGridData[i][3] = gridManager.collectionData[i].fases[0];
			else me.inspectorGridData[i][3] = "None";
			me.inspectorGridData[i][4] = gridManager.collectionData[i].dsf || false;
			me.inspectorGridData[i][5] = gridManager.collectionData[i].fro || "";
			//>> Not really sure about next two lines.
			me.inspectorGridData[i][6] = gridManager.collectionData[i].extra5PrimeBps || "";
			me.inspectorGridData[i][7] = gridManager.collectionData[i].extra3PrimeBps || "";
		}
	},
	
	validateInspectorGridDataInput: function(value, i, rowIndex) {
		var me = Teselagen.manager.InspectorPanelManager;
		var gridManager = Teselagen.manager.GridManager;
		if(i===0) { // Column Name
			if(!value || value===null) return false;
			value = Ext.String.trim(value);
			if(value === "") return false;
			if(!Teselagen.utils.FormatUtils.isLegalName(value)) {
                console.warn("Illegal name " + value + ". Name can only contain alphanumeric characters, underscore (_), and hyphen (-). Removing non-alphanumerics.");
				value = Teselagen.utils.FormatUtils.reformatName(value);
				value = Ext.String.trim(value);
				if(value === "") return false;
			}
			for(var j=0;j<gridManager.collectionData.length;j++) {			
				if(gridManager.collectionData[j].binName===value && j!==rowIndex) {
					Ext.MessageBox.show({
		                title: 'Error',
		                msg: 'Column name already exists. Please choose a unique column name. Reverting to old name.',
		                buttons: Ext.MessageBox.OK,
		                icon:Ext.MessageBox.ERROR
		            });
					return false;
				}
			}
			return value;
		} else if(i===5) { // FRO	//The validation may be incorrect.
			if(!value || value===null) return false;
			value = Ext.String.trim(value);
			if(value === "") return false;
			if(!Teselagen.utils.FormatUtils.isLegalName(value)) {
                console.warn("Illegal name " + value + ". Name can only contain alphanumeric characters, underscore (_), and hyphen (-). Removing non-alphanumerics.");
				value = Teselagen.utils.FormatUtils.reformatName(value);
				value = Ext.String.trim(value);
				if(value === "") return false;
			}
			return value;
		}
		
		/*else if(i===1) {
			value = Ext.String.trim(value);
			if(value==="Forward"||value==="Reverse") return value;
			return false;
//			if(!value) return false;
//			return value=="Forward"||value=="Reverse";
		}*/ //>> Update the following commented out section of code later.
		/*else if (i>4) {
			if(!value) return false;
			if(value.length==0) return true;
			if(value.charAt(0)=="-") value = value.substr(1);
			if(/^[0-9]+$/.test(value)) return true;
			return false;
		}*/
	},
	
	selectInspectorGridRowByIndex: function(index) {
		var me = Teselagen.manager.InspectorPanelManager;
		var gridManager = Teselagen.manager.GridManager;
		var selection = me.inspectorGrid.selectAll(".inspectorGridTr")
			.filter(function(d, i) {return i==index;});
				
		me.selectedInspectorGridRow = selection;
		
		me.inspectorGrid.selectAll(".inspectorGridTr")
			.style("background-color", function(dr, ir) {
				return ir % 2 ? "rgb(250, 250, 250)" : null;
			})
			.selectAll("div")
			.style("font-weight", 500);
		
		selection.style("background-color", "#E0E3E6")
			.selectAll("div")
			.style("font-weight", 600);
		
		
		me.inspectorGrid.select(".x-grid-view")
			//.property("scrollLeft", 0)
			.property("scrollTop", function() {
				var scrollTop = me.inspectorGrid.select(".x-grid-view").property("scrollTop");
				var rowPos = index*31;
				var frameHeight = me.inspectorGrid.select(".x-grid-view").property("clientHeight");
				if(rowPos<=scrollTop) {
					return rowPos;
				} else if (rowPos>=scrollTop+frameHeight) {
					return rowPos-frameHeight+31;
				} else {
					return scrollTop;
				}
			});
	},
	
	
	eugeneRulesGridData: [],
	
	eugeneRulesGrid: null,
	
	selectedEugeneRulesGridRow: null,
	eugeneRulesGridInputDisplayed: false,
	
	createEugeneRulesGridData: function() {
		var me = Teselagen.manager.InspectorPanelManager;
		var gridManager = Teselagen.manager.GridManager;
		for(var i=0;i<gridManager.rulesData.length;i++) {
			me.eugeneRulesGridData[i] = new Array();
			me.eugeneRulesGridData[i][0] = gridManager.rulesData[i].name;
			//>>! Change to name of operand later.
			me.eugeneRulesGridData[i][1] = gridManager.rulesData[i].operand1_id;
			me.eugeneRulesGridData[i][2] = gridManager.rulesData[i].negationOperator;
			me.eugeneRulesGridData[i][3] = gridManager.rulesData[i].compositionalOperator;
			if(gridManager.rulesData[i].operand2isNumber) me.eugeneRulesGridData[i][4] = gridManager.rulesData[i].operand2Number;
			else me.eugeneRulesGridData[i][4] = gridManager.rulesData[i].operand2_id;
		}
	},
	
	getPartEugeneRulesGridData: function(partId) {
		var me = Teselagen.manager.InspectorPanelManager;
		var gridManager = Teselagen.manager.GridManager;
		var partEugeneRules = gridManager.getPartEugeneRulesDataByPartId(partId);
		var partEugeneRulesGridData = []
		for(var i=0;i<partEugeneRules.length;i++) {
			partEugeneRulesGridData[i] = new Array();
			partEugeneRulesGridData[i][0] = partEugeneRules[i].name;
			//>>! Change to name of operand later.
			partEugeneRulesGridData[i][1] = partEugeneRules[i].operand1_id;
			partEugeneRulesGridData[i][2] = partEugeneRules[i].negationOperator;
			partEugeneRulesGridData[i][3] = partEugeneRules[i].compositionalOperator;
			if(partEugeneRules[i].operand2isNumber) {
				partEugeneRulesGridData[i][4] = {
					operand2: partEugeneRules[i].operand2Number,
					operand2isNumber: partEugeneRules[i].operand2isNumber
				};
			} else {
				partEugeneRulesGridData[i][4] = {
					operand2: partEugeneRules[i].operand2_id,
					operand2isNumber: partEugeneRules[i].operand2isNumber
				};
			}
		}
		return partEugeneRulesGridData;
	},
	
	refreshEugeneRulesGridForPart: function(partId) {
		var me = Teselagen.manager.InspectorPanelManager;
		var gridManager = Teselagen.manager.GridManager;
		
		var partEugeneRules = me.getPartEugeneRulesGridData(partId);
		
		me.eugeneRulesGrid = d3.select(gridManager.currentTab.el.dom).select(".eugeneRulesGrid");
		
		me.eugeneRulesGrid.select("div.x-grid-view").selectAll("*").remove();
		
		me.eugeneRulesGridTable = me.eugeneRulesGrid.select("div.x-grid-view")
			.append("table")			
			.attr("class", "x-grid-table x-grid-with-col-lines x-grid-with-row-lines")
			.attr("border", 0)
			.attr("cellspacing", 0)
			.attr("cellpadding", 0)
			.style("width", "500px");
		
		me.eugeneRulesGridColgroup = me.eugeneRulesGridTable.selectAll("colgroup")
			.data(d3.range(5))
			.enter()
			.append("colgroup");
		
		me.eugeneRulesGridCol = me.eugeneRulesGridColgroup
			.append("col")
			.style("width", "100px");
		
		me.eugeneRulesGridTbody = me.eugeneRulesGridTable.append("tbody");
				
		me.eugeneRulesGridTr = me.eugeneRulesGridTbody.selectAll("tr")
	        .data(partEugeneRules)
	        .enter()
	        .append("tr")
	        .attr("eugeneRulesGridTrIndex", function(d, i) {return i;})
	        .attr("class", "eugeneRulesGridTr")
	        .style("height", "31px")
	        .style("background-color", function(d, i) {
	        	return i % 2 ? "rgb(250, 250, 250)" : null;
	        })
	        .on("click", function(d, i) {		
				var selection = d3.select(this);
				me.selectedEugeneRulesGridRow = selection;
				
				d3.selectAll(".eugeneRulesGridTr")
					.style("background-color", function(dr, ir) {
						return ir % 2 ? "rgb(250, 250, 250)" : null;
					});
				
				selection.style("background-color", "#E0E3E6");				
			});
		
		me.eugeneRulesGridTd = me.eugeneRulesGridTr.selectAll("td")
	        .data(function(d) {return d;})
	        .enter()
	        .append("td")
	        .attr("eugeneRulesGridTdIndex", function(d, i) {return i;})
	        .attr("class", "eugeneRulesGridTd")
			.style("padding", "5px")
	        .style("overflow", "hidden")
	        .on("dblclick", function(d, i) {
	        	var selection = d3.select(this);
	        	me.eugeneRulesGridInputDisplayed = true;
	        	if(i==0) { // Name
	        		selection.select("div").style("display", "none"); 	
		        	selection.select("input").style("display", "inline");
		        	d3.select("body").on("click", function() {
		        		selection.select("input").style("display", "none");
		        		selection.select("div").style("display", "inline");
		        		if(me.eugeneRulesGridInputDisplayed===false) return;
		        		me.eugeneRulesGridInputDisplayed = false;
		        		var selectedRow = d3.select(selection.node().parentNode);
		        		if(selectedRow[0][0]!==null) {
		        			var inputValue = selection.select("input").property("value");
		        			var selectedRule = gridManager.getEugeneRuleByName(selectedRow.datum()[0]);
		        			var oldName = selectedRule.name;
		        			var newValue = me.validateEugeneRuleName(inputValue, oldName);
			        		if(newValue===false) {			        			
				        		//selection.select("div").text(oldName);
				        		selection.select("input").property("value", d);    		
			        		} else {
				        		selection.select("div").text(newValue);
				        		selectedRule.name = newValue;
				        		
				        		//>> Replace with more efficient way.
				        		gridManager.removeGrid();
				        		gridManager.renderGrid();
			        		}
		        		}
		        	});
	        	} else if(i==3) { // Operator
		        	selection.style("padding", "0px");
		        	selection.select("div").style("display", "none");
		        	var operatorEditingComboBox = Ext.create("Ext.form.ComboBox", {
		    			store: Teselagen.constants.Constants.COMPOP_LIST,
		    			renderTo: selection.node(),
		    			editable: false,
		    			width: 100,
		    			value: d,
		    		});
		        	operatorEditingComboBox.show();
		        	operatorEditingComboBox.el.on("click", function(e) {
		        		e.stopPropagation();
		        	});
		        	operatorEditingComboBox.el.on("dblclick", function(e) {
		        		e.stopPropagation();
		        	});
		        	d3.select("body").on("click", function() {		        		
		        		if(me.eugeneRulesGridInputDisplayed===false) return;
		        		me.eugeneRulesGridInputDisplayed = false;
		        		var selectedRow = d3.select(selection.node().parentNode);
		        		if(selectedRow[0][0]!==null) {
		        			selection.style("padding", "5px");
			        		selection.select("div")
			        			.style("display", "inline")
			        			.text(operatorEditingComboBox.getValue());
		        			
			        		var selectedRule = gridManager.getEugeneRuleByName(selectedRow.datum()[0]);
			        		var newOp = operatorEditingComboBox.getValue();
			        		operatorEditingComboBox.destroy();	
			        		if(newOp!="MORETHAN") {
			        			selectedRule.compositionalOperator = newOp;
			        			selectedRule.operand2isNumber = false;
			        			selectedRule.operand2Number = 0;
			        		} else {
			        			selectedRule.compositionalOperator = newOp;
			        			selectedRule.operand2isNumber = true;
			        			selectedRule.operand2_id = null;
			        			selectedRule.operand2Number = 0;
			        		}		        		
			        		gridManager.updatePartsWithRules();
			        		gridManager.removeGrid();
			        		gridManager.renderGrid();
			        		me.refreshEugeneRulesGridForPart(partId);
		        		}
		        	});
	        	} else if(i==4) { // Operand 2
	        		selection.style("padding", "0px");
		        	selection.select("div").style("display", "none");	        		
	        		if(d.operand2isNumber) {
	        			var op2NumField = Ext.create("Ext.form.Number", {
			    			renderTo: selection.node(),
			    			editable: true,
			    			width: 100,
			    			value: d.operand2,
			    			minValue: 0,
			    			//>>? maxValue ?
			    		});
	        			
	        			op2NumField.show();
	        			op2NumField.el.on("click", function(e) {
			        		e.stopPropagation();
			        	});
	        			op2NumField.el.on("dblclick", function(e) {
			        		e.stopPropagation();
			        	});
			        	d3.select("body").on("click", function() {
			        		if(me.eugeneRulesGridInputDisplayed===false) return;
			        		me.eugeneRulesGridInputDisplayed = false;
			        		var selectedRow = d3.select(selection.node().parentNode);
			        		if(selectedRow[0][0]!==null) {
				        		selection.style("padding", "5px");
				        		selection.select("div")
				        			.style("display", "inline")
				        			.text(op2NumField.getValue());
				        		
				        		var selectedRule = gridManager.getEugeneRuleByName(selectedRow.datum()[0]);
				        		selection.datum().operand2 = op2NumField.getValue();
				        		selectedRule.operand2Number = op2NumField.getValue();
				        		
				        		op2NumField.destroy();
			        		}
			        	});	
	        		} else {
	        			var operand1Id = d3.select(this.parentNode).datum()[1];
		        		var partsStore = [];
		                for(var i=0;i<gridManager.totalColumns;i++) {
		        			for(var j=0;j<gridManager.totalRows;j++) {
		        				if(operand1Id!==gridManager.collectionData[i].parts[j].id) {
		        					partsStore.push({
		        						id: gridManager.collectionData[i].parts[j].id,
		        						name: gridManager.collectionData[i].parts[j].name
	        						});
		        				}
		        			}
		                }
		                partsStore = Ext.create('Ext.data.Store', {
		                    fields: ['id', 'name'],
		                    data : partsStore
		                });		                
		                var op2EditingComboBox = Ext.create("Ext.form.ComboBox", {
			    			store: partsStore,
			    			displayField: "name",
			    			valueField: "id",
			    			renderTo: selection.node(),
			    			editable: false,
			    			forceSelection: true,
			    			width: 100,
			    			value: d.operand2,
			    		});
		                op2EditingComboBox.show();
		                op2EditingComboBox.el.on("click", function(e) {
			        		e.stopPropagation();
			        	});
		                op2EditingComboBox.el.on("dblclick", function(e) {
			        		e.stopPropagation();
			        	});
			        	d3.select("body").on("click", function() {
			        		if(me.eugeneRulesGridInputDisplayed===false) return;
			        		me.eugeneRulesGridInputDisplayed = false;
			        		var selectedRow = d3.select(selection.node().parentNode);
			        		if(selectedRow[0][0]!==null) {
				        		selection.style("padding", "5px");
				        		selection.select("div")
				        			.style("display", "inline")
				        			.text(op2EditingComboBox.getRawValue());
				        		var selectedRule = gridManager.getEugeneRuleByName(selectedRow.datum()[0]);
				        		selection.datum().operand2 = op2EditingComboBox.getValue();
				        		selectedRule.operand2_id = op2EditingComboBox.getValue();
				        		op2EditingComboBox.destroy();
				        		gridManager.updatePartsWithRules();
				        		gridManager.removeGrid();
				        		gridManager.renderGrid();
			        		}
			        	});
	        		}            
	        	}
	        });
		//Teselagen.manager.InspectorPanelManager.refreshEugeneRulesGridForPart(Teselagen.manager.GridManager.selectedGridPart.datum().id)
		me.eugeneRulesGridCellDiv = me.eugeneRulesGridTd
			.append("div")
			.text(function(d, i) {
				if(i==1) {
					return gridManager.getPartNameFromPartId(d);
				} else if(i==4) {
					if(d.operand2isNumber) return d.operand2;
					else return gridManager.getPartNameFromPartId(d.operand2);					
				}
				return d;
			})
			.style("font-family", "Maven Pro")
			.style("font-size", "12px")
			.style("font-weight", 500)
	        .style("overflow", "hidden")
	        .style("padding", "3px 6px 4px 6px")
	        .style("white-space", "nowrap")
			.style("text-overflow", "ellipsis");
		
		me.eugeneRulesGridCellTextInputs = me.eugeneRulesGridTd
			.filter(function(d, i) {return i==0;})
			.append("input")
			.attr("type", "text")
			.style("width", "100%")
			.style("display", "none")
			.property("value", function(d) {return d;})
			.attr("autocomplete", "off")
			.attr("hidefocus", "true")
			.attr("aria-invalid", "false")
			.attr("class","x-form-field x-form-text x-form-focus x-field-form-focus x-field-default-form-focus")
			.on("click", function() {d3.event.stopPropagation();});
		
		me.eugeneRulesGridTd.filter(function(d, i) {return i==2;})
			.style("text-align", "center")
			.style("vertical-align", "middle")
			.select("div")
			.remove();
		
		//>> Replace later with something that looks better.
		me.eugeneRulesGridCellNotCheckBox = me.eugeneRulesGridTd
			.filter(function(d, i) {return i==2;})
			.append("input")
			.attr("type", "checkbox")
			.attr("autocomplete", "off")
			.attr("hidefocus", "true")
			.attr("aria-invalid", "false")
			.property("checked", function(d) {return d;})
			.on("change", function(d, i) {
				var selectedRule = gridManager.getEugeneRuleByName(d3.select(this.parentNode.parentNode).datum()[0]);       		
				selectedRule.negationOperator = d3.select(this).property("checked");
				gridManager.updatePartsWithRules();
        		gridManager.removeGrid();
        		gridManager.renderGrid();
        		me.refreshEugeneRulesGridForPart(partId);
			});
		
		/*var operatorEditingComboBox = Ext.create("Ext.form.ComboBox", {
			store: Teselagen.constants.Constants.COMPOP_LIST
		});*/
		
		/*me.eugeneRulesGridCellOperatorComboBox = me.eugeneRulesGridTd
			.filter(function(d, i) {return i==3;})
			.append(operatorEditingComboBox.getEl());*/
		
		//Teselagen.constants.Constants.COMPOP_LIST
			/*
			.append("input")
			.attr("type", "checkbox")
			.attr("autocomplete", "off")
			.attr("hidefocus", "true")
			.attr("aria-invalid", "false")
			.property("checked", function(d) {return d;});
			 */
	},
	
	validateEugeneRuleName: function(newValue, oldValue) {
		var gridManager = Teselagen.manager.GridManager;		
		if(!newValue || newValue===null) return false;
		newValue = Ext.String.trim(newValue);
		if(newValue === "") return false;
		if(!Teselagen.utils.FormatUtils.isLegalName(newValue)) {
            console.warn("Illegal name " + newValue + ". Name can only contain alphanumeric characters, underscore (_), and hyphen (-). Removing non-alphanumerics.");
			newValue = Teselagen.utils.FormatUtils.reformatName(newValue);
			newValue = Ext.String.trim(newValue);
			if(newValue === "") return false;
		}
		if(oldValue===newValue) return false;
		var rules = gridManager.rulesData;
		for(var i=0;i<rules.length;i++) {
			if(rules[i].name===newValue) {
				Ext.MessageBox.show({
	                title: 'Error',
	                msg: 'Rule name already exists. Please choose a unique rule name. Reverting to old name.',
	                buttons: Ext.MessageBox.OK,
	                icon:Ext.MessageBox.ERROR
	            });
				return false;
			}
		}
		return newValue;
	},
	
	
	refreshPlasmidGeometry: function() {
		var gridManager = Teselagen.manager.GridManager;
		if(gridManager.deviceDesignData.j5collection.isCircular) {
			gridManager.inspector.down("*[cls='plasmid_geometry']").setValue({"plasmidtype": "circular"});
		} else {
			gridManager.inspector.down("*[cls='plasmid_geometry']").setValue({"plasmidtype": "linear"});
		}
	},
	
	
	
	
	
	
	
	/*
	// For utility purposes, delete later.
	temSvgPathResizeUtil: function(multByFactor) {
		s = "169.14286,295.36217 50.71428,36.28571 74.71429,-102.57143 29,17.57143 -98,131.42857 -74.14286,-51.42857";
		var a = s.split(/[ ,]+/);
		var r = "";
		for(var i=0;i<a.length;i++) {
			var x = parseFloat(a[i])*multByFactor;
			if(i%2) r += ","+x;
			else r += " "+x;
		}
		return r;
	},*/
});

















