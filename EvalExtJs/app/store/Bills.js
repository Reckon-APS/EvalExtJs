Ext.define('RM.store.Bills', {
    extend: 'RM.store.RmBaseStore',
    config: {
        model: 'RM.model.Bill',
		groupField: 'SupplierName',
        pageSize: 8
    }
});
