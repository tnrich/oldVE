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
			margin: '10 0 0 25',
			validateOnChange: false,
			padding: 0,
			height: 23,
			allowBlank: false,
			hideLabel: false,
			labelWidth: 10,
			preventMark: false,
			buttonOnly: false,
			buttonText: '<b>Choose File</b>',
			buttonConfig: {
				stlye: {
					paddingTop: '0px !important'
				}
			}
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
				                    dna: seq
				                },
				                success: function (response) {
				                    response = JSON.parse(response.responseText);
				                    messageBox.close();
				                    console.log(response);
				                    Ext.MessageBox.alert('Success',response.response);
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
