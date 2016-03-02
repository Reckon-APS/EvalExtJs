Ext.define('RM.store.InvoiceExpenseSelect', {
    extend: 'RM.store.RmBaseStore',
    config: {
        model: 'RM.model.InvoiceExpenseSelect',
		grouper: {groupFn: function(rec) {}}
    }
});