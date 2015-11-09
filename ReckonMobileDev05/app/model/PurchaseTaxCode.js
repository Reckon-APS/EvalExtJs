Ext.define('RM.model.PurchaseTaxCode', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'GSTCodeId',
        fields: ['GSTCodeId', 'GSTCode', 'ShortDescription', { name: 'Rate', type: 'float' }]
    }
});