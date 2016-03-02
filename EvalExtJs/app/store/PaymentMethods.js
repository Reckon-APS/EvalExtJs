Ext.define('RM.store.PaymentMethods', {
    extend: 'RM.store.RmBaseStore',
    config: {
        model: 'RM.model.PaymentMethod',
        pageSize: 100
    }
});