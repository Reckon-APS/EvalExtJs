Ext.define('RM.store.Items', {
    extend: 'RM.store.RmBaseStore',
    config: {
        model: 'RM.model.Item',
		groupField: 'ItemsGroupName'
    }
});