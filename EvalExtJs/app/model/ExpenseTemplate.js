Ext.define('RM.model.ExpenseTemplate', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'TemplateId',
        fields: ['TemplateId', 'Name']
    }
});