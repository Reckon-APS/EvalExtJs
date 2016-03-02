Ext.define('RM.model.AccountingCategory', {
	extend: 'Ext.data.Model',
	config: {
	    idProperty: 'AccountingCategoryId',
	    fields: ['AccountingCategoryId', 'Name', 'DefaultTaxGroupId', 'AccountType', 'Description']
	}	
});