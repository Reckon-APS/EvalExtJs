Ext.define('RM.store.InvoiceTimeSelect', {
    extend: 'RM.store.RmBaseStore',
    config: {
        model: 'RM.model.InvoiceTimeSelect',
		grouper: {groupFn: function(rec) {}}
    }
});