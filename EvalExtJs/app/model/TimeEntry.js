Ext.define('RM.model.TimeEntry', {
    extend: 'Ext.data.Model',	    
    config: {
		idProperty: 'TimeEntryId',
        fields: ['TimeEntryId', 'PeriodName', {name:'Duration', type:'float'}, 'PeriodMins', 'CustomerName', 'ProjectName', {name:'Date', type:'date', dateFormat: 'c'}, 'ItemName', {name:'Duration', type:'float'}, {name:'Billable', type:'bool'}, 'Status']
    }
});		