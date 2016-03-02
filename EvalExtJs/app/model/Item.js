Ext.define('RM.model.Item', {
    extend: 'Ext.data.Model',    
    config: {
		idProperty: 'ItemId',
		fields: ['ItemId', 'Name', 'ItemPath', { name: 'Level', type: 'int' }, 'ItemsGroupName', { name: 'SalePrice', type: 'float' }, { name: 'UnitPriceExTax', type: 'float' }, 'SaleTaxCodeId', 'SalesDescription', 'PurchaseDescription', 'PurchasePrice', 'PurchaseTaxCodeId']
    }
});