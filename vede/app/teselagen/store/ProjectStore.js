Ext.define("Teselagen.store.ProjectStore", {
    requires: ["Teselagen.models.Project"],
    extend: 'Ext.data.Store',
    autoLoad: false,
    model: 'Teselagen.models.Project',
    
    listeners: {
        beforeload: function(store, operation, options) {
            //store.getProxy().url = 'data/' + operation.node.get('Path') + '/level1.json';
            Ext.getCmp('projectDesignPanel').setLoading( true );
            return true;
        },
        load: function(records,successful, eOpts){

            var dashboard = Ext.getCmp('DashboardPanel');

            console.log(dashboard);

            var self = this;

            var list = 
                Ext.create('Ext.grid.Panel', {
                    title: 'My Projects',
                    store: records,
                    columns: [
                        { text: 'Name',  dataIndex: 'ProjectName',width: 487 }
                    ],
                    height: 200,
                    width: 487,
                    renderTo: Ext.getBody(),
                    listeners: {
                        itemclick: function(view, record, item, index, e, eOpts) {

                            var id = record.raw.id;

                            console.log(id);

                            var project = self.data.items[1];
                            var designs = project.designs();

                            designs.on('load', function() {
                                designs.clearFilter();
                                Ext.getCmp('projectDesignPanel').getRootNode().removeAll();
                                designs.data.items.forEach(function(rec){
                                    Ext.getCmp('projectDesignPanel').getRootNode().appendChild({
                                        text: rec.data.DesignName,
                                        leaf: true,
                                        id: rec.data.id
                                   });
                                });

                                Ext.getCmp('projectDesignPanel').setLoading( false );
                            });
                        }
                    }
            });

            dashboard.add(list);
            dashboard.doLayout();

            var project = records.data.items[0];
            var designs = project.designs();

            designs.on('load', function() {
                designs.clearFilter();
                Ext.getCmp('projectDesignPanel').getRootNode().removeAll();
                designs.data.items.forEach(function(rec){
                    Ext.getCmp('projectDesignPanel').getRootNode().appendChild({
                        text: rec.data.DesignName,
                        leaf: true,
                        id: rec.data.id
                   });
                });

                Ext.getCmp('projectDesignPanel').setLoading( false );
            });
        }
    }
    
});

