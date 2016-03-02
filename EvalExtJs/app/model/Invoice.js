Ext.define('RM.model.Invoice', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'InvoiceId',
        fields: ['InvoiceId', 'DuePeriodName', 'CustomerName', 'CustomerEmail', 'InvCode', { name: 'DueDate', type: 'date', dateFormat: 'c' }, { name: 'Amount', type: 'float' }, { name: 'Balance', type: 'float' }, { name:'DueDays', type: 'int'}, 'Status']
    }
});