Ext.define('RM.model.TransactionHistory', {
    extend: 'Ext.data.Model', 
    config: {
		idProperty: 'Id',
        fields: [
            'Id', 
            {name:'TransactionHistoryTypeId', type:'int'},
            {name:'StatusBeforeId', type:'int'},
            {name:'StatusAfterId', type:'int'},
            {FormDate: 'Date', type: 'date', dateFormat: 'c' },
            'Destination', 
            'Notes'
        ]
    }
});	
