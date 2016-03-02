Ext.define('RM.store.Projects', {
    extend: 'RM.store.RmBaseStore',
    config: {
        model: 'RM.model.Project',
		groupField: 'ProjectGroupName'
    }
});