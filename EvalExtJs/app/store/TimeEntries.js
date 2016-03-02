Ext.define('RM.store.TimeEntries', {
    extend: 'RM.store.RmBaseStore',
    config: {
        model: 'RM.model.TimeEntry',
        groupField: 'CustomerName'        
    }
});