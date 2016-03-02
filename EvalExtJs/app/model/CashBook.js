Ext.define('RM.model.CashBook', {
    extend: 'Ext.data.Model',   
    config: {
		idProperty: 'CashBookId',
        fields: ['CashBookId', 'GroupName', 'OrgName', 'BookName', 'Access', 'ColorCode', 'StatusText']
    }
});		
