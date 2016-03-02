Ext.define('RM.model.Transaction', {
    extend: 'Ext.data.Model',    	
    config: {
		idProperty: 'PaymentTransactionId',
        fields: [
            'PaymentTransactionId', 
            'Description', 
            {name:'DiscountAmount', type:'float'},
            {name:'DiscountPercent', type:'float'},
            {FormDate: 'DueDate', type: 'date', dateFormat: 'c' },
            {name:'Latitude', type:'float'},
            {name:'Longitude', type:'float'},
            'PayerAccountNumber', 
            'PayerName', 
            'Id', 
        	'ParentId',
            'PaymentMethodId', 
            {name:'TransactionDate', FormDate: 'TransactionDate', type: 'date', dateFormat: 'c'},
            {name:'Tax', type:'float'},
            {name:'Amount', type:'float'},
            'UserId', 
            {name:'Surcharge', type:'float'}
        ]
    }
});	