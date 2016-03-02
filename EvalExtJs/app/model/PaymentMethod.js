Ext.define('RM.model.PaymentMethod', {
    extend: 'Ext.data.Model',    	
    config: {
		idProperty: 'PaymentMethodId',
        fields: ['PaymentMethodId', 'Description']
    }
});