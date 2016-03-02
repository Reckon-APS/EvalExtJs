Ext.define('RM.store.BankAccounts', {
    extend: 'RM.store.RmBaseStore',
    config: {
        model: 'RM.model.BankAccount',
        pageSize: 100
    }
});