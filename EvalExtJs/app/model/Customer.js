Ext.define('RM.model.Customer', {
    extend: 'Ext.data.Model',    	
    config: {
		idProperty: 'CustomerId',
        fields: ['CustomerId', 'Name'],
    }
});	