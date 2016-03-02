Ext.define('RM.store.Transactions', {
    extend: 'RM.store.RmBaseStore',
    config: {
        model: 'RM.model.Transaction',
		grouper: {
                sortProperty: "TransactionDate",
                direction: "DESC",
                groupFn: function (item) {
                    return Ext.Date.format(item.get('TransactionDate'),'l');
                }
           },
    }
});