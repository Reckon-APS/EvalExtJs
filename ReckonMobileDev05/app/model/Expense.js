Ext.define('RM.model.Expense', {
    extend: 'Ext.data.Model',    	
    config: {
		idProperty: 'ExpenseClaimID',
        fields: ['AccountsPayableCategoryID', { name: 'Balance', type: 'float' }, { name: 'ClaimAmount', type: 'float' }, { name: 'ClaimDate', type: 'date', dateFormat: 'c' }, 'ClaimNumber', 'ContactID', 'ContactName', 'CustomerName', 'ExpenseClaimID', { name: 'HasAttachments', type: 'bool' }, 'Notes', 'ProjectName', 'ProjectPath', 'Reference', 'Status', { name: 'UnbilledAmount', type: 'float' }]
    }
});		
