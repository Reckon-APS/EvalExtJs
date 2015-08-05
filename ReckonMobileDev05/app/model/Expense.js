Ext.define('RM.model.Expense', {
    extend: 'Ext.data.Model',    	
    config: {
		idProperty: 'ClaimNumber',
		fields: ['ClaimNumber', 'PeriodName', 'ProjectName', { name: 'PeriodAmount', type: 'float' }, { name: 'ClaimDate', type: 'date', dateFormat: 'c' }, 'ItemId', 'ItemName', { name: 'ClaimAmount', type: 'float' }, 'CustomerId', 'CustomerName', 'SupplierId', 'SupplierName', 'Notes', { name: 'Billable', type: 'bool' }, { name: 'HasReceiptPhoto', type: 'bool' }, 'Status']
    }
});		
