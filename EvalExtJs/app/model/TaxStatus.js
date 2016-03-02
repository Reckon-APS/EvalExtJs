Ext.define('RM.model.TaxStatus', {
	extend: 'Ext.data.Model',
	config: {
	    idProperty: 'TaxStatusId',
	    fields: [{ name: 'TaxStatusId', type: 'int'}, 'Name']
	}	
});