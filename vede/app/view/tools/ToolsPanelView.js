    Ext.define('Vede.view.tools.ToolsPanelView', {
    extend: 'Ext.window.Window',
    id: 'toolsPanelView',
    alias: 'widget.ToolsPanelView',
    cls: 'tasksmonitorwindow',
    width: 400,
    title: 'Tools',
    items: [
		{
			xtype: 'filefield',
			margin: '10 0 5 100',
			validateOnChange: false,
			padding: 0,
			height: 23,
			width: 250,
			allowBlank: false,
			hideLabel: false,
			labelWidth: 10,
			preventMark: false,
			buttonOnly: false,
			buttonText: '<b>Choose File</b>',
			fieldLabel: '<b style="margin-left:-100px">Input file:</b>',
			buttonConfig: {
				stlye: {
					paddingTop: '0px !important'
				}
			}
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
            queryMode: 'local',
            valueField: 'organismValue',
            value: 'yeast',
            displayField: 'organismName',
			store: new Ext.data.ArrayStore({
				fields: ['organismName'],
				data: [
					['Drosophila_melanogaster'],
					['Mycoplasma_genitalium'],
					['Bacillus_subtilis'],
					['Escherichia_coli'],
					['oryza_sativa'],
					['Caenorhabditis_elegans'],
					['Flat'],
					['Saccharomyces_cerevisiae'],
					['Cglut'],
					['Homo_sapiens'],
					['Standard'],
					['Deinococcus_radiodurans'],
					['Mycoplasma_genitalium'],
					['yeast']
				]
			})
        },
        {
            xtype: 'button',
            text : 'Juggle Codon',
            margin: '2.5 0 2.5 0',
            height: 40,
            border: 0,
            listeners: {
		        click: {
		            fn: function(field){

		            	var fileDom = this.up().down('filefield').extractFileInput();

		            	if(!fileDom.files[0]) return Ext.Msg.alert('Error', 'Select input file');

						if(!fileDom.files[0].name.match(/^.*\.(fas|FAS|fasta|FASTA)$/))
						{
							return Ext.Msg.alert('Error', 'Only FAS files allowed');
						}

				        var algorithm = this.up().query('combobox[cls="algorithmSelector"]')[0].rawValue;
				        var organism = this.up().query('combobox[cls="organismSelector"]')[0].rawValue;

				        var fr = new FileReader();
				        
				        var that = this;

				        function processFile() {
				            console.log(fr.result);

				            var messageBox = Ext.MessageBox.wait(
				                "Executing Codon Juggling...",
				                "Waiting for the server"
				            );

				            pFasta = fr.result;
				            var headers = pFasta.match(/>(.+)/g);
				            var seq = pFasta.match(headers[0]+'\n(.+)')[1]

				            Ext.Ajax.request({
				                url: Teselagen.manager.SessionManager.buildUrl("genedesign/codon_optimize", ''),
				                method: 'GET',
				                params: {
				                    dna: seq,
				                    algorithm: algorithm,
				                    organism: organism
				                },
				                success: function (response) {
				                    response = JSON.parse(response.responseText);
				                    messageBox.close();
				                    console.log(response);
									Ext.create('Ext.window.Window',{
								        items: [{
								            xtype: 'textarea',
								            value: response.response,
								            width: 200,
								            height:100
								        }]
									}).show();
				                },
				                failure: function(response, opts) {
				                    Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
				                    messageBox.close();
				                    Ext.MessageBox.alert('Failed','Conversion failed');
				                }
				            }); 

				        }

				        fr.onload = processFile;
				        fr.readAsText(fileDom.files[0]);
		            }
		        },
            }
        }
    ]
});
