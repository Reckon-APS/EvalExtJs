Ext.define('RM.model.ItemType', {
	extend: 'Ext.data.Model',
	config: {
	    idProperty: 'ItemType',
	    fields: [{name: 'ItemType', type: 'int'}, 'Name', { name: 'Status', type: 'int'}]
	}	
});