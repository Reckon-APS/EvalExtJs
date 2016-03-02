Ext.define('RM.model.InvoiceTimeSelect', {
    extend: 'Ext.data.Model',    
    config: {
		idProperty: 'TimeEntryId',
		fields: ['TimeEntryId', 'CustomerName', { name: 'Date', type: 'date', dateFormat: 'c' }, { name: 'Duration', type: 'float' }, { name: 'HourlyRate', type: 'float' }, 'EmployeeName', 'ProjectName', 'Description', 'ItemId', 'ItemName', 'TaxTypeId', {name: 'Selected', type: 'bool'}]
    }
});