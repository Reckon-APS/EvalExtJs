Ext.define('RM.store.AccountingCategories', {
    extend: 'Ext.data.Store',
	config: {
		model:'RM.model.AccountingCategory',
        sorters: 'Name',
        //groupDir: 'DESC',
        groupField: 'AccountType'
    }
});