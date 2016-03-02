Ext.define('RM.model.Term', {
	extend: 'Ext.data.Model',
	config: {
	    idProperty: 'TermID',
	    fields: ['CashbookID', 'TermName', 'TermDescription', { name: 'DiscountPerc', type: 'float' },{ name: 'DiscountAmount', type: 'float' }, 'IsSelected']
	}	
});