Ext.define('RM.store.SupplierBills', {
    extend: 'RM.store.RmBaseStore',
    config: {
        model: 'RM.model.SupplierBill',
        groupField: 'GroupName'
    }
});