Ext.define('RM.model.BudgetLineItem', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'AcctCatName',
        fields: ['AcctCatName', {name:'Forecast', type:'float'}, {name:'Actual', type:'float'}]
    }
});
