Ext.define('RM.model.Project1', {
    extend: 'Ext.data.Model',    
    config: {
		idProperty: 'Id',
        fields: ['Id', 'Name', 'CustomerName']
    }
});