Ext.define('RM.store.Expenses', {
    extend: 'RM.store.RmBaseStore',	
    config: {
        model: 'RM.model.Expense',
        groupField: 'ClaimDate'   
    }
});