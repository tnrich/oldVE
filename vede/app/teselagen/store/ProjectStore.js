 Ext.define('User', {
     extend: 'Ext.data.Model',
     fields: [
         {name: 'id',       type: 'int'},
         {name: 'name',  type: 'string'}
     ]
 });

Ext.define("Teselagen.store.ProjectStore", {
  extend: 'Ext.data.TreeStore',
  model: 'User', //model: 'Teselagen.models.Project',
  data : [
    {id: 1, name:'Ed'}
  ]
});

/*
Ext.define("Teselagen.store.ProjectStore", {
  extend: 'Ext.data.TreeStore',
	model: 'Teselagen.models.Project',
  autoLoad: true,
  data : [
    {projectName: 'New project'},
    {projectName: 'New project 2'},
  ],
  proxy: {
    type: 'localstorage',
    id: 'ingenix-ic9expert.usernotecodes',
  },
  listeners: {
        append: function( thisNode, newChildNode, index, eOpts ) {
            if( !newChildNode.isRoot() ) {
                newChildNode.set('leaf', true);
                newChildNode.set('text', newChildNode.get('projectName'));
                //newChildNode.set('icon', newChildNode.get('profile_image_url'));
                //newChildNode.set('cls', 'demo-userNode');
                //newChildNode.set('iconCls', 'demo-userNodeIcon');
            }
        }
  },
  root: {
    expanded: true,
    text: "My Root",
    children: [
        { text: "Child 1", leaf: true },
        { text: "Child 2", expanded: true, children: [
            { text: "GrandChild", leaf: true }
        ] }
    ]
  }
});
*/