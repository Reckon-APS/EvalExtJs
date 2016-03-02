Ext.define('RM.model.BankAccount', {
    extend: 'Ext.data.Model',    	
    config: {
		idProperty: 'BankAccountId',
        fields: ['BankAccountId', 'Description']
    }
});