Ext.define('RM.model.InvoiceExpenseSelect', {
    extend: 'Ext.data.Model',    
    config: {
		idProperty: 'ExpenseId',
		fields: ['ExpenseId', 'CustomerName', { name: 'Date', type: 'date', dateFormat: 'c' }, { name: 'Amount', type: 'float' }, 'EmployeeName', 'ProjectName', 'Description', 'ItemId', 'ItemName', 'TaxTypeId', {name: 'Selected', type: 'bool'}]
    }
});
