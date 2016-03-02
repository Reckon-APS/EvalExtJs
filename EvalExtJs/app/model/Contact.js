Ext.define('RM.model.Contact', {
    extend: 'Ext.data.Model',    	
    config: {
		idProperty: 'ContactId',
        fields: ['ContactId', 'Description', 'FirstNameBranchName', 'SurnameBusinessName', { name: 'IsCustomer', type: 'bool' }, { name: 'IsSupplier', type: 'bool' }, { name: 'IsPerson', type: 'bool' }, 'Terms']
    }
});	