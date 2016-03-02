Ext.define('RM.model.GSTCode', {
	extend: 'Ext.data.Model',
	config: {
	    idProperty: 'GSTCodeId',
	    fields: ['GSTCodeId', 'GSTCode', 'ShortDescription', { name: 'Rate', type: 'float'}]
	}	
});