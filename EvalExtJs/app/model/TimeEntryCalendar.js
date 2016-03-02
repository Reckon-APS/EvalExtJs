Ext.define('RM.model.TimeEntryCalendar', {
    extend: 'Ext.data.Model',	
    config: {
        fields: [{ name: 'Date', type: 'date'}, { name: 'HasData' }]
    }
});	