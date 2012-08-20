describe('viewport test', function () {
	var vp;
	beforeEach(function() {
		setFixtures(sandbox());
		Ext.application({
		    name: 'MyApp',
		    launch: function() {
		        Ext.define('MyView', {
		           extend: 'Ext.container.Container',
		           initComponent: function() {
		               this.callParent();
		               this.renderTo = 'sandbox';
		           }
		        });
		        Ext.create('MyView', {
		            items: {
		                html: 'My App'
		            }
		        });
		    }
		});
	});
	it("Sandbox exists", function () {
		expect(Ext.get("sandbox")).toBeTruthy();
	});
});
