Ext.define('RM.store.CustomerInvoices', {
    extend: 'RM.store.RmBaseStore',
    config: {
        model: 'RM.model.CustomerInvoice',
		groupField: 'GroupName'
    }
});
