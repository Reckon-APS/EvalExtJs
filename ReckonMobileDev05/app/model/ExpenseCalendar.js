Ext.define('RM.model.ExpenseCalendar', {
    extend: 'Ext.data.Model',
    config: {
        fields: [{ name: 'Date', type: 'date' }, { name: 'HasData' }]
    }
});