Ext.define('RM.model.CustomerInvoice', {
    extend: 'Ext.data.Model',    	
    config: {
		idProperty: 'CustomerId',
        fields: ['CustomerId', 'GroupName', 'CustomerName', {name:'InvoiceCount', type:'int'}, {name:'InvoiceOverdueCount', type:'int'}]
    }
});