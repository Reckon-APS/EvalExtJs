Ext.define('RM.model.Expense', {
    extend: 'Ext.data.Model',    	
    config: {
		idProperty: 'ExpenseClaimId',
        fields: ['AccountsPayableCategoryId', { name: 'Balance', type: 'float' }, { name: 'ClaimAmount', type: 'float' }, { name: 'ClaimDate', type: 'date', dateFormat: 'c' }, 'ClaimNumber', 'ContactId', 'ContactName', 'CustomerName', 'ExpenseClaimId', { name: 'HasAttachments', type: 'bool' }, 'Notes', 'ProjectName', 'ProjectPath', 'Reference', 'Status', { name: 'UnbilledAmount', type: 'float' }]
    }
});		
