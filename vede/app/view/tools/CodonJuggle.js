    Ext.define('Vede.view.tools.CodonJuggle', {
    extend: 'Ext.window.Window',
    id: 'CodonJuggle',
    alias: 'widget.CodonJuggle',
    cls: 'tasksmonitorwindow',
    width: 500,
    modal: true,
    callback: function() {},
    pack: 'center',
    buttonAlign: 'center',
    title: 'Codon Juggle',
    items: [
		// {
		// 	xtype: 'filefield',
		// 	margin: '10 0 5 100',
		// 	validateOnChange: false,
		// 	padding: 0,
		// 	height: 23,
		// 	width: 250,
		// 	allowBlank: false,
		// 	hideLabel: false,
		// 	labelWidth: 10,
		// 	preventMark: false,
		// 	buttonOnly: false,
		// 	buttonText: '<b>Choose File</b>',
		// 	fieldLabel: '<b style="margin-left:-100px">Input file:</b>',
		// 	buttonConfig: {
		// 		stlye: {
		// 			paddingTop: '0px !important'
		// 		}
		// 	}
		// },
		{
			xtype: 'textareafield',
			name: 'file',
			hidden: true
		},{
			xtype: 'textareafield',
			name: 'record',
			hidden: true
		},{
			xtype: 'textareafield',
			name: 'type',
			hidden: true
		},{
			xtype: 'displayfield',
			fieldLabel: "<b>Sequence</b>",
			labelWidth: 110,
            width:350,
            margin: '5 60',
			cls: 'cjSequenceName'
		},{
			xtype: 'displayfield',
			fieldLabel: "<b>Size(bps)</b>",
			labelWidth: 110,
            width:350,
            margin: '5 60',
			cls: 'cjSequenceSize'
		},{
            xtype: 'combobox',
            cls: 'algorithmSelector',
            fieldLabel: '<b>Algorithm:</b>',
            labelCls: 'algorithm-label',
            editable: false,
            labelSeparator: ' ',
            labelWidth: 110,
            width:350,
            margin: '10 60',
            queryMode: 'local',
            valueField: 'algorithmValue',
            value: 'balanced',
            displayField: 'algorithmName',
			store: new Ext.data.ArrayStore({
				fields: ['algorithmName'],
				data: [
					['balanced'],['high'],['most_different_sequence'],['least_different_RSCU'],['random'],

				]
			})
        },
        {
            xtype: 'combobox',
            cls: 'organismSelector',
            fieldLabel: '<b>Organism:</b>',
            labelCls: 'organism-label',
            editable: false,
            labelSeparator: ' ',
            labelWidth: 110,
            width:350,
            margin: '10 60',
            queryMode: 'local',
            valueField: 'organismValue',
            value: 'Standard',
            displayField: 'organismName',
			store: new Ext.data.ArrayStore({
				fields: ['organismName'],
				data: 
				[
					['Arabidopsis thaliana'],
					['Bacillus subtilis'],
					['Caenorhabditis elegans'],
					['Corynebacterium glutamicum'],
					['Deinococcus radiodurans'],
					['Drosophila melanogaster'],
					['Escherichia coli'],
					['Flat'],
					['Homo sapiens'],
					['Mycoplasma genitalium'],
					['Orzya sativa'],
					['Saccharomyces cerevisiae'],
					['Standard']
				]
			})
        },
        {
            xtype: 'button',
            text : 'Juggle Codon',
            margin: '10 180',
            height: 30,
            width: 140,
            border: 0,
            listeners: {
		        click: {
		            fn: function(field){

		            	var seq = this.up().down('textareafield[name="file"]').rawValue;
		            	var record = this.up().down('textareafield[name="record"]').rawValue;
		            	var type = this.up().down('textareafield[name="type"]').rawValue;
		            	console.log(seq);

				        var algorithm = this.up().query('combobox[cls="algorithmSelector"]')[0].rawValue;
				        var organism = this.up().query('combobox[cls="organismSelector"]')[0].rawValue;

				        // var fr = new FileReader();
				        
				        var that = this;

				        var messageBox = Ext.MessageBox.wait(
				                "Executing Codon Juggling...",
				                "Waiting for the server"
				        );

				        Ext.Ajax.request({
				                url: Teselagen.manager.SessionManager.buildUrl("genedesign/codon_optimize", ''),
				                method: 'POST',
				                params: {
				                    dna: seq,
				                    algorithm: algorithm,
				                    organism: organism
				                },
				                success: function (response) {
				                	Ext.getCmp("CodonJuggle").close();
				                    responseObject = JSON.parse(response.responseText);
				                    messageBox.close();
				                    console.log(responseObject);
									Ext.create('Ext.window.Window',{
    									padding: '20px',
    									title: 'Codon Juggle',
    									modal: true,
    									renderTo: Ext.getCmp("DashboardPanel").getActiveTab().down().id,
								        items: [{
									        	xtype: 'displayfield',
										        hideLabel: true,
										        value: 'Sequence successfully juggled. What would you like to do?'
								        	},{
									            xtype: 'container',
									            layout: {
									                type: 'hbox'
									            },
									            flex: 1,
									            items: [{
									                xtype: 'button',
									                text: 'Overwrite Sequence',
									                margin: 10,
            										height: 30,
									            	flex: 1,
									                padding: 2,
									                handler: function() {
									                    var success ={};
									                	success.responseObject = responseObject;
									                	success.type = type;
									                	success.record = record;
									                	Vede.application.fireEvent(Teselagen.event.ProjectEvent.CREATE_SEQUENCE_JUGGLE, success);
									                    this.up('window').close();
									                }
									            }, {
									                xtype: 'button',
									                text: 'Create New Sequence',
            										height: 30,
									                margin: '10 20',
									            	flex: 1,
									                padding: 2,
									                handler: function() {
									                	var success ={};
									                	success.responseObject = responseObject;
									                	success.type = type;
									                	success.record = record;
									                	Vede.application.fireEvent(Teselagen.event.ProjectEvent.CREATE_SEQUENCE_JUGGLE, success);
									                	this.up('window').close();
									                }
									            }]
									        }, {
								            xtype: 'textarea',
								            hidden: true,
								            value: response.responseText,
								            width: 500,
								            height:200
								        }]
									}).show();
				                },
				                failure: function(response, opts) {
				                    Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
				                    messageBox.close();
				                    Ext.MessageBox.alert('Failed','Conversion failed');
				                }
				            }); 

				     //    function processFile() {
				     //        console.log(fr.result);

				     //        var messageBox = Ext.MessageBox.wait(
				     //            "Executing Codon Juggling...",
				     //            "Waiting for the server"
				     //        );

				     //        pFasta = fr.result;
				     //        // var seq = pFasta.replace('\n',"<line-break>");

				     //        Ext.Ajax.request({
				     //            url: Teselagen.manager.SessionManager.buildUrl("genedesign/codon_optimize", ''),
				     //            method: 'POST',
				     //            params: {
				     //                dna: seq,
				     //                algorithm: algorithm,
				     //                organism: organism
				     //            },
				     //            success: function (response) {
				     //                responseObject = JSON.parse(response.responseText);
				     //                messageBox.close();
				     //                console.log(responseObject);
									// Ext.create('Ext.window.Window',{
								 //        items: [{
								 //            xtype: 'textarea',
								 //            value: response.responseText,
								 //            width: 500,
								 //            height:200
								 //        }]
									// }).show();
				     //            },
				     //            failure: function(response, opts) {
				     //                Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
				     //                messageBox.close();
				     //                Ext.MessageBox.alert('Failed','Conversion failed');
				     //            }
				     //        }); 

				     //    }

				     //    fr.onload = processFile;
				     //    fr.readAsText(fileDom.files[0]);
		            }
		        },
            }
        }
    ]
});
