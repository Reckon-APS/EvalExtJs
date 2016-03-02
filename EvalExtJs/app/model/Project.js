Ext.define('RM.model.Project', {
    extend: 'Ext.data.Model',    	
    config: {
		idProperty: 'ProjectId',
        fields: ['ProjectId', 'Name', 'ProjectGroupName', 'ProjectPath', {name:'Level', type:'int'}]
    }
});	