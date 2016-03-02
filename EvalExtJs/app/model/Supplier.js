Ext.define('RM.model.Supplier', {
    extend: 'Ext.data.Model',    	
    config: {
		idProperty: 'SupplierId',
        fields: ['SupplierId', 'Name'],
    }
});