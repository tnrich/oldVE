    Ext.define('Vede.view.tools.ReverseTranslate', {
    extend: 'Ext.window.Window',
    id: 'ReverseTranslate',
    alias: 'widget.ReverseTranslate',
    cls: 'tasksmonitorwindow',
    width: 400,
    title: 'Reverse Translate',
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
            cls: 'organismSelector',
            fieldLabel: '<b>Organism:</b>',
            labelCls: 'organism-label',
            editable: false,
            labelSeparator: ' ',
            labelWidth: 110,
            width:350,
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
            text : 'Reverse Translate',
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

				        var organism = this.up().query('combobox[cls="organismSelector"]')[0].rawValue;

				        var fr = new FileReader();
				        
				        var that = this;

				        function processFile() {
				            console.log(fr.result);

				            var messageBox = Ext.MessageBox.wait(
				                "Executing Reverse Translate...",
				                "Waiting for the server"
				            );

				            pFasta = fr.result;
				            var seq = pFasta.replace('\n',"<line-break>");

				            Ext.Ajax.request({
				                url: Teselagen.manager.SessionManager.buildUrl("genedesign/reverse_translate", ''),
				                method: 'POST',
				                params: {
				                    dna: seq,
				                    organism: organism
				                },
				                success: function (response) {
				                    responseObject = JSON.parse(response.responseText);
				                    messageBox.close();
				                    console.log(responseObject);
									Ext.create('Ext.window.Window',{
								        items: [{
								            xtype: 'textarea',
								            value: response.responseText,
								            width: 500,
								            height:200
								        }]
									}).show();
				                },
				                failure: function(response, opts) {
				                    Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
				                    messageBox.close();
				                    Ext.MessageBox.alert('Failed','Failed');
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
