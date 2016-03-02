Ext.define('RM.store.TransactionsHistory', {
    extend: 'RM.store.RmBaseStore',
    config: {
        model: 'RM.model.TransactionHistory',
		groupField: 'Date'
    }
});