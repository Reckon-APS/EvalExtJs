Ext.define('RM.model.History', {
    extend: 'Ext.data.Model',    	
    config: {
		idProperty: 'HistoryId',
        fields: ['HistoryId', 'UserName', 'Text', {name:'Date', type:'date', dateFormat: 'c'}, 'HistoryItemType' ]
    }
});		
