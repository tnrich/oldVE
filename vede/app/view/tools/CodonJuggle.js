    Ext.define('Vede.view.tools.CodonJuggle', {
    extend: 'Ext.window.Window',
    id: 'CodonJuggle',
    alias: 'widget.CodonJuggle',
    cls: 'tasksmonitorwindow',
    width: 500,
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
			hidden: true
		},
        {
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
            margin: '10 200',
            height: 30,
            width: 140,
            border: 0,
            listeners: {
		        click: {
		            fn: function(field){

		            	var seq = this.up().down('textareafield').rawValue;
		            	console.log(seq);

		    //         	if(!fileDom.files[0]) return Ext.Msg.alert('Error', 'Select input file');

						// if(!fileDom.files[0].name.match(/^.*\.(fas|FAS|fasta|FASTA)$/))
						// {
						// 	return Ext.Msg.alert('Error', 'Only FAS files allowed');
						// }

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
				                    responseObject = JSON.parse(response.responseText);
				                    messageBox.close();
				                    console.log(responseObject);
									Ext.create('Ext.window.Window',{
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
									                text: 'View Sequence',
									                margin: 2,
									                padding: 2,
									                handler: function() {
									                    // this.up('window').callback();
									                    this.up('window').close();
									                }
									            }, {
									                xtype: 'button',
									                text: 'Overwrite Sequence',
									                margin: 2,
									                padding: 2,
									                handler: function() {
									                    this.up('window').close();
									                }
									            }, {
									                xtype: 'button',
									                text: 'Create New Sequence',
									                margin: 2,
									                padding: 2,
									                handler: function() {
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
