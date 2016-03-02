Ext.define('RM.model.Bill', {
    extend: 'Ext.data.Model',    
    config: {
		idProperty: 'BillId',
		fields: ['BillId', 'SupplierId', 'DuePeriodName', 'SupplierName', 'InvCode', { name: 'DueDate', type: 'date', dateFormat: 'c' }, { name: 'Total', type: 'float' }, { name: 'DueDays', type: 'int'}]
    }
});
