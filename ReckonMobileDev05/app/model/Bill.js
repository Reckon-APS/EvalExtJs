Ext.define('RM.model.Bill', {
    extend: 'Ext.data.Model',    
    config: {
		idProperty: 'BillId',
		fields: ['BillId', 'SupplierId', 'DuePeriodName', 'SupplierName', 'BillNumber', { name: 'DueDate', type: 'date', dateFormat: 'c' }, { name: 'Amount', type: 'float' }, { name: 'Balance', type: 'float' }, { name: 'DueDays', type: 'int' }, 'Status']
    }
});
