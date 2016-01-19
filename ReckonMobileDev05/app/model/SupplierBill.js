Ext.define('RM.model.SupplierBill', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'SupplierId',
        fields: ['SupplierId', 'GroupName', 'SupplierName', { name: 'BillCount', type: 'int' }, { name: 'BillOverdueCount', type: 'int' }]
    }
});