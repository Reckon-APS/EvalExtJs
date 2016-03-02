Ext.define('RM.store.CashBooks', {
    extend: 'RM.store.RmBaseStore',		
    config: {
        model: 'RM.model.CashBook',
		groupField: 'GroupName'
    }
});