Ext.define('RM.store.Invoices', {
    extend: 'RM.store.RmBaseStore',
    config: {
        model: 'RM.model.Invoice',
		groupField: 'DuePeriodName'
    }
});