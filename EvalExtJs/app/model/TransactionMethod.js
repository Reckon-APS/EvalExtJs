Ext.define('RM.model.TransactionMethod', {
    extend: 'Ext.data.Model',    	
    config: {
		idProperty: 'Id',
        fields: [
            'IsCard', 
            'Name'
        ]
    }
});		